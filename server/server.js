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
// Konten: AUTH_USER/AUTH_PASSWORD für eines, AUTH_USERS="nico:pw1,anna:pw2" (Komma oder Zeilenumbruch) für mehrere
const ACCOUNTS = new Map();
if (USER) ACCOUNTS.set(USER, PASS);
for (const part of String(process.env.AUTH_USERS || '').split(/[\n,]+/)) {
  const t = part.trim();
  if (!t) continue;
  const i = t.indexOf(':');
  if (i < 1 || i === t.length - 1) {
    console.error(`AUTH_USERS: Eintrag „${t.slice(0, 20)}“ braucht die Form name:passwort.`);
    process.exit(1);
  }
  ACCOUNTS.set(t.slice(0, i).trim().slice(0, 40), t.slice(i + 1));
}
const AUTH = ACCOUNTS.size > 0;
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
// Liefert den angemeldeten Namen, '' ohne Anmeldung, null bei falschen Zugangsdaten
function login(req) {
  if (!AUTH) return '';
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return null;
  const raw = Buffer.from(h.slice(6), 'base64').toString('utf8');
  const i = raw.indexOf(':');
  if (i < 0) return null;
  const hu = hash(raw.slice(0, i)), hp = hash(raw.slice(i + 1));
  let who = null;
  for (const [u, p] of ACCOUNTS) {
    const ok = crypto.timingSafeEqual(hu, hash(u)) & crypto.timingSafeEqual(hp, hash(p));
    if (ok && who === null) who = u;
  }
  return who;
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

function readBody(req, limit = MAX + 4096) {
  return new Promise((ok, no) => {
    let size = 0;
    const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > limit) { no(Object.assign(new Error('zu groß'), { status: 413 })); req.destroy(); return; }
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
      const files = (await fsp.readdir(BK)).filter(f => /^plan-.*\.json$/.test(f)).sort(); // benannte Versionen (named-*) bleiben
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
  const cid = typeof b.cid === 'string' && CID.test(b.cid) ? b.cid : '';
  try { await writePlan({ json: b.json, updated }); } catch (e) {
    console.error('Speichern fehlgeschlagen:', e.message);
    return send(res, 500, 'Speichern fehlgeschlagen');
  }
  send(res, 200, { updated });
  // allen anderen offenen Browsern den neuen Stand schicken
  bcast('plan', { json: b.json, updated, cid, user: req.user || '' }, cid);
}

// ---------- Live: Server-Sent Events für Planänderungen und Präsenz ----------
const LIVE = new Map(); // cid -> { res, user, p }
const CID = /^[A-Za-z0-9_-]{6,40}$/;
const sse = (res, ev, data) => { try { res.write(`event: ${ev}\ndata: ${JSON.stringify(data)}\n\n`); } catch {} };
function bcast(ev, data, except) { for (const [cid, c] of LIVE) if (cid !== except) sse(c.res, ev, data); }
const peer = (cid, c) => ({ cid, user: c.user, p: c.p });
setInterval(() => { for (const c of LIVE.values()) { try { c.res.write(': ping\n\n'); } catch {} } }, 25000).unref();

function apiLive(req, res, url) {
  if (req.method !== 'GET') return send(res, 405, 'Methode nicht erlaubt', { Allow: 'GET' });
  const cid = url.searchParams.get('cid') || '';
  if (!CID.test(cid)) return send(res, 400, 'cid fehlt');
  const old = LIVE.get(cid);
  if (old) { LIVE.delete(cid); try { old.res.end(); } catch {} }
  res.writeHead(200, { ...SEC, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no', Connection: 'keep-alive' });
  res.write('retry: 2000\n\n');
  const c = { res, user: req.user || '', p: {} };
  LIVE.set(cid, c);
  sse(res, 'hello', { cid, user: c.user, auth: AUTH, rev: cur ? cur.updated : 0, peers: [...LIVE].filter(([k]) => k !== cid).map(([k, v]) => peer(k, v)) });
  bcast('presence', peer(cid, c), cid);
  req.socket.setTimeout(0);
  req.on('close', () => { if (LIVE.get(cid) === c) { LIVE.delete(cid); bcast('leave', { cid }); } });
}

async function apiPresence(req, res) {
  if (req.method !== 'POST') return send(res, 405, 'Methode nicht erlaubt', { Allow: 'POST' });
  let b;
  try { b = JSON.parse(await readBody(req, 8192)); } catch { return send(res, 400, 'Ungültiges JSON'); }
  const c = b && LIVE.get(b.cid);
  if (!c) return send(res, 404, 'Nicht verbunden');
  if (c.user !== (req.user || '')) return send(res, 403, 'Fremde Sitzung');
  const p = b.p && typeof b.p === 'object' && !Array.isArray(b.p) ? b.p : {};
  if (JSON.stringify(p).length > 4096) return send(res, 413, 'Zu groß');
  c.p = p;
  bcast('presence', peer(b.cid, c), b.cid);
  return send(res, 204, null);
}

// Versionen: automatische Sicherungen (plan-*.json) und benannte Stände (named-*.json)
const VCACHE = new Map();
const VID = /^(plan|named)-[0-9TZ-]+\.json$/;
async function versionInfo(f) {
  if (VCACHE.has(f)) return VCACHE.get(f);
  const raw = JSON.parse(await fsp.readFile(path.join(BK, f), 'utf8'));
  let devices = 0, cables = 0;
  try { const p = JSON.parse(raw.json); devices = (p.devices || []).length; cables = (p.cables || []).length; } catch {}
  const info = { id: f, updated: raw.updated || 0, name: raw.name || '', devices, cables, named: f.startsWith('named-') };
  VCACHE.set(f, info);
  return info;
}
async function apiVersions(req, res, rest) {
  if (rest === '' && req.method === 'GET') {
    const files = (await fsp.readdir(BK)).filter(f => VID.test(f));
    const list = [];
    for (const f of files) { try { list.push(await versionInfo(f)); } catch {} }
    list.sort((a, b) => b.updated - a.updated || b.id.localeCompare(a.id));
    return send(res, 200, list, { 'Cache-Control': 'no-store' });
  }
  if (rest === '' && req.method === 'POST') {
    if (!cur) return send(res, 409, 'Noch kein Plan gespeichert');
    let b = {};
    try { b = JSON.parse((await readBody(req)) || '{}'); } catch { return send(res, 400, 'Ungültiges JSON'); }
    const name = String(b.name || '').trim().slice(0, 60);
    const f = 'named-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
    await (queue = queue.then(() => fsp.writeFile(path.join(BK, f), JSON.stringify({ ...cur, name: name || 'Gespeicherter Stand' }))).catch(() => {}));
    return send(res, 200, await versionInfo(f));
  }
  if (req.method === 'GET' && VID.test(rest)) {
    try { return send(res, 200, await fsp.readFile(path.join(BK, rest), 'utf8'), { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); }
    catch { return send(res, 404, 'Nicht gefunden'); }
  }
  if (req.method === 'DELETE' && /^named-/.test(rest) && VID.test(rest)) {
    await fsp.unlink(path.join(BK, rest)).catch(() => {});
    VCACHE.delete(rest);
    return send(res, 200, { ok: true });
  }
  return send(res, 405, 'Methode nicht erlaubt');
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
    const user = login(req);
    if (user === null) return send(res, 401, 'Anmeldung erforderlich', { 'WWW-Authenticate': 'Basic realm="Switch-Verkabelung", charset="UTF-8"' });
    req.user = user;
    if (pathname === '/api/plan') return await apiPlan(req, res);
    if (pathname === '/api/me') return send(res, 200, { user, auth: AUTH }, { 'Cache-Control': 'no-store' });
    if (pathname === '/api/live') return apiLive(req, res, new URL(req.url, 'http://x'));
    if (pathname === '/api/presence') return await apiPresence(req, res);
    if (pathname === '/api/versions' || pathname.startsWith('/api/versions/')) return await apiVersions(req, res, pathname.slice('/api/versions'.length).replace(/^\//, ''));
    if (pathname.startsWith('/api/')) return send(res, 404, 'Nicht gefunden');
    return await serveStatic(req, res, pathname);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) send(res, 500, 'Interner Fehler');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Switch-Verkabelung läuft auf http://${HOST}:${PORT} – Daten in ${DATA}${AUTH ? ` – Anmeldung aktiv (${ACCOUNTS.size} ${ACCOUNTS.size === 1 ? 'Konto' : 'Konten'})` : ''}`);
});
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    for (const c of LIVE.values()) { try { c.res.end(); } catch {} }
    LIVE.clear();
    server.close(() => queue.finally(() => process.exit(0)));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
