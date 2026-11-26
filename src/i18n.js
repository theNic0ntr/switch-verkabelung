/* Sprache: Deutsch (Quelltext) oder Englisch.
   Die App erzeugt ihre Texte auf Deutsch. Ist Englisch gewählt, übersetzt dieser Teil jeden Text,
   der in der Seite erscheint (auch später eingefügte), dazu PDF, CSV und SVG-Export.
   Gesucht wird erst der ganze Text, dann mit Platzhaltern für Zahlen {n} und Namen in „…“ {q},
   zuletzt Stück für Stück an „ · “ und „ – “. Unbekanntes bleibt, wie es ist (z. B. Gerätenamen). */
(()=>{
const KEY='switch-verkabelung-lang';
let lang='de';
try{const v=localStorage.getItem(KEY);lang=v==='en'||v==='de'?v:(/^de\b/i.test(navigator.language||'de')?'de':'en')}catch(_){}
const D=window.I18N_EN||{};
const cache=new Map();
const hasWord=/[A-Za-zÄÖÜäöüß]/;
const has=k=>Object.prototype.hasOwnProperty.call(D,k);
/* Zahlen englisch schreiben: 2,5 → 2.5 und 1.000 → 1,000 */
const num=v=>/^\d+,\d{1,2}$/.test(v)?v.replace(',','.'):/^\d{1,3}\.\d{3}$/.test(v)?v.replace('.',','):v;
function one(core){
  core=core.replace(/\u00a0/g,' ');
  if(has(core))return D[core];
  const vals=[];
  const key=core.replace(/„([^“„]*)“/g,(m,q)=>{vals.push(q);return '„{q}“'}).replace(/\d+(?:[.,]\d+)*/g,m=>{vals.push(m);return '{n}'});
  if(vals.length&&Object.prototype.hasOwnProperty.call(D,key)){
    /* Reihenfolge der Platzhalter: im Schlüssel stehen Namen und Zahlen gemischt – wir füllen in Schlüsselreihenfolge */
    const order=[];key.replace(/\{[nq]\}/g,m=>{order.push(m);return m});
    const q=[],n=[];order.forEach((t,i)=>(t==='{q}'?q:n).push(vals[i]));
    /* Namen in Anführungszeichen bleiben – außer es sind Begriffe der Oberfläche wie „Hinzufügen“ */
    let qi=0,ni=0;return D[key].replace(/\{[nq]\}/g,t=>{if(t==='{q}'){const v=q[qi++]??'';return has(v)&&!/\{/.test(D[v])?D[v]:v}return num(n[ni++]??'')});
  }
  /* Vorlagen mit {x}: beliebiger Text an dieser Stelle (z. B. Geräte- oder Portnamen) */
  for(const t of XT){const m=t.re.exec(core);if(!m)continue;const g=m.slice(1),by={x:[],n:[],q:[]};t.types.forEach((ty,i)=>by[ty].push(ty==='x'?(/^\d+(?:[.,]\d+)*$/.test(g[i])?num(g[i]):tr(g[i])):ty==='n'?num(g[i]):(has(g[i])&&!/\{/.test(D[g[i]])?D[g[i]]:g[i])));
    const at={x:0,n:0,q:0};return t.en.replace(/\{([xnq])\}/g,(_,ty)=>by[ty][at[ty]++]??'')}
  return null;
}
const rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const XT=Object.keys(D).filter(k=>k.includes('{x}')).map(k=>{const types=[];const re=rx(k).replace(/„\\\{q\\\}“|\\\{x\\\}|\\\{n\\\}/g,m=>{if(m.includes('q')){types.push('q');return '„([^“„]*)“'}if(m.includes('x')){types.push('x');return '(.+?)'}types.push('n');return '(\\d+(?:[.,]\\d+)*)'});return {re:new RegExp('^'+re+'$'),types,en:D[k]}});
/* Eigene Namen (Geräte, Räume, Pläne …) werden nie übersetzt – auch wenn sie wie ein Begriff der Oberfläche heißen */
let DATA=new Set();
function setData(list){if(lang!=='en')return;const n=new Set();for(const x of list)if(x)n.add(String(x).replace(/\u00a0/g,' ').trim());if(n.size===DATA.size&&[...n].every(x=>DATA.has(x)))return;DATA=n;cache.clear()}
function tr(s){
  if(lang!=='en'||s==null)return s;s=String(s);
  if(DATA.size&&DATA.has(s.replace(/\u00a0/g,' ').trim()))return s;
  if(!hasWord.test(s)&&!/\d[.,]\d/.test(s))return s;
  if(cache.has(s))return cache.get(s);
  const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s),core=m[2];let r=one(core);
  if(r==null){for(const sep of [' · ',' – ',' — ','\n',': ',' / ',', ']){if(!core.includes(sep))continue;const parts=core.split(sep),t=parts.map(p=>tr(p));if(t.some((x,i)=>x!==parts[i])){r=t.join(sep);break}}}
  if(r==null)r=core;
  const out=m[1]+r+m[3];if(cache.size>20000)cache.clear();cache.set(s,out);return out;
}
const ATTR=['title','placeholder','aria-label','data-l','alt','label'];
const skip=el=>!el||el.closest&&el.closest('script,style,textarea,[translate="no"],[contenteditable="true"]');
function node(n){
  if(n.nodeType===3){const p=n.parentElement;if(!p||/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName)||skip(p))return;const v=n.nodeValue,t=tr(v);if(t!==v)n.nodeValue=t;return}
  if(n.nodeType!==1||skip(n))return;
  for(const a of ATTR){const v=n.getAttribute(a);if(v){const t=tr(v);if(t!==v)n.setAttribute(a,t)}}
  if(n.tagName==='INPUT'&&(n.type==='button'||n.type==='submit')&&n.value){const t=tr(n.value);if(t!==n.value)n.value=t}
}
function walk(root){if(!root)return;if(root.nodeType===3){node(root);return}if(root.nodeType!==1)return;if(skip(root))return;node(root);
  const w=document.createTreeWalker(root,5/*ELEMENT|TEXT*/,{acceptNode:x=>x.nodeType===1&&(x.getAttribute('translate')==='no'||/^(SCRIPT|STYLE|TEXTAREA)$/.test(x.tagName))?2:1});
  for(let x=w.nextNode();x;x=w.nextNode())node(x)}
/* Markup (z. B. SVG für Export und PDF) übersetzen */
function markup(str,type){if(lang!=='en'||!str)return str;try{const d=new DOMParser().parseFromString(str,type||'image/svg+xml');if(d.querySelector('parsererror'))return str;walk(d.documentElement);return new XMLSerializer().serializeToString(d)}catch(_){return str}}
function start(){
  document.documentElement.lang=lang;
  if(lang!=='en')return;
  document.title=tr(document.title);
  walk(document.body);
  new MutationObserver(recs=>{for(const r of recs){if(r.type==='childList')r.addedNodes.forEach(walk);else if(r.type==='characterData')node(r.target);else node(r.target)}})
    .observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTR});
}
window.I18N={lang,tr,markup,setData,loc:lang==='en'?'en-GB':'de-DE',set(l){try{localStorage.setItem(KEY,l)}catch(_){}location.reload()}};
start();
})();
