const $ = id => document.getElementById(id)

function render() {
  const v = G.view
  $('header').textContent = `★ 宝可梦文字版   徽章: ${'●'.repeat(G.player.badge)}${'○'.repeat(2 - G.player.badge)}    ¥${G.player.money}`
  if (v === 'start') renderStart()
  else if (v === 'choose') renderChoose()
  else if (v === 'explore') renderExplore()
  else if (v === 'battle') renderBattle()
  else if (v === 'bag') renderBag()
  else if (v === 'pokemon') renderPokemon()
  else if (v === 'shop') renderShop()
  else if (v === 'center') renderCenter()
  renderLog()
}

function renderStart() {
  const main = $('main')
  main.innerHTML = `
    <div class="start-box">
      <pre class="title-art">
╔═══════════════════════════════╗
║      宝 可 梦 文字版         ║
║     POKEMON TEXT EDITION     ║
╚═══════════════════════════════╝
      </pre>
      <p class="start-desc">欢迎来到宝可梦的世界！</p>
      <p>在这个文字的世界中，你将和宝可梦一起展开冒险。</p>
      <div class="btn-row">
        <button onclick="startNewGame()" class="btn">开始新游戏</button>
        <button onclick="continueGame()" class="btn" id="continueBtn">继续游戏</button>
      </div>
    </div>
  `
  $('continueBtn').style.display = loadGame() ? '' : 'none'
  $('actions').innerHTML = ''
}

function renderChoose() {
  const main = $('main')
  main.innerHTML = `<p class="section-title">选择你的初始宝可梦：</p><div class="choose-grid"></div>`
  const grid = main.querySelector('.choose-grid')
  const starters = [11, 14, 17]
  for (const id of starters) {
    const p = POKEMON_DATA.find(d => d.id === id)
    if (!p) continue
    const div = document.createElement('div')
    div.className = 'choose-card'
    div.innerHTML = `
      <div class="pkm-name">${p.name}</div>
      <div class="pkm-types">${p.types.join(' / ')}</div>
      <div class="pkm-stat">HP:${p.stats.hp} 攻:${p.stats.atk} 防:${p.stats.def}</div>
      <div class="pkm-stat">特攻:${p.stats.spa} 特防:${p.stats.spd} 速:${p.stats.spe}</div>
      <button class="btn" onclick="selectStarter(${id})">选择 ${p.name}</button>
    `
    grid.appendChild(div)
  }
  $('actions').innerHTML = ''
}

function renderExplore() {
  const area = AREAS[G.player.position]
  const main = $('main')
  let html = `
    <div class="location-name">◈ ${area.name}</div>
    <p class="area-desc">${area.desc}</p>
    <div class="btn-col">
  `
  const linkKeys = area.links || []
  if (G.player.position === 'town') {
    for (const key of linkKeys) {
      if (key === 'gym1' && G.player.badge >= 1) {
        html += '<button class="btn disabled">✔ 小霞道馆（已通过）</button>'
        continue
      }
      if (key === 'gym2' && G.player.badge >= 2) {
        html += '<button class="btn disabled">✔ 小刚道馆（已通过）</button>'
        continue
      }
      let label = key
      let disabled = ''
      if (key === 'grass') label = '🌿 常青草丛'
      else if (key === 'gym1') label = '🏛 小霞道馆（需0徽章）'
      else if (key === 'gym2') {
        label = G.player.badge >= 1 ? '🏛 小刚道馆' : '🏛 小刚道馆（需1徽章）'
        if (G.player.badge < 1) disabled = 'disabled'
      }
      else if (key === 'center') label = '🏥 宝可梦中心'
      else if (key === 'shop') label = '🏪 友好商店'
      html += `<button class="btn ${disabled}" onclick="travelTo('${key}')">${label}</button>`
    }
    html += '</div><p style="margin-top:8px;color:#0a0;">▼ 点击上方按钮探索</p>'
  } else {
    const backKey = linkKeys.includes('town') ? 'town' : (linkKeys[0] || 'town')
    html += `<button class="btn" onclick="travelTo('${backKey}')">🏘 返回 ${AREAS[backKey] ? AREAS[backKey].name : '真新镇'}</button>`
    if (G.player.position === 'grass') {
      html += '<button class="btn" onclick="tryWildEncounter()">🌿 继续探索</button>'
    }
    html += '</div>'
  }
  main.innerHTML = html
  $('actions').innerHTML = `
    <button class="btn" onclick="G.view='pokemon';render()">队伍</button>
    <button class="btn" onclick="G.view='bag';render()">背包</button>
  `
}

function renderBattle() {
  const b = G.battle
  if (!b || !b.enemy) { G.view = 'explore'; render(); return }
  const pkm = getActivePokemon()
  const main = $('main')
  const hpBar = (hp, max) => {
    const pct = Math.max(0, hp / max)
    const full = Math.floor(pct * 10)
    const empty = 10 - full
    return '█'.repeat(full) + '░'.repeat(empty)
  }
  main.innerHTML = `
    <div class="battle-enemy">
      <span class="pkm-name">${b.enemy.name}</span>
      <span class="pkm-level">Lv.${b.enemy.level}</span>
      <div class="hp-row">HP: ${hpBar(b.enemy.hp, b.enemy.maxHp)} ${b.enemy.hp}/${b.enemy.maxHp}</div>
      <div class="pkm-types">${b.enemy.types.join(' / ')}</div>
    </div>
    <div class="battle-divider">━━━━━━━━━━━━━━━━━━━━━━━━</div>
    <div class="battle-player">
      <span class="pkm-name">${pkm ? pkm.name : '---'}</span>
      <span class="pkm-level">${pkm ? 'Lv.' + pkm.level : ''}</span>
      <div class="hp-row">HP: ${pkm ? hpBar(pkm.hp, pkm.maxHp) + ' ' + pkm.hp + '/' + pkm.maxHp : '倒下了'}</div>
      <div class="pkm-types">${pkm ? pkm.types.join(' / ') : ''}</div>
    </div>
  `
  const actions = $('actions')
  if (b.subState === 'main') {
    actions.innerHTML = `
      <button class="btn" onclick="battleSub('attack')">⚔ 攻击</button>
      <button class="btn" onclick="battleSub('switch')">🔄 换宠</button>
      <button class="btn" onclick="battleSub('item')">🎒 道具</button>
      <button class="btn" onclick="tryFlee()">🏃 逃跑</button>
    `
  } else if (b.subState === 'attack') {
    if (!pkm) { actions.innerHTML = '<button class="btn" onclick="battleSub(\'switch\')">换宠</button>'; return }
    let html = ''
    for (let i = 0; i < pkm.moves.length; i++) {
      const m = pkm.moves[i]
      const disabled = m.currentPp <= 0 ? 'disabled' : ''
      html += `<button class="btn ${disabled}" onclick="playerAttack(${i})" ${disabled ? '' : ''}>${m.name} [${m.type}] 威力:${m.power} PP:${m.currentPp}/${m.pp}</button>`
    }
    html += '<button class="btn" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  } else if (b.subState === 'switch') {
    let html = ''
    for (let i = 0; i < G.player.pokemon.length; i++) {
      const p = G.player.pokemon[i]
      const active = p === getActivePokemon()
      const canSwitch = !p.fainted && p.hp > 0 && !active
      html += `<button class="btn ${canSwitch ? '' : 'disabled'}" onclick="${canSwitch ? `switchPokemon(${i})` : ''}">${p.name} Lv.${p.level} ${active ? '[战斗中]' : ''} ${p.fainted ? '[濒死]' : 'HP:' + p.hp + '/' + p.maxHp}</button>`
    }
    html += '<button class="btn" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  } else if (b.subState === 'item') {
    let html = ''
    for (const [key, val] of Object.entries(ITEMS)) {
      const count = G.player.items[key] || 0
      if (count <= 0) continue
      html += `<button class="btn" onclick="useItemInBattle('${key}')">${val.name} x${count}</button>`
    }
    html += '<button class="btn" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  }
}

function renderBag() {
  const main = $('main')
  main.innerHTML = '<p class="section-title">🎒 背包</p><div class="item-list"></div>'
  const list = main.querySelector('.item-list')
  for (const [key, val] of Object.entries(ITEMS)) {
    const count = G.player.items[key] || 0
    const div = document.createElement('div')
    div.className = 'item-row'
    div.innerHTML = `
      <span>${val.name} x${count}</span>
      <span class="item-desc">${val.desc}</span>
      <button class="btn small" onclick="useItemFromBag('${key}')" ${count <= 0 ? 'disabled' : ''}>使用</button>
    `
    list.appendChild(div)
  }
  $('actions').innerHTML = '<button class="btn" onclick="closeBag()">↩ 返回</button>'
}

function renderPokemon() {
  const main = $('main')
  main.innerHTML = '<p class="section-title">✦ 宝可梦队伍</p><div class="pkm-list"></div>'
  const list = main.querySelector('.pkm-list')
  for (let i = 0; i < Math.max(6, G.player.pokemon.length); i++) {
    const p = G.player.pokemon[i]
    const div = document.createElement('div')
    div.className = 'pkm-card'
    if (p) {
      const hpBar = '█'.repeat(Math.max(1, Math.floor(p.hp / Math.max(1, p.maxHp) * 8))) + '░'.repeat(8 - Math.max(1, Math.floor(p.hp / Math.max(1, p.maxHp) * 8)))
      div.innerHTML = `
        <div class="pkm-name">${p.name} <span class="pkm-level">Lv.${p.level}</span></div>
        <div class="pkm-types">${p.types.join(' / ')}</div>
        <div>HP: ${hpBar} ${p.hp}/${p.maxHp}</div>
        <div class="pkm-moves">${p.moves.map(m => `${m.name}[${m.type}] 威:${m.power} PP:${m.currentPp}/${m.pp}`).join(' ')}</div>
        <div class="pkm-exp">EXP: ${p.exp}/${p.nextLevel}</div>
      `
    } else {
      div.innerHTML = '<div class="empty-slot">[空位]</div>'
    }
    list.appendChild(div)
  }
  $('actions').innerHTML = '<button class="btn" onclick="closeBag()">↩ 返回</button>'
}

function renderShop() {
  const main = $('main')
  main.innerHTML = '<p class="section-title">🏪 友好商店</p><div class="shop-list"></div><p>当前余额：¥' + G.player.money + '</p>'
  const list = main.querySelector('.shop-list')
  const area = AREAS.shop
  for (const key of area.inventory) {
    const item = ITEMS[key]
    const div = document.createElement('div')
    div.className = 'item-row'
    div.innerHTML = `
      <span>${item.name}</span>
      <span class="item-desc">${item.desc}</span>
      <span>¥${item.price}</span>
      <button class="btn small" onclick="buyItem('${key}')">购买</button>
    `
    list.appendChild(div)
  }
  $('actions').innerHTML = '<button class="btn" onclick="G.view=\'explore\';render();saveGame()">↩ 离开商店</button>'
}

function renderCenter() {
  const main = $('main')
  const hasInjured = G.player.pokemon.some(p => p.hp < p.maxHp || p.fainted)
  main.innerHTML = `
    <p class="section-title">🏥 宝可梦中心</p>
    <p>乔伊小姐：欢迎光临！需要回复宝可梦吗？</p>
    <div class="btn-row">
      <button class="btn" onclick="healAtCenter()" ${hasInjured ? '' : 'disabled'}>回复所有宝可梦</button>
      <button class="btn" onclick="G.view='explore';render();saveGame()">不用了，谢谢</button>
    </div>
  `
  $('actions').innerHTML = ''
}

function renderLog() {
  const logDiv = $('log')
  const recent = G.logs.slice(-6)
  logDiv.innerHTML = recent.map(l => '> ' + l).join('<br>')
  logDiv.scrollTop = logDiv.scrollHeight
}
