/* periods.js — chronology + what the map shows for each period.
   `regions` lists base-geography cell ids; `tone` picks a palette entry.
   Dates follow conventional scholarly ranges; contested ones carry a `caveat`. */

export const TONES = {
  han:'#D9A47B', jade:'#8FB89C', blue:'#8FA8C4', rose:'#D4A0A0', gold:'#E5C07A',
  violet:'#B49BC0', teal:'#8FBCBC', clay:'#C98E72', olive:'#BFBF86', slate:'#9FAFC0',
  sand:'#DCC9A0', moss:'#A8B894', steppe:'#CDBB9A', quiet:'#EFE3C2', vermilion:'#C76A5E'
};

const CORE = ['HEN','SHX','SNX','SHD','HEB'];
const SOUTH = ['HUB','HUN','JXI','ANH','JSU','ZHE','FUJ'];
const FARSOUTH = ['GDG','GXI'];
const WEST = ['SCH','GZH','YUN'];

export const PERIODS = [
{ id:'neolithic', name:'Early Cultures', short:'Early cultures', years:'c. 5000–2000 BCE', from:-5000, to:-2000, tier:1,
  blurb:'Farming villages along the Yellow and Yangtze rivers. Pottery, silk, jade and walled settlements appear long before writing.',
  states:[
    {name:'Yangshao', tone:'clay', regions:['HEN','SNX','SHX']},
    {name:'Longshan', tone:'gold', regions:['SHD','HEB']},
    {name:'Liangzhu', tone:'jade', regions:['ZHE','JSU']},
    {name:'Sichuan cultures', tone:'violet', regions:['SCH']}
  ],
  figures:[{k:'villager',at:[566,392],s:.52},{k:'villager',at:[598,404],s:.48,flip:1},{k:'villager',at:[740,486],s:.5}],
  cities:[{n:'Banpo',at:[505,322]},{n:'Liangzhu',at:[744,492]}] },

{ id:'xia', name:'Xia', short:'Xia', years:'c. 2070–1600 BCE', from:-2070, to:-1600, tier:1,
  blurb:'Traditionally the first dynasty. No contemporary writing confirms it, and scholars still debate whether the Erlitou archaeological site is Xia.',
  caveat:'Debated. The Xia appears in later texts, not in contemporary records. Erlitou is a real Bronze Age site; linking it to "Xia" is an interpretation, not a settled fact.',
  states:[{name:'Xia (traditional)', tone:'sand', regions:['HEN','SHX']}],
  figures:[{k:'scholar',at:[628,396],s:.54}],
  cities:[{n:'Erlitou',at:[594,378]}] },

{ id:'shang', name:'Shang', short:'Shang', years:'c. 1600–1046 BCE', from:-1600, to:-1046, tier:1,
  blurb:'The first dynasty confirmed by its own writing. Oracle-bone inscriptions and extraordinary bronze casting come from Shang workshops.',
  states:[{name:'Shang', tone:'clay', regions:['HEN','SHX','SHD','HEB']}],
  figures:[{k:'emperor',at:[662,352],s:.56},{k:'scholar',at:[578,400],s:.5}],
  cities:[{n:'Anyang',at:[616,364]},{n:'Zhengzhou',at:[600,392]}] },

{ id:'zhou-w', name:'Western Zhou', short:'W. Zhou', years:'1046–771 BCE', from:-1046, to:-771, tier:1,
  blurb:'The Zhou overthrow the Shang and justify it with the Mandate of Heaven — an idea that rulers hold power only while they govern well.',
  states:[{name:'Zhou', tone:'gold', regions:[...CORE,'ANH']}],
  figures:[{k:'emperor',at:[534,336],s:.56},{k:'scholar',at:[612,392],s:.5}],
  cities:[{n:'Haojing',at:[510,320]},{n:'Luoyi',at:[594,374]}] },

{ id:'chunqiu', name:'Spring & Autumn', short:'Spring & Autumn', years:'770–476 BCE', from:-770, to:-476, tier:1,
  blurb:'Zhou authority thins out and regional lords govern for themselves. Competition between states drives iron tools, bigger armies and new ideas — Confucius lives at the end of this era.',
  states:[
    {name:'Qin', tone:'slate', regions:['SNX','GAN']},
    {name:'Jin', tone:'violet', regions:['SHX','NIN']},
    {name:'Qi', tone:'gold', regions:['SHD']},
    {name:'Yan', tone:'teal', regions:['HEB','LIA']},
    {name:'Chu', tone:'jade', regions:['HUB','HUN']},
    {name:'Wu', tone:'rose', regions:['JSU']},
    {name:'Yue', tone:'moss', regions:['ZHE']},
    {name:'Zhou domain', tone:'han', regions:['HEN']},
    {name:'Ba & Shu', tone:'olive', regions:['SCH']}
  ],
  figures:[{k:'soldier',at:[470,358],s:.5},{k:'soldier',at:[496,364],s:.5},{k:'scholar',at:[752,388],s:.52},{k:'merchant',at:[612,476],s:.5}],
  cities:[{n:'Luoyi',at:[594,374]},{n:'Linzi',at:[716,348]},{n:'Ying',at:[612,452]}] },

{ id:'zhanguo', name:'Warring States', short:'Warring States', years:'475–221 BCE', from:-475, to:-221, tier:1,
  blurb:'Seven large states absorb the rest. Mass infantry, crossbows, canals and legal codes — and a burst of philosophy as thinkers argue about how to live well amid disorder.',
  states:[
    {name:'Qin', tone:'slate', regions:['SNX','GAN','SCH']},
    {name:'Zhao', tone:'violet', regions:['SHX','NIN']},
    {name:'Yan', tone:'teal', regions:['HEB','LIA']},
    {name:'Qi', tone:'gold', regions:['SHD']},
    {name:'Wei & Han', tone:'rose', regions:['HEN']},
    {name:'Chu', tone:'jade', regions:['HUB','HUN','ANH','JXI','JSU','ZHE']}
  ],
  figures:[{k:'soldier',at:[446,356],s:.52},{k:'soldier',at:[472,364],s:.52},{k:'soldier',at:[498,356],s:.52},{k:'emperor',at:[754,392],s:.54},{k:'scholar',at:[600,492],s:.5}],
  cities:[{n:'Xianyang',at:[508,318]},{n:'Handan',at:[616,330]},{n:'Linzi',at:[716,348]}] },

{ id:'qin', major:true, name:'Qin', short:'Qin', years:'221–206 BCE', from:-221, to:-206, tier:1,
  blurb:'The first unified empire. Qin standardises script, coinage, weights and axle widths, and links northern walls into one frontier line. It collapses within fifteen years.',
  states:[{name:'Qin Empire', tone:'slate', regions:[...CORE,...SOUTH,...FARSOUTH,'SCH','GAN','NIN','LIA','GZH']}],
  figures:[{k:'emperor',at:[520,362],s:.6},{k:'worker',at:[470,264],s:.48},{k:'worker',at:[560,246],s:.48,flip:1}],
  cities:[{n:'Xianyang',at:[508,318]}], wall:true },

{ id:'han-w', major:true, wall:true, name:'Western Han', short:'W. Han', years:'202 BCE–9 CE', from:-202, to:9, tier:1,
  blurb:'A long, stable empire. Envoys sent west in the 130s–120s BCE open sustained contact across Central Asia — the trade corridors later called the Silk Road.',
  states:[
    {name:'Han Empire', tone:'han', regions:[...CORE,...SOUTH,...FARSOUTH,'SCH','GAN','NIN','LIA','GZH','YUN']},
    {name:'Western Regions (protectorate)', tone:'quiet', regions:['XJS','XJN'], hatch:true}
  ],
  figures:[{k:'camel',at:[318,278],s:.52},{k:'merchant',at:[404,296],s:.48},{k:'emperor',at:[546,362],s:.54}],
  cities:[{n:"Chang'an",at:[508,318]},{n:'Dunhuang',at:[392,266]},{n:'Luoyang',at:[594,374]}],
  routes:[{id:'silk', name:'Silk Road', pts:[[508,318],[452,290],[400,268],[344,250],[280,246],[214,250],[150,256],[92,250]]}] },

{ id:'han-e', major:true, wall:true, name:'Eastern Han', short:'E. Han', years:'25–220 CE', from:25, to:220, tier:1,
  blurb:'The capital moves east to Luoyang. Paper-making is refined around 105 CE; water-powered bellows and the seismoscope date from this period.',
  states:[
    {name:'Han Empire', tone:'han', regions:[...CORE,...SOUTH,...FARSOUTH,'SCH','GAN','NIN','LIA','GZH','YUN']},
    {name:'Western Regions', tone:'quiet', regions:['XJS'], hatch:true}
  ],
  figures:[{k:'camel',at:[344,264],s:.5},{k:'scholar',at:[622,392],s:.52}],
  cities:[{n:'Luoyang',at:[594,374]},{n:"Chang'an",at:[508,318]}],
  routes:[{id:'silk', name:'Silk Road', pts:[[594,374],[508,318],[452,290],[400,268],[344,250],[280,246],[214,250],[150,256],[92,250]]}] },

{ id:'sanguo', major:true, name:'Three Kingdoms', short:'Three Kingdoms', years:'220–280', from:220, to:280, tier:1,
  blurb:'The Han splits three ways. The wars are famous through later fiction, but the lasting change is southward migration that develops the Yangtze valley.',
  states:[
    {name:'Wei', tone:'slate', regions:[...CORE,'GAN','NIN','LIA','ANH']},
    {name:'Shu Han', tone:'jade', regions:['SCH','KHM','GZH']},
    {name:'Wu', tone:'rose', regions:['HUB','HUN','JXI','JSU','ZHE','FUJ','GDG','GXI','YUN']}
  ],
  figures:[{k:'soldier',at:[574,352],s:.54},{k:'soldier',at:[446,430],s:.54},{k:'soldier',at:[692,486],s:.54}],
  cities:[{n:'Luoyang',at:[594,374]},{n:'Chengdu',at:[430,418]},{n:'Jianye',at:[726,440]}] },

{ id:'jin', name:'Jin', short:'Jin', years:'266–420', from:266, to:420, tier:1,
  blurb:'A brief reunification, then invasion and collapse in the north. Elite families flee south, carrying wealth and learning to the Yangtze.',
  states:[
    {name:'Jin', tone:'teal', regions:[...SOUTH,...FARSOUTH,'SCH','GZH','YUN','HEN']},
    {name:'Northern kingdoms', tone:'steppe', regions:['SHX','SNX','HEB','SHD','GAN','NIN','LIA']}
  ],
  figures:[{k:'soldier',at:[572,330],s:.5},{k:'merchant',at:[700,470],s:.5}],
  cities:[{n:'Jiankang',at:[726,440]},{n:'Luoyang',at:[594,374]}] },

{ id:'nanbei', wall:true, name:'Northern & Southern Dynasties', short:'N. & S. Dynasties', years:'420–589', from:420, to:589, tier:1,
  blurb:'Nearly two centuries of division. Northern rulers of steppe origin adopt Chinese administration; Buddhism spreads widely in both halves.',
  states:[
    {name:'Northern dynasties', tone:'steppe', regions:[...CORE,'GAN','NIN','LIA','IMG']},
    {name:'Southern dynasties', tone:'teal', regions:[...SOUTH,...FARSOUTH,'SCH','GZH','YUN']}
  ],
  figures:[{k:'soldier',at:[586,318],s:.52},{k:'scholar',at:[700,500],s:.52}],
  cities:[{n:'Pingcheng',at:[586,300]},{n:'Jiankang',at:[726,440]},{n:'Luoyang',at:[594,374]}] },

{ id:'sui', name:'Sui', short:'Sui', years:'581–618', from:581, to:618, tier:1,
  blurb:'Reunification, and the Grand Canal — a waterway linking the rice-growing south to the northern capitals. The dynasty exhausts itself building it.',
  states:[{name:'Sui', tone:'gold', regions:[...CORE,...SOUTH,...FARSOUTH,'SCH','GAN','NIN','LIA','GZH','YUN']}],
  figures:[{k:'worker',at:[664,400],s:.5},{k:'boat',at:[690,424],s:.4},{k:'emperor',at:[530,336],s:.54}],
  cities:[{n:"Chang'an",at:[508,318]},{n:'Luoyang',at:[594,374]}],
  routes:[{id:'canal', name:'Grand Canal', kind:'canal', pts:[[726,440],[700,420],[672,396],[640,372],[612,358],[616,330],[640,318]]}] },

{ id:'tang', major:true, name:'Tang', short:'Tang', years:'618–907', from:618, to:907, tier:1,
  blurb:"Chang'an becomes one of the world's great cities — cosmopolitan, crowded and connected overland to Central Asia. Woodblock printing, porcelain and an examination-based bureaucracy develop here.",
  states:[
    {name:'Tang Empire', tone:'vermilion', regions:[...CORE,...SOUTH,...FARSOUTH,'SCH','GAN','NIN','LIA','GZH','YUN','KHM']},
    {name:'Protectorates', tone:'quiet', regions:['XJS','XJN','IMG'], hatch:true}
  ],
  figures:[{k:'camel',at:[330,276],s:.5},{k:'merchant',at:[432,296],s:.46},{k:'emperor',at:[520,364],s:.56},{k:'scholar',at:[636,418],s:.5},{k:'boat',at:[700,646],s:.4}],
  cities:[{n:"Chang'an",at:[508,318]},{n:'Luoyang',at:[594,374]},{n:'Guangzhou',at:[646,614]},{n:'Dunhuang',at:[392,266]}],
  routes:[{id:'canal', name:'Grand Canal', kind:'canal', pts:[[726,440],[700,420],[672,396],[640,372],[612,358],[616,330],[640,318]]},{id:'silk', name:'Silk Road', pts:[[508,318],[452,290],[400,268],[344,250],[280,246],[214,250],[150,256],[92,250]]},
          {id:'sea', name:'Maritime routes', kind:'sea', pts:[[646,614],[700,628],[744,596],[776,560]]}] },

{ id:'wudai', name:'Five Dynasties & Ten Kingdoms', short:'Five Dynasties', years:'907–979', from:907, to:979, tier:1,
  blurb:'The Tang order breaks apart. Short-lived northern dynasties follow one another while southern kingdoms grow rich on trade — and print the first paper money experiments.',
  states:[
    {name:'Northern dynasties', tone:'slate', regions:['HEN','SHX','SNX','HEB','SHD']},
    {name:'Southern kingdoms', tone:'moss', regions:[...SOUTH,...FARSOUTH,'GZH']},
    {name:'Shu', tone:'violet', regions:['SCH','YUN']},
    {name:'Liao', tone:'steppe', regions:['LIA','IMG','JIL']}
  ],
  figures:[{k:'soldier',at:[566,330],s:.5},{k:'merchant',at:[700,506],s:.5}],
  cities:[{n:'Kaifeng',at:[612,370]},{n:'Hangzhou',at:[744,490]}] },

{ id:'song-n', major:true, name:'Northern Song', short:'N. Song', years:'960–1127', from:960, to:1127, tier:1,
  blurb:'A commercial and technological high point. Government-issued paper money, movable type, the magnetic compass at sea, coal-fired iron — alongside a northern frontier the Song never secures.',
  states:[
    {name:'Song', tone:'han', regions:[...CORE.filter(r=>r!=='HEB'),...SOUTH,...FARSOUTH,'SCH','GZH','YUN']},
    {name:'Liao', tone:'steppe', regions:['LIA','IMG','HEB','JIL']},
    {name:'Western Xia', tone:'sand', regions:['GAN','NIN']}
  ],
  figures:[{k:'merchant',at:[640,392],s:.54},{k:'scholar',at:[590,436],s:.5},{k:'boat',at:[742,572],s:.42},{k:'soldier',at:[644,286],s:.48}],
  cities:[{n:'Kaifeng',at:[612,370]},{n:'Quanzhou',at:[726,558]}],
  routes:[{id:'canal', name:'Grand Canal', kind:'canal', pts:[[726,440],[700,420],[672,396],[640,372],[612,358],[616,330],[640,318]]},{id:'sea', name:'Maritime trade', kind:'sea', pts:[[726,558],[700,600],[656,632],[600,660]]}] },

{ id:'song-s', major:true, name:'Southern Song', short:'S. Song', years:'1127–1279', from:1127, to:1279, tier:1,
  blurb:'The north is lost to the Jin; the court relocates to Hangzhou. Cut off from overland routes, the Song turn to the sea — and shipbuilding, ports and maritime trade expand.',
  states:[
    {name:'Southern Song', tone:'han', regions:[...SOUTH,...FARSOUTH,'SCH','GZH','YUN']},
    {name:'Jin', tone:'steppe', regions:[...CORE,'GAN','NIN','LIA','IMG','JIL']},
    {name:'Western Xia', tone:'sand', regions:[]}
  ],
  figures:[{k:'boat',at:[768,520],s:.46},{k:'boat',at:[742,578],s:.4},{k:'merchant',at:[700,500],s:.52},{k:'soldier',at:[600,340],s:.48}],
  cities:[{n:"Lin'an (Hangzhou)",at:[744,490]},{n:'Quanzhou',at:[726,558]}],
  routes:[{id:'sea', name:'Maritime trade', kind:'sea', pts:[[744,490],[760,540],[726,588],[672,628],[610,658]]}] },

{ id:'yuan', major:true, name:'Yuan', short:'Yuan', years:'1271–1368', from:1271, to:1368, tier:1,
  blurb:'Mongol rule unites the land under one administration connected to a Eurasian empire. Overland travel becomes safer; goods, people and disease move further and faster.',
  states:[{name:'Yuan', tone:'violet', regions:['XJN','XJS','TIB','KHM','QIN','GAN','NIN','IMG','HLJ','JIL','LIA',...CORE,...SOUTH,...FARSOUTH,'SCH','GZH','YUN'], outside:['MGL']}],
  figures:[{k:'soldier',at:[600,232],s:.54},{k:'camel',at:[360,268],s:.48},{k:'merchant',at:[716,470],s:.5}],
  cities:[{n:'Dadu (Beijing)',at:[650,308]},{n:'Hangzhou',at:[744,490]},{n:'Quanzhou',at:[726,558]}],
  routes:[{id:'canal', name:'Grand Canal', kind:'canal', pts:[[726,440],[700,420],[672,396],[640,372],[612,358],[616,330],[640,318]]},{id:'silk', name:'Overland routes', pts:[[650,308],[560,290],[470,266],[386,258],[300,248],[214,250],[120,254]]}] },

{ id:'ming', major:true, name:'Ming', short:'Ming', years:'1368–1644', from:1368, to:1644, tier:1,
  blurb:"Seven state fleets sail as far as East Africa between 1405 and 1433 — then the voyages stop. Later Ming China runs a huge private commercial economy absorbing silver from across the world.",
  states:[
    {name:'Ming', tone:'vermilion', regions:[...CORE,...SOUTH,...FARSOUTH,'SCH','GAN','NIN','LIA','GZH','YUN']},
    {name:'Steppe frontier', tone:'quiet', regions:['IMG','XJN','XJS','QIN'], hatch:true}
  ],
  figures:[{k:'boat',at:[736,540],s:.5},{k:'boat',at:[676,618],s:.42},{k:'emperor',at:[664,300],s:.56},{k:'worker',at:[500,224],s:.46}],
  cities:[{n:'Beijing',at:[650,308]},{n:'Nanjing',at:[718,434]},{n:'Suzhou',at:[740,468]}],
  wall:true,
  routes:[{id:'canal', name:'Grand Canal', kind:'canal', pts:[[726,440],[700,420],[672,396],[640,372],[612,358],[616,330],[640,318]]},{id:'zhenghe', name:'Zheng He voyages', kind:'sea', pts:[[718,434],[756,520],[742,580],[672,636],[590,672],[500,700]]}] },

{ id:'qing', major:true, name:'Qing', short:'Qing', years:'1644–1912', from:1644, to:1912, tier:1,
  blurb:'The largest land empire in Chinese history, and a long peak of population and prosperity — followed by defeats, unequal treaties and territorial losses from the 1840s onward.',
  states:[{name:'Qing', tone:'jade', regions:['XJN','XJS','TIB','KHM','QIN','GAN','NIN','IMG','HLJ','JIL','LIA',...CORE,...SOUTH,...FARSOUTH,'SCH','GZH','YUN'], outside:['MGL']}],
  figures:[{k:'emperor',at:[664,300],s:.56},{k:'merchant',at:[640,620],s:.5},{k:'boat',at:[776,478],s:.42}],
  cities:[{n:'Beijing',at:[650,308]},{n:'Guangzhou',at:[646,614]},{n:'Shanghai',at:[762,474]}],
  routes:[{id:'treaty', name:'Treaty ports', kind:'sea', pts:[[646,614],[726,558],[762,474],[722,350]]}] },

{ id:'roc', name:'Republic of China', short:'Republic', years:'1912–1949', from:1912, to:1949, tier:1,
  blurb:'Empire gives way to a republic, then to fragmentation, invasion and civil war. Shanghai industrialises rapidly even as the country comes apart.',
  states:[
    {name:'Republic', tone:'slate', regions:[...CORE,...SOUTH,...FARSOUTH,'SCH','GAN','NIN','GZH','YUN','QIN']},
    {name:'Contested / occupied', tone:'quiet', regions:['LIA','JIL','HLJ','IMG','XJN','XJS','TIB','KHM'], hatch:true}
  ],
  figures:[{k:'worker',at:[762,452],s:.5},{k:'scholar',at:[664,300],s:.5},{k:'soldier',at:[700,250],s:.48}],
  cities:[{n:'Nanjing',at:[718,434]},{n:'Shanghai',at:[762,474]},{n:'Chongqing',at:[470,440]}] },

{ id:'prc-early', name:"People's Republic — First Decades", short:'PRC 1949–78', years:'1949–1978', from:1949, to:1978, tier:1,
  blurb:'A planned economy, mass literacy and public-health gains, alongside the catastrophic famine of the Great Leap Forward and the upheaval of the Cultural Revolution.',
  caveat:'This period includes both large social gains and severe, well-documented policy disasters. Both belong in an honest account.',
  states:[{name:"People's Republic", tone:'vermilion', regions:['XJN','XJS','TIB','KHM','QIN','GAN','NIN','IMG','HLJ','JIL','LIA',...CORE,...SOUTH,...FARSOUTH,'SCH','GZH','YUN']}],
  figures:[{k:'worker',at:[650,340],s:.52},{k:'worker',at:[600,430],s:.5,flip:1}],
  cities:[{n:'Beijing',at:[650,308]},{n:'Shanghai',at:[762,474]}] },

{ id:'reform', name:'Reform & Opening-Up', short:'Reform', years:'1978–2000', from:1978, to:2000, tier:1,
  blurb:'From December 1978 the leadership permits market activity, foreign investment and private enterprise — first in walled-off zones, then more widely.',
  states:[{name:"People's Republic", tone:'han', regions:['XJN','XJS','TIB','KHM','QIN','GAN','NIN','IMG','HLJ','JIL','LIA',...CORE,...SOUTH,...FARSOUTH,'SCH','GZH','YUN']}],
  figures:[{k:'worker',at:[624,600],s:.5},{k:'builder',at:[676,606],s:.52},{k:'merchant',at:[744,470],s:.48}],
  cities:[{n:'Shenzhen',at:[656,626],hero:true},{n:'Zhuhai',at:[628,640]},{n:'Shantou',at:[690,606]},{n:'Xiamen',at:[730,572]},{n:'Beijing',at:[650,308]}],
  zones:[[656,626],[628,640],[690,606],[730,572]] },

{ id:'modern', major:true, name:'Modern China', short:'Modern', years:'2000–present', from:2000, to:2026, tier:1,
  blurb:'Manufacturing at enormous scale, then a push up the value chain into electronics, electric vehicles, batteries and AI — with debate, inside and outside China, about what that growth has cost and who it serves.',
  states:[{name:"People's Republic", tone:'han', regions:['XJN','XJS','TIB','KHM','QIN','GAN','NIN','IMG','HLJ','JIL','LIA',...CORE,...SOUTH,...FARSOUTH,'SCH','GZH','YUN']}],
  figures:[{k:'builder',at:[620,600],s:.5},{k:'robot',at:[690,596],s:.5},{k:'merchant',at:[760,470],s:.48},{k:'scholar',at:[664,286],s:.48}],
  cities:[{n:'Shenzhen',at:[656,626],hero:true},{n:'Hangzhou',at:[744,490]},{n:'Beijing',at:[650,308]},{n:'Shanghai',at:[762,474]}] }
];

/* Secondary milestones — smaller marks on the expanded timeline. */
export const EVENTS = [
  {y:-1250, t:'Oracle bone writing at Anyang', p:'shang'},
  {y:-551,  t:'Confucius born', p:'chunqiu'},
  {y:-256,  t:'Dujiangyan irrigation works', p:'zhanguo'},
  {y:-214,  t:'Northern walls linked', p:'qin'},
  {y:-138,  t:'Zhang Qian sent west', p:'han-w'},
  {y:105,   t:'Paper-making refined', p:'han-e'},
  {y:609,   t:'Grand Canal completed', p:'sui'},
  {y:755,   t:'An Lushan Rebellion begins', p:'tang'},
  {y:763,   t:'An Lushan Rebellion ends', p:'tang'},
  {y:1023,  t:'Government paper money (jiaozi)', p:'song-n'},
  {y:1040,  t:'Movable type described by Bi Sheng', p:'song-n'},
  {y:1127,  t:'Song court flees south', p:'song-s'},
  {y:1405,  t:'Zheng He’s first voyage', p:'ming'},
  {y:1433,  t:'Last treasure-fleet voyage', p:'ming'},
  {y:1839,  t:'First Opium War begins', p:'qing'},
  {y:1842,  t:'Treaty of Nanjing', p:'qing'},
  {y:1861,  t:'Self-Strengthening Movement', p:'qing'},
  {y:1911,  t:'Xinhai Revolution', p:'qing'},
  {y:1919,  t:'May Fourth Movement', p:'roc'},
  {y:1949,  t:"People's Republic founded", p:'prc-early'},
  {y:1978,  t:'Third Plenum: Reform & Opening', p:'reform'},
  {y:1980,  t:'First Special Economic Zones', p:'reform'},
  {y:1987,  t:'Huawei founded in Shenzhen', p:'reform'},
  {y:1995,  t:'BYD founded in Shenzhen', p:'reform'},
  {y:1998,  t:'Tencent founded in Shenzhen', p:'reform'},
  {y:1999,  t:'Alibaba founded in Hangzhou', p:'reform'},
  {y:2001,  t:'China joins the WTO', p:'modern'},
  {y:2012,  t:'ByteDance founded in Beijing', p:'modern'},
  {y:2025,  t:'BYD passes Tesla in global EV sales', p:'modern'}
];

export const byId = id => PERIODS.find(p => p.id === id);
