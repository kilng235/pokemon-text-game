// 验证修复：1) 变化技能命中判定 2) 敌方 AI 变化技能生效
// 通过 eval 加载游戏脚本（const/let 替换为 var 以挂载到 ctx）

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const files = ['js/data.js', 'js/state.js', 'js/battle.js']
let code = ''
for (const f of files) {
  code += fs.readFileSync(path.join(ROOT, f), 'utf8') + '\n'
}
// const/let 替换为 var，使变量挂到 ctx
code = code.replace(/^const /gm, 'var ').replace(/^let /gm, 'var ')

const ctx = {}
// 模拟 window 和 AU
const mockWindow = {}
ctx.window = mockWindow
ctx.console = console
ctx.Math = Math
ctx.Date = Date
ctx.JSON = JSON

// 用 vm 在独立上下文执行，所有声明自动挂到 ctx
const vm = require('vm')
ctx.window = ctx  // 让 window 指向 ctx 本身
vm.createContext(ctx)
vm.runInNewContext(code, ctx)
const G = ctx

const results = []
function assert(name, cond, detail) {
  results.push({ name, pass: !!cond, detail: detail || '' })
}

// ===== 测试 1：变化技能不再 100% 命中 =====
// 构造一个命中率极低的变化技能，验证会 miss
{
  G.G = G.createInitialState()
  const pkm = G.createPokemon(1, 5)  // 妙蛙种子
  const enemy = G.createPokemon(4, 5) // 小火龙
  // 临时塞一个命中率 1% 的变化技能
  const lowAccMove = { id: 999, name: '测试催眠', type: '草', power: 0, pp: 10, currentPp: 10, effect: 'sleep' }
  // 注入 MOVE_ACCURACY
  if (!G.MOVE_ACCURACY) G.MOVE_ACCURACY = {}
  G.MOVE_ACCURACY[999] = 1  // 1% 命中

  let missCount = 0
  let hitCount = 0
  for (let i = 0; i < 200; i++) {
    // 重置状态
    enemy.status = null
    enemy.evasion = 100
    pkm.accuracy = 100
    const r = G.calcDamage(pkm, enemy, lowAccMove)
    if (r.missed) missCount++
    else hitCount++
  }
  // 1% 命中率下，200 次应该大部分 miss（hitCount 大致 1-5 次）
  assert('变化技能低命中会miss', missCount > 100, `miss=${missCount}/200, hit=${hitCount}/200`)
}

// ===== 测试 2：变化技能命中时返回 effectiveness=1，miss 时返回 0 =====
{
  G.G = G.createInitialState()
  const pkm = G.createPokemon(1, 5)
  const enemy = G.createPokemon(4, 5)
  const move = { id: 24, name: '催眠粉', type: '草', power: 0, pp: 15, currentPp: 15, effect: 'sleep' }
  if (!G.MOVE_ACCURACY) G.MOVE_ACCURACY = {}
  G.MOVE_ACCURACY[24] = 100

  // 命中时
  enemy.status = null
  const r1 = G.calcDamage(pkm, enemy, move)
  assert('变化技能命中时 effectiveness=1', r1.effectiveness === 1 && !r1.missed, `eff=${r1.effectiveness} missed=${r1.missed}`)

  // 强制 miss（设命中率 0）
  G.MOVE_ACCURACY[24] = 0
  enemy.status = null
  const r2 = G.calcDamage(pkm, enemy, move)
  assert('变化技能miss时 effectiveness=0', r2.effectiveness === 0 && r2.missed, `eff=${r2.effectiveness} missed=${r2.missed}`)
}

// ===== 测试 3：handleStatusEffect 覆盖所有 effect 类型 =====
{
  G.G = G.createInitialState()
  const target = G.createPokemon(1, 5)
  const effects = ['sleep','paralyze','poison','burn','confuse','accuracyDown','speedDown','atkDown','defDown','spDefDown','spAtkDown','poisonSpeedDown','clearAll']
  let allOk = true
  for (const eff of effects) {
    target.status = null
    target.confused = false
    target.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 }
    const ok = G.handleStatusEffect(target, eff)
    if (!ok) allOk = false
  }
  assert('handleStatusEffect 覆盖全部 effect', allOk)
}

// ===== 测试 4：applySelfBuff 覆盖所有 buff 类型 =====
{
  G.G = G.createInitialState()
  const actor = G.createPokemon(1, 5)
  const enemy = G.createPokemon(4, 5)
  const buffs = ['atkUp','defUp','spAtkUp','spDefUp','speedUp','evasionUp','atkUpDefUp','atkUpSpeedUp','atkUpSpAtkUp','defUpSpDefUp','spAtkUpSpDefUpSpeedUp','recover','recoverAll','leechSeed']
  let allOk = true
  for (const b of buffs) {
    actor.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 }
    actor.hp = 10
    enemy.leechSeed = false
    const move = { effect: b }
    const ok = G.applySelfBuff(move, actor, enemy)
    if (!ok) allOk = false
  }
  assert('applySelfBuff 覆盖全部 buff', allOk)
}

// ===== 测试 5：敌方 AI 路径完整性检查（静态分析） =====
{
  // 检查 enemyTurn 函数源码中是否包含所有 effect 关键字
  const src = G.enemyTurn.toString()
  const required = ['poison','burn','confuse','disable','atkDown','defDown','spDefDown','spAtkDown','clearAll','atkUp','recover','leechSeed']
  const missing = required.filter(k => !src.includes(k))
  assert('enemyTurn 包含所有敌方effect处理', missing.length === 0, `missing: ${missing.join(',')}`)
}

// ===== 测试 6：变化技能 effect 在 effectiveness>0 时应用 =====
{
  G.G = G.createInitialState()
  const pkm = G.createPokemon(1, 5)
  const enemy = G.createPokemon(4, 5)
  // 模拟 calcDamage 命中变化技能后，handleStatusEffect 被调用
  enemy.status = null
  G.handleStatusEffect(enemy, 'sleep')
  assert('变化技能应用睡眠', enemy.status && enemy.status.type === 'sleep', `status=${enemy.status && enemy.status.type}`)

  enemy.status = null
  G.handleStatusEffect(enemy, 'poison')
  assert('变化技能应用中毒', enemy.status && enemy.status.type === 'poison')

  enemy.tempDebuffs.atk = 0
  G.handleStatusEffect(enemy, 'atkDown')
  assert('变化技能应用攻击降低', enemy.tempDebuffs.atk === -20, `atk debuff=${enemy.tempDebuffs.atk}`)
}

// ===== 测试 7：异常状态 checkStatusSkip 正确处理 =====
{
  G.G = G.createInitialState()
  const pkm = G.createPokemon(1, 5)
  // 睡眠跳过
  pkm.status = { type: 'sleep', turns: 2 }
  const skip1 = G.checkStatusSkip(pkm)
  assert('睡眠导致跳过回合', skip1 === true, `skip=${skip1}`)

  // 中毒掉血
  const hpBefore = pkm.hp
  pkm.status = { type: 'poison', turns: 0 }
  G.checkStatusSkip(pkm)
  assert('中毒导致掉血', pkm.hp < hpBefore, `hp ${hpBefore} -> ${pkm.hp}`)

  // 灼伤掉血
  pkm.hp = pkm.maxHp
  const hpBefore2 = pkm.hp
  pkm.status = { type: 'burn', turns: 0 }
  G.checkStatusSkip(pkm)
  assert('灼伤导致掉血', pkm.hp < hpBefore2, `hp ${hpBefore2} -> ${pkm.hp}`)
}

// 输出结果
console.log('\n===== 战斗修复验证 =====')
let pass = 0, fail = 0
for (const r of results) {
  const mark = r.pass ? '✓' : '✗'
  console.log(`${mark} ${r.name}${r.detail ? ' (' + r.detail + ')' : ''}`)
  if (r.pass) pass++; else fail++
}
console.log(`\n通过: ${pass}/${results.length}，失败: ${fail}`)
process.exit(fail > 0 ? 1 : 0)
