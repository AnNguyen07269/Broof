/* art.js — original hand-drawn-style SVG primitives.
   Everything here is drawn from scratch: thick irregular outlines, flat pastel fills,
   chibi proportions (big head, small body). No external assets, no traced artwork. */

const INK = '#2B2B2B';
export const PAL = {
  ink:INK, parchment:'#F4EBD8', inkblue:'#263D50', vermilion:'#C3272B',
  jade:'#62947A', gold:'#E5B95F', skin:'#F0D2B4', skin2:'#E3BE9C',
  roof:'#C0604C', roof2:'#8C6E8E', wall:'#E8DCC2', wood:'#B07A52',
  water:'#A9CBD8', stone:'#C9BFAE', leaf:'#7FA882', sky:'#CFE2EA'
};

/* deterministic wobble so every redraw looks identical but hand-made */
let _s = 1;
export function seed(n){ _s = (n>>>0)||1; }
function r(){ _s = (_s*1664525+1013904223)>>>0; return _s/4294967296; }
const j = (a=1) => (r()-0.5)*2*a;

/* a closed hand-drawn polygon */
function poly(pts, fill, sw=2.6, stroke=INK){
  const d = pts.map((p,i)=>`${i?'L':'M'}${(p[0]+j(.8)).toFixed(1)},${(p[1]+j(.8)).toFixed(1)}`).join('')+'Z';
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}
function line(pts, sw=2.4, stroke=INK){
  const d = pts.map((p,i)=>`${i?'L':'M'}${(p[0]+j(.7)).toFixed(1)},${(p[1]+j(.7)).toFixed(1)}`).join('');
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function ell(cx,cy,rx,ry,fill,sw=2.6){
  return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${fill}" stroke="${INK}" stroke-width="${sw}"/>`;
}

/* ---------- people ---------- */
/* opts: robe, hat ('none'|'scholar'|'crown'|'coolie'|'helmet'|'cap'|'hardhat'),
         face ('smile'|'calm'|'oh'), flip, hair */
export function person(x, y, s=1, o={}){
  const robe = o.robe || PAL.jade, hat = o.hat || 'none';
  const g = [];
  const hx = x, hy = y - 30*s;                              // head centre
  // legs
  g.push(line([[x-5*s,y],[x-5*s,y+9*s]], 3.4*s));
  g.push(line([[x+5*s,y],[x+5*s,y+9*s]], 3.4*s));
  g.push(poly([[x-9*s,y+9*s],[x-1*s,y+9*s],[x-1*s,y+13*s],[x-10*s,y+13*s]], INK, 1.6));
  g.push(poly([[x+1*s,y+9*s],[x+9*s,y+9*s],[x+10*s,y+13*s],[x+1*s,y+13*s]], INK, 1.6));
  // body (robe)
  g.push(poly([[x-13*s,y+1*s],[x-9*s,y-17*s],[x+9*s,y-17*s],[x+13*s,y+1*s]], robe, 2.8*s));
  g.push(line([[x,y-15*s],[x,y-1*s]],1.6*s,'rgba(0,0,0,.22)'));
  // arms
  const ay = y-12*s;
  const hand=(hx2,hy2)=>`<circle cx="${hx2.toFixed(1)}" cy="${hy2.toFixed(1)}" r="${(3.1*s).toFixed(1)}" fill="${o.skin||PAL.skin}" stroke="${INK}" stroke-width="${2*s}"/>`;
  if(o.arms==='up'){ g.push(line([[x-7*s,ay],[x-14*s,ay-12*s]],3.2*s)); g.push(line([[x+7*s,ay],[x+14*s,ay-12*s]],3.2*s));
    g.push(hand(x-14*s,ay-12*s)); g.push(hand(x+14*s,ay-12*s)); }
  else if(o.arms==='carry'){ g.push(line([[x-7*s,ay],[x-13*s,ay+6*s]],3.2*s)); g.push(line([[x+7*s,ay],[x+13*s,ay+6*s]],3.2*s));
    g.push(hand(x-13*s,ay+6*s)); g.push(hand(x+13*s,ay+6*s)); }
  else { g.push(line([[x-7*s,ay],[x-12*s,ay+9*s]],3.2*s)); g.push(line([[x+7*s,ay],[x+12*s,ay+9*s]],3.2*s));
    g.push(hand(x-12*s,ay+9*s)); g.push(hand(x+12*s,ay+9*s)); }
  // head
  g.push(ell(hx,hy,15*s,14*s, o.skin||PAL.skin, 2.8*s));
  // hair
  if(hat!=='helmet') g.push(poly([[hx-15*s,hy-3*s],[hx-12*s,hy-13*s],[hx,hy-16*s],[hx+12*s,hy-13*s],[hx+15*s,hy-3*s],[hx+11*s,hy-9*s],[hx,hy-11*s],[hx-11*s,hy-9*s]], o.hair||'#3A3027', 2.2*s));
  // eyes + mouth
  const ey = hy-1*s;
  [-5.6,5.6].forEach(dx=>{
    g.push(`<circle cx="${(hx+dx*s).toFixed(1)}" cy="${ey.toFixed(1)}" r="${(2.2*s).toFixed(1)}" fill="${INK}"/>`);
    g.push(`<circle cx="${(hx+(dx+0.7)*s).toFixed(1)}" cy="${(ey-0.8*s).toFixed(1)}" r="${(0.7*s).toFixed(1)}" fill="#fff"/>`);
  });
  if(s>0.75){ // brows only at larger sizes, else they muddy the face
    g.push(line([[hx-8*s,hy-6*s],[hx-3.4*s,hy-7.4*s]],1.7*s));
    g.push(line([[hx+3.4*s,hy-7.4*s],[hx+8*s,hy-6*s]],1.7*s));
  }
  if(o.face==='oh') g.push(ell(hx,hy+7*s,2.6*s,3.3*s,INK,0));
  else if(o.face==='calm') g.push(`<path d="M${hx-3.6*s},${hy+6.6*s} q${3.6*s},${1.5*s} ${7.2*s},0" fill="none" stroke="${INK}" stroke-width="${2*s}" stroke-linecap="round"/>`);
  else g.push(`<path d="M${hx-4.4*s},${hy+5*s} q${4.4*s},${5.2*s} ${8.8*s},${0.4*s}" fill="none" stroke="${INK}" stroke-width="${2*s}" stroke-linecap="round"/>`);
  if(o.face!=='oh' && s>0.8){ // a hint of colour in the cheeks
    g.push(`<ellipse cx="${(hx-9.5*s).toFixed(1)}" cy="${(hy+3*s).toFixed(1)}" rx="${(2.6*s).toFixed(1)}" ry="${(1.7*s).toFixed(1)}" fill="#E0A08C" opacity=".5"/>`);
    g.push(`<ellipse cx="${(hx+9.5*s).toFixed(1)}" cy="${(hy+3*s).toFixed(1)}" rx="${(2.6*s).toFixed(1)}" ry="${(1.7*s).toFixed(1)}" fill="#E0A08C" opacity=".5"/>`);
  }
  // headwear
  if(hat==='scholar') g.push(poly([[hx-13*s,hy-11*s],[hx-9*s,hy-22*s],[hx+9*s,hy-22*s],[hx+13*s,hy-11*s]], PAL.inkblue, 2.4*s));
  if(hat==='crown'){
    g.push(poly([[hx-11*s,hy-12*s],[hx+11*s,hy-12*s],[hx+9*s,hy-20*s],[hx-9*s,hy-20*s]], '#3A3A3A',2.2*s));
    g.push(poly([[hx-19*s,hy-20*s],[hx+19*s,hy-20*s],[hx+19*s,hy-24*s],[hx-19*s,hy-24*s]], '#2C2C2C',2.4*s));
    [-14,-7,0,7,14].forEach(dx=>{
      g.push(line([[hx+dx*s,hy-20*s],[hx+dx*s,hy-13*s]],1.4*s,'#C9A227'));
      g.push(`<circle cx="${(hx+dx*s).toFixed(1)}" cy="${(hy-12.4*s).toFixed(1)}" r="${(1.5*s).toFixed(1)}" fill="${PAL.gold}" stroke="${INK}" stroke-width="${1.1*s}"/>`);
    });
  }
  if(hat==='coolie') g.push(poly([[hx-19*s,hy-8*s],[hx,hy-23*s],[hx+19*s,hy-8*s]], PAL.gold, 2.6*s));
  if(hat==='helmet'){ g.push(poly([[hx-15*s,hy-2*s],[hx-13*s,hy-14*s],[hx,hy-20*s],[hx+13*s,hy-14*s],[hx+15*s,hy-2*s]], '#8C8C94',2.6*s));
                      g.push(line([[hx,hy-20*s],[hx,hy-27*s]],2.4*s)); }
  if(hat==='cap') g.push(poly([[hx-15*s,hy-6*s],[hx-12*s,hy-16*s],[hx+12*s,hy-16*s],[hx+15*s,hy-6*s]], o.capCol||PAL.vermilion,2.4*s));
  if(hat==='hardhat'){ g.push(poly([[hx-17*s,hy-5*s],[hx-12*s,hy-17*s],[hx+12*s,hy-17*s],[hx+17*s,hy-5*s]], PAL.gold,2.6*s));
                       g.push(line([[hx-17*s,hy-5*s],[hx+17*s,hy-5*s]],2.2*s)); }
  return `<g${o.flip?` transform="translate(${(2*x).toFixed(1)},0) scale(-1,1)"`:''}>${g.join('')}</g>`;
}

/* ---------- buildings ---------- */
/* Chinese hall: upturned eaves, pillars, plinth */
export function hall(x, y, w=120, h=70, o={}){
  const g=[], rc=o.roof||PAL.roof, wc=o.wall||PAL.wall;
  const ew = w*0.62;                                   // eave overhang
  g.push(poly([[x-w/2,y],[x+w/2,y],[x+w/2,y-h],[x-w/2,y-h]], wc, 2.8));
  // pillars
  for(let i=1;i<=3;i++){ const px = x-w/2 + (w*i/4); g.push(line([[px,y],[px,y-h]],2.2,'#A98D68')); }
  // roof with curved eaves
  const ry = y-h, rh = h*0.55;
  g.push(`<path d="M${x-w/2-ew*0.4},${ry+3} Q${x-w*0.42},${ry-rh*0.35} ${x-w*0.26},${ry-rh*0.82}
     Q${x},${ry-rh*1.06} ${x+w*0.26},${ry-rh*0.82} Q${x+w*0.42},${ry-rh*0.35} ${x+w/2+ew*0.4},${ry+3}
     Q${x+w*0.34},${ry+9} ${x},${ry+7} Q${x-w*0.34},${ry+9} ${x-w/2-ew*0.4},${ry+3} Z"
     fill="${rc}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`);
  g.push(`<path d="M${x-w*0.27},${ry-rh*0.84} Q${x},${ry-rh*1.08} ${x+w*0.27},${ry-rh*0.84}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`);
  g.push(line([[x-w*0.3,ry-rh*0.42],[x+w*0.3,ry-rh*0.42]],1.6,'rgba(0,0,0,.2)'));
  // upturned eave tips
  g.push(`<path d="M${x-w/2-ew*0.4},${ry+3} q${-6},${-7} ${-11},${-4}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`);
  g.push(`<path d="M${x+w/2+ew*0.4},${ry+3} q${6},${-7} ${11},${-4}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`);
  if(o.door) g.push(poly([[x-11,y],[x-11,y-26],[x+11,y-26],[x+11,y]], '#7E5236',2.4));
  if(o.plinth) g.push(poly([[x-w/2-8,y],[x+w/2+8,y],[x+w/2+4,y+9],[x-w/2-4,y+9]], PAL.stone,2.6));
  return `<g>${g.join('')}</g>`;
}
/* simple village house */
export function hut(x,y,w=52,o={}){
  const h=w*0.52, g=[];
  g.push(poly([[x-w/2,y],[x+w/2,y],[x+w/2,y-h],[x-w/2,y-h]], o.wall||'#E6D9BE',2.4));
  g.push(poly([[x-w/2-7,y-h],[x,y-h-w*0.42],[x+w/2+7,y-h]], o.roof||'#9C7B5C',2.6));
  if(o.win) g.push(poly([[x-8,y-h+12],[x+8,y-h+12],[x+8,y-6],[x-8,y-6]],'#9DB7BE',2));
  return g.join('');
}
/* junk / sailing boat */
export function boat(x,y,s=1,o={}){
  const g=[];
  g.push(poly([[x-40*s,y],[x+40*s,y],[x+30*s,y+14*s],[x-30*s,y+14*s]], o.hull||PAL.wood,2.8));
  g.push(line([[x,y],[x,y-46*s]],3*s));
  g.push(poly([[x-2*s,y-45*s],[x+26*s,y-37*s],[x+32*s,y-20*s],[x+26*s,y-5*s],[x-2*s,y-9*s]], o.sail||'#EADFC6',2.8));
  g.push(line([[x,y-36*s],[x+29*s,y-28*s]],1.6*s)); g.push(line([[x,y-24*s],[x+29*s,y-17*s]],1.6*s));
  return `<g>${g.join('')}</g>`;
}
/* camel for the overland routes */
export function camel(x,y,s=1){
  const g=[];
  g.push(poly([[x-24*s,y-6*s],[x-20*s,y-18*s],[x-11*s,y-13*s],[x-2*s,y-24*s],[x+8*s,y-13*s],
               [x+18*s,y-18*s],[x+22*s,y-6*s],[x+20*s,y+2*s],[x-22*s,y+2*s]], '#C9A277',2.8));
  g.push(line([[x-16*s,y+2*s],[x-17*s,y+16*s]],3.4*s)); g.push(line([[x-8*s,y+2*s],[x-9*s,y+16*s]],3.2*s));
  g.push(line([[x+10*s,y+2*s],[x+11*s,y+16*s]],3.4*s)); g.push(line([[x+17*s,y+2*s],[x+18*s,y+16*s]],3.2*s));
  g.push(poly([[x+20*s,y-12*s],[x+28*s,y-26*s],[x+33*s,y-25*s],[x+26*s,y-10*s]], '#C9A277',2.6));
  g.push(poly([[x+27*s,y-33*s],[x+38*s,y-31*s],[x+39*s,y-24*s],[x+28*s,y-23*s]], '#C9A277',2.6));
  g.push(`<circle cx="${(x+32*s).toFixed(1)}" cy="${(y-29*s).toFixed(1)}" r="${(1.7*s).toFixed(1)}" fill="${INK}"/>`);
  g.push(poly([[x-24*s,y-8*s],[x-30*s,y-4*s],[x-24*s,y+1*s]], '#C9A277',2.2));
  return `<g>${g.join('')}</g>`;
}
/* modern tower */
export function tower(x,y,w,h,o={}){
  const g=[]; const c=o.fill||'#BFCBD6';
  g.push(poly([[x-w/2,y],[x+w/2,y],[x+w/2,y-h],[x-w/2,y-h]], c, 2.6));
  const rows=Math.max(2,Math.floor(h/22)), cols=Math.max(2,Math.floor(w/16));
  for(let i=1;i<=rows;i++) for(let k=0;k<cols;k++){
    const wx=x-w/2+6+k*((w-10)/cols), wy=y-h+10+(i-1)*((h-14)/rows);
    if(r()>0.28) g.push(`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${((w-12)/cols*0.56).toFixed(1)}" height="7" fill="${o.lit&&r()>0.45?PAL.gold:'#7F93A3'}" stroke="${INK}" stroke-width="1"/>`);
  }
  if(o.antenna) g.push(line([[x,y-h],[x,y-h-18]],2.4));
  return `<g>${g.join('')}</g>`;
}
/* factory shed with saw-tooth roof */
export function factory(x,y,w=130,h=52,o={}){
  const g=[];
  g.push(poly([[x-w/2,y],[x+w/2,y],[x+w/2,y-h],[x-w/2,y-h]], o.fill||'#CBB89A',2.6));
  const n=4; for(let i=0;i<n;i++){ const sx=x-w/2+i*(w/n);
    g.push(poly([[sx,y-h],[sx+w/n*0.55,y-h-16],[sx+w/n,y-h]], '#B5A184',2.2)); }
  g.push(poly([[x+w/2-26,y-h-6],[x+w/2-12,y-h-6],[x+w/2-12,y-h-44],[x+w/2-26,y-h-44]], '#9C8A72',2.4));
  if(o.smoke){ for(let i=0;i<3;i++) g.push(ell(x+w/2-19+i*7, y-h-52-i*13, 9+i*3, 7+i*2, 'rgba(180,180,180,.5)',1.6)); }
  return `<g>${g.join('')}</g>`;
}
/* friendly robot for the future section */
export function robot(x,y,s=1,o={}){
  const g=[];
  g.push(poly([[x-14*s,y],[x+14*s,y],[x+12*s,y-26*s],[x-12*s,y-26*s]], o.fill||'#9FB5C4',2.6));
  g.push(poly([[x-15*s,y-28*s],[x+15*s,y-28*s],[x+15*s,y-50*s],[x-15*s,y-50*s]], o.fill||'#B6C7D2',2.6));
  g.push(`<circle cx="${(x-6*s).toFixed(1)}" cy="${(y-40*s).toFixed(1)}" r="${(3.4*s).toFixed(1)}" fill="${INK}"/>`);
  g.push(`<circle cx="${(x+6*s).toFixed(1)}" cy="${(y-40*s).toFixed(1)}" r="${(3.4*s).toFixed(1)}" fill="${INK}"/>`);
  g.push(line([[x-4*s,y-32*s],[x+4*s,y-32*s]],2*s));
  g.push(line([[x,y-50*s],[x,y-58*s]],2.4*s)); g.push(`<circle cx="${x}" cy="${(y-60*s).toFixed(1)}" r="${(3*s).toFixed(1)}" fill="${PAL.vermilion}" stroke="${INK}" stroke-width="2"/>`);
  g.push(line([[x-14*s,y-20*s],[x-24*s,y-10*s]],3*s)); g.push(line([[x+14*s,y-20*s],[x+24*s,y-10*s]],3*s));
  g.push(line([[x-8*s,y],[x-8*s,y+8*s]],3.4*s)); g.push(line([[x+8*s,y],[x+8*s,y+8*s]],3.4*s));
  return `<g>${g.join('')}</g>`;
}
/* microchip */
export function chip(x,y,s=1){
  const g=[]; const w=44*s;
  for(let i=0;i<5;i++){ const t=-w/2+9*s+i*((w-18*s)/4);
    g.push(line([[x+t,y-w/2],[x+t,y-w/2-8*s]],2.4*s)); g.push(line([[x+t,y+w/2],[x+t,y+w/2+8*s]],2.4*s));
    g.push(line([[x-w/2,y+t],[x-w/2-8*s,y+t]],2.4*s)); g.push(line([[x+w/2,y+t],[x+w/2+8*s,y+t]],2.4*s)); }
  g.push(poly([[x-w/2,y-w/2],[x+w/2,y-w/2],[x+w/2,y+w/2],[x-w/2,y+w/2]], '#8FA8B8',2.8));
  g.push(poly([[x-w/5,y-w/5],[x+w/5,y-w/5],[x+w/5,y+w/5],[x-w/5,y+w/5]], '#5F7D90',2.2));
  return `<g>${g.join('')}</g>`;
}
export function tree(x,y,s=1){
  return line([[x,y],[x,y-18*s]],3*s) + ell(x,y-28*s,15*s,14*s,PAL.leaf,2.6);
}
export function cloud(x,y,s=1){
  return `<path d="M${x-26*s},${y+6*s} a${11*s},${11*s} 0 0 1 ${4*s},${-16*s} a${14*s},${14*s} 0 0 1 ${24*s},${-7*s} a${12*s},${12*s} 0 0 1 ${22*s},${6*s} a${10*s},${10*s} 0 0 1 ${2*s},${17*s} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="${2.4*s}" stroke-linejoin="round"/>`;
}
export function mountain(x,y,w=120,h=60,fill='#A9B6A2'){
  return poly([[x-w/2,y],[x-w*0.22,y-h*0.72],[x-w*0.08,y-h],[x+w*0.06,y-h*0.66],[x+w*0.2,y-h*0.84],[x+w/2,y]], fill,2.8)
       + poly([[x-w*0.18,y-h*0.78],[x-w*0.08,y-h],[x+w*0.01,y-h*0.74],[x-w*0.06,y-h*0.7]], '#F6F2E8',2)
       + line([[x+w*0.2,y-h*0.84],[x+w*0.26,y-h*0.5]],2,'rgba(0,0,0,.2)');
}
/* a hand-drawn banner for titles */
export function banner(x,y,w,text,sub){
  const h=54;
  return `<g><path d="M${x-w/2},${y-h/2} Q${x},${y-h/2-8} ${x+w/2},${y-h/2} L${x+w/2},${y+h/2} Q${x},${y+h/2+8} ${x-w/2},${y+h/2} Z" fill="#F6EEDC" stroke="${INK}" stroke-width="3"/>
   <text x="${x}" y="${y+(sub?-2:7)}" text-anchor="middle" class="art-title">${text}</text>
   ${sub?`<text x="${x}" y="${y+18}" text-anchor="middle" class="art-sub">${sub}</text>`:''}</g>`;
}
