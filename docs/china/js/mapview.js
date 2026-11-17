/* mapview.js — builds the SVG atlas and morphs it between periods. */
import {OUTLINE,SEEDS,SEAS,RIVERS,MOUNTAINS,OUTSIDE,REGION_NAMES} from './data/geography.js';
import {PERIODS,TONES,byId} from './data/periods.js';
import {placesFor} from './data/places.js';
import * as Art from './art.js';

const NS='http://www.w3.org/2000/svg';
const el = (t,a={}) => { const n=document.createElementNS(NS,t); for(const k in a) n.setAttribute(k,a[k]); return n; };

/* ---------- geometry ---------- */
function clipHalf(poly,m,n){
  const out=[], f=p=>(p[0]-m[0])*n[0]+(p[1]-m[1])*n[1];
  for(let i=0;i<poly.length;i++){
    const a=poly[i], b=poly[(i+1)%poly.length], fa=f(a), fb=f(b);
    if(fa<=0) out.push(a);
    if((fa<0&&fb>0)||(fa>0&&fb<0)){ const t=fa/(fa-fb); out.push([a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]); }
  }
  return out;
}
const Q = v => Math.round(v*100)/100;
const CELLS = {};
for(const id of Object.keys(SEEDS)){
  let poly = OUTLINE.slice(); const s = SEEDS[id];
  for(const [o,op] of Object.entries(SEEDS)){
    if(o===id) continue;
    poly = clipHalf(poly, [(s[0]+op[0])/2,(s[1]+op[1])/2], [op[0]-s[0], op[1]-s[1]]);
    if(!poly.length) break;
  }
  const cl=[]; for(const p of poly){ const q=[Q(p[0]),Q(p[1])];
    const L=cl[cl.length-1]; if(!L||L[0]!==q[0]||L[1]!==q[1]) cl.push(q); }
  CELLS[id]=cl;
}
/* shared-edge wobble so neighbouring regions never separate */
function rnd(s){ s=(s>>>0)||1; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function hash(t){ let h=2166136261; for(const c of t){ h^=c.charCodeAt(0); h=Math.imul(h,16777619);} return h>>>0; }
const EC=new Map();
function edgePts(a,b){
  const ka=`${a[0]},${a[1]}`, kb=`${b[0]},${b[1]}`, fl=ka>kb, key=fl?`${kb}|${ka}`:`${ka}|${kb}`;
  if(!EC.has(key)){
    const [p,q]=fl?[b,a]:[a,b], r=rnd(hash(key));
    const L=Math.hypot(q[0]-p[0],q[1]-p[1])||1, st=Math.max(2,Math.round(L/26));
    const nx=-(q[1]-p[1])/L, ny=(q[0]-p[0])/L, pts=[];
    for(let i=1;i<st;i++){ const t=i/st, k=(r()-.5)*4.4*Math.sin(Math.PI*t);
      pts.push([p[0]+(q[0]-p[0])*t+nx*k, p[1]+(q[1]-p[1])*t+ny*k]); }
    EC.set(key,pts);
  }
  const m=EC.get(key); return fl?m.slice().reverse():m;
}
export function smooth(dense, close=true){
  const n=dense.length, ix = close ? i=>((i%n)+n)%n : i=>Math.max(0,Math.min(n-1,i));
  let d=`M${dense[0][0].toFixed(1)},${dense[0][1].toFixed(1)}`;
  for(let i=0;i<(close?n:n-1);i++){
    const p0=dense[ix(i-1)],p1=dense[ix(i)],p2=dense[ix(i+1)],p3=dense[ix(i+2)];
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6];
    const c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=`C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return close? d+'Z' : d;
}
function cellPath(poly){
  const dense=[]; for(let i=0;i<poly.length;i++){ const a=poly[i],b=poly[(i+1)%poly.length];
    dense.push(a); dense.push(...edgePts(a,b)); }
  return smooth(dense);
}
function centroid(poly){
  let a=0,cx=0,cy=0;
  for(let i=0;i<poly.length;i++){ const p=poly[i],q=poly[(i+1)%poly.length];
    const f=p[0]*q[1]-q[0]*p[1]; a+=f; cx+=(p[0]+q[0])*f; cy+=(p[1]+q[1])*f; }
  a*=0.5; return a? [cx/(6*a), cy/(6*a)] : SEEDS.HEN;
}
const CENT={}; for(const k in CELLS) CENT[k]=centroid(CELLS[k]);

/* ---------- build ---------- */
const L={}; let onPlace=()=>{};
export function build(onPlaceClick){
  onPlace = onPlaceClick || (()=>{});
  ['outside','regions','seas','rivers','relief','routes','wall','figures','labels','markers','fx','narrator']
    .forEach(k => L[k]=document.getElementById('layer-'+k));
  drawNarrator();

  for(const [id,o] of Object.entries(OUTSIDE)){
    const p = el('path',{d:smooth(o.pts), fill:'#EADFC8', stroke:'#A89A80','stroke-width':1.5,
      'stroke-dasharray':'7 6', id:'out-'+id, class:'outside'});
    L.outside.appendChild(p);
    const c = o.pts.reduce((a,q)=>[a[0]+q[0]/o.pts.length, a[1]+q[1]/o.pts.length],[0,0]);
    const t = el('text',{x:c[0],y:c[1],class:'rg-label'}); t.textContent=o.name;
    t.setAttribute('opacity','.6'); L.outside.appendChild(t);
  }
  for(const [id,poly] of Object.entries(CELLS)){
    L.regions.appendChild(el('path',{d:cellPath(poly), id:'rg-'+id, class:'rg',
      fill:TONES.quiet, stroke:'#2B2B2B','stroke-width':1.9,'stroke-linejoin':'round'}));
  }
  for(const s of SEAS) L.seas.appendChild(el('path',{d:smooth(s.pts), fill:'#BBD4DE', stroke:'#2B2B2B','stroke-width':1.9}));
  for(const r of RIVERS){
    L.rivers.appendChild(el('path',{d:smooth(r.pts,false), fill:'none', stroke:'#5C93A8',
      'stroke-width':3.2,'stroke-linecap':'round'}));
    if(r.label){ const t=el('text',{x:r.label[0],y:r.label[1],class:'river-label'}); t.textContent=r.name; L.rivers.appendChild(t); }
  }
  for(const m of MOUNTAINS){
    L.relief.appendChild(el('path',{d:`M${m[0]-13},${m[1]} l7,-11 l6,7 l5,-9 l8,13 Z`,
      fill:'#C3BCA6', stroke:'#7E7765','stroke-width':1.3, opacity:.55}));
  }
}

/* ---------- map figures (the hand-drawn people standing on the map) ---------- */
const FIG = {
  villager: (x,y,s)=>Art.person(x,y,s,{robe:'#8FB89C',hat:'coolie',face:'smile'}),
  scholar:  (x,y,s)=>Art.person(x,y,s,{robe:'#8FA8C4',hat:'scholar',face:'calm'}),
  emperor:  (x,y,s)=>Art.person(x,y,s,{robe:'#C3272B',hat:'crown',face:'calm'}),
  soldier:  (x,y,s)=>Art.person(x,y,s,{robe:'#9FAFC0',hat:'helmet',face:'calm'}),
  merchant: (x,y,s)=>Art.person(x,y,s,{robe:'#E5C07A',hat:'cap',capCol:'#C98E72',arms:'carry',face:'smile'}),
  worker:   (x,y,s)=>Art.person(x,y,s,{robe:'#C98E72',hat:'coolie',arms:'carry'}),
  builder:  (x,y,s)=>Art.person(x,y,s,{robe:'#8FA8C4',hat:'hardhat',face:'smile'}),
  camel:    (x,y,s)=>Art.camel(x,y,s),
  boat:     (x,y,s)=>Art.boat(x,y,s),
  robot:    (x,y,s)=>Art.robot(x,y,s)
};
function drawFigures(p){
  Art.seed(hash(p.id));
  L.figures.innerHTML = (p.figures||[]).map(f=>{
    const fn = FIG[f.k]; if(!fn) return '';
    const sc = (f.s||0.5) * 1.72;
    const body = fn(f.at[0], f.at[1], sc);
    const sh = `<ellipse cx="${f.at[0]}" cy="${f.at[1]+7}" rx="${15*sc}" ry="${4.2*sc}" fill="rgba(60,48,30,.2)"/>`;
    return `<g class="mapfig"${f.flip?` transform="translate(${2*f.at[0]},0) scale(-1,1)"`:''}>${sh}${body}</g>`;
  }).join('');
}
/* the little guide in the corner, fixed to the frame like the reference */
function drawNarrator(){
  Art.seed(99);
  L.narrator.innerHTML = `<g opacity=".95">
    ${Art.person(886,590,0.78,{robe:'#4E6274',hat:'scholar',face:'smile'})}
    <circle cx="878" cy="566" r="5.6" fill="none" stroke="#2B2B2B" stroke-width="1.9"/>
    <circle cx="893" cy="566" r="5.6" fill="none" stroke="#2B2B2B" stroke-width="1.9"/>
    <path d="M883.6,566 L887.4,566" stroke="#2B2B2B" stroke-width="1.9"/></g>`;
}
/* a small red-roofed hall marks a capital, as on the reference maps */
function palace(x,y,s=1){
  return `<g><path d="M${x-13*s},${y} L${x+13*s},${y} L${x+13*s},${y-11*s} L${x-13*s},${y-11*s} Z"
      fill="#E8DCC2" stroke="#2B2B2B" stroke-width="${1.9*s}"/>
    <path d="M${x-17*s},${y-11*s} Q${x},${y-24*s} ${x+17*s},${y-11*s} Q${x},${y-8*s} ${x-17*s},${y-11*s} Z"
      fill="#C0604C" stroke="#2B2B2B" stroke-width="${1.9*s}"/>
    <rect x="${x-3*s}" y="${y-7*s}" width="${6*s}" height="${7*s}" fill="#7E5236" stroke="#2B2B2B" stroke-width="${1.3*s}"/></g>`;
}

/* ---------- period morph ---------- */
let current=null;
export function setPeriod(pid){
  const p = byId(pid); if(!p) return; current=p;
  const assigned = {};
  for(const st of p.states) for(const rg of st.regions) assigned[rg]=st;

  for(const id of Object.keys(CELLS)){
    const node=document.getElementById('rg-'+id), st=assigned[id];
    node.setAttribute('fill', st ? TONES[st.tone] : TONES.quiet);
    node.setAttribute('opacity', st ? 1 : .55);
  }
  // hatched overlays for protectorates / contested zones
  [...L.fx.querySelectorAll('.hatchrg')].forEach(n=>n.remove());
  for(const st of p.states){ if(!st.hatch) continue;
    for(const rg of st.regions)
      L.fx.appendChild(el('path',{d:cellPath(CELLS[rg]), fill:'url(#hatch)', stroke:'none', class:'hatchrg'}));
  }
  // outside shapes highlighted when a state claims them
  const claimed = new Set(p.states.flatMap(s=>s.outside||[]));
  for(const id of Object.keys(OUTSIDE)){
    const n=document.getElementById('out-'+id);
    n.setAttribute('fill', claimed.has(id)? TONES[p.states[0].tone] : '#EADFC8');
    n.setAttribute('opacity', claimed.has(id)? .85 : 1);
  }

  // labels: one per state, placed at the mean of its regions
  L.labels.textContent='';
  for(const st of p.states){
    if(!st.regions.length || st.hatch) continue;
    const pts = st.regions.map(r=>CENT[r]).filter(Boolean);
    if(!pts.length) continue;
    const c = pts.reduce((a,q)=>[a[0]+q[0]/pts.length, a[1]+q[1]/pts.length],[0,0]);
    const t = el('text',{x:c[0].toFixed(0), y:c[1].toFixed(0), class:'st-label'});
    t.textContent = st.name; L.labels.appendChild(t);
  }
  // trade routes & canals — drawn on, with a traveller moving along them
  L.routes.textContent='';
  for(const rt of (p.routes||[])){
    const dash = rt.kind==='sea' ? '9 7' : rt.kind==='canal' ? '2 0' : '12 8';
    const col  = rt.kind==='sea' ? '#3E7187' : rt.kind==='canal' ? '#4E8FA8' : '#A2693F';
    const d = smooth(rt.pts,false);
    const path = el('path',{d, fill:'none', stroke:col,'stroke-width':3,
      'stroke-dasharray':dash,'stroke-linecap':'round', opacity:.9, class:'route-line'});
    L.routes.appendChild(path);
    // a camel on land routes, a junk at sea — animated along the same path
    const rid = 'rp-'+rt.id+'-'+Math.random().toString(36).slice(2,7);
    const hidden = el('path',{id:rid, d, fill:'none', stroke:'none'});
    L.routes.appendChild(hidden);
    const trav = document.createElementNS(NS,'g');
    trav.setAttribute('class','traveller');
    Art.seed(hash(rt.id));
    trav.innerHTML = (rt.kind==='sea' ? Art.boat(0,0,0.42) : Art.camel(0,0,0.42));
    const mo = document.createElementNS(NS,'animateMotion');
    mo.setAttribute('dur', (rt.kind==='sea'?16:22)+'s');
    mo.setAttribute('repeatCount','indefinite');
    mo.setAttribute('rotate','0');
    const mp = document.createElementNS(NS,'mpath');
    mp.setAttributeNS('http://www.w3.org/1999/xlink','href','#'+rid);
    mo.appendChild(mp); trav.appendChild(mo);
    L.routes.appendChild(trav);
    const mid = rt.pts[Math.floor(rt.pts.length/2)];
    const dy = rt.kind==='sea' ? 18 : -10;
    const t=el('text',{x:mid[0],y:mid[1]+dy,class:'route-label'}); t.textContent=rt.name; L.routes.appendChild(t);
  }
  // Great Wall
  L.wall.textContent='';
  if(p.wall){
    L.wall.appendChild(el('path',{d:smooth([[352,252],[420,228],[492,214],[548,206],[604,214],[650,244],[676,268]],false),
      fill:'none', stroke:'#6B6052','stroke-width':5,'stroke-linecap':'round','stroke-dasharray':'1 9'}));
  }
  drawFigures(p);

  // markers
  L.markers.textContent='';
  const seen=new Set();
  for(const c of (p.cities||[])){
    if(seen.has(c.n)) continue; seen.add(c.n);
    const g=el('g',{class:'marker'});
    g.appendChild(el('circle',{cx:c.at[0],cy:c.at[1],r:16,class:'hit'}));
    const isCapital = (p.cities||[])[0] === c;
    if(c.hero){
      g.appendChild(el('circle',{cx:c.at[0],cy:c.at[1],r:9,class:'dot',fill:'#C3272B',stroke:'#2B2B2B','stroke-width':2.4}));
      g.appendChild(el('circle',{cx:c.at[0],cy:c.at[1],r:14,fill:'none',stroke:'#C3272B','stroke-width':1.8,opacity:.55}));
    } else if(isCapital){
      const w=document.createElementNS(NS,'g'); w.innerHTML=palace(c.at[0],c.at[1]+3,0.92); g.appendChild(w);
    } else {
      g.appendChild(el('circle',{cx:c.at[0],cy:c.at[1],r:5.2,class:'dot',fill:'#FBF6EA',stroke:'#2B2B2B','stroke-width':2.2}));
    }
    const t=el('text',{x:c.at[0]+(isCapital?19:10),y:c.at[1]+(isCapital?8:5),class:'city-label'});
    t.textContent=c.n; g.appendChild(t);
    L.markers.appendChild(g);
  }
  for(const pl of placesFor(pid)){
    const g=el('g',{class:'marker'}); g.setAttribute('tabindex','0');
    g.setAttribute('role','button'); g.setAttribute('aria-label','Open story: '+pl.n);
    g.appendChild(el('circle',{cx:pl.at[0],cy:pl.at[1],r:17,class:'hit'}));
    // breathing halo so it is obvious these open something
    g.appendChild(el('circle',{cx:pl.at[0],cy:pl.at[1],r:pl.hero?11:9,class:'halo',
      fill:'none',stroke:pl.hero?'#E5B95F':'#62947A','stroke-width':2.2}));
    g.appendChild(el('circle',{cx:pl.at[0],cy:pl.at[1],r:pl.hero?13:11,class:'ring',
      fill:'none',stroke:pl.hero?'#E5B95F':'#62947A','stroke-width':2}));
    const d=el('circle',{cx:pl.at[0],cy:pl.at[1],r:pl.hero?8:6,class:'dot',
      fill:pl.hero?'#E5B95F':'#62947A',stroke:'#2B2B2B','stroke-width':2.4});
    g.appendChild(d);
    g.appendChild(el('path',{d:`M${pl.at[0]-3.2},${pl.at[1]-11} l3.2,-5 l3.2,5 Z`,fill:'#2B2B2B'}));
    g.addEventListener('click',e=>{e.stopPropagation();onPlace(pl);});
    g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();onPlace(pl);} });
    L.markers.appendChild(g);
  }
  // SEZ pulse
  for(const z of (p.zones||[]))
    L.markers.appendChild(el('circle',{cx:z[0],cy:z[1],r:11,fill:'none',stroke:'#C3272B','stroke-width':2,opacity:.5}));
}
export const currentPeriod = () => current;

/* ---------- camera ---------- */
let cam={x:500,y:380,s:1};
export function setCamera(x=500,y=380,s=1,instant=false){
  cam={x,y,s};
  const g=document.getElementById('cam');
  if(instant) g.style.transition='none'; 
  g.setAttribute('transform',`translate(${500-x*s} ${380-y*s}) scale(${s})`);
  if(instant) requestAnimationFrame(()=>{ g.style.transition=''; });
}
export const getCamera = () => ({...cam});
