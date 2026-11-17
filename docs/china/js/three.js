/* three.js — the small amount of 2.5D in the project.
   Built with CSS 3D transforms rather than a 3D engine: it keeps the hand-drawn
   flat-colour look, weighs nothing, and degrades to a static image if transforms
   are unavailable. Used sparingly, as the brief asks. */

/* A rotatable timber-frame pagoda: three stacked tiers, each a box plus a roof. */
export function pagoda(opts={}){
  const tiers = opts.tiers || 3;
  const S = opts.size || 150;
  let html = '';
  for(let t=0;t<tiers;t++){
    const w = S*(1 - t*0.16);          // each tier narrower than the one below
    const h = S*0.30;
    const y = -t*(h + S*0.12);
    const rw = w*1.34;                 // roof overhang
    html += `<div class="pg-tier" style="--w:${w}px;--h:${h}px;--rw:${rw}px;--y:${y}px">
      <div class="pg-face pg-f"></div><div class="pg-face pg-b"></div>
      <div class="pg-face pg-l"></div><div class="pg-face pg-r"></div>
      <div class="pg-roof">
        <div class="pg-rf pg-rn"><i></i></div><div class="pg-rf pg-rs"><i></i></div>
        <div class="pg-rf pg-re"><i></i></div><div class="pg-rf pg-rw"><i></i></div>
      </div>
    </div>`;
  }
  html += `<div class="pg-finial"></div>`;
  return `<div class="pg-stage"><div class="pg-spin" style="--S:${S}px">${html}</div></div>`;
}

/* A small 2.5D block of towers — used for Shenzhen. Built like the pagoda
   tiers (faces offset on Z), which is the box pattern that renders reliably. */
export function isoCity(n=8){
  const H=[54,96,132,74,112,160,88,120,66,140];
  let html='';
  for(let i=0;i<n;i++){
    const h=H[i%H.length], d=26, x=(i-(n-1)/2)*34, z=(i%2?1:-1)*16;
    html += `<div class="ic-b" style="--h:${h}px;--d:${d}px;--x:${x}px;--z:${z}px;--dl:${(i%4)*0.1}s">
      <div class="ic-face ic-f"></div><div class="ic-face ic-bk"></div>
      <div class="ic-face ic-l"></div><div class="ic-face ic-r"></div>
      <div class="ic-t"></div></div>`;
  }
  return `<div class="ic-stage"><div class="ic-world">${html}</div></div>`;
}

/* Let the user grab a 2.5D model and turn it. Pauses the idle spin while held,
   so the thing feels like an object rather than a loop. */
export function spinnable(el){
  if(!el || el._spin) return; el._spin = true;
  const iso = el.classList.contains('ic-world');
  let a = iso ? -38 : 0, down = false, px = 0, idle = true;
  const paint = ()=> el.style.transform = iso
    ? `rotateX(56deg) rotateZ(${a}deg)`
    : `rotateX(-18deg) rotateY(${a}deg)`;
  const grab = e=>{
    down = true; px = (e.touches ? e.touches[0].clientX : e.clientX);
    if(idle){ idle = false; el.style.animation = 'none'; paint(); }
    el.classList.add('held'); e.preventDefault();
  };
  const move = e=>{
    if(!down) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    a += (x - px) * 0.6; px = x; paint();
  };
  const up = ()=>{ down = false; el.classList.remove('held'); };
  el.addEventListener('mousedown', grab);
  el.addEventListener('touchstart', grab, {passive:false});
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, {passive:true});
  window.addEventListener('mouseup', up);
  window.addEventListener('touchend', up);
}
