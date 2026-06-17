// 用现有 move-cache.json 直接生成 levelup-moves.json
const fs = require('fs')
const path = require('path')
const { spawn, execSync } = require('child_process')

const RAW = path.join(__dirname, 'raw-moves.json')
const CACHE = path.join(__dirname, 'move-cache.json')
const POKE_CACHE = path.join(__dirname, 'pokemon-name-cache.json')
const OUT = path.join(__dirname, 'levelup-moves.json')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function getZhName(arr) {
  if (!arr) return null
  const zh = arr.find(n => n.language.name === 'zh-hans' || n.language.name === 'zh-Hans')
  if (zh) return zh.name
  const hans = arr.find(n => n.language.name === 'zh-hant' || n.language.name === 'zh-Hant')
  if (hans) return hans.name
  return null
}

function curlOne(url) {
  return new Promise((resolve) => {
    const proc = spawn('curl', ['-s', '--max-time', '30', url])
    let stdout = ''
    proc.stdout.on('data', d => stdout += d)
    proc.on('close', () => {
      try { resolve(JSON.parse(stdout)) } catch { resolve(null) }
    })
    proc.on('error', () => resolve(null))
  })
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf-8'))
  const cache = JSON.parse(fs.readFileSync(CACHE, 'utf-8'))
  console.log(`原始招式缓存: ${Object.keys(cache).length}`)

  // 1. 整理 level-up 数据 - 只用 scarlet-violet（最新世代）
  const moveIds = new Set()
  const levelUpData = {}
  for (const id of Object.keys(raw)) {
    const p = raw[id]
    const moves = []
    for (const m of p.moves) {
      const levelUps = m.versionDetails.filter(v =>
        v.move_learn_method.name === 'level-up' &&
        v.version_group && v.version_group.name === 'scarlet-violet'
      )
      if (levelUps.length === 0) continue
      for (const v of levelUps) {
        moves.push({ pokeapiId: m.pokeapiId, name: m.name, level: v.level_learned_at })
        moveIds.add(m.pokeapiId)
      }
    }
    moves.sort((a, b) => a.level - b.level || Number(a.pokeapiId) - Number(b.pokeapiId))
    levelUpData[id] = { name: p.name, moves }
  }
  console.log(`使用招式: ${moveIds.size} 个`)

  // 2. 补缺失的招式（cache 没有的）
  const missing = [...moveIds].filter(id => !cache[id])
  console.log(`缓存缺失: ${missing.length}`)
  for (const mid of missing) {
    const data = await curlOne(`https://pokeapi.co/api/v2/move/${mid}`)
    if (data) {
      cache[mid] = {
        id: Number(mid),
        zh: getZhName(data.names),
        type: data.type.name,
        typeZh: getZhName(data.type.names),
        power: data.power || 0,
        pp: data.pp || 0,
      }
    }
    await sleep(100)
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2))
  console.log(`最终缓存: ${Object.keys(cache).length}`)

  // 3. 宝可梦名
  let pokeNameMap = {}
  if (fs.existsSync(POKE_CACHE)) {
    pokeNameMap = JSON.parse(fs.readFileSync(POKE_CACHE, 'utf-8'))
  }
  const pokeNeed = Object.keys(levelUpData).filter(id => !pokeNameMap[id])
  console.log(`宝可梦名需补: ${pokeNeed.length}`)
  for (const id of pokeNeed) {
    const data = await curlOne(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    if (data) {
      pokeNameMap[id] = getZhName(data.names) || raw[id].name
    }
    await sleep(80)
  }
  fs.writeFileSync(POKE_CACHE, JSON.stringify(pokeNameMap, null, 2))

  // 4. 整理输出
  const out = {}
  for (const id of Object.keys(levelUpData)) {
    const p = levelUpData[id]
    out[id] = {
      name: pokeNameMap[id] || p.name,
      moves: p.moves.map(m => {
        const info = cache[m.pokeapiId]
        return {
          id: Number(m.pokeapiId),
          name: info?.zh || m.name,
          type: info?.type || 'normal',
          typeZh: info?.typeZh || '',
          power: info?.power || 0,
          pp: info?.pp || 0,
          level: m.level,
        }
      }),
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2))
  console.log(`\n✅ 输出: ${OUT}`)
}

main().catch(e => { console.error(e); process.exit(1) })
