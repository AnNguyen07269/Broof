/* geography.js — schematic base geography for the atlas.
   The silhouette is intentionally stylised, not a survey map (see Sources panel).
   Regions tessellate the outline exactly, so any period can regroup them into states. */

export const OUTLINE = [
 [58,250],[72,205],[104,172],[148,150],[196,136],[240,124],[276,112],[310,132],
 [334,156],[372,176],[414,190],[452,196],[492,190],[524,172],[560,150],[600,134],
 [642,128],[676,112],[706,92],[740,72],[776,60],[808,84],[822,120],[812,156],
 [792,186],[800,214],[778,240],[752,258],[738,284],[734,312],[742,332],[762,342],
 [780,356],[762,374],[736,382],[744,404],[764,430],[780,458],[772,486],[784,508],
 [764,536],[776,562],[748,588],[718,610],[686,628],[650,646],[612,660],[574,666],
 [540,658],[508,666],[480,648],[458,622],[436,598],[412,604],[382,592],[352,560],
 [326,522],[300,490],[268,472],[228,462],[186,456],[146,436],[112,400],[84,360],
 [66,318],[56,282]
];

/* One seed per region. Position ≈ the historical heartland of that area. */
export const SEEDS = {
  XJN:[220,175], XJS:[170,265], TIB:[170,400], KHM:[285,440], QIN:[320,350],
  GAN:[420,255], NIN:[492,250], IMG:[604,184], HLJ:[762,120], JIL:[758,196],
  LIA:[700,250], HEB:[652,312], SHX:[586,306], SNX:[512,318], SHD:[722,350],
  HEN:[600,382], JSU:[726,416], ANH:[676,448], HUB:[612,450], SCH:[432,418],
  ZHE:[740,494], JXI:[676,520], HUN:[600,528], FUJ:[726,558], GDG:[646,608],
  GXI:[554,598], GZH:[490,518], YUN:[386,540]
};

/* Human-readable names used by labels and panels. */
export const REGION_NAMES = {
  XJN:'Dzungaria', XJS:'Tarim Basin', TIB:'Tibetan Plateau', KHM:'Kham',
  QIN:'Qinghai', GAN:'Hexi Corridor', NIN:'Ordos', IMG:'Inner Mongolia',
  HLJ:'Heilongjiang', JIL:'Jilin', LIA:'Liaodong', HEB:'Hebei', SHX:'Shanxi',
  SNX:'Guanzhong', SHD:'Shandong', HEN:'Central Plain', JSU:'Jiangsu',
  ANH:'Jianghuai', HUB:'Jingzhou', SCH:'Sichuan Basin', ZHE:'Zhejiang',
  JXI:'Jiangxi', HUN:'Hunan', FUJ:'Fujian', GDG:'Lingnan', GXI:'Guangxi',
  GZH:'Guizhou', YUN:'Yunnan'
};

/* Bays painted over the tessellation; keeps the base outline free of deep notches. */
export const SEAS = [
  { id:'bohai', name:'Bohai Gulf',
    pts:[[740,286],[718,292],[700,304],[692,322],[700,340],[718,346],[734,336],[742,314]] }
];

/* Rivers: polylines drawn above the regions. The Yellow River keeps its Ordos loop,
   which is the single most recognisable line on any map of China. */
export const RIVERS = [
  { id:'huanghe', name:'Yellow River', label:[536,232],
    pts:[[330,352],[372,340],[404,328],[436,300],[460,268],[478,236],[512,218],[544,224],
         [560,252],[566,284],[578,318],[604,348],[640,358],[676,352],[706,340],[722,330]] },
  { id:'changjiang', name:'Yangtze River', label:[520,474],
    pts:[[276,458],[320,452],[364,442],[404,438],[444,446],[478,458],[514,466],[552,462],
         [592,458],[632,454],[668,456],[704,466],[736,478],[760,486]] },
  { id:'zhujiang', name:'Pearl River', label:[560,598],
    pts:[[482,566],[516,578],[548,590],[584,602],[616,616],[642,630]] }
];

/* Decorative relief marks (hand-drawn bumps). */
export const MOUNTAINS = [
  [120,330],[162,352],[204,372],[246,392],[288,412],[230,432],[182,428],
  [332,300],[362,330],[302,250],[252,216],[198,200],[400,474],[362,502],[466,490],
  [148,250],[196,292],[266,330]
];

/* Shapes outside the tessellation: neighbours and islands, drawn faintly. */
export const OUTSIDE = {
  MGL:{ name:'Mongolian Steppe',
    pts:[[310,132],[366,104],[436,80],[516,64],[598,58],[668,62],[730,72],[776,60],
         [740,72],[706,92],[676,112],[642,128],[600,134],[560,150],[524,172],[492,190],
         [452,196],[414,190],[372,176],[334,156]] },
  KOR:{ name:'Korea',
    pts:[[798,212],[828,228],[842,260],[838,300],[822,332],[802,342],[790,318],[796,280],[786,244]] },
  VIE:{ name:'Annam',
    pts:[[436,598],[458,622],[480,648],[508,666],[518,702],[492,718],[462,702],[444,664],[428,624]] },
  TWN:{ name:'Taiwan',
    pts:[[806,548],[824,562],[832,594],[822,620],[806,610],[798,578]] },
  HAI:{ name:'Hainan',
    pts:[[594,684],[626,680],[640,698],[624,714],[596,710],[586,696]] }
};
