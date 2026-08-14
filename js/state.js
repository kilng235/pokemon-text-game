const SAVE_KEY = 'pokemon_text_save_v3'

// 性格数据: [name, increasedStat, decreasedStat]
// 5 stat keys: 'atk','def','spa','spd','spe'
// 25种性格: 每项作为 增/减 各5次 + 5种中性(增减相同)
const ALL_NATURES = [
  ['勤奋','atk','atk'],['怕寂寞','atk','def'],['固执','atk','spa'],['调皮','atk','spd'],['勇敢','atk','spe'],
  ['大胆','def','atk'],['坦率','def','def'],['淘气','def','spa'],['乐天','def','spd'],['悠闲','def','spe'],
  ['内敛','spa','atk'],['慢吞吞','spa','def'],['害羞','spa','spa'],['马虎','spa','spd'],['冷静','spa','spe'],
  ['温和','spd','atk'],['温顺','spd','def'],['慎重','spd','spa'],['浮躁','spd','spd'],['自大','spd','spe'],
  ['胆小','spe','atk'],['急躁','spe','def'],['爽朗','spe','spa'],['天真','spe','spd'],['认真','spe','spe'],
]

function getNatureModifier(nature, statKey) {
  if (!nature || !nature[1] || !nature[2]) return 1.0
  if (nature[1] === statKey) return 1.1
  if (nature[2] === statKey) return 0.9
  return 1.0
}

function randNature() {
  return ALL_NATURES[Math.floor(Math.random() * ALL_NATURES.length)]
}

function createInitialState() {
  return {
    view: 'start',
    player: {
      name: '小智', pokemon: [], pc: [],
      items: { pokeball: 10, potion: 5 },
      badge: 0, position: 'pallet', money: 500,
      seen: [], shinySeen: [], trainersDefeated: [],
      visited: [], shinyChain: 0, activeIndex: 0,
    },
    battle: null, bagView: 'use', pokedexDetail: null,
    storyFlags: {},
    quests: { current: 'choose_starter', completed: [] },
    showBigMap: false,
    pendingMoveLearn: null,
    pokemonManager: null,
    logs: ['欢迎来到宝可梦世界！'],
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.4,
    levelScaling: true, // 动态等级缩放开关（false 时恢复固定等级）
  }
}

let G = createInitialState()

function getShinyChance() {
  const base = 1 / 4096
  const bonus = G.player.shinyChain * base
  return Math.min(base + bonus, 0.25)
}

// 存档防抖：高频操作（移动/探索/购买）合并写入，避免每步全量 JSON.stringify 卡顿
// 关键节点（战斗结束/捕捉/进化等）调用 saveGame(true) 强制同步保存
let saveTimer = null
function writeSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)) }
  catch (e) { console.warn('存档失败:', e) }
}
function saveGame(force) {
  if (force) {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null }
    writeSave()
    return
  }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => { saveTimer = null; writeSave() }, 150)
}
// 页面关闭/刷新前强制落盘，防止防抖中的进度丢失
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('beforeunload', () => {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; writeSave() }
  })
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('pokemon_text_save_v2')
    if (raw) {
      G = JSON.parse(raw)
      if (!G.player.seen) G.player.seen = []
      if (!G.player.trainersDefeated) G.player.trainersDefeated = []
      if (!G.player.visited) G.player.visited = []
      if (!G.player.shinySeen) G.player.shinySeen = []
      if (G.player.shinyChain === undefined) G.player.shinyChain = 0
      if (G.player.activeIndex === undefined) G.player.activeIndex = 0
      if (!G.storyFlags) G.storyFlags = {}
      if (!G.quests) G.quests = { current: 'choose_starter', completed: [] }
      if (G.showBigMap === undefined) G.showBigMap = false
      if (G.pendingMoveLearn === undefined) G.pendingMoveLearn = null
      if (G.pokemonManager === undefined) G.pokemonManager = null
      if (G.soundEnabled === undefined) G.soundEnabled = true
      if (G.musicEnabled === undefined) G.musicEnabled = true
      if (G.volume === undefined) G.volume = 0.4
      if (G.levelScaling === undefined) G.levelScaling = true
      if (window.AU) {
        AU.setSoundOn(G.soundEnabled)
        AU.setMusicOn(G.musicEnabled)
        AU.setVolume(G.volume)
      }
      for (const p of [...G.player.pokemon, ...(G.player.pc||[])]) {
        if (!p.ivs) p.ivs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
        if (!p.evs) p.evs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
        if (!p.nature) p.nature = ['认真','spe','spe']
        if (!p.gender) p.gender = getGender(p.id)
        if (!p.ability) p.ability = getPokemonAbility(p.id)
        if (!p.moveList) { const b = getPokemonData(p.id); p.moveList = b ? b.moveList : null }
        if (p.status === undefined) p.status = null
        if (p.accuracy === undefined) p.accuracy = 100
        if (p.evasion === undefined) p.evasion = 100
        if (!p.relearnMoves) p.relearnMoves = []
        if (!p.tempDebuffs) p.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 }
        if (p.moves) for (const m of p.moves) {
          const md = getMoveData(m.id)
          if (md) {
            m.desc = md.desc || ''
            if (m.effect === undefined || m.effect === null) m.effect = md.effect || null
          }
        }
      }
      return true
    }
  } catch (e) { console.warn('读档失败:', e) }
  return false
}

function resetGame() {
  G = createInitialState()
  localStorage.removeItem(SAVE_KEY)
}

function addLog(msg) {
  G.logs.push(msg)
  if (G.logs.length > 100) G.logs.splice(0, 20)
  if (window.AU) AU.playByMessage(msg)
}

function getPokemonStats(id, level, ivs, evs, nature) {
  const base = getPokemonData(id)
  if (!base) return null
  const iv = ivs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
  const ev = evs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
  const { hp:bhp, atk:batk, def:bdef, spa:bspa, spd:bspd, spe:bspe } = base.stats
  const calcStat = (baseStat, ivVal, evVal, isHp) => {
    const s = Math.floor((2 * baseStat + ivVal + Math.floor(evVal / 4)) * level / 100)
    return isHp ? s + level + 10 : s + 5
  }
  const raw = {
    hp: calcStat(bhp, iv.hp, ev.hp, true), maxHp: calcStat(bhp, iv.hp, ev.hp, true),
    atk: calcStat(batk, iv.atk, ev.atk, false),
    def: calcStat(bdef, iv.def, ev.def, false),
    spa: calcStat(bspa, iv.spa, ev.spa, false),
    spd: calcStat(bspd, iv.spd, ev.spd, false),
    spe: calcStat(bspe, iv.spe, ev.spe, false),
  }
  // 性格修正（HP不受性格影响）
  if (nature) {
    for (const k of ['atk','def','spa','spd','spe']) {
      const mod = getNatureModifier(nature, k)
      if (mod !== 1.0) raw[k] = Math.floor(raw[k] * mod)
    }
  }
  return raw
}

function randIV() { return Math.floor(Math.random() * 32) }

// 解析技能学习表，返回当前等级可用的技能ID列表
// new format: [[moveId, learnLevel], ...] 或旧格式: [moveId, ...]
function getMovesForLevel(moveList, level) {
  if (!moveList || moveList.length === 0) return [1]
  // 检测新旧格式
  const isNewFormat = Array.isArray(moveList[0])
  if (isNewFormat) {
    // 先按等级排序（升序），然后取 ≤ 当前等级的所有招式，最后截取前 4 个
    const sorted = [...moveList].sort((a, b) => a[1] - b[1] || a[0] - b[0])
    const ids = []
    for (const [mid, lv] of sorted) {
      if (lv <= level) {
        if (!ids.includes(mid)) ids.push(mid)  // 去重
        if (ids.length >= 4) break
      }
    }
    return ids.length > 0 ? ids : [sorted[0][0]]
  } else {
    // 旧格式（纯moveId数组），不过滤
    return moveList
  }
}

// 检查宝可梦在某个等级是否有新技能可学
function getNewMovesAtLevel(moveList, currentLevel) {
  if (!moveList || moveList.length === 0) return []
  const isNewFormat = Array.isArray(moveList[0])
  if (!isNewFormat) return []
  const learnedIds = getMovesForLevel(moveList, currentLevel - 1)
  const newIds = getMovesForLevel(moveList, currentLevel)
  return newIds.filter(id => !learnedIds.includes(id))
}

function createPokemon(id, level, movesOverride) {
  const base = getPokemonData(id)
  if (!base) return null
  const types = base.types.split(',')
  const ivs = { hp:randIV(), atk:randIV(), def:randIV(), spa:randIV(), spd:randIV(), spe:randIV() }
  const evs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
  const nature = randNature()
  const gender = getGender(id)
  const ability = getPokemonAbility(id)
  const isShiny = Math.random() < (1 / 4096)
  const stats = getPokemonStats(id, level, ivs, evs, nature)
  const rawMoves = movesOverride || base.moveList || [1]
  const moveIds = getMovesForLevel(rawMoves, level)
  return {
    id, name: base.name, types, level, ...stats,
    moves: moveIds.map(mid => {
      const m = getMoveData(mid)
      return m ? { id:mid, name:m.name, type:m.type, power:m.power, pp:m.pp, currentPp:m.pp, desc:m.desc||'', effect:m.effect||null } : null
    }).filter(Boolean),
    relearnMoves: [],
    moveList: base.moveList || null, // 保存完整的技能学习表（含等级信息）
    exp: 0, nextLevel: Math.floor(level ** 3 * 0.8 + 10),
    ivs, evs, nature, gender, ability, isShiny, status: null, fainted: false,
    accuracy: 100, evasion: 100, tempDebuffs: { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 },
  }
}

function recalcStats(pokemon) {
  const ns = getPokemonStats(pokemon.id, pokemon.level, pokemon.ivs, pokemon.evs, pokemon.nature)
  if (ns) {
    pokemon.hp = Math.min(pokemon.hp, ns.maxHp)
    pokemon.maxHp = ns.maxHp
    pokemon.atk = ns.atk; pokemon.def = ns.def
    pokemon.spa = ns.spa; pokemon.spd = ns.spd; pokemon.spe = ns.spe
  }
}

function calcExpToLevel(level) { return Math.floor(level ** 3 * 0.8 + 10) }

// 根据宝可梦最高种族值自动分配 EV 产出
function getEVYield(id) {
  const base = getPokemonData(id)
  if (!base) return [0,0,0,0,0,0]
  if (id === 150 || id === 151) return [3,3,3,3,3,3] // 超梦/梦幻全+3
  const { hp, atk, def, spa, spd, spe } = base.stats
  const stats = [hp, atk, def, spa, spd, spe]
  const max = Math.max(...stats)
  const yields = [0,0,0,0,0,0]
  for (let i = 0; i < 6; i++) {
    if (stats[i] === max) yields[i] = base.evo ? 1 : 2
  }
  return yields
}

function addEV(pokemon, yields) {
  const names = ['hp','atk','def','spa','spd','spe']
  let added = false
  for (let i = 0; i < 6; i++) {
    if (yields[i] > 0) {
      const key = names[i]
      const totalEvs = Object.values(pokemon.evs).reduce((a,b) => a + b, 0)
      // 先检查是否会超出总上限，再添加
      if (totalEvs + yields[i] > 510) break // 总努力值上限 510
      const old = pokemon.evs[key]
      pokemon.evs[key] = Math.min(255, pokemon.evs[key] + yields[i]) // 单项上限 255
      if (pokemon.evs[key] !== old) added = true
    }
  }
  if (added) recalcStats(pokemon)
  return added
}

function addExp(pokemon, exp) {
  pokemon.exp += exp
  let evolved = false
  while (pokemon.exp >= pokemon.nextLevel) {
    pokemon.exp -= pokemon.nextLevel
    pokemon.level++
    recalcStats(pokemon)
    pokemon.hp = Math.min(pokemon.hp + Math.floor(pokemon.maxHp / 6), pokemon.maxHp)
    pokemon.nextLevel = calcExpToLevel(pokemon.level)
    addLog(`${pokemon.name} 升到了 Lv.${pokemon.level}！`)
    if (window.AU) AU.sfx('levelUp')
    if (window.FX) {
      const el = document.querySelector('.sprite-container.player')
      if (el) {
        el.classList.add('fx-levelup')
        FX.flash('#FFD700', 300)
        setTimeout(() => el.classList.remove('fx-levelup'), 1000)
      }
    }

    // 检查是否有新技能可学
    if (pokemon.moveList) {
      const newMoveIds = getNewMovesAtLevel(pokemon.moveList, pokemon.level)
      for (const mid of newMoveIds) {
        const mData = getMoveData(mid)
        if (!mData) continue
        // 存储待学习技能，UI 会在适当时机弹出
        G.pendingMoveLearn = G.pendingMoveLearn || []
        G.pendingMoveLearn.push({
          pokemonIndex: G.player.pokemon.indexOf(pokemon),
          moveId: mid,
          moveName: mData.name,
        })
        addLog(`${pokemon.name} 想要学习新技能「${mData.name}」！`)
      }
    }

    // 进化检测
    const base = getPokemonData(pokemon.id)
    if (base && base.evo && pokemon.level >= base.evo[0]) {
      const evoTo = base.evo[1]; const evoData = getPokemonData(evoTo)
      if (evoData) {
        addLog(`咦？${pokemon.name} 开始发光了！`)
        // 进化动画触发（UI 层监听此标记）
        G.evolutionPending = { fromId: pokemon.id, toId: evoData.id, fromName: pokemon.name, toName: evoData.name }
        if (window.AU) AU.sfx('evolve')
        if (window.FX) {
          const el = document.querySelector('.sprite-container.player') || document.querySelector('.sprite-container')
          if (el) {
            el.classList.add('fx-evolving')
            setTimeout(() => el.classList.remove('fx-evolving'), 2000)
          }
        }
        const oldMoves = [...(pokemon.moves || [])]
        const oldMoveIds = new Set(oldMoves.map(m => m.id))
        pokemon.id = evoData.id; pokemon.name = evoData.name; pokemon.types = evoData.types.split(',')
        pokemon.moveList = evoData.moveList || null
        // 保留原有招式，不覆盖
        pokemon.moves = oldMoves
        // 检查进化形态在当前等级可学的新招式，触发待学习
        if (evoData.moveList) {
          const newMoveIds = getNewMovesAtLevel(evoData.moveList, pokemon.level)
          for (const mid of newMoveIds) {
            if (oldMoveIds.has(mid)) continue
            const mData = getMoveData(mid)
            if (!mData) continue
            G.pendingMoveLearn = G.pendingMoveLearn || []
            G.pendingMoveLearn.push({
              pokemonIndex: G.player.pokemon.indexOf(pokemon),
              moveId: mid,
              moveName: mData.name,
            })
            addLog(`${pokemon.name} 想要学习新技能「${mData.name}」！`)
          }
        }
        recalcStats(pokemon)
        addLog(`★ ${pokemon.name} 进化了！`); evolved = true
        setTimeout(() => { G.evolutionPending = null }, 2500)
      }
    }
  }
  return evolved
}

function isPokemonUsable(p) { return p && !p.fainted && p.hp > 0 }
function allFainted() { return G.player.pokemon.every(p => p.fainted || p.hp <= 0) }
function getActivePokemon() {
  const team = G.player.pokemon || []
  // 优先使用 activeIndex 指向的宝可梦（如果它还能战斗）
  const ai = G.player.activeIndex
  if (ai != null && team[ai] && isPokemonUsable(team[ai])) return team[ai]
  // 否则回退到第一个可用的，并更新 activeIndex
  const first = team.find(p => isPokemonUsable(p))
  if (first) {
    G.player.activeIndex = team.indexOf(first)
    return first
  }
  return undefined
}
function setActivePokemon(index) {
  const team = G.player.pokemon || []
  if (index < 0 || index >= team.length) return false
  if (!isPokemonUsable(team[index])) return false
  G.player.activeIndex = index
  return true
}

function healAll() {
  for (const p of G.player.pokemon) {
    p.hp = p.maxHp; p.fainted = false; p.status = null
    if (p.ability) p.ability.activated = false
    if (p.ability && p.ability.key === 'naturalCure') p.status = null
    if (p.tempDebuffs) p.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 }
    for (const m of p.moves) m.currentPp = m.pp
  }
}

function trackSeen(id) { if (!G.player.seen.includes(id)) G.player.seen.push(id) }
function getBadgeCount() { return G.player.badge }
function setBadge(n) { G.player.badge = Math.max(G.player.badge, n) }
function addMoney(n) { G.player.money += n }
