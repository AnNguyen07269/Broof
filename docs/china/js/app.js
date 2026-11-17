/* app.js — wires the atlas together: Explore Mode, panels, timeline, storybook,
   and the hand-off to the Automatic Walkthrough. */
import {PERIODS, EVENTS, byId} from './data/periods.js';
import {CATEGORIES, contentFor, CONTENT} from './data/lenses.js';
import {PLACES, placesFor} from './data/places.js';
import * as Map from './mapview.js';
import * as Audio from './audio.js';
import * as WT from './walkthrough.js';
import {stageFor, introArt} from './stages.js';
import * as A from './art.js';
import {iconFor} from './icons.js';
import {pagoda, isoCity, spinnable} from './three.js';
import {panelScene, LENS_ICON, figureCards, eraEmblem} from './panelart.js';

let periodIdx = 0, activeCat = null;

/* ================= period ================= */
function setPeriod(i, {fromTimeline=false}={}){
  periodIdx = Math.max(0, Math.min(PERIODS.length-1, i));
  const p = PERIODS[periodIdx];
  Map.setPeriod(p.id);
  if(!WT.WT.running) Map.setCamera(500,380,1);
  document.querySelector('#periodcard .pc-years').textContent = p.years;
  document.querySelector('#periodcard .pc-name').textContent  = p.name;
  document.querySelector('#periodcard .pc-emb').innerHTML = eraEmblem(p.id);
  document.querySelector('#periodcard .pc-blurb').textContent = p.blurb;
  document.querySelector('#periodcard .pc-caveat').textContent = p.caveat || '';
  const np = placesFor(p.id).length, hint = document.querySelector('#periodcard .pc-hint');
  if(hint) hint.innerHTML = np ? `<b>${np}</b> place${np>1?'s':''} on the map open a story — click a green marker`
                               : '';
  document.querySelectorAll('#tl-marks .tm').forEach((n,k)=>{
    n.classList.toggle('on', k===periodIdx);
    n.classList.toggle('past', k<periodIdx);
  });
  document.getElementById('tl-fill').style.width = (periodIdx/(PERIODS.length-1)*100)+'%';
  if(activeCat) openCategory(activeCat);
}

/* ================= sidebar ================= */
function buildSidebar(){
  const nav=document.getElementById('sidebar');
  nav.innerHTML = CATEGORIES.map(c=>`
    <button class="cat${c.special?' lens':''}" data-c="${c.id}" title="${c.n}" aria-label="${c.n}" style="--accent:${c.c}">
      ${iconFor(c.id)}
      <span>${c.s.replace(/<br>/,' ')}</span>
    </button>`).join('');
  nav.querySelectorAll('.cat').forEach(b=>b.addEventListener('click',()=>{
    activeCat === b.dataset.c ? closePanel() : openCategory(b.dataset.c);
  }));
}
function openCategory(id){
  activeCat=id;
  const p=PERIODS[periodIdx], cat=CATEGORIES.find(c=>c.id===id);
  const panel=document.getElementById('panel'), body=document.getElementById('panel-body');
  document.querySelectorAll('.cat').forEach(n=>n.classList.toggle('active',n.dataset.c===id));
  let html = `<div class="p-era"><i class="p-dot"></i>${cat.n} <b>·</b> ${p.name}, ${p.years}</div>`;
  html += `<div class="pscene-wrap">${panelScene(id, p)}</div>`;

  if(id==='overview'){
    html += `<h3>${p.name}</h3><p>${p.blurb}</p>`;
    if(p.caveat) html += `<div class="pc-caveat">${p.caveat}</div>`;
    const sts = p.states.filter(s=>s.regions.length);
    if(sts.length>1){ html += `<h4>On the map</h4><p>${sts.map(s=>s.name).join(' · ')}</p>`; }
    const pl = placesFor(p.id);
    if(pl.length){ html += `<h4>Places you can open</h4><div class="placelist">` +
      pl.map(x=>`<button data-p="${x.id}">${x.n}</button>`).join('') + `</div>`; }
    const evs = EVENTS.filter(e=>e.p===p.id);
    if(evs.length){ html += `<h4>In this period</h4><div class="ev-chips">` +
      evs.map(e=>`<span>${e.y<0?Math.abs(e.y)+' BCE':e.y} — ${e.t}</span>`).join('') + `</div>`; }
  }
  else if(id==='lens'){
    const c = contentFor(p.id,'lens');
    html += `<div class="lenshead"><i>◎</i><h3 style="margin:0">Builder's Lens</h3></div>
      <p class="lens-intro">Historical context first, then the entrepreneurial reading — not modern startup language projected backwards.</p>
      <h4>Historical context</h4><p>${p.blurb}</p>
      <h4>Through the lens</h4><div class="lensgrid">
      <div class="lensbox o">${LENS_ICON.o}<b>Opportunity</b><p>${c.o}</p></div>
      <div class="lensbox c">${LENS_ICON.c}<b>Creation</b><p>${c.c}</p></div>
      <div class="lensbox r">${LENS_ICON.r}<b>Resilience</b><p>${c.r}</p></div>
      <div class="lensbox h">${LENS_ICON.h}<b>Human impact</b><p>${c.h}</p></div></div>`;
  }
  else {
    const c = contentFor(p.id,id);
    html += `<h3>${c.t}</h3>` + c.b.map(x=>`<p>${x}</p>`).join('');
    if(id==='figures') html += figureCards(c.t, p);
    if(id==='building')
      html += `<figure class="d3"><figcaption>A timber-frame pagoda — tiered eaves on a bracket set, the
        form that carried Chinese building for a thousand years. Drag it to turn it.</figcaption>
        ${pagoda({tiers:3,size:124})}</figure>`;
    if(id==='economy' && (p.id==='modern'))
      html += `<figure class="d3"><figcaption>Shenzhen, as blocks on a grid: farmland in 1979, this by 2020.
        Drag to turn.</figcaption>${isoCity(8)}</figure>`;
    if(!(CONTENT[p.id] && CONTENT[p.id][id]))
      html += `<p class="srcnote">Summarised at era level for this period — the surviving record is thinner here.</p>`;
  }
  panel.classList.toggle('lensmode', id==='lens');
  panel.style.setProperty('--accent', cat.c);
  body.innerHTML = html;
  body.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{
    openStory(PLACES.find(x=>x.id===b.dataset.p));
  }));
  body.querySelectorAll('.pg-spin,.ic-world').forEach(spinnable);
  panel.classList.remove('hidden');
}
function closePanel(){
  activeCat=null;
  document.getElementById('panel').classList.add('hidden');
  document.querySelectorAll('.cat').forEach(n=>n.classList.remove('active'));
}

/* ================= timeline ================= */
function buildTimeline(){
  const marks=document.getElementById('tl-marks');
  marks.innerHTML = PERIODS.map((p,i)=>
    `<div class="tm ${i%2?'dn':'up'}${p.major?' major':''}" data-i="${i}" tabindex="0" role="button"
       title="${p.name} · ${p.years}" aria-label="${p.name}, ${p.years}"><i></i><b>${p.short||p.name}</b></div>`).join('');
  [...marks.children].forEach((n,i)=>{
    n.style.left = (i/(PERIODS.length-1)*100)+'%';
    const go=()=>{ if(WT.WT.running) WT.stop(); setPeriod(i); };
    n.addEventListener('click', go);
    n.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
  });
  const inner=document.getElementById('tl-full-inner');
  inner.innerHTML = `<h2 style="font-family:var(--hand);font-size:34px;margin:0 0 4px">Complete chronology</h2>
    <p style="font-size:13px;color:#6E675A;margin:0 0 16px">Primary dynasties and governments in bold; secondary eras and events listed beneath each.
    Dates follow conventional scholarly ranges. Contested attributions are flagged.</p>` +
    PERIODS.map((p,i)=>{
      const evs=EVENTS.filter(e=>e.p===p.id);
      return `<div class="era-row${p.major?' major':''}" data-i="${i}">
        <div class="er-head">${eraEmblem(p.id)}<div><div class="er-n">${p.name}</div><div class="er-y">${p.years}</div></div></div>
        <div><div class="er-b">${p.blurb}</div>
          ${p.caveat?`<div class="er-b" style="color:#8A5A2A;font-style:italic;margin-top:4px">⚑ ${p.caveat}</div>`:''}
          ${evs.length?`<div class="ev-chips">${evs.map(e=>`<span>${e.y<0?Math.abs(e.y)+' BCE':e.y} · ${e.t}</span>`).join('')}</div>`:''}
        </div></div>`;
    }).join('');
  inner.querySelectorAll('.era-row').forEach(n=>n.addEventListener('click',()=>{
    if(WT.WT.running) WT.stop();
    setPeriod(+n.dataset.i); document.getElementById('tl-full').classList.add('hidden');
  }));
  document.getElementById('tl-expand').addEventListener('click',()=>document.getElementById('tl-full').classList.remove('hidden'));
  document.getElementById('tl-collapse').addEventListener('click',()=>document.getElementById('tl-full').classList.add('hidden'));
}

/* ================= storybook ================= */
let heldForStory=false;
function openStory(pl){
  if(!pl) return;
  heldForStory = WT.holdForExplore();
  const art=document.getElementById('story-art'), txt=document.getElementById('story-text');
  art.innerHTML = sceneArtFor(pl.scene);
  txt.innerHTML = `<h3>${pl.title}</h3>` + pl.body.map(b=>`<p>${b}</p>`).join('') +
    (pl.details?.length ? `<div class="detail-chips">${pl.details.map((d,i)=>`<button data-d="${i}">${d.n}</button>`).join('')}</div><div id="detail-out"></div>` : '') +
    `<h4 style="font-family:var(--ui);font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#4E6274;margin:18px 0 6px;border-bottom:1.5px solid rgba(43,43,43,.16);padding-bottom:3px">Builder's Lens</h4>
     <div class="lensgrid">
      <div class="lensbox o"><b>Opportunity</b><p>${pl.lens.o}</p></div>
      <div class="lensbox c"><b>Creation</b><p>${pl.lens.c}</p></div>
      <div class="lensbox r"><b>Resilience</b><p>${pl.lens.r}</p></div>
      <div class="lensbox h"><b>Human impact</b><p>${pl.lens.h}</p></div></div>` +
    (pl.src?`<div class="srcnote">Source: ${pl.src}</div>`:'');
  txt.querySelectorAll('[data-d]').forEach(b=>b.addEventListener('click',()=>{
    txt.querySelectorAll('[data-d]').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    document.getElementById('detail-out').textContent = pl.details[+b.dataset.d].d;
  }));
  document.getElementById('story').classList.remove('hidden');
}
function closeStory(){
  document.getElementById('story').classList.add('hidden');
  document.getElementById('detail-out')?.remove();
  if(heldForStory){ heldForStory=false; WT.showExploreHold(); }
}
function sceneArtFor(kind){
  A.seed(kind.length*31+7);
  const B=(inner)=>`<svg viewBox="0 0 880 224" xmlns="http://www.w3.org/2000/svg">
    <style>.cap{font:500 15px 'Caveat',cursive;fill:#3A3426}</style>
    <rect width="880" height="224" fill="#EFE3CB"/>${inner}</svg>`;
  const ground=`<path d="M0,196 L880,196" stroke="#2B2B2B" stroke-width="2.4" opacity=".4"/>`;
  switch(kind){
    case 'oracle': return B(ground+A.hall(190,196,150,62,{door:1,plinth:1})+
      `<ellipse cx="470" cy="150" rx="52" ry="40" fill="#EDE2CC" stroke="#2B2B2B" stroke-width="3"/>
       <path d="M448,124 L462,160 L452,176 M470,120 L474,158 M492,128 L486,164" stroke="#2B2B2B" stroke-width="2.2" fill="none"/>
       <text x="470" y="206" class="cap" text-anchor="middle">oracle bone</text>`+
      A.person(640,196,0.9,{robe:'#C98E72',hat:'scholar',face:'calm'})+A.person(712,198,0.86,{robe:'#8FB89C',hat:'crown'}));
    case 'water': return B(ground+A.mountain(140,196,220,110,'#A9B6A2')+
      `<path d="M60,150 Q240,168 440,158 T860,172" stroke="#5C93A8" stroke-width="9" fill="none" stroke-linecap="round"/>
       <path d="M420,158 Q520,196 700,190" stroke="#5C93A8" stroke-width="6" fill="none" stroke-linecap="round"/>`+
      A.person(560,196,0.84,{robe:'#E5C07A',hat:'coolie',arms:'carry'})+A.person(630,198,0.8,{robe:'#8FA8C4',hat:'coolie'})+
      `<text x="700" y="140" class="cap">the river is split, not blocked</text>`);
    case 'city': return B(ground+A.hall(170,196,180,70,{door:1,plinth:1})+A.hut(330,196,60,{win:1})+A.hut(400,196,52,{win:1})+
      A.person(500,196,0.8,{robe:'#8FB89C',hat:'scholar'})+A.person(548,198,0.8,{robe:'#D4A0A0',face:'smile'})+
      A.person(596,196,0.8,{robe:'#8FA8C4',hat:'cap'})+A.person(646,198,0.8,{robe:'#E5C07A',hat:'coolie',arms:'carry'})+
      A.tree(760,196,1.1)+A.cloud(720,52,0.9));
    case 'caravan': return B(ground+A.mountain(120,196,230,96,'#B8BFAE')+A.camel(390,196,1.0)+A.camel(520,198,0.86)+
      A.person(620,196,0.76,{robe:'#E5C07A',hat:'coolie',arms:'carry'})+A.person(676,198,0.74,{robe:'#C98E72',hat:'cap'})+
      `<text x="640" y="138" class="cap">oasis, water, and a toll</text>`);
    case 'market': return B(ground+
      [0,1,2,3].map(i=>A.hut(150+i*140,196,70,{win:1,roof:['#C0604C','#8C6E8E','#B07A52','#62947A'][i]})).join('')+
      A.person(220,196,0.78,{robe:'#8FB89C',arms:'carry',hat:'coolie'})+A.person(360,198,0.78,{robe:'#D4A0A0',face:'smile'})+
      A.person(500,196,0.78,{robe:'#E5C07A',hat:'cap'})+A.person(640,198,0.78,{robe:'#8FA8C4',hat:'scholar'})+
      `<text x="440" y="60" class="cap" text-anchor="middle">shops open onto the street — and stay open at night</text>`);
    case 'port': return B(`<rect y="150" width="880" height="74" fill="#BBD4DE"/>`+ground+
      A.boat(200,168,1.15)+A.boat(400,176,0.95)+A.boat(560,162,0.8)+
      A.hall(740,196,140,58,{door:1,plinth:1})+
      A.person(660,198,0.74,{robe:'#C98E72',hat:'coolie',arms:'carry'}));
    case 'fleet': return B(`<rect y="140" width="880" height="84" fill="#BBD4DE"/>`+
      A.boat(190,166,1.5)+A.boat(420,176,1.1)+A.boat(600,160,0.85)+A.boat(740,180,0.7)+
      `<text x="440" y="48" class="cap" text-anchor="middle">seven voyages, 1405–1433 — then nothing</text>`);
    case 'treaty': return B(ground+A.factory(180,196,180,70,{smoke:1})+
      A.tower(420,196,54,110,{lit:1})+A.tower(490,196,44,82,{lit:1})+
      A.boat(680,180,0.9)+A.person(330,198,0.76,{robe:'#9FAFC0',hat:'cap'}));
    case 'shenzhen': return B(ground+
      A.hut(90,196,56,{win:1})+A.boat(190,186,0.6)+
      `<path d="M250,196 L250,80" stroke="#2B2B2B" stroke-width="2.4" stroke-dasharray="7 6"/>`+
      A.factory(380,196,150,58,{smoke:1})+
      A.tower(580,196,46,120,{lit:1,antenna:1})+A.tower(640,196,38,90,{lit:1})+A.tower(694,196,48,142,{lit:1,antenna:1})+
      A.tower(754,196,34,76,{lit:1})+
      `<text x="150" y="60" class="cap">1979</text><text x="700" y="48" class="cap">today</text>`);
    case 'palace': return B(ground+A.hall(300,196,230,86,{door:1,plinth:1})+A.hall(560,196,130,56,{door:1,plinth:1})+
      A.person(170,198,0.8,{robe:'#C3272B',hat:'crown'})+A.person(230,198,0.74,{robe:'#8FA8C4',hat:'scholar'})+
      A.cloud(740,56,1.0));
    case 'jade': return B(ground+A.mountain(120,196,200,86,'#AFBCA8')+
      `<path d="M300,150 a44,44 0 1 0 88,0 a44,44 0 1 0 -88,0 M330,150 a14,14 0 1 0 28,0 a14,14 0 1 0 -28,0"
         fill="#A8C4B4" stroke="#2B2B2B" stroke-width="3" fill-rule="evenodd"/>
       <text x="344" y="212" class="cap" text-anchor="middle">jade bi</text>
       <rect x="440" y="116" width="62" height="62" fill="#9FBCAC" stroke="#2B2B2B" stroke-width="3"/>
       <circle cx="471" cy="147" r="17" fill="#EFE3CB" stroke="#2B2B2B" stroke-width="2.6"/>
       <text x="471" y="212" class="cap" text-anchor="middle">jade cong</text>`+
      A.person(600,196,0.84,{robe:'#8FB89C',hat:'coolie',arms:'carry'})+
      A.person(672,198,0.8,{robe:'#C98E72',face:'calm'})+
      `<path d="M700,150 Q760,138 820,152" stroke="#5C93A8" stroke-width="7" fill="none" stroke-linecap="round"/>
       <text x="770" y="128" class="cap" text-anchor="middle">levees</text>`);
    case 'bronze': return B(ground+A.hall(170,196,160,64,{door:1,plinth:1})+
      `<path d="M372,196 l10,-54 l78,0 l10,54 Z" fill="#9C8A5E" stroke="#2B2B2B" stroke-width="3"/>
       <path d="M366,142 l92,0" stroke="#2B2B2B" stroke-width="3"/>
       <path d="M382,196 l0,16 M450,196 l0,16" stroke="#2B2B2B" stroke-width="3.4"/>
       <path d="M396,158 h42 M396,170 h42 M396,182 h28" stroke="#4A3F2A" stroke-width="2.2"/>
       <text x="416" y="60" class="cap" text-anchor="middle">the text is cast inside</text>`+
      A.person(560,196,0.84,{robe:'#8FA8C4',hat:'scholar',face:'calm'})+
      A.person(640,198,0.8,{robe:'#C3272B',hat:'crown'})+A.tree(760,196,1.0));
    case 'teaching': return B(ground+A.hall(190,196,170,66,{door:1,plinth:1})+A.tree(330,196,1.1)+
      A.person(470,196,0.92,{robe:'#8FA8C4',hat:'scholar',face:'calm',arms:'up'})+
      A.person(560,198,0.68,{robe:'#8FB89C',face:'smile'})+
      A.person(612,198,0.68,{robe:'#E5C07A',face:'smile'})+
      A.person(664,198,0.68,{robe:'#D4A0A0',face:'smile'})+
      A.person(716,198,0.68,{robe:'#B49BC0',face:'smile'})+
      `<text x="470" y="84" class="cap" text-anchor="middle">no office, no army \u2014 just students</text>`);
    case 'battle': return B(`<rect y="150" width="880" height="74" fill="#BBD4DE"/>`+
      A.boat(180,170,1.1,{sail:'#E8D2B4'})+A.boat(300,180,0.9,{sail:'#E8D2B4'})+
      `<g>${[430,500,570].map(x=>`<g><path d="M${x-30},${168} l60,0 l-10,16 l-40,0 Z" fill="#B0763F" stroke="#2B2B2B" stroke-width="2.6"/>
        <path d="M${x},${166} l0,-30" stroke="#2B2B2B" stroke-width="3"/>
        <path d="M${x-14},${140} q14,-22 28,0 q-14,16 -28,0 Z" fill="#C3272B" stroke="#2B2B2B" stroke-width="2.4"/>
        <ellipse cx="${x}" cy="${120}" rx="15" ry="11" fill="#E5B95F" opacity=".8"/>
        <ellipse cx="${x+6}" cy="${104}" rx="11" ry="8" fill="#C3272B" opacity=".65"/></g>`).join('')}</g>`+
      A.person(720,196,0.84,{robe:'#9FAFC0',hat:'helmet',face:'oh'})+
      A.person(784,198,0.8,{robe:'#62947A',hat:'helmet',face:'calm'})+
      `<text x="500" y="56" class="cap" text-anchor="middle">fire ships against a chained fleet</text>`);
    case 'cave': return B(`<rect width="880" height="224" fill="#D8CDB4"/>`+
      `<path d="M0,224 L0,40 Q120,16 260,34 L260,224 Z" fill="#C3B79A" stroke="#2B2B2B" stroke-width="3"/>`+
      `<path d="M300,224 L300,30 Q470,8 650,30 L650,224 Z" fill="#CDC0A2" stroke="#2B2B2B" stroke-width="3"/>`+
      `<path d="M690,224 L690,44 Q780,24 870,44 L870,224 Z" fill="#C3B79A" stroke="#2B2B2B" stroke-width="3"/>`+
      `<g><ellipse cx="475" cy="108" rx="40" ry="44" fill="#E6D8B8" stroke="#2B2B2B" stroke-width="3"/>
        <path d="M447,80 q28,-18 56,0" stroke="#2B2B2B" stroke-width="2.6" fill="none"/>
        <circle cx="462" cy="104" r="3.2" fill="#2B2B2B"/><circle cx="488" cy="104" r="3.2" fill="#2B2B2B"/>
        <path d="M462,126 q13,10 26,0" stroke="#2B2B2B" stroke-width="2.6" fill="none"/>
        <path d="M435,152 l80,0 l14,72 l-108,0 Z" fill="#DCCDAA" stroke="#2B2B2B" stroke-width="3"/></g>`+
      A.person(150,214,0.5,{robe:'#8FB89C',hat:'coolie'})+A.person(760,214,0.5,{robe:'#C98E72'})+
      `<text x="475" y="40" class="cap" text-anchor="middle">fifteen metres of carved rock</text>`);
    case 'bridge': return B(`<rect y="166" width="880" height="58" fill="#AFCBD8"/>`+
      `<path d="M190,166 Q440,56 690,166" fill="none" stroke="#2B2B2B" stroke-width="4"/>
       <path d="M190,166 Q440,76 690,166 L690,186 Q440,96 190,186 Z" fill="#CFC5AE" stroke="#2B2B2B" stroke-width="3.4"/>
       <path d="M236,152 a26,20 0 0 1 52,0 Z M300,130 a24,18 0 0 1 48,0 Z M532,130 a24,18 0 0 1 48,0 Z M592,152 a26,20 0 0 1 52,0 Z"
         fill="#AFCBD8" stroke="#2B2B2B" stroke-width="2.8"/>
       <path d="M190,166 l-36,0 l0,30 l36,0 M690,166 l36,0 l0,30 l-36,0" fill="#BFB49C" stroke="#2B2B2B" stroke-width="3"/>`+
      A.person(400,110,0.56,{robe:'#8FB89C',hat:'coolie',arms:'carry'})+
      A.person(470,104,0.54,{robe:'#D4A0A0'})+
      `<text x="440" y="212" class="cap" text-anchor="middle">open spandrels: lighter, and floodwater passes through</text>`);
    case 'kiln': return B(ground+
      `<path d="M120,196 l0,-54 q66,-40 132,0 l0,54 Z" fill="#B5784F" stroke="#2B2B2B" stroke-width="3.2"/>
       <rect x="160" y="156" width="46" height="40" fill="#5E3B22" stroke="#2B2B2B" stroke-width="2.6"/>
       <path d="M252,142 l22,0 l0,-46 l-22,0 Z" fill="#9C8A72" stroke="#2B2B2B" stroke-width="2.6"/>`+
      [0,1,2].map(k=>`<ellipse cx="${264+k*8}" cy="${80-k*18}" rx="${10+k*4}" ry="${8+k*3}" fill="rgba(180,180,180,.5)"/>`).join('')+
      `<text x="186" y="216" class="cap" text-anchor="middle">the kiln</text>`+
      [0,1,2,3].map(k=>`<g><ellipse cx="${400+k*106}" cy="${168}" rx="26" ry="9" fill="#EFE9DA" stroke="#2B2B2B" stroke-width="2.4"/>
        <path d="M${374+k*106},168 q6,-46 26,-46 q20,0 26,46" fill="#F4F0E4" stroke="#2B2B2B" stroke-width="2.8"/>
        <path d="M${386+k*106},140 q14,-10 28,0" stroke="#5B79A8" stroke-width="2.6" fill="none"/>
        <path d="M${390+k*106},152 q10,-7 20,0" stroke="#5B79A8" stroke-width="2.2" fill="none"/></g>`).join('')+
      A.person(400,214,0.48,{robe:'#8FB89C',hat:'cap'})+A.person(612,214,0.48,{robe:'#E5C07A',hat:'cap'})+
      `<text x="560" y="60" class="cap" text-anchor="middle">one piece, dozens of hands</text>`);
    default: return B(ground+A.hall(300,196,180,70,{door:1,plinth:1})+A.person(520,198,0.84,{robe:'#8FB89C',hat:'scholar'}));
  }
}

/* ================= sources ================= */
function openSources(){
  WT.holdForExplore();
  const art=document.getElementById('story-art'), txt=document.getElementById('story-text');
  art.innerHTML = introArt();
  txt.innerHTML = `<h3>Sources &amp; notes</h3>
  <p><b>The map is schematic.</b> Territory is drawn as a tessellation of regions, recoloured per period to show
  who controlled roughly what. Borders are illustrative, not surveyed; frontiers in most periods were zones rather
  than lines. Hatched areas mark protectorates, spheres of influence or contested control rather than direct rule.</p>
  <h4>Required academic sources</h4>
  <p>Julian Gewirtz, “The Futurists of Beijing: Alvin Toffler, Zhao Ziyang, and China’s ‘New Technological Revolution,’
  1979–1991,” <i>The Journal of Asian Studies</i> 78, no. 1 (2019): 115–140. Used in <i>The Future</i>: Gewirtz shows
  that Zhao Ziyang and other senior officials drew on Toffler’s futurism to argue for technology policy, including
  the 863 Program — revising the Deng-centred account of its origins.</p>
  <p>Wojciech Kaftanski and Jeffrey Hanson, “Suffering, Authenticity, and Meaning in Life: Toward an Integrated
  Conceptualization of Well-Being,” <i>Frontiers in Psychology</i> 13 (2022). Used in the conclusion: they argue
  against conceptions of well-being that treat suffering as something simply to be eliminated, holding instead that
  it is constitutive of meaning and authenticity.</p>
  <p>Sarah Bankins and Paul Formosa, “The Ethical Implications of Artificial Intelligence (AI) For Meaningful Work,”
  <i>Journal of Business Ethics</i> 185 (2023): 725–740. Used in <i>The Future</i>: they assess how AI deployment —
  task replacement, “tending the machine”, or skill amplification — can enhance or diminish meaningful work across
  five dimensions.</p>
  <h4>Other sources drawn on</h4>
  <p>Juan Du, <i>The Shenzhen Experiment: The Story of China’s Instant City</i> (Harvard University Press, 2020),
  for the correction to the “fishing village” account. Shenzhen Municipal Statistics Bureau for 2025 GDP
  (¥3.873 trillion) and population figures. Company founding dates and 2025 BYD/Tesla delivery figures from
  company disclosures as reported in the business press.</p>
  <h4>What this project does not claim</h4>
  <p>Dynastic dates are conventional ranges and some are debated — the Xia in particular is flagged on its own
  panel. The narration is deliberately short; every period here compresses enormous regional variation.
  Where achievements and harms occurred together, both are stated.</p>
  <h4>Media</h4>
  <p>All artwork is original, drawn programmatically in SVG for this project. The Shenzhen sequence is a rendered
  MP4 produced frame-by-frame from the same original artwork — it is <i>not</i> output from an AI video model.
  Music is synthesised live in the browser with the Web Audio API. Narration uses the browser’s speech engine;
  recorded voice-over can be dropped into <code>media/vo/</code> without code changes.</p>`;
  document.getElementById('story').classList.remove('hidden');
}

/* ================= boot ================= */
function boot(){
  Map.build(pl=>openStory(pl));
  buildSidebar(); buildTimeline();
  WT.mount({ onExit:()=>setPeriod(periodIdx) });
  // keep the period card truthful while the walkthrough drives the map
  WT.WT.onSceneChange = sc => {
    const i = PERIODS.findIndex(p=>p.id===sc.period);
    if(i<0) return;
    periodIdx = i; const p = PERIODS[i];
    document.querySelector('#periodcard .pc-years').textContent = p.years;
    document.querySelector('#periodcard .pc-name').textContent  = p.name;
  document.querySelector('#periodcard .pc-emb').innerHTML = eraEmblem(p.id);
    document.querySelector('#periodcard .pc-blurb').textContent = p.blurb;
    document.querySelector('#periodcard .pc-caveat').textContent = p.caveat || '';
    document.querySelectorAll('#tl-marks .tm').forEach((n,k)=>{
      n.classList.toggle('on', k===i); n.classList.toggle('past', k<i); });
    document.getElementById('tl-fill').style.width = (i/(PERIODS.length-1)*100)+'%';
  };
  setPeriod(0);
  document.getElementById('intro-art').innerHTML = introArt();

  document.getElementById('panel-close').addEventListener('click',closePanel);
  document.getElementById('story-close').addEventListener('click',closeStory);
  document.getElementById('story').addEventListener('click',e=>{ if(e.target.id==='story') closeStory(); });
  document.getElementById('sources-btn').addEventListener('click',openSources);

  const go=()=>{ document.getElementById('intro').classList.add('hidden'); Audio.init(); Audio.resume(); };
  document.getElementById('intro-go').addEventListener('click',()=>{ go(); closePanel(); WT.start(); });
  document.getElementById('intro-explore').addEventListener('click',go);
  document.getElementById('start-btn').addEventListener('click',()=>{ go(); closePanel(); WT.start(); });

  // explore-mode period stepping with arrow keys
  document.addEventListener('keydown',e=>{
    if(WT.WT.running) return;
    if(e.key==='ArrowRight') setPeriod(periodIdx+1);
    if(e.key==='ArrowLeft')  setPeriod(periodIdx-1);
    if(e.key==='Escape'){ closeStory(); closePanel(); document.getElementById('tl-full').classList.add('hidden'); }
  });
}
document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',boot) : boot();
