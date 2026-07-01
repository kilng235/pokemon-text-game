const $ = id => document.getElementById(id)

function spriteHTML(id, isShiny, extraClass) {
  const shinyClass = isShiny ? ' shiny' : ''
  const shinyStars = isShiny ? '<div class="shiny-stars"><span></span><span></span><span></span></div>' : ''
  const cls = extraClass || ''
  const src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${id}.png`
  return `<div class="sprite-container${shinyClass}${cls ? ' ' + cls : ''}">${shinyStars}<div class="sprite-shadow"></div><img class="sprite-img" src="${src}" onerror="this.style.display='none'" loading="lazy"></div>`
}

function render() {
  const v = G.view
  const app = $('app')
  if (app) app.className = v === 'worldMap' ? 'world-map-view' : ''
  const filledBadges = Array(G.player.badge).fill('<span class="badges" style="color:var(--success)">●</span>').join('')
  const emptyBadges = Array(8 - G.player.badge).fill('<span class="badges" style="color:var(--border)">●</span>').join('')
  $('header').innerHTML = `<span>宝可梦文字版</span><span class="badges">${filledBadges}${emptyBadges}</span><span class="money">¥${G.player.money}</span>`
  // 优先处理待学习的技能
  if (G.pendingMoveLearn && G.pendingMoveLearn.length > 0) {
    renderMoveLearn()
    try { renderMap() } catch(e) { console.warn('map:',e) }
    renderLog()
    return
  }
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
  else if (v === 'worldMap') renderWorldMap()
  else if (v === 'choice') renderChoice()
  try { renderMap() } catch(e) { console.warn('map:',e) }
  renderLog()
}

// 学习新技能界面
function renderMoveLearn() {
  const pending = G.pendingMoveLearn
  if (!pending || pending.length === 0) return
  const info = pending[0]
  const pkm = G.player.pokemon[info.pokemonIndex]
  if (!pkm) { G.pendingMoveLearn.shift(); render(); return }
  const moveName = info.moveName
  const main = $('main')
  const hasFourMoves = pkm.moves.length >= 4

  main.innerHTML = `
    <p class="section-title">✦ 学习新技能</p>
    <div class="pkm-card${pkm.isShiny ? ' shiny-card' : ''}" style="border-color:var(--accent);text-align:center;">
      ${spriteHTML(pkm.id, pkm.isShiny)}
      <div class="pkm-name">${pkm.name}${pkm.isShiny ? ' <span class="shiny-badge">✨</span>' : ''} <span class="pkm-level">Lv.${pkm.level}</span></div>
      <p style="margin:10px 0;color:var(--warning);font-size:14px;font-weight:600;">
        ${pkm.name} 想要学习新技能「${info.moveName}」！
      </p>
      ${hasFourMoves ? '<p style="color:var(--danger);font-size:12px;">但' + pkm.name + '已经学会了4个技能……</p>' : ''}
      ${hasFourMoves ? '<p style="color:var(--success);font-size:11px;">是否用新技能替换一个已有技能？</p>' : '<p style="color:var(--success);font-size:12px;">' + pkm.name + '还有空位，自动学会了！</p>'}
    </div>
  `

  if (hasFourMoves) {
    let html = '<p style="color:#33ff77;margin:6px 0;">选择一个要遗忘的技能：</p><div class="btn-col">'
    for (let i = 0; i < pkm.moves.length; i++) {
      const m = pkm.moves[i]
      html += `<button class="btn" onclick="forgetMove(${info.pokemonIndex}, ${i})">❌ ${m.name}[${m.type}] (威力:${m.power})</button>`
    }
    html += `<button class="btn" onclick="skipMove()" style="color:#666;border-color:#333;">↩ 不学习</button>`
    html += '</div>'
    $('actions').innerHTML = html
  } else {
    $('actions').innerHTML = `
      <button class="btn" onclick="learnMoveDirect(${info.pokemonIndex})" style="font-size:14px;">✅ 学习 ${moveName}</button>
      <button class="btn" onclick="skipMove()" style="color:#666;border-color:#333;">↩ 不学习</button>
    `
  }
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
      <p>关都·城都·丰缘 · 386 种宝可梦 · 8 个道馆 · 特性/性格/性别</p>
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
  main.innerHTML = `
    <p class="section-title">🏛 大木博士的研究所</p>
    <p style="color:#00aa33;margin-bottom:10px;">博士把三个精灵球放在桌上，笑眯眯地看着你。</p>
    <div class="choose-grid"></div>
  `
  const grid = main.querySelector('.choose-grid')
  for (const id of [4,7,1]) {
    const p = getPokemonData(id)
    if (!p) continue
    grid.innerHTML += `
      <div class="choose-card">
        <div class="sprite-container">
          <div class="sprite-shadow"></div>
          <img class="sprite-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" onerror="this.style.display='none'" loading="lazy">
        </div>
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
  const storyKey = checkStoryTrigger(G.player.position)
  if (storyKey) {
    const ev = STORY_EVENTS[storyKey]
    G.dialogue = { eventKey: storyKey, lines: ev.dialogue, index: 0, battle: ev.battle !== null, choices: ev.choices, canSkip: false }
    G.view = 'dialogue'
    render()
    return
  }
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
          html += `<button class="btn disabled">✔ ${v[0]}道馆（已通过）</button>`
        } else {
          html += `<button class="btn" onclick="challengeGym('${k}')">⚔ 挑战 ${v[0]}（${v[2]}属性）</button>`
        }
      }
    }
    html += `<button class="btn" onclick="G.view='shop';render()">🛒 商店</button>`
    if (loc[3]) html += `<button class="btn" onclick="healAtCenter()">🏥 宝可梦中心</button>`
  }
  if (loc[2] !== 'town') {
    const shinyChance = getShinyChance()
    const shinyPercent = (shinyChance * 100).toFixed(2)
    const chain = G.player.shinyChain
    html += `<button class="btn" onclick="tryWildEncounter()">🌿 探索（遇敌）</button>`
    html += `<div style="margin-top:8px;font-size:12px;color:#888;">✨ 闪光连锁: ${chain} 连 (概率: ${shinyPercent}%)</div>`
  }
  html += `</div>`
  main.innerHTML = html
  $('actions').innerHTML = `
    <button class="btn" onclick="toggleMap()">🗺 地图</button>
    <button class="btn" onclick="G.view='pokemon';render()">队伍</button>
    <button class="btn" onclick="G.view='bag';render()">背包</button>
    <button class="btn" onclick="G.view='pokedex';render()">图鉴</button>
    <button class="btn" onclick="restartGame()" style="color:#cc3333;border-color:#cc3333;">重新开始</button>
  `
}

function renderBattle() {
  const b = G.battle
  if (!b || !b.enemy) { G.view = 'explore'; render(); return }
  const pkm = getActivePokemon()
  
  // HP条渲染函数
  const renderHpBar = (pokemon, isEnemy = false) => {
    if (!pokemon) return '<div class="hp-bar-container"><div class="hp-text">倒下了</div></div>'
    const pct = Math.max(0, pokemon.hp / pokemon.maxHp) * 100
    let hpClass = 'hp-bar-fill'
    let textClass = 'hp-text'
    if (pct <= 20) {
      hpClass += ' hp-low'
      textClass += ' hp-low'
    } else if (pct <= 50) {
      hpClass += ' hp-medium'
      textClass += ' hp-medium'
    }
    
    // 检测HP变化并添加波动动画
    const lastHpKey = isEnemy ? 'lastEnemyHp' : 'lastPlayerHp'
    if (!b[lastHpKey] && b[lastHpKey] !== 0) b[lastHpKey] = pokemon.hp
    if (pokemon.hp < b[lastHpKey]) {
      hpClass += ' hp-damaged'
    }
    b[lastHpKey] = pokemon.hp
    
    return `<div class="hp-bar-container">
      <div class="hp-bar-wrapper">
        <div class="${hpClass}" style="width:${pct}%"></div>
      </div>
      <div class="${textClass}">${pokemon.hp}/${pokemon.maxHp}</div>
    </div>`
  }
  
  const hitEnemyClass = b.enemy.hp < (b.lastEnemyHp || b.enemy.maxHp) ? ' hit' : ''
  const hitPlayerClass = pkm && pkm.hp < (b.lastPlayerHp || pkm.maxHp) ? ' hit' : ''
  const faintedEnemy = b.enemy.hp <= 0 || b.enemy.fainted ? ' fainted' : ''
  const faintedPlayer = pkm && (pkm.hp <= 0 || pkm.fainted) ? ' fainted' : ''

  const main = $('main')
  main.innerHTML = `
    <div class="battle-enemy">
      ${spriteHTML(b.enemy.id, b.enemy.isShiny, `enemy${hitEnemyClass}${faintedEnemy}`)}
      <span class="pkm-name">${b.enemy.name}${b.enemy.isShiny ? ' <span class="shiny-badge">✨</span>' : ''}${b.enemy.isElite ? ' <span class="elite-badge">精英</span>' : ''}</span>
      <span class="pkm-level">Lv.${b.enemy.level}</span>
      <span class="pkm-types">${b.enemy.types.join('/')}</span>
      ${renderHpBar(b.enemy, true)}
    </div>
    ${b.battleMsg ? `<div class="battle-msg">${b.battleMsg}</div>` : `<div class="battle-divider">━━ V.S. ━━</div>`}
    <div class="battle-player">
      ${pkm ? spriteHTML(pkm.id, pkm.isShiny, `player${hitPlayerClass}${faintedPlayer}`) : ''}
      <span class="pkm-name">${pkm ? pkm.name + (pkm.isShiny ? ' <span class="shiny-badge">✨</span>' : '') : '---'}</span>
      <span class="pkm-level">${pkm ? 'Lv.'+pkm.level : ''}</span>
      <span class="pkm-types">${pkm ? pkm.types.join('/') : ''}</span>
      ${renderHpBar(pkm, false)}
      ${pkm ? `<div class="exp-row">EXP: ${pkm.exp}/${pkm.nextLevel}</div>` : ''}
    </div>
    <div class="battle-status">#${b.enemyIndex+1}/${b.enemyTeam.length} ${b.type==='gym'?'🏛'+b.extra.data[1]:b.type==='elite'?'👑四天王':b.type==='story'?'💀'+b.extra.name:b.type==='rival'?'💢'+b.extra.name:'🌿野生'}</div>
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
      html += `<button class="btn ${d}" onclick="battleSub('selectMove',${i})">${m.name}[${m.type}] 威:${m.power} PP:${m.currentPp}/${m.pp}</button>`
    }
    html += '<button class="btn" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  } else if (b.subState === 'selectMove') {
    const moveIndex = b.selectedMove
    const m = pkm && pkm.moves[moveIndex]
    if (!m) { b.subState = 'attack'; return }
    G.view = 'battle'

    main.innerHTML = `
      <div class="battle-enemy">
        ${spriteHTML(b.enemy.id, b.enemy.isShiny, `enemy${faintedEnemy}`)}
        <span class="pkm-name">${b.enemy.name}${b.enemy.isShiny ? ' <span class="shiny-badge">✨</span>' : ''}</span>
        <span class="pkm-level">Lv.${b.enemy.level}</span>
        <span class="pkm-types">${b.enemy.types.join('/')}</span>
        ${renderHpBar(b.enemy, true)}
      </div>
      ${b.battleMsg ? `<div class="battle-msg">${b.battleMsg}</div>` : `<div class="battle-divider">━━ V.S. ━━</div>`}
      <div class="battle-player">
        ${pkm ? spriteHTML(pkm.id, pkm.isShiny, `player${faintedPlayer}`) : ''}
        <span class="pkm-name">${pkm ? pkm.name + (pkm.isShiny ? ' <span class="shiny-badge">✨</span>' : '') : '---'}</span>
        <span class="pkm-level">${pkm ? 'Lv.'+pkm.level : ''}</span>
        <span class="pkm-types">${pkm ? pkm.types.join('/') : ''}</span>
        ${renderHpBar(pkm, false)}
        ${pkm ? `<div class="exp-row">EXP: ${pkm.exp}/${pkm.nextLevel}</div>` : ''}
      </div>
      <div class="battle-status">#${b.enemyIndex+1}/${b.enemyTeam.length} ${b.type==='gym'?'🏛'+b.extra.data[1]:b.type==='elite'?'👑四天王':b.type==='story'?'💀'+b.extra.name:b.type==='rival'?'💢'+b.extra.name:'🌿野生'}</div>
      <div class="move-confirm">
        <div class="move-name">${m.name}</div>
        <div class="move-info">[${m.type}] 威力:${m.power} PP:${m.currentPp}/${m.pp}</div>
        <div class="move-desc">${m.desc}</div>
      </div>
    `
    actions.innerHTML = `
      <button class="btn" onclick="confirmMove()">✅ 确认</button>
      <button class="btn" onclick="cancelMove()">✖ 取消</button>
    `
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
    let hasItems = false
    for (const [key, val] of Object.entries(ITEMS)) {
      if (val.type === 'key' || val.type === 'safari') continue
      const c = G.player.items[key] || 0
      if (c <= 0) continue
      hasItems = true
      const label = val.heal && !val.catchRate ? `${val.name} x${c} (回复${val.heal === 999 ? '满' : val.heal + 'HP'})` : `${val.name} x${c}`
      html += `<button class="btn" onclick="useItemInBattle('${key}')">${label}</button>`
    }
    if (!hasItems) html += '<div style="color:#006a1a;padding:8px;">没有可用的道具</div>'
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
    } else if (d.choices) {
      html += `<button class="btn" onclick="finishDialogue()">选择</button>`
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

function renderChoice() {
  const d = G.dialogue
  if (!d || !d.choices) { G.view = 'explore'; render(); return }
  const main = $('main')
  let html = '<div class="choice-box"><p class="section-title">选择一个选项：</p>'
  for (let i = 0; i < d.choices.length; i++) {
    html += `<button class="btn choice-btn" onclick="makeChoice(${i})">${d.choices[i].text}</button>`
  }
  html += '</div>'
  main.innerHTML = html
  $('actions').innerHTML = '<button class="btn" onclick="G.view=\'explore\';render()">↩ 返回</button>'
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
  const manager = G.pokemonManager
  if (manager && G.player.pokemon[manager.pokemonIndex]) {
    const p = G.player.pokemon[manager.pokemonIndex]
    const remembered = p.relearnMoves || []
    const selected = manager.relearnIndex !== null ? remembered[manager.relearnIndex] : null
    let html = `<p class="section-title">✦ ${p.name}${p.isShiny ? ' ✨' : ''} 技能整理</p>`
    html += `<div class="pkm-card${p.isShiny ? ' shiny-card' : ''}" style="border-color:#00ff41;">
      <div class="pkm-name">${p.name}${p.isShiny ? ' <span class="shiny-badge">✨</span>' : ''} <span class="pkm-level">Lv.${p.level}</span></div>
      <div class="pkm-types">${p.types.join(' / ')}</div>
      <div class="pkm-moves">${p.moves.map(m=>`${m.name}[${m.type}] 威力:${m.power} PP:${m.currentPp}/${m.pp}`).join(' | ')}</div>
      <div class="pkm-exp">可换回技能: ${remembered.length}</div>
    </div>`
    if (selected) {
      html += `<p style="color:#ffcc00;margin:8px 0 6px;">选择一个当前技能，用「${selected.name}」替换：</p><div class="item-list">`
      for (let i = 0; i < p.moves.length; i++) {
        const move = p.moves[i]
        html += `<div class="item-row">
          <span>${move.name}[${move.type}]</span>
          <span class="item-desc">威力:${move.power} PP:${move.currentPp}/${move.pp}</span>
          <button class="btn small" onclick="swapRelearnMove(${manager.pokemonIndex}, ${i})">替换这个</button>
        </div>`
      }
      html += '</div>'
    } else if (remembered.length > 0) {
      html += '<p style="color:#33ff77;margin:8px 0 6px;">点击一个已替换技能，把它换回当前技能栏：</p><div class="item-list">'
      for (let i = 0; i < remembered.length; i++) {
        const move = remembered[i]
        html += `<div class="item-row">
          <span>${move.name}[${move.type}]</span>
          <span class="item-desc">${move.desc || ('威力:' + move.power + ' PP:' + move.pp)}</span>
          <button class="btn small" onclick="prepareRelearnMove(${manager.pokemonIndex}, ${i})">换回</button>
        </div>`
      }
      html += '</div>'
    } else {
      html += '<div class="pkm-card"><div class="empty-slot">这只宝可梦目前没有可换回技能。</div></div>'
    }
    main.innerHTML = html
    $('actions').innerHTML = selected
      ? '<button class="btn" onclick="cancelRelearnMove()">↩ 取消替换</button><button class="btn" onclick="closePokemonManager()">← 返回队伍</button>'
      : '<button class="btn" onclick="closePokemonManager()">← 返回队伍</button><button class="btn" onclick="closeBag()">← 返回</button>'
    return
  }

  main.innerHTML = '<p class="section-title">✦ 宝可梦队伍</p><div class="pkm-list"></div>'
  const list = main.querySelector('.pkm-list')
  for (let i = 0; i < Math.max(6, G.player.pokemon.length); i++) {
    const p = G.player.pokemon[i]
    if (p) {
      const hb = '#'.repeat(Math.max(1,Math.floor(p.hp/Math.max(1,p.maxHp)*8)))+'-'.repeat(8-Math.max(1,Math.floor(p.hp/Math.max(1,p.maxHp)*8)))
      const rememberedCount = (p.relearnMoves || []).length
      list.innerHTML += `<div class="pkm-card${p.isShiny ? ' shiny-card' : ''}" onclick="openPokemonManager(${i})" style="cursor:pointer;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="sprite-container small${p.isShiny ? ' shiny' : ''}" style="margin:0;flex-shrink:0;${p.fainted ? ' filter:grayscale(1);opacity:0.5;' : ''}" onclick="event.stopPropagation()">
              ${p.isShiny ? '<div class="shiny-stars"><span></span><span></span><span></span></div>' : ''}
              <div class="sprite-shadow"></div>
              <img class="sprite-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png" onerror="this.style.display='none'" loading="lazy">
            </div>
            <div style="flex:1;min-width:0;">
              <div class="pkm-name">${p.name}${p.isShiny ? ' <span class="shiny-badge">✨</span>' : ''} <span class="pkm-level">Lv.${p.level}</span></div>
              <div class="pkm-types">${p.types.join(' / ')} ${p.gender ? '<span style="color:'+(p.gender==='♀'?'#e05080':'#5090e0')+'">'+p.gender+'</span>' : ''}${p.nature ? ' ['+p.nature[0]+']' : ''}${p.ability ? ' ['+p.ability.name+']' : ''}</div>
              <div>HP: ${hb} ${p.hp}/${p.maxHp}${p.fainted?' 已失去战斗能力':''}</div>
              <div class="pkm-exp">EXP: ${p.exp}/${p.nextLevel}${rememberedCount > 0 ? ` | 可换回技能:${rememberedCount}` : ''}</div>
            </div>
          </div>
          <div class="pkm-moves">${p.moves.map(m=>`${m.name}[${m.type}] 威力:${m.power} PP:${m.currentPp}/${m.pp}`).join(' | ')}</div>
          <div class="pkm-iv">个体: H${p.ivs.hp} A${p.ivs.atk} D${p.ivs.def} SA${p.ivs.spa} SD${p.ivs.spd} S${p.ivs.spe}</div>
          <div class="pkm-ev">努力: H${p.evs.hp} A${p.evs.atk} D${p.evs.def} SA${p.evs.spa} SD${p.evs.spd} S${p.evs.spe}</div>
          <div class="pkm-exp" style="margin-top:4px;color:var(--accent);">点击这只宝可梦可整理技能</div>
        </div>`
    } else {
      list.innerHTML += '<div class="pkm-card"><div class="empty-slot">[空位]</div></div>'
    }
  }
  $('actions').innerHTML = '<button class="btn" onclick="closeBag()">← 返回</button>'
}

function renderPokedex() {
  const main = $('main')
  if (G.pokedexDetail) {
    const p = getPokemonData(G.pokedexDetail)
    if (!p) { G.pokedexDetail = null; renderPokedex(); return }
    const seen = G.player.seen.includes(p[0])
    const evoInfo = p[11] ? `→ Lv.${p[11][0]} ${getPokemonData(p[11][1])?.[1] || '???'}` : '最终形态'
    const isShinySeen = G.player.shinySeen.includes(p[0])
    main.innerHTML = `
      <p class="section-title">📖 #${String(p[0]).padStart(2,'0')} ${seen ? p[1] : '???'}${isShinySeen ? ' <span class="shiny-badge">✨</span>' : ''}</p>
        <div class="pkm-card${isShinySeen ? ' shiny-card' : ''}" style="border-color:var(--accent);">
        ${seen ? spriteHTML(p[0], isShinySeen) : ''}
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
      const isShinySeen = G.player.shinySeen.includes(p[0])
      grid.innerHTML += `<div class="pkm-card${seen?'':' unseen'}${isShinySeen?' shiny-card':''}" onclick="${seen?`G.pokedexDetail=${p[0]};render()`:''}" style="cursor:${seen?'pointer':'default'};${seen?'':'opacity:0.45;'}">
        <div class="pkm-name">#${String(p[0]).padStart(2,'0')} ${seen ? p[1] : '???'}${isShinySeen ? ' <span class="shiny-badge">✨</span>' : ''}</div>
        ${seen ? `<div class="sprite-container small${isShinySeen ? ' shiny' : ''}" style="min-height:48px;margin:2px 0;">${isShinySeen ? '<div class="shiny-stars"><span></span><span></span><span></span></div>' : ''}<div class="sprite-shadow"></div><img class="sprite-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShinySeen ? 'shiny/' : ''}${p[0]}.png" onerror="this.style.display='none'" loading="lazy"></div>` : ''}
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
    if (val.type === 'key') continue
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

function renderMap() {
  const panel = $('map-panel')
  if (!panel) return
  // 在 worldMap 视图下，map-panel 由 renderWorldMap() 管理
  if (G.view === 'worldMap') return
  panel.innerHTML = ''
}

function renderLog() {
  const logDiv = $('log')
  logDiv.innerHTML = G.logs.slice(-6).map(l => '> ' + l).join('<br>')
  logDiv.scrollTop = logDiv.scrollHeight
}
