// Baut die App aus src/ zusammen.
//   dist/public/   – Version für den eigenen Server (Docker): Schriften lokal, Speicherung über /api/plan
//   dist/artifact.html – Seite mit Google Fonts (z. B. für claude.ai-Artifacts), lädt dist/vendor/* bei Bedarf
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = f => readFileSync(join(root, 'src', f), 'utf8');

const head = src('head.html');
const css = src('base.css') + src('extra.css');
const body = src('body.html').trimEnd();
const app = src('app.js').trimEnd();
const i18n = src('i18n-en.js').trimEnd() + '\n' + src('i18n.js').trimEnd();
if (!head.includes('<!--FONTS-->')) throw new Error('head.html braucht den Platzhalter <!--FONTS-->');

const page = (fonts, boot = '') =>
  head.replace('<!--FONTS-->', fonts + boot) +
  '<style>\n' + css + '</style>\n' + body + '\n<script>\n' + i18n + '\n</script>\n<script>\n' + app + '\n</script>\n</body>\n</html>\n';

const google =
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap">\n';

const RANGES = {
  latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'
};
const fontCss = [400, 500, 600, 700, 800].flatMap(w => Object.entries(RANGES).map(([s, r]) =>
  `@font-face{font-family:'Hanken Grotesk';font-style:normal;font-display:swap;font-weight:${w};` +
  `src:url(./hanken-grotesk-${s}-${w}-normal.woff2) format('woff2');unicode-range:${r}}`)).join('\n') + '\n';

const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'public', 'fonts'), { recursive: true });

writeFileSync(join(dist, 'artifact.html'), page(google));
writeFileSync(join(dist, 'public', 'index.html'),
  page('<link rel="stylesheet" href="fonts/fonts.css">\n<link rel="icon" href="favicon.svg" type="image/svg+xml">\n', '<script>window.SV_SERVER=true</script>\n'));
writeFileSync(join(dist, 'public', 'fonts', 'fonts.css'), fontCss);
for (const f of readdirSync(join(root, 'src', 'fonts'))) copyFileSync(join(root, 'src', 'fonts', f), join(dist, 'public', 'fonts', f));
copyFileSync(join(root, 'src', 'favicon.svg'), join(dist, 'public', 'favicon.svg'));
for (const dir of [join(dist, 'public', 'vendor'), join(dist, 'vendor')]) {
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(join(root, 'src', 'vendor'))) copyFileSync(join(root, 'src', 'vendor', f), join(dir, f));
}

console.log('gebaut: dist/public/index.html, dist/artifact.html');
