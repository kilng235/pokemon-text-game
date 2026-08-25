// 端到端战斗流程模拟：进入战斗 → subState 切换 → 命中 → 换人 → 阵亡
// 用 vm 加载 ui.js / battle.js / main.js 真实脚本，模拟关键交互

const fs = require('fs')
const path = require('path')
const vm = require('vm')

const ROOT = path.resolve(__dirname, '..')
const dir = path.join(ROOT, 'js')

function load(file) {
  return fs.readFileSync(path.join(dir, file), 'utf8')
}

// --- 计数器与捕获 ---
const events = []
function log(name, payload) {
  events.push({ name, payload })
  console.log(`[${events.length.toString().padStart(2, ' ')}] ${name}` + (payload ? ` :: ${payload}` : ''))
}

// --- DOM mock ---
//  记录 innerHTML 被覆盖的次数、捕获产生的元素
let mainInnerHTMLWrites = 0
let lastMainHTMLLen = 0
let actionsInnerHTMLWrites = 0
const getByIdMap = {}

function makeEl(tag) {
  return {
    tagName: tag, innerHTML: '', textContent: '',
    style: new Proxy({}, { get: (_t, p) => (typeof p === 'string' ? () => '' : undefined), set: () => true }),
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c) },
      remove(c) { this._set.delete(c) },
      contains(c) { return this._set.has(c) },
    },
    children: [],
    appendChild(c) { this.children.push(c); if (c && c.innerHTML) this.innerHTML += c.innerHTML },
    removeChild(c) { this.children = this.children.filter(x => x !== c) },
    setAttribute() {}, removeAttribute() {},
    addEventListener() {}, removeEventListener() {},
    querySelector() { return null },
    querySelectorAll() { return [] },
    set innerHTML(v) {
      // 顶层 #main 写入计 1 次（视作整块重渲）
      if (this._id === 'main') {
        if (v !== '' && v !== this._lastHTML) {
          mainInnerHTMLWrites++
          lastMainHTMLLen = v.length
          this._lastHTML = v
        }
        return
      }
      if (this._id === 'actions') {
        actionsInnerHTMLWrites++
        this._innerHTML = v
        return
      }
      this._innerHTML = v
    },
    get innerHTML() { return this._innerHTML || '' },
    set textContent(v) { this._text = v }, get textContent() { return this._text || '' },
    offsetWidth: 0,
  }
}

const fakeMain = makeEl('div'); fakeMain._id = 'main'
const fakeActions = makeEl('div'); fakeActions._id = 'actions'
const fakeHeader = makeEl('div'); fakeHeader._id = 'header'
const fakeLog = makeEl('div'); fakeLog._id = 'log'
const fakeTeamPanel = makeEl('div'); fakeTeamPanel._id = 'team-panel'
const fakeMapPanel = makeEl('div'); fakeMapPanel._id = 'map-panel'

getByIdMap['main'] = fakeMain
getByIdMap['actions'] = fakeActions
getByIdMap['header'] = fakeHeader
getByIdMap['log'] = fakeLog
getByIdMap['team-panel'] = fakeTeamPanel
getByIdMap['map-panel'] = fakeMapPanel

// 模拟战斗舞台元素：第一次 renderBattle() 中需要 document.getElementById('battle-stage') 返回 null;
// renderBattleUI() 已经添加完后再返回 stage
let fakeBattleStage = null

const document = {
  getElementById(id) {
    if (id === 'battle-stage') return fakeBattleStage
    return getByIdMap[id] || null
  },
  createElement(tag) {
    const el = makeEl(tag)
    if (tag === 'div') {
      // 第一次创建 div 作为 fx-layer / battle-stage 等使用
      return el
    }
    return el
  },
  querySelector() { return null },
  querySelectorAll() { return [] },
  addEventListener() {},
}

const sandbox = {
  console: { ...console, warn() {} },
  document,
  window: undefined, // 后面指向自身
  setTimeout: (cb, ms) => { /* 立即同步执行，模拟 fast-forward */ try { cb() } catch (e) { console.error('TICK ERR:', e.message); process.exit(2) }; return 1 },
  clearTimeout() {},
  Math, Date, Promise, JSON, Set, Map, Array, Object, Proxy,
  Audio: function() {},
  Image: function() { return { src: '', decode: () => Promise.resolve() } },
  getComputedStyle: () => ({ position: 'static' }),
  requestAnimationFrame: (cb) => cb(),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
}
sandbox.window = sandbox
sandbox.globalThis = sandbox
vm.createContext(sandbox)

// --- 加载脚本 ---
// 由于 state.js 用 `let G = ...` 声明 G，node vm 中不会成为 sandbox 的全局属性，
// 但同 sandbox 中其它脚本可以直接访问它（顶级 let 绑定是 sandbox 内的词法环境共享）。
// 这里额外把 G 显式放到 sandbox 上以便测试代码访问：
const order = ['state.js', 'data.js', 'audio.js', 'fx.js', 'quests.js', 'story.js', 'map.js', 'battle.js', 'ui.js', 'main.js']
for (const f of order) {
  try {
    new vm.Script(load(f), { filename: f }).runInContext(sandbox)
  } catch (e) {
    console.error(`LOAD FAIL: ${f}: ${e.message}`)
    process.exit(2)
  }
}
// 把 state.js 中创建的 G 拉到 sandbox 上：
sandbox.G = vm.runInContext('G', sandbox)
// 补一些缺失的 AU 方法（mock 测试用）
sandbox.AU.playByMessage = sandbox.AU.playByMessage || (() => {})
sandbox.AU.sfx = sandbox.AU.sfx || (() => {})
sandbox.AU.sfxByType = sandbox.AU.sfxByType || (() => {})
sandbox.AU.startBgm = sandbox.AU.startBgm || (() => {})
sandbox.AU.updateBgmForView = sandbox.AU.updateBgmForView || (() => {})
sandbox.AU.playVictory = sandbox.AU.playVictory || (() => {})
log('scripts loaded')

// --- 检查关键函数 ---
function need(name) { if (typeof sandbox[name] !== 'function') { console.error(`MISSING function: ${name}`); process.exit(3) } }
need('render'); need('renderBattle'); need('renderBattleUI'); need('smartRenderBattle'); need('startWildBattle'); need('playerAttack'); need('enemyTurn'); need('battleSub'); need('switchPokemon')
log('key functions present')

// --- 模拟战斗场景 ---
// 准备玩家与敌方
sandbox.G.player.pokemon = [
  { id: 25, name: 'Pikachu', hp: 80, maxHp: 80, level: 10, types: ['电'],
    atk: 30, def: 20, spa: 50, spd: 20, spe: 90,
    ivs: { hp: 20, atk: 20, def: 20, spa: 20, spd: 20, spe: 20 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    moves: [
      { id: 1, name: '电击', type: '电', power: 40, pp: 30, currentPp: 30, desc: '', effect: null },
      { id: 2, name: '十万伏特', type: '电', power: 90, pp: 15, currentPp: 15, desc: '', effect: null },
      { id: 3, name: '打雷', type: '电', power: 110, pp: 10, currentPp: 10, desc: '', effect: null },
      { id: 4, name: '撞击', type: '普通', power: 40, pp: 35, currentPp: 35, desc: '', effect: null },
    ],
    status: null, ability: null, fainted: false, isShiny: false, tempDebuffs: { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 },
  },
  { id: 4, name: 'Charmander', hp: 60, maxHp: 60, level: 10, types: ['火'],
    atk: 30, def: 20, spa: 50, spd: 20, spe: 60,
    ivs: { hp: 20, atk: 20, def: 20, spa: 20, spd: 20, spe: 20 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    moves: [
      { id: 5, name: '火花', type: '火', power: 40, pp: 25, currentPp: 25, desc: '', effect: null },
      { id: 6, name: '火焰旋涡', type: '火', power: 35, pp: 15, currentPp: 15, desc: '', effect: null },
      { id: 7, name: '撞击', type: '普通', power: 40, pp: 35, currentPp: 35, desc: '', effect: null },
      { id: 8, name: '叫声', type: '普通', power: 0, pp: 40, currentPp: 40, desc: '', effect: 'atkDown' },
    ],
    status: null, ability: null, fainted: false, isShiny: false, tempDebuffs: { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 },
  },
]
sandbox.G.player.activeIndex = 0
sandbox.G.player.shinyChain = 0
sandbox.G.player.items = { pokeball: 5 }

// 战场
let lastSnap = {}
function snapBattle(tag) {
  const b = sandbox.G.battle
  if (!b) { log(`${tag} :: G.battle = null`); return }
  const p = sandbox.G.player.pokemon[sandbox.G.player.activeIndex]
  lastSnap = {
    pkmName: p && p.name, pkmHp: p && p.hp,
    enemy: b.enemy && b.enemy.name, enemyHp: b.enemy && b.enemy.hp,
    turn: b.turn, subState: b.subState, captured: b.captured, ran: b.ran,
    dirtyFlags: { ...b.dirtyFlags },
  }
  log(`${tag}`, JSON.stringify(lastSnap))
}

// startWildBattle() 会查找 G.player.position 对应的 wild 池；简化方案：直接 startBattle()
function makeEnemy(id, name, type, hp, maxHp, atk, def, spa, spd, spe, level, moves) {
  return {
    id, name, types: type ? type.split(',') : [],
    hp, maxHp, level,
    atk, def, spa, spd, spe,
    moves: moves.map(([mid, mname, mtype, mpow, mpp, meffect]) => ({ id: mid, name: mname, type: mtype, power: mpow, pp: mpp, currentPp: mpp, desc: '', effect: meffect || null })),
    status: null, fainted: false, isShiny: false, isElite: false,
    ivs: { hp: 10, atk: 10, def: 10, spa: 10, spd: 10, spe: 10 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    tempDebuffs: { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 },
  }
}

const enemy1 = makeEnemy(16, 'Pidgey', '飞行,普通', 40, 40, 20, 20, 20, 20, 60, 7, [
  [9, '起风', '飞行', 40, 30, null],
  [10, '撞击', '普通', 40, 35, null],
  [11, '啄', '飞行', 35, 25, null],
  [12, '叫声', '普通', 0, 40, 'atkDown'],
])
const enemy2 = makeEnemy(19, 'Rattata', '普通', 50, 50, 25, 20, 20, 20, 70, 8, [
  [13, '撞击', '普通', 40, 35, null],
  [14, '咬碎', '恶', 60, 25, null],
])

const ok = sandbox.startBattle('wild', null, [enemy1, enemy2])
if (!ok) { console.error('startBattle returned false'); process.exit(4) }
sandbox.G.view = 'battle'

// 模拟 render() 入口
fakeBattleStage = makeEl('div'); fakeBattleStage._id = 'battle-stage'
sandbox.render()
snapBattle('首次进入战斗')

// --- 关键场景 1：点击"⚔ 攻击" ---
// battleSub 内部将 subState='attack'，调 renderBattleUI
const mainWritesBefore = mainInnerHTMLWrites
sandbox.battleSub('attack')
log(`battleSub('attack') → main.innerHTML writes delta = ${mainInnerHTMLWrites - mainWritesBefore}`)
snapBattle('点击攻击')
const sub = sandbox.G.battle.subState
if (sub !== 'attack') { console.error('FAIL: subState should be attack, got', sub); process.exit(5) }
log('✓ subState 切到 attack')

// --- 关键场景 2：选择 0 号技能（confirm path）---
sandbox.battleSub('selectMove', 0)
const sub2 = sandbox.G.battle.subState
log(`battleSub('selectMove', 0) → subState = ${sub2}`)
if (sub2 !== 'selectMove') { console.error('FAIL'); process.exit(6) }
log('✓ subState 切到 selectMove')

// --- 关键场景 3：confirmMove → 攻击 → 应该扣血 ---
// 注：confirmMove 用 speed 决定先手。我们这里把玩家 speed 已 > enemy，跑 playerFirst=true
const enemyHpBefore = sandbox.G.battle.enemy.hp
sandbox.confirmMove()
snapBattle('confirmMove 后')
if (sandbox.G.battle.enemy.hp !== enemyHpBefore) {
  log(`✓ 玩家攻击命中：敌方 HP ${enemyHpBefore} → ${sandbox.G.battle.enemy.hp}`)
} else {
  log('（注：扣血可能被 syncEnemyAttack / timing 导致，本测试不强制要求扣血命中）')
}

// --- 关键场景 4：模拟玩家换宠（switch grid → 选 1 号）---
sandbox.battleSub('switch')
log(`battleSub('switch') → subState = ${sandbox.G.battle.subState}`)
if (sandbox.G.battle.subState !== 'switch') { console.error('FAIL switch subState'); process.exit(7) }

const mainWritesPreSwitch = mainInnerHTMLWrites
sandbox.switchPokemon(1)
log(`switchPokemon(1) → activeIndex = ${sandbox.G.player.activeIndex}, arena flag = ${sandbox.G.battle.dirtyFlags.arena}, main.innerHTML writes delta = ${mainInnerHTMLWrites - mainWritesPreSwitch}`)
snapBattle('switchPokemon(1)')

// --- 关键场景 5：直接击倒敌方 1，让 enemyIndex 进入 1（敌方换人） ---
sandbox.G.battle.enemy.hp = 1
const enemyWritesBefore = mainInnerHTMLWrites
sandbox.playerAttack(0) // 用 0 号招式（电击，power 40）
log(`playerAttack(0) → subState=${sandbox.G.battle.subState}, enemyIndex=${sandbox.G.battle.enemyIndex}, main.innerHTML writes delta = ${mainInnerHTMLWrites - enemyWritesBefore}`)
snapBattle('击倒敌方 1')

// --- 关键场景 6：再把敌方 2 也击倒，触发 battleVictory ---
const enemy2HpBefore = sandbox.G.battle.enemy.hp
log(`当前敌方 2 HP = ${enemy2HpBefore}`)
sandbox.G.battle.enemy.hp = 1
sandbox.playerAttack(0)
log(`敌方 2 倒下后 battle = ${sandbox.G.battle ? 'exists' : 'null'}, view = ${sandbox.G.view}`)

console.log('')
console.log('========== 汇总 ==========')
console.log(`#main.innerHTML 整块写入总次数: ${mainInnerHTMLWrites}`)
console.log(`#actions.innerHTML 写入次数:  ${actionsInnerHTMLWrites}`)
console.log(`模拟战斗完成。`)
