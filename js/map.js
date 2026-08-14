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
  pallet: { name:'真新镇', desc:'大木博士的研究所就在这里。', type:'town', hasCenter:true, connects:["route1","route21"] },
  viridian: { name:'常青市', desc:'通往联盟的关卡城市。', type:'town', hasCenter:true, connects:["route1","route2","route22","viridianForest"] },
  pewter: { name:'深灰市', desc:'化石研究室所在地。', type:'town', hasCenter:true, gymLeader:'brock', connects:["route2","route3","victoryRoad"] },
  cerulean: { name:'华蓝市', desc:'水边的美丽城市。', type:'town', hasCenter:true, gymLeader:'misty', connects:["route4","route5","route9","route24","ceruleanCave"] },
  vermilion: { name:'枯叶市', desc:'港口城市，圣安奴号在此。从这里可以乘船前往七之岛。', type:'town', hasCenter:true, gymLeader:'ltSurge', connects:["route5","route6","route11","ssAnne","island1"] },
  lavender: { name:'紫苑镇', desc:'安宁的墓园小镇。', type:'town', hasCenter:true, connects:["route6","route7","route8","route10","route12"] },
  celadon: { name:'彩虹市', desc:'关都最大的商业城市。', type:'town', hasCenter:true, gymLeader:'erika', connects:["route7","route8","route16","route17","rocketHideout"] },
  saffron: { name:'金黄市', desc:'交通枢纽大都市。', type:'town', hasCenter:true, gymLeader:'sabrina', connects:["route8","route5","route6","route7"] },
  fuchsia: { name:'浅红市', desc:'拥有野生原野区。', type:'town', hasCenter:true, gymLeader:'koga', connects:["route15","route17","safariZone"] },
  cinnabar: { name:'红莲镇', desc:'火山岛上的研究城市。', type:'town', hasCenter:true, gymLeader:'blaine', connects:["route21","route20","pokemonMansion"] },
  indigo: { name:'宝可梦联盟', desc:'关都顶点！', type:'town', hasCenter:false, connects:["route23"] },
  route1: { name:'1号道路', desc:'真新镇到常青市的平坦道路。', type:'route', hasCenter:false, connects:["pallet","viridian","route21"], wild:{"common":{"ids":[16,19],"lv":[2,4],"w":60},"uncommon":{"ids":[21],"lv":[3,5],"w":30},"rare":{"ids":[56],"lv":[4,6],"w":10}} },
  route2: { name:'2号道路', desc:'常青市到深灰市的森林路。', type:'route', hasCenter:false, connects:["viridian","pewter","viridianForest"], wild:{"common":{"ids":[10,13,16],"lv":[3,5],"w":60},"uncommon":{"ids":[19,48],"lv":[4,6],"w":30},"rare":{"ids":[25],"lv":[5,7],"w":10}} },
  route3: { name:'3号道路', desc:'深灰市到月见山的山路。', type:'route', hasCenter:false, connects:["pewter","mtMoon"], wild:{"common":{"ids":[16,56,66],"lv":[8,12],"w":60},"uncommon":{"ids":[23,27],"lv":[10,14],"w":30},"rare":{"ids":[52,39],"lv":[12,16],"w":10}} },
  mtMoon: { name:'月见山', desc:'据说有化石的洞穴。', type:'cave', hasCenter:false, connects:["route3","route4"], wild:{"common":{"ids":[41,74],"lv":[10,14],"w":55},"uncommon":{"ids":[35,96],"lv":[12,16],"w":30},"rare":{"ids":[104,46],"lv":[14,18],"w":15}} },
  route4: { name:'4号道路', desc:'月见山到华蓝市的山道。', type:'route', hasCenter:false, connects:["mtMoon","cerulean"], wild:{"common":{"ids":[16,19,56],"lv":[12,15],"w":60},"uncommon":{"ids":[37,54],"lv":[13,17],"w":30},"rare":{"ids":[27,66],"lv":[15,19],"w":10}} },
  route5: { name:'5号道路', desc:'华蓝市到金黄市的近路。', type:'route', hasCenter:false, connects:["cerulean","saffron","vermilion"], wild:{"common":{"ids":[19,56,52],"lv":[14,18],"w":60},"uncommon":{"ids":[63,39],"lv":[16,20],"w":30},"rare":{"ids":[35,133],"lv":[18,22],"w":10}} },
  route6: { name:'6号道路', desc:'枯叶市与紫苑镇间。', type:'route', hasCenter:false, connects:["vermilion","saffron","lavender"], wild:{"common":{"ids":[19,52,48],"lv":[16,20],"w":60},"uncommon":{"ids":[54,120],"lv":[18,22],"w":30},"rare":{"ids":[84,128],"lv":[20,24],"w":10}} },
  route7: { name:'7号道路', desc:'彩虹市到金黄市的短程。', type:'route', hasCenter:false, connects:["celadon","saffron","lavender"], wild:{"common":{"ids":[19,56,117],"lv":[18,22],"w":60},"uncommon":{"ids":[84,37],"lv":[20,24],"w":30},"rare":{"ids":[58,123],"lv":[22,26],"w":10}} },
  route8: { name:'8号道路', desc:'彩虹市到紫苑镇的另一条路。', type:'route', hasCenter:false, connects:["celadon","lavender","saffron","powerPlant"], wild:{"common":{"ids":[48,23,56],"lv":[18,22],"w":60},"uncommon":{"ids":[81,96],"lv":[20,24],"w":30},"rare":{"ids":[125,126],"lv":[22,26],"w":10}} },
  route9: { name:'9号道路', desc:'华蓝市到浅红市的岩石路。', type:'route', hasCenter:false, connects:["cerulean","rockTunnel","powerPlant"], wild:{"common":{"ids":[19,84,98],"lv":[20,24],"w":60},"uncommon":{"ids":[23,111],"lv":[22,26],"w":30},"rare":{"ids":[61,22],"lv":[24,28],"w":10}} },
  rockTunnel: { name:'岩山隧道', desc:'连接9号道路与10号道路的漆黑隧道。', type:'cave', hasCenter:false, connects:["route9","route10"], wild:{"common":{"ids":[41,74],"lv":[16,20],"w":60},"uncommon":{"ids":[42,95],"lv":[18,22],"w":30},"rare":{"ids":[111],"lv":[20,24],"w":10}} },
  route10: { name:'10号道路', desc:'紫苑镇到浅红市的电力之路。', type:'route', hasCenter:false, connects:["lavender","rockTunnel","route12","powerPlant"], wild:{"common":{"ids":[100,81,41],"lv":[22,26],"w":55},"uncommon":{"ids":[25,100],"lv":[24,28],"w":30},"rare":{"ids":[125,135],"lv":[26,30],"w":15}} },
  route11: { name:'11号道路', desc:'枯叶市到浅红市。', type:'route', hasCenter:false, connects:["vermilion","route12"], wild:{"common":{"ids":[19,84,98],"lv":[22,26],"w":60},"uncommon":{"ids":[21,100],"lv":[24,28],"w":30},"rare":{"ids":[113,128],"lv":[26,30],"w":10}} },
  route12: { name:'12号道路', desc:'紫苑镇通往南方的道路。', type:'route', hasCenter:false, connects:["lavender","route10","route11"], wild:{"common":{"ids":[16,43,69],"lv":[24,28],"w":60},"uncommon":{"ids":[44,70,83],"lv":[26,30],"w":30},"rare":{"ids":[132,143],"lv":[28,32],"w":10}} },
  route15: { name:'15号道路', desc:'浅红市向东。', type:'route', hasCenter:false, connects:["fuchsia"], wild:{"common":{"ids":[48,56,84],"lv":[24,28],"w":60},"uncommon":{"ids":[43,64],"lv":[26,30],"w":30},"rare":{"ids":[83,106],"lv":[28,32],"w":10}} },
  route16: { name:'16号道路', desc:'彩虹市向东南。', type:'route', hasCenter:false, connects:["celadon","route17","viridianForest"], wild:{"common":{"ids":[19,21,84],"lv":[24,28],"w":60},"uncommon":{"ids":[37,48],"lv":[26,30],"w":30},"rare":{"ids":[52,123],"lv":[28,32],"w":10}} },
  route17: { name:'17号道路', desc:'彩虹市到浅红市的自行车道。', type:'route', hasCenter:false, connects:["celadon","route16","fuchsia","viridianForest"], wild:{"common":{"ids":[16,19,77],"lv":[26,30],"w":60},"uncommon":{"ids":[22,78,84],"lv":[28,32],"w":30},"rare":{"ids":[128,132],"lv":[30,34],"w":10}} },
  route20: { name:'20号水道', desc:'红莲镇附近的水路。', type:'water', hasCenter:false, connects:["cinnabar","seafoamIslands"], wild:{"common":{"ids":[72,118,98],"lv":[28,32],"w":55},"uncommon":{"ids":[54,116],"lv":[30,34],"w":30},"rare":{"ids":[129,131],"lv":[32,36],"w":15}} },
  route21: { name:'21号水道', desc:'真新镇到红莲镇的水路。', type:'water', hasCenter:false, connects:["pallet","cinnabar","route1"], wild:{"common":{"ids":[72,118,129],"lv":[5,10],"w":55},"uncommon":{"ids":[98,54],"lv":[8,14],"w":30},"rare":{"ids":[79,120],"lv":[10,18],"w":15}} },
  route22: { name:'22号道路', desc:'常青市向西的山道。', type:'route', hasCenter:false, connects:["viridian","route23"], wild:{"common":{"ids":[19,21,56],"lv":[2,6],"w":60},"uncommon":{"ids":[54,23],"lv":[4,8],"w":30},"rare":{"ids":[25,133],"lv":[6,10],"w":10}} },
  route23: { name:'23号道路', desc:'联盟的最终考验之路。', type:'route', hasCenter:false, connects:["route22","victoryRoad","indigo"], wild:{"common":{"ids":[75,42,34],"lv":[38,42],"w":50},"uncommon":{"ids":[64,22],"lv":[40,44],"w":30},"rare":{"ids":[65,149],"lv":[42,46],"w":20}} },
  victoryRoad: { name:'冠军之路', desc:'通往联盟的险峻洞穴。', type:'cave', hasCenter:false, connects:["pewter","route23"], wild:{"common":{"ids":[41,74,42],"lv":[34,38],"w":50},"uncommon":{"ids":[95,111],"lv":[36,40],"w":30},"rare":{"ids":[112,142],"lv":[38,42],"w":20}} },
  viridianForest: { name:'常青森林', desc:'常青市旁的密林。', type:'cave', hasCenter:false, connects:["viridian","route2","route16","route17"], wild:{"common":{"ids":[10,13,16],"lv":[4,6],"w":60},"uncommon":{"ids":[48,46],"lv":[5,7],"w":30},"rare":{"ids":[25,69],"lv":[6,8],"w":10}} },
  route24: { name:'24号道路', desc:'华蓝市北侧的海滨道路。', type:'route', hasCenter:false, connects:["cerulean","billHouse"], wild:{"common":{"ids":[10,13,16],"lv":[10,14],"w":60},"uncommon":{"ids":[43,63,69],"lv":[12,16],"w":30},"rare":{"ids":[48],"lv":[14,18],"w":10}} },
  billHouse: { name:'海角小屋', desc:'正辉的海边研究所。', type:'town', hasCenter:false, connects:["route24"] },
  ssAnne: { name:'圣安奴号', desc:'枯叶港停靠的豪华客轮。', type:'route', hasCenter:false, connects:["vermilion"] },
  rocketHideout: { name:'火箭队地下基地', desc:'彩虹市游戏厅下方。', type:'cave', hasCenter:false, connects:["celadon"], wild:{"common":{"ids":[19,41,52],"lv":[18,22],"w":55},"uncommon":{"ids":[23,109],"lv":[20,24],"w":30},"rare":{"ids":[24,110],"lv":[22,26],"w":15}} },
  powerPlant: { name:'无人发电站', desc:'废弃的发电厂深处。', type:'cave', hasCenter:false, connects:["route8","route9","route10"], wild:{"common":{"ids":[81,100],"lv":[24,28],"w":55},"uncommon":{"ids":[25,82],"lv":[26,30],"w":30},"rare":{"ids":[125,145],"lv":[28,35],"w":15}} },
  seafoamIslands: { name:'双子岛', desc:'冰冷洞穴深处传来神秘的声音……', type:'cave', hasCenter:false, connects:["route20"], wild:{"common":{"ids":[41,86,98],"lv":[28,32],"w":55},"uncommon":{"ids":[42,79,120],"lv":[30,34],"w":30},"rare":{"ids":[124,144],"lv":[32,38],"w":15}} },
  pokemonMansion: { name:'宝可梦屋', desc:'红莲岛上的废弃豪宅。', type:'cave', hasCenter:false, connects:["cinnabar"], wild:{"common":{"ids":[37,58,77],"lv":[30,35],"w":55},"uncommon":{"ids":[88,126],"lv":[32,37],"w":30},"rare":{"ids":[89,132],"lv":[34,40],"w":15}} },
  ceruleanCave: { name:'华蓝洞穴', desc:'深不见底的传说洞穴。', type:'cave', hasCenter:false, connects:["cerulean"], wild:{"common":{"ids":[41,42,111],"lv":[50,55],"w":55},"uncommon":{"ids":[113,115,132],"lv":[52,55],"w":30},"rare":{"ids":[150],"lv":[70,70],"w":15}} },
  safariZone: { name:'狩猎地带', desc:'浅红市北部的野生原野保护区。', type:'route', hasCenter:false, connects:["fuchsia"], wild:{"common":{"ids":[29,30,32,33,102,111],"lv":[20,28],"w":50},"uncommon":{"ids":[113,115,123,127],"lv":[24,30],"w":35},"rare":{"ids":[112,128,132],"lv":[26,32],"w":15}} },
  island1: { name:'脐眼岛', desc:'七之岛的玄关口，有宝可梦中心和商店。', type:'town', hasCenter:true, connects:["vermilion","island1_route1","island2"], wild:{"common":{"ids":[16,278],"lv":[25,30],"w":55},"uncommon":{"ids":[277,279],"lv":[28,33],"w":30},"rare":{"ids":[25,176],"lv":[30,35],"w":15}} },
  island1_route1: { name:'脐眼森林', desc:'通往岛内深处的森林小径。', type:'route', hasCenter:false, connects:["island1","island1_mtember"], wild:{"common":{"ids":[10,13,163],"lv":[25,32],"w":55},"uncommon":{"ids":[46,41,48],"lv":[28,35],"w":30},"rare":{"ids":[165,285],"lv":[32,38],"w":15}} },
  island1_mtember: { name:'ember山', desc:'脐眼岛的火山上散布着神秘化石。', type:'cave', hasCenter:false, connects:["island1_route1"], wild:{"common":{"ids":[37,66,77],"lv":[30,38],"w":50},"uncommon":{"ids":[58,126],"lv":[33,40],"w":30},"rare":{"ids":[38,219],"lv":[36,45],"w":20}} },
  island2: { name:'高岗岛', desc:'有游戏角的悠闲岛屿。', type:'town', hasCenter:true, connects:["island1","island2_route2"], wild:{"common":{"ids":[19,278],"lv":[28,34],"w":55},"uncommon":{"ids":[274,277],"lv":[30,36],"w":30},"rare":{"ids":[176,25],"lv":[33,38],"w":15}} },
  island2_route2: { name:'高岗林间路', desc:'连接高岗岛各处的林间小道。', type:'route', hasCenter:false, connects:["island2","island3"], wild:{"common":{"ids":[16,43,69],"lv":[28,35],"w":55},"uncommon":{"ids":[44,114,274],"lv":[32,38],"w":30},"rare":{"ids":[189,103],"lv":[35,42],"w":15}} },
  island3: { name:'绿色岛', desc:'充满树果和自然气息的岛屿。', type:'town', hasCenter:true, connects:["island2_route2","island3_forest","island3_route3"], wild:{"common":{"ids":[102,114,191],"lv":[30,36],"w":55},"uncommon":{"ids":[44,192,315],"lv":[33,39],"w":30},"rare":{"ids":[103,182,45],"lv":[36,44],"w":15}} },
  island3_forest: { name:'树果森林', desc:'果实累累的茂密森林。', type:'route', hasCenter:false, connects:["island3","island3_route3"], wild:{"common":{"ids":[43,102,114],"lv":[30,38],"w":55},"uncommon":{"ids":[44,114,315],"lv":[34,42],"w":30},"rare":{"ids":[182,83],"lv":[38,48],"w":15}} },
  island3_route3: { name:'绿色岛水路', desc:'通往四岛的碧蓝水道。', type:'water', hasCenter:false, connects:["island3","island3_forest","island4"], wild:{"common":{"ids":[72,278,118],"lv":[32,40],"w":55},"uncommon":{"ids":[73,279,119],"lv":[35,42],"w":30},"rare":{"ids":[131,230],"lv":[38,48],"w":15}} },
  island4: { name:'冰霜岛', desc:'覆盖着厚厚冰层的岛屿。', type:'route', hasCenter:true, connects:["island3_route3","island4_cave"], wild:{"common":{"ids":[86,220,278],"lv":[34,42],"w":50},"uncommon":{"ids":[42,87,221],"lv":[38,45],"w":35},"rare":{"ids":[124,131],"lv":[40,50],"w":15}} },
  island4_cave: { name:'冰霜洞穴', desc:'极寒的天然冰洞。', type:'cave', hasCenter:false, connects:["island4","island4_route4"], wild:{"common":{"ids":[41,86,220],"lv":[35,44],"w":50},"uncommon":{"ids":[42,87,221],"lv":[38,48],"w":35},"rare":{"ids":[144,124],"lv":[42,55],"w":15}} },
  island4_route4: { name:'冰霜岛水路', desc:'通往五岛的冰冷海域。', type:'water', hasCenter:false, connects:["island4_cave","island5"], wild:{"common":{"ids":[72,116,118],"lv":[36,45],"w":55},"uncommon":{"ids":[73,117,119],"lv":[40,48],"w":30},"rare":{"ids":[131,230],"lv":[44,55],"w":15}} },
  island5: { name:'群兰岛', desc:'火箭队秘密基地所在的岛屿。', type:'town', hasCenter:true, connects:["island4_route4","island5_rocket","island5_route5"], wild:{"common":{"ids":[261,278],"lv":[36,44],"w":50},"uncommon":{"ids":[262,279],"lv":[40,48],"w":35},"rare":{"ids":[262],"lv":[44,50],"w":15}} },
  island5_rocket: { name:'火箭队仓库', desc:'火箭队残党盘踞的旧仓库。', type:'cave', hasCenter:false, connects:["island5"], wild:{"common":{"ids":[19,41,109],"lv":[38,46],"w":50},"uncommon":{"ids":[42,24,110],"lv":[42,50],"w":35},"rare":{"ids":[169,89],"lv":[46,55],"w":15}} },
  island5_route5: { name:'群兰岛水路', desc:'通往六岛的危险海域。', type:'water', hasCenter:false, connects:["island5","island6"], wild:{"common":{"ids":[116,118,223],"lv":[38,46],"w":55},"uncommon":{"ids":[117,119,224],"lv":[42,50],"w":30},"rare":{"ids":[350],"lv":[46,55],"w":15}} },
  island6: { name:'战怪岛', desc:'古代遗迹所在的谜之岛屿。', type:'town', hasCenter:true, connects:["island5_route5","island6_ruins","island6_route6"], wild:{"common":{"ids":[355,352,200],"lv":[40,48],"w":50},"uncommon":{"ids":[356,354,201],"lv":[44,52],"w":35},"rare":{"ids":[302,292],"lv":[48,58],"w":15}} },
  island6_ruins: { name:'谜之遗迹', desc:'Dotted Hole —— 刻满古老文字的战怪岛遗迹。', type:'cave', hasCenter:false, connects:["island6"], wild:{"common":{"ids":[353,355,201],"lv":[42,50],"w":50},"uncommon":{"ids":[354,356,292],"lv":[46,55],"w":35},"rare":{"ids":[386],"lv":[55,70],"w":15}} },
  island7_birth: { name:'Birth Island', desc:'空无一物的神秘三角小岛。', type:'cave', hasCenter:false, connects:["island7"] },
  island6_route6: { name:'战怪岛水路', desc:'连接七岛的最后水路。', type:'water', hasCenter:false, connects:["island6","island7"], wild:{"common":{"ids":[278,118,223],"lv":[42,50],"w":55},"uncommon":{"ids":[279,119,224],"lv":[46,54],"w":30},"rare":{"ids":[131,230],"lv":[50,60],"w":15}} },
  island7: { name:'绝壁岛', desc:'训练家之塔所在的最终岛屿。', type:'route', hasCenter:true, connects:["island6_route6","island7_tower","island7_birth"], wild:{"common":{"ids":[278,276,207],"lv":[44,52],"w":50},"uncommon":{"ids":[277,214,217],"lv":[48,56],"w":35},"rare":{"ids":[330,373],"lv":[52,62],"w":15}} },
  island7_tower: { name:'训练家之塔', desc:'强者云集的对战高塔。', type:'cave', hasCenter:false, connects:["island7"], wild:{"common":{"ids":[68,214,57],"lv":[48,56],"w":50},"uncommon":{"ids":[64,65,68],"lv":[52,60],"w":35},"rare":{"ids":[149],"lv":[58,68],"w":15}} },
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
  route9:    { cerulean:'华蓝市', rockTunnel:'岩山隧道', route10:'10号道路', powerPlant:'无人发电站' },
  rockTunnel:{ route9:'9号道路', route10:'10号道路' },
  route10:   { lavender:'紫苑镇', rockTunnel:'岩山隧道', route9:'9号道路', route12:'12号道路', powerPlant:'无人发电站' },
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
  island6:  { island5_route5:'群兰岛水路', island6_ruins:'谜之遗迹', island6_route6:'战怪岛水路' },
  island7:  { island6_route6:'战怪岛水路', island7_tower:'训练家之塔', island7_birth:'Birth Island' },
}

function getLocation(id) { return LOCATIONS[id] }
function getLeader(id) { return GYM_LEADERS[id] }
function getLocationConnections(id) { const l = LOCATIONS[id]; return l ? l.connects : [] }
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
  rockTunnel:  { x:29, y:12, icon:'⛰' },
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
  island7_birth:{ x:66, y:34, icon:'🔺' },
}

// 侧边栏紧凑型地图（探索模式使用）
const MAP_REGION_CONFIGS = {
  kanto: {
    title: '关都地区路线图',
    subtitle: '主线、道馆与相邻区域一眼看清',
    stageWidth: 2000,
    stageHeight: 1200,
    paddingLeft: 60,
    paddingRight: 180,
    paddingY: 80,
    nodeIds: Object.keys(MAP_COORDS).filter(id => !id.startsWith('island')),
  },
  sevii: {
    title: '七之岛航线图',
    subtitle: '岛屿航线、据点与目标区域总览',
    stageWidth: 1100,
    stageHeight: 1500,
    paddingX: 120,
    paddingY: 80,
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
  get_package: 'viridian',
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
  sevii_lostelle: 'island3_forest',
  sevii_mt_ember: 'island1_mtember',
  sevii_dotted_hole: 'island6_ruins',
  sevii_rocket: 'island5_rocket',
  sevii_celio: 'island1',
  sevii_icefall: 'island4_cave',
  sevii_birth: 'island7_birth',
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
  rockTunnel: '岩山隧道',
  island1_route1: '脐眼森林',
  island1_mtember: 'Ember山',
  island2_route2: '高岗林间路',
  island3_forest: '树果森林',
  island3_route3: '绿色岛水路',
  island4_cave: '冰霜洞穴',
  island4_route4: '冰霜岛水路',
  island5_rocket: '火箭队仓库',
  island5_route5: '群兰岛水路',
  island6_ruins: '谜之遗迹',
  island6_route6: '战怪岛水路',
  island7_tower: '训练家之塔',
  island7_birth: 'Birth Island',
}

const MAP_STAGE_LAYOUTS = {
  kanto: {
    // ─── 北部：联盟 ───
    indigo:         {x:55, y:4},
    route23:        {x:55, y:11},
    victoryRoad:    {x:40, y:12},
    // ─── 东北角：正辉 / 华蓝 ───
    billHouse:      {x:82, y:8},
    route24:        {x:72, y:16},
    cerulean:       {x:62, y:22},
    ceruleanCave:   {x:80, y:22},
    // ─── 西北角：深灰 ───
    pewter:         {x:28, y:22},
    route3:         {x:12, y:24},
    mtMoon:         {x:18, y:32},
    route4:         {x:42, y:30},   // 月见山↔华蓝
    route22:        {x:46, y:24},
    // ─── 西部纵向走廊：真新→常青→常青森林 ───
    route2:         {x:36, y:28},
    viridian:       {x:36, y:38},
    viridianForest: {x:28, y:46},
    route1:         {x:16, y:52},
    pallet:         {x:22, y:64},
    // ─── 金黄枢纽（4 路交汇）───
    saffron:        {x:50, y:42},
    route5:         {x:60, y:32},   // 华蓝↔金黄，东偏
    route9:         {x:70, y:30},   // 华蓝↔10号路，更东
    rockTunnel:     {x:78, y:42},   // 9号路与10号路之间的漆黑隧道
    route7:         {x:40, y:48},   // 朝彩虹（与 viridianForest 错开 x）
    route8:         {x:62, y:48},   // 朝紫苑，东移避开 saffron
    route6:         {x:50, y:54},   // 南下枯叶，从 saffron 正下方延伸
    // ─── 东南枢纽：枯叶 / 紫苑 / 电力 ───
    vermilion:      {x:50, y:62},   // 从 (70,38) 移到 saffron 正南
    ssAnne:         {x:64, y:62},
    route11:        {x:66, y:70},
    route12:        {x:74, y:68},
    lavender:       {x:78, y:58},
    powerPlant:     {x:88, y:46},   // 远离 vermilion，移到 NE 角
    route10:        {x:86, y:54},   // 与 powerPlant 接续，东移避开 lavender
    // ─── 彩虹市 / 火箭基地 ───
    celadon:        {x:24, y:54},
    rocketHideout:  {x:10, y:60},
    // ─── 自行车道 / 浅红 ───
    route16:        {x:8, y:66},
    route17:        {x:14, y:78},
    fuchsia:        {x:30, y:84},
    route15:        {x:46, y:84},
    safariZone:     {x:58, y:88},
    // ─── 西南：红莲 / 双子岛 ───
    route21:        {x:8, y:74},
    cinnabar:       {x:14, y:88},
    route20:        {x:6, y:90},
    seafoamIslands: {x:6, y:98},
    pokemonMansion: {x:2, y:84},
  },
  sevii: {
    island1:         { x: 49, y: 9 },
    island1_route1:  { x: 49, y: 18 },
    island1_mtember: { x: 70, y: 8 },
    island2:         { x: 49, y: 28 },
    island2_route2:  { x: 49, y: 38 },
    island3:         { x: 49, y: 48 },
    island3_forest:  { x: 70, y: 48 },
    island3_route3:  { x: 30, y: 57 },
    island4:         { x: 49, y: 66 },
    island4_cave:    { x: 72, y: 66 },
    island4_route4:  { x: 30, y: 75 },
    island5:         { x: 49, y: 83 },
    island5_rocket:  { x: 72, y: 83 },
    island5_route5:  { x: 28, y: 91 },
    island6:         { x: 49, y: 91 },
    island6_ruins:   { x: 72, y: 91 },
    island6_route6:  { x: 38, y: 97 },
    island7:         { x: 49, y: 99 },
    island7_tower:   { x: 72, y: 99 },
    island7_birth:   { x: 86, y: 99 },
  },
}

const MAP_STAGE_POINT_OFFSETS = {
  kanto: {},
  sevii: {},
}

const MAP_LABEL_DIRECTION_OVERRIDES = {
  kanto: {
    // 北部边缘 → 标签朝下
    billHouse: 'label-below',
    indigo: 'label-below',
    // 南部边缘 → 标签朝上
    seafoamIslands: 'label-above',
    // 西部走廊 → 标签朝右
    pallet: 'label-right',
    route1: 'label-right',
    route16: 'label-right',
    route21: 'label-right',
    cinnabar: 'label-right',
    pokemonMansion: 'label-right',
    // 中部枢纽
    cerulean: 'label-above',
    saffron: 'label-left',
    vermilion: 'label-right',
    lavender: 'label-left',
    rocketHideout: 'label-right',
    // 道路标签避让
    route4: 'label-below',
    route5: 'label-right',
    route6: 'label-right',
    route7: 'label-below',
    route8: 'label-above',
    route9: 'label-left',
    route10: 'label-right',
    route11: 'label-below',
    route12: 'label-right',
    route15: 'label-below',
    route17: 'label-right',
    route20: 'label-right',
    ssAnne: 'label-right',
    powerPlant: 'label-below',
    ceruleanCave: 'label-right',
    route22: 'label-below',
    route23: 'label-left',
    route24: 'label-right',
    victoryRoad: 'label-above',
    fuchsia: 'label-below',
    safariZone: 'label-right',
    viridianForest: 'label-right',
    viridian: 'label-left',
    celadon: 'label-left',
  },
}

const MAP_LABEL_OFFSET_OVERRIDES = {
  kanto: {
    // 新布局间距更合理，大部分不需要额外偏移
    // 仅保留个别标签微调
    ssAnne: { x: 6, y: 0 },
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
  return loc.name
}

function getMapNodeGlyph(id, loc) {
  if (!loc) return '?'
  if (id === 'ssAnne') return '船'
  if (id === 'rocketHideout' || id === 'island5_rocket') return '火'
  if (id === 'powerPlant') return '电'
  if (id === 'safariZone') return '狩'
  if (loc.type === 'town') return '城'
  if (loc.type === 'route') return '路'
  if (loc.type === 'cave') return '洞'
  if (loc.type === 'water') return '水'
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
  if (loc && loc.type === 'route') {
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
    for (const targetId of loc.connects || []) {
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
  const paddingLeft = region.paddingLeft != null ? region.paddingLeft : region.paddingX
  const paddingRight = region.paddingRight != null ? region.paddingRight : region.paddingX
  const layout = MAP_STAGE_LAYOUTS[regionKey] && MAP_STAGE_LAYOUTS[regionKey][id]
  if (layout) {
    const innerW = region.stageWidth - paddingLeft - paddingRight
    const innerH = region.stageHeight - region.paddingY * 2
    return {
      x: paddingLeft + (layout.x / 100) * innerW,
      y: region.paddingY + (layout.y / 100) * innerH,
    }
  }
  const coord = MAP_COORDS[id]
  if (!coord) return null
  const spanX = Math.max(1, region.bounds.maxX - region.bounds.minX)
  const spanY = Math.max(1, region.bounds.maxY - region.bounds.minY)
  const innerW = region.stageWidth - paddingLeft - paddingRight
  const innerH = region.stageHeight - region.paddingY * 2
  const offset = (MAP_STAGE_POINT_OFFSETS[regionKey] && MAP_STAGE_POINT_OFFSETS[regionKey][id]) || { x: 0, y: 0 }
  return {
    x: paddingLeft + ((coord.x - region.bounds.minX) / spanX) * innerW + offset.x,
    y: region.paddingY + ((coord.y - region.bounds.minY) / spanY) * innerH + offset.y,
  }
}

function getMapLabelOffset(regionKey, id) {
  return (MAP_LABEL_OFFSET_OVERRIDES[regionKey] && MAP_LABEL_OFFSET_OVERRIDES[regionKey][id]) || { x: 0, y: 0 }
}

// 节点视觉半径（用于连线避让：让连线从节点边缘开始，不穿过节点圆圈）
function getMapNodeRadius(loc) {
  if (!loc) return 22
  const type = loc.type
  if (type === 'town' || type === 'cave') return 30
  if (type === 'route' || type === 'water') return 18
  return 22
}

function renderExpandedMapLegend() {
  return `
    <div class="map-legend map-legend-expanded">
      <span class="legend-item"><span class="legend-swatch current"></span> 当前位置</span>
      <span class="legend-item"><span class="legend-swatch target"></span> 主线目标</span>
      <span class="legend-item"><span class="legend-swatch neighbor"></span> 可直接前往</span>
      <span class="legend-item"><span class="legend-swatch gym-open"></span> 未通关道馆</span>
      <span class="legend-item"><span class="legend-swatch gym-cleared"></span> 已通关道馆</span>
      <span class="legend-divider"></span>
      <span class="legend-item"><span class="legend-swatch terrain-town"></span> 城镇</span>
      <span class="legend-item"><span class="legend-swatch terrain-route"></span> 道路</span>
      <span class="legend-item"><span class="legend-swatch terrain-cave"></span> 洞穴</span>
      <span class="legend-item"><span class="legend-swatch terrain-water"></span> 水道</span>
    </div>
  `
}

function renderExpandedMapStage(regionKey, currentId, targetId) {
  const region = MAP_REGION_CONFIGS[regionKey]
  if (!region) return ''

  const currentLoc = LOCATIONS[currentId]
  const neighbors = new Set(((currentLoc && currentLoc.connects) || []).filter(id => region.nodeIds.includes(id)))
  const targetNeighbors = targetId && LOCATIONS[targetId]
    ? new Set(((LOCATIONS[targetId].connects) || []).filter(id => region.nodeIds.includes(id)))
    : new Set()

  let linesHtml = ''
  for (const [fromId, toId] of getMapRegionConnections(regionKey)) {
    const from = getMapStagePoint(regionKey, fromId)
    const to = getMapStagePoint(regionKey, toId)
    if (!from || !to) continue
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 1) continue
    // 单位方向向量
    const ux = dx / dist
    const uy = dy / dist
    // 连线起点/终点从节点边缘开始，避开节点 core
    const rFrom = getMapNodeRadius(LOCATIONS[fromId])
    const rTo = getMapNodeRadius(LOCATIONS[toId])
    const startX = from.x + ux * rFrom
    const startY = from.y + uy * rFrom
    const endX = to.x - ux * rTo
    const endY = to.y - uy * rTo
    const length = Math.max(0, Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2))
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI
    const classes = ['map-link']
    if (fromId === currentId || toId === currentId) classes.push('is-current-path')
    if (targetId && (fromId === targetId || toId === targetId)) classes.push('is-target-path')
    linesHtml += `<div class="${classes.join(' ')}" style="left:${startX}px;top:${startY}px;width:${length}px;transform:rotate(${angle}deg);"></div>`
  }

  let nodesHtml = ''
  for (const id of region.nodeIds) {
    const loc = LOCATIONS[id]
    const point = getMapStagePoint(regionKey, id)
    if (!loc || !point) continue

    const classes = ['map-node', `node-${loc.type}`, getMapLabelDirection(regionKey, id, loc)]
    if (id === currentId) classes.push('is-current')
    if (id === targetId) classes.push('is-target')
    if (neighbors.has(id)) classes.push('is-neighbor')
    if (targetNeighbors.has(id)) classes.push('is-target-neighbor')

    let gymBadge = ''
    if (loc.gymLeader) {
      const gymData = GYM_LEADERS[loc.gymLeader]
      const cleared = gymData && gymData.badge <= G.player.badge
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
          <span class="info-badge">${LOCATIONS[currentId] ? LOCATIONS[currentId].name : '???'}</span>
          ${targetId && LOCATIONS[targetId] ? `<span class="info-badge target-badge">目标 ${LOCATIONS[targetId].name}</span>` : ''}
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
  const targetId = getQuestTargetLocationId()

  // 侧边栏迷你地图：只画关都关键节点（城镇 + 特殊地点），百分比坐标定位
  const miniNodes = [
    { id:'pallet',     x:46, y:78, type:'town' },
    { id:'viridian',   x:46, y:55, type:'town' },
    { id:'pewter',     x:30, y:30, type:'town' },
    { id:'cerulean',   x:62, y:30, type:'town' },
    { id:'vermilion',  x:68, y:62, type:'town' },
    { id:'lavender',   x:34, y:62, type:'town' },
    { id:'celadon',    x:20, y:62, type:'town' },
    { id:'saffron',    x:46, y:46, type:'town' },
    { id:'fuchsia',    x:62, y:82, type:'town' },
    { id:'cinnabar',   x:12, y:90, type:'town' },
    { id:'indigo',     x:82, y:20, type:'town' },
    { id:'mtMoon',     x:38, y:30, type:'cave' },
    { id:'victoryRoad',x:74, y:30, type:'cave' },
  ]

  // 简化连线（主干道）
  const miniLinks = [
    ['pallet','viridian'],['viridian','pewter'],['viridian','saffron'],
    ['pewter','mtMoon'],['mtMoon','cerulean'],['cerulean','saffron'],
    ['saffron','celadon'],['saffron','lavender'],['saffron','vermilion'],
    ['lavender','celadon'],['lavender','fuchsia'],['vermilion','fuchsia'],
    ['cinnabar','pallet'],['victoryRoad','indigo'],['victoryRoad','cerulean'],
  ]

  const neighborSet = new Set(loc && loc.connects ? loc.connects : [])

  // 连线（百分比宽度近似：画布宽高比约 1.4:1，y 方向缩放补偿）
  let linksHtml = ''
  for (const [a, b] of miniLinks) {
    const na = miniNodes.find(n => n.id === a)
    const nb = miniNodes.find(n => n.id === b)
    if (!na || !nb) continue
    const dx = nb.x - na.x, dy = nb.y - na.y
    const len = Math.sqrt(dx*dx + (dy/0.7)*(dy/0.7))
    const angle = Math.atan2(dy, dx) * 180 / Math.PI
    const cls = (a === pos || b === pos) ? 'mini-link is-current' :
                (targetId && (a === targetId || b === targetId)) ? 'mini-link is-target' : 'mini-link'
    linksHtml += `<span class="${cls}" style="left:${na.x}%;top:${na.y}%;width:${len}%;transform:rotate(${angle}deg);"></span>`
  }

  // 节点
  let nodesHtml = ''
  const visitedSet = new Set(G.player.visited || [])
  for (const n of miniNodes) {
    const nloc = LOCATIONS[n.id]
    if (!nloc) continue
    const isCurrent = n.id === pos
    const isTarget = n.id === targetId
    const isNeighbor = neighborSet.has(n.id)
    const isVisited = visitedSet.has(n.id)
    const hasGym = nloc.gymLeader
    const gymCleared = hasGym && GYM_LEADERS[nloc.gymLeader] && GYM_LEADERS[nloc.gymLeader].badge <= badge

    const classes = ['mini-node', `type-${n.type}`]
    if (isCurrent) classes.push('is-current')
    if (isTarget) classes.push('is-target')
    if (isNeighbor) classes.push('is-neighbor')
    if (isVisited && !isCurrent) classes.push('is-visited')
    if (hasGym) classes.push(gymCleared ? 'gym-cleared' : 'gym-open')

    const label = nloc.name
    nodesHtml += `<span class="${classes.join(' ')}" style="left:${n.x}%;top:${n.y}%;" title="${label}"></span>`
  }

  let html = `<div class="mini-map">
    <div class="mini-map-canvas">
      <div class="mini-map-grid"></div>
      ${linksHtml}
      ${nodesHtml}
    </div>
    <div class="mini-map-legend">
      <span class="mini-legend-item"><span class="mini-dot town"></span>城镇</span>
      <span class="mini-legend-item"><span class="mini-dot cave"></span>洞穴</span>
      <span class="mini-legend-item"><span class="mini-dot current"></span>当前</span>
      <span class="mini-legend-item"><span class="mini-dot target"></span>目标</span>
    </div>
  </div>`

  // 信息条
  html += `<div class="mini-map-info">`
  html += `<span class="info-badge">${loc ? loc.name : '???'}</span>`
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
  main.innerHTML = html

  // 右侧任务面板（移动端可折叠）
  const panel = $('map-panel')
  if (panel) {
    const isMobile = window.innerWidth <= 750
    panel.innerHTML = `
      ${isMobile ? '<div class="panel-toggle" onclick="toggleMapPanel()">📋 任务信息 ▼</div>' : ''}
      <div class="panel-content">${renderMapQuestPanel()}</div>
    `
  }

  const actions = $('actions')
  if (actions) {
    actions.innerHTML = '<button class="btn" onclick="G.view=\'explore\';render()">← 返回探索</button>'
  }
}

function renderMapQuestPanel() {
  const currentQ = getCurrentQuest()
  const completedCount = G.quests && G.quests.completed ? G.quests.completed.length : 0
  const total = QUEST_ORDER.length
  const progressPct = Math.round((completedCount / total) * 100)

  let html = '<div class="quest-panel-card">'

  // 进度头部
  html += '<div class="quest-progress-header">'
  html += '<span class="quest-progress-label">📋 任务</span>'
  html += `<span class="quest-progress-count">${completedCount}/${total}</span>`
  html += '</div>'

  // 进度条
  html += '<div style="height:6px;background:var(--border);border-radius:99px;overflow:hidden;margin-bottom:4px;">'
  html += `<div style="height:100%;width:${progressPct}%;background:var(--accent);border-radius:99px;transition:width 0.4s ease;"></div>`
  html += '</div>'

  // 当前任务
  if (currentQ) {
    html += '<div class="quest-section-title">当前任务</div>'
    html += '<div class="quest-item active">'
    html += `<div class="quest-name"><span class="quest-badge current">▶</span>${currentQ.name}</div>`
    html += `<div class="quest-desc">${currentQ.desc}</div>`
    html += `<div class="quest-guidance">💡 ${currentQ.guidance}</div>`
    html += '</div>'
  } else {
    html += '<div class="quest-section-title">当前任务</div>'
    html += '<div class="quest-item" style="border-left-color:var(--success);">'
    html += '<div class="quest-name" style="color:var(--success);">🎉 全部完成！</div>'
    html += '<div class="quest-desc">你已成为真正的宝可梦大师。</div>'
    html += '</div>'
  }

  html += '<div class="quest-section-divider"></div>'

  // 最近已完成（最多4个）
  const completed = G.quests && G.quests.completed ? G.quests.completed : []
  const recentCompleted = completed.slice(-4).reverse()
  if (recentCompleted.length > 0) {
    html += '<div class="quest-section-title">已完成</div>'
    for (const qid of recentCompleted) {
      const q = QUESTS[qid]
      if (!q) continue
      html += '<div class="quest-item completed">'
      html += `<div class="quest-name"><span class="quest-badge done">✓</span>${q.name}</div>`
      html += `<div class="quest-desc">${q.desc}</div>`
      html += '</div>'
    }
  }

  // 接下来的任务（最多3个）
  const currentIdx = currentQ ? QUEST_ORDER.indexOf(currentQ.id) : total
  const upcoming = QUEST_ORDER.slice(currentIdx + 1, currentIdx + 4)
  if (upcoming.length > 0) {
    html += '<div class="quest-section-divider"></div>'
    html += '<div class="quest-section-title">即将到来</div>'
    for (const qid of upcoming) {
      const q = QUESTS[qid]
      if (!q) continue
      html += '<div class="quest-item">'
      html += `<div class="quest-name"><span class="quest-badge pending">○</span>${q.name}</div>`
      html += `<div class="quest-desc">${q.desc}</div>`
      html += '</div>'
    }
  }

  html += '</div>'
  return html
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
  html += `<div class="map-info-content">${loc.name} (${loc.type === 'town' ? '城镇' : loc.type === 'cave' ? '洞穴' : loc.type === 'water' ? '水道' : '道路'})</div>`
  html += `</div>`
  
  // 道馆进度
  html += `<div class="map-info-section">`
  html += `<div class="map-info-title">🏛 道馆进度 (${badge}/8)</div>`
  html += `<div class="map-info-content">`
  const gymOrder = ['brock','misty','ltSurge','erika','sabrina','koga','blaine','giovanni']
  const gymNames = ['深灰','华蓝','枯叶','彩虹','金黄','浅红','红莲','常青']
  for (let i = 0; i < gymOrder.length; i++) {
    const g = GYM_LEADERS[gymOrder[i]]
    const status = g.badge <= badge ? '✔' : '○'
    html += `<span class="gym-badge ${g.badge <= badge ? 'completed' : ''}">[${status}]${gymNames[i]}</span> `
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
  const connections = loc.connects || []
  for (const conn of connections.slice(0, 3)) {
    const cLoc = LOCATIONS[conn]
    if (!cLoc || !cLoc.wild) continue
    const enc = cLoc.wild
    const common = enc.common.ids.slice(0, 3).map(id => {
      const p = getPokemonData(id)
      return p ? p.name : '?'
    }).join('/')
    html += `<div class="pokemon-area">${cLoc.name}: ${common} (Lv.${enc.common.lv[0]}-${enc.common.lv[1]})</div>`
  }
  html += `</div></div>`
  
  html += `</div>`
  return html
}
