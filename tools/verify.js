// 数据完整性验证脚本
// 加载 data.js / map.js / story.js / quests.js / state.js 并执行全面一致性检查
// 用法: node tools/verify.js
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const ROOT = path.join(__dirname, '..')
const files = ['js/data.js', 'js/map.js', 'js/story.js', 'js/quests.js', 'js/state.js']
let code = ''
for (const f of files) code += fs.readFileSync(path.join(ROOT, f), 'utf8') + '\n'

// 检查代码与数据脚本同作用域执行，可直接引用其 const/function
const checks = `
// ===== 收集问题 =====
const problems = []
const fail = (msg) => problems.push(msg)

// --- 1. MOVES 重复 id / 重复名称 ---
const moveById = new Map(), moveByName = new Map()
for (const m of MOVES) {
  if (moveById.has(m[0])) fail('MOVES 重复 id ' + m[0] + ' (' + moveById.get(m[0])[1] + ' 与 ' + m[1] + ')')
  else moveById.set(m[0], m)
  if (moveByName.has(m[1])) fail('MOVES 重复名称 ' + m[1] + ' (id ' + moveByName.get(m[1])[0] + ' 与 ' + m[0] + ')')
  else moveByName.set(m[1], m)
}

// --- 2. 宝可梦 id 唯一 ---
const pokeIds = new Set(POKEMON.map(p => p[0]))
if (pokeIds.size !== POKEMON.length) fail('POKEMON 存在重复 id')
const pokeById = new Map(POKEMON.map(p => [p[0], p]))

// --- 3. 学习表 moveId 引用有效 + 每等级 ≤ 4 招 ---
for (const p of POKEMON) {
  const ml = p[12]
  if (!ml || !Array.isArray(ml)) continue
  if (Array.isArray(ml[0])) {
    for (const item of ml) {
      const mid = item[0]
      if (!moveById.has(mid)) fail('#' + p[0] + ' ' + p[1] + ' 引用不存在的技能 ' + mid)
    }
  } else {
    for (const mid of ml) {
      if (!moveById.has(mid)) fail('#' + p[0] + ' ' + p[1] + ' 引用不存在的技能 ' + mid)
    }
  }
}

// --- 4. 道馆 / 四天王 队伍引用 ---
for (const [key, ld] of Object.entries(GYM_LEADERS)) {
  for (const pid of ld.team.map(x => x[0])) {
    if (!pokeById.has(pid)) fail('道馆 ' + key + ' (' + ld.name + ') 引用不存在的宝可梦 ' + pid)
  }
}
for (const e4 of ELITE_FOUR) {
  for (const pid of e4.team.map(x => x[0])) {
    if (!pokeById.has(pid)) fail('四天王 ' + e4.name + ' 引用不存在的宝可梦 ' + pid)
  }
}

// --- 5. 普通训练家队伍引用 ---
for (const [area, list] of Object.entries(TRAINERS)) {
  for (const t of list) {
    for (const pid of t.team.map(x => x[0])) {
      if (!pokeById.has(pid)) fail('训练家 ' + t.id + ' (' + t.name + ' @' + area + ') 引用不存在的宝可梦 ' + pid)
    }
  }
}

// --- 6. STORY_EVENTS location 与 battle.team 引用 ---
for (const [key, ev] of Object.entries(STORY_EVENTS)) {
  if (ev.location && !LOCATIONS[ev.location]) fail('剧情 ' + key + ' 引用不存在的地点 ' + ev.location)
  if (ev.battle && Array.isArray(ev.battle.team)) {
    for (const pid of ev.battle.team.map(x => x[0])) {
      if (!pokeById.has(pid)) fail('剧情 ' + key + ' 战斗引用不存在的宝可梦 ' + pid)
    }
  }
}

// --- 7. 地图连通性（双向可达） ---
for (const [id, loc] of Object.entries(LOCATIONS)) {
  for (const conn of loc.connects || []) {
    if (!LOCATIONS[conn]) fail('地点 ' + id + ' 连接到不存在的地点 ' + conn)
    else if (!(LOCATIONS[conn].connects || []).includes(id)) fail('地点 ' + id + ' -> ' + conn + ' 不是双向连接')
  }
}

// --- 8. 任务链完整性 ---
for (const qid of QUEST_ORDER) {
  if (!QUESTS[qid]) fail('QUEST_ORDER 包含未定义任务 ' + qid)
}
for (const qid of Object.keys(QUESTS)) {
  if (!QUEST_ORDER.includes(qid)) fail('QUESTS 包含不在 QUEST_ORDER 中的任务 ' + qid)
}

// --- 9. 每等级 ≤ 4 招（前 182 只 Lv1-50，沿用原逻辑） ---
let badMoves = 0
for (let id = 1; id <= 182; id++) {
  for (let lv = 1; lv <= 50; lv++) {
    const p = createPokemon(id, lv)
    if (p && p.moves.length > 4) {
      fail('#' + id + ' Lv.' + lv + ' 有 ' + p.moves.length + ' 招')
      badMoves++
    }
  }
}

// ===== 输出 =====
console.log('MOVES: ' + MOVES.length + ' | POKEMON: ' + POKEMON.length + ' | 地点: ' + Object.keys(LOCATIONS).length + ' | 训练家区域: ' + Object.keys(TRAINERS).length + ' | 剧情事件: ' + Object.keys(STORY_EVENTS).length + ' | 任务: ' + QUEST_ORDER.length)

// 初始宝可梦招式演示
const demo = [
  { id: 4, level: 5, name: '小火龙' },
  { id: 1, level: 5, name: '妙蛙种子' },
  { id: 7, level: 5, name: '杰尼龟' },
  { id: 25, level: 10, name: '皮卡丘' },
]
console.log('\\n=== 招式演示 ===')
for (const t of demo) {
  const p = createPokemon(t.id, t.level)
  console.log('Lv.' + t.level + ' ' + t.name + ' (' + p.moves.length + ' 招): ' + p.moves.map(m => m.name + '[' + m.type + ']').join(' '))
}

if (problems.length) {
  console.log('\\n❌ 发现 ' + problems.length + ' 个问题:')
  for (const p of problems) console.log('  - ' + p)
  process.exitCode = 1
} else {
  console.log('\\n✅ 所有数据完整性检查通过')
}
`

vm.runInThisContext(code + checks)
