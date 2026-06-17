// 转换脚本：把 PokeAPI 数据的招式 ID 重排成连续的 1, 2, 3...
// - 优先复用现有 130 个招式的 ID
// - 不足部分用 PokeAPI 数据补齐（去重后排序）
// - 输出 tools/moves-new.json + tools/pokemon-new.json

const fs = require('fs')
const path = require('path')

const LEVELUP = path.join(__dirname, 'levelup-moves.json')
const EXISTING = path.join(__dirname, 'existing-moves.json')
const OUT_MOVES = path.join(__dirname, 'moves-new.json')
const OUT_POKEMON = path.join(__dirname, 'pokemon-new.json')
const OUT_MAP = path.join(__dirname, 'pokeapi-to-newid.json')

// 现有招式：按 English 名（推断）建索引
// 现有项目没有英文名，但有中文名。从 PokeAPI 找对应。
// 策略：手动建一个小型的 EN<->CN 映射

const EN_TO_CN = {
  'tackle': '撞击',
  'quick-attack': '电光一闪',
  'mega-punch': '百万吨重拳',
  'cut': '劈开',
  'double-edge': '舍身冲撞',
  'hyper-beam': '破坏光线',
  'submission': '压制',
  'thrash': '大闹一番',
  'headbutt': '头锤',
  'horn-attack': '角撞',
  'ember': '火花',
  'flamethrower': '喷射火焰',
  'fire-blast': '大字爆炎',
  'fire-spin': '火焰旋涡',
  'flare-blitz': '闪焰冲锋',
  'water-gun': '水枪',
  'hydro-pump': '水炮',
  'bubble-beam': '泡沫光线',
  'surf': '冲浪',
  'water-pulse': '水之波动',
  'vine-whip': '藤鞭',
  'razor-leaf': '飞叶快刀',
  'solar-beam': '阳光烈焰',
  'sleep-powder': '催眠粉',
  'stun-spore': '麻痹粉',
  'seed-bomb': '种子炸弹',
  'mega-drain': '吸取',
  'absorb': '吸取',
  'thunder-shock': '电击',
  'thunderbolt': '十万伏特',
  'thunder': '打雷',
  'thunder-wave': '电磁波',
  'electro-ball': '电球',
  'ice-punch': '冰冻拳',
  'ice-beam': '急冻光线',
  'blizzard': '暴风雪',
  'icy-wind': '冰冻之风',
  'karate-chop': '空手劈',
  'brick-break': '劈瓦',
  'jump-kick': '飞踢',
  'seismic-toss': '地球上投',
  'cross-chop': '劈瓦',
  'submission': '压制',
  'low-kick': '飞踢',
  'sludge': '溶解液',
  'sludge-bomb': '污泥攻击',
  'sludge-bomb': '污泥攻击',
  'poison-sting': '毒针',
  'earthquake': '地震',
  'dig': '挖洞',
  'bone-club': '骨头回力镖',
  'mud-slap': '飞沙脚',
  'mud-shot': '泥巴射击',
  'wing-attack': '翅膀攻击',
  'fly': '飞翔',
  'peck': '啄',
  'aerial-ace': '燕返',
  'psybeam': '念力',
  'psychic': '精神强念',
  'hypnosis': '催眠术',
  'confuse-ray': '幻象光线',
  'fury-cutter': '连续切',
  'pin-missile': '双针',
  'string-shot': '吐丝',
  'leech-life': '吸血',
  'rock-throw': '落石',
  'rock-slide': '岩崩',
  'rock-tomb': '岩石封锁',
  'lick': '舔舌头',
  'shadow-ball': '暗影球',
  'shadow-claw': '暗影爪',
  'dragon-rage': '龙之怒',
  'outrage': '逆鳞',
  'dragon-breath': '龙息',
  'bubble': '泡沫',
  'strength': '怪力',
  'growth': '生长',
  'scratch': '抓',
  'steel-wing': '钢之翼',
  'rest': '睡觉',
  'sleep-talk': '梦话',
  'snore': '打鼾',
  'swift': '高速星星',
  'curse': '诅咒',
  'return': '报恩',
  'frustration': '撒气',
  'trick': '戏法',
  'futuresight': '预知未来',
  'mystical-power': '神通力',
  'psywave': '精神波',
  'recover': '精神回复',
  'hidden-power': '觉醒力量',
  'endure': '忍耐',
  'reversal': '起死回生',
  'mud-bomb': '泥巴炸弹',
  'iron-tail': '钢尾巴',
  'rollout': '滚动',
  'ice-ball': '冰球',
  'rapid-spin': '高速旋转',
  'cotton-spore': '棉孢子',
  'muddy-water': '浊流',
  'ice-shard': '冰柱针',
  'pin-missile': '导弹针',
  'wing-attack': '翅膀拍击',
  'slash': '裂劈',
  'destiny-bond': '同命',
  'mimic': '模仿',
  'arm-thrust': '臂锤',
  'zen-headbutt': '意念头锤',
  'shadow-sneak': '影子偷袭',
  'weather-ball': '气象球',
  'air-cutter': '空气利刃',
  'water-spoat': '喷水',
  'eruption': '喷火',
  'origin-pulse': '根源波动',
  'precipice-blades': '断崖之剑',
  'geomancy': '创造领域',
  'dragon-claw': '龙爪',
  'dragon-dance': '龙之舞',
  'shadow-punch': '暗影拳',
  'signal-beam': '信号光束',
  'metal-claw': '金属爪',
  'meteor-mash': '彗星拳',
  'meteor-punch': '流星拳',
  'safeguard': '神秘守护',
  'wish': '祈求',
  'ingrain': '扎根',
  'shell-smash': '破壳',
  'steam-eruption': '蒸气弹',
  'bulk-up': '健美',
  'work-up': '气场提升',
}

// 反向：CN -> EN（用于检查现有项目里有什么）
const CN_TO_EN = {}
for (const [en, cn] of Object.entries(EN_TO_CN)) {
  if (!CN_TO_EN[cn]) CN_TO_EN[cn] = en
}

function main() {
  const levelup = JSON.parse(fs.readFileSync(LEVELUP, 'utf-8'))
  const existing = JSON.parse(fs.readFileSync(EXISTING, 'utf-8'))

  // 现有招式按名字建索引
  const existingByName = {}
  for (const m of existing) {
    existingByName[m.name] = m
  }
  console.log(`现有项目招式: ${Object.keys(existingByName).length}`)

  // 收集所有 PokeAPI 招式的中文名（来自 levelup 数据）
  const pokeapiZhMap = {}
  for (const pid of Object.keys(levelup)) {
    for (const m of levelup[pid].moves) {
      if (m.name && !pokeapiZhMap[m.id]) {
        pokeapiZhMap[m.id] = m.name
      }
    }
  }

  // 收集所有用到的 unique PokeAPI move IDs
  const usedIds = new Set()
  for (const pid of Object.keys(levelup)) {
    for (const m of levelup[pid].moves) {
      usedIds.add(m.id)
    }
  }
  console.log(`使用的 unique 招式: ${usedIds.size}`)

  // 第一步：把现有项目里的 130 个招式按中文名映射到 PokeAPI 招式
  // PokeAPI 招式的中文名 -> 现有项目 id
  const pokeapiToExisting = {}
  for (const pid of Object.keys(levelup)) {
    for (const m of levelup[pid].moves) {
      if (m.name && existingByName[m.name]) {
        if (!pokeapiToExisting[m.id]) {
          pokeapiToExisting[m.id] = existingByName[m.name].id
        }
      }
    }
  }
  console.log(`映射到现有项目: ${Object.keys(pokeapiToExisting).length} 个 PokeAPI 招式`)

  // 第二步：剩下的 PokeAPI 招式分配新 ID
  // 按 PokeAPI id 升序，从 131 开始
  const newMoves = [...existing]  // 现有 130 个
  const usedExistingIds = new Set(newMoves.map(m => m.id))
  const remaining = []
  for (const pid of usedIds) {
    if (pokeapiToExisting[pid]) continue
    remaining.push(pid)
  }
  remaining.sort((a, b) => a - b)
  console.log(`需要新建的招式: ${remaining.length} 个`)

  // 给每个 remaining 的 PokeAPI 招式查找中文名（从 levelup 数据）
  const pokeapiToZh = {}
  for (const pid of Object.keys(levelup)) {
    for (const m of levelup[pid].moves) {
      if (!pokeapiToZh[m.id]) {
        pokeapiToZh[m.id] = {
          name: m.name,
          type: m.type,
          typeZh: m.typeZh,
          power: m.power,
          pp: m.pp,
        }
      }
    }
  }

  // 为剩余招式分配新 ID
  const pokeapiToNewId = { ...pokeapiToExisting }
  let nextId = 131
  for (const pokeapiId of remaining) {
    pokeapiToNewId[pokeapiId] = nextId
    const info = pokeapiToZh[pokeapiId]
    newMoves.push({
      id: nextId,
      name: info.name,           // 英文名（fallback）
      type: info.type === 'normal' ? '普通' :
            info.type === 'fire' ? '火' :
            info.type === 'water' ? '水' :
            info.type === 'grass' ? '草' :
            info.type === 'electric' ? '电' :
            info.type === 'ice' ? '冰' :
            info.type === 'fighting' ? '格斗' :
            info.type === 'poison' ? '毒' :
            info.type === 'ground' ? '地面' :
            info.type === 'flying' ? '飞行' :
            info.type === 'psychic' ? '超能' :
            info.type === 'bug' ? '虫' :
            info.type === 'rock' ? '岩石' :
            info.type === 'ghost' ? '幽灵' :
            info.type === 'dragon' ? '龙' :
            info.type === 'dark' ? '恶' :
            info.type === 'steel' ? '钢' :
            info.type === 'fairy' ? '妖精' : '普通',
      power: info.power || 0,
      pp: info.pp || 0,
      desc: info.name,
      effect: null,
    })
    nextId++
  }
  console.log(`新总招式数: ${newMoves.length}`)

  // 整理输出
  newMoves.sort((a, b) => a.id - b.id)
  fs.writeFileSync(OUT_MOVES, JSON.stringify(newMoves, null, 2))
  fs.writeFileSync(OUT_MAP, JSON.stringify(pokeapiToNewId, null, 2))
  console.log(`✅ 写入 ${OUT_MOVES}`)
  console.log(`✅ 写入 ${OUT_MAP}`)

  // 第三步：生成新的 POKEMON 数据
  const newPokemon = {}
  let missingMapping = 0
  for (const pid of Object.keys(levelup)) {
    const p = levelup[pid]
    const moveTable = []
    for (const m of p.moves) {
      const newId = pokeapiToNewId[m.id]
      if (!newId) {
        missingMapping++
        continue
      }
      moveTable.push([newId, m.level])
    }
    newPokemon[pid] = { name: p.name, moves: moveTable }
  }
  if (missingMapping > 0) {
    console.warn(`⚠️ 有 ${missingMapping} 个招式未能映射，已跳过`)
  }
  fs.writeFileSync(OUT_POKEMON, JSON.stringify(newPokemon, null, 2))
  console.log(`✅ 写入 ${OUT_POKEMON}`)
}

main()
