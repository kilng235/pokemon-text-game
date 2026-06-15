const SAVE_KEY = 'pokemon_text_save'

function createInitialState() {
  return {
    view: 'start',
    player: {
      name: '小智',
      pokemon: [],
      pc: [],
      items: { pokeball: 5, potion: 2 },
      badge: 0,
      position: 'town',
      seen: [],
      steps: 0,
      money: 500,
    },
    battle: null,
    bagView: 'use',
    pokedexDetail: null,
    logs: ['欢迎来到宝可梦世界！'],
  }
}

let G = createInitialState()

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(G))
  } catch (e) {
    console.warn('存档失败:', e)
  }
}

function migratePokemon(p) {
  if (!p.ivs) p.ivs = { hp: 15, atk: 15, def: 15, spa: 15, spd: 15, spe: 15 }
  if (!p.evs) p.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
  return p
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) {
      G = JSON.parse(raw)
      if (!G.player.seen) G.player.seen = []
      for (const p of G.player.pokemon) migratePokemon(p)
      for (const p of G.player.pc) migratePokemon(p)
      return true
    }
  } catch (e) {
    console.warn('读档失败:', e)
  }
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

function randIV() {
  return Math.floor(Math.random() * 32)
}

function getPokemonStats(id, level, ivs, evs) {
  const base = POKEMON_DATA.find(p => p.id === id)
  if (!base) return null
  const iv = ivs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
  const ev = evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
  const calc = (baseStat, ivVal, evVal, isHp) => {
    const stat = Math.floor((2 * baseStat + ivVal + Math.floor(evVal / 4)) * level / 100)
    return isHp ? stat + level + 10 : stat + 5
  }
  const hp = calc(base.stats.hp, iv.hp, ev.hp, true)
  const atk = calc(base.stats.atk, iv.atk, ev.atk, false)
  const def = calc(base.stats.def, iv.def, ev.def, false)
  const spa = calc(base.stats.spa, iv.spa, ev.spa, false)
  const spd = calc(base.stats.spd, iv.spd, ev.spd, false)
  const spe = calc(base.stats.spe, iv.spe, ev.spe, false)
  return { hp, maxHp: hp, atk, def, spa, spd, spe }
}

function createPokemon(id, level) {
  const base = POKEMON_DATA.find(p => p.id === id)
  if (!base) return null
  const ivs = { hp: randIV(), atk: randIV(), def: randIV(), spa: randIV(), spd: randIV(), spe: randIV() }
  const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
  const stats = getPokemonStats(id, level, ivs, evs)
  return {
    id,
    name: base.name,
    types: [...base.types],
    level,
    ivs,
    evs,
    ...stats,
    moves: base.moves.map(mid => ({ ...MOVES.find(m => m.id === mid), currentPp: MOVES.find(m => m.id === mid).pp })),
    exp: 0,
    nextLevel: Math.floor(level ** 3 * 0.8 + 10),
    status: null,
    fainted: false,
  }
}

function calcExpToLevel(level) {
  return Math.floor(level ** 3 * 0.8 + 10)
}

const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']

function addExp(pokemon, exp) {
  pokemon.exp += exp
  let evolved = false
  while (pokemon.exp >= pokemon.nextLevel) {
    pokemon.exp -= pokemon.nextLevel
    pokemon.level++
    const news = getPokemonStats(pokemon.id, pokemon.level, pokemon.ivs, pokemon.evs)
    pokemon.maxHp = news.hp
    pokemon.hp = Math.min(pokemon.hp + Math.floor(news.hp / 6), news.hp)
    pokemon.atk = news.atk
    pokemon.def = news.def
    pokemon.spa = news.spa
    pokemon.spd = news.spd
    pokemon.spe = news.spe
    pokemon.nextLevel = calcExpToLevel(pokemon.level)
    addLog(`${pokemon.name} 升到了 Lv.${pokemon.level}！`)
    const base = POKEMON_DATA.find(p => p.id === pokemon.id)
    if (base && base.evo && pokemon.level >= base.evo.level) {
      const evoData = POKEMON_DATA.find(p => p.id === base.evo.to)
      if (evoData) {
        addLog(`咦？${pokemon.name} 开始发光了！`)
        pokemon.id = evoData.id
        pokemon.name = evoData.name
        pokemon.types = [...evoData.types]
        pokemon.moves = evoData.moves.map(mid => ({ ...MOVES.find(m => m.id === mid), currentPp: MOVES.find(m => m.id === mid).pp }))
        const newStats = getPokemonStats(pokemon.id, pokemon.level, pokemon.ivs, pokemon.evs)
        pokemon.maxHp = newStats.hp
        pokemon.hp = newStats.hp
        pokemon.atk = newStats.atk
        pokemon.def = newStats.def
        pokemon.spa = newStats.spa
        pokemon.spd = newStats.spd
        pokemon.spe = newStats.spe
        addLog(`★ ${pokemon.name} 进化了！`)
        evolved = true
      }
    }
  }
  return evolved
}

function addEvs(pokemon, evYield) {
  let total = 0
  for (const k of STAT_KEYS) total += pokemon.evs[k]
  let changed = false
  for (const [stat, val] of Object.entries(evYield)) {
    if (total >= 510) break
    const add = Math.min(val, 510 - total, 252 - pokemon.evs[stat])
    if (add > 0) changed = true
    pokemon.evs[stat] += add
    total += add
  }
  if (changed) recalcStats(pokemon)
}

function recalcStats(pokemon) {
  const s = getPokemonStats(pokemon.id, pokemon.level, pokemon.ivs, pokemon.evs)
  if (!s) return
  pokemon.maxHp = s.hp
  pokemon.hp = Math.min(pokemon.hp, s.hp)
  pokemon.atk = s.atk
  pokemon.def = s.def
  pokemon.spa = s.spa
  pokemon.spd = s.spd
  pokemon.spe = s.spe
}

function isPokemonUsable(p) {
  return p && !p.fainted && p.hp > 0
}

function allFainted() {
  return G.player.pokemon.every(p => p.fainted || p.hp <= 0)
}

function getActivePokemon() {
  return G.player.pokemon.find(p => isPokemonUsable(p))
}

function healAll() {
  for (const p of G.player.pokemon) {
    p.hp = p.maxHp
    p.fainted = false
    p.status = null
    for (const m of p.moves) {
      m.currentPp = m.pp
    }
  }
}
