// 关都地图
// 每个地点: [id, name, desc, type, center(是否宝可梦中心), gym(道馆id|false), connections]
const LOCATIONS = {
  pallet:    ['真新镇','宁静祥和的小镇，大木博士的研究所就在这里。','town',true,false, ['route1']],
  viridian:  ['常青市','通往联盟的关卡城市，街道整洁。','town',true,false, ['route1','route22','viridianForest','victoryRoad']],
  pewter:    ['深灰市','关都西部的矿物城市，化石研究室所在地。','town',true,'brock', ['route2','route3']],
  cerulean:  ['华蓝市','水边城市，自行车道从这里开始。','town',true,'misty', ['route4','route5','route9']],
  vermilion: ['枯叶市','港口城市，游轮圣安奴号停泊于此。','town',true,'ltSurge', ['route5','route6','route11']],
  lavender:  ['紫苑镇','宝可梦之塔所在地，安宁的墓园小镇。','town',true,false, ['route6','route7','route10']],
  celadon:   ['彩虹市','关都最大的商业城市，拥有百货大楼。','town',true,'erika', ['route7','route8','route16']],
  saffron:   ['金黄市','交通枢纽大都市，希鲁夫公司总部所在地。','town',true,'sabrina', ['route8','route5','route6','route7']],
  fuchsia:   ['浅红市','南国风情城市，拥有野生原野区。','town',true,'koga', ['route9','route10','route11','route15']],
  cinnabar:  ['红莲镇','火山岛上的研究城市，宝可梦研究所在此。','town',true,'blaine', ['route21','route20']],
  indigo:    ['宝可梦联盟','关都地区的顶点，四天王所在地。','town',false,false, ['victoryRoad','route23']],
  route1:    ['1号道路','真新镇到常青市的平坦道路。','route',false,false, ['pallet','viridian'],
    { common: {ids:[16,19], lv:[2,5], w:60}, uncommon: {ids:[21], lv:[3,6], w:30}, rare: {ids:[56], lv:[4,7], w:10} }],
  route2:    ['2号道路','常青市到深灰市的森林之路。','route',false,false, ['viridian','pewter'],
    { common: {ids:[10,13,16], lv:[3,7], w:60}, uncommon: {ids:[19,48], lv:[4,8], w:30}, rare: {ids:[25], lv:[5,9], w:10} }],
  route3:    ['3号道路','深灰市到月见山的山路。','route',false,false, ['pewter','mtMoon'],
    { common: {ids:[16,56,66], lv:[6,10], w:60}, uncommon: {ids:[23,27], lv:[7,11], w:30}, rare: {ids:[52,39], lv:[8,12], w:10} }],
  mtMoon:    ['月见山','深灰市旁的洞穴，常有火箭队出没。','cave',false,false, ['route3','route4'],
    { common: {ids:[41,74], lv:[7,12], w:55}, uncommon: {ids:[35,96], lv:[8,13], w:30}, rare: {ids:[104,46], lv:[10,15], w:15} }],
  route4:    ['4号道路','月见山到华蓝市的山道。','route',false,false, ['mtMoon','cerulean'],
    { common: {ids:[16,19,56], lv:[9,14], w:60}, uncommon: {ids:[37,54], lv:[10,15], w:30}, rare: {ids:[27,66], lv:[11,16], w:10} }],
  route5:    ['5号道路','华蓝市到金黄市的近路。','route',false,false, ['cerulean','saffron'],
    { common: {ids:[19,56,52], lv:[10,15], w:60}, uncommon: {ids:[63,39], lv:[12,16], w:30}, rare: {ids:[35,133], lv:[13,17], w:10} }],
  route6:    ['6号道路','枯叶市与紫苑镇间的道路。','route',false,false, ['vermillion','saffron','lavender'],
    { common: {ids:[19,52,48], lv:[11,16], w:60}, uncommon: {ids:[54,120], lv:[12,17], w:30}, rare: {ids:[84,128], lv:[14,18], w:10} }],
  route7:    ['7号道路','彩虹市到金黄市的短程道路。','route',false,false, ['celadon','saffron','lavender'],
    { common: {ids:[19,56,117], lv:[13,18], w:60}, uncommon: {ids:[84,37], lv:[14,19], w:30}, rare: {ids:[58,123], lv:[16,20], w:10} }],
  route8:    ['8号道路','彩虹市到金黄市的另一条路。','route',false,false, ['celadon','saffron'],
    { common: {ids:[48,23,56], lv:[14,19], w:60}, uncommon: {ids:[81,96], lv:[15,20], w:30}, rare: {ids:[125,126], lv:[17,22], w:10} }],
  route9:    ['9号道路','华蓝市到浅红市的岩石路。','route',false,false, ['cerulean','fuchsia'],
    { common: {ids:[19,84,98], lv:[15,20], w:60}, uncommon: {ids:[23,111], lv:[17,22], w:30}, rare: {ids:[61,22], lv:[19,24], w:10} }],
  route10:   ['10号道路','紫苑镇到浅红市的电力之路。','route',false,false, ['lavender','fuchsia'],
    { common: {ids:[100,81,41], lv:[16,22], w:55}, uncommon: {ids:[25,100], lv:[18,24], w:30}, rare: {ids:[125,135], lv:[20,26], w:15} }],
  route11:   ['11号道路','枯叶市到浅红市的道路。','route',false,false, ['vermillion','fuchsia'],
    { common: {ids:[19,84,98], lv:[17,23], w:60}, uncommon: {ids:[21,100], lv:[19,25], w:30}, rare: {ids:[113,128], lv:[21,27], w:10} }],
  route15:   ['15号道路','浅红市向东的道路。','route',false,false, ['fuchsia'],
    { common: {ids:[48,56,84], lv:[18,24], w:60}, uncommon: {ids:[43,64], lv:[20,26], w:30}, rare: {ids:[83,106], lv:[22,28], w:10} }],
  route16:   ['16号道路','彩虹市向东南的道路。','route',false,false, ['celadon'],
    { common: {ids:[19,21,84], lv:[19,25], w:60}, uncommon: {ids:[37,48], lv:[21,27], w:30}, rare: {ids:[52,123], lv:[23,29], w:10} }],
  route20:   ['20号水道','红莲镇附近的水路。','water',false,false, ['cinnabar'],
    { common: {ids:[72,118,98], lv:[22,28], w:55}, uncommon: {ids:[54,116], lv:[24,30], w:30}, rare: {ids:[129,131], lv:[26,35], w:15} }],
  route21:   ['21号水道','真新镇到红莲镇的水路。','water',false,false, ['pallet','cinnabar'],
    { common: {ids:[72,118,129], lv:[5,10], w:55}, uncommon: {ids:[98,54], lv:[8,14], w:30}, rare: {ids:[79,120], lv:[10,18], w:15} }],
  route22:   ['22号道路','常青市向西的河道。','route',false,false, ['viridian'],
    { common: {ids:[19,21,56], lv:[2,6], w:60}, uncommon: {ids:[54,23], lv:[3,7], w:30}, rare: {ids:[25,133], lv:[5,9], w:10} }],
  route23:   ['23号道路','联盟的最终考验之路。','route',false,false, ['indigo'],
    { common: {ids:[75,42,34], lv:[35,42], w:50}, uncommon: {ids:[64,22], lv:[38,44], w:30}, rare: {ids:[65,149], lv:[40,48], w:20} }],
  victoryRoad: ['冠军之路','通往联盟的险峻洞穴。','cave',false,false, ['viridian','indigo'],
    { common: {ids:[41,74,42], lv:[30,38], w:50}, uncommon: {ids:[95,111], lv:[33,40], w:30}, rare: {ids:[112,142], lv:[36,45], w:20} }],
  viridianForest: ['常青森林','常青市旁的密林。','cave',false,false, ['viridian'],
    { common: {ids:[10,13,16], lv:[3,6], w:60}, uncommon: {ids:[48,46], lv:[4,7], w:30}, rare: {ids:[25,69], lv:[5,8], w:10} }],
}

// 地图连接标签（用于按钮显示）
const LINK_LABELS = {
  pallet:    { route1:'1号道路', route21:'21号水道' },
  viridian:  { route1:'1号道路', route22:'22号道路', viridianForest:'常青森林', victoryRoad:'冠军之路' },
  pewter:    { route2:'2号道路', route3:'3号道路' },
  cerulean:  { route4:'4号道路', route5:'5号道路', route9:'9号道路' },
  vermilion: { route5:'5号道路', route6:'6号道路', route11:'11号道路' },
  lavender:  { route6:'6号道路', route7:'7号道路', route10:'10号道路' },
  celadon:   { route7:'7号道路', route8:'8号道路', route16:'16号道路' },
  saffron:   { route5:'5号道路', route6:'6号道路', route7:'7号道路', route8:'8号道路' },
  fuchsia:   { route9:'9号道路', route10:'10号道路', route11:'11号道路', route15:'15号道路' },
  cinnabar:  { route20:'20号水道', route21:'21号水道' },
  indigo:    { victoryRoad:'冠军之路', route23:'23号道路' },
}

const LOCATION_TYPES = { town: '城镇', route: '道路', cave: '洞穴', water: '水道' }

function getLocation(id) { return LOCATIONS[id] }
function getLeader(id) { return GYM_LEADERS[id] }
function getLocationConnections(id) {
  const loc = LOCATIONS[id]
  return loc ? loc[5] : []
}
