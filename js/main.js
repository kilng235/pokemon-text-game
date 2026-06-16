function startNewGame() {
  resetGame()
  initQuests()
  G.dialogue = {
    lines: [
      { speaker: '', text: '你走进了大木博士的研究所……' },
      { speaker: '大木博士', text: '哦！你来了！我等你好久了！' },
      { speaker: '大木博士', text: '我叫大木，是研究宝可梦的专家。' },
      { speaker: '大木博士', text: '这个世界生活着各种各样的宝可梦，人们和它们一起生活、对战。' },
      { speaker: '大木博士', text: '你也要成为一名训练家，开始冒险了吧？' },
      { speaker: '大木博士', text: '我这里有三只宝可梦，选一只做你的搭档吧！' },
    ],
    index: 0, battle: false, canSkip: true,
    onComplete: 'starter',
  }
  G.view = 'dialogue'; render()
}

function continueGame() {
  if (loadGame()) {
    initQuests(); updateQuest()
    G.view = G.battle ? 'battle' : 'explore'; render()
  } else { addLog('没有找到存档。'); render() }
}

function selectStarter(id) {
  const pkm = createPokemon(id, 5)
  G.player.pokemon = [pkm]
  G.player.items = { pokeball:10, potion:5, superball:3 }
  trackSeen(id)
  addLog(`你选择了 ${pkm.name}！`)
  updateQuest()
  G.dialogue = {
    lines: [
      { speaker: '', text: '这时一个人冲了进来！' },
      { speaker: '小茂', text: '爷爷！！你也给我一只宝可梦！！' },
      { speaker: '大木博士', text: '哎呀……小茂你来晚了。最后一只是这位少年的了。' },
      { speaker: '小茂', text: '什么？！居然给了你？！' },
      { speaker: '小茂', text: '哼！我可是大木博士的孙子！' },
      { speaker: '小茂', text: '我要让你看看谁更强！！上吧！' },
    ],
    index: 0, battle: true, canSkip: true,
    eventKey: 'firstRival',
  }
  G.view = 'dialogue'; render()
}

function travelTo(key) {
  const loc = getLocation(key)
  if (!loc) { addLog('无法到达那里。'); render(); return }
  if (key === 'ssAnne' && (!G.player.items.sailTicket || G.player.items.sailTicket <= 0)) {
    addLog('港口的工作人员拦住了你："没有船票不能登船。"')
    render(); return
  }
  if (key === 'ceruleanCave' && G.player.badge < 8) {
    addLog('洞穴入口被强大的封印挡住了……需要集齐所有徽章才能进入。')
    render(); return
  }
  G.player.position = key
  updateQuest()
  // 城镇剧情触发
  if (loc[2] === 'town') {
    const storyKey = checkStoryTrigger(key)
    if (storyKey) {
      const ev = STORY_EVENTS[storyKey]
      G.dialogue = { eventKey: storyKey, lines: ev.dialogue, index: 0, battle: ev.battle !== null, canSkip: false }
      G.view = 'dialogue'; render(); return
    }
  }
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
  if (d.eventKey === 'eliteFour') {
    if (startEliteFour(0)) { G.view = 'battle'; render() }
    else { G.view = 'explore'; render() }
    return
  }
  if (d.eventKey === 'firstRival') {
    G.storyFlags.firstRivalDone = true
    if (startBattle('rival', {
      name: '小茂',
      onFinish: () => '首次击败小茂！获得 ¥200',
    }, [createPokemon(133, 5, [1, 2, 77, 75])])) {
      G.view = 'battle'; render()
    } else {
      G.view = 'explore'; render()
    }
    return
  }
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
  const onComplete = d ? d.onComplete : null
  G.dialogue = null
  if (onComplete === 'starter') {
    G.view = 'choose'; saveGame(); render(); return
  }
  saveGame()
  G.view = 'explore'; render()
}

function battleSub(state, moveIndex) {
  if (!G.battle) return
  G.battle.subState = state
  G.battle.selectedMove = moveIndex !== undefined ? moveIndex : undefined
  render()
}

function confirmMove() {
  const b = G.battle
  if (!b || b.selectedMove === undefined) return
  const idx = b.selectedMove
  b.selectedMove = undefined
  b.subState = 'main'

  const pkm = getActivePokemon()
  if (!pkm || !b.enemy) { render(); return }

  // Check player status first
  if (pkm.status && checkStatusSkip(pkm)) {
    b.turn = 'enemy'; setTimeout(enemyTurn, 500); render(); return
  }

  // Speed-based turn order
  const pSpe = pkm.spe + (pkm.tempDebuffs?.spe || 0)
  const eSpe = b.enemy.spe + (b.enemy.tempDebuffs?.spe || 0)
  const playerFirst = pSpe > eSpe || (pSpe === eSpe && Math.random() < 0.5)

  if (playerFirst) {
    playerAttack(idx)
  } else {
    syncEnemyAttack()
    if (G.battle && !allFainted()) {
      playerAttack(idx, true)
    }
  }
  render()
}

function cancelMove() {
  if (!G.battle) return
  G.battle.selectedMove = undefined
  G.battle.subState = 'attack'
  render()
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

function restartGame() {
  if (confirm('确认重新开始吗？所有进度将丢失！')) {
    resetGame(); G.view = 'start'; render()
  }
}

// 暴露到全局（用于内联 onclick）
const globalFns = [startNewGame, continueGame, selectStarter, travelTo, challengeGym,
  tryWildEncounter, battleSub, playerAttack, tryFlee, enemyTurn,
  useItemInBattle, useItemFromBag, switchPokemon, closeBag, healAtCenter, buyItem,
  advanceDialogue, skipDialogue, finishDialogue, startDialogueBattle, restartGame,
  confirmMove, cancelMove]
for (const fn of globalFns) window[fn.name] = fn

document.addEventListener('DOMContentLoaded', () => {
  if (loadGame()) {
    G.view = G.battle ? 'battle' : 'explore'
    if (G.player.position === 'town') G.player.position = 'pallet'
  }
  render()
})
