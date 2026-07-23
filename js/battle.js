function getScaledLevel(baseMin, baseMax) {
  // 8% 概率遇到精英野生（等级+5~+10）
  if (Math.random() < 0.08) {
    return baseMax + 5 + Math.floor(Math.random() * 6)
  }
  return baseMin + Math.floor(Math.random() * (baseMax - baseMin + 1))
}

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
  const level = getScaledLevel(pool.lv[0], pool.lv[1])
  const pokemon = createPokemon(id, level)
  const shinyChance = getShinyChance()
  const rollShiny = Math.random() < shinyChance
  pokemon.isShiny = rollShiny
  if (pokemon.isShiny) {
    addLog(`✨ 野生的闪光 ${pokemon.name} 出现了！`)
    if (!G.player.shinySeen.includes(pokemon.id)) G.player.shinySeen.push(pokemon.id)
    G.player.shinyChain = 0
  } else {
    G.player.shinyChain++
  }
  if (level > pool.lv[1]) {
    pokemon.isElite = true
    addLog(`⚠ 一只强力的野生 ${pokemon.name} 出现了！`)
  }
  return startBattle('wild', null, [pokemon])
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
  const bType = ev.battleType || 'story'
  const team = ev.battle.team.map(p => createPokemon(p[0], p[1]))
  if (ev.battle.statModifier) {
    team.forEach(p => {
      for (const [k, v] of Object.entries(ev.battle.statModifier)) {
        if (p[k] !== undefined) p[k] = Math.floor(p[k] * v)
      }
    })
  }
  return startBattle(bType, {
    eventId,
    name: ev.battle.name,
    onFinish: ev.onFinish || null,
  }, team)
}

function startRivalBattle(team, name, onFinish) {
  return startBattle('rival', { name, onFinish }, team.map(p => createPokemon(p[0], p[1])))
}

function startChampionBattle() {
  if (!startBattle('rival', {
    name: '小茂',
    onFinish: () => {
      G.storyFlags.championDefeated = true
      addLog('★ 枯叶港新开通了前往七之岛的航线！新的冒险在等待着你……')
      return '★ ★ ★ 你击败了冠军小茂，成为了新的宝可梦联盟冠军！★ ★ ★'
    },
  }, [
    createPokemon(18, 50),
    createPokemon(59, 50),
    createPokemon(112, 49),
    createPokemon(103, 48),
    createPokemon(130, 48),
  ])) return false
  G.battle.battleMsg = '冠军小茂：你终于来了！冠军是我的！'
  return true
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
  const lp = getActivePokemon()
  G.battle = {
    type, extra, enemyTeam,
    enemy: enemyTeam[0], enemyIndex: 0,
    turn: 'player', subState: 'main',
    ran: false, captured: false, battleMsg: '',
    lastEnemyHp: enemyTeam[0].hp, lastPlayerHp: lp ? lp.hp : 0,
    captureFails: 0,
    lock: false,
  }
  const name = enemyTeam[0].name

  // 特性触发：威吓（出场时降低对方攻击）
  const playerActive = getActivePokemon()
  if (playerActive && playerActive.ability && playerActive.ability.key === 'intimidate' && !playerActive.ability.activated) {
    playerActive.ability.activated = true
    if (enemyTeam[0] && !enemyTeam[0].fainted) {
      enemyTeam[0].atk = Math.max(1, Math.floor(enemyTeam[0].atk * 0.75))
      addLog(`${playerActive.name} 的特性[威吓]降低了对手的攻击！`)
    }
  }

  if (type === 'wild') {
    addLog(`野生的 ${name} 出现了！ (Lv.${enemyTeam[0].level})`)
    if (enemyTeam[0].isShiny) {
      G.battle.battleMsg = `✨ 野生的闪光 ${name} 跳出来了！`
    } else {
      G.battle.battleMsg = `野生的 ${name} 跳出来了！`
    }
  } else if (type === 'gym') {
    addLog(`道馆馆主 ${extra.data[1]} 派出了 ${name}！`)
    G.battle.battleMsg = `馆主 ${extra.data[1]}：来吧！`
  } else if (type === 'rival') {
    addLog(`${extra.name} 向你发起了挑战！`)
    G.battle.battleMsg = `${extra.name}：来对战吧！`
  } else if (type === 'story') {
    addLog(`${extra.name} 派出了 ${name}！`)
    G.battle.battleMsg = `${extra.name}：你逃不掉的！`
  } else if (type === 'elite') {
    addLog(`四天王 ${extra.name} 派出了 ${name}！`)
    G.battle.battleMsg = `四天王 ${extra.name}：让你见识一下！`
  }
  return true
}

function applySelfBuff(move, actor, enemyTarget) {
  const buff = (stat) => { actor.tempDebuffs[stat] = Math.min(50, (actor.tempDebuffs[stat] || 0) + 20) }
  const D = move.effect
  if (D === 'atkUp') { buff('atk'); addLog(`${actor.name} 的攻击提升了！`) }
  else if (D === 'defUp') { buff('def'); addLog(`${actor.name} 的防御提升了！`) }
  else if (D === 'spAtkUp') { buff('spa'); addLog(`${actor.name} 的特攻提升了！`) }
  else if (D === 'spDefUp') { buff('spd'); addLog(`${actor.name} 的特防提升了！`) }
  else if (D === 'speedUp') { buff('spe'); addLog(`${actor.name} 的速度提升了！`) }
  else if (D === 'evasionUp') { buff('evasion'); addLog(`${actor.name} 的回避率提升了！`) }
  else if (D === 'atkUpDefUp') { buff('atk'); buff('def'); addLog(`${actor.name} 的攻击和防御都提升了！`) }
  else if (D === 'atkUpSpeedUp') { buff('atk'); buff('spe'); addLog(`${actor.name} 的攻击和速度都提升了！`) }
  else if (D === 'atkUpSpAtkUp') { buff('atk'); buff('spa'); addLog(`${actor.name} 的攻击和特攻都提升了！`) }
  else if (D === 'defUpSpDefUp') { buff('def'); buff('spd'); addLog(`${actor.name} 的防御和特防都提升了！`) }
  else if (D === 'spAtkUpSpDefUpSpeedUp') { buff('spa'); buff('spd'); buff('spe'); addLog(`${actor.name} 的特攻、特防和速度都提升了！`) }
  else if (D === 'recover') { const h = Math.floor(actor.maxHp / 2); actor.hp = Math.min(actor.maxHp, actor.hp + h); addLog(`${actor.name} 回复了 ${h} HP！`) }
  else if (D === 'recoverAll') { actor.hp = actor.maxHp; actor.status = null; addLog(`${actor.name} 的HP完全回复了！异常状态也治愈了！`) }
  else if (D === 'leechSeed') { enemyTarget.leechSeed = true; addLog(`${enemyTarget.name} 被寄生种子寄生了！`) }
  else return false
  return true
}

function handleStatusEffect(target, effect) {
  if (effect === 'sleep') {
    if (target.status) { addLog(`但${target.name}已经有异常状态了。`); return false }
    target.status = { type: 'sleep', turns: 1 + Math.floor(Math.random() * 3) }
    addLog(`${target.name} 睡着了！`); return true
  } else if (effect === 'paralyze') {
    if (target.status) { addLog(`但${target.name}已经有异常状态了。`); return false }
    target.status = { type: 'paralyze' }
    addLog(`${target.name} 麻痹了！`); return true
  } else if (effect === 'poison') {
    if (target.status) { addLog(`但${target.name}已经有异常状态了。`); return false }
    target.status = { type: 'poison', turns: 0 }
    addLog(`${target.name} 中毒了！`); return true
  } else if (effect === 'burn') {
    if (target.status) { addLog(`但${target.name}已经有异常状态了。`); return false }
    target.status = { type: 'burn', turns: 0 }
    addLog(`${target.name} 被灼伤了！`); return true
  } else if (effect === 'confuse') {
    target.confused = true
    addLog(`${target.name} 混乱了！`); return true
  } else if (effect === 'accuracyDown') {
    target.tempDebuffs.accuracy = Math.max(-50, target.tempDebuffs.accuracy - 20)
    addLog(`${target.name} 的命中率降低了！`); return true
  } else if (effect === 'speedDown') {
    target.tempDebuffs.spe = Math.max(-50, target.tempDebuffs.spe - 20)
    addLog(`${target.name} 的速度降低了！`); return true
  } else if (effect === 'atkDown') {
    target.tempDebuffs.atk = Math.max(-50, (target.tempDebuffs.atk || 0) - 20)
    addLog(`${target.name} 的攻击降低了！`); return true
  } else if (effect === 'defDown') {
    target.tempDebuffs.def = Math.max(-50, (target.tempDebuffs.def || 0) - 20)
    addLog(`${target.name} 的防御降低了！`); return true
  } else if (effect === 'spDefDown') {
    target.tempDebuffs.spd = Math.max(-50, (target.tempDebuffs.spd || 0) - 20)
    addLog(`${target.name} 的特防降低了！`); return true
  } else if (effect === 'spAtkDown') {
    target.tempDebuffs.spa = Math.max(-50, (target.tempDebuffs.spa || 0) - 20)
    addLog(`${target.name} 的特攻降低了！`); return true
  } else if (effect === 'poisonSpeedDown') {
    if (target.status) { addLog(`但${target.name}已经有异常状态了。`); return false }
    target.status = { type: 'poison', turns: 0 }
    target.tempDebuffs.spe = Math.max(-50, (target.tempDebuffs.spe || 0) - 20)
    addLog(`${target.name} 中毒了！速度降低了！`); return true
  } else if (effect === 'clearAll') {
    target.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0, atk: 0, def: 0, spd: 0, spa: 0 }
    addLog(`${target.name} 的能力变化被清除了！`); return true
  }
  return false
}

function checkStatusSkip(pkm) {
  // Check disable
  if (pkm.disabled) {
    pkm.disabled = false
    addLog(`${pkm.name} 从定身中恢复了！`)
  }
  if (!pkm.status) {
    // Check leechSeed damage even without status
    if (pkm.leechSeed) {
      const dmg = Math.max(1, Math.floor(pkm.maxHp / 8))
      pkm.hp = Math.max(0, pkm.hp - dmg)
      addLog(`${pkm.name} 被寄生种子吸取了 ${dmg} HP！`)
    }
    return false
  }
  if (pkm.status.type === 'sleep') {
    if (pkm.status.turns <= 0) { pkm.status = null; addLog(`${pkm.name} 醒来了！`); return false }
    pkm.status.turns--
    addLog(`${pkm.name} 在沉睡……`); return true
  } else if (pkm.status.type === 'paralyze') {
    if (Math.random() < 0.25) { addLog(`${pkm.name} 因为麻痹而无法行动！`); return true }
  } else if (pkm.status.type === 'poison') {
    const dmg = Math.max(1, Math.floor(pkm.maxHp / 8))
    pkm.hp = Math.max(0, pkm.hp - dmg)
    addLog(`${pkm.name} 因中毒损失了 ${dmg} HP！`)
  } else if (pkm.status.type === 'burn') {
    const dmg = Math.max(1, Math.floor(pkm.maxHp / 16))
    pkm.hp = Math.max(0, pkm.hp - dmg)
    addLog(`${pkm.name} 因灼伤损失了 ${dmg} HP！`)
  }
  // Leech seed damage
  if (pkm.leechSeed) {
    const dmg = Math.max(1, Math.floor(pkm.maxHp / 8))
    pkm.hp = Math.max(0, pkm.hp - dmg)
    addLog(`${pkm.name} 被寄生种子吸取了 ${dmg} HP！`)
  }
  return false
}

function calcDamage(atkPkm, defPkm, move) {
  // 能力免疫检查（防御方特性）
  if (defPkm.ability) {
    const abKey = defPkm.ability.key
    if (abKey === 'levitate' && move.type === '地面') {
      addLog(`${defPkm.name} 因特性[浮游]免疫了地面系攻击！`)
      return { damage: 0, effectiveness: 0, missed: false, abilityBlocked: true }
    }
    if ((abKey === 'voltAbsorb' || abKey === 'lightningRod') && move.type === '电') {
      const heal = Math.floor(defPkm.maxHp * 0.25)
      defPkm.hp = Math.min(defPkm.maxHp, defPkm.hp + heal)
      addLog(`${defPkm.name} 因特性吸收了电力，回复了 ${heal} HP！`)
      return { damage: 0, effectiveness: 0, missed: false, abilityBlocked: true }
    }
    if (abKey === 'waterAbsorb' && move.type === '水') {
      const heal = Math.floor(defPkm.maxHp * 0.25)
      defPkm.hp = Math.min(defPkm.maxHp, defPkm.hp + heal)
      addLog(`${defPkm.name} 因特性吸收了水流，回复了 ${heal} HP！`)
      return { damage: 0, effectiveness: 0, missed: false, abilityBlocked: true }
    }
    if (abKey === 'flashFire' && move.type === '火') {
      defPkm.ability.activated = true
      addLog(`${defPkm.name} 因特性[引火]吸收了火焰！`)
      return { damage: 0, effectiveness: 0, missed: false, abilityBlocked: true }
    }
  }

  // 命中判定
  const baseAcc = MOVE_ACCURACY[move.id] != null ? MOVE_ACCURACY[move.id] : 100
  const effAcc = atkPkm.accuracy + (atkPkm.tempDebuffs?.accuracy || 0)
  const effEva = defPkm.evasion + (defPkm.tempDebuffs?.evasion || 0)
  const hitChance = baseAcc * (effAcc / effEva)
  if (Math.random() * 100 >= hitChance) {
    addLog(`${atkPkm.name} 的 ${move.name} 没有命中！`)
    return { damage: 0, effectiveness: 0, missed: true }
  }
  // 0威力技能只触发效果，不造成伤害（但仍需命中判定）
  if (move.power === 0) {
    return { damage: 0, effectiveness: 1, missed: false }
  }
  const isSp = ['火','水','草','电','冰','超能','幽灵','龙','恶'].includes(move.type)
  const atkStat = Math.max(1, (isSp ? atkPkm.spa + (atkPkm.tempDebuffs?.spa || 0) : atkPkm.atk + (atkPkm.tempDebuffs?.atk || 0)))
  const defStat = Math.max(1, (isSp ? defPkm.spd + (defPkm.tempDebuffs?.spd || 0) : defPkm.def + (defPkm.tempDebuffs?.def || 0)))
  const lvF = Math.floor((2 * atkPkm.level) / 5 + 2)
  let damage = Math.floor(Math.floor((lvF * atkStat * move.power) / defStat) / 50 + 2)
  const eff = getEffectiveness(move.type, defPkm.types)
  damage = Math.floor(damage * eff)
  // STAB: 同属性加成 ×1.5
  if (atkPkm.types.includes(move.type)) {
    damage = Math.floor(damage * 1.5)
  }
  // 特性加成：HP低时对应属性技能威力提升
  if (atkPkm.ability && atkPkm.hp < atkPkm.maxHp * 0.33) {
    const abKey = atkPkm.ability.key
    const typeBoostMap = { overgrow:'草', blaze:'火', torrent:'水', swarm:'虫' }
    if (typeBoostMap[abKey] === move.type) {
      damage = Math.floor(damage * 1.5)
      addLog(`特性[${atkPkm.ability.name}]使${move.type}系技能威力提升！`)
    }
    // 引火激活后火系技能提升
    if (abKey === 'flashFire' && atkPkm.ability.activated && move.type === '火') {
      damage = Math.floor(damage * 1.5)
    }
  }
  damage = Math.max(1, Math.floor(damage * (0.85 + Math.random() * 0.15)))
  let msg = `${atkPkm.name} 使用了 ${move.name}！`
  if (eff >= 2) msg += ' 效果拔群！'
  else if (eff <= 0.5 && eff > 0) msg += ' 效果不太好…'
  else if (eff === 0) msg += ' 对对手没有效果…'
  else if (move.power === 0) msg = `${atkPkm.name} 使用了 ${move.name}！`
  // 普通命中音效（效果拔群/不理想由消息关键字另行触发）
  if (window.AU && eff > 0.5 && eff < 2 && damage > 0) {
    if (window.AU.sfxByType) AU.sfxByType(move.type)
    else AU.sfx('hit')
  }
  addLog(msg)
  return { damage, effectiveness: eff, missed: false }
}

function playerAttack(moveIndex, skipTurnCheck) {
  const b = G.battle; if (!b) return
  if (b.lock && !skipTurnCheck) return
  if (!skipTurnCheck && b.turn !== 'player') return
  const pkm = getActivePokemon(); if (!pkm) return

  b.lock = true
  // Check player status
  if (pkm.status && checkStatusSkip(pkm)) {
    b.turn = 'enemy'; b.battleMsg = `${pkm.name} 无法行动……`
    setTimeout(enemyTurn, 500); return
  }

  const move = pkm.moves[moveIndex]; if (!move) return
  if (move.currentPp <= 0) { addLog(`${move.name} 的PP已经用完了！`); return }
  move.currentPp--

  b.lastEnemyHp = b.enemy.hp
  b.lastPlayerHp = pkm.hp
  const result = calcDamage(pkm, b.enemy, move)

  // 攻击动画：玩家宝可梦冲锋
  const playerEl = document.querySelector('.sprite-container.player')
  const enemyEl = document.querySelector('.sprite-container.enemy')
  if (playerEl) {
    playerEl.classList.add('fx-attack-player')
    setTimeout(() => playerEl.classList.remove('fx-attack-player'), 600)
  }

  if (result.missed) {
    b.battleMsg = '没有命中！'
    if (window.FX && enemyEl) FX.showDamage(enemyEl, 0, 'miss')
    if (window.AU) AU.sfx('miss')
    if (skipTurnCheck) { b.lock = false; b.turn = 'player'; render(); return }
    b.turn = 'enemy'; setTimeout(enemyTurn, 500); return
  }

  // Apply status effects (sleep/paralyze/poison/burn)
  if (result.effectiveness > 0 && move.effect && ['sleep','paralyze','poison','burn','confuse','disable'].includes(move.effect)) {
    handleStatusEffect(b.enemy, move.effect)
    if (window.FX && enemyEl) {
      const statusKey = move.effect === 'confuse' ? 'confuse' : move.effect
      setTimeout(() => FX.playStatus(enemyEl, statusKey), 350)
    }
  }

  // Apply debuff effects
  if (result.effectiveness > 0 && move.effect && ['accuracyDown','speedDown','atkDown','defDown','spDefDown','spAtkDown','poisonSpeedDown','clearAll'].includes(move.effect)) {
    handleStatusEffect(b.enemy, move.effect)
  }

  // Apply self-buff effects
  if (['atkUp','defUp','spAtkUp','spDefUp','speedUp','evasionUp','atkUpDefUp','atkUpSpeedUp','atkUpSpAtkUp','defUpSpDefUp','spAtkUpSpDefUpSpeedUp','recover','recoverAll','leechSeed'].includes(move.effect)) {
    applySelfBuff(move, pkm, b.enemy)
    if (window.FX && playerEl && (move.effect === 'recover' || move.effect === 'recoverAll')) {
      FX.playHeal(playerEl)
    }
  }

  // 0威力状态技能：立即渲染显示效果，然后进入敌方回合
  if (move.power === 0) {
    b.battleMsg = `使用了 ${move.name}！`
    if (window.FX && enemyEl) FX.playMove(move, enemyEl, { isPlayer: true })
    render()
    if (skipTurnCheck) { b.lock = false; b.turn = 'player'; return }
    b.turn = 'enemy'; setTimeout(enemyTurn, 800); return
  }

  // 命中后播放招式特效
  if (window.FX && enemyEl) {
    setTimeout(() => {
      FX.playMove(move, enemyEl, { isPlayer: true })
      const dmgKind = result.effectiveness >= 2 ? 'crit' : ''
      if (result.damage > 0) FX.showDamage(enemyEl, result.damage, dmgKind)
    }, 200)
  }

  // Apply drain effect
  if (move.effect === 'drain' && result.damage > 0) {
    const heal = Math.max(1, result.damage)
    pkm.hp = Math.min(pkm.maxHp, pkm.hp + heal)
    addLog(`回复了 ${heal} HP！`)
    if (window.FX && playerEl) {
      setTimeout(() => {
        FX.showDamage(playerEl, heal, 'heal')
        FX.playHeal(playerEl)
      }, 600)
    }
  }

  b.enemy.hp -= result.damage
  if (result.effectiveness >= 2) { b.battleMsg = '效果拔群！'; if (window.AU) AU.sfx('superEffective') }
  else if (result.effectiveness === 0) b.battleMsg = '没有效果…'
  else if (result.effectiveness < 1) { b.battleMsg = '效果不太好…'; if (window.AU) AU.sfx('notEffective') }
  else b.battleMsg = `使用了 ${move.name}！`
  if (b.enemy.hp <= 0) {
    b.enemy.hp = 0; b.enemy.fainted = true
    addLog(`${b.enemy.name} 倒下了！`)
    if (window.FX && enemyEl) setTimeout(() => FX.playFaint(enemyEl), 400)
    if (window.AU) AU.sfx('faint')
    b.enemyIndex++
    if (b.enemyIndex < b.enemyTeam.length) {
      b.enemy = b.enemyTeam[b.enemyIndex]; b.enemy.hp = b.enemy.maxHp; b.enemy.status = null
      b.enemy.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0 }
      let prefix = '', msg = ''
      if (b.type === 'trainer') { prefix = `${b.extra.trainer.name} 派出了 `; msg = `${b.extra.trainer.name}：去吧！` }
      else if (b.type === 'gym') { prefix = `${b.extra.data[1]} 派出了 `; msg = `${b.extra.data[1]}：哼！` }
      else if (b.type === 'elite') { prefix = `${b.extra.name} 派出了 `; msg = `${b.extra.name}：还没完！` }
      else if (b.type === 'rival') { prefix = `${b.extra.name} 派出了 `; msg = `${b.extra.name}：还没完呢！` }
      else if (b.type === 'story' || b.type === 'legendary') { prefix = `${b.extra.name} 派出了 `; msg = `${b.extra.name}：你等着！` }
      else prefix = '野生的 '
      addLog(`${prefix}${b.enemy.name}！`)
      b.battleMsg = msg || ''
      b.lock = false; b.turn = 'player'; return
    } else {
      battleVictory(); return
    }
  }
  if (skipTurnCheck) {
    b.lock = false; b.turn = 'player'; render(); return
  }
  b.turn = 'enemy'; setTimeout(enemyTurn, 700)
}

function battleVictory() {
  const b = G.battle; if (!b) return
  let totalExp = b.enemyTeam.reduce((s,p) => {
    const d = getPokemonData(p.id); return s + Math.floor(p.level * (d ? d[10] : 60) / 5)
  }, 0)
  // 精英野生给1.5倍经验
  if (b.enemy && b.enemy.isElite) {
    totalExp = Math.floor(totalExp * 1.5)
  }
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
  } else if (b.type === 'story' || b.type === 'legendary') {
    if (b.extra.onFinish) {
      const r = b.extra.onFinish(); if (r) msg = r
    }
  }
  addLog(msg)
  addLog(`获得 ${totalExp} 点经验值！`)
  if (window.AU) AU.sfx('victory')
  if (window.FX) {
    const enemyEl = document.querySelector('.sprite-container.enemy')
    if (enemyEl) FX.flash('#FFD700', 400)
  }
  const active = getActivePokemon()
  if (active) {
    for (const ep of b.enemyTeam) {
      const yields = getEVYield(ep.id)
      if (addEV(active, yields)) {
        const names = ['HP','攻击','防御','特攻','特防','速度']
        const gained = yields.map((y,i) => y > 0 ? names[i] : null).filter(Boolean)
        if (gained.length) addLog(`${active.name}的${gained.join('、')}基础点数提升了！`)
      }
    }
    addExp(active, totalExp)
  }
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
    addLog('★ 你击败了四天王！')
    addLog('冠军 小茂 向你走来……')
    setTimeout(() => {
      if (startChampionBattle()) { G.view = 'battle'; render() }
      else { G.battle = null; G.view = 'explore'; render() }
    }, 500)
    return
  }
  if (b.type === 'rival') {
    if (b.extra.onFinish) {
      const r = b.extra.onFinish(); if (r) msg = r
    }
  }
  updateQuest()
  for (const p of G.player.pokemon) {
    if (p.tempDebuffs) p.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0 }
    // Natural Cure: 战斗结束后恢复异常状态
    if (p.ability && p.ability.key === 'naturalCure' && p.status) {
      p.status = null; addLog(`${p.name} 的特性[自然回复]恢复了异常状态！`)
    }
  }
  G.battle = null; saveGame(); render()
}
function syncEnemyAttack() {
  const b = G.battle; if (!b || !b.enemy || b.enemy.fainted) return false
  const pkm = getActivePokemon(); if (!pkm) {
    addLog('你没有能战斗的宝可梦了！')
    handlePlayerDefeat(b)
    G.battle = null; saveGame(); return false
  }

  if (b.enemy.status && checkStatusSkip(b.enemy)) {
    b.battleMsg = `${b.enemy.name} 无法行动……`; return false
  }

  const usable = b.enemy.moves.filter(m => m.currentPp > 0)
  if (!usable.length) { return false }
  const move = usable[Math.floor(Math.random() * usable.length)]
  move.currentPp--

  if (move.effect && ['sleep','paralyze','poison','burn','confuse','disable'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`
    render(); return true
  }

  if (move.effect && ['accuracyDown','speedDown','atkDown','defDown','spDefDown','spAtkDown','poisonSpeedDown','clearAll'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`
    render(); return true
  }

  // Enemy self-buff effects
  if (['atkUp','defUp','spAtkUp','spDefUp','speedUp','evasionUp','atkUpDefUp','atkUpSpeedUp','atkUpSpAtkUp','defUpSpDefUp','spAtkUpSpDefUpSpeedUp','recover','recoverAll','leechSeed'].includes(move.effect)) {
    applySelfBuff(move, b.enemy, pkm)
    b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`
    render(); return true
  }

  b.lastEnemyHp = b.enemy.hp
  b.lastPlayerHp = pkm.hp
  const playerEl = document.querySelector('.sprite-container.player')
  const enemyEl = document.querySelector('.sprite-container.enemy')
  if (enemyEl) {
    enemyEl.classList.add('fx-attack-enemy')
    setTimeout(() => enemyEl.classList.remove('fx-attack-enemy'), 600)
  }
  const result = calcDamage(b.enemy, pkm, move)
  if (result.missed) {
    b.battleMsg = `${b.enemy.name} 的 ${move.name} 没有命中！`
    if (window.FX && playerEl) FX.showDamage(playerEl, 0, 'miss')
    return true
  }

  if (move.effect === 'drain' && result.damage > 0) {
    const heal = Math.max(1, result.damage)
    b.enemy.hp = Math.min(b.enemy.maxHp, b.enemy.hp + heal)
    addLog(`${b.enemy.name} 吸取了 ${heal} HP！`)
    if (window.FX && enemyEl) {
      setTimeout(() => {
        FX.showDamage(enemyEl, heal, 'heal')
        FX.playHeal(enemyEl)
      }, 600)
    }
  }

  if (result.effectiveness >= 2) b.battleMsg = '效果拔群！'
  else if (result.effectiveness === 0) b.battleMsg = '没有效果…'
  else if (result.effectiveness < 1) b.battleMsg = '效果不太好…'
  else b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`

  if (window.FX && playerEl) {
    setTimeout(() => {
      FX.playMove(move, playerEl, { isPlayer: false })
      const dmgKind = result.effectiveness >= 2 ? 'crit' : ''
      if (result.damage > 0) FX.showDamage(playerEl, result.damage, dmgKind)
    }, 200)
  }

  pkm.hp -= result.damage
  if (pkm.hp <= 0) {
    pkm.hp = 0; pkm.fainted = true
    addLog(`${pkm.name} 倒下了！`)
    if (window.FX && playerEl) setTimeout(() => FX.playFaint(playerEl), 400)
    if (window.AU) AU.sfx('faint')
    const next = getActivePokemon()
    if (next) { addLog(`派出 ${next.name}！`); b.subState = 'main' }
    else {
      addLog('你已经没有能战斗的宝可梦了……')
      handlePlayerDefeat(b)
      G.battle = null; saveGame(); return false
    }
  }
  return true
}

function enemyTurn() {
  const b = G.battle; if (!b || !b.enemy || b.enemy.fainted) return
  b.lock = false
  const pkm = getActivePokemon(); if (!pkm) {
    addLog('你没有能战斗的宝可梦了！')
    handlePlayerDefeat(b)
    G.battle = null; saveGame(); render(); return
  }

  if (b.enemy.status && checkStatusSkip(b.enemy)) {
    b.battleMsg = `${b.enemy.name} 无法行动……`
    b.turn = 'player'; render(); return
  }

  const usable = b.enemy.moves.filter(m => m.currentPp > 0)
  if (!usable.length) { b.turn = 'player'; render(); return }
  const move = usable[Math.floor(Math.random() * usable.length)]
  move.currentPp--

  const playerEl = document.querySelector('.sprite-container.player')
  const enemyEl = document.querySelector('.sprite-container.enemy')
  // 敌方冲锋动画
  if (enemyEl) {
    enemyEl.classList.add('fx-attack-enemy')
    setTimeout(() => enemyEl.classList.remove('fx-attack-enemy'), 600)
  }

  if (move.effect && ['sleep','paralyze','poison','burn','confuse','disable'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`
    if (window.FX && playerEl) {
      const statusKey = move.effect === 'confuse' ? 'confuse' : move.effect
      setTimeout(() => FX.playStatus(playerEl, statusKey), 350)
    }
    b.turn = 'player'; render(); return
  }

  if (move.effect && ['accuracyDown','speedDown','atkDown','defDown','spDefDown','spAtkDown','poisonSpeedDown','clearAll'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`
    b.turn = 'player'; render(); return
  }

  // 敌方 self-buff
  if (move.effect && ['atkUp','defUp','spAtkUp','spDefUp','speedUp','evasionUp','atkUpDefUp','atkUpSpeedUp','atkUpSpAtkUp','defUpSpDefUp','spAtkUpSpDefUpSpeedUp','recover','recoverAll','leechSeed'].includes(move.effect)) {
    applySelfBuff(move, b.enemy, pkm)
    b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`
    if (window.FX && enemyEl && (move.effect === 'recover' || move.effect === 'recoverAll')) {
      FX.playHeal(enemyEl)
    }
    b.turn = 'player'; render(); return
  }

  const result = calcDamage(b.enemy, pkm, move)
  if (result.missed) {
    b.battleMsg = `${b.enemy.name} 的 ${move.name} 没有命中！`
    if (window.FX && playerEl) FX.showDamage(playerEl, 0, 'miss')
    if (window.AU) AU.sfx('miss')
    b.turn = 'player'; render(); return
  }

  // 招式特效
  if (window.FX && playerEl) {
    setTimeout(() => {
      FX.playMove(move, playerEl, { isPlayer: false })
      const dmgKind = result.effectiveness >= 2 ? 'crit' : ''
      if (result.damage > 0) FX.showDamage(playerEl, result.damage, dmgKind)
    }, 200)
  }

  if (move.effect === 'drain' && result.damage > 0) {
    const heal = Math.max(1, result.damage)
    b.enemy.hp = Math.min(b.enemy.maxHp, b.enemy.hp + heal)
    addLog(`${b.enemy.name} 吸取了 ${heal} HP！`)
    if (window.FX && enemyEl) {
      setTimeout(() => {
        FX.showDamage(enemyEl, heal, 'heal')
        FX.playHeal(enemyEl)
      }, 600)
    }
  }

  if (result.effectiveness >= 2) { b.battleMsg = '效果拔群！'; if (window.AU) AU.sfx('superEffective') }
  else if (result.effectiveness === 0) b.battleMsg = '没有效果…'
  else if (result.effectiveness < 1) { b.battleMsg = '效果不太好…'; if (window.AU) AU.sfx('notEffective') }
  else b.battleMsg = `${b.enemy.name} 使用了 ${move.name}！`
  pkm.hp -= result.damage
  if (pkm.hp <= 0) {
    pkm.hp = 0; pkm.fainted = true
    addLog(`${pkm.name} 倒下了！`)
    if (window.FX && playerEl) setTimeout(() => FX.playFaint(playerEl), 400)
    if (window.AU) AU.sfx('faint')
    const next = getActivePokemon()
    if (next) { addLog(`派出 ${next.name}！`); b.subState = 'main' }
    else {
      addLog('你已经没有能战斗的宝可梦了……')
      handlePlayerDefeat(b)
      G.battle = null; saveGame(); render(); return
    }
  }
  b.turn = 'player'; setTimeout(render, 500)
}

function handlePlayerDefeat(b) {
  if (b.type === 'wild') {
    addLog('你被野生宝可梦击败了……')
    healAll()
    G.player.position = findNearestCenter()
    return
  }
  if (G.player.position === 'mtMoon') {
    addLog('你被击败了……在月见山失去了意识，被送回了路边。')
    healAll()
    G.player.position = 'route3'
    return
  }
  const name = b.type === 'trainer' ? b.extra.trainer.name : b.type === 'gym' ? b.extra.data[1] : b.extra ? b.extra.name : '对手'
  addLog(`你被 ${name} 击败了……`)
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

// 捕捉成功率计算（0~1，上限 0.99 保留紧张感）
// 五因子：捕获率(rate/255) × 球修正 × HP残血因子 × 等级因子 × 异常状态因子
//   - HP 残血越多越接近 1（原版公式： (3*maxHp - 2*hp) / (3*maxHp) ）
//   - 等级：Lv.5 及以下 = 1.0；之后每级 -1%，最低 0.4（低等级更易捕捉）
//   - 异常：睡眠 ×2，麻痹/中毒/灼伤 ×1.5（原版 Gen1 加成）
function getCaptureChance(enemy, ballKey) {
  const base = getPokemonData(enemy.id)
  const rate = base ? base[9] : 255
  const item = ITEMS[ballKey] || ITEMS.pokeball
  const ballBonus = item.catchRate || 1
  const hp = Math.max(0, enemy.hp)
  const maxHp = Math.max(1, enemy.maxHp)
  const hpFactor = (3 * maxHp - 2 * hp) / (3 * maxHp)
  const levelFactor = Math.max(0.4, 1 - Math.max(0, enemy.level - 5) * 0.01)
  let statusFactor = 1
  if (enemy.status && enemy.status.type) {
    if (enemy.status.type === 'sleep') statusFactor = 2
    else if (['paralyze','poison','burn'].includes(enemy.status.type)) statusFactor = 1.5
  }
  return Math.min(0.99, (rate / 255) * ballBonus * hpFactor * levelFactor * statusFactor)
}

// 同一只野生在同场战斗中每次捕捉失败，下次基础概率 +12% 累加，封顶 0.99
// 战斗结束/换场自动重置（G.battle 重新初始化时 captureFails 归零）
function getEffectiveCaptureChance(enemy, ballKey, fails) {
  const base = getCaptureChance(enemy, ballKey)
  return Math.min(0.99, base + (fails || 0) * 0.12)
}

function tryCapture() {
  const b = G.battle; if (!b || !b.enemy) return
  if (b.lock) return
  if (b.type !== 'wild') { addLog('不能在训练家对战中使用精灵球！'); return }
  let ball = G.bagView === 'superball' ? 'superball' : G.bagView === 'ultraball' ? 'ultraball' : G.bagView === 'safariBall' ? 'safariBall' : 'pokeball'
  if (!G.player.items[ball] || G.player.items[ball] <= 0) { addLog('没有这个球了！'); return }
  if (ball === 'safariBall' && G.player.position !== 'safariZone') { addLog('狩猎球只能在狩猎地带使用！'); return }
  G.player.items[ball]--
  const item = ITEMS[ball]
  const fails = b.captureFails || 0
  const chance = getEffectiveCaptureChance(b.enemy, ball, fails)
  const pct = Math.round(chance * 100)
  const bonusNote = fails > 0 ? `（含连失补偿 +${fails * 12}%）` : ''
  addLog(`你丢出了 ${item.name}！（捕捉率约 ${pct}%${bonusNote}）`)
  if (window.AU) AU.sfx('ballThrow')
  b.battleMsg = '1… 2… 3…'
  b.lock = true
  const enemyEl = document.querySelector('.sprite-container.enemy')
  if (window.FX && enemyEl) FX.playCapture(enemyEl, true)
  setTimeout(() => {
    if (!G.battle) return
    if (Math.random() < chance) {
      b.battleMsg = `成功捕捉了 ${b.enemy.name}！`
      addLog(`★ 成功捕捉了 ${b.enemy.name}！`)
      if (window.AU) AU.sfx('capture')
      if (window.FX && enemyEl) FX.flash('#FFD700', 400)
      if (G.player.pokemon.length < 6) G.player.pokemon.push(b.enemy)
      else { G.player.pc.push(b.enemy); addLog(`${b.enemy.name} 被传送到了电脑中。`) }
      b.enemy = null; G.battle = null; saveGame(); render()
    } else {
      b.lock = false
      b.captureFails = fails + 1
      const nextChance = Math.round(getEffectiveCaptureChance(b.enemy, ball, b.captureFails) * 100)
      addLog(`${b.enemy.name} 挣脱了！下次捕捉率约 ${nextChance}%`)
      if (window.AU) AU.sfx('captureFail')
      b.turn = 'enemy'; setTimeout(enemyTurn, 500)
    }
  }, 900)
}

function tryFlee() {
  const b = G.battle; if (!b || (b.type !== 'wild')) { addLog('不能逃跑！'); return }
  if (b.lock) return
  const pkm = getActivePokemon(); if (!pkm) return
  const chance = Math.min(0.9, 0.5 + (pkm.spe - b.enemy.spe) / 200)
  if (Math.random() < chance) { addLog('成功逃跑了！'); G.battle = null; saveGame(); render() }
  else { b.lock = true; b.battleMsg = '无法逃脱！'; addLog('逃跑失败！'); b.turn = 'enemy'; setTimeout(enemyTurn, 500) }
}

function useItem(itemKey) {
  const item = ITEMS[itemKey]; if (!item) return
  if (G.battle && G.battle.lock) return
  if (!G.player.items[itemKey] || G.player.items[itemKey] <= 0) { addLog('没有这个道具了！'); return }
  if (item.catchRate && G.player.position === 'safariZone') {
    G.bagView = 'safariBall'; tryCapture(); render(); return
  }
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
    if (G.battle && G.battle.turn === 'player') {
      G.battle.lock = true
      G.battle.turn = 'enemy'
      G.battle.subState = 'main'
      G.battle.battleMsg = `使用了 ${item.name}，${target.name} 的HP回复了！`
      render()
      setTimeout(enemyTurn, 800)
    }
    saveGame()
  }
}
