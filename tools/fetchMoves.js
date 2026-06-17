// 从 PokeAPI 抓取 1-182 号宝可梦的 level-up 技能
// 输出 tools/raw-moves.json

const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, 'raw-moves.json')
const POKEMON_COUNT = 182
const DELAY_MS = 150
const MAX_RETRIES = 3

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchJson(url, retries = 0) {
  try {
    const resp = await fetch(url)
    if (resp.status === 429 || resp.status >= 500) {
      if (retries < MAX_RETRIES) {
        await sleep(1000 * (retries + 1))
        return fetchJson(url, retries + 1)
      }
    }
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${url}`)
    return await resp.json()
  } catch (e) {
    if (retries < MAX_RETRIES) {
      await sleep(1000 * (retries + 1))
      return fetchJson(url, retries + 1)
    }
    throw e
  }
}

// 从 move JSON 提取中文名（zh-Hans），回退英文
function getZhName(move) {
  const zh = move.names.find(n => n.language.name === 'zh-Hans')
  if (zh) return zh.name
  const hans = move.names.find(n => n.language.name === 'zh-Hant')
  if (hans) return hans.name
  return move.name
}

async function fetchPokemon(id) {
  const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${id}`
  const data = await fetchJson(pokeUrl)
  const name = data.name
  const moves = data.moves.map(m => ({
    pokeapiId: m.move.url.split('/').filter(Boolean).pop(),
    name: m.move.name,
    versionDetails: m.version_group_details
  }))
  return { id, name, moves }
}

async function main() {
  const out = {}
  let success = 0, fail = 0
  for (let id = 1; id <= POKEMON_COUNT; id++) {
    try {
      const p = await fetchPokemon(id)
      out[id] = p
      success++
      if (id % 20 === 0) {
        console.log(`  ${id}/${POKEMON_COUNT} 完成 (成功 ${success}, 失败 ${fail})`)
      }
    } catch (e) {
      fail++
      console.error(`  ❌ #${id} 失败: ${e.message}`)
    }
    await sleep(DELAY_MS)
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2))
  console.log(`\n✅ 完成: 成功 ${success}, 失败 ${fail}`)
  console.log(`   输出: ${OUT}`)
}

main().catch(e => { console.error(e); process.exit(1) })
