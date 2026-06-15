function startNewGame() {
  resetGame()
  G.view = 'choose'; saveGame(); render()
}

function continueGame() {
  if (loadGame()) { G.view = G.battle ? 'battle' : 'explore'; render() }
  else { addLog('没有找到存档。'); render() }
}

function selectStarter(id) {
  G.player.pokemon = [createPokemon(id, 5)]
  G.player.items = { pokeball:10, potion:5, superball:3 }
  trackSeen(id)
  const name = getPokemonData(id)[1]
  addLog(`你选择了 ${name}！`); addLog('冒险正式开始！')
  G.view = 'explore'; saveGame(); render()
}

function travelTo(key) {
  const loc = getLocation(key)
  if (!loc) { addLog('无法到达那里。'); render(); return }
  G.player.position = key
  G.view = 'explore'; saveGame(); render()
  // 自动遇敌（非城镇）
  if (loc[2] !== 'town') {
    setTimeout(() => tryWildEncounter(true), 200)
  }
}

function challengeGym(leaderId) {
  const townMap = { brock:'pewter', misty:'cerulean', ltSurge:'vermilion', erika:'celadon', sabrina:'saffron', koga:'fuchsia', blaine:'cinnabar', giovanni:'viridian' }
  const townKey = townMap[leaderId] || 'pewter'
  // 检查是否有前序剧情要求
  if (leaderId === 'giovanni' && !G.storyFlags.silphDone) {
    addLog('金黄市的希鲁夫公司似乎出事了，先去看看那边吧。')
    render(); return
  }
  if (leaderId === 'sabrina' && !G.storyFlags.lavenderDone) {
    addLog('紫苑镇的宝可梦之塔似乎有些异常……先去紫苑镇看看吧。')
    render(); return
  }
  if (startGymBattle(leaderId, townKey)) {
    G.view = 'battle'; render()
  } else {
    addLog('暂时无法挑战。')
    render()
  }
}

function tryWildEncounter(fromTravel) {
  const loc = getLocation(G.player.position)
  if (!loc || loc[2] === 'town') return
  // 先检查剧情触发
  const storyKey = checkStoryTrigger(G.player.position)
  if (storyKey) {
    const ev = STORY_EVENTS[storyKey]
    G.dialogue = { eventKey: storyKey, lines: ev.dialogue, index: 0, battle: ev.battle !== null, canSkip: false }
    G.view = 'dialogue'; render(); return
  }
  // 检查是否有未击败的训练家
  const trainers = getTrainersForArea(G.player.position)
  const undefeated = trainers.filter(t => !G.player.trainersDefeated.includes(t.id))
  if (undefeated.length > 0 && Math.random() < 0.5) {
    const t = undefeated[Math.floor(Math.random() * undefeated.length)]
    if (startTrainerBattle(t)) { G.view = 'battle'; render(); return }
  }
  if (!loc[6]) { addLog('这里什么都没有。'); saveGame(); render(); return }
  const roll = Math.random()
  if (roll < 0.35) {
    if (startWildBattle()) { G.view = 'battle'; render() }
  } else {
    addLog('草丛中静悄悄的……'); G.player.steps = (G.player.steps || 0) + 1
    saveGame(); render()
  }
}

function startDialogueBattle() {
  const d = G.dialogue; if (!d) return
  G.dialogue = null
  if (startStoryBattle(d.eventKey)) { G.view = 'battle'; render() }
  else { G.view = 'explore'; render() }
}

function advanceDialogue() {
  if (!G.dialogue) return
  G.dialogue.index++
  if (G.dialogue.index >= G.dialogue.lines.length && !G.dialogue.battle) {
    finishDialogue(); return
  }
  render()
}

function skipDialogue() {
  if (!G.dialogue) return
  G.dialogue.index = G.dialogue.lines.length - 1
  render()
}

function finishDialogue() {
  const d = G.dialogue
  if (d && d.battle) {
    startDialogueBattle(); return
  }
  G.dialogue = null; saveGame()
  G.view = 'explore'; render()
}

function battleSub(state) {
  if (G.battle) { G.battle.subState = state; render() }
}

function useItemInBattle(key) { useItem(key); render() }
function useItemFromBag(key) { useItem(key); render() }

function switchPokemon(index) {
  const p = G.player.pokemon[index]
  if (!p || p.fainted || p.hp <= 0 || p === getActivePokemon()) return
  addLog(`回来吧！${getActivePokemon()?.name||'---'}！`); addLog(`上吧！${p.name}！`)
  if (G.battle) { G.battle.turn = 'enemy'; G.battle.subState = 'main'; setTimeout(enemyTurn,500) }
  render()
}

function closeBag() {
  if (G.battle) { G.view = 'battle'; if (G.battle) G.battle.subState = 'main' }
  else G.view = 'explore'
  render()
}

function healAtCenter() {
  healAll(); addLog('宝可梦们恢复了活力！'); saveGame(); render()
}

function buyItem(key) {
  const item = ITEMS[key]; if (!item) return
  if (G.player.money < item.price) { addLog('余额不足！'); render(); return }
  G.player.money -= item.price
  G.player.items[key] = (G.player.items[key] || 0) + 1
  addLog(`购买了 ${item.name}！`); saveGame(); render()
}

// 暴露到全局（用于内联 onclick）
const globalFns = [startNewGame, continueGame, selectStarter, travelTo, challengeGym,
  tryWildEncounter, battleSub, playerAttack, tryFlee, enemyTurn,
  useItemInBattle, useItemFromBag, switchPokemon, closeBag, healAtCenter, buyItem,
  advanceDialogue, skipDialogue, finishDialogue, startDialogueBattle]
for (const fn of globalFns) window[fn.name] = fn

document.addEventListener('DOMContentLoaded', () => {
  if (loadGame()) {
    G.view = G.battle ? 'battle' : 'explore'
    if (G.player.position === 'town') G.player.position = 'pallet'
  }
  render()
})
