// 提取现有 data.js 的 MOVES 数组，生成 {id, name, type, power, pp, desc, effect}
// 写入 tools/existing-moves.json
const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'js', 'data.js')
const OUT = path.join(__dirname, 'existing-moves.json')

// 用 Function 包装来安全读取 const
const src = fs.readFileSync(SRC, 'utf-8')
// 提取 const MOVES = [ ... ] 数组
const m = src.match(/const MOVES = \[([\s\S]*?)\n\]\n/)
if (!m) { console.error('MOVES not found'); process.exit(1) }
const arrText = '[' + m[1] + '\n]'

// 解析每行 [id, name, type, power, pp, desc, effect?]
const moves = []
const re = /\[(\d+),\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*(\d+),\s*'((?:[^'\\]|\\.)*)'\s*(?:,\s*'((?:[^'\\]|\\.)*)')?\s*\]/g
let mm
while ((mm = re.exec(arrText)) !== null) {
  moves.push({
    id: Number(mm[1]),
    name: mm[2],
    type: mm[3],
    power: Number(mm[4]),
    pp: Number(mm[5]),
    desc: mm[6],
    effect: mm[7] || null,
  })
}

fs.writeFileSync(OUT, JSON.stringify(moves, null, 2))
console.log(`提取 ${moves.length} 个招式`)
console.log('前 10 个:')
for (const mv of moves.slice(0, 10)) {
  console.log(`  #${mv.id} ${mv.name} [${mv.type}] 威力${mv.power} PP${mv.pp}${mv.effect ? ' ('+mv.effect+')' : ''}`)
}
