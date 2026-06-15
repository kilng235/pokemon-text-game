function startWildBattle() {
  const area = AREAS[G.player.position || 'grass']
  if (!area || !area.encounters) return false
  const { encounters } = area
  const roll = Math.random() * 100
  let tier = 'common'
  if (roll < encounters.common.weight) tier = 'common'
  else if (roll < encounters.common.weight + encounters.uncommon.weight) tier = 'uncommon'
  else tier = 'rare'
  const pool = encounters[tier]
  const id = pool.ids[Math.floor(Math.random() * pool.ids.length)]
  const [min, max] = pool.levelRange
  const level = min + Math.floor(Math.random() * (max - min + 1))
  const wild = createPokemon(id, level)
  const playerPkm = getActivePokemon()
  if (!playerPkm) {
    addLog('你没有能战斗的宝可梦！')
    return false
  }
  G.battle = {
    type: 'wild',
    enemy: wild,
    turn: 'player',
    captured: false,
    ran: false,
    subState: 'main',
  }
  addLog(`野生的 ${wild.name} 出现了！ (Lv.${wild.level})`)
  return true
}

function startGymBattle(leaderKey) {
  const area = AREAS[leaderKey]
  if (!area || !area.leader) return false
  const leader = area.leader
  if (leader.badge <= G.player.badge) {
    addLog('你已经打败过这个道馆了！')
    return false
  }
  const playerPkm = getActivePokemon()
  if (!playerPkm) {
    addLog('你没有能战斗的宝可梦！')
    return false
  }
  const enemyTeam = leader.pokemon.map(p => createPokemon(p.id, p.level))
  G.battle = {
    type: 'gym',
    enemy: enemyTeam[0],
    enemyTeam,
    enemyIndex: 0,
    leader: leader,
    turn: 'player',
    captured: false,
    ran: false,
    subState: 'main',
  }
  addLog(`道馆馆主 ${leader.name} 向你发起了挑战！`)
  addLog(`${leader.name} 派出了 ${enemyTeam[0].name}！ (Lv.${enemyTeam[0].level})`)
  return true
}

function calcDamage(atkPkm, defPkm, move) {
  const atkStat = move.type === '火' || move.type === '水' || move.type === '草' || move.type === '电' || move.type === '超能' || move.type === '幽灵' || move.type === '龙' ? atkPkm.spa : atkPkm.atk
  const defStat = move.type === '火' || move.type === '水' || move.type === '草' || move.type === '电' || move.type === '超能' || move.type === '幽灵' || move.type === '龙' ? defPkm.spd : defPkm.def
  const levelFactor = Math.floor((2 * atkPkm.level) / 5 + 2)
  const power = move.power || 40
  let damage = Math.floor(Math.floor((levelFactor * atkStat * power) / defStat) / 50 + 2)
  const eff = getEffectiveness(move.type, defPkm.types)
  damage = Math.floor(damage * eff)
  const rand = 0.85 + Math.random() * 0.15
  damage = Math.max(1, Math.floor(damage * rand))
  let msg = `${atkPkm.name} 使用了 ${move.name}！`
  if (eff >= 2) msg += ' 效果拔群！'
  else if (eff <= 0.5 && eff > 0) msg += ' 效果不太好…'
  else if (eff === 0) msg += ' 对对手没有效果…'
  addLog(msg)
  return { damage, effectiveness: eff }
}

function playerAttack(moveIndex) {
  const b = G.battle
  if (!b || b.turn !== 'player') return
  const playerPkm = getActivePokemon()
  if (!playerPkm) return
  const move = playerPkm.moves[moveIndex]
  if (!move) return
  if (move.currentPp <= 0) {
    addLog(`${move.name} 的PP已经用完了！`)
    return
  }
  move.currentPp--
  const result = calcDamage(playerPkm, b.enemy, move)
  b.enemy.hp -= result.damage
  if (b.enemy.hp <= 0) {
    b.enemy.hp = 0
    b.enemy.fainted = true
    addLog(`${b.enemy.name} 倒下了！`)
    if (b.type === 'wild') {
      const exp = Math.floor(b.enemy.level * POKEMON_DATA.find(p => p.id === b.enemy.id).exp / 7)
      addLog(`获得 ${exp} 点经验值！`)
      addExp(playerPkm, exp)
      b.enemy = null
      G.battle = null
      saveGame()
      return
    } else if (b.type === 'gym') {
      b.enemyIndex++
      if (b.enemyIndex < b.enemyTeam.length) {
        b.enemy = b.enemyTeam[b.enemyIndex]
        b.enemy.fainted = false
        b.enemy.hp = b.enemy.maxHp
        addLog(`${b.leader.name} 派出了 ${b.enemy.name}！`)
        b.turn = 'player'
        return
      } else {
        addLog(`★ 你击败了道馆馆主 ${b.leader.name}！`)
        const badge = b.leader.badge
        G.player.badge = badge
        G.player.money += b.leader.rewardMoney || 0
        addLog(`获得 ${b.leader.name} 的徽章！`)
        addLog(`获得 ¥${b.leader.rewardMoney || 0}`)
        const exp = b.enemyTeam.reduce((sum, p) => {
          return sum + Math.floor(p.level * POKEMON_DATA.find(d => d.id === p.id).exp / 7)
        }, 0)
        const active = getActivePokemon()
        if (active) {
          addLog(`获得 ${exp} 点经验值！`)
          addExp(active, exp)
        }
        G.battle = null
        saveGame()
        return
      }
    }
  }
  b.turn = 'enemy'
  setTimeout(enemyTurn, 600)
}

function enemyTurn() {
  const b = G.battle
  if (!b || !b.enemy || b.enemy.fainted) return
  const playerPkm = getActivePokemon()
  if (!playerPkm) {
    addLog('你没有能战斗的宝可梦了！')
    if (b.type === 'gym') {
      addLog(`你输给了 ${b.leader.name}……`)
      G.battle = null
      saveGame()
    }
    return
  }
  const usableMoves = b.enemy.moves.filter(m => m.currentPp > 0)
  if (usableMoves.length === 0) {
    addLog(`${b.enemy.name} 因PP耗尽而无法行动！`)
    b.turn = 'player'
    render()
    return
  }
  const move = usableMoves[Math.floor(Math.random() * usableMoves.length)]
  move.currentPp--
  const result = calcDamage(b.enemy, playerPkm, move)
  playerPkm.hp -= result.damage
  if (playerPkm.hp <= 0) {
    playerPkm.hp = 0
    playerPkm.fainted = true
    addLog(`${playerPkm.name} 倒下了！`)
    const next = getActivePokemon()
    if (next) {
      addLog(`上吧！${next.name}！`)
      b.subState = 'main'
    } else {
      addLog('所有宝可梦都失去了战斗能力……')
      if (b.type === 'gym') {
        addLog(`你输给了 ${b.leader.name}……`)
      } else {
        addLog('你飞回了宝可梦中心……')
        healAll()
        G.player.position = 'center'
      }
      G.battle = null
      saveGame()
      render()
      return
    }
  }
  b.turn = 'player'
  render()
}

function tryCapture() {
  const b = G.battle
  if (!b || b.type !== 'wild' || !b.enemy) return
  const ball = G.bagView === 'superball' ? 'superball' : 'pokeball'
  if (!G.player.items[ball] || G.player.items[ball] <= 0) {
    addLog('你没有这个球了！')
    return
  }
  G.player.items[ball]--
  const item = ITEMS[ball]
  const maxHp = b.enemy.maxHp
  const hp = b.enemy.hp
  const catchRate = POKEMON_DATA.find(p => p.id === b.enemy.id).catchRate
  const a = Math.floor((3 * maxHp - 2 * Math.max(0, hp)) * catchRate / (3 * maxHp))
  const bonus = item.catchRate
  const captureChance = Math.min(1, (a * bonus) / 255)
  addLog(`你丢出了 ${item.name}！`)
  if (Math.random() < captureChance) {
    addLog(`★ 成功捕捉了 ${b.enemy.name}！`)
    if (G.player.pokemon.length < 6) {
      G.player.pokemon.push(b.enemy)
    } else {
      G.player.pc.push(b.enemy)
      addLog(`${b.enemy.name} 被传送到了电脑中。`)
    }
    b.enemy = null
    G.battle = null
    saveGame()
  } else {
    addLog(`${b.enemy.name} 挣脱了！`)
    b.turn = 'enemy'
    setTimeout(enemyTurn, 600)
  }
}

function tryFlee() {
  const b = G.battle
  if (!b || b.type !== 'wild') {
    addLog('不能逃跑！')
    return
  }
  const playerPkm = getActivePokemon()
  if (!playerPkm) return
  const speedDiff = playerPkm.spe - b.enemy.spe
  const chance = Math.min(0.9, 0.5 + speedDiff / 200)
  if (Math.random() < chance) {
    addLog('成功逃跑了！')
    b.ran = true
    G.battle = null
    saveGame()
  } else {
    addLog('逃跑失败！')
    b.turn = 'enemy'
    setTimeout(enemyTurn, 600)
  }
}

function useItem(itemKey) {
  const item = ITEMS[itemKey]
  if (!item) return
  if (!G.player.items[itemKey] || G.player.items[itemKey] <= 0) {
    addLog('没有这个道具了！')
    return
  }
  if (itemKey === 'pokeball' || itemKey === 'superball') {
    G.bagView = itemKey
    tryCapture()
    render()
    return
  }
  if (item.heal) {
    const target = getActivePokemon()
    if (!target) {
      addLog('没有可以回复的宝可梦！')
      return
    }
    if (target.hp >= target.maxHp) {
      addLog(`${target.name} 的HP已满！`)
      return
    }
    G.player.items[itemKey]--
    const maxHeal = item.heal === 999 ? target.maxHp : item.heal
    const actualHeal = Math.min(maxHeal, target.maxHp - target.hp)
    target.hp += actualHeal
    addLog(`使用了 ${item.name}，${target.name} 回复了 ${actualHeal}HP！`)
    if (G.battle && G.battle.turn === 'player') {
      G.battle.turn = 'enemy'
      setTimeout(enemyTurn, 600)
    }
    saveGame()
  }
}
