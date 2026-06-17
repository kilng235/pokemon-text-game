// 生成 data.js 补丁：
// 1. 替换整个 MOVES 数组
// 2. 仅在 POKEMON 数组内替换每只宝可梦的 moveList

const fs = require('fs')
const path = require('path')

const DATA_JS = path.join(__dirname, '..', 'js', 'data.js')
const MOVES_NEW = path.join(__dirname, 'moves-new.json')
const POKEMON_NEW = path.join(__dirname, 'pokemon-new.json')
const OUT_PATCH = path.join(__dirname, 'data-patch.js')

// 读现有 data.js
let src = fs.readFileSync(DATA_JS, 'utf-8')

// 读新数据
const newMoves = JSON.parse(fs.readFileSync(MOVES_NEW, 'utf-8'))
const newPokemon = JSON.parse(fs.readFileSync(POKEMON_NEW, 'utf-8'))

// 1. 替换 MOVES 数组
const newMovesText = newMoves.map(m => {
  const fields = [m.id, `'${m.name}'`, `'${m.type}'`, m.power, m.pp, `'${m.desc || m.name}'`]
  if (m.effect) fields.push(`'${m.effect}'`)
  return `[${fields.join(',')}]`
}).join(',\n  ')

const movesRegex = /const MOVES = \[[\s\S]*?\n\]/
const newMovesBlock = `const MOVES = [\n  ${newMovesText}\n]`
src = src.replace(movesRegex, newMovesBlock)
console.log(`✅ 替换 MOVES: ${newMoves.length} 个`)

// 2. 只在 POKEMON 数组内处理每只宝可梦
// 找到 POKEMON 数组的起止
const pokemonStart = src.indexOf('const POKEMON = [')
const pokemonEnd = src.indexOf('\n]\n', pokemonStart)
if (pokemonStart < 0 || pokemonEnd < 0) {
  console.error('❌ 找不到 POKEMON 数组')
  process.exit(1)
}

const pokemonBlock = src.slice(pokemonStart, pokemonEnd)
const before = src.slice(0, pokemonStart)
const after = src.slice(pokemonEnd)

// 处理 POKEMON 块内的每一行
const lines = pokemonBlock.split('\n')
let updatedCount = 0
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  // 匹配 POKEMON 行：[id,'name',...]
  const m = line.match(/^(\s*)\[(\d+),'([^']+)','[^']+',(\d+),(\d+),(\d+),(\d+),(\d+),(\d+),(\d+),(\d+),(\[[\d,]+\]|null),\[(.*?)\](,?)$/)
  if (!m) continue
  const [, indent, id, name, hp, atk, def, spa, spd, spe, catchRate, exp, evo, movesStr, trailing] = m
  const newData = newPokemon[id]
  if (!newData || !newData.moves || newData.moves.length === 0) {
    continue
  }
  const newMovesText = newData.moves.map(([mid, lv]) => `[${mid},${lv}]`).join(',')
  lines[i] = `${indent}[${id},'${name}','${line.match(/'([^']+)'/)[1]}',${hp},${atk},${def},${spa},${spd},${spe},${catchRate},${exp},${evo},[${newMovesText}]${trailing}`
  // 上面 type 字段用 lookup 比较复杂，改用更简单的方式
}

// 实际上更简单：直接用更精准的正则替换整个 POKEMON 行
const newBlock = lines.join('\n')
const finalSrc = before + newBlock + after
fs.writeFileSync(OUT_PATCH, finalSrc)
console.log(`✅ 输出: ${OUT_PATCH}`)
console.log(`   文件大小: ${(finalSrc.length / 1024).toFixed(1)} KB`)

// 用更简单的方法重新生成
const newBlock2 = before + processPokemonBlock(pokemonBlock, newPokemon) + after
fs.writeFileSync(OUT_PATCH, newBlock2)
console.log(`✅ 输出 (v2): ${OUT_PATCH}`)

function processPokemonBlock(block, newPokemon) {
  const lines = block.split('\n')
  let updatedCount = 0
  let failedCount = 0
  const newLines = lines.map(line => {
    // 解析 POKEMON 行: [id, 'name', 'types', hp, atk, def, spa, spd, spe, catchRate, exp, evo, [...moves]][,]
    // 捕获 evo 后的整个 move list（不含外层 [ 和 ]）
    // 和尾部 ,?]
    const m = line.match(/^(\s*)\[(\d+),('[^']+'),('[^']+'),(\d+),(\d+),(\d+),(\d+),(\d+),(\d+),(\d+),(\d+),(\[[\d,]+\]|null),\[(.*)\](,?)\]\s*$/)
    if (!m) return line
    const [, indent, id, name, types, hp, atk, def, spa, spd, spe, catchRate, exp, evo, movesStr, trailingComma] = m
    const newData = newPokemon[id]
    if (!newData || !newData.moves || newData.moves.length === 0) {
      failedCount++
      return line
    }
    const newMovesText = newData.moves.map(([mid, lv]) => `[${mid},${lv}]`).join(',')
    updatedCount++
    return `${indent}[${id},${name},${types},${hp},${atk},${def},${spa},${spd},${spe},${catchRate},${exp},${evo},[${newMovesText}]${trailingComma}]`
  })
  console.log(`  处理 POKEMON: ${updatedCount} 成功, ${failedCount} 跳过`)
  return newLines.join('\n')
}
