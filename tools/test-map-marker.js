// 地图标记回归测试
// 覆盖：玩家位于各种地形时，「当前位置」标记必须存在。
// 历史缺陷：map4Markers 只查 layout.places，导致玩家站在道路(route)上时标记消失。
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const ROOT = path.join(__dirname, '..')
const ctx = { console }
ctx.window = ctx
vm.createContext(ctx)
for (const f of ['js/data.js', 'js/map.js', 'js/state.js', 'js/quests.js', 'js/story.js']) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8')
    .replace(/^const /gm, 'var ').replace(/^let /gm, 'var ')
  new vm.Script(src, { filename: f }).runInContext(ctx)
}

const results = []
function assert(name, cond, detail) {
  results.push({ name: name, pass: !!cond, detail: detail || '' })
}

ctx.G = ctx.createInitialState()
ctx.G.player.badge = 2
ctx.G.player.visited = ['pallet', 'route1', 'viridian']
ctx.getCurrentQuest = () => null

// ---- 测试 1：玩家位于各种地形时都必须有「当前位置」标记 ----
const probes = [
  ['pallet', 'town'], ['viridian', 'town'], ['celadon', 'town'],
  ['route1', 'route'], ['route2', 'route'], ['route5', 'route'], ['route9', 'route'],
  ['route21', 'route'],
  ['mtMoon', 'cave'], ['rockTunnel', 'cave'], ['pokemonMansion', 'cave'],
]
let missing = []
for (const [id, type] of probes) {
  ctx.G.player.position = id
  const svg = ctx.map4RenderSvg('kanto', id, null)
  const hasCurrent = /class="map4-marker is-current"/.test(svg)
  const markerCount = (svg.match(/class="map4-marker/g) || []).length
  if (!hasCurrent || markerCount < 1) missing.push(id + '(' + type + ')')
}
assert('玩家位于任何地形都渲染当前位置标记', missing.length === 0,
  missing.length ? '缺失: ' + missing.join(',') : '已验证 ' + probes.length + ' 个位置')

// ---- 测试 2：主线目标位于道路时也要渲染 ----
ctx.G.player.position = 'pallet'
let targetMissing = []
for (const tid of ['pallet', 'route1', 'mtMoon', 'route12']) {
  const svg = ctx.map4RenderSvg('kanto', 'pallet', tid)
  if (!/class="map4-marker is-target"/.test(svg)) targetMissing.push(tid)
}
assert('主线目标位于任何地形都渲染目标标记', targetMissing.length === 0,
  targetMissing.length ? '缺失: ' + targetMissing.join(',') : '')

// ---- 测试 3：迷你地图同样包含标记层 ----
ctx.G.player.position = 'route1'
const mini = ctx.map4RenderMiniSvg('kanto', 'route1', null)
assert('迷你地图包含当前位置标记', /class="map4-marker is-current"/.test(mini))
assert('迷你地图不显示道路名（避免拥挤）', !/map4-road-label/.test(mini))

// ---- 测试 4：侧边栏入口使用迷你地图渲染器 ----
ctx.G.player.position = 'pallet'
const sidebar = ctx.renderSidebarMap()
assert('侧边栏地图使用 v4 迷你图渲染器', /map4-svg is-mini/.test(sidebar))
assert('侧边栏地图包含当前位置标记', /map4-marker is-current/.test(sidebar))

// ---- 测试 5：地图无脏值 ----
ctx.G.player.position = 'cerulean'
const full = ctx.map4RenderSvg('kanto', 'cerulean', 'pallet')
assert('地图 SVG 无 undefined/NaN', !/undefined|NaN/.test(full))

// ---- 测试 6：七之岛区域独立可用 ----
const s = ctx.map4RenderSvg('sevii', 'island1', 'island2')
assert('七之岛地图可渲染且含玩家标记', /class="map4-marker is-current"/.test(s) && !/undefined|NaN/.test(s))

// ---- 测试 7：默认不启用底图（回退到网格模式） ----
// 当前策略：MAP4_BASEMAP 留空，地图完全由 SVG 绘制，不依赖任何位图。
// 若日后要启用底图，只需在 MAP4_BASEMAP 里填配置，本测试会自动切换断言。
{
  const L = ctx.map4Layout('kanto')
  const base = L.basemap
  if (!base) {
    assert('默认走网格模式（不依赖底图位图）', true)
    assert('网格模式下绘制地形瓦片', ctx.map4RenderSvg('kanto', 'pallet', null).indexOf('map4-terrain') !== -1)
    assert('网格模式下绘制道路折线', ctx.map4RenderSvg('kanto', 'pallet', null).indexOf('map4-paths') !== -1)
  } else {
    assert('启用底图模式时宽高与 viewBox 一致', L.w === base.w && L.h === base.h)
    assert('底图模式下不重复绘制地形/道路',
      ctx.map4RenderSvg('kanto', 'pallet', null).indexOf('map4-terrain') === -1)
  }

  // 无论哪种模式，都不引用不存在的图片资源
  const cssPath = path.join(ROOT, 'style.css')
  const css = fs.readFileSync(cssPath, 'utf8')
  const urls = []
  const re = /url\(['"]?([^'")]+)['"]?\)/g
  let m
  while ((m = re.exec(css)) !== null) {
    if (m[1].indexOf('assets/') !== -1) urls.push(m[1])
  }
  let missing = []
  for (const u of urls) {
    const abs = path.resolve(path.dirname(cssPath), u)
    if (!fs.existsSync(abs)) missing.push(u)
  }
  assert('style.css 中所有 assets 路径均可解析到真实文件', missing.length === 0,
    missing.length ? ('找不到: ' + missing.join(', ')) : ('校验 ' + urls.length + ' 条路径'))
}

console.log('\n===== 地图标记回归验证 =====')
let pass = 0, fail = 0
for (const r of results) {
  console.log((r.pass ? '✓' : '✗') + ' ' + r.name + (r.detail ? ' (' + r.detail + ')' : ''))
  if (r.pass) pass++; else fail++
}
console.log('\n通过: ' + pass + '/' + results.length + '，失败: ' + fail)
process.exit(fail > 0 ? 1 : 0)
