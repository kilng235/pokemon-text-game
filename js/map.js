const TRAINERS = {
  route1: [
    { id:'r1_1', name:'短裤少年',msg:'来对战吧！',team:[[19,2]],money:100 },
    { id:'r1_2', name:'精英训练家',msg:'让我看看你的实力！',team:[[16,3]],money:200 },
  ],
  route2: [
    { id:'r2_1', name:'捕虫少年',msg:'我抓了好多虫！',team:[[10,2],[13,3]],money:120 },
    { id:'r2_2', name:'迷你裙',msg:'可爱就赢了吗？',team:[[16,3],[39,4]],money:180 },
  ],
  route3: [
    { id:'r3_1', name:'登山男',msg:'登山健将在此！',team:[[74,5],[27,6]],money:220 },
    { id:'r3_2', name:'精英训练家',msg:'我要认真了！',team:[[56,6],[21,5]],money:250 },
  ],
  mtMoon: [
    { id:'mt_1', name:'火箭队手下',msg:'火箭队办事，闲人退散！',team:[[23,6],[41,7]],money:300 },
    { id:'mt_2', name:'研究员',msg:'我在研究化石……',team:[[35,5],[79,7]],money:200 },
  ],
  route4: [
    { id:'r4_1', name:'钓鱼人',msg:'钓到了什么？',team:[[118,8]],money:200 },
    { id:'r4_2', name:'泳裤男',msg:'来水里玩玩？',team:[[120,9],[72,8]],money:250 },
  ],
  route5: [
    { id:'r5_1', name:'少年',msg:'我每天都在训练！',team:[[19,9],[52,10]],money:250 },
    { id:'r5_2', name:'女学生',msg:'作业做完了才来玩的~',team:[[63,10],[35,9]],money:280 },
    { id:'r5_3', name:'空手道王',msg:'看我的拳头！',team:[[56,11],[66,12]],money:350 },
  ],
  route6: [
    { id:'r6_1', name:'精英训练家',msg:'你来晚了！',team:[[54,10],[120,11]],money:300 },
    { id:'r6_2', name:'露营少年',msg:'野外求生训练！',team:[[56,10],[23,11]],money:250 },
  ],
  viridianForest: [
    { id:'vf_1', name:'捕虫少年',msg:'森林是我的地盘！',team:[[10,3],[13,4],[48,4]],money:150 },
    { id:'vf_2', name:'野餐女孩',msg:'来野餐顺便对战~',team:[[69,4],[46,5]],money:180 },
  ],
  route7: [
    { id:'r7_1', name:'女学生',msg:'彩虹市的百货公司超好逛！',team:[[84,12],[37,13]],money:300 },
    { id:'r7_2', name:'精英训练家',msg:'一步都不会让你前进了！',team:[[58,14],[25,13]],money:400 },
  ],
  route8: [
    { id:'r8_1', name:'精英训练家',msg:'我可是很强的不像外表那样',team:[[81,14],[96,15]],money:400 },
    { id:'r8_2', name:'超能者',msg:'你的心思被我读透了……',team:[[63,15],[64,16]],money:450 },
  ],
  route9: [
    { id:'r9_1', name:'登山男',msg:'岩石才是我的伙伴！',team:[[74,15],[111,16]],money:380 },
    { id:'r9_2', name:'精英训练家',msg:'还没完呢！',team:[[98,16],[84,15],[61,17]],money:500 },
  ],
  route10: [
    { id:'r10_1', name:'电工',msg:'小心高压电！',team:[[100,16],[81,17]],money:400 },
    { id:'r10_2', name:'研究员',msg:'我在研究宝可梦生态。',team:[[25,17],[125,19]],money:450 },
  ],
  route11: [
    { id:'r11_1', name:'少年',msg:'我比看上去强多了！',team:[[19,16],[84,17],[100,18]],money:450 },
    { id:'r11_2', name:'钓鱼人',msg:'手上的宝可梦你猜得到吗？',team:[[118,17],[119,19]],money:420 },
  ],
  route15: [
    { id:'r15_1', name:'女学生',msg:'我已经收集了很多徽章！',team:[[48,18],[64,19],[83,18]],money:500 },
    { id:'r15_2', name:'精英训练家',msg:'最后的考验！',team:[[106,20],[107,19],[123,21]],money:600 },
  ],
  route16: [
    { id:'r16_1', name:'空手道王',msg:'格斗至上！',team:[[66,19],[56,20],[67,21]],money:520 },
    { id:'r16_2', name:'超能者',msg:'你没有胜算……',team:[[96,20],[97,22]],money:550 },
  ],
  route20: [
    { id:'r20_1', name:'泳客',msg:'水温刚好！',team:[[72,21],[120,22],[73,23]],money:550 },
  ],
  route21: [
    { id:'r21_1', name:'钓鱼人',msg:'从真新镇钓上来的！',team:[[129,6],[118,8]],money:200 },
  ],
  route22: [
    { id:'r22_1', name:'精英训练家',msg:'常青市的木桥是我的舞台！',team:[[56,3],[21,4]],money:220 },
  ],
  route24: [
    { id:'r24_1', name:'捕虫少年',msg:'虫子才是最强的！',team:[[10,7],[13,8],[14,9]],money:250 },
    { id:'r24_2', name:'短裤小子',msg:'来对战吧！',team:[[19,8],[29,9]],money:280 },
    { id:'r24_3', name:'迷你裙',msg:'我每天都在锻炼！',team:[[16,9],[39,10]],money:260 },
  ],
  ssAnne: [
    { id:'ss_1', name:'水手',msg:'在海上锻炼出来的男人！',team:[[98,10],[72,11]],money:350 },
    { id:'ss_2', name:'水手',msg:'风浪越大我心越浪！',team:[[118,12],[120,11]],money:360 },
    { id:'ss_3', name:'精英训练家',msg:'这艘船上我最强！',team:[[58,14],[25,13],[55,15]],money:500 },
  ],
  rocketHideout: [
    { id:'rh_1', name:'火箭队手下',msg:'你发现了秘密基地！',team:[[19,13],[52,14]],money:300 },
    { id:'rh_2', name:'火箭队手下',msg:'别想通过这里！',team:[[23,15],[41,16]],money:320 },
    { id:'rh_3', name:'火箭队干部',msg:'解决这个碍事的家伙！',team:[[109,18],[24,19],[110,20]],money:600 },
  ],
  victoryRoad: [
    { id:'vr_1', name:'精英训练家',msg:'这里是冠军之路！',team:[[75,30],[42,31],[34,32]],money:800 },
    { id:'vr_2', name:'精英训练家',msg:'四天王在等你！',team:[[112,32],[64,33],[22,31]],money:900 },
    { id:'vr_3', name:'精英训练家',msg:'我不会让你通过的！',team:[[65,34],[94,33],[68,32]],money:1000 },
  ],
  // 七之岛训练家
  island1: [
    { id:'i1_1', name:'泳裤男',msg:'七之岛的海水真蓝啊！',team:[[55,28],[130,30]],money:400 },
    { id:'i1_2', name:'捕虫少年',msg:'这里的虫子没见过的！',team:[[165,26],[166,28],[267,30]],money:380 },
  ],
  island1_route1: [
    { id:'i1r1_1', name:'精英训练家',msg:'这座岛可不简单！',team:[[277,30],[181,32]],money:500 },
    { id:'i1r1_2', name:'野餐女孩',msg:'脐眼森林里好神秘~',team:[[182,28],[103,30]],money:450 },
  ],
  island2: [
    { id:'i2_1', name:'女学生',msg:'游戏角最好玩了！',team:[[300,30],[310,32]],money:480 },
    { id:'i2_2', name:'水手',msg:'我在港口等你很久了！',team:[[98,32],[73,34]],money:550 },
  ],
  island2_route2: [
    { id:'i2r2_1', name:'露营少年',msg:'野外训练最棒了！',team:[[190,30],[335,32]],money:500 },
    { id:'i2r2_2', name:'迷你裙',msg:'来对战吧~',team:[[315,30],[214,32]],money:480 },
  ],
  island3: [
    { id:'i3_1', name:'精英训练家',msg:'树果森林里有好东西哦',team:[[103,34],[182,36]],money:600 },
  ],
  island3_forest: [
    { id:'i3f_1', name:'捕虫少年',msg:'我抓到了超稀有虫！',team:[[212,34],[267,36]],money:520 },
    { id:'i3f_2', name:'空手道王',msg:'森林修行开始！',team:[[286,35],[68,37]],money:580 },
  ],
  island4: [
    { id:'i4_1', name:'登山男',msg:'冰霜洞穴很危险的！',team:[[95,36],[208,38]],money:600 },
  ],
  island4_cave: [
    { id:'i4c_1', name:'精英训练家',msg:'好冷……但还能战！',team:[[124,37],[87,39]],money:650 },
    { id:'i4c_2', name:'研究员',msg:'这里的冰层有古老DNA……',team:[[362,38],[365,40]],money:620 },
  ],
  island5: [
    { id:'i5_1', name:'火箭队手下',msg:'又来了个多管闲事的！',team:[[262,38],[110,40]],money:500 },
    { id:'i5_2', name:'火箭队手下',msg:'不许通过！',team:[[262,39],[229,41]],money:520 },
  ],
  island5_rocket: [
    { id:'i5r_1', name:'火箭队干部',msg:'这里不是你能来的地方！',team:[[229,42],[110,44],[262,45]],money:800 },
    { id:'i5r_2', name:'火箭队干部',msg:'火箭队的计划不会让你破坏的！',team:[[169,43],[24,45],[89,46]],money:850 },
  ],
  island6: [
    { id:'i6_1', name:'超能者',msg:'遗迹在呼唤我……',team:[[178,40],[282,42]],money:700 },
  ],
  island6_ruins: [
    { id:'i6r_1', name:'精英训练家',msg:'神秘的力量……',team:[[354,42],[356,44]],money:750 },
    { id:'i6r_2', name:'超能者',msg:'你感受到了吗……？',team:[[326,44],[358,46]],money:780 },
  ],
  island7: [
    { id:'i7_1', name:'精英训练家',msg:'最后的岛屿了！',team:[[330,46],[373,48]],money:900 },
    { id:'i7_2', name:'泳客',msg:'绝壁岛的风景绝佳！',team:[[350,45],[319,47]],money:850 },
  ],
  island7_tower: [
    { id:'i7t_1', name:'精英训练家',msg:'训练家之塔的第一关！',team:[[68,48],[214,50]],money:1000 },
    { id:'i7t_2', name:'精英训练家',msg:'不会让你继续前进了！',team:[[248,52],[149,54]],money:1200 },
  ],
}

// 关都地图
const LOCATIONS = {
  pallet:    ['真新镇','大木博士的研究所就在这里。','town',true,false, ['route1','route21']],
  viridian:  ['常青市','通往联盟的关卡城市。','town',true,false, ['route1','route2','route22','viridianForest']],
  pewter:    ['深灰市','化石研究室所在地。','town',true,'brock', ['route2','route3','victoryRoad']],
  cerulean:    ['华蓝市','水边的美丽城市。','town',true,'misty', ['route4','route5','route9','route24','ceruleanCave']],
  vermilion: ['枯叶市','港口城市，圣安奴号在此。从这里可以乘船前往七之岛。','town',true,'ltSurge', ['route5','route6','route11','ssAnne','island1']],
  lavender:  ['紫苑镇','安宁的墓园小镇。','town',true,false, ['route6','route7','route8','route10','route12']],
  celadon:   ['彩虹市','关都最大的商业城市。','town',true,'erika', ['route7','route8','route16','route17','rocketHideout']],
  saffron:   ['金黄市','交通枢纽大都市。','town',true,'sabrina', ['route8','route5','route6','route7']],
  fuchsia:   ['浅红市','拥有野生原野区。','town',true,'koga', ['route15','route17','safariZone']],
  cinnabar:  ['红莲镇','火山岛上的研究城市。','town',true,'blaine', ['route21','route20','pokemonMansion']],
  indigo:    ['宝可梦联盟','关都顶点！','town',false,false, ['route23']],
  route1:    ['1号道路','真新镇到常青市的平坦道路。','route',false,false, ['pallet','viridian','route21'],
    { common:{ids:[16,19],lv:[2,4],w:60}, uncommon:{ids:[21],lv:[3,5],w:30}, rare:{ids:[56],lv:[4,6],w:10} }],
  route2:    ['2号道路','常青市到深灰市的森林路。','route',false,false, ['viridian','pewter','viridianForest'],
    { common:{ids:[10,13,16],lv:[3,5],w:60}, uncommon:{ids:[19,48],lv:[4,6],w:30}, rare:{ids:[25],lv:[5,7],w:10} }],
  route3:    ['3号道路','深灰市到月见山的山路。','route',false,false, ['pewter','mtMoon'],
    { common:{ids:[16,56,66],lv:[8,12],w:60}, uncommon:{ids:[23,27],lv:[10,14],w:30}, rare:{ids:[52,39],lv:[12,16],w:10} }],
  mtMoon:    ['月见山','据说有化石的洞穴。','cave',false,false, ['route3','route4'],
    { common:{ids:[41,74],lv:[10,14],w:55}, uncommon:{ids:[35,96],lv:[12,16],w:30}, rare:{ids:[104,46],lv:[14,18],w:15} }],
  route4:    ['4号道路','月见山到华蓝市的山道。','route',false,false, ['mtMoon','cerulean'],
    { common:{ids:[16,19,56],lv:[12,15],w:60}, uncommon:{ids:[37,54],lv:[13,17],w:30}, rare:{ids:[27,66],lv:[15,19],w:10} }],
  route5:    ['5号道路','华蓝市到金黄市的近路。','route',false,false, ['cerulean','saffron','vermilion'],
    { common:{ids:[19,56,52],lv:[14,18],w:60}, uncommon:{ids:[63,39],lv:[16,20],w:30}, rare:{ids:[35,133],lv:[18,22],w:10} }],
  route6:    ['6号道路','枯叶市与紫苑镇间。','route',false,false, ['vermilion','saffron','lavender'],
    { common:{ids:[19,52,48],lv:[16,20],w:60}, uncommon:{ids:[54,120],lv:[18,22],w:30}, rare:{ids:[84,128],lv:[20,24],w:10} }],
  route7:    ['7号道路','彩虹市到金黄市的短程。','route',false,false, ['celadon','saffron','lavender'],
    { common:{ids:[19,56,117],lv:[18,22],w:60}, uncommon:{ids:[84,37],lv:[20,24],w:30}, rare:{ids:[58,123],lv:[22,26],w:10} }],
  route8:    ['8号道路','彩虹市到紫苑镇的另一条路。','route',false,false, ['celadon','lavender','saffron','powerPlant'],
    { common:{ids:[48,23,56],lv:[18,22],w:60}, uncommon:{ids:[81,96],lv:[20,24],w:30}, rare:{ids:[125,126],lv:[22,26],w:10} }],
  route9:    ['9号道路','华蓝市到浅红市的岩石路。','route',false,false, ['cerulean','route10','powerPlant'],
    { common:{ids:[19,84,98],lv:[20,24],w:60}, uncommon:{ids:[23,111],lv:[22,26],w:30}, rare:{ids:[61,22],lv:[24,28],w:10} }],
  route10:   ['10号道路','紫苑镇到浅红市的电力之路。','route',false,false, ['lavender','route9','route12','powerPlant'],
    { common:{ids:[100,81,41],lv:[22,26],w:55}, uncommon:{ids:[25,100],lv:[24,28],w:30}, rare:{ids:[125,135],lv:[26,30],w:15} }],
  route11:   ['11号道路','枯叶市到浅红市。','route',false,false, ['vermilion','route12'],
    { common:{ids:[19,84,98],lv:[22,26],w:60}, uncommon:{ids:[21,100],lv:[24,28],w:30}, rare:{ids:[113,128],lv:[26,30],w:10} }],
  route12:   ['12号道路','紫苑镇通往南方的道路。','route',false,false,['lavender','route10','route11'],
    { common:{ids:[16,43,69],lv:[24,28],w:60}, uncommon:{ids:[44,70,83],lv:[26,30],w:30}, rare:{ids:[132,143],lv:[28,32],w:10} }],
  route15:   ['15号道路','浅红市向东。','route',false,false, ['fuchsia'],
    { common:{ids:[48,56,84],lv:[24,28],w:60}, uncommon:{ids:[43,64],lv:[26,30],w:30}, rare:{ids:[83,106],lv:[28,32],w:10} }],
  route16:   ['16号道路','彩虹市向东南。','route',false,false, ['celadon','route17','viridianForest'],
    { common:{ids:[19,21,84],lv:[24,28],w:60}, uncommon:{ids:[37,48],lv:[26,30],w:30}, rare:{ids:[52,123],lv:[28,32],w:10} }],
  route17:   ['17号道路','彩虹市到浅红市的自行车道。','route',false,false,['celadon','route16','fuchsia','viridianForest'],
    { common:{ids:[16,19,77],lv:[26,30],w:60}, uncommon:{ids:[22,78,84],lv:[28,32],w:30}, rare:{ids:[128,132],lv:[30,34],w:10} }],
  route20:   ['20号水道','红莲镇附近的水路。','water',false,false, ['cinnabar','seafoamIslands'],
    { common:{ids:[72,118,98],lv:[28,32],w:55}, uncommon:{ids:[54,116],lv:[30,34],w:30}, rare:{ids:[129,131],lv:[32,36],w:15} }],
  route21:   ['21号水道','真新镇到红莲镇的水路。','water',false,false, ['pallet','cinnabar','route1'],
    { common:{ids:[72,118,129],lv:[5,10],w:55}, uncommon:{ids:[98,54],lv:[8,14],w:30}, rare:{ids:[79,120],lv:[10,18],w:15} }],
  route22:   ['22号道路','常青市向西的山道。','route',false,false, ['viridian','route23'],
    { common:{ids:[19,21,56],lv:[2,6],w:60}, uncommon:{ids:[54,23],lv:[4,8],w:30}, rare:{ids:[25,133],lv:[6,10],w:10} }],
  route23:   ['23号道路','联盟的最终考验之路。','route',false,false, ['route22','victoryRoad','indigo'],
    { common:{ids:[75,42,34],lv:[38,42],w:50}, uncommon:{ids:[64,22],lv:[40,44],w:30}, rare:{ids:[65,149],lv:[42,46],w:20} }],
  victoryRoad: ['冠军之路','通往联盟的险峻洞穴。','cave',false,false, ['pewter','route23'],
    { common:{ids:[41,74,42],lv:[34,38],w:50}, uncommon:{ids:[95,111],lv:[36,40],w:30}, rare:{ids:[112,142],lv:[38,42],w:20} }],
  viridianForest: ['常青森林','常青市旁的密林。','cave',false,false, ['viridian','route2','route16','route17'],
    { common:{ids:[10,13,16],lv:[4,6],w:60}, uncommon:{ids:[48,46],lv:[5,7],w:30}, rare:{ids:[25,69],lv:[6,8],w:10} }],
  route24: ['24号道路','华蓝市北侧的海滨道路。','route',false,false,['cerulean','billHouse'],
    { common:{ids:[10,13,16],lv:[10,14],w:60}, uncommon:{ids:[43,63,69],lv:[12,16],w:30}, rare:{ids:[48],lv:[14,18],w:10} }],
  billHouse: ['海角小屋','正辉的海边研究所。','town',false,false,['route24']],
  ssAnne: ['圣安奴号','枯叶港停靠的豪华客轮。','route',false,false,['vermilion']],
  rocketHideout: ['火箭队地下基地','彩虹市游戏厅下方。','cave',false,false,['celadon'],
    { common:{ids:[19,41,52],lv:[18,22],w:55}, uncommon:{ids:[23,109],lv:[20,24],w:30}, rare:{ids:[24,110],lv:[22,26],w:15} }],
  powerPlant: ['无人发电站','废弃的发电厂深处。','cave',false,false,['route8','route9','route10'],
    { common:{ids:[81,100],lv:[24,28],w:55}, uncommon:{ids:[25,82],lv:[26,30],w:30}, rare:{ids:[125,145],lv:[28,35],w:15} }],
  seafoamIslands: ['双子岛','冰冷洞穴深处传来神秘的声音……','cave',false,false,['route20'],
    { common:{ids:[41,86,98],lv:[28,32],w:55}, uncommon:{ids:[42,79,120],lv:[30,34],w:30}, rare:{ids:[124,144],lv:[32,38],w:15} }],
  pokemonMansion: ['宝可梦屋','红莲岛上的废弃豪宅。','cave',false,false,['cinnabar'],
    { common:{ids:[37,58,77],lv:[30,35],w:55}, uncommon:{ids:[88,126],lv:[32,37],w:30}, rare:{ids:[89,132],lv:[34,40],w:15} }],
  ceruleanCave: ['华蓝洞穴','深不见底的传说洞穴。','cave',false,false,['cerulean'],
    { common:{ids:[41,42,111],lv:[50,55],w:55}, uncommon:{ids:[113,115,132],lv:[52,55],w:30}, rare:{ids:[150],lv:[70,70],w:15} }],
  safariZone: ['狩猎地带','浅红市北部的野生原野保护区。','route',false,false,['fuchsia'],
    { common:{ids:[29,30,32,33,102,111],lv:[20,28],w:50}, uncommon:{ids:[113,115,123,127],lv:[24,30],w:35}, rare:{ids:[112,128,132],lv:[26,32],w:15} }],
  route12: ['12号道路','紫苑镇通往南方的道路。','route',false,false,['lavender','route10','route11'],
    { common:{ids:[16,43,69],lv:[20,26],w:60}, uncommon:{ids:[44,70,83],lv:[22,28],w:30}, rare:{ids:[132,143],lv:[25,30],w:10} }],
  route17: ['17号道路','彩虹市到浅红市的自行车道。','route',false,false,['celadon','route16','fuchsia','viridianForest'],
    { common:{ids:[16,19,77],lv:[22,28],w:60}, uncommon:{ids:[22,78,84],lv:[24,30],w:30}, rare:{ids:[128,132],lv:[27,32],w:10} }],
  // 七之岛（火红/叶绿新增地区）
  island1: ['脐眼岛','七之岛的玄关口，有宝可梦中心和商店。','town',true,false,['vermilion','island1_route1','island2'],
    { common:{ids:[16,278],lv:[25,30],w:55}, uncommon:{ids:[277,279],lv:[28,33],w:30}, rare:{ids:[25,176],lv:[30,35],w:15} }],
  island1_route1: ['脐眼森林','通往岛内深处的森林小径。','route',false,false,['island1','island1_mtember'],
    { common:{ids:[10,13,163],lv:[25,32],w:55}, uncommon:{ids:[46,41,48],lv:[28,35],w:30}, rare:{ids:[165,285],lv:[32,38],w:15} }],
  island1_mtember: ['ember山','脐眼岛的火山上散布着神秘化石。','cave',false,false,['island1_route1'],
    { common:{ids:[37,66,77],lv:[30,38],w:50}, uncommon:{ids:[58,126],lv:[33,40],w:30}, rare:{ids:[38,219],lv:[36,45],w:20} }],
  island2: ['高岗岛','有游戏角的悠闲岛屿。','town',true,false,['island1','island2_route2'],
    { common:{ids:[19,278],lv:[28,34],w:55}, uncommon:{ids:[274,277],lv:[30,36],w:30}, rare:{ids:[176,25],lv:[33,38],w:15} }],
  island2_route2: ['高岗林间路','连接高岗岛各处的林间小道。','route',false,false,['island2','island3'],
    { common:{ids:[16,43,69],lv:[28,35],w:55}, uncommon:{ids:[44,114,274],lv:[32,38],w:30}, rare:{ids:[189,103],lv:[35,42],w:15} }],
  island3: ['绿色岛','充满树果和自然气息的岛屿。','town',true,false,['island2_route2','island3_forest','island3_route3'],
    { common:{ids:[102,114,191],lv:[30,36],w:55}, uncommon:{ids:[44,192,315],lv:[33,39],w:30}, rare:{ids:[103,182,45],lv:[36,44],w:15} }],
  island3_forest: ['树果森林','果实累累的茂密森林。','route',false,false,['island3','island3_route3'],
    { common:{ids:[43,102,114],lv:[30,38],w:55}, uncommon:{ids:[44,114,315],lv:[34,42],w:30}, rare:{ids:[182,83],lv:[38,48],w:15} }],
  island3_route3: ['绿色岛水路','通往四岛的碧蓝水道。','water',false,false,['island3','island3_forest','island4'],
    { common:{ids:[72,278,118],lv:[32,40],w:55}, uncommon:{ids:[73,279,119],lv:[35,42],w:30}, rare:{ids:[131,230],lv:[38,48],w:15} }],
  island4: ['冰霜岛','覆盖着厚厚冰层的岛屿。','route',true,false,['island3_route3','island4_cave'],
    { common:{ids:[86,220,278],lv:[34,42],w:50}, uncommon:{ids:[42,87,221],lv:[38,45],w:35}, rare:{ids:[124,131],lv:[40,50],w:15} }],
  island4_cave: ['冰霜洞穴','极寒的天然冰洞。','cave',false,false,['island4','island4_route4'],
    { common:{ids:[41,86,220],lv:[35,44],w:50}, uncommon:{ids:[42,87,221],lv:[38,48],w:35}, rare:{ids:[144,124],lv:[42,55],w:15} }],
  island4_route4: ['冰霜岛水路','通往五岛的冰冷海域。','water',false,false,['island4_cave','island5'],
    { common:{ids:[72,116,118],lv:[36,45],w:55}, uncommon:{ids:[73,117,119],lv:[40,48],w:30}, rare:{ids:[131,230],lv:[44,55],w:15} }],
  island5: ['群兰岛','火箭队秘密基地所在的岛屿。','town',true,false,['island4_route4','island5_rocket','island5_route5'],
    { common:{ids:[261,278],lv:[36,44],w:50}, uncommon:{ids:[262,279],lv:[40,48],w:35}, rare:{ids:[262],lv:[44,50],w:15} }],
  island5_rocket: ['火箭队仓库','火箭队残党盘踞的旧仓库。','cave',false,false,['island5'],
    { common:{ids:[19,41,109],lv:[38,46],w:50}, uncommon:{ids:[42,24,110],lv:[42,50],w:35}, rare:{ids:[169,89],lv:[46,55],w:15} }],
  island5_route5: ['群兰岛水路','通往六岛的危险海域。','water',false,false,['island5','island6'],
    { common:{ids:[116,118,223],lv:[38,46],w:55}, uncommon:{ids:[117,119,224],lv:[42,50],w:30}, rare:{ids:[350],lv:[46,55],w:15} }],
  island6: ['战怪岛','古代遗迹所在的谜之岛屿。','town',true,false,['island5_route5','island6_ruins','island6_route6'],
    { common:{ids:[355,352,200],lv:[40,48],w:50}, uncommon:{ids:[356,354,201],lv:[44,52],w:35}, rare:{ids:[302,292],lv:[48,58],w:15} }],
  island6_ruins: ['遗迹谷','刻满神秘图案的古代遗迹。','cave',false,false,['island6'],
    { common:{ids:[353,355,201],lv:[42,50],w:50}, uncommon:{ids:[354,356,292],lv:[46,55],w:35}, rare:{ids:[386],lv:[55,70],w:15} }],
  island6_route6: ['战怪岛水路','连接七岛的最后水路。','water',false,false,['island6','island7'],
    { common:{ids:[278,118,223],lv:[42,50],w:55}, uncommon:{ids:[279,119,224],lv:[46,54],w:30}, rare:{ids:[131,230],lv:[50,60],w:15} }],
  island7: ['绝壁岛','训练家之塔所在的最终岛屿。','route',true,false,['island6_route6','island7_tower'],
    { common:{ids:[278,276,207],lv:[44,52],w:50}, uncommon:{ids:[277,214,217],lv:[48,56],w:35}, rare:{ids:[330,373],lv:[52,62],w:15} }],
  island7_tower: ['训练家之塔','强者云集的对战高塔。','cave',false,false,['island7'],
    { common:{ids:[68,214,57],lv:[48,56],w:50}, uncommon:{ids:[64,65,68],lv:[52,60],w:35}, rare:{ids:[149],lv:[58,68],w:15} }],
}

const LINK_LABELS = {
  pallet:    { route1:'1号道路', route21:'21号水道' },
  viridian:  { route1:'1号道路', route2:'2号道路', route22:'22号道路', viridianForest:'常青森林' },
  pewter:    { route2:'2号道路', route3:'3号道路', victoryRoad:'冠军之路' },
  cerulean:  { route4:'4号道路', route5:'5号道路', route9:'9号道路', route24:'24号道路', ceruleanCave:'华蓝洞穴' },
  vermilion: { route5:'5号道路', route6:'6号道路', route11:'11号道路', ssAnne:'圣安奴号', island1:'🚢七之岛' },
  lavender:  { route6:'6号道路', route7:'7号道路', route8:'8号道路', route10:'10号道路', route12:'12号道路' },
  celadon:   { route7:'7号道路', route8:'8号道路', route16:'16号道路', route17:'17号道路', rocketHideout:'火箭队基地' },
  saffron:   { route5:'5号道路', route6:'6号道路', route7:'7号道路', route8:'8号道路' },
  fuchsia:   { route15:'15号道路', route17:'17号道路', safariZone:'狩猎地带' },
  cinnabar:  { route20:'20号水道', route21:'21号水道', pokemonMansion:'宝可梦屋' },
  route22:   { viridian:'常青市', route23:'23号道路' },
  route23:   { route22:'22号道路', victoryRoad:'冠军之路', indigo:'宝可梦联盟' },
  victoryRoad: { pewter:'深灰市', route23:'23号道路' },
  indigo:    { route23:'23号道路' },
  route9:    { cerulean:'华蓝市', route10:'10号道路', powerPlant:'无人发电站' },
  route10:   { lavender:'紫苑镇', route9:'9号道路', route12:'12号道路', powerPlant:'无人发电站' },
  powerPlant: { route8:'8号道路', route9:'9号道路', route10:'10号道路' },
  route11:   { vermilion:'枯叶市', route12:'12号道路' },
  route12:   { lavender:'紫苑镇', route10:'10号道路', route11:'11号道路' },
  route16:   { celadon:'彩虹市', route17:'17号道路', viridianForest:'常青森林' },
  route17:   { route16:'16号道路', fuchsia:'浅红市', viridianForest:'常青森林' },
  route1:    { pallet:'真新镇', viridian:'常青市', route21:'21号水道' },
  route2:    { viridian:'常青市', pewter:'深灰市', viridianForest:'常青森林' },
  island1:  { vermilion:'枯叶市', island1_route1:'脐眼森林', island2:'高岗岛' },
  island2:  { island1:'脐眼岛', island2_route2:'高岗林间路' },
  island3:  { island2_route2:'高岗林间路', island3_forest:'树果森林', island3_route3:'绿色岛水路' },
  island4:  { island3_route3:'绿色岛水路', island4_cave:'冰霜洞穴' },
  island5:  { island4_route4:'冰霜岛水路', island5_rocket:'火箭队仓库', island5_route5:'群兰岛水路' },
  island6:  { island5_route5:'群兰岛水路', island6_ruins:'遗迹谷', island6_route6:'战怪岛水路' },
  island7:  { island6_route6:'战怪岛水路', island7_tower:'训练家之塔' },
}

function getLocation(id) { return LOCATIONS[id] }
function getLeader(id) { return GYM_LEADERS[id] }
function getLocationConnections(id) { const l = LOCATIONS[id]; return l ? l[5] : [] }
function getTrainersForArea(id) { return TRAINERS[id] || [] }

// 关都地图坐标 (用于全屏ASCII地图)
const MAP_COORDS = {
  pallet:      { x:28, y:14, icon:'🏠' },
  viridian:    { x:28, y:10, icon:'🏙' },
  pewter:      { x:18, y:6,  icon:'🏛' },
  cerulean:    { x:38, y:6,  icon:'💧' },
  vermilion:   { x:42, y:12, icon:'⚓' },
  lavender:    { x:20, y:12, icon:'🗼' },
  celadon:     { x:12, y:12, icon:'🎰' },
  saffron:     { x:28, y:8,  icon:'🏢' },
  fuchsia:     { x:38, y:16, icon:'🎪' },
  cinnabar:    { x:6,  y:18, icon:'🌋' },
  indigo:      { x:50, y:4,  icon:'👑' },
  route1:      { x:28, y:12, icon:'·' },
  route2:      { x:22, y:8,  icon:'·' },
  route3:      { x:14, y:6,  icon:'·' },
  route4:      { x:30, y:6,  icon:'·' },
  route5:      { x:32, y:8,  icon:'·' },
  route6:      { x:36, y:12, icon:'·' },
  route7:      { x:16, y:12, icon:'·' },
  route8:      { x:20, y:8,  icon:'·' },
  route9:      { x:34, y:12, icon:'·' },
  route10:     { x:24, y:12, icon:'·' },
  route11:     { x:40, y:14, icon:'·' },
  route12:     { x:30, y:16, icon:'·' },
  route15:     { x:36, y:16, icon:'·' },
  route16:     { x:12, y:14, icon:'·' },
  route17:     { x:24, y:16, icon:'·' },
  route20:     { x:4,  y:18, icon:'~' },
  route21:     { x:18, y:18, icon:'~' },
  route22:     { x:22, y:10, icon:'·' },
  route23:     { x:50, y:6,  icon:'·' },
  mtMoon:      { x:22, y:6,  icon:'⛰' },
  viridianForest:{x:24, y:10, icon:'🌲' },
  victoryRoad: { x:46, y:6,  icon:'🏔' },
  billHouse:   { x:44, y:4,  icon:'🏠' },
  ssAnne:      { x:44, y:12, icon:'🚢' },
  rocketHideout:{x:10, y:12, icon:'💀' },
  powerPlant:  { x:30, y:10, icon:'⚡' },
  seafoamIslands:{x:4, y:16, icon:'❄' },
  pokemonMansion:{x:6, y:16, icon:'🏚' },
  ceruleanCave:{ x:42, y:6,  icon:'🕳' },
  safariZone:  { x:38, y:18, icon:'🦒' },
  // 七之岛
  island1:      { x:58, y:8,  icon:'🏝' },
  island1_route1:{x:58, y:6,  icon:'·' },
  island1_mtember:{ x:60, y:4, icon:'🌋' },
  island2:      { x:58, y:12, icon:'🎰' },
  island2_route2:{x:58, y:14, icon:'·' },
  island3:      { x:58, y:16, icon:'🏡' },
  island3_forest:{x:60, y:16, icon:'🌲' },
  island3_route3:{x:56, y:18, icon:'~' },
  island4:      { x:58, y:20, icon:'❄' },
  island4_cave: { x:60, y:20, icon:'⛰' },
  island4_route4:{x:56, y:22, icon:'~' },
  island5:      { x:58, y:24, icon:'🏙' },
  island5_rocket:{x:60, y:24, icon:'💀' },
  island5_route5:{x:56, y:26, icon:'~' },
  island6:      { x:58, y:28, icon:'🏚' },
  island6_ruins:{ x:60, y:28, icon:'🗿' },
  island6_route6:{x:56, y:30, icon:'~' },
  island7:      { x:58, y:32, icon:'🗼' },
  island7_tower:{ x:60, y:32, icon:'🏯' },
}

// 侧边栏紧凑型地图（探索模式使用）
const MAP_REGION_CONFIGS = {
  kanto: {
    title: '关都地区路线图',
    subtitle: '主线、道馆与相邻区域一眼看清',
    stageWidth: 1240,
    stageHeight: 800,
    paddingX: 76,
    paddingY: 68,
    nodeIds: Object.keys(MAP_COORDS).filter(id => !id.startsWith('island')),
  },
  sevii: {
    title: '七之岛航线图',
    subtitle: '岛屿航线、据点与目标区域总览',
    stageWidth: 800,
    stageHeight: 1040,
    paddingX: 100,
    paddingY: 60,
    nodeIds: Object.keys(MAP_COORDS).filter(id => id.startsWith('island')),
  },
}

for (const region of Object.values(MAP_REGION_CONFIGS)) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const id of region.nodeIds) {
    const coord = MAP_COORDS[id]
    if (!coord) continue
    minX = Math.min(minX, coord.x)
    maxX = Math.max(maxX, coord.x)
    minY = Math.min(minY, coord.y)
    maxY = Math.max(maxY, coord.y)
  }
  region.bounds = { minX, maxX, minY, maxY }
}

const QUEST_TARGET_LOCATIONS = {
  choose_starter: 'pallet',
  first_rival: 'pallet',
  go_viridian: 'viridian',
  get_package: 'cerulean',
  deliver_package: 'pallet',
  get_pokedex: 'pallet',
  go_pewter: 'pewter',
  beat_brock: 'pewter',
  mt_moon: 'mtMoon',
  beat_misty: 'cerulean',
  bill_house: 'billHouse',
  ss_anne: 'ssAnne',
  beat_surge: 'vermilion',
  rock_tunnel: 'lavender',
  pokemon_tower: 'lavender',
  beat_erika: 'celadon',
  rocket_hideout: 'rocketHideout',
  silph_co: 'saffron',
  beat_sabrina: 'saffron',
  beat_koga: 'fuchsia',
  safari_zone: 'safariZone',
  beat_blaine: 'cinnabar',
  beat_giovanni: 'viridian',
  final_rival: 'route22',
  elite_four: 'indigo',
  sevii_arrival: 'island1',
  sevii_rocket: 'island5_rocket',
  sevii_ruins: 'island6_ruins',
  sevii_tower: 'island7_tower',
}

const MAP_LABEL_OVERRIDES = {
  route1: '1号路',
  route2: '2号路',
  route3: '3号路',
  route4: '4号路',
  route5: '5号路',
  route6: '6号路',
  route7: '7号路',
  route8: '8号路',
  route9: '9号路',
  route10: '10号路',
  route11: '11号路',
  route12: '12号路',
  route15: '15号路',
  route16: '16号路',
  route17: '17号路',
  route20: '20号水道',
  route21: '21号水道',
  route22: '22号路',
  route23: '23号路',
  billHouse: '比尔小屋',
  ssAnne: '圣安奴号',
  rocketHideout: '火箭基地',
  powerPlant: '发电站',
  seafoamIslands: '双子岛',
  pokemonMansion: '宝可梦屋',
  ceruleanCave: '华蓝洞穴',
  safariZone: '狩猎地带',
  victoryRoad: '冠军之路',
  viridianForest: '常青森林',
  island1_route1: '脐眼森林',
  island1_mtember: 'Ember山',
  island2_route2: '高岗林间路',
  island3_forest: '树果森林',
  island3_route3: '绿色岛水路',
  island4_cave: '冰霜洞穴',
  island4_route4: '冰霜岛水路',
  island5_rocket: '火箭队仓库',
  island5_route5: '群兰岛水路',
  island6_ruins: '遗迹谷',
  island6_route6: '战怪岛水路',
  island7_tower: '训练家之塔',
}

const MAP_STAGE_LAYOUTS = {
  kanto: {
    pallet: { x: 15, y: 73 },
    route1: { x: 15, y: 60 },
    viridian: { x: 15, y: 46 },
    route2: { x: 15, y: 31 },
    viridianForest: { x: 24, y: 40 },
    pewter: { x: 15, y: 16 },
    route3: { x: 29, y: 16 },
    mtMoon: { x: 41, y: 16 },
    route4: { x: 53, y: 16 },
    cerulean: { x: 67, y: 16 },
    billHouse: { x: 82, y: 8 },
    ceruleanCave: { x: 82, y: 23 },
    route5: { x: 57, y: 28 },
    saffron: { x: 46, y: 34 },
    route6: { x: 60, y: 47 },
    vermilion: { x: 79, y: 48 },
    ssAnne: { x: 92, y: 53 },
    route11: { x: 87, y: 64 },
    route9: { x: 75, y: 30 },
    powerPlant: { x: 91, y: 31 },
    lavender: { x: 68, y: 34 },
    route10: { x: 71, y: 48 },
    route12: { x: 72, y: 65 },
    route7: { x: 33, y: 36 },
    route8: { x: 54, y: 23 },
    celadon: { x: 19, y: 40 },
    rocketHideout: { x: 7, y: 40 },
    route16: { x: 15, y: 56 },
    route17: { x: 28, y: 73 },
    fuchsia: { x: 58, y: 81 },
    route15: { x: 77, y: 73 },
    safariZone: { x: 77, y: 89 },
    route21: { x: 15, y: 89 },
    cinnabar: { x: 15, y: 99 },
    route20: { x: 4, y: 94 },
    seafoamIslands: { x: 2, y: 84 },
    pokemonMansion: { x: 26, y: 99 },
    route22: { x: 3, y: 45 },
    victoryRoad: { x: 89, y: 9 },
    route23: { x: 97, y: 18 },
    indigo: { x: 97, y: 5 },
  },
  sevii: {
    island1: { x: 49, y: 9 },
    island1_route1: { x: 49, y: 18 },
    island1_mtember: { x: 68, y: 8 },
    island2: { x: 49, y: 28 },
    island2_route2: { x: 49, y: 38 },
    island3: { x: 49, y: 48 },
    island3_forest: { x: 68, y: 48 },
    island3_route3: { x: 33, y: 57 },
    island4: { x: 49, y: 66 },
    island4_cave: { x: 68, y: 66 },
    island4_route4: { x: 33, y: 75 },
    island5: { x: 49, y: 83 },
    island5_rocket: { x: 69, y: 83 },
    island5_route5: { x: 33, y: 91 },
    island6: { x: 49, y: 91 },
    island6_ruins: { x: 69, y: 91 },
    island6_route6: { x: 33, y: 97 },
    island7: { x: 49, y: 99 },
    island7_tower: { x: 69, y: 99 },
  },
}

const MAP_STAGE_POINT_OFFSETS = {
  kanto: {},
  sevii: {},
}

const MAP_LABEL_DIRECTION_OVERRIDES = {
  kanto: {
    billHouse: 'label-below',
    cerulean: 'label-below',
    ceruleanCave: 'label-below',
    indigo: 'label-below',
    powerPlant: 'label-above',
    route11: 'label-above',
    route12: 'label-above',
    route15: 'label-above',
    route23: 'label-below',
    safariZone: 'label-right',
    ssAnne: 'label-below',
    vermilion: 'label-below',
    victoryRoad: 'label-below',
    route5: 'label-above',
    route6: 'label-right',
    route7: 'label-below',
    route8: 'label-left',
    route9: 'label-below',
    route10: 'label-below',
    lavender: 'label-left',
    celadon: 'label-below',
    route16: 'label-below',
    rocketHideout: 'label-right',
    saffron: 'label-above',
    fuchsia: 'label-right',
  },
}

const MAP_LABEL_OFFSET_OVERRIDES = {
  kanto: {
    powerPlant: { x: 6, y: -8 },
    route11: { x: 8, y: 0 },
    route12: { x: 8, y: 2 },
    route15: { x: 8, y: -6 },
    rocketHideout: { x: 22, y: 0 },
    ssAnne: { x: 10, y: 0 },
    billHouse: { x: 6, y: -2 },
  },
  sevii: {},
}

function getMapRegionKey(locationId) {
  return locationId && locationId.startsWith('island') ? 'sevii' : 'kanto'
}

function getMapRegionConfig(locationId) {
  return MAP_REGION_CONFIGS[getMapRegionKey(locationId)]
}

function getQuestTargetLocationId() {
  const quest = getCurrentQuest()
  if (!quest) return null
  return QUEST_TARGET_LOCATIONS[quest.id] || null
}

function getMapNodeLabel(id, loc) {
  if (MAP_LABEL_OVERRIDES[id]) return MAP_LABEL_OVERRIDES[id]
  if (!loc) return id
  return loc[0]
}

function getMapNodeGlyph(id, loc) {
  if (!loc) return '?'
  if (id === 'ssAnne') return '船'
  if (id === 'rocketHideout' || id === 'island5_rocket') return '火'
  if (id === 'powerPlant') return '电'
  if (id === 'safariZone') return '狩'
  if (loc[2] === 'town') return '城'
  if (loc[2] === 'route') return '路'
  if (loc[2] === 'cave') return '洞'
  if (loc[2] === 'water') return '水'
  return '点'
}

function getMapLabelDirection(regionKey, id, loc) {
  const override = MAP_LABEL_DIRECTION_OVERRIDES[regionKey] && MAP_LABEL_DIRECTION_OVERRIDES[regionKey][id]
  if (override) return override
  const layout = MAP_STAGE_LAYOUTS[regionKey] && MAP_STAGE_LAYOUTS[regionKey][id]
  const coord = layout || MAP_COORDS[id]
  const region = layout
    ? { bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 } }
    : MAP_REGION_CONFIGS[regionKey]
  if (!coord || !region) return 'label-right'
  const { minX, maxX, minY, maxY } = region.bounds
  const centerX = (minX + maxX) / 2
  if (coord.y <= minY + 1.4) return 'label-below'
  if (coord.y >= maxY - 1.4) return 'label-above'
  if (regionKey === 'sevii') {
    if (coord.x >= maxX - 0.6) return 'label-left'
    if (coord.x <= minX + 0.6) return 'label-right'
  }
  if (loc && loc[2] === 'route') {
    return coord.x > centerX ? 'label-left' : 'label-right'
  }
  return coord.x >= centerX + 1 ? 'label-left' : 'label-right'
}

function getMapRegionConnections(regionKey) {
  const region = MAP_REGION_CONFIGS[regionKey]
  if (!region) return []
  const nodeSet = new Set(region.nodeIds)
  const seen = new Set()
  const links = []
  for (const id of region.nodeIds) {
    const loc = LOCATIONS[id]
    if (!loc) continue
    for (const targetId of loc[5] || []) {
      if (!nodeSet.has(targetId)) continue
      const key = [id, targetId].sort().join('::')
      if (seen.has(key)) continue
      seen.add(key)
      links.push([id, targetId])
    }
  }
  return links
}

function getMapStagePoint(regionKey, id) {
  const region = MAP_REGION_CONFIGS[regionKey]
  if (!region) return null
  const layout = MAP_STAGE_LAYOUTS[regionKey] && MAP_STAGE_LAYOUTS[regionKey][id]
  if (layout) {
    const innerW = region.stageWidth - region.paddingX * 2
    const innerH = region.stageHeight - region.paddingY * 2
    return {
      x: region.paddingX + (layout.x / 100) * innerW,
      y: region.paddingY + (layout.y / 100) * innerH,
    }
  }
  const coord = MAP_COORDS[id]
  if (!coord) return null
  const spanX = Math.max(1, region.bounds.maxX - region.bounds.minX)
  const spanY = Math.max(1, region.bounds.maxY - region.bounds.minY)
  const innerW = region.stageWidth - region.paddingX * 2
  const innerH = region.stageHeight - region.paddingY * 2
  const offset = (MAP_STAGE_POINT_OFFSETS[regionKey] && MAP_STAGE_POINT_OFFSETS[regionKey][id]) || { x: 0, y: 0 }
  return {
    x: region.paddingX + ((coord.x - region.bounds.minX) / spanX) * innerW + offset.x,
    y: region.paddingY + ((coord.y - region.bounds.minY) / spanY) * innerH + offset.y,
  }
}

function getMapLabelOffset(regionKey, id) {
  return (MAP_LABEL_OFFSET_OVERRIDES[regionKey] && MAP_LABEL_OFFSET_OVERRIDES[regionKey][id]) || { x: 0, y: 0 }
}

function renderExpandedMapLegend() {
  return `
    <div class="map-legend map-legend-expanded">
      <span class="legend-item"><span class="legend-swatch current"></span> 当前位置</span>
      <span class="legend-item"><span class="legend-swatch target"></span> 主线目标</span>
      <span class="legend-item"><span class="legend-swatch neighbor"></span> 可直接前往</span>
      <span class="legend-item"><span class="legend-swatch gym-open"></span> 未通关道馆</span>
      <span class="legend-item"><span class="legend-swatch gym-cleared"></span> 已通关道馆</span>
    </div>
  `
}

function renderExpandedMapStage(regionKey, currentId, targetId) {
  const region = MAP_REGION_CONFIGS[regionKey]
  if (!region) return ''

  const currentLoc = LOCATIONS[currentId]
  const neighbors = new Set(((currentLoc && currentLoc[5]) || []).filter(id => region.nodeIds.includes(id)))
  const targetNeighbors = targetId && LOCATIONS[targetId]
    ? new Set(((LOCATIONS[targetId][5]) || []).filter(id => region.nodeIds.includes(id)))
    : new Set()

  let linesHtml = ''
  for (const [fromId, toId] of getMapRegionConnections(regionKey)) {
    const from = getMapStagePoint(regionKey, fromId)
    const to = getMapStagePoint(regionKey, toId)
    if (!from || !to) continue
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI
    const classes = ['map-link']
    if (fromId === currentId || toId === currentId) classes.push('is-current-path')
    if (targetId && (fromId === targetId || toId === targetId)) classes.push('is-target-path')
    linesHtml += `<div class="${classes.join(' ')}" style="left:${from.x}px;top:${from.y}px;width:${length}px;transform:rotate(${angle}deg);"></div>`
  }

  let nodesHtml = ''
  for (const id of region.nodeIds) {
    const loc = LOCATIONS[id]
    const point = getMapStagePoint(regionKey, id)
    if (!loc || !point) continue

    const classes = ['map-node', `node-${loc[2]}`, getMapLabelDirection(regionKey, id, loc)]
    if (id === currentId) classes.push('is-current')
    if (id === targetId) classes.push('is-target')
    if (neighbors.has(id)) classes.push('is-neighbor')
    if (targetNeighbors.has(id)) classes.push('is-target-neighbor')

    let gymBadge = ''
    if (loc[4]) {
      const gymData = GYM_LEADERS[loc[4]]
      const cleared = gymData && gymData[4] <= G.player.badge
      classes.push(cleared ? 'gym-cleared' : 'gym-open')
      gymBadge = `<span class="map-node-badge ${cleared ? 'cleared' : 'open'}">${cleared ? 'OK' : 'GYM'}</span>`
    }

    const label = getMapNodeLabel(id, loc)
    const glyph = getMapNodeGlyph(id, loc)
    const labelOffset = getMapLabelOffset(regionKey, id)
    nodesHtml += `
      <div class="${classes.join(' ')}" style="left:${point.x}px;top:${point.y}px;--label-nudge-x:${labelOffset.x}px;--label-nudge-y:${labelOffset.y}px;">
        <div class="map-node-core">
          <span class="map-node-glyph">${glyph}</span>
          ${gymBadge}
        </div>
        <div class="map-node-label">${label}</div>
      </div>
    `
  }

  return `
    <div class="world-map-shell">
      <div class="world-map-topbar">
        <div>
          <div class="world-map-heading">${region.title}</div>
          <div class="world-map-subtitle">${region.subtitle}</div>
        </div>
        <div class="world-map-summary">
          <span class="info-badge">${LOCATIONS[currentId] ? LOCATIONS[currentId][0] : '???'}</span>
          ${targetId && LOCATIONS[targetId] ? `<span class="info-badge target-badge">目标 ${LOCATIONS[targetId][0]}</span>` : ''}
        </div>
      </div>
      <div class="world-map-stage-wrap">
        <div class="world-map-stage ${regionKey === 'sevii' ? 'is-sevii' : 'is-kanto'}" style="width:${region.stageWidth}px;height:${region.stageHeight}px;">
          <div class="world-map-grid"></div>
          ${linesHtml}
          ${nodesHtml}
        </div>
      </div>
    </div>
  `
}

function renderSidebarMap() {
  const pos = G.player.position
  const loc = LOCATIONS[pos]
  const pkmLevel = G.player.pokemon.length > 0 ? Math.max(...G.player.pokemon.map(p => p.level)) : 1
  const badge = G.player.badge

  // 小网格 (36列 x 16行)
  const W = 36, H = 16
  const grid = Array.from({length:H}, () => Array(W).fill(' '))

  // 边框
  for (let x = 0; x < W; x++) { grid[0][x] = '═'; grid[H-1][x] = '═' }
  for (let y = 0; y < H; y++) { grid[y][0] = '║'; grid[y][W-1] = '║' }
  grid[0][0] = '╔'; grid[0][W-1] = '╗'; grid[H-1][0] = '╚'; grid[H-1][W-1] = '╝'

  // 标题
  const title = ' 关都 '
  const titleX = Math.floor((W - title.length) / 2)
  for (let i = 0; i < title.length; i++) grid[1][titleX + i] = title[i]

  // 简化的连接线（只保留主干）
  const connLines = [
    [28,14,28,12],[28,12,28,10],[28,10,22,10],[28,10,24,10],
    [22,8,18,6],[18,6,14,6],[14,6,22,6],[22,6,30,6],
    [30,6,38,6],[38,6,32,8],[32,8,28,8],[28,8,20,8],
    [28,8,16,12],[28,8,36,12],[36,12,42,12],[36,12,20,12],
    [12,12,12,14],[20,12,24,12],[24,12,38,16],[38,16,38,18],
    [28,14,18,18],[6,18,4,18],
  ]
  // 缩放坐标到小网格（关都范围: x[0~52], y[0~24] → 映射到 2~34, 2~14）
  const scaleX = (x) => Math.max(1, Math.min(W-2, 1 + Math.floor(x * (W-4) / 52)))
  const scaleY = (y) => Math.max(1, Math.min(H-2, 1 + Math.floor(y * (H-4) / 24)))

  for (const [x1,y1,x2,y2] of connLines) {
    const sx1=scaleX(x1), sx2=scaleX(x2), sy1=scaleY(y1), sy2=scaleY(y2)
    if (sy1 === sy2) {
      for (let x = Math.min(sx1,sx2); x <= Math.max(sx1,sx2); x++) {
        if (grid[sy1][x] === ' ') grid[sy1][x] = '─'
      }
    } else if (sx1 === sx2) {
      for (let y = Math.min(sy1,sy2); y <= Math.max(sy1,sy2); y++) {
        if (grid[y][sx1] === ' ') grid[y][sx1] = '│'
      }
    }
  }

  // 关键地点的图标
  const keyPoints = [
    ['pallet',28,14,'🏠'], ['viridian',28,10,'🏙'], ['pewter',18,6,'T'],
    ['cerulean',38,6,'T'], ['vermillion',42,12,'⚓'], ['lavender',20,12,'T'],
    ['celadon',12,12,'🎰'], ['saffron',28,8,'🏢'], ['fuchsia',38,16,'T'],
    ['cinnabar',6,18,'🌋'], ['indigo',50,4,'👑'],
  ]
  for (const [id, ox, oy, icon] of keyPoints) {
    const x = scaleX(ox), y = scaleY(oy)
    let display = icon
    if (id === pos) display = '★'
    else if (LOCATIONS[id] && LOCATIONS[id][4]) {
      const gymData = GYM_LEADERS[LOCATIONS[id][4]]
      display = gymData && gymData[4] <= badge ? '✔' : '!'
    }
    grid[y][x] = display
  }

  // 当前城镇用高亮标记
  if (loc && loc[2] === 'town') {
    const coord = MAP_COORDS[pos]
    if (coord) {
      const x = scaleX(coord.x), y = scaleY(coord.y)
      grid[y][x] = '★'
    }
  }

  // 生成 HTML
  let html = '<pre class="sidebar-map">'
  for (let y = 0; y < H; y++) html += grid[y].join('') + '\n'
  html += '</pre>'

  // 信息条
  html += `<div style="text-align:center;font-size:9px;color:#006a1a;margin-bottom:4px;">`
  html += `<span class="info-badge">${loc ? loc[0] : '???'}</span>`
  html += `<span class="info-badge">Lv.${pkmLevel}</span>`
  html += `<span class="info-badge">徽章${badge}/8</span>`
  html += `<span class="info-badge">💰${G.player.money}</span>`
  html += `<span class="info-badge">📖${G.player.seen.length}</span>`
  html += `</div>`

  return html
}

// ASCII地图渲染（完整版，用于展开的侧边栏）
function renderWorldMap() {
  const pos = G.player.position
  const regionKey = getMapRegionKey(pos)
  const region = getMapRegionConfig(pos)
  const rawTargetId = getQuestTargetLocationId()
  const targetId = rawTargetId && region && region.nodeIds.includes(rawTargetId) ? rawTargetId : null
  const main = $('main')
  if (!main) return

  let html = '<p class="section-title">🗺 世界地图</p>'
  html += renderExpandedMapStage(regionKey, pos, targetId)
  html += renderExpandedMapLegend()
  html += renderMapInfo()
  main.innerHTML = html

  const panel = $('map-panel')
  if (panel) panel.innerHTML = ''

  const actions = $('actions')
  if (actions) {
    actions.innerHTML = '<button class="btn" onclick="G.view=\'explore\';render()">← 返回探索</button>'
  }
}

function renderMapInfo() {
  const pos = G.player.position
  const loc = LOCATIONS[pos]
  if (!loc) return ''
  
  const badge = G.player.badge
  const pkmLevel = G.player.pokemon.length > 0 ? Math.max(...G.player.pokemon.map(p => p.level)) : 1
  
  let html = '<div class="map-info-panel">'
  
  // 当前位置
  html += `<div class="map-info-section">`
  html += `<div class="map-info-title">📍 当前位置</div>`
  html += `<div class="map-info-content">${loc[0]} (${loc[2] === 'town' ? '城镇' : loc[2] === 'cave' ? '洞穴' : loc[2] === 'water' ? '水道' : '道路'})</div>`
  html += `</div>`
  
  // 道馆进度
  html += `<div class="map-info-section">`
  html += `<div class="map-info-title">🏛 道馆进度 (${badge}/8)</div>`
  html += `<div class="map-info-content">`
  const gymOrder = ['brock','misty','ltSurge','erika','sabrina','koga','blaine','giovanni']
  const gymNames = ['深灰','华蓝','枯叶','彩虹','金黄','浅红','红莲','常青']
  for (let i = 0; i < gymOrder.length; i++) {
    const g = GYM_LEADERS[gymOrder[i]]
    const status = g[4] <= badge ? '✔' : '○'
    html += `<span class="gym-badge ${g[4] <= badge ? 'completed' : ''}">[${status}]${gymNames[i]}</span> `
  }
  html += `</div></div>`
  
  // 等级推荐
  html += `<div class="map-info-section">`
  html += `<div class="map-info-title">🎯 等级推荐</div>`
  html += `<div class="map-info-content">当前 Lv.${pkmLevel} → `
  if (pkmLevel <= 10) html += '推荐区域：真新镇周边(2-8级)'
  else if (pkmLevel <= 15) html += '推荐区域：华蓝市周边(8-14级)'
  else if (pkmLevel <= 20) html += '推荐区域：枯叶市周边(14-20级)'
  else if (pkmLevel <= 25) html += '推荐区域：彩虹市周边(20-26级)'
  else if (pkmLevel <= 30) html += '推荐区域：浅红市周边(26-32级)'
  else if (pkmLevel <= 35) html += '推荐区域：红莲镇周边(32-36级)'
  else html += '推荐区域：冠军之路(34-40级)'
  html += `</div></div>`
  
  // 主线任务
  html += `<div class="map-info-section">`
  html += `<div class="map-info-title">📋 主线任务</div>`
  html += `<div class="map-info-content">`
  const q = getCurrentQuest()
  if (q) html += `${q.name} - ${q.guidance}`
  else html += '所有主线任务已完成！'
  html += `</div></div>`
  
  // 宝可梦分布
  html += `<div class="map-info-section">`
  html += `<div class="map-info-title">🐾 周边宝可梦</div>`
  html += `<div class="map-info-content">`
  const connections = loc[5] || []
  for (const conn of connections.slice(0, 3)) {
    const cLoc = LOCATIONS[conn]
    if (!cLoc || !cLoc[6]) continue
    const enc = cLoc[6]
    const common = enc.common.ids.slice(0, 3).map(id => {
      const p = getPokemonData(id)
      return p ? p[1] : '?'
    }).join('/')
    html += `<div class="pokemon-area">${cLoc[0]}: ${common} (Lv.${enc.common.lv[0]}-${enc.common.lv[1]})</div>`
  }
  html += `</div></div>`
  
  html += `</div>`
  return html
}
