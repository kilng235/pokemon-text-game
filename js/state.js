const SAVE_KEY = 'pokemon_text_save_v2'

function createInitialState() {
  return {
    view: 'start',
    player: {
      name: '小智',
      pokemon: [],
      pc: [],
      items: { pokeball: 10, potion: 5 },
      badge: 0,
      position: 'pallet',
      money: 500,
      seen: [],
      trainersDefeated: [],
    },
    battle: null,
    bagView: 'use',
    pokedexDetail: null,
    storyFlags: {},
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
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) {
      G = JSON.parse(raw)
      if (!G.player.seen) G.player.seen = []
      if (!G.player.trainersDefeated) G.player.trainersDefeated = []
      if (!G.storyFlags) G.storyFlags = {}
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

function getPokemonStats(id, level) {
  const base = getPokemonData(id)
  if (!base) return null
  const [,,,,hp,atk,def,spa,spd,spe] = base
  const HP = Math.floor((hp * 2 + 15) * level / 100 + level + 10)
  const Atk = Math.floor((atk * 2 + 10) * level / 100 + 5)
  const Def = Math.floor((def * 2 + 10) * level / 100 + 5)
  const Spa = Math.floor((spa * 2 + 10) * level / 100 + 5)
  const Spd = Math.floor((spd * 2 + 10) * level / 100 + 5)
  const Spe = Math.floor((spe * 2 + 10) * level / 100 + 5)
  return { hp:HP, maxHp:HP, atk:Atk, def:Def, spa:Spa, spd:Spd, spe:Spe }
}

function createPokemon(id, level) {
  const base = getPokemonData(id)
  if (!base) return null
  const [_, name, typesStr] = base
  const types = typesStr.split(',')
  const stats = getPokemonStats(id, level)
  const moveIds = base[11] || [1]
  return {
    id, name, types, level,
    ...stats,
    moves: moveIds.map(mid => {
      const m = getMoveData(mid)
      return m ? { ...{id:mid, name:m[1], type:m[2], power:m[3], pp:m[4], currentPp:m[4]} } : null
    }).filter(Boolean),
    exp: 0,
    nextLevel: Math.floor(level ** 3 * 0.8 + 10),
    status: null, fainted: false,
  }
}

function calcExpToLevel(level) { return Math.floor(level ** 3 * 0.8 + 10) }

function addExp(pokemon, exp) {
  pokemon.exp += exp
  let evolved = false
  while (pokemon.exp >= pokemon.nextLevel) {
    pokemon.exp -= pokemon.nextLevel
    pokemon.level++
    const news = getPokemonStats(pokemon.id, pokemon.level)
    for (const k of ['hp','maxHp','atk','def','spa','spd','spe']) pokemon[k] = news[k]
    pokemon.hp = Math.min(pokemon.hp + Math.floor(news.maxHp / 6), news.maxHp)
    pokemon.nextLevel = calcExpToLevel(pokemon.level)
    addLog(`${pokemon.name} 升到了 Lv.${pokemon.level}！`)
    const base = getPokemonData(pokemon.id)
    if (base && base[10] && pokemon.level >= base[10][0]) {
      const evoTo = base[10][1]
      const evoData = getPokemonData(evoTo)
      if (evoData) {
        addLog(`咦？${pokemon.name} 开始发光了！`)
        pokemon.id = evoData[0]; pokemon.name = evoData[1]; pokemon.types = evoData[2].split(',')
        const newMoves = (evoData[11] || [1])
        pokemon.moves = newMoves.map(mid => {
          const m = getMoveData(mid)
          return m ? { id:mid, name:m[1], type:m[2], power:m[3], pp:m[4], currentPp:m[4] } : null
        }).filter(Boolean)
        const ns = getPokemonStats(pokemon.id, pokemon.level)
        for (const k of ['hp','maxHp','atk','def','spa','spd','spe']) pokemon[k] = ns[k]
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

function trackSeen(id) {
  if (!G.player.seen.includes(id)) G.player.seen.push(id)
}

function getBadgeCount() { return G.player.badge }
function setBadge(n) { G.player.badge = Math.max(G.player.badge, n) }
function addMoney(n) { G.player.money += n }
