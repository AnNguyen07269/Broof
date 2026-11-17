/* lenses.js — the eight sidebar categories.
   CONTENT[periodId][categoryId] = {t: heading, b: [paragraphs]}
   Periods without an entry fall back to ERA defaults, so no panel is ever empty. */

export const CATEGORIES = [
  {id:'overview', c:'#4E6274', n:'Overview', s:'Overview',      i:'M3 12h18M12 3v18'},
  {id:'politics', c:'#6B7FA0', n:'Politics & Society', s:'Politics<br>Society', i:'M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6'},
  {id:'culture', c:'#C27B8A',  n:'Culture & Lifestyle', s:'Culture<br>Life', i:'M12 3v18M5 8c4-3 10-3 14 0M5 16c4 3 10 3 14 0'},
  {id:'building', c:'#A8794F', n:'Architecture & Engineering', s:'Building<br>Engineering', i:'M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5'},
  {id:'economy', c:'#5E8F72',  n:'Economy & Trade', s:'Economy<br>Trade', i:'M3 17l5-6 4 4 7-8M3 21h18'},
  {id:'innov', c:'#C9962F',    n:'Innovation & Entrepreneurship', s:'Innovation<br>Enterprise', i:'M12 2l2.4 6.5L21 10l-5 4.2L17.6 21 12 17.4 6.4 21 8 14.2 3 10l6.6-1.5z'},
  {id:'figures', c:'#8F7AA8',  n:'Historical Figures', s:'Historical<br>Figures', i:'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6'},
  {id:'lens', c:'#D66A4C',     n:"Builder's Lens", s:"Builder's<br>Lens",  i:'M12 4a8 8 0 100 16 8 8 0 000-16zm0 5a3 3 0 100 6 3 3 0 000-6z', special:true}
];

const L = (o,c,r,h) => ({o,c,r,h});

export const CONTENT = {
neolithic:{
 politics:{t:'Before states',b:['There are no kings here yet, and no writing. What the archaeology shows is villages that grow large enough to need coordination: shared granaries, defensive ditches, and burials that are suddenly very unequal. Hierarchy appears in the ground before it appears in any text.']},
 culture:{t:'Jade, silk and pots',b:['Liangzhu jade working is extraordinarily fine for a society without metal tools. Silk production is attested from the fourth millennium BCE. Painted Yangshao pottery carries designs — fish, faces, spirals — that were clearly meant to be looked at, not just used.']},
 building:{t:'Rammed earth and ditches',b:['Walls were built by pounding earth in layers inside wooden forms. Liangzhu also built large water-management works — dams and levees — centuries before any dynasty existed. Large-scale engineering is older than the state here.']},
 economy:{t:'Surplus and exchange',b:['Millet in the north, rice in the south. Once a village produced more than it ate, two things followed: some people stopped farming, and goods began moving between settlements. Jade travelled hundreds of kilometres.']},
 innov:{t:'The first compounding',b:['Pottery, sericulture, lacquer, jade working and wet-rice cultivation all appear in this long period. None has a named inventor. Each took generations of incremental improvement — the slowest and most important kind of innovation on this map.']},
 figures:{t:'No names',b:['Nobody from this period has a name we can know. The record is pots, post-holes and graves. It is worth sitting with that: thousands of years of human ingenuity, and not one person we can thank by name.']},
 lens:L('A reliable food surplus for the first time, and the free hours that came with it.',
        'Craft specialisation, long-distance exchange, and water control at village scale.',
        'These cultures rose and fell with climate and river behaviour; several vanished entirely.',
        'Everything later depends on this. It is also the clearest case of progress with no individual credit attached.')
},
xia:{
 politics:{t:'A dynasty on paper',b:['Later texts describe a hereditary Xia ruling house founded by Yu the Great, who supposedly tamed the floods. Those texts were written a thousand years or more after the events they describe.']},
 culture:{t:'The flood myth',b:['The Yu story matters whether or not it happened. It establishes an idea reused for three thousand years: that the right to rule is earned by public works, and specifically by controlling water.']},
 building:{t:'Erlitou',b:['The Erlitou site in Henan has large rammed-earth palace platforms, bronze workshops and planned roads, dating roughly 1900–1500 BCE. It is unquestionably a real early state centre. Whether it is "Xia" is a separate question.']},
 economy:{t:'Early bronze',b:['Erlitou produced the earliest known Chinese ritual bronze vessels. Bronze requires copper and tin from different places, so even this early there is a supply chain.']},
 innov:{t:'Alloy and administration',b:['Piece-mould bronze casting begins here. So, apparently, does the palace complex — a building type meant to concentrate authority in one place.']},
 figures:{t:'Yu the Great',b:['Credited with ending a great flood by dredging channels rather than damming, and with founding the dynasty. A legendary figure, but the engineering moral attached to him is real and recurring.']},
 lens:L('Floodplains are fertile and dangerous. Whoever solved that would be followed.',
        'Palace centres, bronze ritual equipment, and a founding story about competence.',
        'Not applicable — we cannot trace what happened to a dynasty we cannot confirm existed.',
        'The idea that legitimacy comes from solving a public problem outlived whatever the Xia actually were.')
},
'zhou-w':{
 politics:{t:'The Mandate of Heaven',b:['The Zhou justified overthrowing the Shang with a genuinely new argument: Heaven grants the right to rule, and withdraws it from rulers who govern badly. It legitimised them — and handed every future rebel a ready-made justification.']},
 culture:{t:'Ritual as order',b:['An elaborate ritual system governed music, dress, vessels and ceremony by rank. Confucius, five centuries later, looked back on this as the model of a well-ordered society.']},
 building:{t:'Two capitals',b:['Haojing in the Wei valley and Luoyi further east — a deliberate split between the homeland and the territory being administered.']},
 economy:{t:'Land and obligation',b:['Land was granted to relatives and allies in exchange for military service and tribute. It worked while the centre was strong, and became the mechanism of its collapse once it was not.']},
 innov:{t:'An idea, not a machine',b:['The Zhou contribution is conceptual: a theory of conditional legitimacy. It is arguably the most consequential political idea on this entire map.']},
 figures:{t:'The Duke of Zhou',b:['Regent for his young nephew, he gave up power when the king came of age rather than keeping it. Confucius treated him as the model of the loyal minister.']},
 lens:L('A large territory, too big to govern directly from one city.',
        'A delegated system of regional lords, held together by ritual and kinship.',
        'It decayed exactly as delegated systems do — the delegates stopped needing the centre.',
        'The Mandate made rulers theoretically accountable. Theoretically is doing work in that sentence, but it was not nothing.')
},
chunqiu:{
 politics:{t:'Power drains outward',b:['The Zhou king remains the ritual head while real power moves to regional states. A succession of hegemons claim to act in the king\u2019s name — a polite fiction everyone finds useful for a while.']},
 culture:{t:'Confucius',b:['Born 551 BCE into this disorder. His answer is not a system of law but a claim about character: that government works when those in it are cultivated, and that ritual and family obligation are the training ground for that.']},
 building:{t:'Walls everywhere',b:['Every serious state walled its capital. Iron tools made larger earthworks and canal projects feasible than before.']},
 economy:{t:'Iron and merchants',b:['Cast iron agricultural tools spread, raising yields. Merchants become wealthy enough to matter politically — and to make rulers nervous.']},
 innov:{t:'Competition starts the engine',b:['With survival at stake, states adopt anything that works: better metallurgy, bigger canals, written records. The Warring States that follow inherit this habit.']},
 figures:{t:'Confucius; Guan Zhong',b:['Confucius spent most of his life failing to find a ruler who would employ his ideas, and taught instead. Guan Zhong, chief minister of Qi a century earlier, built the economic and administrative base that made Qi the first hegemon.']},
 lens:L('Central authority weakened, leaving room for regional rulers to act independently.',
        'Stronger regional administration, iron agriculture, and a body of political philosophy.',
        'Most of these states were absorbed within three centuries.',
        'A period of real violence that produced the ethical tradition most of East Asia still argues with.')
},
'han-e':{
 politics:{t:'Restoration, then drift',b:['The Han was restored in 25 CE after Wang Mang\u2019s interregnum. Over the following two centuries power drifted toward consort families, court eunuchs and great landholding clans.']},
 culture:{t:'Buddhism arrives',b:['Buddhism enters along the trade routes during this period — initially a foreign curiosity, eventually one of the central forces in Chinese culture.']},
 building:{t:'Luoyang and the frontier',b:['A new capital at Luoyang, and continued investment in frontier garrisons, beacon towers and relay stations.']},
 economy:{t:'Estates and inequality',b:['Large self-sufficient estates grew, taking land and tax-paying peasants off the registers. The state\u2019s revenue base narrowed while its obligations did not.']},
 innov:{t:'Paper, and a seismoscope',b:['Paper-making was refined around 105 CE, credited to Cai Lun. Zhang Heng built a water-powered armillary sphere and a seismoscope that reportedly detected a distant earthquake.']},
 figures:{t:'Cai Lun; Zhang Heng',b:['Cai Lun, a court official, standardised a cheap paper from bark, hemp and rags. Zhang Heng was an astronomer, mathematician, poet and engineer — the period\u2019s most complete polymath.']},
 lens:L('A restored, wealthy empire with working long-distance trade.',
        'Cheap writing material, precision instruments, and a frontier logistics system.',
        'Weak. The dynasty could not reverse the concentration of land and ended in fragmentation.',
        'Paper made literacy affordable. That outlasted every political structure in this period.')
},
sanguo:{
 politics:{t:'Three claimants',b:['Wei in the north, Shu in the west, Wu in the south — each claiming legitimate succession to the Han. The period is brief but it became the single most retold era in Chinese popular culture.']},
 culture:{t:'History becomes legend',b:['The fourteenth-century novel Romance of the Three Kingdoms turned these men into archetypes. The novel is not history, and separating the two is a standing problem for anyone studying the period.']},
 building:{t:'Agricultural colonies',b:['All three states used tuntian — military-agricultural colonies where soldiers farmed in peacetime — to feed armies without destroying the tax base.']},
 economy:{t:'The south develops',b:['Wu\u2019s control of the Yangtze accelerated southern agriculture and shipbuilding. The long economic shift from north to south begins in earnest here.']},
 innov:{t:'Logistics as weapon',b:['Zhuge Liang is credited with the "wooden ox" transport device for moving grain through mountains. The era\u2019s real innovations were organisational: supply, colonies, river navies.']},
 figures:{t:'Zhuge Liang; Cao Cao',b:['Zhuge Liang, chancellor of Shu, became the archetype of the brilliant strategist. Cao Cao — ruthless administrator, capable poet — unified the north and is treated as a villain by the novel and as an effective ruler by historians.']},
 lens:L('Imperial collapse left three regional power bases, each with real resources.',
        'Three functioning states, agricultural colonies, and a southern maritime economy.',
        'All three fell within sixty years. None of them was the lasting achievement.',
        'The lasting effect was demographic: people moved south, and the south became rich.')
},
jin:{
 politics:{t:'Unity that did not hold',b:['The Jin reunified China in 280, then tore itself apart in a civil war among princes. Northern groups invaded, the north was lost, and the court fled to Jiankang in 317.']},
 culture:{t:'Retreat into art',b:['Blocked from meaningful office, educated men turned to calligraphy, poetry, wine and philosophical conversation. Wang Xizhi\u2019s calligraphy from this period is still the standard against which the art is measured.']},
 building:{t:'A southern capital',b:['Jiankang, on the site of modern Nanjing, became the model southern capital — defended by the Yangtze rather than by walls alone.']},
 economy:{t:'The great migration',b:['Elite northern families moved south in large numbers, bringing capital, labour and farming techniques. Southern land under cultivation expanded sharply.']},
 innov:{t:'Transplanting a civilisation',b:['The notable achievement is not a device. It is that a literate administrative culture was successfully relocated several hundred kilometres under military pressure, and survived.']},
 figures:{t:'Wang Xizhi',b:['The "Sage of Calligraphy." His Preface to the Orchid Pavilion Collection is the most famous piece of writing-as-art in the tradition, and survives only in copies.']},
 lens:L('Catastrophe created an opening in an underdeveloped south.',
        'A relocated state, a new capital, and a southern agricultural economy.',
        'This is reinvention under duress — the same pattern as the Southern Song eight centuries later.',
        'Enormous suffering in the north; the foundation of southern prosperity that still holds today.')
},
nanbei:{
 politics:{t:'Two Chinas',b:['Northern dynasties of steppe origin ruled the Yellow River plain; a succession of Chinese dynasties held the south. Neither could conquer the other for over 150 years.']},
 culture:{t:'Buddhism everywhere',b:['Buddhism became dominant in both halves — imperial patronage, monastery landholding, and the great cave temple complexes at Yungang and Longmen, carved at enormous expense.']},
 building:{t:'Cave temples',b:['Thousands of grottoes cut into cliff faces, filled with carved Buddhas, some over fifteen metres tall. Among the largest sculptural projects ever undertaken anywhere.']},
 economy:{t:'The equal-field system',b:['Northern Wei introduced a land allocation system assigning plots to households and reclaiming them on death. It was an attempt to stop land concentration, and later dynasties copied it.']},
 innov:{t:'Deliberate hybridisation',b:['Emperor Xiaowen of Northern Wei mandated Chinese dress, language and surnames at court. Institutions were consciously redesigned by rulers who were outsiders to them.']},
 figures:{t:'Emperor Xiaowen; Jia Sixie',b:['Xiaowen drove the sinicisation reforms. Jia Sixie wrote the Qimin Yaoshu, the most complete agricultural manual surviving from the ancient world anywhere.']},
 lens:L('Division meant two governments competing to prove they were the legitimate one.',
        'New land systems, a Buddhist institutional economy, and monumental art.',
        'Both halves were eventually absorbed by the Sui — but their institutions were the ones the Sui and Tang used.',
        'A reminder that periods labelled "disunity" are often where the durable institutions get invented.')
},
sui:{
 politics:{t:'Short and consequential',b:['The Sui reunified China in 589 after centuries of division, rebuilt central administration, and standardised law. It lasted thirty-seven years.']},
 culture:{t:'Examinations begin',b:['The Sui began recruiting officials through written examination — a system the Tang expanded and which shaped Chinese government for thirteen centuries.']},
 building:{t:'The Grand Canal',b:['Over a thousand kilometres of waterway linking the rice-growing south to the northern capitals, built with conscripted labour on an enormous scale and at enormous human cost. It is still in use.']},
 economy:{t:'Moving grain',b:['The canal solved a structural problem: the population and the food were in the south, the government and the army in the north. Everything after depends on that link.']},
 innov:{t:'Infrastructure at civilisational scale',b:['The Anji Bridge, completed around 605, is the oldest open-spandrel segmental arch bridge in the world and still stands. Different scale, same engineering confidence.']},
 figures:{t:'Emperor Yang; Li Chun',b:['Emperor Yang drove the canal and three disastrous invasions of Korea, and was killed by his own officers. Li Chun designed the Anji Bridge, which has survived earthquakes and floods for fourteen hundred years.']},
 lens:L('Reunification created the chance to build infrastructure no divided state could.',
        'The Grand Canal, a reformed bureaucracy, and examination recruitment.',
        'None. The regime spent its political capital and its subjects\u2019 lives in one generation.',
        'The clearest case on this map of a project that was worth building and a regime that destroyed itself building it.')
},
wudai:{
 politics:{t:'Five north, ten south',b:['Five short dynasties succeeded each other in the north while roughly ten kingdoms held the south. Northern regimes were often founded by military governors; southern ones were frequently more stable and much richer.']},
 culture:{t:'Printing spreads',b:['The Confucian classics were printed under state sponsorship for the first time in this period — a decisive step in making texts cheap and standard.']},
 building:{t:'Southern cities',b:['Hangzhou, Chengdu and Guangzhou grew substantially while the north was fought over. Infrastructure investment followed the money south.']},
 economy:{t:'Paper money begins',b:['Merchants in Sichuan issued deposit certificates that circulated as currency — the direct ancestor of the government jiaozi notes the Song would issue.']},
 innov:{t:'Invention in the gaps',b:['Printing and paper credit both matured during a politically chaotic half-century. Innovation does not require a strong central state; sometimes it requires its absence.']},
 figures:{t:'Qian Liu; Feng Dao',b:['Qian Liu of Wuyue invested in seawalls and irrigation rather than conquest, and his small kingdom prospered. Feng Dao served five successive dynasties and oversaw the first state printing of the classics — criticised for disloyalty, but the books survived.']},
 lens:L('A weak centre left southern rulers free to focus on trade rather than war.',
        'Printed books, paper credit, and seawall and canal infrastructure.',
        'The kingdoms were absorbed by the Song — but their innovations were adopted wholesale.',
        'The period is usually written off as chaos. Two of the most consequential tools in the economy came out of it.')
},
shang:{
 politics:{t:'Rule through ancestors',b:['Shang kings governed a network of allied and subordinate lineages rather than a bureaucratic state. Authority rested on descent, ritual and military success. Divination was a governing instrument: the king asked, the ancestors answered, and the record was kept.']},
 culture:{t:'Ritual and bronze',b:['Elite life centred on ancestral sacrifice. Bronze vessels were not decorative — they were the equipment of ritual, and owning them signalled the right to perform it. Human sacrifice is attested in royal tombs.']},
 building:{t:'Rammed earth',b:['City walls and platforms were built by pounding soil in layers between wooden forms. It is cheap, needs only labour, and lasts: the technique stayed in use for three thousand years.']},
 economy:{t:'Tribute, not markets',b:['Goods moved mainly as tribute and gift rather than through markets. Cowrie shells functioned as a store of value. Craft production was concentrated in workshops under elite control.']},
 innov:{t:'Writing and alloy',b:['Two durable innovations: a logographic script, and piece-mould bronze casting that allowed sharp, repeatable decoration at scale.']},
 figures:{t:'Fu Hao',b:['A royal consort and, unusually, a military commander. Her undisturbed tomb at Anyang held hundreds of bronzes and jades, and oracle bones record her leading troops.']},
 lens:L('A ruling house needed to coordinate people and legitimise itself across generations.',
        'A writing system, a ritual calendar, and large bronze workshops.',
        'The dynasty fell; the script and the metallurgy were adopted by the Zhou.',
        'Knowledge became transmissible across time. Everything later on this map depends on that.')
},
zhanguo:{
 politics:{t:'States that had to perform',b:['Seven large states competed for survival. That pressure produced registered populations, salaried officials in place of hereditary nobles, written legal codes and mass conscription. Administrative capacity became a weapon.']},
 culture:{t:'The Hundred Schools',b:['Confucians, Mohists, Daoists and Legalists argued about obligation, government and how to live amid disorder. The disorder is not incidental — the philosophy is a response to it.']},
 building:{t:'Walls and waterworks',b:['States built defensive walls and large irrigation projects. Dujiangyan, begun around 256 BCE, still irrigates the Chengdu plain today.']},
 economy:{t:'Iron and coinage',b:['Cast iron farm tools raised yields; multiple coin systems circulated — knife, spade and round coins depending on the state. Merchants grew wealthy enough to worry rulers.']},
 innov:{t:'Competition as a forcing function',b:['The crossbow, iron casting, large canals and bureaucratic record-keeping all spread because a state that skipped them lost. This is the clearest case on the map of rivalry driving adoption.']},
 figures:{t:'Shang Yang; Confucius',b:['Shang Yang restructured Qin around law, land tenure and military merit in the 4th century BCE. Confucius, a century earlier, argued that good government depended on cultivated character rather than coercion. Both answers were tested.']},
 lens:L('Survival was not guaranteed, so rulers would fund anything that worked.',
        'Legal codes, professional administration, mass armies and large infrastructure.',
        'Six of the seven states failed completely. The institutions they built were inherited by the winner.',
        'Enormous suffering and enormous institutional progress, simultaneously. Neither cancels the other.')
},
qin:{
 politics:{t:'One standard, enforced',b:['Qin abolished the old aristocratic holdings and ran the empire through centrally appointed commandery and county officials. Law was uniform and harshly enforced.']},
 culture:{t:'Standardisation as policy',b:['Script, weights, measures and axle widths were standardised. Texts that supported rival traditions were suppressed — the same impulse applied to ideas.']},
 building:{t:'Walls, roads, and a tomb',b:['Existing northern walls were linked into one line; a national road network was laid out; the First Emperor’s mausoleum complex included the terracotta army. All of it on conscript labour.']},
 economy:{t:'A single currency',b:['A standard round coin with a square hole replaced regional currencies, which lowered the friction of trade across the whole empire at once.']},
 innov:{t:'Interoperability',b:['Standard axle widths meant carts could use ruts cut by other carts. Standard script meant an order written in one province was readable in another. This is infrastructure as a protocol.']},
 figures:{t:'Qin Shi Huang; Li Si',b:['The First Emperor unified the states in 221 BCE. His chancellor Li Si drove standardisation and the suppression of rival schools. The dynasty did not outlive its founder by long.']},
 lens:L('Seven incompatible systems made empire-wide coordination impossible.',
        'A unified protocol layer: script, coin, measures, roads, law.',
        'None. The regime had no tolerance for dissent and collapsed within fifteen years of unification.',
        'The standards outlived the cruelty that imposed them, which is an uncomfortable but honest conclusion.')
},
'han-w':{
 politics:{t:'Empire with a civil service',b:['The Han kept Qin’s administrative machinery but softened it with Confucian moral language and recruited officials partly by recommendation. The combination proved durable for four centuries.']},
 culture:{t:'A shared frame',b:['Classical texts became the common reference for the educated. Silk, lacquer and music flourished. The historian Sima Qian wrote a comprehensive history that set the form for two thousand years of successors.']},
 building:{t:'Frontier logistics',b:['Garrisons, beacon towers and relay stations extended into the Hexi Corridor — the supporting infrastructure that made long-distance trade practical.']},
 economy:{t:'The roads west',b:['Missions sent west from the 130s BCE opened sustained contact with Central Asia. Silk went out; horses, crops, glass and ideas came back. Few merchants travelled the whole distance; goods were relayed.']},
 innov:{t:'Paper, iron, and the seed drill',b:['Paper-making was refined around 105 CE, the multi-tube seed drill raised sowing efficiency, and state iron monopolies spread cast-iron tools widely.']},
 figures:{t:'Zhang Qian; Sima Qian',b:['Zhang Qian was sent west in 138 BCE, held captive for years, and returned with the first detailed Chinese account of Central Asia. Sima Qian wrote the Records of the Grand Historian after choosing disgrace over death in order to finish it.']},
 lens:L('A stable, wealthy empire sat at the end of routes reaching toward other wealthy empires.',
        'Trade corridors, garrison logistics, and the manufactured goods worth carrying.',
        'The route depended on political stability at both ends and broke whenever either failed.',
        'Long-distance exchange of technique and belief, not just luxury goods — the more lasting import.')
},
tang:{
 politics:{t:'Recruitment by examination',b:['The examination system expanded, creating a route into government that did not depend only on birth. It never fully displaced aristocratic influence, but it changed who could aspire to govern.']},
 culture:{t:'An open capital',b:['Tang poetry is the period’s most lasting export. Chang’an hosted Buddhist, Nestorian Christian, Zoroastrian and Manichaean communities. Foreign music, dress and food were fashionable.']},
 building:{t:'The planned grid',b:['Chang’an was laid out as a walled rectangle of 108 wards on a strict axis — a deliberate statement that the city was governed, not grown.']},
 economy:{t:'Overland at its peak',b:['Central Asian trade ran at its highest volume. Government-regulated markets operated at fixed hours; commerce outside them was restricted.']},
 innov:{t:'Woodblock printing',b:['Printing from carved blocks appears in this period. The Diamond Sutra of 868, found at Dunhuang, is among the earliest dated printed books in the world.']},
 figures:{t:'Wu Zetian; Xuanzang',b:['Wu Zetian ruled in her own name — the only woman to do so — and widened recruitment by examination. The monk Xuanzang travelled to India and back over sixteen years and returned with texts he spent the rest of his life translating.']},
 lens:L('Unification plus secure overland routes concentrated people, goods and ideas in one place.',
        'A cosmopolitan capital, an examination bureaucracy, and printing.',
        'The An Lushan Rebellion of 755–763 broke the system; the dynasty survived another 150 years but never recovered its reach.',
        'It demonstrated that a very large, very diverse city could be governed — and how fast that can be lost.')
},
'song-n':{
 politics:{t:'Governed by examination graduates',b:['The Song expanded the examinations and staffed government with their graduates, deliberately subordinating the military to civil officials. It produced competent administration and a chronically weak northern frontier.']},
 culture:{t:'A print culture',b:['Cheap printed books spread literacy beyond the elite. Landscape painting, tea culture and urban entertainment districts all flourish here.']},
 building:{t:'Bridges and locks',b:['Segmental-arch bridges, the pound lock for canal navigation, and water-powered astronomical clockwork — notably Su Song’s clock tower of 1088.']},
 economy:{t:'Paper money and coal',b:['Government-issued jiaozi notes circulated from the 1020s. North China smelted iron using coal at a scale not matched elsewhere for centuries. Urban commerce ran day and night.']},
 innov:{t:'The famous cluster',b:['Movable type (described by Bi Sheng around 1040), the maritime compass, gunpowder weapons, and advanced metallurgy. Why this did not become an industrial revolution is one of the genuinely open questions in economic history.']},
 figures:{t:'Shen Kuo; Bi Sheng',b:['Shen Kuo recorded magnetic declination, fossils and printing technique in his Dream Pool Essays. Bi Sheng, an artisan, devised movable type from fired clay.']},
 lens:L('A dense, literate, commercial population with money that could actually move.',
        'Paper currency, printed books, ocean-going ships, coal-fired iron.',
        'The technology survived the dynasty’s military collapse and was carried south.',
        'Wider literacy and a consumer economy — alongside the first documented currency inflations.')
},
'song-s':{
 politics:{t:'A state on half its territory',b:['After 1127 the Song held only the south and paid for peace with the Jin. The court at Hangzhou governed a smaller but richer territory.']},
 culture:{t:'Neo-Confucian synthesis',b:['Zhu Xi reorganised Confucian thought into a systematic philosophy that shaped education across East Asia for the next seven hundred years.']},
 building:{t:'Ships with bulkheads',b:['Hulls were divided into watertight compartments, so a breach flooded one section rather than sinking the vessel — a safety principle still used today.']},
 economy:{t:'Turning to the sea',b:['Cut off from overland routes, the Song built up maritime trade. Quanzhou and Guangzhou grew into major international ports, with a Maritime Trade Bureau collecting duties.']},
 innov:{t:'Navigation',b:['The compass made open-water sailing viable when the sky was overcast. Combined with bulkhead hulls and stern-post rudders, it put reliable long-range shipping within reach.']},
 figures:{t:'Yue Fei; Zhu Xi',b:['The general Yue Fei became the enduring symbol of resistance to the northern conquest — and of a state executing its own defender for political convenience. Zhu Xi rebuilt Confucianism as a complete system.']},
 lens:L('Catastrophic territorial loss forced a search for another route to market.',
        'A maritime economy: ships, ports, navigation and customs administration.',
        'This is the clearest example of reinvention on the map — a response to defeat, not to opportunity.',
        'Coastal prosperity, and a durable exchange with South and West Asia.')
},
yuan:{
 politics:{t:'Rule from outside',b:['Mongol rulers governed through a layered hierarchy that placed Mongols and Central Asians above northern and southern Chinese subjects. Examinations were suspended for decades.']},
 culture:{t:'Vernacular drama',b:['Blocked from official careers, many educated men wrote instead. Yuan drama is the result — popular theatre in everyday language.']},
 building:{t:'Dadu and the canal',b:['A new capital was laid out at modern Beijing and the Grand Canal was re-routed to supply it.']},
 economy:{t:'One administration, continental reach',b:['Overland travel across Eurasia became safer under unified Mongol control, and long-distance trade expanded. The same corridors carried the plague west in the 1340s.']},
 innov:{t:'Transfer, not invention',b:['The Yuan period’s main contribution was movement — of techniques, crops, astronomy and people — across an unusually connected Eurasia.']},
 figures:{t:'Kublai Khan; Guo Shoujing',b:['Kublai founded the Yuan and moved the capital south. Guo Shoujing, an astronomer and engineer, calculated the year’s length to within about 26 seconds and rebuilt the canal supply to Dadu.']},
 lens:L('A single political authority briefly spanned most of Eurasia.',
        'Connection itself: postal relays, safer roads, shared standards.',
        'The empire fragmented within a century, and the routes closed again.',
        'Integration moves goods and knowledge. It also moves disease. Both arrived.')
},
ming:{
 politics:{t:'Centralised and inward-turning',b:['The Ming emperors concentrated power after abolishing the chancellorship. Policy increasingly prioritised the northern frontier and internal order over maritime projection.']},
 culture:{t:'Books for everyone',b:['Commercial publishing boomed: novels, manuals, almanacs, medical texts. Journey to the West and Water Margin come from this period.']},
 building:{t:'The Wall and the Forbidden City',b:['The stone-faced Great Wall most people picture is Ming. The Forbidden City, completed in 1420, laid imperial hierarchy out along a single axis.']},
 economy:{t:'The silver economy',b:['Taxes were converted to silver payment, drawing in enormous quantities of New World and Japanese silver. The late Ming ran a huge, largely private commercial economy — and became exposed to global bullion flows.']},
 innov:{t:'Voyages, then withdrawal',b:['Seven state fleets sailed between 1405 and 1433, reaching East Africa. Then the programme ended. It had no commercial constituency to defend it when court priorities changed.']},
 figures:{t:'Zheng He; Li Shizhen',b:['Zheng He, a Muslim eunuch admiral, commanded the treasure fleets. Li Shizhen spent nearly thirty years compiling the Bencao Gangmu, a systematic pharmacopoeia of almost 1,900 substances.']},
 lens:L('A capable state could project presence across the Indian Ocean.',
        'The largest fleets in the world at that moment, and the yards to build them.',
        'A failure of resilience: one patron, no revenue model, no constituency. It ended when attention moved.',
        'A hard lesson. Capability that nobody depends on does not survive a change of leadership.')
},
qing:{
 politics:{t:'A Manchu empire',b:['Manchu rulers governed the largest land empire in Chinese history, using distinct arrangements for Mongolia, Tibet and Xinjiang rather than one uniform system. From the 1840s, defeats forced concessions that steadily reduced sovereignty.']},
 culture:{t:'Compilation and constraint',b:['Vast scholarly projects were sponsored — and used to screen and suppress unwelcome texts. The novel Dream of the Red Chamber was written in this period.']},
 building:{t:'Garden and canal',b:['Imperial garden complexes at Chengde and the Summer Palace; continued canal and river works. The Old Summer Palace was looted and burned by British and French forces in 1860.']},
 economy:{t:'Growth, then forced opening',b:['Population roughly tripled during the High Qing on New World crops and internal peace. After 1842 a treaty-port system opened the coast on terms China did not set.']},
 innov:{t:'Self-Strengthening',b:['From 1861 officials built arsenals, shipyards, telegraphs and a modern navy, aiming to adopt foreign technology without foreign institutions. Defeat by Japan in 1895 was widely read as proof that this was not enough.']},
 figures:{t:'Kangxi; Lin Zexu',b:['The Kangxi Emperor reigned sixty-one years over a period of consolidation and growth. Lin Zexu, sent to suppress the opium trade in 1839, destroyed the confiscated stock — the immediate trigger for the First Opium War.']},
 lens:L('Enormous internal market, and later, unavoidable contact with industrialised powers.',
        'Arsenals, shipyards, telegraphs, modern schools — real industrial capacity, built fast.',
        'Technology was adopted while the institutions around it were not. The mismatch showed in 1895.',
        'The terms of this opening were set by force. Not every integration is a choice.')
},
roc:{
 politics:{t:'Republic, fragmentation, war',b:['The Qing fell in 1911–12. The republic that followed struggled against regional militarists, then faced Japanese invasion from 1931 and full war from 1937, alongside civil war.']},
 culture:{t:'May Fourth',b:['From 1919, a movement for vernacular writing, science and democratic reform reshaped Chinese intellectual life. Writers like Lu Xun turned fiction into social criticism.']},
 building:{t:'Railways and mills',b:['Rail networks and industrial plant expanded, concentrated in the coastal cities and the northeast — and heavily damaged by the war.']},
 economy:{t:'Industry under pressure',b:['Chinese-owned textile, flour and match industries grew quickly, especially while European competitors were occupied by the First World War, then were devastated after 1937.']},
 innov:{t:'Entrepreneurship in wartime',b:['Figures like Rong Zongjing built major industrial groups from nothing. Many firms were later relocated inland by hand ahead of the Japanese advance — an extraordinary logistical effort.']},
 figures:{t:'Sun Yat-sen; Lu Xun',b:['Sun Yat-sen articulated the republican programme and is claimed by both sides of the later divide. Lu Xun wrote the period’s most unsparing fiction about it.']},
 lens:L('An old order had collapsed and nothing had replaced it — maximum uncertainty, maximum room.',
        'Modern industry, modern publishing, modern universities.',
        'Most of it was destroyed or displaced by invasion and civil war within a generation.',
        'A reminder that entrepreneurial energy is not sufficient when the security environment fails.')
},
'prc-early':{
 politics:{t:'A planned state',b:['Land reform, nationalised industry and central planning were introduced from 1949, together with mass campaigns that were often violent.']},
 culture:{t:'Mobilised culture',b:['Art and literature were directed toward political ends. The Cultural Revolution (1966–76) closed universities for years and destroyed a great deal of cultural property.']},
 building:{t:'Dams, rail, and the Third Front',b:['Large hydro and rail projects were built, and industry was dispersed inland for strategic reasons at considerable economic cost.']},
 economy:{t:'Gains and catastrophe together',b:['Life expectancy and literacy rose substantially. The Great Leap Forward (1958–62) caused a famine that killed tens of millions. An honest account states both facts in the same breath.']},
 innov:{t:'Directed science',b:['Concentrated state effort produced nuclear weapons and satellites. Tu Youyou’s malaria work, begun under a military programme in 1969, later won a Nobel Prize.']},
 figures:{t:'Tu Youyou',b:['Working from classical medical texts under wartime research conditions, she identified artemisinin — a treatment that has since saved millions of lives.']},
 lens:L('A unified state could direct resources at a scale no private actor could match.',
        'Basic industry, mass education, public health, and some world-class science.',
        'The same centralisation that enabled fast mobilisation removed the feedback that would have stopped catastrophic policy.',
        'Real, measurable gains in health and literacy; also one of the deadliest famines in recorded history.')
},
reform:{
 politics:{t:'Permission to experiment',b:['From the Third Plenum of December 1978, the leadership allowed market activity, foreign investment and private enterprise — initially in defined zones rather than nationally. Political structure was not similarly liberalised.']},
 culture:{t:'Opening up',b:['Foreign films, music, fashion and ideas arrived rapidly. "Going into business" (xiahai) became a plausible life choice for the first time in decades.']},
 building:{t:'Building a city at speed',b:['Shenzhen’s construction rate became a slogan in itself. Infrastructure — ports, power, roads, housing — was built ahead of demand, on the bet that demand would arrive.']},
 economy:{t:'Special Economic Zones',b:['Shenzhen, Zhuhai, Shantou and Xiamen were designated in 1980, offering tax terms and regulatory latitude unavailable elsewhere. The approach was explicitly experimental: try it in a contained area, and extend what works.']},
 innov:{t:'Firms that still matter',b:['Huawei (1987), BYD (1995) and Tencent (1998) were all founded in Shenzhen; Alibaba (1999) in Hangzhou. None began with advanced technology. They began with access to a supply chain and permission to trade.']},
 figures:{t:'Deng Xiaoping; Ren Zhengfei',b:['Deng drove the reform agenda and his 1992 southern tour re-committed to it after a period of retrenchment. Ren Zhengfei, a former military engineer, founded Huawei in 1987 with about 21,000 yuan in capital.']},
 lens:L('A large, young, low-cost workforce sat next to Hong Kong’s capital and export expertise.',
        'Export manufacturing, then components, then design — moving up the chain in steps.',
        'Contained by design: the zones were walled off so failure would not spread. That containment is what made the risk acceptable.',
        'Several hundred million people moved out of poverty. It also produced migrant family separation, long hours and severe environmental cost.')
},
modern:{
 politics:{t:'A state-directed market',b:['Industrial policy targets specific sectors — semiconductors, electric vehicles, AI — through subsidy, procurement and investment. The approach has produced both globally competitive firms and significant overcapacity.']},
 culture:{t:'A phone-shaped life',b:['Mobile payments, super-apps and short video became near-universal very quickly. Debate over screen time, algorithmic recommendation and work culture is as active in China as anywhere.']},
 building:{t:'Scale and speed',b:['High-speed rail, ports and grid infrastructure were built at exceptional scale. The property sector, long the growth engine, has been in significant distress since 2021.']},
 economy:{t:'Up the value chain',b:['WTO accession in 2001 made China the centre of global manufacturing. The strategic shift since has been from assembly toward design, components and brands. Shenzhen’s 2025 GDP was about 3.87 trillion yuan (roughly US$557 billion), with R&D spending near 6.5% of GDP.']},
 innov:{t:'Where the frontier is now',b:['Electric vehicles and batteries, telecommunications equipment, consumer electronics, drones and AI. In 2025 BYD sold about 2.26 million battery-electric vehicles, passing Tesla’s 1.64 million for the first time.']},
 figures:{t:'Founders',b:['Ren Zhengfei (Huawei), Wang Chuanfu (BYD), Pony Ma (Tencent), Jack Ma (Alibaba), Zhang Yiming (ByteDance). All built in the window opened after 1978 — none of them created that window.']},
 lens:L('A complete supply chain, a very large domestic market, and heavy state investment in capability.',
        'Global-scale manufacturing, and increasingly the designs and brands on top of it.',
        'Firms here have had to absorb export controls, platform regulation and brutal domestic price competition.',
        'Cheaper goods worldwide and real technological progress — against long hours, surveillance concerns and uneven distribution of the gains.')
}
};

/* Fallbacks so every period has something to show. */
export const ERA_DEFAULT = {
 politics:{t:'Politics & society',b:['Authority in this period rested on a mix of lineage, military force and administrative routine. Use the timeline to compare how different periods solved the same problem of governing a very large area.']},
 culture:{t:'Culture & lifestyle',b:['Daily life varied enormously by region and class. The atlas highlights the periods where the evidence is richest; select a major dynasty for detail.']},
 building:{t:'Architecture & engineering',b:['Rammed earth, timber frames with bracket sets, and large water-management works recur across almost every period on this map.']},
 economy:{t:'Economy & trade',b:['Agriculture dominated output in every pre-modern period. What changes is how surplus moved: tribute, markets, currency, and long-distance exchange.']},
 innov:{t:'Innovation & entrepreneurship',b:['Select a major dynasty to see what was built, by whom, and what happened to it afterwards.']},
 figures:{t:'Historical figures',b:['Named individuals are better documented in some periods than others. Absence of names is a gap in the record, not an absence of people.']},
 lens:L('Every period on this map contained people who saw a possibility in their circumstances.',
        'What they built was shaped by the tools, institutions and permissions available to them.',
        'Almost nothing here survived unchanged. What persisted was adapted.',
        'Ask of any period: who benefited, who paid, and what outlived them?')
};

export function contentFor(periodId, catId){
  return (CONTENT[periodId] && CONTENT[periodId][catId]) || ERA_DEFAULT[catId] || null;
}
