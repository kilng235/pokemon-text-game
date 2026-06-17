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
  // 精英野生：等级超过该区域上限
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
  G.battle = {
    type, extra, enemyTeam,
    enemy: enemyTeam[0], enemyIndex: 0,
    turn: 'player', subState: 'main',
    ran: false, captured: false, battleMsg: '',
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
    G.battle.battleMsg = `野生的 ${name} 跳出来了！`
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
  } else if (effect === 'confuse') {
    target.confused = true
    addLog(`${target.name} 混乱了！`); return true
  } else if (effect === 'disable') {
    target.disabled = true
    addLog(`${target.name} 被定身了，无法行动！`); return true
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
  const baseAcc = MOVE_ACCURACY[move.id] || 100
  const effAcc = atkPkm.accuracy + (atkPkm.tempDebuffs?.accuracy || 0)
  const effEva = defPkm.evasion + (defPkm.tempDebuffs?.evasion || 0)
  const hitChance = baseAcc * (effAcc / effEva)
  if (Math.random() * 100 >= hitChance) {
    addLog(`${atkPkm.name} 的 ${move.name} 没有命中！`)
    return { damage: 0, effectiveness: 0, missed: true }
  }
  // 0威力技能只触发效果，不造成伤害
  if (move.power === 0) {
    addLog(`${atkPkm.name} 使用了 ${move.name}！`)
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
  addLog(msg)
  return { damage, effectiveness: eff, missed: false }
}

function playerAttack(moveIndex, skipTurnCheck) {
  const b = G.battle; if (!b) return
  if (!skipTurnCheck && b.turn !== 'player') return
  const pkm = getActivePokemon(); if (!pkm) return

  // Check player status
  if (pkm.status && checkStatusSkip(pkm)) {
    b.turn = 'enemy'; b.battleMsg = `${pkm.name} 无法行动……`
    setTimeout(enemyTurn, 500); return
  }

  const move = pkm.moves[moveIndex]; if (!move) return
  if (move.currentPp <= 0) { addLog(`${move.name} 的PP已经用完了！`); return }
  move.currentPp--

  const result = calcDamage(pkm, b.enemy, move)

  if (result.missed) {
    b.battleMsg = '没有命中！'
    if (skipTurnCheck) { b.turn = 'player'; render(); return }
    b.turn = 'enemy'; setTimeout(enemyTurn, 500); return
  }

  // Apply status effects (sleep/paralyze/poison/burn)
  if (result.effectiveness > 0 && move.effect && ['sleep','paralyze','poison','burn','confuse','disable'].includes(move.effect)) {
    handleStatusEffect(b.enemy, move.effect)
  }

  // Apply debuff effects
  if (result.effectiveness > 0 && move.effect && ['accuracyDown','speedDown','atkDown','defDown','spDefDown','spAtkDown','poisonSpeedDown','clearAll'].includes(move.effect)) {
    handleStatusEffect(b.enemy, move.effect)
  }

  // Apply self-buff effects
  if (move.effect === 'atkUp') {
    pkm.tempDebuffs.atk = Math.min(50, (pkm.tempDebuffs.atk || 0) + 20)
    addLog(`${pkm.name} 的攻击提升了！`)
  } else if (move.effect === 'defUp') {
    pkm.tempDebuffs.def = Math.min(50, (pkm.tempDebuffs.def || 0) + 20)
    addLog(`${pkm.name} 的防御提升了！`)
  } else if (move.effect === 'spAtkUp') {
    pkm.tempDebuffs.spa = Math.min(50, (pkm.tempDebuffs.spa || 0) + 20)
    addLog(`${pkm.name} 的特攻提升了！`)
  } else if (move.effect === 'spDefUp') {
    pkm.tempDebuffs.spd = Math.min(50, (pkm.tempDebuffs.spd || 0) + 20)
    addLog(`${pkm.name} 的特防提升了！`)
  } else if (move.effect === 'speedUp') {
    pkm.tempDebuffs.spe = Math.min(50, (pkm.tempDebuffs.spe || 0) + 20)
    addLog(`${pkm.name} 的速度提升了！`)
  } else if (move.effect === 'evasionUp') {
    pkm.tempDebuffs.evasion = Math.min(50, (pkm.tempDebuffs.evasion || 0) + 20)
    addLog(`${pkm.name} 的回避率提升了！`)
  } else if (move.effect === 'atkUpDefUp') {
    pkm.tempDebuffs.atk = Math.min(50, (pkm.tempDebuffs.atk || 0) + 20)
    pkm.tempDebuffs.def = Math.min(50, (pkm.tempDebuffs.def || 0) + 20)
    addLog(`${pkm.name} 的攻击和防御都提升了！`)
  } else if (move.effect === 'atkUpSpeedUp') {
    pkm.tempDebuffs.atk = Math.min(50, (pkm.tempDebuffs.atk || 0) + 20)
    pkm.tempDebuffs.spe = Math.min(50, (pkm.tempDebuffs.spe || 0) + 20)
    addLog(`${pkm.name} 的攻击和速度都提升了！`)
  } else if (move.effect === 'atkUpSpAtkUp') {
    pkm.tempDebuffs.atk = Math.min(50, (pkm.tempDebuffs.atk || 0) + 20)
    pkm.tempDebuffs.spa = Math.min(50, (pkm.tempDebuffs.spa || 0) + 20)
    addLog(`${pkm.name} 的攻击和特攻都提升了！`)
  } else if (move.effect === 'defUpSpDefUp') {
    pkm.tempDebuffs.def = Math.min(50, (pkm.tempDebuffs.def || 0) + 20)
    pkm.tempDebuffs.spd = Math.min(50, (pkm.tempDebuffs.spd || 0) + 20)
    addLog(`${pkm.name} 的防御和特防都提升了！`)
  } else if (move.effect === 'spAtkUpSpDefUpSpeedUp') {
    pkm.tempDebuffs.spa = Math.min(50, (pkm.tempDebuffs.spa || 0) + 20)
    pkm.tempDebuffs.spd = Math.min(50, (pkm.tempDebuffs.spd || 0) + 20)
    pkm.tempDebuffs.spe = Math.min(50, (pkm.tempDebuffs.spe || 0) + 20)
    addLog(`${pkm.name} 的特攻、特防和速度都提升了！`)
  } else if (move.effect === 'recover') {
    const heal = Math.floor(pkm.maxHp / 2)
    pkm.hp = Math.min(pkm.maxHp, pkm.hp + heal)
    addLog(`${pkm.name} 回复了 ${heal} HP！`)
  } else if (move.effect === 'recoverAll') {
    pkm.hp = pkm.maxHp
    pkm.status = null
    addLog(`${pkm.name} 的HP完全回复了！异常状态也治愈了！`)
  } else if (move.effect === 'leechSeed') {
    b.enemy.leechSeed = true
    addLog(`${b.enemy.name} 被寄生种子寄生了！`)
  }

  // 0威力状态技能：立即渲染显示效果，然后进入敌方回合
  if (move.power === 0) {
    b.battleMsg = `使用了 ${move.name}！`
    render()
    if (skipTurnCheck) { b.turn = 'player'; return }
    b.turn = 'enemy'; setTimeout(enemyTurn, 800); return
  }

  // Apply drain effect
  if (move.effect === 'drain' && result.damage > 0) {
    const heal = Math.max(1, result.damage)
    pkm.hp = Math.min(pkm.maxHp, pkm.hp + heal)
    addLog(`回复了 ${heal} HP！`)
  }

  b.enemy.hp -= result.damage
  if (result.effectiveness >= 2) b.battleMsg = '效果拔群！'
  else if (result.effectiveness === 0) b.battleMsg = '没有效果…'
  else if (result.effectiveness < 1) b.battleMsg = '效果不太好…'
  else b.battleMsg = `使用了 ${move.name}！`
  if (b.enemy.hp <= 0) {
    b.enemy.hp = 0; b.enemy.fainted = true
    addLog(`${b.enemy.name} 倒下了！`)
    b.enemyIndex++
    if (b.enemyIndex < b.enemyTeam.length) {
      b.enemy = b.enemyTeam[b.enemyIndex]; b.enemy.hp = b.enemy.maxHp; b.enemy.status = null
      b.enemy.tempDebuffs = { accuracy: 0, evasion: 0, spe: 0 }
      let prefix = '', msg = ''
      if (b.type === 'trainer') { prefix = `${b.extra.trainer.name} 派出了 `; msg = `${b.extra.trainer.name}：去吧！` }
      else if (b.type === 'gym') { prefix = `${b.extra.data[1]} 派出了 `; msg = `${b.extra.data[1]}：哼！` }
      else if (b.type === 'elite') { prefix = `${b.extra.name} 派出了 `; msg = `${b.extra.name}：还没完！` }
      else if (b.type === 'rival') { prefix = `${b.extra.name} 派出了 `; msg = `${b.extra.name}：还没完呢！` }
      else if (b.type === 'story') { prefix = `${b.extra.name} 派出了 `; msg = `${b.extra.name}：你等着！` }
      else prefix = '野生的 '
      addLog(`${prefix}${b.enemy.name}！`)
      b.battleMsg = msg || ''
      b.turn = 'player'; return
    } else {
      battleVictory(); return
    }
  }
  if (skipTurnCheck) {
    b.turn = 'player'; render(); return
  }
  b.turn = 'enemy'; setTimeout(enemyTurn, 500)
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
  } else if (b.type === 'story') {
    if (b.extra.onFinish) {
      const r = b.extra.onFinish(); if (r) msg = r
    }
  }
  addLog(msg)
  addLog(`获得 ${totalExp} 点经验值！`)
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
    addLog('????????????')
    handlePlayerDefeat(b)
    G.battle = null; saveGame(); return false
  }

  if (b.enemy.status && checkStatusSkip(b.enemy)) {
    b.battleMsg = `${b.enemy.name} ??????`; return false
  }

  const usable = b.enemy.moves.filter(m => m.currentPp > 0)
  if (!usable.length) { return false }
  const move = usable[Math.floor(Math.random() * usable.length)]
  move.currentPp--

  if (move.effect && ['sleep','paralyze','poison','burn','confuse','disable'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  }

  if (move.effect && ['accuracyDown','speedDown','atkDown','defDown','spDefDown','spAtkDown','poisonSpeedDown','clearAll'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  }

  // Enemy self-buff effects
  if (move.effect === 'atkUp') {
    b.enemy.tempDebuffs.atk = Math.min(50, (b.enemy.tempDebuffs.atk || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'defUp') {
    b.enemy.tempDebuffs.def = Math.min(50, (b.enemy.tempDebuffs.def || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'spAtkUp') {
    b.enemy.tempDebuffs.spa = Math.min(50, (b.enemy.tempDebuffs.spa || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'spDefUp') {
    b.enemy.tempDebuffs.spd = Math.min(50, (b.enemy.tempDebuffs.spd || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'speedUp') {
    b.enemy.tempDebuffs.spe = Math.min(50, (b.enemy.tempDebuffs.spe || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'evasionUp') {
    b.enemy.tempDebuffs.evasion = Math.min(50, (b.enemy.tempDebuffs.evasion || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'atkUpDefUp') {
    b.enemy.tempDebuffs.atk = Math.min(50, (b.enemy.tempDebuffs.atk || 0) + 20)
    b.enemy.tempDebuffs.def = Math.min(50, (b.enemy.tempDebuffs.def || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'atkUpSpeedUp') {
    b.enemy.tempDebuffs.atk = Math.min(50, (b.enemy.tempDebuffs.atk || 0) + 20)
    b.enemy.tempDebuffs.spe = Math.min(50, (b.enemy.tempDebuffs.spe || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'atkUpSpAtkUp') {
    b.enemy.tempDebuffs.atk = Math.min(50, (b.enemy.tempDebuffs.atk || 0) + 20)
    b.enemy.tempDebuffs.spa = Math.min(50, (b.enemy.tempDebuffs.spa || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'defUpSpDefUp') {
    b.enemy.tempDebuffs.def = Math.min(50, (b.enemy.tempDebuffs.def || 0) + 20)
    b.enemy.tempDebuffs.spd = Math.min(50, (b.enemy.tempDebuffs.spd || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'spAtkUpSpDefUpSpeedUp') {
    b.enemy.tempDebuffs.spa = Math.min(50, (b.enemy.tempDebuffs.spa || 0) + 20)
    b.enemy.tempDebuffs.spd = Math.min(50, (b.enemy.tempDebuffs.spd || 0) + 20)
    b.enemy.tempDebuffs.spe = Math.min(50, (b.enemy.tempDebuffs.spe || 0) + 20)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'recover') {
    const heal = Math.floor(b.enemy.maxHp / 2)
    b.enemy.hp = Math.min(b.enemy.maxHp, b.enemy.hp + heal)
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'recoverAll') {
    b.enemy.hp = b.enemy.maxHp
    b.enemy.status = null
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  } else if (move.effect === 'leechSeed') {
    pkm.leechSeed = true
    b.battleMsg = `使用了 ${move.name}！`
    render(); return true
  }

  const result = calcDamage(b.enemy, pkm, move)
  if (result.missed) { b.battleMsg = '?????'; return true }

  if (move.effect === 'drain' && result.damage > 0) {
    const heal = Math.max(1, result.damage)
    b.enemy.hp = Math.min(b.enemy.maxHp, b.enemy.hp + heal)
    addLog(`${b.enemy.name} ??? ${heal} HP?`)
  }

  if (result.effectiveness >= 2) b.battleMsg = '?????'
  else if (result.effectiveness === 0) b.battleMsg = '??????'
  else if (result.effectiveness < 1) b.battleMsg = '???????'
  else b.battleMsg = `????? ${move.name}?`

  pkm.hp -= result.damage
  if (pkm.hp <= 0) {
    pkm.hp = 0; pkm.fainted = true
    addLog(`${pkm.name} ????`)
    const next = getActivePokemon()
    if (next) { addLog(`???${next.name}?`); b.subState = 'main' }
    else {
      addLog('???????????????')
      handlePlayerDefeat(b)
      G.battle = null; saveGame(); return false
    }
  }
  return true
}

function enemyTurn() {
  const b = G.battle; if (!b || !b.enemy || b.enemy.fainted) return
  const pkm = getActivePokemon(); if (!pkm) {
    addLog('????????????')
    handlePlayerDefeat(b)
    G.battle = null; saveGame(); render(); return
  }

  if (b.enemy.status && checkStatusSkip(b.enemy)) {
    b.battleMsg = `${b.enemy.name} ??????`
    b.turn = 'player'; render(); return
  }

  const usable = b.enemy.moves.filter(m => m.currentPp > 0)
  if (!usable.length) { b.turn = 'player'; render(); return }
  const move = usable[Math.floor(Math.random() * usable.length)]
  move.currentPp--

  if (move.effect && ['sleep','paralyze'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `????? ${move.name}?`
    b.turn = 'player'; render(); return
  }

  if (move.effect && ['accuracyDown','speedDown'].includes(move.effect)) {
    const eff = getEffectiveness(move.type, pkm.types)
    if (eff > 0) handleStatusEffect(pkm, move.effect)
    b.battleMsg = `????? ${move.name}?`
    b.turn = 'player'; render(); return
  }

  const result = calcDamage(b.enemy, pkm, move)
  if (result.missed) { b.battleMsg = '?????'; b.turn = 'player'; render(); return }

  if (move.effect === 'drain' && result.damage > 0) {
    const heal = Math.max(1, result.damage)
    b.enemy.hp = Math.min(b.enemy.maxHp, b.enemy.hp + heal)
    addLog(`${b.enemy.name} ??? ${heal} HP?`)
  }

  if (result.effectiveness >= 2) b.battleMsg = '?????'
  else if (result.effectiveness === 0) b.battleMsg = '??????'
  else if (result.effectiveness < 1) b.battleMsg = '???????'
  else b.battleMsg = `????? ${move.name}?`
  pkm.hp -= result.damage
  if (pkm.hp <= 0) {
    pkm.hp = 0; pkm.fainted = true
    addLog(`${pkm.name} ????`)
    const next = getActivePokemon()
    if (next) { addLog(`???${next.name}?`); b.subState = 'main' }
    else {
      addLog('???????????????')
      handlePlayerDefeat(b)
      G.battle = null; saveGame(); render(); return
    }
  }
  b.turn = 'player'; render()
}

function handlePlayerDefeat(b) {
  if (b.type === 'wild') {
    addLog('??????????')
    healAll()
    G.player.position = findNearestCenter()
    return
  }
  if (G.player.position === 'mtMoon') {
    addLog('????????????????????')
    healAll()
    G.player.position = 'route3'
    return
  }
  addLog(`???? ${b.type === 'trainer' ? b.extra.trainer.name : b.type === 'gym' ? b.extra.data[1] : b.extra ? b.extra.name : '??'}??`)
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
  const b = G.battle; if (!b || !b.enemy) return
  if (b.type !== 'wild') { addLog('不能在训练家对战中使用精灵球！'); return }
  let ball = G.bagView === 'superball' ? 'superball' : G.bagView === 'ultraball' ? 'ultraball' : G.bagView === 'safariBall' ? 'safariBall' : 'pokeball'
  if (!G.player.items[ball] || G.player.items[ball] <= 0) { addLog('没有这个球了！'); return }
  if (ball === 'safariBall' && G.player.position !== 'safariZone') { addLog('狩猎球只能在狩猎地带使用！'); return }
  G.player.items[ball]--
  const item = ITEMS[ball]
  const base = getPokemonData(b.enemy.id)
  const rate = base ? base[8] : 255
  const a = Math.floor((3 * b.enemy.maxHp - 2 * Math.max(0, b.enemy.hp)) * rate / (3 * b.enemy.maxHp))
  const chance = Math.min(1, (a * item.catchRate) / 255)
  addLog(`你丢出了 ${item.name}！`)
  b.battleMsg = '1… 2… 3…'
  if (Math.random() < chance) {
    b.battleMsg = `成功捕捉了 ${b.enemy.name}！`
    addLog(`★ 成功捕捉了 ${b.enemy.name}！`)
    if (G.player.pokemon.length < 6) G.player.pokemon.push(b.enemy)
    else { G.player.pc.push(b.enemy); addLog(`${b.enemy.name} 被传送到了电脑中。`) }
    b.enemy = null; G.battle = null; saveGame(); render()
  } else {
    addLog(`${b.enemy.name} 挣脱了！`); b.turn = 'enemy'; setTimeout(enemyTurn, 500)
  }
}

function tryFlee() {
  const b = G.battle; if (!b || (b.type !== 'wild')) { addLog('不能逃跑！'); return }
  const pkm = getActivePokemon(); if (!pkm) return
  const chance = Math.min(0.9, 0.5 + (pkm.spe - b.enemy.spe) / 200)
  if (Math.random() < chance) { addLog('成功逃跑了！'); G.battle = null; saveGame(); render() }
  else { b.battleMsg = '无法逃脱！'; addLog('逃跑失败！'); b.turn = 'enemy'; setTimeout(enemyTurn, 500) }
}

function useItem(itemKey) {
  const item = ITEMS[itemKey]; if (!item) return
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
      G.battle.turn = 'enemy'
      G.battle.subState = 'main'
      G.battle.battleMsg = `使用了 ${item.name}，${target.name} 的HP回复了！`
      render()
      setTimeout(enemyTurn, 800)
    }
    saveGame()
  }
}
