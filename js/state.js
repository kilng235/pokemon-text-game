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
      steps: 0,
      money: 500,
    },
    battle: null,
    bagView: 'use',
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

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) {
      G = JSON.parse(raw)
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

function getPokemonStats(id, level) {
  const base = POKEMON_DATA.find(p => p.id === id)
  if (!base) return null
  const hp = Math.floor((base.stats.hp * 2 + 15) * level / 100 + level + 10)
  const atk = Math.floor((base.stats.atk * 2 + 10) * level / 100 + 5)
  const def = Math.floor((base.stats.def * 2 + 10) * level / 100 + 5)
  const spa = Math.floor((base.stats.spa * 2 + 10) * level / 100 + 5)
  const spd = Math.floor((base.stats.spd * 2 + 10) * level / 100 + 5)
  const spe = Math.floor((base.stats.spe * 2 + 10) * level / 100 + 5)
  return { hp, maxHp: hp, atk, def, spa, spd, spe }
}

function createPokemon(id, level) {
  const base = POKEMON_DATA.find(p => p.id === id)
  if (!base) return null
  const stats = getPokemonStats(id, level)
  return {
    id,
    name: base.name,
    types: [...base.types],
    level,
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

function addExp(pokemon, exp) {
  pokemon.exp += exp
  let evolved = false
  while (pokemon.exp >= pokemon.nextLevel) {
    pokemon.exp -= pokemon.nextLevel
    pokemon.level++
    const news = getPokemonStats(pokemon.id, pokemon.level)
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
        const newStats = getPokemonStats(pokemon.id, pokemon.level)
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
