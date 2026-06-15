const MOVES = [
  { id: 1, name: '撞击', type: '普通', power: 40, pp: 35, desc: '用全身撞向对手' },
  { id: 2, name: '藤鞭', type: '草', power: 45, pp: 25, desc: '用藤蔓鞭打对手' },
  { id: 3, name: '飞叶快刀', type: '草', power: 55, pp: 25, desc: '射出叶片切割对手' },
  { id: 4, name: '火焰喷射', type: '火', power: 90, pp: 15, desc: '喷出烈焰灼烧对手' },
  { id: 5, name: '火焰拳', type: '火', power: 75, pp: 15, desc: '用火焰包裹的拳头攻击' },
  { id: 6, name: '水枪', type: '水', power: 40, pp: 25, desc: '喷射水流攻击对手' },
  { id: 7, name: '水炮', type: '水', power: 110, pp: 5, desc: '喷射大量水流攻击' },
  { id: 8, name: '电击', type: '电', power: 40, pp: 30, desc: '释放电流攻击对手' },
  { id: 9, name: '十万伏特', type: '电', power: 90, pp: 15, desc: '释放强力电击' },
  { id: 10, name: '念力', type: '超能', power: 50, pp: 25, desc: '用念力攻击对手' },
  { id: 11, name: '精神强念', type: '超能', power: 90, pp: 10, desc: '用强大念力攻击' },
  { id: 12, name: '影子球', type: '幽灵', power: 80, pp: 15, desc: '发射暗影能量球' },
  { id: 13, name: '岩崩', type: '岩石', power: 75, pp: 10, desc: '投掷岩石攻击对手' },
  { id: 14, name: '龙之怒', type: '龙', power: 85, pp: 10, desc: '释放龙之怒火' },
  { id: 15, name: '电光一闪', type: '普通', power: 40, pp: 30, desc: '以迅雷不及掩耳之势攻击' },
  { id: 16, name: '火花', type: '火', power: 40, pp: 25, desc: '喷射火花攻击' },
  { id: 17, name: '泡沫', type: '水', power: 40, pp: 30, desc: '喷射泡沫攻击' },
]

const TYPE_CHART = {
  火: { 草: 2, 虫: 2, 冰: 2, 火: 0.5, 水: 0.5, 岩石: 0.5, 龙: 0.5 },
  水: { 火: 2, 地面: 2, 岩石: 2, 水: 0.5, 草: 0.5, 龙: 0.5 },
  草: { 水: 2, 地面: 2, 岩石: 2, 火: 0.5, 草: 0.5, 毒: 0.5, 飞行: 0.5, 虫: 0.5, 龙: 0.5 },
  电: { 水: 2, 飞行: 2, 电: 0.5, 草: 0.5, 龙: 0.5, 地面: 0 },
  普通: { 幽灵: 0, 岩石: 0.5 },
  超能: { 毒: 2, 格斗: 2, 超能: 0.5 },
  幽灵: { 超能: 2, 幽灵: 2, 普通: 0 },
  龙: { 龙: 2 },
  岩石: { 火: 2, 冰: 2, 飞行: 2, 虫: 2, 格斗: 0.5, 地面: 0.5 },
  毒: { 草: 2, 毒: 0.5, 地面: 0.5, 岩石: 0.5, 幽灵: 0.5 },
  飞行: { 草: 2, 格斗: 2, 虫: 2, 岩石: 0.5, 电: 0.5 },
  地面: { 火: 2, 电: 2, 毒: 2, 岩石: 2, 草: 0.5 },
}

const POKEMON_DATA = [
  { id: 1, name: '小拉达', types: ['普通'], stats: { hp: 30, atk: 56, def: 35, spa: 25, spd: 35, spe: 72 }, catchRate: 255, exp: 51, evo: null, moves: [1, 15], evYield: { spe: 1 } },
  { id: 2, name: '波波', types: ['普通', '飞行'], stats: { hp: 40, atk: 45, def: 40, spa: 35, spd: 35, spe: 56 }, catchRate: 255, exp: 55, evo: null, moves: [1, 15], evYield: { spe: 1 } },
  { id: 3, name: '走路草', types: ['草', '毒'], stats: { hp: 45, atk: 50, def: 55, spa: 75, spd: 65, spe: 30 }, catchRate: 255, exp: 64, evo: null, moves: [1, 2, 3], evYield: { spa: 1 } },
  { id: 4, name: '六尾', types: ['火'], stats: { hp: 38, atk: 41, def: 40, spa: 50, spd: 65, spe: 65 }, catchRate: 190, exp: 60, evo: null, moves: [16, 5], evYield: { spe: 1 } },
  { id: 5, name: '皮卡丘', types: ['电'], stats: { hp: 35, atk: 55, def: 30, spa: 50, spd: 40, spe: 90 }, catchRate: 190, exp: 82, evo: null, moves: [1, 8, 9], evYield: { spe: 2 } },
  { id: 6, name: '凯西', types: ['超能'], stats: { hp: 25, atk: 20, def: 15, spa: 105, spd: 55, spe: 90 }, catchRate: 200, exp: 73, evo: null, moves: [10], evYield: { spa: 1 } },
  { id: 7, name: '鬼斯', types: ['幽灵', '毒'], stats: { hp: 30, atk: 35, def: 30, spa: 100, spd: 35, spe: 80 }, catchRate: 190, exp: 95, evo: null, moves: [12, 10], evYield: { spa: 1 } },
  { id: 8, name: '大岩蛇', types: ['岩石', '地面'], stats: { hp: 35, atk: 45, def: 160, spa: 30, spd: 45, spe: 70 }, catchRate: 45, exp: 108, evo: null, moves: [1, 13], evYield: { def: 1 } },
  { id: 9, name: '迷你龙', types: ['龙'], stats: { hp: 41, atk: 64, def: 45, spa: 50, spd: 50, spe: 50 }, catchRate: 45, exp: 100, evo: null, moves: [1, 14], evYield: { atk: 1 } },
  { id: 10, name: '穿山鼠', types: ['地面'], stats: { hp: 50, atk: 75, def: 85, spa: 20, spd: 30, spe: 40 }, catchRate: 255, exp: 60, evo: null, moves: [1, 13], evYield: { def: 1 } },
  { id: 11, name: '妙蛙种子', types: ['草', '毒'], stats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 }, catchRate: 45, exp: 64, evo: { level: 16, to: 12 }, moves: [1, 2, 3], evYield: { spa: 1 } },
  { id: 12, name: '妙蛙草', types: ['草', '毒'], stats: { hp: 60, atk: 62, def: 63, spa: 80, spd: 80, spe: 60 }, catchRate: 45, exp: 141, evo: { level: 32, to: 13 }, moves: [1, 2, 3], evYield: { spa: 1, spd: 1 } },
  { id: 13, name: '妙蛙花', types: ['草', '毒'], stats: { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 }, catchRate: 45, exp: 208, evo: null, moves: [1, 2, 3], evYield: { spa: 2, spd: 1 } },
  { id: 14, name: '小火龙', types: ['火'], stats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 }, catchRate: 45, exp: 62, evo: { level: 16, to: 15 }, moves: [16, 1, 5], evYield: { spe: 1 } },
  { id: 15, name: '火恐龙', types: ['火'], stats: { hp: 58, atk: 64, def: 58, spa: 80, spd: 65, spe: 80 }, catchRate: 45, exp: 142, evo: { level: 36, to: 16 }, moves: [16, 1, 5], evYield: { spe: 1, atk: 1 } },
  { id: 16, name: '喷火龙', types: ['火', '飞行'], stats: { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 }, catchRate: 45, exp: 209, evo: null, moves: [4, 1, 5], evYield: { spe: 3 } },
  { id: 17, name: '杰尼龟', types: ['水'], stats: { hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 }, catchRate: 45, exp: 63, evo: { level: 16, to: 18 }, moves: [1, 17, 6], evYield: { def: 1 } },
  { id: 18, name: '卡咪龟', types: ['水'], stats: { hp: 59, atk: 63, def: 80, spa: 65, spd: 80, spe: 58 }, catchRate: 45, exp: 142, evo: { level: 36, to: 19 }, moves: [1, 6, 7], evYield: { def: 1, spd: 1 } },
  { id: 19, name: '水箭龟', types: ['水'], stats: { hp: 79, atk: 83, def: 100, spa: 85, spd: 105, spe: 78 }, catchRate: 45, exp: 210, evo: null, moves: [1, 6, 7], evYield: { spd: 3 } },
  { id: 20, name: '比比鸟', types: ['普通', '飞行'], stats: { hp: 63, atk: 60, def: 55, spa: 50, spd: 50, spe: 71 }, catchRate: 120, exp: 113, evo: null, moves: [1, 15], evYield: { spe: 2 } },
  { id: 21, name: '雷丘', types: ['电'], stats: { hp: 60, atk: 90, def: 55, spa: 90, spd: 80, spe: 100 }, catchRate: 75, exp: 122, evo: null, moves: [1, 8, 9], evYield: { spe: 3 } },
  { id: 22, name: '九尾', types: ['火'], stats: { hp: 73, atk: 76, def: 75, spa: 81, spd: 100, spe: 100 }, catchRate: 75, exp: 177, evo: null, moves: [4, 5], evYield: { spe: 1, spd: 1 } },
  { id: 23, name: '勇基拉', types: ['超能'], stats: { hp: 40, atk: 35, def: 30, spa: 120, spd: 70, spe: 105 }, catchRate: 50, exp: 145, evo: null, moves: [10, 11], evYield: { spa: 2 } },
  { id: 24, name: '鬼斯通', types: ['幽灵', '毒'], stats: { hp: 45, atk: 50, def: 45, spa: 115, spd: 55, spe: 95 }, catchRate: 90, exp: 126, evo: null, moves: [12, 10], evYield: { spa: 2 } },
  { id: 25, name: '耿鬼', types: ['幽灵', '毒'], stats: { hp: 60, atk: 65, def: 60, spa: 130, spd: 75, spe: 110 }, catchRate: 45, exp: 190, evo: null, moves: [12, 11], evYield: { spa: 3 } },
  { id: 26, name: '哈克龙', types: ['龙'], stats: { hp: 61, atk: 84, def: 65, spa: 70, spd: 70, spe: 70 }, catchRate: 45, exp: 147, evo: null, moves: [1, 14], evYield: { atk: 2 } },
  { id: 27, name: '快龙', types: ['龙', '飞行'], stats: { hp: 91, atk: 134, def: 95, spa: 100, spd: 100, spe: 80 }, catchRate: 45, exp: 218, evo: null, moves: [1, 14], evYield: { atk: 3 } },
  { id: 28, name: '臭臭花', types: ['草', '毒'], stats: { hp: 60, atk: 65, def: 70, spa: 85, spd: 75, spe: 40 }, catchRate: 120, exp: 132, evo: null, moves: [1, 2, 3], evYield: { spa: 2 } },
  { id: 29, name: '拉达', types: ['普通'], stats: { hp: 55, atk: 81, def: 60, spa: 50, spd: 70, spe: 97 }, catchRate: 127, exp: 116, evo: null, moves: [1, 15], evYield: { spe: 2 } },
  { id: 30, name: '穿山王', types: ['地面'], stats: { hp: 75, atk: 100, def: 110, spa: 45, spd: 55, spe: 65 }, catchRate: 90, exp: 138, evo: null, moves: [1, 13], evYield: { def: 2 } },
  { id: 31, name: '海星星', types: ['水'], stats: { hp: 30, atk: 45, def: 55, spa: 70, spd: 55, spe: 85 }, catchRate: 225, exp: 86, evo: null, moves: [17, 6], evYield: { spe: 1 } },
  { id: 32, name: '宝石海星', types: ['水', '超能'], stats: { hp: 60, atk: 75, def: 85, spa: 100, spd: 85, spe: 115 }, catchRate: 60, exp: 182, evo: null, moves: [6, 7, 10], evYield: { spe: 2 } },
  { id: 33, name: '隆隆石', types: ['岩石', '地面'], stats: { hp: 55, atk: 95, def: 115, spa: 45, spd: 45, spe: 35 }, catchRate: 120, exp: 103, evo: null, moves: [1, 13], evYield: { def: 2 } },
]

function getEffectiveness(atkType, defTypes) {
  let mult = 1
  for (const dt of defTypes) {
    if (TYPE_CHART[atkType] && TYPE_CHART[atkType][dt] !== undefined) {
      mult *= TYPE_CHART[atkType][dt]
    }
  }
  return mult
}

const ITEMS = {
  pokeball: { name: '精灵球', desc: '捕捉宝可梦', price: 200, catchRate: 1 },
  superball: { name: '超级球', desc: '捕捉宝可梦（更好）', price: 600, catchRate: 1.5 },
  potion: { name: '伤药', desc: '回复20HP', price: 300, heal: 20 },
  superPotion: { name: '好伤药', desc: '回复50HP', price: 700, heal: 50 },
  fullHeal: { name: '全回复药', desc: '完全回复HP', price: 2500, heal: 999 },
}

const AREAS = {
  town: {
    name: '真新镇',
    desc: '宁静祥和的小镇，你的冒险从这里开始。',
    links: ['grass', 'gym1', 'gym2', 'center', 'shop'],
  },
  grass: {
    name: '常青草丛',
    desc: '茂密的草丛中隐约可见宝可梦的身影……',
    links: ['town'],
    encounters: {
      common: { ids: [1, 2, 3, 4, 10], levelRange: [2, 8], weight: 60 },
      uncommon: { ids: [5, 6, 11, 14, 17], levelRange: [5, 12], weight: 30 },
      rare: { ids: [7, 8, 9], levelRange: [10, 18], weight: 10 },
    },
  },
  gym1: {
    name: '小霞道馆',
    desc: '水属性宝可梦道馆。馆主：小霞',
    links: ['town'],
    leader: {
      name: '小霞',
      title: '华蓝道馆馆主',
      pokemon: [
        { id: 31, level: 18 },
        { id: 32, level: 22 },
      ],
      rewardMoney: 1000,
      badge: 1,
    },
  },
  gym2: {
    name: '小刚道馆',
    desc: '岩石属性宝可梦道馆。馆主：小刚',
    links: ['town'],
    leader: {
      name: '小刚',
      title: '尼比道馆馆主',
      pokemon: [
        { id: 33, level: 20 },
        { id: 8, level: 24 },
      ],
      rewardMoney: 1500,
      badge: 2,
    },
  },
  center: {
    name: '宝可梦中心',
    desc: '可以回复宝可梦的体力。',
    links: ['town'],
  },
  shop: {
    name: '友好商店',
    desc: '出售各种冒险道具。',
    links: ['town'],
    inventory: ['pokeball', 'superball', 'potion', 'superPotion'],
  },
}
