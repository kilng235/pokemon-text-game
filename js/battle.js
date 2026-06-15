function startWildBattle() {
  const area = LOCATIONS[G.player.position]
  if (!area || !area[6]) return false
  const en = area[6]
  const roll = Math.random() * 100
  let tier = 'common'
  if (roll < en.common.w) tier = 'common'
  else if (roll < en.common.w + en.uncommon.w) tier = 'uncommon'
  else tier = 'rare'
  const pool = en[tier]
  const id = pool.ids[Math.floor(Math.random() * pool.ids.length)]
  const [min, max] = pool.lv
  const level = min + Math.floor(Math.random() * (max - min + 1))
  return startBattle('wild', null, [createPokemon(id, level)])
}

function startTrainerBattle(trainer) {
  if (!trainer || !trainer.team || trainer.team.length === 0) return false
  const team = trainer.team.map(p => createPokemon(p[0], p[1]))
  const result = startBattle('trainer', { trainer }, team)
  if (result) addLog(`${trainer.name} 向你发起了挑战！`)
  return result
}

function startStoryBattle(eventId) {
  const ev = STORY_EVENTS[eventId]
  if (!ev || !ev.battle) return false
  return startBattle('story', ev, ev.battle.team.map(p => createPokemon(p[0], p[1])))
}

function startGymBattle(leaderId, gymKey) {
  const leader = GYM_LEADERS[leaderId]
  if (!leader) return false
  if (leader[4] <= G.player.badge) {
    addLog('你已经打败过这个道馆了！'); return false
  }
  const team = []
  for (let i = 5; i < leader.length; i += 2) {
    team.push(createPokemon(leader[i], leader[i+1]))
  }
  return startBattle('gym', { data: leader, key: gymKey }, team)
}

function startEliteFour(round) {
  const e4 = ELITE_FOUR[round]
  if (!e4) return false
  const team = e4[2].map(p => createPokemon(p[0], p[1]))
  return startBattle('elite', { round, name: e4[0], type: e4[1] }, team)
}

function startBattle(type, extra, enemyTeam) {
  if (!enemyTeam || enemyTeam.length === 0) return false
  for (const p of enemyTeam) trackSeen(p.id)
  const playerPkm = getActivePokemon()
  if (!playerPkm) {
    addLog('你没有能战斗的宝可梦！'); return false
  }
  G.battle = {
    type, extra, enemyTeam,
    enemy: enemyTeam[0], enemyIndex: 0,
    turn: 'player', subState: 'main',
    ran: false, captured: false,
  }
  const name = enemyTeam[0].name
  if (type === 'wild') addLog(`野生的 ${name} 出现了！ (Lv.${enemyTeam[0].level})`)
  else if (type === 'gym') addLog(`道馆馆主 ${extra.data[1]} 派出了 ${name}！`)
  else if (type === 'story') addLog(`${extra.name} 派出了 ${name}！`)
  else if (type === 'elite') addLog(`四天王 ${extra.name} 派出了 ${name}！`)
  return true
}

function calcDamage(atkPkm, defPkm, move) {
  const isSp = ['火','水','草','电','冰','超能','幽灵','龙','恶'].includes(move.type)
  const atkStat = isSp ? atkPkm.spa : atkPkm.atk
  const defStat = isSp ? defPkm.spd : defPkm.def
  const lvF = Math.floor((2 * atkPkm.level) / 5 + 2)
  let damage = Math.floor(Math.floor((lvF * atkStat * move.power) / defStat) / 50 + 2)
  const eff = getEffectiveness(move.type, defPkm.types)
  damage = Math.floor(damage * eff)
  damage = Math.max(1, Math.floor(damage * (0.85 + Math.random() * 0.15)))
  let msg = `${atkPkm.name} 使用了 ${move.name}！`
  if (eff >= 2) msg += ' 效果拔群！'
  else if (eff <= 0.5 && eff > 0) msg += ' 效果不太好…'
  else if (eff === 0) msg += ' 对对手没有效果…'
  else if (move.power === 0) msg = `${atkPkm.name} 使用了 ${move.name}！`
  addLog(msg)
  return { damage, effectiveness: eff }
}

function playerAttack(moveIndex) {
  const b = G.battle; if (!b || b.turn !== 'player') return
  const pkm = getActivePokemon(); if (!pkm) return
  const move = pkm.moves[moveIndex]; if (!move) return
  if (move.currentPp <= 0) { addLog(`${move.name} 的PP已经用完了！`); return }
  move.currentPp--
  const result = calcDamage(pkm, b.enemy, move)
  b.enemy.hp -= result.damage
  if (b.enemy.hp <= 0) {
    b.enemy.hp = 0; b.enemy.fainted = true
    addLog(`${b.enemy.name} 倒下了！`)
    b.enemyIndex++
    if (b.enemyIndex < b.enemyTeam.length) {
      b.enemy = b.enemyTeam[b.enemyIndex]; b.enemy.hp = b.enemy.maxHp
      let prefix = ''
      if (b.type === 'trainer') prefix = `${b.extra.trainer.name} 派出了 `
      else if (b.type === 'gym') prefix = `${b.extra.data[1]} 派出了 `
      else if (b.type === 'elite') prefix = `${b.extra.name} 派出了 `
      else if (b.type === 'story') prefix = `${b.extra.name} 派出了 `
      else prefix = '野生的 '
      addLog(`${prefix}${b.enemy.name}！`)
      b.turn = 'player'; return
    } else {
      battleVictory(); return
    }
  }
  b.turn = 'enemy'; setTimeout(enemyTurn, 500)
}

function battleVictory() {
  const b = G.battle; if (!b) return
  const totalExp = b.enemyTeam.reduce((s,p) => {
    const d = getPokemonData(p.id); return s + Math.floor(p.level * (d ? d[9] : 60) / 7)
  }, 0)
  let msg = '你获得了胜利！'
  if (b.type === 'gym') {
    const ld = b.extra.data; setBadge(ld[4]); addMoney(ld[3])
    msg = `★ 你击败了道馆馆主 ${ld[1]}！获得 ${ld[2]} 徽章！获得 ¥${ld[3]}`
  } else if (b.type === 'elite') {
    msg = `★ 击败了四天王 ${b.extra.name}！`
  } else if (b.type === 'trainer') {
    const t = b.extra.trainer
    if (!G.player.trainersDefeated.includes(t.id)) G.player.trainersDefeated.push(t.id)
    addMoney(t.money || 100)
    msg = `★ 击败了 ${t.name}！获得 ¥${t.money || 100}`
  } else if (b.type === 'story') {
    if (b.extra.onFinish) {
      const r = b.extra.onFinish(); if (r) msg = r
    }
  }
  addLog(msg)
  addLog(`获得 ${totalExp} 点经验值！`)
  const active = getActivePokemon()
  if (active) addExp(active, totalExp)
  if (b.type === 'elite' && b.extra.round < 3) {
    const next = b.extra.round + 1
    addLog('--- 下一位挑战者 ---')
    setTimeout(() => {
      if (startEliteFour(next)) { G.view = 'battle'; render() }
      else { G.battle = null; G.view = 'explore'; render() }
    }, 300)
    return
  }
  if (b.type === 'elite' && b.extra.round >= 3) {
    G.storyFlags.championDefeated = true
    addLog('★ ★ ★ 恭喜成为宝可梦联盟冠军！★ ★ ★')
  }
  G.battle = null; saveGame()
}

function enemyTurn() {
  const b = G.battle; if (!b || !b.enemy || b.enemy.fainted) return
  const pkm = getActivePokemon(); if (!pkm) {
    addLog('你没有能战斗的宝可梦了！')
    if (b.type === 'wild') {
      addLog('你飞回了宝可梦中心…'); healAll()
      G.player.position = findNearestCenter()
    } else {
      addLog(`你输给了 ${b.type === 'trainer' ? b.extra.trainer.name : b.type === 'gym' ? b.extra.data[1] : b.extra ? b.extra.name : '对手'}……`)
    }
    G.battle = null; saveGame(); render(); return
  }
  const usable = b.enemy.moves.filter(m => m.currentPp > 0)
  if (!usable.length) { b.turn = 'player'; render(); return }
  const move = usable[Math.floor(Math.random() * usable.length)]
  move.currentPp--
  const result = calcDamage(b.enemy, pkm, move)
  pkm.hp -= result.damage
  if (pkm.hp <= 0) {
    pkm.hp = 0; pkm.fainted = true
    addLog(`${pkm.name} 倒下了！`)
    const next = getActivePokemon()
    if (next) { addLog(`上吧！${next.name}！`); b.subState = 'main' }
    else {
      addLog('所有宝可梦都失去了战斗能力……')
      if (b.type === 'wild') {
        addLog('你飞回了宝可梦中心…'); healAll()
        G.player.position = findNearestCenter()
      } else {
      addLog(`你输给了 ${b.type === 'trainer' ? b.extra.trainer.name : b.type === 'gym' ? b.extra.data[1] : b.extra ? b.extra.name : '对手'}……`)
      }
      G.battle = null; saveGame(); render(); return
    }
  }
  b.turn = 'player'; render()
}

function findNearestCenter() {
  const loc = LOCATIONS[G.player.position]
  if (!loc) return 'pallet'
  for (const conn of loc[5]) {
    const c = getLocation(conn)
    if (c && c[3]) return conn
  }
  return 'pallet'
}

function tryCapture() {
  const b = G.battle; if (!b || b.type !== 'wild' || !b.enemy) return
  const ball = G.bagView === 'superball' ? 'superball' : G.bagView === 'ultraball' ? 'ultraball' : 'pokeball'
  if (!G.player.items[ball] || G.player.items[ball] <= 0) { addLog('没有这个球了！'); return }
  G.player.items[ball]--
  const item = ITEMS[ball]
  const base = getPokemonData(b.enemy.id)
  const rate = base ? base[8] : 255
  const a = Math.floor((3 * b.enemy.maxHp - 2 * Math.max(0, b.enemy.hp)) * rate / (3 * b.enemy.maxHp))
  const chance = Math.min(1, (a * item.catchRate) / 255)
  addLog(`你丢出了 ${item.name}！`)
  if (Math.random() < chance) {
    addLog(`★ 成功捕捉了 ${b.enemy.name}！`)
    if (G.player.pokemon.length < 6) G.player.pokemon.push(b.enemy)
    else { G.player.pc.push(b.enemy); addLog(`${b.enemy.name} 被传送到了电脑中。`) }
    b.enemy = null; G.battle = null; saveGame()
  } else {
    addLog(`${b.enemy.name} 挣脱了！`); b.turn = 'enemy'; setTimeout(enemyTurn, 500)
  }
}

function tryFlee() {
  const b = G.battle; if (!b || (b.type !== 'wild')) { addLog('不能逃跑！'); return }
  const pkm = getActivePokemon(); if (!pkm) return
  const chance = Math.min(0.9, 0.5 + (pkm.spe - b.enemy.spe) / 200)
  if (Math.random() < chance) { addLog('成功逃跑了！'); G.battle = null; saveGame() }
  else { addLog('逃跑失败！'); b.turn = 'enemy'; setTimeout(enemyTurn, 500) }
}

function useItem(itemKey) {
  const item = ITEMS[itemKey]; if (!item) return
  if (!G.player.items[itemKey] || G.player.items[itemKey] <= 0) { addLog('没有这个道具了！'); return }
  if (item.catchRate) {
    G.bagView = itemKey; tryCapture(); render(); return
  }
  if (item.heal) {
    let target = getActivePokemon()
    if (item.revive) {
      const faintedOne = G.player.pokemon.find(p => p.fainted || p.hp <= 0)
      if (!faintedOne) { addLog('没有濒死的宝可梦！'); return }
      target = faintedOne
      G.player.items[itemKey]--
      target.hp = Math.floor(target.maxHp * (typeof item.heal === 'number' ? item.heal : 0.5))
      target.fainted = false
      addLog(`使用了 ${item.name}，${target.name} 复活了！`)
    } else {
      if (!target) { addLog('没有可以回复的宝可梦！'); return }
      if (target.hp >= target.maxHp) { addLog(`${target.name} 的HP已满！`); return }
      G.player.items[itemKey]--
      const heal = item.heal === 999 ? target.maxHp : Math.min(item.heal, target.maxHp - target.hp)
      target.hp += heal
      addLog(`使用了 ${item.name}，${target.name} 回复了 ${heal}HP！`)
    }
    if (G.battle && G.battle.turn === 'player') { G.battle.turn = 'enemy'; setTimeout(enemyTurn, 500) }
    saveGame()
  }
}
