// 验证脚本 - 模拟游戏内部行为
import fs from 'fs'

const src = fs.readFileSync('/mnt/e/1/Juno/pokemon-text-game/js/data.js', 'utf-8')

// 找 POKEMON 数组的实际起止
const pokemonStart = src.indexOf('const POKEMON = [')
if (pokemonStart < 0) { console.error('POKEMON not found'); process.exit(1) }

// 智能找数组结尾
let depth = 1
let inStr = null
let pokemonEnd = -1
for (let i = pokemonStart + 17; i < src.length; i++) {
  const c = src[i]
  if (inStr) {
    if (c === inStr) inStr = null
    continue
  }
  if (c === "'" || c === '"') inStr = c
  else if (c === '[') depth++
  else if (c === ']') {
    depth--
    if (depth === 0) { pokemonEnd = i + 1; break }
  }
}

const movesMatch = src.match(/const MOVES = (\[[\s\S]*?\n\])/)
const pokeContent = src.slice(pokemonStart + 17, pokemonEnd - 1)
const pokeLines = pokeContent.split('\n').map((line, i, arr) => {
  if (i >= arr.length - 1) return line
  const trimmed = line.trimEnd()
  if (trimmed && !trimmed.endsWith(',')) return line + ','
  return line
}).join('\n')

const tempFile = '/tmp/opencode/_verify-data.mjs'
fs.writeFileSync(tempFile,
  'const _MOVES = ' + movesMatch[1] + ';\n' +
  'const _POKEMON_RAW = [' + pokeLines + '];\n' +
  'export const MOVES = _MOVES;\n' +
  'export const POKEMON = _POKEMON_RAW;\n'
)

const { MOVES, POKEMON } = await import(tempFile)
console.log('MOVES:', MOVES.length, 'POKEMON:', POKEMON.length)

function getMoveData(id) { return MOVES[id-1] }

function getMovesForLevel(moveList, level) {
  if (!moveList || moveList.length === 0) return [1]
  if (!Array.isArray(moveList[0])) return moveList
  const sorted = [...moveList].sort((a, b) => a[1] - b[1] || a[0] - b[0])
  const ids = []
  for (const [mid, lv] of sorted) {
    if (lv <= level) {
      if (!ids.includes(mid)) ids.push(mid)
      if (ids.length >= 4) break
    }
  }
  return ids.length > 0 ? ids : [sorted[0][0]]
}

function createPokemon(id, level) {
  const base = POKEMON.find(p => p[0] === id)
  if (!base) return null
  const moveList = base[12] || [1]
  const ids = getMovesForLevel(moveList, level)
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
    const mid = item[0]
    if (!getMoveData(mid)) {
      console.log(`❌ #${p[0]} 引用了不存在的 move ${mid}`)
      missingMove++
    }
  }
}
console.log(missingMove === 0 ? '✅ 所有引用有效' : `❌ ${missingMove} 个无效引用`)
