function startNewGame() {
  resetGame()
  G.view = 'choose'
  saveGame()
  render()
}

function continueGame() {
  if (loadGame()) {
    G.view = G.battle ? 'battle' : 'explore'
    render()
  } else {
    addLog('没有找到存档。')
    render()
  }
}

function selectStarter(id) {
  G.player.pokemon = [createPokemon(id, 5)]
  G.player.items = { pokeball: 10, potion: 5, superball: 3 }
  addLog(`你选择了 ${POKEMON_DATA.find(p => p.id === id).name}！`)
  addLog('冒险正式开始！')
  G.view = 'explore'
  saveGame()
  render()
}

function travelTo(key) {
  if (key === 'gym1' && G.player.badge >= 1) {
    addLog('你已经打败过小霞了！')
    render()
    return
  }
  if (key === 'gym2' && G.player.badge < 1) {
    addLog('你需要先获得1枚徽章才能挑战小刚！')
    render()
    return
  }
  G.player.position = key
  if (key === 'grass') {
    G.view = 'explore'
    render()
    tryWildEncounter()
  } else if (key === 'gym1' || key === 'gym2') {
    G.view = 'explore'
    render()
    if (startGymBattle(key)) {
      G.view = 'battle'
      render()
    }
  } else if (key === 'center') {
    G.view = 'center'
    render()
  } else if (key === 'shop') {
    G.view = 'shop'
    render()
  } else {
    G.view = 'explore'
    saveGame()
    render()
  }
}

function tryWildEncounter() {
  const roll = Math.random()
  if (roll < 0.35) {
    setTimeout(() => {
      if (startWildBattle()) {
        G.view = 'battle'
        render()
      } else {
        addLog('没有能战斗的宝可梦，先回复一下吧！')
        G.player.position = 'center'
        G.view = 'center'
        render()
      }
    }, 200)
  } else {
    addLog('草丛中静悄悄的……')
    G.player.steps++
    saveGame()
    render()
  }
}

function battleSub(state) {
  if (G.battle) {
    G.battle.subState = state
    render()
  }
}

function useItemInBattle(key) {
  useItem(key)
  render()
}

function useItemFromBag(key) {
  useItem(key)
  render()
}

function switchPokemon(index) {
  const p = G.player.pokemon[index]
  if (!p || p.fainted || p.hp <= 0) return
  if (p === getActivePokemon()) return
  addLog(`回来吧！ ${getActivePokemon()?.name || '---'}！`)
  addLog(`上吧！ ${p.name}！`)
  if (G.battle) {
    G.battle.turn = 'enemy'
    G.battle.subState = 'main'
    setTimeout(enemyTurn, 600)
  }
  render()
}

function closeBag() {
  if (G.battle) {
    G.view = 'battle'
    if (G.battle) G.battle.subState = 'main'
  } else {
    G.view = 'explore'
  }
  render()
}

function healAtCenter() {
  healAll()
  addLog('宝可梦们恢复了活力！')
  saveGame()
  render()
}

function buyItem(key) {
  const item = ITEMS[key]
  if (!item) return
  if (G.player.money < item.price) {
    addLog('余额不足！')
    render()
    return
  }
  G.player.money -= item.price
  G.player.items[key] = (G.player.items[key] || 0) + 1
  addLog(`购买了 ${item.name}！`)
  saveGame()
  render()
}

window.startNewGame = startNewGame
window.continueGame = continueGame
window.selectStarter = selectStarter
window.travelTo = travelTo
window.battleSub = battleSub
window.playerAttack = playerAttack
window.tryFlee = tryFlee
window.tryWildEncounter = tryWildEncounter
window.useItemInBattle = useItemInBattle
window.useItemFromBag = useItemFromBag
window.switchPokemon = switchPokemon
window.closeBag = closeBag
window.healAtCenter = healAtCenter
window.buyItem = buyItem

document.addEventListener('DOMContentLoaded', () => {
  if (loadGame()) {
    G.view = G.battle ? 'battle' : 'explore'
  }
  render()
})
