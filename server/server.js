'use strict';
// Kleiner Server ohne Abhängigkeiten: liefert die App aus und speichert den Plan als JSON-Datei.
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const DATA = path.resolve(process.env.DATA_DIR || path.join(__dirname, '..', 'data'));
const PUB = path.resolve(process.env.STATIC_DIR || path.join(__dirname, '..', 'dist', 'public'));
const USER = process.env.AUTH_USER || '';
const PASS = process.env.AUTH_PASSWORD || '';
const MAX = (Number(process.env.MAX_PLAN_MB) || 20) * 1024 * 1024;
const KEEP = Math.max(0, Number(process.env.BACKUPS ?? 50));
const BACKUP_EVERY = Math.max(0, Number(process.env.BACKUP_MINUTES ?? 10)) * 60e3;
const PLAN = path.join(DATA, 'plan.json');
const BK = path.join(DATA, 'backups');

if (Boolean(USER) !== Boolean(PASS)) {
  console.error('AUTH_USER und AUTH_PASSWORD müssen zusammen gesetzt werden.');
  process.exit(1);
}
if (!fs.existsSync(path.join(PUB, 'index.html'))) {
  console.error(`App nicht gefunden in ${PUB} – vorher "node scripts/build.mjs" ausführen.`);
  process.exit(1);
}
fs.mkdirSync(BK, { recursive: true });

let cur = null; // { json: string, updated: number }
try {
  cur = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
} catch (e) {
  if (e.code !== 'ENOENT') console.error('plan.json konnte nicht gelesen werden:', e.message);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json'
};
const SEC = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'"
};

const hash = s => crypto.createHash('sha256').update(String(s)).digest();
function authed(req) {
  if (!USER) return true;
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const raw = Buffer.from(h.slice(6), 'base64').toString('utf8');
  const i = raw.indexOf(':');
  if (i < 0) return false;
  const u = crypto.timingSafeEqual(hash(raw.slice(0, i)), hash(USER));
  const p = crypto.timingSafeEqual(hash(raw.slice(i + 1)), hash(PASS));
  return u && p;
}

function send(res, status, body, headers = {}) {
  const buf = body == null ? null : Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(status, {
    ...SEC,
    ...(buf && !headers['Content-Type'] ? { 'Content-Type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json' } : {}),
    ...(buf ? { 'Content-Length': buf.length } : {}),
    ...headers
  });
  res.end(buf);
}

function readBody(req) {
  return new Promise((ok, no) => {
    let size = 0;
    const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX + 4096) { no(Object.assign(new Error('zu groß'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => ok(Buffer.concat(chunks).toString('utf8')));
    req.on('error', no);
  });
}

// Schreibvorgänge nacheinander ausführen
let queue = Promise.resolve();
let lastBackup = 0;
function writePlan(obj) {
  const job = queue.then(async () => {
    if (cur && KEEP > 0 && Date.now() - lastBackup >= BACKUP_EVERY) {
      const name = 'plan-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
      await fsp.copyFile(PLAN, path.join(BK, name)).catch(() => {});
      lastBackup = Date.now();
      const files = (await fsp.readdir(BK)).filter(f => /^plan-.*\.json$/.test(f)).sort();
      for (const f of files.slice(0, Math.max(0, files.length - KEEP))) await fsp.unlink(path.join(BK, f)).catch(() => {});
    }
    const tmp = `${PLAN}.${process.pid}.tmp`;
    await fsp.writeFile(tmp, JSON.stringify(obj));
    await fsp.rename(tmp, PLAN);
    cur = obj;
  });
  queue = job.catch(() => {});
  return job;
}

async function apiPlan(req, res) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    if (!cur) return send(res, 204, null, { 'Cache-Control': 'no-store' });
    return send(res, 200, cur, { 'Cache-Control': 'no-store' });
  }
  if (req.method !== 'PUT') return send(res, 405, 'Methode nicht erlaubt', { Allow: 'GET, PUT' });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, 'JSON erwartet');
  let b;
  try { b = JSON.parse(await readBody(req)); } catch (e) { return send(res, e.status || 400, e.status ? 'Plan ist zu groß' : 'Ungültiges JSON'); }
  if (!b || typeof b.json !== 'string' || b.json.length > MAX) return send(res, 400, 'Feld "json" fehlt oder ist zu groß');
  try {
    const plan = JSON.parse(b.json);
    if (!plan || typeof plan !== 'object' || !Array.isArray(plan.devices)) throw new Error();
  } catch { return send(res, 400, 'Das ist kein Plan dieser App'); }
  if (cur && !b.force && b.base !== cur.updated) return send(res, 409, cur);
  const updated = Math.max(Date.now(), (cur ? cur.updated : 0) + 1);
  try { await writePlan({ json: b.json, updated }); } catch (e) {
    console.error('Speichern fehlgeschlagen:', e.message);
    return send(res, 500, 'Speichern fehlgeschlagen');
  }
  return send(res, 200, { updated });
}

async function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Methode nicht erlaubt', { Allow: 'GET, HEAD' });
  let rel;
  try { rel = decodeURIComponent(pathname); } catch { return send(res, 400, 'Ungültiger Pfad'); }
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.resolve(PUB, '.' + path.posix.normalize(rel));
  if (!file.startsWith(PUB + path.sep)) return send(res, 404, 'Nicht gefunden');
  try {
    const st = await fsp.stat(file);
    if (!st.isFile()) throw new Error();
    const ext = path.extname(file);
    const body = req.method === 'HEAD' ? null : await fsp.readFile(file);
    res.writeHead(200, {
      ...SEC,
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=604800'
    });
    res.end(body);
  } catch {
    send(res, 404, 'Nicht gefunden');
  }
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  try {
    if (pathname === '/healthz') return send(res, 200, 'ok', { 'Cache-Control': 'no-store' });
    if (!authed(req)) return send(res, 401, 'Anmeldung erforderlich', { 'WWW-Authenticate': 'Basic realm="Switch-Verkabelung", charset="UTF-8"' });
    if (pathname === '/api/plan') return await apiPlan(req, res);
    if (pathname.startsWith('/api/')) return send(res, 404, 'Nicht gefunden');
    return await serveStatic(req, res, pathname);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) send(res, 500, 'Interner Fehler');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Switch-Verkabelung läuft auf http://${HOST}:${PORT} – Daten in ${DATA}${USER ? ' – Anmeldung aktiv' : ''}`);
});
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    server.close(() => queue.finally(() => process.exit(0)));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
