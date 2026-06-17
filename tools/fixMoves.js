// 修复脚本：找出 power=0/pp=0 的失败招式，重新抓取
const fs = require('fs')
const path = require('path')
const LEVELUP = path.join(__dirname, 'levelup-moves.json')
const OUT = path.join(__dirname, 'levelup-moves.json')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchJson(url, retries = 0) {
  try {
    const resp = await fetch(url)
    if (resp.status === 429 || resp.status >= 500) {
      if (retries < 5) {
        await sleep(2000 * (retries + 1))
        return fetchJson(url, retries + 1)
      }
    }
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  } catch (e) {
    if (retries < 5) {
      await sleep(2000 * (retries + 1))
      return fetchJson(url, retries + 1)
    }
    throw e
  }
}

function getZhName(arr) {
  if (!arr) return null
  const zh = arr.find(n => n.language.name === 'zh-Hans')
  if (zh) return zh.name
  const hans = arr.find(n => n.language.name === 'zh-Hant')
  if (hans) return hans.name
  return null
}

async function main() {
  const data = JSON.parse(fs.readFileSync(LEVELUP, 'utf-8'))
  const failed = new Set()
  for (const id of Object.keys(data)) {
    for (const m of data[id].moves) {
      if (m.power === 0 && m.type === 'normal' && m.pp === 0) {
        failed.add(m.id)
      }
    }
  }
  console.log(`需要修复: ${failed.size} 个招式`)
  if (failed.size === 0) {
    console.log('无需修复')
    return
  }

  let i = 0
  for (const mid of failed) {
    i++
    process.stdout.write(`  [${i}/${failed.size}] #${mid} `)
    try {
      const m = await fetchJson(`https://pokeapi.co/api/v2/move/${mid}`)
      const zh = getZhName(m.names) || m.name
      // 更新所有引用
      let updated = 0
      for (const id of Object.keys(data)) {
        for (const mv of data[id].moves) {
          if (mv.id === mid) {
            mv.name = zh
            mv.type = m.type.name
            mv.power = m.power || 0
            mv.pp = m.pp || 0
            updated++
          }
        }
      }
      console.log(`✓ ${zh} (更新 ${updated} 处)`)
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
    await sleep(800)
  }

  fs.writeFileSync(OUT, JSON.stringify(data, null, 2))
  console.log(`\n✅ 已保存`)
}

main().catch(e => { console.error(e); process.exit(1) })
