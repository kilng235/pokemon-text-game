const SAVE_KEY = 'pokemon_text_save_v3'

function createInitialState() {
  return {
    view: 'start',
    player: {
      name: '小智', pokemon: [], pc: [],
      items: { pokeball: 10, potion: 5 },
      badge: 0, position: 'pallet', money: 500,
      seen: [], trainersDefeated: [],
    },
    battle: null, bagView: 'use', pokedexDetail: null,
    storyFlags: {},
    quests: { current: 'choose_starter', completed: [] },
    logs: ['欢迎来到宝可梦世界！'],
  }
}

let G = createInitialState()

function saveGame() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)) }
  catch (e) { console.warn('存档失败:', e) }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('pokemon_text_save_v2')
    if (raw) {
      G = JSON.parse(raw)
      if (!G.player.seen) G.player.seen = []
      if (!G.player.trainersDefeated) G.player.trainersDefeated = []
      if (!G.storyFlags) G.storyFlags = {}
      if (!G.quests) G.quests = { current: 'choose_starter', completed: [] }
      for (const p of [...G.player.pokemon, ...(G.player.pc||[])]) {
        if (!p.ivs) p.ivs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
        if (!p.evs) p.evs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
        if (p.status === undefined) p.status = null
        if (p.moves) for (const m of p.moves) {
          if (m.effect === undefined) { const md = getMoveData(m.id); m.effect = md ? (md[6] || null) : null }
          if (m.desc === undefined) { const md = getMoveData(m.id); m.desc = md ? (md[5] || '') : '' }
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
}

function getPokemonStats(id, level, ivs, evs) {
  const base = getPokemonData(id)
  if (!base) return null
  const iv = ivs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
  const ev = evs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
  const [,,,bhp,batk,bdef,bspa,bspd,bspe] = base
  const calc = (baseStat, ivVal, evVal, isHp) => {
    const s = Math.floor((2 * baseStat + ivVal + Math.floor(Math.sqrt(evVal) / 4)) * level / 100)
    return isHp ? s + level + 10 : s + 5
  }
  return {
    hp: calc(bhp, iv.hp, ev.hp, true), maxHp: calc(bhp, iv.hp, ev.hp, true),
    atk: calc(batk, iv.atk, ev.atk, false),
    def: calc(bdef, iv.def, ev.def, false),
    spa: calc(bspa, iv.spa, ev.spa, false),
    spd: calc(bspd, iv.spd, ev.spd, false),
    spe: calc(bspe, iv.spe, ev.spe, false),
  }
}

function randIV() { return Math.floor(Math.random() * 16) }

function createPokemon(id, level, movesOverride) {
  const base = getPokemonData(id)
  if (!base) return null
  const types = base[2].split(',')
  const ivs = { hp:randIV(), atk:randIV(), def:randIV(), spa:randIV(), spd:randIV(), spe:randIV() }
  const evs = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }
  const stats = getPokemonStats(id, level, ivs, evs)
  const moveIds = movesOverride || base[12] || [1]
  return {
    id, name: base[1], types, level, ...stats,
    moves: moveIds.map(mid => {
      const m = getMoveData(mid)
      return m ? { id:mid, name:m[1], type:m[2], power:m[3], pp:m[4], currentPp:m[4], desc:m[5]||'', effect:m[6]||null } : null
    }).filter(Boolean),
    exp: 0, nextLevel: Math.floor(level ** 3 * 0.8 + 10),
    ivs, evs, status: null, fainted: false,
  }
}

function recalcStats(pokemon) {
  const ns = getPokemonStats(pokemon.id, pokemon.level, pokemon.ivs, pokemon.evs)
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
  const stats = [base[3],base[4],base[5],base[6],base[7],base[8]]
  const max = Math.max(...stats)
  const yields = [0,0,0,0,0,0]
  for (let i = 0; i < 6; i++) {
    if (stats[i] === max) yields[i] = base[11] ? 1 : 2
  }
  return yields
}

function addEV(pokemon, yields) {
  const names = ['hp','atk','def','spa','spd','spe']
  let added = false
  for (let i = 0; i < 6; i++) {
    if (yields[i] > 0) {
      const key = names[i]
      const old = pokemon.evs[key]
      pokemon.evs[key] = Math.min(65535, (pokemon.evs[key] || 0) + yields[i])
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
    const base = getPokemonData(pokemon.id)
    if (base && base[11] && pokemon.level >= base[11][0]) {
      const evoTo = base[11][1]; const evoData = getPokemonData(evoTo)
      if (evoData) {
        addLog(`咦？${pokemon.name} 开始发光了！`)
        pokemon.id = evoData[0]; pokemon.name = evoData[1]; pokemon.types = evoData[2].split(',')
        pokemon.moves = (evoData[12] || [1]).map(mid => {
          const m = getMoveData(mid)
          return m ? { id:mid, name:m[1], type:m[2], power:m[3], pp:m[4], currentPp:m[4] } : null
        }).filter(Boolean)
        recalcStats(pokemon)
        addLog(`★ ${pokemon.name} 进化了！`); evolved = true
      }
    }
  }
  return evolved
}

function isPokemonUsable(p) { return p && !p.fainted && p.hp > 0 }
function allFainted() { return G.player.pokemon.every(p => p.fainted || p.hp <= 0) }
function getActivePokemon() { return G.player.pokemon.find(p => isPokemonUsable(p)) }

function healAll() {
  for (const p of G.player.pokemon) {
    p.hp = p.maxHp; p.fainted = false; p.status = null
    for (const m of p.moves) m.currentPp = m.pp
  }
}

function trackSeen(id) { if (!G.player.seen.includes(id)) G.player.seen.push(id) }
function getBadgeCount() { return G.player.badge }
function setBadge(n) { G.player.badge = Math.max(G.player.badge, n) }
function addMoney(n) { G.player.money += n }
