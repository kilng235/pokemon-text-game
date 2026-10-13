// 烟雾测试：通过 vm 模块加载 ui.js / battle.js / main.js 等核心脚本，
// 验证关键全局函数已挂到 window 上。

const fs = require('fs')
const path = require('path')
const vm = require('vm')

const ROOT = path.resolve(__dirname, '..')
const dir = path.join(ROOT, 'js')

function load(file) {
  return fs.readFileSync(path.join(dir, file), 'utf8')
}

// 模拟 DOM（简易）
const fakeMain = {
  innerHTML: '', children: [],
  classList: {
    _set: new Set(),
    add(c) { this._set.add(c) }, remove(c) { this._set.delete(c) },
    contains(c) { return this._set.has(c) },
  },
  appendChild() {}, removeChild() {}, offsetWidth: 0,
  addEventListener() {}, removeEventListener() {},
  style: new Proxy({}, { get: () => () => '' }),
  querySelector() { return null }, querySelectorAll() { return [] },
  setAttribute() {}, getAttribute() { return '' }, getBoundingClientRect() {
    return { left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100 }
  },
}
const elements = {
  main: fakeMain, app: fakeMain, header: fakeMain, log: fakeMain,
  actions: fakeMain, team: fakeMain, 'map-panel': fakeMain, 'log': fakeMain,
}
const document = {
  getElementById(id) { return elements[id] || null },
  createElement() { return fakeMain },
  querySelector() { return null }, querySelectorAll() { return [] },
  addEventListener() {}, removeEventListener() {},
}

const sandbox = {
  console, document, setTimeout, clearTimeout,
  Math, Date, Promise, JSON,
  Audio: function() {},
  Image: function() { return { src: '', decode: () => Promise.resolve() } },
  getComputedStyle: () => ({ position: 'static' }),
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
}
// window 等同于 sandbox（最简）
sandbox.window = sandbox
// global 指向 sandbox，方便脚本里 `var G = ...; window.G = G`
sandbox.globalThis = sandbox
vm.createContext(sandbox)

const order = ['state.js', 'data.js', 'audio.js', 'fx.js', 'quests.js', 'story.js', 'map.js', 'battle.js', 'ui.js', 'main.js']
for (const f of order) {
  try {
    new vm.Script(load(f), { filename: f }).runInContext(sandbox)
  } catch (e) {
    console.error(`RUNTIME: ${f}: ${e.message}`)
    process.exit(1)
  }
}
console.log('All scripts loaded OK')

// 检查关键导出（这个测试是为了确保 ui.js 中的 window.* 暴露生效）
const win = sandbox.window
const checks = [
  ['window.renderBattleUI', typeof win.renderBattleUI],
  ['window.renderBattle', typeof win.renderBattle],
  ['window.smartRenderBattle', typeof win.smartRenderBattle],
  ['window.render', typeof sandbox.render],
]
let pass = true
for (const [name, t] of checks) {
  console.log(`${name} = ${t}`)
  if (t === 'undefined') pass = false
}
if (!pass) {
  console.error('关键函数未挂到 window 上，选择性更新路径不可用。')
  process.exit(1)
}

// 模拟快速路径：直接调用 renderBattleUI 不崩
// 不直接调用（mock DOM 太简，进入 render() 后访问复杂样式属性）。
// 关键验证点已通过：window.* 已暴露。

// 静态分析：ui.js 中应包含 subStateChanged 检测逻辑
const uiSrc = load('ui.js')
const mainSrc = load('main.js')
const analyticChecks = [
  ['subState changed 探测', /subStateChanged/.test(uiSrc)],
  ['turnChanged 探测', /turnChanged/.test(uiSrc)],
  ['lastBattleSubState 变量', /lastBattleSubState\s*=/.test(uiSrc)],
  ['battleSub 调用 renderBattleUI', /battleSub[\s\S]{0,200}renderBattleUI/.test(mainSrc)],
  ['smartRenderBattle arena', /arena[\s\S]{0,100}renderBattle\(\)/.test(uiSrc)],
]
let analyticPass = true
for (const [name, ok] of analyticChecks) {
  console.log(`${ok ? '✓' : '✗'} ${name}`)
  if (!ok) analyticPass = false
}
if (!analyticPass) {
  console.error('静态分析失败，关键修复点缺失。')
  process.exit(1)
}

// 回归断言（源级，防回退）：选择性更新依赖的选择器必须与模板一致，
// 否则捕捉等“subState/turn 不变”路径的战斗消息/动作区永远不刷新（原 P0/P1 缺陷）。
// 注意：这里对 ui.js 源码做正则校验，而非依赖 mock DOM——mock 元素无论源码如何都会返回，
// 无法真正捕获回退。
const regressionChecks = [
  ['battle-message id 在模板中', /id="battle-message"/.test(uiSrc)],
  ['updateBattleMsg 查 #battle-message', /updateBattleMsg[\s\S]{0,200}getElementById\('battle-message'\)/.test(uiSrc)],
  ['updateBattleActions 查 #actions（非不存在的 #battle-actions）', /updateBattleActions[\s\S]{0,400}getElementById\('actions'\)/.test(uiSrc)],
  ['无残留的 #battle-actions 选择器', !/getElementById\('battle-actions'\)/.test(uiSrc)],
]
let regressionPass = true
for (const [name, ok] of regressionChecks) {
  console.log(`${ok ? '✓' : '✗'} ${name}`)
  if (!ok) regressionPass = false
}
if (!regressionPass) {
  console.error('回归断言失败：选择性更新选择器与模板不一致，捕捉消息/动作区将静默失效。')
  process.exit(1)
}
console.log('✓ #battle-message 选择器与模板一致，捕捉消息选择性刷新可用')

console.log('--- 所有烟雾测试通过 ---')
process.exit(0)
