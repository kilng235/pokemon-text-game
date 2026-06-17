// 验证脚本 - 模拟游戏内部行为
const fs = require('fs')
const vm = require('vm')

const src = fs.readFileSync('/mnt/e/1/Juno/pokemon-text-game/js/data.js', 'utf-8')
const m1 = src.match(/const MOVES = (\[[\s\S]*?\n\])/)
const m2 = src.match(/const POKEMON = (\[[\s\S]*?\n\])/)

// 写入临时文件作为模块加载
const tempFile = '/tmp/opencode/verify-temp.js'
fs.writeFileSync(tempFile, m1[1] + '\n' + m2[1] + '\nmodule.exports = { MOVES, POKEMON }')

const { MOVES, POKEMON } = require(tempFile)
console.log('MOVES:', MOVES.length, 'POKEMON:', POKEMON.length)

function getMoveData(id) { return MOVES[id-1] }

function createPokemon(id, level) {
  const base = POKEMON.find(p => p[0] === id)
  if (!base) return null
  const moveList = base[12] || [1]
  if (!Array.isArray(moveList[0])) return { id, name: base[1], level, moves: moveList }
  const ids = moveList.filter(([mid, lv]) => lv <= level).map(([mid]) => mid)
  return {
    id, name: base[1], level,
    moves: ids.map(mid => {
      const m = getMoveData(mid)
      return m ? {id: mid, name: m[1], type: m[2], power: m[3], pp: m[4]} : null
    }).filter(Boolean),
  }
}

const tests = [
  { id: 4, level: 5, name: '小火龙' },
  { id: 1, level: 5, name: '妙蛙种子' },
  { id: 7, level: 5, name: '杰尼龟' },
  { id: 25, level: 10, name: '皮卡丘' },
  { id: 4, level: 12, name: '小火龙' },
]

for (const t of tests) {
  const p = createPokemon(t.id, t.level)
  console.log(`\n=== Lv.${t.level} ${t.name} (${p.moves.length} 招) ===`)
  for (const m of p.moves) {
    console.log(`  ${m.name} [${m.type}] 威力${m.power} PP${m.pp}`)
  }
}

console.log('\n=== 验证每个等级都 ≤ 4 招 ===')
let bad = 0
for (let id = 1; id <= 182; id++) {
  for (let lv = 1; lv <= 50; lv++) {
    const p = createPokemon(id, lv)
    if (p && p.moves.length > 4) {
      console.log(`❌ #${id} Lv.${lv} 有 ${p.moves.length} 招:`, p.moves.map(m => m.name))
      bad++
    }
  }
}
console.log(bad === 0 ? '✅ 所有检查通过' : `❌ ${bad} 个异常`)

console.log('\n=== 验证所有引用 moveId 都存在 ===')
let missingMove = 0
for (const p of POKEMON) {
  if (!p[12] || !Array.isArray(p[12])) continue
  for (const item of p[12]) {
    if (!Array.isArray(item)) continue
    const [mid] = item
    if (!getMoveData(mid)) {
      console.log(`❌ #${p[0]} 引用了不存在的 move ${mid}`)
      missingMove++
    }
  }
}
console.log(missingMove === 0 ? '✅ 所有引用有效' : `❌ ${missingMove} 个无效引用`)
