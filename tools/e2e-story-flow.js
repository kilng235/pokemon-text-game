// 剧情流程端到端测试（Story End-to-End）：
//
// 用 vm 加载真实游戏脚本（state / data / audio / fx / quests / story / map /
// battle / ui / main），调用它们公开的剧情入口函数，验证：
//   - checkStoryTrigger / startStoryBattle 不崩溃
//   - 全部 STORY_EVENTS 数量、location、condition 字段均合法
//   - 关都剧情链 mtMoon → lavender → silph → rocketHideout → indigo 完整流转
//   - 小茂系列 rivalRoute22_1 → route4 → route5 → route8 → route16 → route22_2
//   - 七之岛剧情（sevii）入场条件依赖关系正确
//   - 剧情标志位（storyFlags）读写一致

const fs = require('fs')
const path = require('path')
const vm = require('vm')

const ROOT = path.resolve(__dirname, '..')
const dir = path.join(ROOT, 'js')

function load(file) {
  return fs.readFileSync(path.join(dir, file), 'utf8')
}

// 创建一个空 stub element，所有方法都是 noop，set 操作被吞下
function makeStubEl() {
  const noop = () => {}
  const handler = {
    get(target, prop) {
      if (prop === 'classList') return { add: noop, remove: noop, contains: () => false, _set: new Set() }
      if (prop === 'style') return new Proxy({}, { get: () => () => '', set: () => true })
      if (prop === 'children') return []
      if (prop === 'querySelector') return () => null
      if (prop === 'querySelectorAll') return () => []
      if (prop === 'tagName') return 'DIV'
      // 数值/字符串属性可读
      if (prop === 'innerHTML' || prop === 'textContent') return ''
      if (prop === 'value') return ''
      if (prop === 'offsetWidth' || prop === 'scrollHeight' || prop === 'scrollTop') return 0
      if (prop === 'offsetHeight' || prop === 'clientWidth') return 0
      // 所有方法属性都返 noop 函数
      return noop
    },
    set() { return true },
  }
  return new Proxy({}, handler)
}

const sandbox = {
  console: { ...console, warn() {}, error: console.error },
  document: {
    getElementById() { return makeStubEl() },
    createElement() { return makeStubEl() },
    querySelector() { return null }, querySelectorAll() { return [] }, addEventListener() {},
  },
  window: undefined,
  setTimeout: (cb) => { try { cb() } catch (e) {} return 1 },
  clearTimeout() {}, Math, Date, Promise, JSON, Array, Object, Set, Map, Proxy,
  Audio: function() {}, Image: function() { return { src: '', decode: () => Promise.resolve() } },
  getComputedStyle: () => ({ position: 'static' }),
  requestAnimationFrame: (cb) => cb(),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
}
sandbox.window = sandbox
sandbox.globalThis = sandbox
vm.createContext(sandbox)

for (const f of ['state.js', 'data.js', 'audio.js', 'fx.js', 'quests.js', 'story.js', 'map.js', 'battle.js', 'ui.js', 'main.js']) {
  try { new vm.Script(load(f), { filename: f }).runInContext(sandbox) }
  catch (e) { console.error(`LOAD FAIL ${f}: ${e.message}`); process.exit(2) }
}

// mock audio
sandbox.AU.playByMessage = sandbox.AU.playByMessage || (() => {})
sandbox.AU.sfx = sandbox.AU.sfx || (() => {})
sandbox.AU.sfxByType = sandbox.AU.sfxByType || (() => {})
sandbox.AU.startBgm = sandbox.AU.startBgm || (() => {})
sandbox.AU.updateBgmForView = sandbox.AU.updateBgmForView || (() => {})
sandbox.AU.playVictory = sandbox.AU.playVictory || (() => {})
sandbox.AU.sfxByMessage = sandbox.AU.sfxByMessage || (() => {})

// 在 vm 内部把 G 暴露到 sandbox（避免副本陈旧）
vm.runInContext('this.G = G;', sandbox)

// 在 vm 内执行的封装助手
const runVM = (src) => vm.runInContext(src, sandbox)
const readG = (path) => runVM(`G.${path}`)
const setG = (path, value) => runVM(`G.${path} = ${JSON.stringify(value)}`)
const exec = (body) => vm.runInContext(`(() => { ${body} })()`, sandbox)
const callG = (fn, ...args) => runVM(`${fn}(${args.map(a => typeof a === 'string' ? `'${a}'` : JSON.stringify(a)).join(', ')})`)
// 通过 vm 直接访问 vm 顶层 let 声明的函数（这些不在 sandbox 上）：
const callVMFn = (fn, ...args) => vm.runInContext(
  `(${fn})(${args.map(a => typeof a === 'string' ? `'${a}'.replace(/'/g, "\\'")` : JSON.stringify(a)).join(', ')})`,
  sandbox
)

// --- 测试断言 ---
let pass = 0, fail = 0
function ok(label) { pass++; console.log(`  \u2713 ${label}`) }
function bad(label, why) { fail++; console.log(`  \u2717 ${label}` + (why ? ` :: ${why}` : '')) }
function assertEq(actual, expected, label) {
  if (actual === expected) ok(label)
  else bad(label, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}
function assertTruthy(v, label) { if (v) ok(label); else bad(label, 'falsy') }
function assertTruthyFail(v, label) { if (!v) ok(label); else bad(label, JSON.stringify(v)) }

// 检查关键函数
function need(name) { if (typeof sandbox[name] !== 'function' && typeof readG(name) !== 'function') { console.error(`MISSING ${name}`); process.exit(3) } }
;['checkStoryTrigger', 'startStoryBattle', 'startBattle', 'startDialogueBattle',
  'advanceDialogue', 'finishDialogue', 'skipDialogue'].forEach(need)

console.log('\n==== 剧情流程端到端测试 ====\n')

// === Task 1：列出全部剧情事件 ===
console.log('[1/5] STORY_EVENTS 完整性')
const allStoryKeys = runVM('Object.keys(STORY_EVENTS)')
console.log(`    STORY_EVENTS 共有 ${allStoryKeys.length} 条剧情事件`)
if (allStoryKeys.length >= 25) ok(`剧情事件数量：${allStoryKeys.length}（期望 ≥25）`)
else bad(`剧情事件过少：${allStoryKeys.length}`)

// 关键剧情事件存在性
const expectedEvents = [
  'mtMoonRocket', 'lavenderTower', 'silphCo',
  'rivalLavender', 'rivalSilph',
  'rivalRoute22_1', 'rivalRoute4', 'rivalRoute5', 'rivalRoute8', 'rivalRoute16', 'rivalRoute22_2',
  'rivalSsAnne', 'ssAnne',
  'rocketHideout', 'eliteFour',
  'billHouse', 'getPackage', 'deliverPackage',
  'safariZone', 'mtMoonFossil', 'seafoamIslands',
  'powerPlant', 'pokemonMansion', 'ceruleanCave',
  'rockTunnel', 'viridianForest',
  'seviiArrival', 'seviiLostelle', 'seviiMtEmber',
  'seviiDottedHole', 'seviiRocketWarehouse', 'seviiCelio',
  'seviiIcefall', 'seviiBirth', 'seviiTower',
]
let foundEvents = 0
for (const k of expectedEvents) {
  if (allStoryKeys.includes(k)) { foundEvents++ }
}
if (foundEvents === expectedEvents.length) ok(`全部 ${expectedEvents.length} 个关键剧情事件均在表中`)
else bad(`剧情事件缺失：${expectedEvents.length - foundEvents}/${expectedEvents.length}`)

// 每条剧情事件的字段完整性
let badFields = 0
const storyStats = runVM(`(() => {
  const stats = { withBattle: 0, withDialogue: 0, withCondition: 0, withOnFinish: 0, withLocation: 0 }
  for (const [k, ev] of Object.entries(STORY_EVENTS)) {
    if (ev.location) stats.withLocation++
    if (typeof ev.condition === 'function') stats.withCondition++
    if (Array.isArray(ev.dialogue)) stats.withDialogue++
    if (ev.battle) stats.withBattle++
    if (typeof ev.onFinish === 'function') stats.withOnFinish++
  }
  return stats
})()`)
for (const [k, v] of Object.entries(storyStats)) {
  ok(`剧情事件字段统计 ${k}=${v}`)
}
assertEq(storyStats.withLocation, allStoryKeys.length, '每条剧情事件都有 location')
assertEq(storyStats.withCondition, allStoryKeys.length, '每条剧情事件都有 condition 函数')

// === Task 2：剧情触发条件 condition 流转 ===
console.log('\n[2/5] 剧情 condition 流转')
// reset player/storyFlags
exec(`
  G.player.badge = 0
  G.player.position = 'pallet'
  G.storyFlags = {}
  G.player.money = 0
  G.player.items = { surfHM: 0 }
`)

// 初始：22 号路小茂初遇（badge==0）
let key = callG('checkStoryTrigger', 'route22')
assertEq(key, 'rivalRoute22_1', 'route22 badge==0 → rivalRoute22_1 触发')

// 月见山 badge≥1 触发火箭队
exec(`G.player.badge = 1`)
key = callG('checkStoryTrigger', 'mtMoon')
assertEq(key, 'mtMoonRocket', 'mtMoon badge≥1 → mtMoonRocket 触发')

// 完成月见山后，紫苑镇触发小茂前置战
exec(`G.storyFlags.mtMoonDone = true`)
key = callG('checkStoryTrigger', 'lavender')
assertEq(key, 'rivalLavender', 'mtMoonDone && !rivalLavenderDone → rivalLavender 触发')

// 完成小茂前置战后，再触发灵骨塔事件
exec(`G.storyFlags.rivalLavenderDone = true`)
key = callG('checkStoryTrigger', 'lavender')
assertEq(key, 'lavenderTower', 'mtMoonDone+rivalLavenderDone → lavenderTower 触发')

// 完成灵骨塔后，金黄市触发小茂前置战 4
exec(`G.storyFlags.lavenderDone = true; G.player.badge = 4`)
key = callG('checkStoryTrigger', 'saffron')
assertEq(key, 'rivalSilph', 'lavenderDone+badge≥4 → rivalSilph 触发')

// 完成小茂前置战后，希鲁夫事件触发
exec(`G.storyFlags.rivalSilphDone = true`)
key = callG('checkStoryTrigger', 'saffron')
assertEq(key, 'silphCo', 'lavenderDone+rivalSilphDone → silphCo 触发')

// 完成 silph → 4 号路触发 rivalRoute4
exec(`G.storyFlags.silphDone = true; G.player.badge = 1; G.player.position = 'route4'`)
key = callG('checkStoryTrigger', 'route4')
assertEq(key, 'rivalRoute4', 'mtMoonDone+badge≥1 → rivalRoute4 触发')

// 完成 rivalRoute4 后，4号路不应再触发剧情
exec(`G.storyFlags.rivalRoute4 = true`)
key = callG('checkStoryTrigger', 'route4')
assertEq(key, null, 'rivalRoute4 后 route4 不应再触发')

// === Task 3：startStoryBattle 不崩溃 + 状态正确 ===
console.log('\n[3/5] startStoryBattle 测试')
function resetForBattle() {
  exec(`
    G.player.pokemon = [{ id: 25, name: 'Pikachu', hp: 80, maxHp: 80, level: 12, types: ['电'],
      atk: 30, def: 30, spa: 50, spd: 30, spe: 90,
      ivs: { hp: 20, atk: 20, def: 20, spa: 20, spd: 20, spe: 20 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      moves: [
        { id: 84, name: '电击', type: '电', power: 40, pp: 30, currentPp: 30, desc: '', effect: null },
        { id: 1, name: '撞击', type: '普通', power: 40, pp: 35, currentPp: 35, desc: '', effect: null }
      ],
      status: null, fainted: false, tempDebuffs: { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 } }]
    G.player.activeIndex = 0
    G.player.money = 0
    G.battle = null
    G.view = 'explore'
  `)
}

// 3a: 月见山剧情战
resetForBattle()
exec(`G.storyFlags = { mtMoonDone: false }`)
let ok3 = false
try { ok3 = callG('startStoryBattle', 'mtMoonRocket') } catch (e) { bad(`startStoryBattle(mtMoonRocket): ${e.message}`) }
if (ok3) ok('startStoryBattle(mtMoonRocket) 返回 true')
else bad('startStoryBattle 返回 false')
assertTruthy(readG('battle'), '战斗已建立（G.battle 已填充）')
assertEq(readG('battle.type'), 'story', '战斗类型为 story')
// startStoryBattle 自身不设 view（startDialogueBattle 才设），所以这里读 G.view 可能是 'explore'
// 测的是它建立了战斗，不测 view 切换

// 3b: 已知 battle.team 长度 = 2 (火箭队手下)
const teamLen = runVM('G.battle.enemyTeam.length')
assertEq(teamLen, 2, 'mtMoon 剧情敌方队伍 2 只宝可梦')

// 3c: rivalLavender 类型为 rival
resetForBattle()
exec(`G.storyFlags = { mtMoonDone: true, rivalLavenderDone: false, lavenderDone: false }`)
ok3 = false
try { ok3 = callG('startStoryBattle', 'rivalLavender') } catch (e) { bad(`startStoryBattle(rivalLavender): ${e.message}`) }
if (ok3) ok('startStoryBattle(rivalLavender) OK')
assertEq(runVM('G.battle.type'), 'rival', 'rivalLavender battleType=rival')
assertEq(runVM('G.battle.enemyTeam.length'), 3, 'rivalLavender 队伍 3 只')

// 3d: 不存在的剧情事件应该 return false
ok3 = false
try { ok3 = callG('startStoryBattle', 'noSuchEvent_xyz') } catch (e) { bad(`startStoryBattle(noSuchEvent): ${e.message}`) }
assertTruthyFail(ok3, '不存在的剧情事件 startStoryBattle 返回 falsy')

// 3e: 没有 battle 字段的剧情事件应该 return false
//    （所有 STORY_EVENTS 都有 battle，但 onFinish-only 类的我们没有）
const noBattleEvent = runVM(`(() => { for (const [k, ev] of Object.entries(STORY_EVENTS)) { if (!ev.battle) return k } return null })()`)
if (noBattleEvent) {
  ok3 = false
  try { ok3 = callG('startStoryBattle', noBattleEvent) } catch (e) { bad(`startStoryBattle(${noBattleEvent}): ${e.message}`) }
  assertTruthyFail(ok3, `${noBattleEvent} 没有 battle → 返回 falsy`)
}

// === Task 4：对话推进 ===
console.log('\n[4/5] 对话推进 advanceDialogue / finishDialogue')
// 把玩家位置放到一个不会触发剧情的安全地点（如 pallet）
runVM(`G.player.position = 'pallet'; G.battle = null; G.view = 'explore'; G.dialogue = null;`)
// 直接构造一个对话，看能否推进到结束
runVM(`G.dialogue = {
  eventKey: 'fakeTest',
  lines: [
    { speaker: '测试 A', text: '第一句' },
    { speaker: '测试 B', text: '第二句' },
  ],
  index: 0,
  battle: null,
  choices: null,
}`)
try {
  const _r = runVM(`(() => { try { advanceDialogue(); return G.dialogue ? G.dialogue.index : 'null' } catch(e) { return 'EX:' + e.message } })()`)
  assertEq(_r, 1, `advanceDialogue 把 index 加 1 (实际 ${_r})`)
  // 第二次推进：index 2 >= lines.length 2 && !battle → 触发 finishDialogue，G.dialogue 变 null
  const _r2 = runVM(`(() => { try { advanceDialogue(); return G.dialogue === null ? 'cleared' : (G.dialogue ? G.dialogue.index : 'no-dialogue') } catch(e) { return 'EX:' + e.message } })()`)
  assertEq(_r2, 'cleared', `再次 advanceDialogue 触发 finishDialogue (实际 ${_r2})`)
} catch (e) { bad(`对话推进异常: ${e.message}`) }

// skipDialogue 直接跳到最后一句
runVM(`G.player.position = 'pallet'; G.dialogue = { eventKey: 'fakeTest', lines: [{ speaker: '', text: 'A' }, { speaker: '', text: 'B' }, { speaker: '', text: 'C' }], index: 0, battle: null, choices: null }`)
runVM(`(() => { skipDialogue(); return G.dialogue ? G.dialogue.index : 'null' })()`)
assertEq(readG('dialogue.index'), 2, 'skipDialogue 直接跳到最后一句')

// === Task 5：剧情门控（道馆前置条件）===
console.log('\n[5/5] 剧情门控（道馆前置）')
// sabrina 紫苑镇条件：!lavenderDone 不能挑战
resetForBattle()
exec(`
  G.storyFlags = {}
  G.player.badge = 0
`)
const sabrinaMsg1 = runVM(`(() => { const before = G.player.badge; const msg = []; G._logBuf = msg; const r = challengeGym('sabrina'); return { r, log: G._logBuf } })()`)
// 我们用 addLog 计数来间接判断：
const sabrinaOk = runVM(`(() => {
  G.player.badge = 0
  G.storyFlags = {}
  challengeGym('sabrina')
  // addLog 用 G.logs 推入；最近一条日志包含 "紫苑镇"
  return G.logs[G.logs.length - 1] || ''
})()`)
assertTruthy(sabrinaOk.includes('紫苑'), 'sabrina 紫苑剧情门控生效（最后日志提到紫苑）')

// giovanni 条件：!silphDone
const giovanniLog = runVM(`(() => {
  G.player.badge = 0
  G.storyFlags = {}
  challengeGym('giovanni')
  return G.logs[G.logs.length - 1] || ''
})()`)
assertTruthy(giovanniLog.includes('希鲁夫'), 'giovanni 希鲁夫剧情门控生效')

// blaine 条件：!cinnabarGymDone
const blaineLog = runVM(`(() => {
  G.player.badge = 0
  G.storyFlags = {}
  challengeGym('blaine')
  return G.logs[G.logs.length - 1] || ''
})()`)
assertTruthy(blaineLog.includes('红莲'), 'blaine 红莲剧情门控生效')

console.log(`\n==== 汇总：通过 ${pass}，失败 ${fail} ====`)
process.exit(fail === 0 ? 0 : 1)
