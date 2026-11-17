/* script.js — the authored storyboard. One ordered list of scenes drives
   the map, the illustrations, the narration and the subtitles from a single clock.
   Total runtime 290s = 4:50, inside the five-minute limit.

   Framing follows the ENGL 2089 brief: the subject is life, happiness and
   resilience; entrepreneurship is the lens, not the point. The three required
   sources are load-bearing — Gewirtz in The Future, Bankins & Formosa on
   meaningful work, Kaftanski & Hanson in the conclusion. */

export const RUNTIME = 290;

export const ACTS = [
  {id:'open', c:'#8FA8C4',   name:'The Art of Reinvention', from:0,   to:25},
  {id:'ancient', c:'#C98E72',name:'Ancient Foundations',    from:25,  to:65},
  {id:'change', c:'#E5B95F', name:'Prosperity & Disruption',from:65,  to:105},
  {id:'reform', c:'#D66A4C', name:'Reinvention: Shenzhen',  from:105, to:160},
  {id:'modern', c:'#62947A', name:'Modern Entrepreneurship',from:160, to:215},
  {id:'future', c:'#8F9FC4', name:'The Future of Work',     from:215, to:255},
  {id:'end', c:'#B49BC0',    name:'What Are We Building?',  from:255, to:290}
];

export const SCENES = [
/* ——— ACT 1 ——— */
{id:'s01', vo:8.59, t:0,  d:9.5,  act:'open', title:'A question', period:'modern', stage:'title-fade', focus:[480,400,1],
 cues:[0,4.83],
 lines:['Every society faces the same question. So does every person.',
        'What happens when the world outpaces your plans?']},
{id:'s02', vo:4.68, t:9.5,  d:5.2,  act:'open', title:'One place, many answers', period:'neolithic', focus:[480,400,1],
 cues:[0,3.39],
 lines:['A map of one place that answered it many times.',
        'Sometimes well. Often badly.']},
{id:'s03', vo:9.38, t:14.7, d:10.3,  act:'open', title:'China: The Art of Reinvention', period:'neolithic', stage:'title', focus:[480,400,1],
 cues:[0,6.45],
 lines:['Four thousand years of building things, losing them, starting again.',
        'This is the art of reinvention.']},

/* ——— ACT 2 ——— */
{id:'s04', vo:5.93, t:25, d:7.2, act:'ancient', title:'It starts with rivers', period:'shang', stage:'villages', focus:[560,380,1.25],
 cues:[0,2.2,4.6],
 lines:['It begins with rivers.',
        'Villages become walled towns, then states.',
        'The trouble starts almost at once.']},
{id:'s05', vo:11.70, t:32.2, d:14.3, act:'ancient', title:'How should we live?', period:'zhanguo', stage:'warring', focus:[560,380,1.25],
 cues:[0,2.39,7.3],
 lines:['Five centuries of war between rival states.',
        'It produces iron, canals, written law —',
        'and philosophers asking how to live, not how to win.']},
{id:'s06', vo:6.90, t:46.5, d:8.4,  act:'ancient', title:'Unification, 221 BCE', period:'qin', stage:'unify', focus:[540,400,1.15],
 cues:[0,3.76],
 lines:['In 221 BCE one state wins, standardising script, coins, cartwheels.',
        'Built on forced labour. It lasts fifteen years.']},
{id:'s07', vo:8.28, t:54.9, d:10.1, act:'ancient', title:'The roads west', period:'han-w', stage:'silkroad', focus:[380,330,1.15],
 cues:[0,3.65],
 lines:['The Han open the roads west. Silk out, ideas back.',
        'What travels is mostly technique and belief.']},

/* ——— ACT 3 ——— */
{id:'s08', vo:6.90, t:65, d:8.4, act:'change', title:"Chang'an, at its best", period:'tang', stage:'city', focus:[520,340,1.35],
 cues:[0,2.43],
 lines:['By the Tang, Chang’an may be the largest city on earth.',
        'A million people, many foreign, living well.']},
{id:'s09', vo:6.56, t:73.4, d:8, act:'change', title:'755', period:'tang', stage:'rupture', focus:[560,340,1.2],
 cues:[0,3.1],
 lines:['In 755 a rebellion tears the empire open.',
        'Nothing about prosperity is load-bearing.']},
{id:'s10', vo:9.72, t:81.4, d:11.8, act:'change', title:'The Song answer', period:'song-n', stage:'invention', focus:[620,400,1.25],
 cues:[0,1.69,7.31],
 lines:['The Song answer by building.',
        'Printed books, paper money, the compass at sea, coal-smelted iron.',
        'Ordinary people now read and travel.']},
{id:'s11', vo:9.72, t:93.2, d:11.8,  act:'change', title:'They built something else', period:'song-s', stage:'ships', focus:[700,520,1.3],
 cues:[0,5.06],
 lines:['The north falls. The court flees south, losing the overland trade.',
        'They never got it back. They built something else.']},

/* ——— ACT 4 ——— */
{id:'s12', vo:9.33, t:105,d:12.2, act:'reform', title:'December 1978', period:'reform', stage:'zones', focus:[640,560,1.3],
 cues:[0,1.58],
 lines:['December 1978.',
        'After decades of planning and upheaval, the leadership lets some people try things — in a few fenced-off places.']},
{id:'s13', vo:25.21, t:117.2,d:32.9, act:'reform', title:'Shenzhen', period:'reform', stage:'video', focus:[656,626,2.2], video:true,
 cues:[0,2.64,5.32,9.45,15.94,20.68],
 lines:['One of them is Shenzhen.',
        'You will hear it was a fishing village.',
        'Mostly a myth — the county held three hundred thousand people.',
        'The honest version: an ordinary border county where the rules could differ.',
        'Factories first, then components, then the firms that designed them.',
        'And millions who came because the future seemed to be here.']},
{id:'s14', vo:7.58, t:150.1,d:9.9,  act:'reform', title:'One lifetime', period:'modern', stage:'shenzhen-now', focus:[656,626,2.0],
 cues:[0,3.87],
 lines:['Within one lifetime, a city of eighteen million —',
        'most of them arrivals chasing a better life.']},

/* ——— ACT 5 ——— */
{id:'s15', vo:3.08, t:160,d:4,  act:'modern', title:'Different bets', period:'modern', stage:'firms-intro', focus:[700,540,1.4],
 cues:[0],
 lines:['These firms did not all build the same thing.']},
{id:'s16', vo:7.03, t:164,d:9.2,  act:'modern', title:'Alibaba', period:'modern', stage:'firm:alibaba', focus:[744,490,1.6],
 cues:[0,2.97],
 lines:['Alibaba built marketplaces, and the rails underneath.',
        'Very small sellers could reach very large markets.']},
{id:'s17', vo:8.39, t:173.2,d:10.9,  act:'modern', title:'Tencent', period:'modern', stage:'firm:tencent', focus:[656,626,1.6],
 cues:[0,5.76],
 lines:['Tencent began as a messaging app and became the layer daily life runs on.',
        'That is power, and responsibility.']},
{id:'s18', vo:6.92, t:184.1,d:9, act:'modern', title:'Huawei', period:'modern', stage:'firm:huawei', focus:[656,626,1.6],
 cues:[0,3.12],
 lines:['Huawei sold switchboards, then telecoms infrastructure,',
        'then survived losing the chips it depended on.']},
{id:'s19', vo:6.30, t:193.1,d:8.2,  act:'modern', title:'BYD', period:'modern', stage:'firm:byd', focus:[656,626,1.6],
 cues:[0,2.98],
 lines:['BYD made batteries before cars.',
        'In 2025 it sold more battery-electric vehicles than Tesla.']},
{id:'s20', vo:10.48, t:201.3,d:13.7,  act:'modern', title:'ByteDance', period:'modern', stage:'firm:bytedance', focus:[650,308,1.5],
 cues:[0,4.78],
 lines:['ByteDance bet an algorithm could pick what you watch better than your friends.',
        'It was right. Whether anyone is happier is another question.']},

/* ——— ACT 6 ——— */
{id:'s21', vo:11.10, t:215,d:12.6, act:'future', title:'The frontier now', period:'modern', stage:'future-tech', focus:[656,600,1.5],
 cues:[0,7.02],
 lines:['Now the frontier is AI, robotics, semiconductors, automation.',
        'Not the first time people tried to read the future.']},
{id:'s22', vo:12.51, t:227.6,d:14.2, act:'future', title:'Borrowed futures', period:'modern', stage:'source:gewirtz', focus:[650,308,1.4],
 cues:[0,4.76,8.12],
 lines:['In the 1980s, Chinese leaders read the futurist Alvin Toffler',
        'and argued about a coming technological revolution.',
        'Gewirtz traces that debate into China’s technology programmes.']},
{id:'s23', vo:11.62, t:241.8,d:13.2, act:'future', title:'What work is left?', period:'modern', stage:'source:bankins', focus:[600,480,1.2],
 cues:[0,3.03,6.82],
 lines:['The question is not whether the machines arrive.',
        'It is what work is left, and whether it is worth doing.',
        'Bankins and Formosa say that depends on how we deploy it.']},

/* ——— ACT 7 ——— */
{id:'s24', vo:9.53, t:255,d:12.3, act:'end', title:'Back to the question', period:'modern', stage:'zoomout', focus:[480,400,1],
 cues:[0,4.6],
 lines:['So: what lets people keep creating when the world changes?',
        'Not ambition. This map is full of ambitious projects that ended.']},
{id:'s25', vo:11.05, t:267.3,d:14.2, act:'end', title:'What survives', period:'modern', stage:'source:kaftanski', focus:[480,400,1],
 cues:[0,6.29],
 lines:['What survived was never the plan. It was resilience — the capacity to make another.',
        'Kaftanski and Hanson argue difficulty is part of a good life.']},
{id:'s26', vo:6.61, t:281.5,d:8.5, act:'end', title:'What are we building?', period:'modern', stage:'finale', focus:[480,400,1],
 cues:[0,2.05,5.28],
 lines:['You are going to build something.',
        'The question is not how big it gets.',
        'It is: what is it for?']}
];

export const WPM = 150;

export function sceneAt(t){
  for(let i=SCENES.length-1;i>=0;i--) if(t>=SCENES[i].t) return SCENES[i];
  return SCENES[0];
}
export function cuesFor(s){
  /* `cues` holds the measured start offset of each line inside the scene's own
     narration clip, found by silence analysis. Falls back to a word-length
     estimate only where no recording was analysed. */
  if(s.cues && s.cues.length === s.lines.length){
    return s.lines.map((l,i)=>{
      const start = s.t + s.cues[i];
      const tail  = s.vo ? Math.min(s.d, s.vo + 0.9) : s.d;
      const end   = (i+1 < s.cues.length) ? s.t + s.cues[i+1] : s.t + tail;
      return {t:start, d:Math.max(0.6, end-start), text:l};
    });
  }
  const w = s.lines.map(l=>l.split(/\s+/).length);
  const tot = w.reduce((a,b)=>a+b,0) || 1;
  let acc = s.t; const out=[];
  s.lines.forEach((l,i)=>{ const d = s.d * (w[i]/tot); out.push({t:acc, d, text:l}); acc+=d; });
  return out;
}

