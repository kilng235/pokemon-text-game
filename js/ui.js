const $ = id => document.getElementById(id)

function render() {
  const v = G.view
  const badgeStr = '●'.repeat(G.player.badge) + '○'.repeat(8 - G.player.badge)
  $('header').textContent = `★ 宝可梦文字版   徽章:${badgeStr}   ¥${G.player.money}`
  if (v === 'start') renderStart()
  else if (v === 'choose') renderChoose()
  else if (v === 'explore') renderExplore()
  else if (v === 'battle') renderBattle()
  else if (v === 'bag') renderBag()
  else if (v === 'pokemon') renderPokemon()
  else if (v === 'pokedex') renderPokedex()
  else if (v === 'shop') renderShop()
  else if (v === 'center') renderCenter()
  else if (v === 'dialogue') renderDialogue()
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
      <p>关都地区 · 151 种宝可梦 · 8 个道馆</p>
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
  for (const id of [4,7,1]) {
    const p = getPokemonData(id)
    if (!p) continue
    grid.innerHTML += `
      <div class="choose-card">
        <div class="pkm-name">${p[1]}</div>
        <div class="pkm-types">${p[2].replace(',',' / ')}</div>
        <div class="pkm-stat">HP:${p[3]} 攻:${p[4]} 防:${p[5]}</div>
        <div class="pkm-stat">特攻:${p[6]} 特防:${p[7]} 速:${p[8]}</div>
        <button class="btn" onclick="selectStarter(${id})">选择 ${p[1]}</button>
      </div>
    `
  }
  $('actions').innerHTML = ''
}

function renderExplore() {
  const loc = getLocation(G.player.position)
  if (!loc) { G.player.position = 'pallet'; render(); return }
  const main = $('main')
  let html = `<div class="location-name">◈ ${loc[0]}</div>
    <div class="loc-type">${loc[2] === 'town' ? '🏘 城镇' : loc[2] === 'route' ? '🌿 道路' : loc[2] === 'cave' ? '⛰ 洞穴' : '🌊 水道'}</div>
    <p class="area-desc">${loc[1]}</p>
    <div class="location-strip">
      ${loc[3] ? '<span class="has-center">🏥 有宝可梦中心</span>' : ''}
      ${loc[2] === 'town' ? '<span class="has-center">🛒 有商店</span>' : ''}
    </div>
    <div class="btn-col">`
  const connections = loc[5] || []
  const labels = LINK_LABELS[G.player.position] || {}
  for (const conn of connections) {
    const c = getLocation(conn)
    if (!c) continue
    let label = labels[conn] || c[0]
    if (c[2] === 'town' && c[3]) label += ' 🏥'
    html += `<button class="btn" onclick="travelTo('${conn}')">→ ${label}</button>`
  }
  if (loc[2] === 'town') {
    for (const [k, v] of Object.entries(GYM_LEADERS)) {
      const townMap = { brock:'pewter', misty:'cerulean', ltSurge:'vermilion', erika:'celadon', sabrina:'saffron', koga:'fuchsia', blaine:'cinnabar', giovanni:'viridian' }
      const tKey = townMap[k]
      if (tKey === G.player.position) {
        if (v[4] <= G.player.badge) {
          html += `<button class="btn disabled">✔ ${v[1]}（已通过）</button>`
        } else {
          html += `<button class="btn" onclick="challengeGym('${k}')">⚔ 挑战 ${v[1]}（${v[3]}属性）</button>`
        }
      }
    }
    html += `<button class="btn" onclick="G.view='shop';render()">🛒 商店</button>`
    html += `<button class="btn" onclick="healAtCenter()">🏥 宝可梦中心</button>`
  }
  if (loc[2] !== 'town') {
    html += `<button class="btn" onclick="tryWildEncounter()">🌿 探索（遇敌）</button>`
  }
  html += `</div>`
  main.innerHTML = html
  $('actions').innerHTML = `
    <button class="btn" onclick="G.view='pokemon';render()">队伍</button>
    <button class="btn" onclick="G.view='bag';render()">背包</button>
    <button class="btn" onclick="G.view='pokedex';render()">图鉴</button>
  `
}

function renderBattle() {
  const b = G.battle
  if (!b || !b.enemy) { G.view = 'explore'; render(); return }
  const pkm = getActivePokemon()
  const hpBar = (hp, max) => {
    const pct = Math.max(0, hp / max)
    return '█'.repeat(Math.floor(pct*10)) + '░'.repeat(10-Math.floor(pct*10))
  }
  const main = $('main')
  main.innerHTML = `
    <div class="battle-enemy">
      <span class="pkm-name">${b.enemy.name}</span>
      <span class="pkm-level">Lv.${b.enemy.level}</span>
      <span class="pkm-types">${b.enemy.types.join('/')}</span>
      <div class="hp-row">HP: ${hpBar(b.enemy.hp,b.enemy.maxHp)} ${b.enemy.hp}/${b.enemy.maxHp}</div>
    </div>
    <div class="battle-divider">━━ V.S. ━━</div>
    <div class="battle-player">
      <span class="pkm-name">${pkm ? pkm.name : '---'}</span>
      <span class="pkm-level">${pkm ? 'Lv.'+pkm.level : ''}</span>
      <span class="pkm-types">${pkm ? pkm.types.join('/') : ''}</span>
      <div class="hp-row">HP: ${pkm ? hpBar(pkm.hp,pkm.maxHp)+' '+pkm.hp+'/'+pkm.maxHp : '倒下了'}</div>
      ${pkm ? `<div class="exp-row">EXP: ${pkm.exp}/${pkm.nextLevel}</div>` : ''}
    </div>
    <div class="battle-status">#${b.enemyIndex+1}/${b.enemyTeam.length} ${b.type==='gym'?'🏛'+b.extra.data[1]:b.type==='elite'?'👑四天王':b.type==='story'?'💀'+b.extra.name:'🌿野生'}</div>
  `
  const actions = $('actions')
  if (b.subState === 'main') {
    actions.innerHTML = `
      <button class="btn" onclick="battleSub('attack')">⚔ 攻击</button>
      <button class="btn" onclick="battleSub('switch')">🔄 换宠</button>
      <button class="btn" onclick="battleSub('item')">🎒 道具</button>
      ${b.type === 'wild' ? '<button class="btn" onclick="tryFlee()">🏃 逃跑</button>' : ''}
    `
  } else if (b.subState === 'attack') {
    if (!pkm) { actions.innerHTML = '<button class="btn" onclick="battleSub(\'switch\')">换宠</button>'; return }
    let html = ''
    for (let i = 0; i < pkm.moves.length; i++) {
      const m = pkm.moves[i]
      const d = m.currentPp <= 0 ? 'disabled' : ''
      html += `<button class="btn ${d}" onclick="playerAttack(${i})">${m.name}[${m.type}] 威:${m.power} PP:${m.currentPp}/${m.pp}</button>`
    }
    html += '<button class="btn" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  } else if (b.subState === 'switch') {
    let html = ''
    for (let i = 0; i < G.player.pokemon.length; i++) {
      const p = G.player.pokemon[i]
      const a = p === getActivePokemon()
      const ok = !p.fainted && p.hp > 0 && !a
      html += `<button class="btn ${ok?'':'disabled'}" onclick="${ok?`switchPokemon(${i})`:''}">${p.name} Lv.${p.level}${a?'[战中]':''}${p.fainted?'[濒死]':''}</button>`
    }
    html += '<button class="btn" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  } else if (b.subState === 'item') {
    let html = ''
    for (const [key, val] of Object.entries(ITEMS)) {
      const c = G.player.items[key] || 0
      if (c <= 0) continue
      html += `<button class="btn" onclick="useItemInBattle('${key}')">${val.name} x${c}</button>`
    }
    html += '<button class="btn" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  }
}

function renderDialogue() {
  const d = G.dialogue
  if (!d) { G.view = 'explore'; render(); return }
  const main = $('main')
  let html = `<div class="dialogue-box"><div class="dialogue-text">`
  for (const line of d.lines.slice(0, d.index + 1)) {
    html += line.speaker ? `<p><b>${line.speaker}：</b>${line.text}</p>` : `<p>${line.text}</p>`
  }
  html += `</div>`
  if (d.index >= d.lines.length - 1) {
    if (d.battle) {
      html += `<button class="btn" onclick="startDialogueBattle()">⚔ 战斗！</button>`
    } else {
      html += `<button class="btn" onclick="finishDialogue()">继续</button>`
    }
  } else {
    html += `<button class="btn" onclick="advanceDialogue()">继续 &gt;</button>`
    if (d.canSkip) html += `<button class="btn" onclick="skipDialogue()">跳过 &gt;&gt;</button>`
  }
  html += `</div>`
  main.innerHTML = html
  $('actions').innerHTML = ''
}

function renderBag() {
  const main = $('main')
  main.innerHTML = '<p class="section-title">🎒 背包</p><div class="item-list"></div>'
  const list = main.querySelector('.item-list')
  for (const [key, val] of Object.entries(ITEMS)) {
    const count = G.player.items[key] || 0
    list.innerHTML += `
      <div class="item-row">
        <span>${val.name} x${count}</span>
        <span class="item-desc">${val.desc}</span>
        <button class="btn small" onclick="useItemFromBag('${key}')" ${count<=0?'disabled':''}>使用</button>
      </div>`
  }
  $('actions').innerHTML = '<button class="btn" onclick="closeBag()">↩ 返回</button>'
}

function renderPokemon() {
  const main = $('main')
  main.innerHTML = '<p class="section-title">✦ 宝可梦队伍</p><div class="pkm-list"></div>'
  const list = main.querySelector('.pkm-list')
  for (let i = 0; i < Math.max(6, G.player.pokemon.length); i++) {
    const p = G.player.pokemon[i]
    if (p) {
      const hb = '█'.repeat(Math.max(1,Math.floor(p.hp/Math.max(1,p.maxHp)*8)))+'░'.repeat(8-Math.max(1,Math.floor(p.hp/Math.max(1,p.maxHp)*8)))
      list.innerHTML += `
        <div class="pkm-card">
          <div class="pkm-name">${p.name} <span class="pkm-level">Lv.${p.level}</span></div>
          <div class="pkm-types">${p.types.join(' / ')}</div>
          <div>HP: ${hb} ${p.hp}/${p.maxHp}${p.fainted?' ⚠濒死':''}</div>
          <div class="pkm-moves">${p.moves.map(m=>`${m.name}[${m.type}] 威:${m.power} PP:${m.currentPp}/${m.pp}`).join(' | ')}</div>
          <div class="pkm-exp">EXP: ${p.exp}/${p.nextLevel}</div>
        </div>`
    } else {
      list.innerHTML += '<div class="pkm-card"><div class="empty-slot">[空位]</div></div>'
    }
  }
  $('actions').innerHTML = '<button class="btn" onclick="closeBag()">↩ 返回</button>'
}

function renderPokedex() {
  const main = $('main')
  if (G.pokedexDetail) {
    const p = getPokemonData(G.pokedexDetail)
    if (!p) { G.pokedexDetail = null; renderPokedex(); return }
    const seen = G.player.seen.includes(p[0])
    const evoInfo = p[10] ? `→ Lv.${p[10][0]} ${getPokemonData(p[10][1])?.[1] || '???'}` : '最终形态'
    main.innerHTML = `
      <p class="section-title">📖 #${String(p[0]).padStart(2,'0')} ${seen ? p[1] : '???'}</p>
      <div class="pkm-card" style="border-color:#00ff41;">
        <div class="pkm-types">${seen ? p[2].replace(',',' / ') : '???'}</div>
        <hr style="border-color:#003a10;margin:6px 0;">
        <div class="pkm-stat">HP: ${seen ? p[3] : '???'}</div>
        <div class="pkm-stat">攻击: ${seen ? p[4] : '???'}</div>
        <div class="pkm-stat">防御: ${seen ? p[5] : '???'}</div>
        <div class="pkm-stat">特攻: ${seen ? p[6] : '???'}</div>
        <div class="pkm-stat">特防: ${seen ? p[7] : '???'}</div>
        <div class="pkm-stat">速度: ${seen ? p[8] : '???'}</div>
        <hr style="border-color:#003a10;margin:6px 0;">
        <div class="pkm-stat">捕获率: ${seen ? p[9] : '???'}</div>
        <div class="pkm-stat">进化: ${seen ? evoInfo : '???'}</div>
      </div>
      <div class="btn-row">
        <button class="btn" onclick="G.pokedexDetail=null;render()">↩ 返回列表</button>
      </div>`
  } else {
    main.innerHTML = '<p class="section-title">📖 宝可梦图鉴</p><div class="pokedex-grid"></div>'
    const grid = main.querySelector('.pokedex-grid')
    for (const p of POKEMON) {
      const seen = G.player.seen.includes(p[0])
      grid.innerHTML += `<div class="pkm-card${seen?'':' unseen'}" onclick="${seen?`G.pokedexDetail=${p[0]};render()`:''}" style="cursor:${seen?'pointer':'default'};${seen?'':'opacity:0.45;'}">
        <div class="pkm-name">#${String(p[0]).padStart(2,'0')} ${seen ? p[1] : '???'}</div>
        <div class="pkm-types">${seen ? p[2].replace(',',' / ') : '???'}</div>
      </div>`
    }
  }
  $('actions').innerHTML = '<button class="btn" onclick="G.pokedexDetail=null;G.view=\'explore\';render()">↩ 返回</button>'
}

function renderShop() {
  const main = $('main')
  main.innerHTML = `<p class="section-title">🏪 友好商店</p>
    <div class="shop-list"></div>
    <p>当前余额：¥${G.player.money}</p>`
  const list = main.querySelector('.shop-list')
  for (const [key, val] of Object.entries(ITEMS)) {
    list.innerHTML += `
      <div class="item-row">
        <span>${val.name}</span>
        <span class="item-desc">${val.desc}</span>
        <span>¥${val.price}</span>
        <button class="btn small" onclick="buyItem('${key}')">购买</button>
      </div>`
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
      <button class="btn" onclick="healAtCenter()" ${hasInjured?'':'disabled'}>回复所有宝可梦</button>
      <button class="btn" onclick="G.view='explore';render();saveGame()">不用了，谢谢</button>
    </div>`
  $('actions').innerHTML = ''
}

function renderLog() {
  const logDiv = $('log')
  logDiv.innerHTML = G.logs.slice(-6).map(l => '> ' + l).join('<br>')
  logDiv.scrollTop = logDiv.scrollHeight
}
