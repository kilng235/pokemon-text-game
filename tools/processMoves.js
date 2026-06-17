// 用 child_process 调用 curl 抓取（node fetch 不可靠）
// 1. 从 raw-moves.json 提取 unique move IDs
// 2. 并发用 curl 抓取每个 move 的中文名
// 3. 输出 levelup-moves.json

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { spawn } = require('child_process')

const RAW = path.join(__dirname, 'raw-moves.json')
const OUT = path.join(__dirname, 'levelup-moves.json')
const CACHE = path.join(__dirname, 'move-cache.json')
const CONCURRENCY = 5

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function curlJson(url) {
  try {
    const result = execSync(`curl -s --max-time 30 "${url}"`, { encoding: 'utf-8' })
    return JSON.parse(result)
  } catch (e) {
    return null
  }
}

function getZhName(arr) {
  if (!arr) return null
  const zh = arr.find(n => n.language.name === 'zh-hans' || n.language.name === 'zh-Hans')
  if (zh) return zh.name
  const hans = arr.find(n => n.language.name === 'zh-hant' || n.language.name === 'zh-Hant')
  if (hans) return hans.name
  return null
}

// 1. 提取 level-up 数据
const raw = JSON.parse(fs.readFileSync(RAW, 'utf-8'))
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
console.log(`精灵 ${Object.keys(levelUpData).length} 只, 招式 ${moveIds.size} 个`)

// 2. 加载缓存
let cache = {}
if (fs.existsSync(CACHE)) {
  cache = JSON.parse(fs.readFileSync(CACHE, 'utf-8'))
  console.log(`缓存命中: ${Object.keys(cache).length} 个`)
}

// 3. 找出还需抓取的
const needFetch = [...moveIds].filter(id => !cache[id])
console.log(`还需抓取: ${needFetch.length}`)

// 4. 并发抓取（用 spawn curl 避免阻塞）
async function fetchOne(mid) {
  return new Promise((resolve) => {
    const proc = spawn('curl', ['-s', '--max-time', '30', `https://pokeapi.co/api/v2/move/${mid}`])
    let stdout = ''
    proc.stdout.on('data', d => stdout += d)
    proc.on('close', code => {
      if (code !== 0 || !stdout) { resolve(null); return }
      try {
        resolve(JSON.parse(stdout))
      } catch { resolve(null) }
    })
    proc.on('error', () => resolve(null))
  })
}

async function main() {
  if (needFetch.length > 0) {
    let cursor = 0
    const total = needFetch.length
    const workers = Array(CONCURRENCY).fill(0).map(async () => {
      while (true) {
        const i = cursor++
        if (i >= total) return
        const mid = needFetch[i]
        const data = await fetchOne(mid)
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
        if ((i + 1) % 50 === 0 || i === total - 1) {
          process.stdout.write(`\r  ${i + 1}/${total} 已抓, 缓存 ${Object.keys(cache).length}`)
          fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2))
        }
        await sleep(50)
      }
    })
    await Promise.all(workers)
    fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2))
  }
  console.log(`\n最终缓存: ${Object.keys(cache).length}`)

  // 5. 抓宝可梦中文名
  const pokeNameCache = {}
  const pokeNameFile = path.join(__dirname, 'pokemon-name-cache.json')
  if (fs.existsSync(pokeNameFile)) {
    Object.assign(pokeNameCache, JSON.parse(fs.readFileSync(pokeNameFile, 'utf-8')))
  }
  const pokeNeed = Object.keys(levelUpData).filter(id => !pokeNameCache[id])
  console.log(`宝可梦名还需抓: ${pokeNeed.length}`)
  for (let i = 0; i < pokeNeed.length; i += CONCURRENCY) {
    const batch = pokeNeed.slice(i, i + CONCURRENCY)
    await Promise.all(batch.map(async id => {
      const data = await fetchOne(`/pokemon-species/${id}`.replace(/^\//, ''))
      // ^ 不行，重新拼
    }))
    // 改用直接拼 url
    await Promise.all(batch.map(async id => {
      const data = await new Promise((resolve) => {
        const proc = spawn('curl', ['-s', '--max-time', '30', `https://pokeapi.co/api/v2/pokemon-species/${id}`])
        let stdout = ''
        proc.stdout.on('data', d => stdout += d)
        proc.on('close', () => {
          try { resolve(JSON.parse(stdout)) } catch { resolve(null) }
        })
        proc.on('error', () => resolve(null))
      })
      if (data) {
        pokeNameCache[id] = getZhName(data.names) || raw[id].name
      }
    }))
    if ((i + batch.length) % 50 === 0 || i + batch.length === pokeNeed.length) {
      process.stdout.write(`\r  宝可梦名 ${Math.min(i + batch.length, pokeNeed.length)}/${pokeNeed.length}`)
      fs.writeFileSync(pokeNameFile, JSON.stringify(pokeNameCache, null, 2))
    }
    await sleep(100)
  }
  fs.writeFileSync(pokeNameFile, JSON.stringify(pokeNameCache, null, 2))

  // 6. 整理输出
  const out = {}
  for (const id of Object.keys(levelUpData)) {
    const p = levelUpData[id]
    out[id] = {
      name: pokeNameCache[id] || p.name,
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
