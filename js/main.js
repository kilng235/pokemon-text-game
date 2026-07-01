function toggleMap() {
  G.showBigMap = false
  G.view = 'worldMap'
  render()
}

function startNewGame() {
  resetGame()
  initQuests()
  G.dialogue = {
    lines: [
      { speaker: '📺 电视新闻', text: '「各位观众，晚上好！欢迎收看宝可梦新闻。」' },
      { speaker: '📺 电视新闻', text: '「最近，关都地区掀起了训练家热潮！」' },
      { speaker: '📺 电视新闻', text: '「大木博士的研究所前挤满了前来领取初始宝可梦的年轻人。」' },
      { speaker: '📺 电视新闻', text: '「同时，一个被称为"火箭队"的可疑组织活动日益频繁。」' },
      { speaker: '📺 电视新闻', text: '「我们的冒险，就从这里开始——」' },
      { speaker: '', text: '你关掉了电视，走出家门，向大木博士的研究所走去……' },
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
  if (key === 'seafoamIslands' && !G.player.items.surfHM) {
    addLog('双子岛需要冲浪术才能到达。')
    render(); return
  }
  // 七之岛乘船条件
  if (key === 'island1') {
    if (G.player.position !== 'vermilion') {
      addLog('从当前位置无法直接前往七之岛，需要从枯叶市乘船。')
      render(); return
    }
    if (!G.storyFlags.championDefeated) {
      addLog('港口工作人员：\"去七之岛的海域很危险，等你成为联盟冠军再来吧！\"')
      render(); return
    }
    addLog('🛳 登上了前往七之岛的渡轮……海浪拍打着船舷……')
  }
  if (G.player.position === 'vermilion' && key.startsWith('island') && key !== 'island1') {
    addLog('需要先到脐眼岛，再转往其他岛屿。')
    render(); return
  }
  G.player.position = key
  updateQuest()
  // 城镇剧情触发
  if (loc[2] === 'town') {
    const storyKey = checkStoryTrigger(key)
    if (storyKey) {
      const ev = STORY_EVENTS[storyKey]
      G.dialogue = { eventKey: storyKey, lines: ev.dialogue, index: 0, battle: ev.battle !== null, choices: ev.choices, canSkip: false }
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
    G.dialogue = { eventKey: storyKey, lines: ev.dialogue, index: 0, battle: ev.battle !== null, choices: ev.choices, canSkip: false }
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
    const rivalEevee = createPokemon(133, 5, [1, 2, 77, 75])
    rivalEevee.atk = Math.floor(rivalEevee.atk * 0.6)
    rivalEevee.spa = Math.floor(rivalEevee.spa * 0.6)
    if (startBattle('rival', {
      name: '小茂',
      onFinish: () => '首次击败小茂！获得 ¥200',
    }, [rivalEevee])) {
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
  // 处理选择分支（如月见山化石选择）
  if (d && d.choices && d.eventKey) {
    G.view = 'choice'; render(); return
  }
  const onComplete = d ? d.onComplete : null
  if (d && d.eventKey) {
    const ev = STORY_EVENTS[d.eventKey]
    if (ev && ev.onFinish) {
      const msg = ev.onFinish()
      if (msg) addLog(msg)
      updateQuest()
    }
  }
  G.dialogue = null
  if (onComplete === 'starter') {
    G.view = 'choose'; saveGame(); render(); return
  }
  saveGame()
  G.view = 'explore'; render()
}

function makeChoice(choiceIndex) {
  const d = G.dialogue
  if (!d || !d.choices || !d.eventKey) return
  const choice = d.choices[choiceIndex]
  if (!choice) return
  const ev = STORY_EVENTS[d.eventKey]
  if (ev && ev.onFinish) {
    const msg = ev.onFinish(choice)
    if (msg) addLog(msg)
    updateQuest()
  }
  G.dialogue = null
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
  G.pokemonManager = null
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

// 学习新技能：直接学会（不足4个时）
function createMoveFromData(mData) {
  if (!mData) return null
  return { id:mData[0], name:mData[1], type:mData[2], power:mData[3], pp:mData[4], currentPp:mData[4], desc:mData[5]||'', effect:mData[6]||null }
}

function ensureRelearnMoves(pkm) {
  if (!pkm.relearnMoves) pkm.relearnMoves = []
  return pkm.relearnMoves
}

function removeRelearnMoveById(pkm, moveId) {
  const pool = ensureRelearnMoves(pkm)
  const idx = pool.findIndex(m => m && m.id === moveId)
  if (idx >= 0) pool.splice(idx, 1)
}

function addRelearnMove(pkm, move) {
  if (!pkm || !move) return
  const pool = ensureRelearnMoves(pkm)
  if (pkm.moves.some(m => m && m.id === move.id)) return
  if (pool.some(m => m && m.id === move.id)) return
  pool.push({
    id: move.id,
    name: move.name,
    type: move.type,
    power: move.power,
    pp: move.pp,
    currentPp: move.pp,
    desc: move.desc || '',
    effect: move.effect || null,
  })
}

function openPokemonManager(pokemonIndex) {
  if (!G.player.pokemon[pokemonIndex]) return
  G.pokemonManager = { pokemonIndex, relearnIndex: null }
  G.view = 'pokemon'
  render()
}

function closePokemonManager() {
  G.pokemonManager = null
  render()
}

function prepareRelearnMove(pokemonIndex, relearnIndex) {
  const pkm = G.player.pokemon[pokemonIndex]
  if (!pkm) return
  const pool = ensureRelearnMoves(pkm)
  if (!pool[relearnIndex]) return
  G.pokemonManager = { pokemonIndex, relearnIndex }
  render()
}

function cancelRelearnMove() {
  if (!G.pokemonManager) return
  G.pokemonManager.relearnIndex = null
  render()
}

function swapRelearnMove(pokemonIndex, moveIndex) {
  const manager = G.pokemonManager
  const pkm = G.player.pokemon[pokemonIndex]
  if (!manager || !pkm || manager.pokemonIndex !== pokemonIndex) return
  const pool = ensureRelearnMoves(pkm)
  const remembered = pool[manager.relearnIndex]
  const current = pkm.moves[moveIndex]
  if (!remembered || !current) return
  pkm.moves.splice(moveIndex, 1, createMoveFromData([remembered.id, remembered.name, remembered.type, remembered.power, remembered.pp, remembered.desc || '', remembered.effect || null]))
  pool.splice(manager.relearnIndex, 1)
  addRelearnMove(pkm, current)
  G.pokemonManager = { pokemonIndex, relearnIndex: null }
  addLog(`★ ${pkm.name} 将「${current.name}」收回技能库，换回了「${remembered.name}」！`)
  saveGame(); render()
}

function learnMoveDirect(pokemonIndex) {
  const pending = G.pendingMoveLearn
  if (!pending || pending.length === 0) return
  const info = pending[0]
  const pkm = G.player.pokemon[pokemonIndex]
  if (!pkm) return
  const mData = getMoveData(info.moveId)
  if (!mData) return
  removeRelearnMoveById(pkm, info.moveId)
  pkm.moves.push(createMoveFromData(mData))
  addLog(`★ ${pkm.name} 学会了「${mData[1]}」！`)
  G.pendingMoveLearn.shift()
  saveGame(); render()
}

// 学习新技能：遗忘旧技能
function forgetMove(pokemonIndex, moveIndex) {
  const pending = G.pendingMoveLearn
  if (!pending || pending.length === 0) return
  const info = pending[0]
  const pkm = G.player.pokemon[pokemonIndex]
  if (!pkm) return
  const forgotten = pkm.moves[moveIndex]
  const mData = getMoveData(info.moveId)
  if (!mData) return
  addRelearnMove(pkm, forgotten)
  removeRelearnMoveById(pkm, info.moveId)
  pkm.moves.splice(moveIndex, 1, createMoveFromData(mData))
  addLog(`★ ${pkm.name} 将「${forgotten.name}」放入可换回技能库，\n   学会了「${mData[1]}」！`)

  G.pendingMoveLearn.shift()
  saveGame(); render()
}

// 跳过学习
function skipMove() {
  if (G.pendingMoveLearn && G.pendingMoveLearn.length > 0) {
    const info = G.pendingMoveLearn[0]
    addLog(`${G.player.pokemon[info.pokemonIndex]?.name} 没有学习「${info.moveName}」。`)
    G.pendingMoveLearn.shift()
    saveGame(); render()
  }
}

// 移动端地图面板折叠
function toggleMapPanel() {
  const panel = $('map-panel')
  if (!panel) return
  const content = panel.querySelector('.panel-content')
  const toggle = panel.querySelector('.panel-toggle')
  if (!content || !toggle) return
  
  if (content.style.display === 'none') {
    content.style.display = 'block'
    toggle.textContent = '📋 任务信息 ▲'
  } else {
    content.style.display = 'none'
    toggle.textContent = '📋 任务信息 ▼'
  }
}

// 暴露到全局（用于内联 onclick）
const globalFns = [startNewGame, continueGame, selectStarter, travelTo, challengeGym,
  tryWildEncounter, battleSub, playerAttack, tryFlee, enemyTurn,
  useItemInBattle, useItemFromBag, switchPokemon, closeBag, healAtCenter, buyItem,
  advanceDialogue, skipDialogue, finishDialogue, startDialogueBattle, restartGame, makeChoice,
  confirmMove, cancelMove, toggleMap, learnMoveDirect, forgetMove, skipMove,
  openPokemonManager, closePokemonManager, prepareRelearnMove, cancelRelearnMove, swapRelearnMove,
  toggleMapPanel]
for (const fn of globalFns) window[fn.name] = fn

document.addEventListener('DOMContentLoaded', () => {
  if (loadGame()) {
    G.view = G.battle ? 'battle' : 'explore'
    if (G.player.position === 'town') G.player.position = 'pallet'
  }
  render()
})
