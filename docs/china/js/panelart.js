/* panelart.js — illustrated banners for the eight category panels.
   Everything is composed from the hand-drawn primitives in art.js plus a few
   local shapes. Each scene is era-aware: opening Economy & Trade under the Tang
   gives a caravan, under Modern it gives a container port. Original artwork,
   drawn from scratch — no traced or external images. */
import * as A from './art.js';

const INK = '#2B2B2B';
const W = 340, H = 112, GY = 94;          // canvas and ground line

/* ---------- which of five era bands a period belongs to ---------- */
const BAND = {
  neolithic:'early', xia:'early', shang:'early', 'zhou-w':'early',
  chunqiu:'early', zhanguo:'early',
  qin:'imperial', 'han-w':'imperial', 'han-e':'imperial',
  sanguo:'imperial', jin:'imperial', nanbei:'imperial',
  sui:'golden', tang:'golden', wudai:'golden', 'song-n':'golden', 'song-s':'golden',
  yuan:'late', ming:'late', qing:'late',
  roc:'modern', 'prc-early':'modern', reform:'modern', modern:'modern'
};
export const bandOf = id => BAND[id] || 'imperial';

/* era-appropriate dress for the little people */
const ROBE = {early:'#8C9E7E', imperial:'#8FA8C4', golden:'#C3272B', late:'#6E8BA8', modern:'#4F6B82'};
const HAT  = {early:'none', imperial:'scholar', golden:'scholar', late:'cap', modern:'hardhat'};

/* ---------- small local shapes art.js doesn't carry ---------- */
const P = (pts,fill,sw=2.5)=>`<path d="${pts.map((q,i)=>`${i?'L':'M'}${q[0]},${q[1]}`).join('')}Z" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const L = (pts,sw=2.3,c=INK)=>`<path d="${pts.map((q,i)=>`${i?'L':'M'}${q[0]},${q[1]}`).join('')}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;

function ground(){
  return `<path d="M0,${GY} Q${W*0.3},${GY-3} ${W*0.55},${GY} T${W},${GY-1}" fill="none" stroke="${INK}" stroke-width="2.6"/>`;
}
/* square-holed cash coin */
function coin(x,y,s=1){
  return `<g><circle cx="${x}" cy="${y}" r="${13*s}" fill="#E5B95F" stroke="${INK}" stroke-width="${2.4*s}"/>
    <rect x="${x-4*s}" y="${y-4*s}" width="${8*s}" height="${8*s}" fill="#F4EBD8" stroke="${INK}" stroke-width="${1.8*s}"/></g>`;
}
/* rolled scroll */
function scroll(x,y,s=1){
  /* an open sheet with a roller at each end, so it reads as a document */
  return `<g>${P([[x-19*s,y-13*s],[x+19*s,y-13*s],[x+19*s,y+13*s],[x-19*s,y+13*s]],'#F7F0DC',2.5)}
    ${L([[x-12*s,y-6*s],[x+12*s,y-6*s]],1.7,'#6E6253')}
    ${L([[x-12*s,y],[x+12*s,y]],1.7,'#6E6253')}
    ${L([[x-12*s,y+6*s],[x+4*s,y+6*s]],1.7,'#6E6253')}
    ${P([[x-26*s,y-15*s],[x-19*s,y-15*s],[x-19*s,y+15*s],[x-26*s,y+15*s]],'#B07A52',2.4)}
    ${P([[x+19*s,y-15*s],[x+26*s,y-15*s],[x+26*s,y+15*s],[x+19*s,y+15*s]],'#B07A52',2.4)}</g>`;
}
/* hanging lantern */
function lantern(x,y,s=1,c='#C3272B'){
  return `<g>${L([[x,y-26*s],[x,y-15*s]],2.2)}
    <ellipse cx="${x}" cy="${y}" rx="${12*s}" ry="${15*s}" fill="${c}" stroke="${INK}" stroke-width="2.5"/>
    ${P([[x-7*s,y-16*s],[x+7*s,y-16*s],[x+7*s,y-13*s],[x-7*s,y-13*s]],'#E5B95F',2)}
    ${P([[x-7*s,y+13*s],[x+7*s,y+13*s],[x+7*s,y+16*s],[x-7*s,y+16*s]],'#E5B95F',2)}
    ${L([[x,y+16*s],[x,y+25*s]],2,'#E5B95F')}</g>`;
}
/* market stall */
function stall(x,y,s=1,c='#C3272B'){
  return `<g>${P([[x-21*s,y],[x+21*s,y],[x+21*s,y-17*s],[x-21*s,y-17*s]],'#E8DCC2',2.4)}
    ${P([[x-27*s,y-17*s],[x-16*s,y-31*s],[x+16*s,y-31*s],[x+27*s,y-17*s]],c,2.5)}
    ${L([[x-21*s,y],[x-21*s,y-17*s]],2)}${L([[x+21*s,y],[x+21*s,y-17*s]],2)}</g>`;
}
/* crenellated wall segment */
function rampart(x,y,w,h){
  const g=[P([[x,y],[x+w,y],[x+w,y-h],[x,y-h]],'#CFC3A8',2.6)];
  for(let i=0;i<Math.floor(w/17);i++){
    const bx=x+4+i*17;
    g.push(P([[bx,y-h],[bx+10,y-h],[bx+10,y-h-7],[bx,y-h-7]],'#CFC3A8',2.2));
  }
  for(let i=1;i<3;i++) g.push(L([[x,y-h*i/3],[x+w,y-h*i/3]],1.3,'rgba(43,43,43,.3)'));
  return `<g>${g.join('')}</g>`;
}
/* flat pagoda silhouette */
function pagodaFlat(x,y,s=1,tiers=4){
  const g=[];
  for(let t=0;t<tiers;t++){
    const w=(46-t*7)*s, ty=y-t*20*s;
    g.push(P([[x-w/2,ty],[x+w/2,ty],[x+w/2,ty-13*s],[x-w/2,ty-13*s]],'#E8DCC2',2.3));
    g.push(P([[x-w/2-8*s,ty-13*s],[x+w/2+8*s,ty-13*s],[x+w/2*0.6,ty-22*s],[x-w/2*0.6,ty-22*s]],'#C0604C',2.4));
  }
  g.push(L([[x,y-tiers*20*s+2*s],[x,y-tiers*20*s-9*s]],2.4));
  return `<g>${g.join('')}</g>`;
}
/* kiln / furnace */
function kiln(x,y,s=1){
  return `<g>${P([[x-20*s,y],[x+20*s,y],[x+14*s,y-26*s],[x-14*s,y-26*s]],'#B5967A',2.6)}
    ${P([[x-8*s,y],[x+8*s,y],[x+8*s,y-12*s],[x-8*s,y-12*s]],'#C3272B',2.3)}
    <ellipse cx="${x}" cy="${y-30*s}" rx="${9*s}" ry="${6*s}" fill="rgba(180,180,180,.55)" stroke="${INK}" stroke-width="1.6"/>
    <ellipse cx="${x+5*s}" cy="${y-42*s}" rx="${11*s}" ry="${7*s}" fill="rgba(180,180,180,.4)" stroke="${INK}" stroke-width="1.5"/></g>`;
}
/* tower crane */
function crane(x,y,s=1){
  return `<g>${L([[x,y],[x,y-62*s]],3*s)}${L([[x-26*s,y-62*s],[x+34*s,y-62*s]],3*s)}
    ${L([[x,y-62*s],[x+26*s,y-50*s]],1.8)}${L([[x,y-62*s],[x-20*s,y-52*s]],1.8)}
    ${L([[x+26*s,y-62*s],[x+26*s,y-44*s]],2)}
    ${P([[x+21*s,y-44*s],[x+31*s,y-44*s],[x+31*s,y-35*s],[x+21*s,y-35*s]],'#E5B95F',2.2)}
    ${L([[x-7*s,y],[x+7*s,y]],2.6)}</g>`;
}
/* shipping container */
function container(x,y,w=34,h=16,c='#62947A'){
  const g=[P([[x-w/2,y],[x+w/2,y],[x+w/2,y-h],[x-w/2,y-h]],c,2.3)];
  for(let i=1;i<5;i++) g.push(L([[x-w/2+i*(w/5),y],[x-w/2+i*(w/5),y-h]],1.2,'rgba(43,43,43,.35)'));
  return `<g>${g.join('')}</g>`;
}
/* workbench / table */
function bench(x,y,w=96){
  return `<g>${P([[x-w/2,y-7],[x+w/2,y-7],[x+w/2,y],[x-w/2,y]],'#B07A52',2.6)}
    ${L([[x-w/2+8,y],[x-w/2+8,y+0.1]],2)}
    ${P([[x-w/2+7,y],[x-w/2+13,y],[x-w/2+13,y+14],[x-w/2+7,y+14]],'#9C6B45',2.3)}
    ${P([[x+w/2-13,y],[x+w/2-7,y],[x+w/2-7,y+14],[x+w/2-13,y+14]],'#9C6B45',2.3)}</g>`;
}
/* sack of grain */
function sack(x,y,s=1){
  return `<g>${P([[x-11*s,y],[x+11*s,y],[x+8*s,y-17*s],[x-8*s,y-17*s]],'#D8C79F',2.5)}
    ${P([[x-6*s,y-17*s],[x+6*s,y-17*s],[x+4*s,y-22*s],[x-4*s,y-22*s]],'#C2AE84',2.2)}</g>`;
}
/* porcelain vase */
function vase(x,y,s=1){
  return `<g><path d="M${x-7*s},${y-30*s} q${-9*s},${12*s} ${-6*s},${20*s} q${3*s},${10*s} ${13*s},${10*s}
    q${10*s},0 ${13*s},${-10*s} q${3*s},${-8*s} ${-6*s},${-20*s} Z" fill="#DCE6EA" stroke="${INK}" stroke-width="2.5"/>
    <path d="M${x-7*s},${y-30*s} h${14*s}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M${x-9*s},${y-10*s} q${9*s},${5*s} ${18*s},0" fill="none" stroke="#5F7D90" stroke-width="1.8"/>
    <path d="M${x-8*s},${y-16*s} q${8*s},${4*s} ${16*s},0" fill="none" stroke="#5F7D90" stroke-width="1.6"/></g>`;
}
/* portrait medallion */
function medallion(x,y,r,inner){
  return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#F7EFDC" stroke="${INK}" stroke-width="2.8"/>
    <clipPath id="m${x}${y}"><circle cx="${x}" cy="${y}" r="${r-2}"/></clipPath>
    <g clip-path="url(#m${x}${y})">${inner}</g>
    <circle cx="${x}" cy="${y}" r="${r-5}" fill="none" stroke="#E5B95F" stroke-width="1.6"/></g>`;
}

/* ---------- the eight scenes, one per sidebar tab ---------- */
const pp = (x,b,s=0.55,o={}) => A.person(x,GY,s,{robe:ROBE[b],hat:HAT[b],...o});

const SCENE = {

  overview(b){
    if(b==='early') return A.mountain(46,GY,118,58,'#AFBCA8')+A.mountain(120,GY,88,42,'#BDC7B2')
      +A.hut(196,GY,46,{win:1})+A.hut(252,GY,38)+A.tree(300,GY,0.8)+pp(160,b,0.5);
    if(b==='imperial') return A.mountain(40,GY,100,48,'#B4C0AC')+rampart(84,GY,120,26)
      +A.hall(256,GY,96,44,{door:1,plinth:1})+pp(216,b,0.5)+pp(312,b,0.48,{hat:'helmet'});
    if(b==='golden') return A.mountain(34,GY,86,40,'#B9C4B0')+pagodaFlat(98,GY,0.82)
      +A.hall(214,GY,92,42,{door:1,plinth:1})+lantern(286,36,0.7)+lantern(314,30,0.6,'#E5B95F')
      +pp(166,b,0.5)+pp(260,b,0.48);
    if(b==='late') return rampart(16,GY,104,30)+A.hall(190,GY,104,46,{door:1,plinth:1})
      +A.boat(296,GY-6,0.56)+pp(146,b,0.5)+pp(238,b,0.48,{hat:'scholar'});
    return A.tower(58,GY,30,66,{lit:1,antenna:1})+A.tower(100,GY,24,48,{lit:1})
      +A.factory(186,GY,88,36,{smoke:1})+A.tower(290,GY,28,58,{lit:1})+pp(142,b,0.5);
  },

  politics(b){
    const dais = P([[112,GY],[228,GY],[222,GY-11],[118,GY-11]],'#C9BFAE',2.6);
    if(b==='early') return A.mountain(38,GY,84,36,'#B4C0AC')+dais+pp(170,b,0.62,{hat:'none'})
      +pp(124,b,0.46)+pp(216,b,0.46)+coin(300,56,0.7)+scroll(296,84,0.62);
    if(b==='imperial') return dais+pp(170,b,0.66,{hat:'crown',robe:'#C3272B'})
      +pp(118,b,0.48)+pp(222,b,0.48)+rampart(16,GY,76,22)+scroll(292,GY-16,0.78);
    if(b==='golden') return dais+pp(170,b,0.66,{hat:'crown',robe:'#C3272B'})
      +pp(116,b,0.5,{hat:'scholar'})+pp(224,b,0.5,{hat:'scholar'})
      +scroll(60,46,0.8)+scroll(64,76,0.7)+lantern(300,34,0.62);
    if(b==='late') return dais+pp(170,b,0.66,{hat:'crown',robe:'#E5B95F'})
      +pp(116,b,0.5)+pp(224,b,0.5)+rampart(14,GY,74,26)+A.hall(296,GY,62,30,{door:1});
    return P([[136,GY],[204,GY],[200,GY-26],[140,GY-26]],'#8FA8C4',2.6)
      +pp(170,b,0.6,{hat:'none',robe:'#4F6B82'})+pp(92,b,0.48)+pp(248,b,0.48)
      +A.tower(300,GY,26,52,{lit:1})+L([[60,GY-54],[60,GY-10]],2.6)
      +P([[60,GY-54],[104,GY-48],[60,GY-38]],'#C3272B',2.4);
  },

  culture(b){
    if(b==='early') return kiln(60,GY,0.82)+A.hut(150,GY,42,{win:1})+pp(206,b,0.52)
      +pp(240,b,0.5)+A.tree(300,GY,0.85)+A.cloud(282,26,0.6);
    if(b==='imperial') return scroll(62,GY-26,0.95)+A.hall(168,GY,78,36,{door:1})
      +pp(236,b,0.54)+pp(276,b,0.5)+lantern(308,32,0.6,'#E5B95F')+A.cloud(50,24,0.55);
    if(b==='golden') return lantern(44,34,0.85)+lantern(80,26,0.7,'#E5B95F')+lantern(114,38,0.75)
      +A.hall(196,GY,84,38,{door:1,plinth:1})+pp(58,b,0.54)+pp(100,b,0.5)
      +scroll(292,GY-22,0.8)+coin(300,34,0.6);
    if(b==='late') return lantern(42,30,0.8)+A.hall(140,GY,80,36,{roof:'#8C6E8E',door:1})
      +pp(212,b,0.56,{robe:'#C3272B'})+pp(252,b,0.52,{robe:'#E5B95F'})
      +stall(306,GY,0.85,'#8C6E8E')+lantern(80,24,0.62,'#E5B95F');
    return A.tower(40,GY,26,52,{lit:1})+pp(104,b,0.56,{hat:'none'})+pp(142,b,0.52,{hat:'none'})
      +lantern(196,28,0.7)+lantern(228,22,0.58,'#E5B95F')+stall(252,GY,0.86,'#62947A')
      +pp(300,b,0.5,{hat:'none',robe:'#C3272B'})+A.tower(324,GY,22,42,{lit:1})
      +vase(182,GY,0.62);
  },

  building(b){
    if(b==='early') return P([[40,GY],[150,GY],[150,GY-30],[40,GY-30]],'#CFC3A8',2.6)
      +L([[40,GY-12],[150,GY-12]],1.4,'rgba(43,43,43,.3)')+L([[40,GY-22],[150,GY-22]],1.4,'rgba(43,43,43,.3)')
      +pp(186,b,0.54)+pp(222,b,0.5)+A.hut(290,GY,44)+A.cloud(282,24,0.6);
    if(b==='imperial') return rampart(18,GY,150,34)+rampart(176,GY,62,30)
      +pp(258,b,0.54,{hat:'coolie'})+pp(294,b,0.5,{hat:'coolie'})+A.mountain(316,GY,60,34,'#B4C0AC');
    if(b==='golden') return pagodaFlat(74,GY,1,5)+A.hall(200,GY,92,42,{door:1,plinth:1})
      +pp(274,b,0.52)+L([[300,GY],[300,GY-46]],2.4)+L([[286,GY-22],[316,GY-30]],2.2)+A.cloud(246,22,0.55);
    if(b==='late') return rampart(14,GY,84,28)+A.hall(176,GY,112,50,{door:1,plinth:1})
      +pagodaFlat(292,GY,0.7,4)+pp(126,b,0.5,{hat:'coolie'});
    return crane(70,GY,1)+A.tower(168,GY,34,70,{lit:1,antenna:1})
      +P([[212,GY],[248,GY],[248,GY-40],[212,GY-40]],'#C6CDD2',2.5)
      +L([[212,GY-14],[248,GY-14]],1.4,'rgba(43,43,43,.3)')+L([[212,GY-27],[248,GY-27]],1.4,'rgba(43,43,43,.3)')
      +pp(292,b,0.54,{hat:'hardhat'})+A.tower(322,GY,22,40,{lit:1});
  },

  economy(b){
    if(b==='early') return stall(52,GY,0.9,'#8C9E7E')+pp(106,b,0.52)+pp(140,b,0.5)
      +sack(182,GY,1)+sack(208,GY,0.82)+A.hut(258,GY,40)+A.tree(312,GY,0.78)+coin(304,34,0.68);
    if(b==='imperial') return A.camel(56,GY,0.7)+A.camel(116,GY,0.6)+pp(166,b,0.5,{hat:'coolie'})
      +stall(224,GY,0.88,'#C3272B')+sack(282,GY,0.9)+pp(312,b,0.48)
      +coin(292,30,0.8)+coin(316,52,0.64);
    if(b==='golden') return A.boat(62,GY-2,0.62)+stall(158,GY,0.9,'#C3272B')+stall(216,GY,0.82,'#E5B95F')
      +pp(124,b,0.5)+pp(188,b,0.48)+sack(268,GY,0.86)+A.camel(306,GY,0.52)
      +coin(292,28,0.76)+coin(316,48,0.62);
    if(b==='late') return A.boat(60,GY-2,0.64)+A.boat(136,GY-4,0.46)+stall(212,GY,0.88,'#8C6E8E')
      +sack(264,GY,0.88)+pp(300,b,0.5)+container(314,GY,30,15,'#62947A')
      +coin(286,28,0.78)+coin(312,50,0.62);
    return container(52,GY,40,18,'#C3272B')+container(52,GY-19,40,18,'#62947A')
      +container(98,GY,40,18,'#8FA8C4')+container(98,GY-19,40,18,'#E5B95F')
      +crane(166,GY,0.82)+A.boat(252,GY-2,0.58)+pp(300,b,0.5,{hat:'hardhat'})
      +A.tower(326,GY,22,44,{lit:1})+coin(312,24,0.58);
  },

  innov(b){
    const BY = GY-14;                       // bench top: props sit here
    if(b==='early') return kiln(54,GY,1)+bench(196,GY,104)
      +`<ellipse cx="166" cy="${BY-9}" rx="15" ry="11" fill="#B5967A" stroke="${INK}" stroke-width="2.4"/>`
      +`<ellipse cx="206" cy="${BY-7}" rx="12" ry="9" fill="#C9BFAE" stroke="${INK}" stroke-width="2.3"/>`
      +`<ellipse cx="238" cy="${BY-8}" rx="10" ry="10" fill="#D8C79F" stroke="${INK}" stroke-width="2.3"/>`
      +pp(118,b,0.5)+A.hut(304,GY,40);
    if(b==='imperial') return bench(108,GY,116)+scroll(78,BY-13,0.72)
      +`<circle cx="140" cy="${BY-18}" r="17" fill="#B07A52" stroke="${INK}" stroke-width="2.7"/>`
      +`<circle cx="140" cy="${BY-18}" r="6" fill="#E5B95F" stroke="${INK}" stroke-width="2"/>`
      +pp(196,b,0.54,{hat:'scholar'})+kiln(258,GY,0.74)+sack(312,GY,0.9);
    if(b==='golden') return bench(116,GY,128)
      +P([[70,BY-30],[118,BY-30],[118,BY-2],[70,BY-2]],'#B07A52',2.5)
      +L([[77,BY-24],[111,BY-24]],1.9,'#F7F0DC')+L([[77,BY-17],[104,BY-17]],1.9,'#F7F0DC')
      +L([[77,BY-10],[111,BY-10]],1.9,'#F7F0DC')
      +`<circle cx="156" cy="${BY-17}" r="17" fill="#E8DCC2" stroke="${INK}" stroke-width="2.7"/>`
      +L([[145,BY-23],[167,BY-11]],2.8,'#C3272B')
      +pp(212,b,0.54,{hat:'scholar'})+scroll(276,GY-20,0.8)+lantern(316,24,0.55);
    if(b==='late') return bench(104,GY,112)+scroll(76,BY-13,0.72)
      +vase(138,BY,0.72)
      +L([[228,GY],[228,GY-42]],3.4)+P([[219,GY-42],[237,GY-42],[228,GY-62]],'#C3272B',2.6)
      +P([[221,GY-6],[235,GY-6],[238,GY+4],[218,GY+4]],'#E5B95F',2.3)
      +L([[222,GY-28],[212,GY-19]],2.2,'#E5B95F')+L([[234,GY-28],[244,GY-19]],2.2,'#E5B95F')
      +pp(188,b,0.52,{hat:'scholar'})+kiln(290,GY,0.72)+sack(322,GY,0.78);
    return A.chip(54,GY-30,0.92)+A.robot(136,GY,0.8)+bench(238,GY,96)
      +A.chip(216,BY-16,0.5)+`<rect x="248" y="${BY-26}" width="34" height="24" rx="3" fill="#8FA8B8" stroke="${INK}" stroke-width="2.4"/>`
      +L([[252,BY-20],[278,BY-20]],1.6,'#E8F0F4')+L([[252,BY-14],[270,BY-14]],1.6,'#E8F0F4')
      +A.tower(318,GY,22,46,{lit:1,antenna:1})+L([[78,GY-30],[112,GY-36]],1.8,'#62947A');
  },

  figures(b,p){
    /* three medallion portraits in era dress, on a backdrop that places them */
    const dress = {
      early:   [{hat:'none',robe:'#8C9E7E'},{hat:'none',robe:'#B07A52'},{hat:'coolie',robe:'#7FA882'}],
      imperial:[{hat:'crown',robe:'#C3272B'},{hat:'scholar',robe:'#8FA8C4'},{hat:'helmet',robe:'#6E8BA8'}],
      golden:  [{hat:'crown',robe:'#C3272B'},{hat:'scholar',robe:'#E5B95F'},{hat:'coolie',robe:'#62947A'}],
      late:    [{hat:'crown',robe:'#E5B95F'},{hat:'cap',robe:'#8C6E8E'},{hat:'scholar',robe:'#6E8BA8'}],
      modern:  [{hat:'none',robe:'#4F6B82'},{hat:'hardhat',robe:'#C3272B'},{hat:'none',robe:'#62947A'}]
    }[b];
    const back = {
      early:   A.mountain(40,GY,90,34,'#BDC7B2')+A.hut(300,GY,38)+A.tree(258,GY,0.6),
      imperial:rampart(10,GY,70,20)+A.hall(300,GY,60,26,{door:1}),
      golden:  pagodaFlat(28,GY,0.5,4)+lantern(312,22,0.55)+A.hall(276,GY,54,24,{door:1}),
      late:    rampart(8,GY,64,20)+A.boat(306,GY,0.38),
      modern:  A.tower(34,GY,20,44,{lit:1})+A.tower(304,GY,22,48,{lit:1,antenna:1})+crane(272,GY,0.46)
    }[b];
    const med = dress.map((d,i)=>{
      const cx = 86 + i*84;
      return medallion(cx, 50, 31, A.person(cx, 88, 0.86, d));
    }).join('');
    return back + L([[16,GY+4],[324,GY+4]],2.2,'rgba(43,43,43,.38)') + med;
  },

  lens(b){
    /* a builder examining whatever this era was actually making */
    const mx=258, my=46;
    const subject = {
      early:    `<ellipse cx="${mx}" cy="${my}" rx="13" ry="10" fill="#B5967A" stroke="${INK}" stroke-width="2.4"/>`,
      imperial: coin(mx,my,0.78),
      golden:   `<g>${P([[mx-14,my-9],[mx+14,my-9],[mx+14,my+9],[mx-14,my+9]],'#B07A52',2.4)}
                 ${L([[mx-9,my-4],[mx+9,my-4]],1.8,'#F4EBD8')}${L([[mx-9,my+1],[mx+4,my+1]],1.8,'#F4EBD8')}</g>`,
      late:     A.boat(mx,my+8,0.3),
      modern:   A.chip(mx,my,0.52)
    }[b];
    const site = {
      early:    A.hut(60,GY,44,{win:1})+kiln(124,GY,0.6),
      imperial: rampart(20,GY,84,26)+A.hall(150,GY,56,26,{door:1})+sack(108,GY,0.7),
      golden:   pagodaFlat(66,GY,0.62,4)+A.hall(140,GY,58,26,{door:1}),
      late:     rampart(24,GY,70,24)+A.hall(140,GY,62,28,{door:1,plinth:1}),
      modern:   A.tower(52,GY,24,52,{lit:1,antenna:1})+crane(126,GY,0.6)
    }[b];
    return site
      + pp(196,b,0.58,{hat:'none'})
      + `<circle cx="${mx}" cy="${my}" r="27" fill="rgba(255,255,255,.5)" stroke="${INK}" stroke-width="3"/>`
      + `<circle cx="${mx}" cy="${my}" r="21" fill="none" stroke="#E5B95F" stroke-width="1.6"/>`
      + subject
      + L([[mx+20,my+20],[mx+40,my+44]],5)
      + A.tree(318,GY,0.66);
  }
};

/* ---------- public API ---------- */
export function panelScene(catId, period){
  const b = bandOf(period && period.id);
  const fn = SCENE[catId];
  if(!fn) return '';
  A.seed(((catId.charCodeAt(0)*7919) ^ (b.length*104729) ^ (catId.length*31)) >>> 0);
  return `<svg class="pscene" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img"
    aria-label="Illustration for this section"><rect width="${W}" height="${H}" fill="none"/>
    ${ground()}${fn(b, period)}</svg>`;
}

/* small symbols for the four Builder's Lens boxes */
export const LENS_ICON = {
  o:`<svg viewBox="0 0 26 26" class="lb-i"><path d="M13 3v8M13 11l7-4M13 11l-7-4" fill="none" stroke="#A8822C" stroke-width="2.4" stroke-linecap="round"/><circle cx="13" cy="16" r="6" fill="none" stroke="#A8822C" stroke-width="2.4"/></svg>`,
  c:`<svg viewBox="0 0 26 26" class="lb-i"><path d="M5 20h16M8 20v-7l5-5 5 5v7" fill="none" stroke="#3F7159" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  r:`<svg viewBox="0 0 26 26" class="lb-i"><path d="M13 4c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10Z" fill="none" stroke="#B03A3E" stroke-width="2.4" stroke-linejoin="round"/><path d="M13 12v5" stroke="#B03A3E" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  h:`<svg viewBox="0 0 26 26" class="lb-i"><circle cx="13" cy="8" r="4" fill="none" stroke="#6B5B86" stroke-width="2.4"/><path d="M5 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="#6B5B86" stroke-width="2.4" stroke-linecap="round"/></svg>`
};

/* Portrait cards for the people named in a Historical Figures panel.
   The names come from the panel's own heading; dress follows the era. */
const CARD_DRESS = {
  early:   [{hat:'none',robe:'#8C9E7E'},{hat:'coolie',robe:'#B07A52'},{hat:'none',robe:'#7FA882'},{hat:'none',robe:'#C2AE84'}],
  imperial:[{hat:'crown',robe:'#C3272B'},{hat:'scholar',robe:'#8FA8C4'},{hat:'helmet',robe:'#6E8BA8'},{hat:'coolie',robe:'#62947A'}],
  golden:  [{hat:'crown',robe:'#C3272B'},{hat:'scholar',robe:'#E5B95F'},{hat:'scholar',robe:'#62947A'},{hat:'coolie',robe:'#8FA8C4'}],
  late:    [{hat:'crown',robe:'#E5B95F'},{hat:'cap',robe:'#8C6E8E'},{hat:'scholar',robe:'#6E8BA8'},{hat:'helmet',robe:'#C3272B'}],
  modern:  [{hat:'none',robe:'#4F6B82'},{hat:'hardhat',robe:'#C3272B'},{hat:'none',robe:'#62947A'},{hat:'cap',robe:'#8C6E8E'}]
};
export function figureCards(title, period){
  const b = bandOf(period && period.id);
  const names = String(title || '')
    .split(/\s*[;,]\s*|\s+and\s+/i).map(t=>t.trim()).filter(Boolean).slice(0,4);
  if(!names.length) return '';
  const d = CARD_DRESS[b];
  const cards = names.map((n,i)=>{
    A.seed(((n.length*7919) ^ (i*104729) ^ 17) >>> 0);
    const art = `<svg viewBox="0 0 70 70" class="fc-art" xmlns="http://www.w3.org/2000/svg">
      ${medallion(35,35,32, A.person(35,66,0.92,d[i%d.length]))}</svg>`;
    return `<div class="fcard">${art}<span>${n}</span></div>`;
  }).join('');
  return `<div class="fcards">${cards}</div>`;
}

/* ---------- era emblems: one small motif per period ----------
   Used in the expanded timeline and the period card, so eras are scannable
   by shape as well as by name. Drawn at 56x46 with a baseline at y=40. */
const E = {
  pot:   c=>`<path d="M20,40 q-5,-9 0,-15 q8,-5 16,0 q5,6 0,15 Z" fill="${c}" stroke="${INK}" stroke-width="2.3"/><path d="M19,25 h18" stroke="${INK}" stroke-width="2.2"/>`,
  bronze:c=>`<path d="M18,40 h20 l-3,-14 h-14 Z" fill="${c}" stroke="${INK}" stroke-width="2.3"/><path d="M14,26 h28" stroke="${INK}" stroke-width="2.4"/><path d="M22,22 v4 M34,22 v4" stroke="${INK}" stroke-width="2.2"/>`,
  bone:  c=>`<path d="M20,40 q-4,-12 2,-18 q7,-4 13,2 q4,9 -2,16 Z" fill="${c}" stroke="${INK}" stroke-width="2.3"/><path d="M25,30 h7 M28,26 v9 M24,35 l8,-5" stroke="${INK}" stroke-width="1.7"/>`,
  bell:  c=>`<path d="M20,38 q-2,-16 8,-18 q10,2 8,18 Z" fill="${c}" stroke="${INK}" stroke-width="2.3"/><path d="M18,38 h20" stroke="${INK}" stroke-width="2.4"/><path d="M28,20 v-4" stroke="${INK}" stroke-width="2.2"/>`,
  scroll:c=>`<rect x="17" y="23" width="22" height="15" fill="#F7F0DC" stroke="${INK}" stroke-width="2.3"/><rect x="13" y="21" width="5" height="19" fill="${c}" stroke="${INK}" stroke-width="2.1"/><rect x="38" y="21" width="5" height="19" fill="${c}" stroke="${INK}" stroke-width="2.1"/><path d="M21,28 h14 M21,33 h9" stroke="#6E6253" stroke-width="1.6"/>`,
  sword: c=>`<path d="M18,40 L34,16 M38,40 L22,16" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M22,22 h12" stroke="${c}" stroke-width="3"/>`,
  wall:  c=>`<rect x="12" y="26" width="32" height="14" fill="${c}" stroke="${INK}" stroke-width="2.4"/><path d="M14,26 v-5 h5 v5 M24,26 v-5 h5 v5 M34,26 v-5 h5 v5" fill="${c}" stroke="${INK}" stroke-width="2.1"/>`,
  camel: c=>`<path d="M16,40 v-8 q0,-7 7,-7 q3,-5 6,0 q3,-5 6,0 q7,0 7,7 v8" fill="${c}" stroke="${INK}" stroke-width="2.3" stroke-linejoin="round"/><path d="M42,25 q4,-3 2,-7" stroke="${INK}" stroke-width="2.2" fill="none"/>`,
  pagoda:c=>`<path d="M20,40 h16 v-6 h-16 Z M16,34 h24 l-4,-5 h-16 Z M23,29 h10 v-5 h-10 Z M19,24 h18 l-4,-5 h-10 Z" fill="${c}" stroke="${INK}" stroke-width="2.1" stroke-linejoin="round"/><path d="M28,19 v-4" stroke="${INK}" stroke-width="2"/>`,
  boat:  c=>`<path d="M12,34 h32 l-5,7 h-22 Z" fill="${c}" stroke="${INK}" stroke-width="2.3"/><path d="M28,34 v-19" stroke="${INK}" stroke-width="2.4"/><path d="M28,16 q12,3 12,9 q-6,3 -12,2 Z" fill="#EADFC6" stroke="${INK}" stroke-width="2.2"/>`,
  block: c=>`<rect x="14" y="22" width="28" height="18" fill="${c}" stroke="${INK}" stroke-width="2.4"/><path d="M19,28 h18 M19,33 h12" stroke="#F7F0DC" stroke-width="2.2"/>`,
  tent:  c=>`<path d="M14,40 L28,18 L42,40 Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M24,40 v-7 h8 v7" fill="#9C7B5C" stroke="${INK}" stroke-width="2.1"/>`,
  flag:  c=>`<path d="M18,40 v-26" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/><path d="M18,14 l20,4 l-20,5 Z" fill="${c}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`,
  mill:  c=>`<rect x="12" y="26" width="26" height="14" fill="${c}" stroke="${INK}" stroke-width="2.3"/><path d="M12,26 l6,-7 l7,7 l6,-7 l7,7" fill="none" stroke="${INK}" stroke-width="2.2"/><rect x="38" y="16" width="6" height="24" fill="#9C8A72" stroke="${INK}" stroke-width="2.2"/>`,
  crane: c=>`<path d="M20,40 v-24 M8,16 h30" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/><path d="M32,16 v10" stroke="${INK}" stroke-width="2.2"/><rect x="28" y="26" width="9" height="7" fill="${c}" stroke="${INK}" stroke-width="2.1"/>`,
  chip:  c=>`<rect x="17" y="21" width="22" height="22" fill="${c}" stroke="${INK}" stroke-width="2.4" rx="2"/><rect x="24" y="28" width="8" height="8" fill="#5F7D90" stroke="${INK}" stroke-width="1.8"/><path d="M22,21 v-5 M28,21 v-5 M34,21 v-5 M17,27 h-5 M17,34 h-5 M39,27 h5 M39,34 h5" stroke="${INK}" stroke-width="1.9"/>`,
  hall:  c=>`<rect x="18" y="28" width="20" height="12" fill="#E8DCC2" stroke="${INK}" stroke-width="2.3"/><path d="M10,28 q9,-11 18,-11 q9,0 18,11 Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><rect x="25" y="32" width="6" height="8" fill="#7E5236" stroke="${INK}" stroke-width="1.8"/>`,
  lantern:c=>`<ellipse cx="28" cy="29" rx="10" ry="12" fill="${c}" stroke="${INK}" stroke-width="2.4"/><path d="M28,17 v-4 M28,41 v4" stroke="${INK}" stroke-width="2.2"/><path d="M22,18 h12 M22,40 h12" stroke="#E5B95F" stroke-width="2.6"/>`,
  tower: c=>`<rect x="20" y="12" width="16" height="28" fill="${c}" stroke="${INK}" stroke-width="2.4"/><path d="M24,18 h3 M30,18 h3 M24,25 h3 M30,25 h3 M24,32 h3 M30,32 h3" stroke="${INK}" stroke-width="2"/><path d="M28,12 v-4" stroke="${INK}" stroke-width="2"/>`
};
const EMBLEM = {
  neolithic:['pot','#C9A882'],  xia:['bronze','#9CA98E'],   shang:['bone','#E2D7BC'],
  'zhou-w':['bell','#B8A06A'],  chunqiu:['scroll','#B07A52'], zhanguo:['sword','#C3272B'],
  qin:['wall','#CFC3A8'],       'han-w':['camel','#C8A878'], 'han-e':['scroll','#8FA8C4'],
  sanguo:['flag','#C3272B'],    jin:['hall','#9C8AA8'],      nanbei:['pagoda','#8C6E8E'],
  sui:['boat','#A9CBD8'],       tang:['pagoda','#C0604C'],   wudai:['sword','#8A8A8A'],
  'song-n':['block','#B07A52'], 'song-s':['boat','#62947A'], yuan:['tent','#D8C79F'],
  ming:['boat','#C3272B'],      qing:['hall','#E5B95F'],     roc:['flag','#8FA8C4'],
  'prc-early':['mill','#C3272B'], reform:['crane','#E5B95F'], modern:['chip','#8FA8B8']
};
export function eraEmblem(periodId){
  const e = EMBLEM[periodId] || ['hall','#C0604C'];
  const draw = E[e[0]];
  if(!draw) return '';
  return `<svg class="emb" viewBox="0 0 56 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6,42 H50" stroke="rgba(43,43,43,.4)" stroke-width="2"/>${draw(e[1])}</svg>`;
}
