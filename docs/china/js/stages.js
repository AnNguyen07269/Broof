/* stages.js — illustrated overlays drawn above the map during the walkthrough.
   Screen-space (not camera-locked) so the map always stays readable behind them.
   All artwork is generated from js/art.js primitives — original, nothing traced. */
import * as A from './art.js';

const W=1000, H=760;
const wrap = inner => `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .art-title{font:700 26px 'Caveat','Patrick Hand',cursive;fill:#263D50}
    .art-sub{font:italic 13px 'Gentium Book Plus',Georgia,serif;fill:#6B6355}
    .cap{font:500 19px 'Caveat','Patrick Hand',cursive;fill:#2C2418}
    .capsm{font:400 13px 'Gentium Book Plus',Georgia,serif;fill:#4A463E}
    .big{font:700 54px 'Caveat','Patrick Hand',cursive;fill:#263D50}
    .huge{font:700 72px 'Caveat','Patrick Hand',cursive;fill:#C3272B}
    .stat{font:700 31px 'Caveat','Patrick Hand',cursive;fill:#C3272B}
  </style>${inner}</svg>`;

/* parchment card with a slightly irregular border */
function card(x,y,w,h,inner,title,sub){
  const d=`M${x+3},${y} L${x+w-2},${y+2} L${x+w},${y+h-3} L${x+1},${y+h} Z`;
  return `<g><path d="${d}" fill="#FBF6EA" stroke="#2B2B2B" stroke-width="3" stroke-linejoin="round" opacity=".97"/>
   ${title?`<text x="${x+18}" y="${y+32}" class="art-title">${title}</text>`:''}
   ${sub?`<text x="${x+18}" y="${y+50}" class="art-sub">${sub}</text>`:''}
   ${inner}</g>`;
}
const cap = (x,y,t) => `<text x="${x}" y="${y}" class="cap" text-anchor="middle">${t}</text>`;

/* ---- original industry glyphs (no brand marks anywhere) ---- */
function glyph(kind,x,y,s=1){
  const I='#2B2B2B', g=[];
  if(kind==='market'){
    for(let i=0;i<3;i++){ const bx=x-62*s+i*62*s;
      g.push(`<rect x="${bx-24*s}" y="${y-10*s}" width="${48*s}" height="${40*s}" fill="#E8DCC2" stroke="${I}" stroke-width="${2.6*s}"/>`);
      g.push(`<path d="M${bx-32*s},${y-10*s} l${12*s},${-20*s} l${40*s},0 l${12*s},${20*s} Z" fill="${['#C3272B','#E5B95F','#62947A'][i]}" stroke="${I}" stroke-width="${2.6*s}"/>`); }
    g.push(`<path d="M${x-70*s},${y+44*s} L${x+70*s},${y+44*s}" stroke="${I}" stroke-width="${2.6*s}"/>`);
    g.push(`<path d="M${x-30*s},${y+58*s} l${24*s},0 m${12*s},0 l${24*s},0" stroke="#C3272B" stroke-width="${3*s}" stroke-linecap="round"/>`);
  }
  if(kind==='chat'){
    const b=(bx,by,bw,bh,c)=>`<path d="M${bx},${by} h${bw} a8,8 0 0 1 8,8 v${bh} a8,8 0 0 1 -8,8 h${-bw+14} l${-10},12 v-12 h${-4} a8,8 0 0 1 -8,-8 v${-bh} a8,8 0 0 1 8,-8 Z" fill="${c}" stroke="${I}" stroke-width="2.6"/>`;
    g.push(b(x-72*s,y-30*s,70,32,'#8FB89C')); g.push(b(x+2*s,y+4*s,66,30,'#8FA8C4'));
    g.push(`<circle cx="${x-20*s}" cy="${y+58*s}" r="${7*s}" fill="#E5B95F" stroke="${I}" stroke-width="2.4"/>`);
    g.push(`<circle cx="${x+22*s}" cy="${y+62*s}" r="${7*s}" fill="#C3272B" stroke="${I}" stroke-width="2.4"/>`);
    g.push(`<path d="M${x-14*s},${y+56*s} L${x+16*s},${y+60*s}" stroke="${I}" stroke-width="2"/>`);
  }
  if(kind==='tower'){
    g.push(`<path d="M${x-26*s},${y+46*s} L${x-7*s},${y-44*s} L${x+7*s},${y-44*s} L${x+26*s},${y+46*s}" fill="none" stroke="${I}" stroke-width="${3*s}"/>`);
    g.push(`<path d="M${x-19*s},${y+14*s} L${x+19*s},${y+14*s} M${x-13*s},${y-12*s} L${x+13*s},${y-12*s}" stroke="${I}" stroke-width="${2.4*s}"/>`);
    [22,38,54].forEach((r,i)=>{ g.push(`<path d="M${x-r*s},${y-50*s} a${r*s},${r*s} 0 0 1 ${2*r*s},0" fill="none" stroke="#C3272B" stroke-width="${2.6*s}" opacity="${1-i*0.26}"/>`); });
  }
  if(kind==='car'){
    g.push(`<path d="M${x-54*s},${y+14*s} l${10*s},${-26*s} l${28*s},${-12*s} l${34*s},0 l${26*s},${16*s} l${12*s},${22*s} Z" fill="#8FB89C" stroke="${I}" stroke-width="${3*s}" stroke-linejoin="round"/>`);
    g.push(`<path d="M${x-24*s},${y-20*s} l${6*s},${-14*s} l${26*s},0 l${14*s},${14*s} Z" fill="#CFE2EA" stroke="${I}" stroke-width="${2.4*s}"/>`);
    g.push(`<circle cx="${x-28*s}" cy="${y+16*s}" r="${12*s}" fill="#3A3027" stroke="${I}" stroke-width="${2.6*s}"/>`);
    g.push(`<circle cx="${x+30*s}" cy="${y+16*s}" r="${12*s}" fill="#3A3027" stroke="${I}" stroke-width="${2.6*s}"/>`);
    g.push(`<rect x="${x-16*s}" y="${y+36*s}" width="${34*s}" height="${18*s}" rx="3" fill="#E5B95F" stroke="${I}" stroke-width="${2.6*s}"/>`);
    g.push(`<path d="M${x-8*s},${y+45*s} l${8*s},0 m${8*s},0 l${8*s},0" stroke="${I}" stroke-width="${2.2*s}"/>`);
  }
  if(kind==='feed'){
    g.push(`<rect x="${x-32*s}" y="${y-54*s}" width="${64*s}" height="${108*s}" rx="${9*s}" fill="#F2EADC" stroke="${I}" stroke-width="${3*s}"/>`);
    for(let i=0;i<3;i++) g.push(`<rect x="${x-22*s}" y="${(y-40+i*32)*s}" width="${44*s}" height="${24*s}" rx="4" fill="${['#C3272B','#8FA8C4','#E5B95F'][i]}" stroke="${I}" stroke-width="2.2"/>`);
    [[-62,-30],[-62,10],[-62,50]].forEach(([dx,dy],i)=>{
      g.push(`<circle cx="${x+dx*s}" cy="${y+dy*s}" r="${6*s}" fill="#8FB89C" stroke="${I}" stroke-width="2.2"/>`);
      g.push(`<path d="M${(x+dx+8)*s},${(y+dy)*s} L${(x-34)*s},${(y-28+i*32)*s}" stroke="${I}" stroke-width="1.8" opacity=".6"/>`);
    });
  }
  return `<g>${g.join('')}</g>`;
}

/* ---------- the stages ---------- */
const S = {};

S['title-fade'] = () => wrap('');
S['title'] = () => wrap(`
  ${A.banner(500,300,560,'China: The Art of Reinvention','A journey through history, entrepreneurship, and the human spirit')}
  ${A.cloud(170,150,1.1)}${A.cloud(830,186,0.9)}`);

S['villages'] = () => { A.seed(21); return wrap(
  card(44,498,330,222,
    A.hut(120,660,62,{win:1}) + A.hut(196,660,52,{win:1,roof:'#8A6A4E'}) + A.hut(262,662,46,{win:1}) +
    A.person(146,690,0.72,{robe:'#8FB89C',hat:'coolie',arms:'carry'}) +
    A.person(220,692,0.72,{robe:'#C98E72',face:'smile'}) +
    A.tree(316,668,0.9) + cap(209,716,'villages on the river terraces'),
    'It starts with rivers','farming, pottery, silk — long before writing'));
};
S['warring'] = () => { A.seed(33); return wrap(
  card(44,498,364,222,
    A.person(104,650,0.8,{robe:'#9FAFC0',hat:'helmet',face:'calm'}) +
    A.person(160,650,0.8,{robe:'#B49BC0',hat:'helmet',face:'calm'}) +
    A.person(216,650,0.8,{robe:'#E5C07A',hat:'helmet',face:'calm'}) +
    A.person(300,652,0.86,{robe:'#8FB89C',hat:'scholar',face:'calm',arms:'up'}) +
    cap(300,694,'…and philosophers') + cap(160,694,'seven states'),
    'Warring States','competition that was brutal and productive at once'));
};
S['unify'] = () => { A.seed(44); return wrap(
  card(44,510,330,210,
    A.person(130,648,1.0,{robe:'#C3272B',hat:'crown',face:'calm'}) +
    `<text x="248" y="612" class="stat">221 BCE</text>` +
    `<text x="248" y="642" class="capsm">one script</text>` +
    `<text x="248" y="662" class="capsm">one coin</text>` +
    `<text x="248" y="682" class="capsm">one axle width</text>`,
    'Unification','standards as infrastructure'));
};
S['silkroad'] = () => { A.seed(55); return wrap(
  card(44,520,392,200,
    A.camel(120,662,0.92) + A.camel(230,666,0.8) +
    A.person(306,672,0.68,{robe:'#E5C07A',hat:'coolie',arms:'carry'}) +
    A.mountain(380,668,120,56,'#B8BFAE') +
    cap(230,706,'goods relayed, merchant to merchant'),
    'The roads west','silk out, ideas back'));
};
S['city'] = () => { A.seed(66); return wrap(
  card(44,480,392,240,
    A.hall(170,620,180,74,{door:1,plinth:1}) +
    A.hut(320,622,56,{win:1}) + A.hut(382,624,48,{win:1}) +
    A.person(108,678,0.66,{robe:'#8FB89C',hat:'scholar'}) +
    A.person(150,680,0.66,{robe:'#D4A0A0',face:'smile'}) +
    A.person(196,678,0.66,{robe:'#8FA8C4',hat:'cap'}) +
    A.person(242,680,0.66,{robe:'#E5C07A',hat:'coolie',arms:'carry'}) +
    cap(240,712,'a city of perhaps a million people'),
    "Chang'an",'108 walled wards on a single axis'));
};
S['rupture'] = () => { A.seed(77); return wrap(`
  <path d="M250,120 L470,360 L430,400 L210,160 Z" fill="#C3272B" opacity=".2"/>
  <path d="M250,120 L470,360 M268,104 L492,344" stroke="#C3272B" stroke-width="5" stroke-linecap="round" opacity=".85"/>
  ` + card(44,520,340,200,
    A.person(116,664,0.84,{robe:'#9FAFC0',hat:'helmet',face:'oh'}) +
    A.person(190,666,0.78,{robe:'#C98E72',face:'oh',arms:'up'}) +
    `<text x="270" y="634" class="stat">755</text>` +
    `<text x="270" y="664" class="capsm">rebellion</text>` +
    `<text x="270" y="684" class="capsm">it never fully recovers</text>`,
    'Rupture','prosperity is not permanent'));
};
S['invention'] = () => { A.seed(88); return wrap(
  card(44,492,406,228,
    `<rect x="84" y="576" width="92" height="64" rx="4" fill="#E8DCC2" stroke="#2B2B2B" stroke-width="3"/>` +
    `<path d="M92,590 h76 M92,604 h76 M92,618 h52" stroke="#2B2B2B" stroke-width="2.4"/>` +
    cap(130,662,'printed books') +
    `<rect x="206" y="582" width="76" height="52" rx="3" fill="#FBF6EA" stroke="#2B2B2B" stroke-width="3"/>` +
    `<text x="244" y="614" class="cap" text-anchor="middle">jiaozi</text>` + cap(244,662,'paper money') +
    `<circle cx="352" cy="606" r="27" fill="#CFE2EA" stroke="#2B2B2B" stroke-width="3"/>` +
    `<path d="M352,606 L366,588" stroke="#C3272B" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="352" cy="606" r="3" fill="#2B2B2B"/>` + cap(352,662,'the compass'),
    'The Song cluster','why this did not become an industrial revolution is still argued'));
};
S['ships'] = () => { A.seed(99); return wrap(
  card(44,520,392,200,
    A.boat(126,654,0.92) + A.boat(252,664,0.76) + A.boat(352,650,0.62) +
    cap(240,706,'cut off by land — so they went to sea'),
    'South, and out','Quanzhou becomes a world port'));
};
S['zones'] = () => { A.seed(111); return wrap(
  card(44,500,374,220,
    A.person(112,648,0.92,{robe:'#9FAFC0',hat:'cap',capCol:'#8FA8C4',face:'calm'}) +
    `<text x="196" y="596" class="stat">Dec 1978</text>` +
    `<text x="196" y="626" class="capsm">let some people try things —</text>` +
    `<text x="196" y="646" class="capsm">not everywhere.</text>` +
    `<rect x="196" y="662" width="166" height="40" rx="7" fill="none" stroke="#C3272B" stroke-width="2.6" stroke-dasharray="7 5"/>` +
    `<text x="279" y="687" class="cap" text-anchor="middle">Special Economic Zones</text>`,
    'A contained experiment','four zones, walled off on purpose'));
};
S['video'] = () => { A.seed(118); return wrap(
  card(44,470,406,250,
    A.hut(96,660,54,{win:1}) + A.boat(176,648,0.6) +
    `<path d="M228,662 L228,540" stroke="#2B2B2B" stroke-width="2.4" stroke-dasharray="7 6"/>` +
    A.factory(312,660,120,46,{}) +
    A.tower(410,660,36,96,{lit:1,antenna:1}) + A.tower(452,660,30,70,{lit:1}) +
    `<text x="110" y="546" class="capsm">1979</text>` +
    `<text x="408" y="546" class="capsm">today</text>` +
    cap(246,706,'an ordinary border county, with different rules'),
    'Shenzhen','the fenced-off experiment')); };
S['shenzhen-now'] = () => { A.seed(122); return wrap(
  card(44,470,406,250,
    A.tower(104,664,44,118,{lit:1,antenna:1}) + A.tower(160,664,38,86,{lit:1}) +
    A.tower(210,664,46,134,{lit:1,antenna:1}) + A.tower(266,664,36,74,{lit:1}) +
    `<text x="320" y="582" class="stat">18 million</text>` +
    `<text x="320" y="608" class="capsm">residents today</text>` +
    `<text x="320" y="636" class="stat">¥3.87tn</text>` +
    `<text x="320" y="662" class="capsm">2025 GDP (~US$557bn)</text>`,
    'Shenzhen','one county, one lifetime'));
};
S['firms-intro'] = () => wrap(card(44,540,392,180,
  `<text x="62" y="616" class="capsm">Alibaba · marketplaces</text>
   <text x="62" y="640" class="capsm">Tencent · social platforms</text>
   <text x="62" y="664" class="capsm">Huawei · telecom infrastructure</text>
   <text x="62" y="688" class="capsm">BYD · batteries, then vehicles</text>
   <text x="252" y="616" class="capsm">ByteDance · recommendation</text>`,
  'Different bets','they did not all build the same thing'));

const firm = (name, sub, kind, stats) => () => { A.seed(name.length*17); return wrap(
  card(44,480,392,240,
    glyph(kind,186,596,0.95) +
    stats.map((s,i)=>`<text x="62" y="${684+i*24}" class="capsm">${s}</text>`).join(''),
    name, sub)); };

S['firm:alibaba']   = firm('Alibaba','marketplaces, and the rails underneath','market',
  ['Founded 1999, Hangzhou','Payments and logistics as infrastructure']);
S['firm:tencent']   = firm('Tencent','a messaging app that became the social layer','chat',
  ['Founded 1998, Shenzhen','Messaging, payments, games']);
S['firm:huawei']    = firm('Huawei','switchboards → network infrastructure','tower',
  ['Founded 1987, Shenzhen, ~¥21,000 capital','Then had to survive losing chip access']);
S['firm:byd']       = firm('BYD','batteries before cars','car',
  ['Founded 1995, Shenzhen','2025: ~2.26m battery EVs — ahead of Tesla’s 1.64m']);
S['firm:bytedance'] = firm('ByteDance','recommendation over social graph','feed',
  ['Founded 2012, Beijing','The feed decides, not your friends']);

S['future-tech'] = () => { A.seed(133); return wrap(
  card(44,492,406,228,
    A.robot(116,660,1.0) + A.chip(230,610,0.95) +
    A.factory(344,650,112,46,{fill:'#C9D4DC'}) +
    cap(230,700,'AI · robotics · semiconductors · automation'),
    'The frontier now','this is not the first time'));
};
S['source:gewirtz'] = () => { A.seed(144); return wrap(
  card(44,480,420,240,
    A.person(112,636,0.84,{robe:'#8FA8C4',hat:'scholar',face:'calm'}) +
    `<rect x="178" y="560" width="112" height="78" rx="4" fill="#E8DCC2" stroke="#2B2B2B" stroke-width="3"/>` +
    `<text x="234" y="590" class="cap" text-anchor="middle">The Third</text>` +
    `<text x="234" y="612" class="cap" text-anchor="middle">Wave</text>` +
    `<text x="234" y="630" class="capsm" text-anchor="middle">Toffler, 1980</text>` +
    `<text x="62" y="678" class="capsm">Zhao Ziyang, 1983: a coming “New Technological Revolution”</text>` +
    `<text x="62" y="700" class="capsm">Julian Gewirtz, <tspan font-style="italic">J. of Asian Studies</tspan> 78:1 (2019), 115–140</text>`,
    'Borrowed futures','1980s China read American futurists closely'));
};
S['source:bankins'] = () => wrap(card(44,500,420,220,
  `<text x="62" y="576" class="cap">Does the work that is left…</text>
   <text x="62" y="604" class="cap">…still mean anything?</text>
   <text x="62" y="650" class="capsm">Bankins &amp; Formosa distinguish task replacement,</text>
   <text x="62" y="672" class="capsm">“tending the machine”, and skill amplification —</text>
   <text x="62" y="694" class="capsm">the deployment path decides, not the technology.</text>`,
  'The open question','J. of Business Ethics 185 (2023), 725–740'));
S['zoomout'] = () => wrap('');
S['source:kaftanski'] = () => wrap(card(44,510,420,210,
  `<text x="62" y="586" class="cap">Fleets recalled. Inventions shelved.</text>
   <text x="62" y="614" class="cap">Prosperity lost — repeatedly.</text>
   <text x="62" y="658" class="capsm">Kaftanski &amp; Hanson argue difficulty is not an obstacle</text>
   <text x="62" y="680" class="capsm">to a meaningful life, but part of what constitutes it.</text>
   <text x="62" y="702" class="capsm">Frontiers in Psychology 13 (2022)</text>`,
  'What survives','the capacity to start again'));
S['finale'] = () => wrap(`
  ${A.banner(500,296,600,'What are we building?','and who is it for?')}
  ${A.cloud(160,160,1.0)}${A.cloud(840,190,0.85)}`);

export function stageFor(key){
  if(!key) return '';
  const f = S[key];
  return f ? f() : '';
}
export function introArt(){
  A.seed(5);
  return `<svg viewBox="0 0 620 190" xmlns="http://www.w3.org/2000/svg">
    <style>.cap{font:500 16px 'Caveat',cursive;fill:#2C2418}</style>
    <rect width="620" height="190" fill="#EFE3CB"/>
    ${A.mountain(84,162,150,74,'#AFBCA8')}${A.mountain(176,164,120,56,'#BDC7B2')}
    ${A.hall(300,160,128,56,{door:1,plinth:1})}
    ${A.boat(470,150,0.78)}
    ${A.camel(200,160,0.62)}
    ${A.tower(556,160,26,74,{lit:1,antenna:1})}${A.tower(592,160,20,52,{lit:1})}
    ${A.person(372,164,0.6,{robe:'#8FB89C',hat:'scholar'})}
    ${A.person(404,166,0.6,{robe:'#C3272B',hat:'coolie',arms:'carry'})}
    ${A.cloud(96,44,0.8)}${A.cloud(430,38,0.7)}
  </svg>`;
}
