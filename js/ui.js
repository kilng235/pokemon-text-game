const $ = id => document.getElementById(id)

// 动画精灵 URL（PokeAPI showdown 动画 GIF）
function spriteSrc(id, isShiny, animated) {
  if (animated === false) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${id}.png`
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${isShiny ? 'shiny/' : ''}${id}.gif`
}

// 精灵图预加载缓存：提前加载常用精灵，减少切宠/换宠/图鉴滚动时的闪烁
// 浏览器对相同 src 的 img 会命中缓存，decode() 触发解码避免首帧空白
const spritePreloadCache = new Map()
function preloadSprite(url) {
  if (!url || spritePreloadCache.has(url)) return
  const img = new Image()
  img.src = url
  if (img.decode) img.decode().catch(() => {})
  spritePreloadCache.set(url, img)
}

function spriteHTML(id, isShiny, extraClass, opts) {
  const animated = !opts || opts.animated !== false
  const shinyClass = isShiny ? ' shiny' : ''
  const shinyStars = isShiny ? '<div class="shiny-stars"><span></span><span></span><span></span></div>' : ''
  const cls = extraClass || ''
  const gif = spriteSrc(id, isShiny, true)
  const png = spriteSrc(id, isShiny, false)
  preloadSprite(gif)
  preloadSprite(png)
  const pData = typeof getPokemonData === 'function' ? getPokemonData(id) : null
  const pName = pData ? pData.name : `宝可梦#${id}`
  const altText = isShiny ? `${pName}(闪光)` : pName
  return `<div class="sprite-container${shinyClass}${cls ? ' ' + cls : ''}">${shinyStars}<div class="sprite-shadow"></div><img class="sprite-img" src="${gif}" alt="${altText}" data-png="${png}" onerror="if(this.dataset.fallback!=='1'){this.dataset.fallback='1';this.src=this.dataset.png}else{this.style.display='none'}" loading="lazy"></div>`
}

let lastFadeInTime = 0
function enableFadeIn() {
  const now = Date.now()
  if (now - lastFadeInTime < 500) return
  const main = $('main')
  if (!main) return
  main.classList.remove('fade-in')
  void main.offsetWidth
  main.classList.add('fade-in')
  lastFadeInTime = now
}

function render() {
  const v = G.view
  const app = $('app')
  if (app) app.className = v === 'worldMap' ? 'world-map-view' : ''
  const filledBadges = Array(G.player.badge).fill('<span class="badges" style="color:var(--success)">●</span>').join('')
  const emptyBadges = Array(8 - G.player.badge).fill('<span class="badges" style="color:var(--border)">●</span>').join('')
  const sndIcon = G.soundEnabled ? '🔊' : '🔇'
  const musIcon = G.musicEnabled ? '🎵' : '🎶'
  const progressTag = G.player.visited ? `<span class="progress-tag">${G.player.visited.length}区域</span>` : ''
  $('header').innerHTML = `<span>宝可梦文字版</span><span class="badges">${filledBadges}${emptyBadges}</span>${progressTag}<span class="money">¥${G.player.money}</span><span class="audio-ctrl"><button class="audio-btn" onclick="toggleSound()" title="音效开关" aria-label="音效开关">${sndIcon}</button><button class="audio-btn" onclick="toggleMusic()" title="音乐开关" aria-label="音乐开关">${musIcon}</button></span>`
  // 优先处理待学习的技能
  if (G.pendingMoveLearn && G.pendingMoveLearn.length > 0) {
    renderMoveLearn()
    try { renderMap() } catch(e) { console.warn('map:',e) }
    renderSidebarTeam()
    renderLog()
    return
  }
  if (v === 'start') renderStart()
  else if (v === 'choose') renderChoose()
  else if (v === 'explore') { renderExplore(); enableFadeIn() }
  else if (v === 'battle') {
    // 临时禁用选择性更新，回到完全重渲以修复bug
    renderBattle()
    enableFadeIn()
  }
  else if (v === 'bag') { renderBag(); enableFadeIn() }
  else if (v === 'pokemon') { renderPokemon(); enableFadeIn() }
  else if (v === 'pokedex') { renderPokedex(); enableFadeIn() }
  else if (v === 'shop') { renderShop(); enableFadeIn() }
  else if (v === 'center') { renderCenter(); enableFadeIn() }
  else if (v === 'dialogue') renderDialogue()
  else if (v === 'worldMap') renderWorldMap()
  else if (v === 'choice') renderChoice()
  // 探索/战斗/菜单场景在 #map-panel 渲染迷你地图
  try {
    if (v === 'explore' || v === 'battle' || v === 'bag' || v === 'pokemon' || v === 'pokedex' || v === 'shop' || v === 'center' || v === 'dialogue') {
      renderSidebarMap()
    } else {
      renderMap()
    }
  } catch(e) { console.warn('map:',e) }
  renderSidebarTeam()
  renderLog()
  // 根据当前场景切换 BGM
  if (window.AU && typeof updateBgmForView === 'function') updateBgmForView()
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
  $('continueBtn').style.display = G._hasSave ? '' : 'none'
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
    const types = p.types.split(',')
    const typeBadges = types.map(t => `<span class="type-badge" style="background:${FX.typeBg(t)}">${t}</span>`).join('')
    grid.innerHTML += `
      <div class="choose-card">
        <div class="sprite-container">
          <div class="sprite-shadow"></div>
          <img class="sprite-img" src="${spriteSrc(id, false, true)}" data-png="${spriteSrc(id, false, false)}" onerror="if(this.dataset.fallback!=='1'){this.dataset.fallback='1';this.src=this.dataset.png}else{this.style.display='none'}" loading="lazy">
        </div>
        <div class="pkm-name">${p.name}</div>
        <div class="pkm-types">${typeBadges}</div>
        <div class="pkm-stat">HP:${p.stats.hp} 攻:${p.stats.atk} 防:${p.stats.def}</div>
        <div class="pkm-stat">特攻:${p.stats.spa} 特防:${p.stats.spd} 速:${p.stats.spe}</div>
        <button class="btn" onclick="selectStarter(${id})">选择 ${p.name}</button>
      </div>
    `
  }
  $('actions').innerHTML = ''
}

function renderExplore() {
  const loc = getLocation(G.player.position)
  if (!loc) { G.player.position = 'pallet'; render(); return }
  const storyKey = checkStoryTrigger(G.player.position)
  if (storyKey && G.dialogue?.eventKey !== storyKey) {
    const ev = STORY_EVENTS[storyKey]
    G.dialogue = { eventKey: storyKey, lines: ev.dialogue, index: 0, battle: ev.battle !== null, choices: ev.choices, canSkip: false }
    G.view = 'dialogue'
    render()
    return
  }
  const main = $('main')
  let html = `<div class="location-name">◈ ${loc.name}</div>
    <div class="loc-type">${loc.type === 'town' ? '🏘 城镇' : loc.type === 'route' ? '🌿 道路' : loc.type === 'cave' ? '⛰ 洞穴' : '🌊 水道'}</div>
    <p class="area-desc">${loc.desc}</p>
    <div class="location-strip">
      ${loc.hasCenter ? '<span class="has-center">🏥 有宝可梦中心</span>' : ''}
      ${loc.type === 'town' ? '<span class="has-center">🛒 有商店</span>' : ''}
    </div>
    <div class="btn-col">`
  const connections = loc.connects || []
  const labels = LINK_LABELS[G.player.position] || {}
  for (const conn of connections) {
    const c = getLocation(conn)
    if (!c) continue
    let label = labels[conn] || c.name
    if (c.type === 'town' && c.hasCenter) label += ' 🏥'
    html += `<button class="btn" onclick="travelTo('${conn}')">→ ${label}</button>`
  }
  if (loc.type === 'town') {
    for (const [k, v] of Object.entries(GYM_LEADERS)) {
      const townMap = { brock:'pewter', misty:'cerulean', ltSurge:'vermilion', erika:'celadon', sabrina:'saffron', koga:'fuchsia', blaine:'cinnabar', giovanni:'viridian' }
      const tKey = townMap[k]
      if (tKey === G.player.position) {
        if (v.badge <= G.player.badge) {
          html += `<button class="btn disabled">✔ ${v.name}道馆（已通过）</button>`
        } else {
          html += `<button class="btn" onclick="challengeGym('${k}')">⚔ 挑战 ${v.name}（${v.type}属性）</button>`
        }
      }
    }
    html += `<button class="btn" onclick="G.view='shop';render()">🛒 商店</button>`
    if (loc.hasCenter) html += `<button class="btn" onclick="healAtCenter()">🏥 宝可梦中心</button>`
  }
  if (loc.type !== 'town') {
    const shinyChance = getShinyChance()
    const shinyPercent = (shinyChance * 100).toFixed(2)
    const chain = G.player.shinyChain
    html += `<button class="btn" onclick="tryWildEncounter()">🌿 探索（遇敌）</button>`
    html += `<div style="margin-top:8px;font-size:12px;color:#888;">✨ 闪光连锁: ${chain} 连 (概率: ${shinyPercent}%)</div>`
  }
  html += `</div>`
  // 紧凑版道馆进度/等级推荐面板
  if (typeof renderMapInfo === 'function') html += renderMapInfo()
  main.innerHTML = html
  $('actions').innerHTML = `
    <button class="btn" onclick="toggleMap()">🗺 地图</button>
    <button class="btn" onclick="G.view='pokemon';render()">队伍</button>
    <button class="btn" onclick="G.view='bag';render()">背包</button>
    <button class="btn" onclick="G.view='pokedex';render()">图鉴</button>
    <button class="btn" onclick="restartGame()" style="color:#cc3333;border-color:#cc3333;">重新开始</button>
  `
}

// ========== 战斗UI选择性更新系统 ==========

function updateBattleHP() {
  const b = G.battle
  if (!b) return
  const pkm = getActivePokemon()

  // 更新敌方HP条
  const enemyHPBar = document.querySelector('.enemy-info-card .hp-bar-wrapper .hp-bar-fill')
  if (enemyHPBar) {
    const pct = Math.max(0, b.enemy.hp / b.enemy.maxHp) * 100
    enemyHPBar.style.width = pct + '%'
    enemyHPBar.className = 'hp-bar-fill' + (pct <= 20 ? ' hp-low' : pct <= 50 ? ' hp-medium' : '')
    if (b.enemy.hp < (b.lastEnemyHp || b.enemy.maxHp)) {
      enemyHPBar.classList.add('hp-damaged')
    }
  }

  // 更新敌方HP数字
  const enemyHPText = document.querySelector('.enemy-info-card .hp-text')
  if (enemyHPText) {
    enemyHPText.textContent = `${b.enemy.hp}/${b.enemy.maxHp}`
  }

  // 更新玩家HP条
  const playerHPBar = document.querySelector('.player-info-card .hp-bar-wrapper .hp-bar-fill')
  if (playerHPBar && pkm) {
    const pct = Math.max(0, pkm.hp / pkm.maxHp) * 100
    playerHPBar.style.width = pct + '%'
    playerHPBar.className = 'hp-bar-fill' + (pct <= 20 ? ' hp-low' : pct <= 50 ? ' hp-medium' : '')
    if (pkm.hp < (b.lastPlayerHp || pkm.maxHp)) {
      playerHPBar.classList.add('hp-damaged')
    }
  }

  // 更新玩家HP数字
  const playerHPText = document.querySelector('.player-info-card .hp-text')
  if (playerHPText && pkm) {
    playerHPText.textContent = `${pkm.hp}/${pkm.maxHp}`
  }

  b.dirtyFlags.hp = false
}

function updateBattleStatus() {
  const b = G.battle
  if (!b) return
  const pkm = getActivePokemon()

  // 更新敌方状态徽章
  const enemyStatusEl = document.querySelector('.enemy-info-card .status-badges')
  if (enemyStatusEl) {
    let badges = ''
    if (b.enemy.status && b.enemy.status.type) {
      const map = { sleep: '💤 睡眠', paralyze: '⚡ 麻痹', poison: '☠ 中毒', burn: '🔥 灼伤' }
      const label = map[b.enemy.status.type]
      if (label) badges = `<span class="status-badge status-${b.enemy.status.type}">${label}</span>`
    }
    if (b.enemy.confused) badges += `<span class="status-badge status-confuse">❓ 混乱</span>`
    enemyStatusEl.innerHTML = badges
  }

  // 更新玩家状态徽章
  if (pkm) {
    const playerStatusEl = document.querySelector('.player-info-card .status-badges')
    if (playerStatusEl) {
      let badges = ''
      if (pkm.status && pkm.status.type) {
        const map = { sleep: '💤 睡眠', paralyze: '⚡ 麻痹', poison: '☠ 中毒', burn: '🔥 灼伤' }
        const label = map[pkm.status.type]
        if (label) badges = `<span class="status-badge status-${pkm.status.type}">${label}</span>`
      }
      if (pkm.confused) badges += `<span class="status-badge status-confuse">❓ 混乱</span>`
      playerStatusEl.innerHTML = badges
    }
  }

  b.dirtyFlags.status = false
}

function updateBattleMsg() {
  const b = G.battle
  if (!b) return

  const msgEl = document.getElementById('battle-message')
  if (msgEl) {
    msgEl.textContent = b.battleMsg || ''
  }

  b.dirtyFlags.msg = false
}

function updateBattleActions() {
  const b = G.battle
  if (!b) return
  const pkm = getActivePokemon()
  if (!pkm) return

  const actionsEl = document.getElementById('battle-actions')
  if (actionsEl) {
    if (b.turn === 'player' && b.subState === 'main') {
      const moves = pkm.moves.map((m, i) =>
        `<button class="move-btn" onclick="playerAttack(${i})">${m.name} (PP:${m.currentPp}/${m.pp})</button>`
      ).join('')
      actionsEl.innerHTML = moves +
        `<button onclick="G.battle.subState='bag'; render()">背包</button>
         <button onclick="tryFlee()">逃跑</button>`
    } else {
      actionsEl.innerHTML = '<p>对方出招中...</p>'
    }
  }

  b.dirtyFlags.actions = false
}

function smartRenderBattle() {
  const b = G.battle
  if (!b) return

  // 只更新脏的部分
  if (b.dirtyFlags.hp) updateBattleHP()
  if (b.dirtyFlags.status) updateBattleStatus()
  if (b.dirtyFlags.msg) updateBattleMsg()
  if (b.dirtyFlags.actions) updateBattleActions()
}

// ========== 原始renderBattle（完全重渲用于初始化）==========

function renderBattle() {
  const b = G.battle
  if (!b || !b.enemy) { G.view = 'explore'; render(); return }
  const pkm = getActivePokemon()

  // 预加载敌方剩余队伍与己方全队精灵，换宠/敌方换宠时即时显示
  for (const ep of b.enemyTeam) {
    preloadSprite(spriteSrc(ep.id, ep.isShiny, true))
    preloadSprite(spriteSrc(ep.id, ep.isShiny, false))
  }
  for (const pp of G.player.pokemon) {
    preloadSprite(spriteSrc(pp.id, pp.isShiny, true))
    preloadSprite(spriteSrc(pp.id, pp.isShiny, false))
  }

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
      hpClass = hpClass.replace(' hp-damaged', '') + ' hp-damaged'
    }
    b[lastHpKey] = pokemon.hp

    // 状态徽章
    let statusBadge = ''
    if (pokemon.status && pokemon.status.type) {
      const map = { sleep: '💤 睡眠', paralyze: '⚡ 麻痹', poison: '☠ 中毒', burn: '🔥 灼伤' }
      const label = map[pokemon.status.type]
      if (label) statusBadge = `<span class="status-badge status-${pokemon.status.type}">${label}</span>`
    }
    if (pokemon.confused) statusBadge += `<span class="status-badge status-confuse">❓ 混乱</span>`

    return `<div class="hp-bar-container">
      <div class="hp-bar-wrapper">
        <div class="${hpClass}" style="width:${pct}%"></div>
      </div>
      <div class="${textClass}">${pokemon.hp}/${pokemon.maxHp}</div>
      ${statusBadge ? `<div class="status-badges">${statusBadge}</div>` : ''}
    </div>`
  }

  const hitEnemyClass = b.enemy.hp < (b.lastEnemyHp || b.enemy.maxHp) ? ' hit' : ''
  const hitPlayerClass = pkm && pkm.hp < (b.lastPlayerHp || pkm.maxHp) ? ' hit' : ''
  const faintedEnemy = b.enemy.hp <= 0 || b.enemy.fainted ? ' fainted' : ''
  const faintedPlayer = pkm && (pkm.hp <= 0 || pkm.fainted) ? ' fainted' : ''

  // 属性徽章
  const typeBadge = (t) => `<span class="type-badge" style="background:${FX.typeBg(t)}">${t}</span>`
  const enemyTypes = b.enemy.types.map(typeBadge).join('')
  const playerTypes = pkm ? pkm.types.map(typeBadge).join('') : ''

  // 战斗场景类型（背景）
  const area = LOCATIONS[G.player.position]
  const areaType = area ? area.type : 'route'
  let bgClass = 'battle-bg-route'
  if (areaType === 'cave') bgClass = 'battle-bg-cave'
  else if (areaType === 'water') bgClass = 'battle-bg-water'
  else if (areaType === 'town') bgClass = 'battle-bg-town'

  const main = $('main')
  main.innerHTML = `
    <div class="battle-stage ${bgClass}" id="battle-stage">
      <div class="battle-layer battle-sky"></div>
      <div class="battle-layer battle-clouds"><i></i><i></i><i></i></div>
      <div class="battle-layer battle-ground"></div>
      <div class="battle-arena">
        <div class="battle-enemy-side">
          <div class="enemy-info-card">
            <div class="info-row">
              <span class="pkm-name">${b.enemy.name}${b.enemy.isShiny ? ' <span class="shiny-badge">✨</span>' : ''}${b.enemy.isElite ? ' <span class="elite-badge">精英</span>' : ''}</span>
              <span class="pkm-level">Lv.${b.enemy.level}</span>
            </div>
            <div class="info-row">${enemyTypes}</div>
            ${renderHpBar(b.enemy, true)}
          </div>
          <div class="enemy-platform">
            ${spriteHTML(b.enemy.id, b.enemy.isShiny, `enemy${hitEnemyClass}${faintedEnemy}`, {animated: true})}
          </div>
        </div>
        <div class="battle-center">
          ${b.battleMsg ? `<div class="battle-msg">${b.battleMsg}</div>` : `<div class="battle-divider">━━ ⚔ ━━</div>`}
        </div>
        <div class="battle-player-side">
          <div class="player-platform">
            ${pkm ? spriteHTML(pkm.id, pkm.isShiny, `player${hitPlayerClass}${faintedPlayer}`, {animated: true}) : ''}
          </div>
          <div class="player-info-card">
            <div class="info-row">
              <span class="pkm-name">${pkm ? pkm.name + (pkm.isShiny ? ' <span class="shiny-badge">✨</span>' : '') : '---'}</span>
              <span class="pkm-level">${pkm ? 'Lv.'+pkm.level : ''}</span>
            </div>
            <div class="info-row">${playerTypes}</div>
            ${renderHpBar(pkm, false)}
            ${pkm ? `<div class="exp-row"><span class="exp-label">EXP</span><div class="exp-bar"><div class="exp-bar-fill" style="width:${Math.min(100, pkm.exp/pkm.nextLevel*100)}%"></div></div><span class="exp-text">${pkm.exp}/${pkm.nextLevel}</span></div>` : ''}
          </div>
        </div>
      </div>
      <div class="battle-status">#${b.enemyIndex+1}/${b.enemyTeam.length} ${b.type==='gym'?'🏛 '+b.extra.data.name:b.type==='elite'?'👑 四天王 '+b.extra.name:b.type==='story'?'💀 '+b.extra.name:b.type==='rival'?'💢 '+b.extra.name:'🌿 野生'}</div>
      <div class="battle-scanlines"></div>
    </div>
  `
  const actions = $('actions')
  // 移除外层 move-confirm 覆盖层（如有）
  const existingOverlay = document.getElementById('move-confirm-overlay')
  if (existingOverlay) { existingOverlay.remove() }

  if (b.subState === 'main') {
    actions.innerHTML = `
      <button class="btn btn-action btn-attack" tabindex="0" role="button" onclick="battleSub('attack')">⚔ 攻击</button>
      <button class="btn btn-action btn-switch" tabindex="0" role="button" onclick="battleSub('switch')">🔄 换宠</button>
      <button class="btn btn-action btn-item" tabindex="0" role="button" onclick="battleSub('item')">🎒 道具</button>
      ${b.type === 'wild' ? '<button class="btn btn-action btn-flee" tabindex="0" role="button" onclick="tryFlee()">🏃 逃跑</button>' : ''}
    `
  } else if (b.subState === 'attack') {
    if (!pkm) { actions.innerHTML = '<button class="btn" tabindex="0" role="button" onclick="battleSub(\'switch\')">换宠</button>'; return }
    let html = '<div class="moves-grid">'
    for (let i = 0; i < 4; i++) {
      const m = pkm.moves[i]
      if (!m) { html += '<div class="move-slot empty"></div>'; continue }
      const d = m.currentPp <= 0 ? 'disabled' : ''
      const bg = FX.typeBg(m.type)
      const cat = m.power === 0 ? '变化' : (['火','水','草','电','冰','超能','幽灵','龙','恶'].includes(m.type) ? '特殊' : '物理')
      html += `<button class="btn move-slot ${d}" style="--move-bg:${bg}" tabindex="0" role="button" onclick="battleSub('selectMove',${i})">
        <span class="move-name">${m.name}</span>
        <span class="move-type">${typeBadge(m.type)}</span>
        <span class="move-stats">${cat} · 威${m.power === 0 ? '—' : m.power} · PP ${m.currentPp}/${m.pp}</span>
      </button>`
    }
    html += '</div>'
    html += '<button class="btn btn-back" tabindex="0" role="button" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  } else if (b.subState === 'selectMove') {
    const moveIndex = b.selectedMove
    const m = pkm && pkm.moves[moveIndex]
    if (!m) { b.subState = 'attack'; return }
    G.view = 'battle'

    const bg = FX.typeBg(m.type)
    const cat = m.power === 0 ? '变化' : (['火','水','草','电','冰','超能','幽灵','龙','恶'].includes(m.type) ? '特殊' : '物理')

    // 只更新 actions 区域和动态添加 move-confirm 覆盖层，不重写整个战斗舞台
    let moveConfirm = document.getElementById('move-confirm-overlay')
    if (!moveConfirm) {
      moveConfirm = document.createElement('div')
      moveConfirm.id = 'move-confirm-overlay'
      moveConfirm.className = 'move-confirm-overlay'
      const stage = document.getElementById('battle-stage')
      if (stage) stage.appendChild(moveConfirm)
    }
    moveConfirm.innerHTML = `<div class="move-confirm" style="--move-bg:${bg}">
      <div class="move-confirm-name">${m.name} ${typeBadge(m.type)}</div>
      <div class="move-confirm-stats">${cat} · 威力 ${m.power === 0 ? '—' : m.power} · PP ${m.currentPp}/${m.pp}</div>
      <div class="move-confirm-desc">${m.desc}</div>
    </div>`
    moveConfirm.style.display = 'block'

    actions.innerHTML = `
      <button class="btn btn-confirm" tabindex="0" role="button" onclick="confirmMove()">✅ 确认使用</button>
      <button class="btn btn-back" tabindex="0" role="button" onclick="cancelMove()">✖ 返回</button>
    `
  } else if (b.subState === 'switch') {
    let html = '<div class="switch-grid">'
    for (let i = 0; i < G.player.pokemon.length; i++) {
      const p = G.player.pokemon[i]
      const a = p === getActivePokemon()
      const ok = !p.fainted && p.hp > 0 && !a
      const pct = Math.max(0, Math.min(100, Math.floor(p.hp / Math.max(1, p.maxHp) * 100)))
      let hpColor = 'var(--success)'
      if (pct <= 25) hpColor = 'var(--danger)'
      else if (pct <= 50) hpColor = 'var(--warning)'
      html += `<button class="btn switch-slot ${ok?'':'disabled'}" onclick="${ok?`switchPokemon(${i})`:''}">
        <div class="switch-head">
          <img class="switch-sprite" src="${spriteSrc(p.id, p.isShiny, false)}" onerror="this.style.display='none'" loading="lazy">
          <span class="switch-name">${p.name}</span>
          <span class="switch-lv">Lv.${p.level}</span>
          ${a?'<span class="switch-active">战中</span>':''}
          ${p.fainted?'<span class="switch-faint">濒死</span>':''}
        </div>
        <div class="switch-hp"><div class="switch-hp-bar" style="width:${pct}%;background:${hpColor};"></div></div>
        <div class="switch-hp-text">${p.hp}/${p.maxHp}</div>
      </button>`
    }
    html += '</div>'
    html += '<button class="btn btn-back" onclick="battleSub(\'main\')">↩ 返回</button>'
    actions.innerHTML = html
  } else if (b.subState === 'item') {
    let html = '<div class="item-grid">'
    let hasItems = false
    for (const [key, val] of Object.entries(ITEMS)) {
      if (val.type === 'key' || val.type === 'safari') continue
      const c = G.player.items[key] || 0
      if (c <= 0) continue
      hasItems = true
      const label = val.heal && !val.catchRate ? `${val.name} x${c} (回复${val.heal === 999 ? '满' : val.heal + 'HP'})` : `${val.name} x${c}`
      const icon = val.catchRate ? '🔴' : val.heal ? '💊' : '📦'
      html += `<button class="btn item-slot" onclick="useItemInBattle('${key}')">
        <span class="item-icon">${icon}</span>
        <span class="item-label">${label}</span>
      </button>`
    }
    if (!hasItems) html += '<div style="color:#666;padding:8px;grid-column:1/-1;">没有可用的道具</div>'
    html += '</div>'
    html += '<button class="btn btn-back" onclick="battleSub(\'main\')">↩ 返回</button>'
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
  if (manager && !G.player.pokemon[manager.pokemonIndex]) {
    G.pokemonManager = null
  }
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
      const typeBadges = p.types.map(t => `<span class="type-badge" style="background:${FX.typeBg(t)}">${t}</span>`).join(' ')
      list.innerHTML += `<div class="pkm-card${p.isShiny ? ' shiny-card' : ''}" onclick="openPokemonManager(${i})" style="cursor:pointer;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="sprite-container small${p.isShiny ? ' shiny' : ''}" style="margin:0;flex-shrink:0;${p.fainted ? ' filter:grayscale(1);opacity:0.5;' : ''}" onclick="event.stopPropagation()">
              ${p.isShiny ? '<div class="shiny-stars"><span></span><span></span><span></span></div>' : ''}
              <div class="sprite-shadow"></div>
              <img class="sprite-img" src="${spriteSrc(p.id, p.isShiny, true)}" data-png="${spriteSrc(p.id, p.isShiny, false)}" onerror="if(this.dataset.fallback!=='1'){this.dataset.fallback='1';this.src=this.dataset.png}else{this.style.display='none'}" loading="lazy">
            </div>
            <div style="flex:1;min-width:0;">
              <div class="pkm-name">${p.name}${p.isShiny ? ' <span class="shiny-badge">✨</span>' : ''} <span class="pkm-level">Lv.${p.level}</span></div>
              <div class="pkm-types">${typeBadges} ${p.gender ? '<span style="color:'+(p.gender==='♀'?'#e05080':'#5090e0')+'">'+p.gender+'</span>' : ''}${p.nature ? ' ['+p.nature[0]+']' : ''}${p.ability ? ' ['+p.ability.name+']' : ''}</div>
              <div>HP: ${hb} ${p.hp}/${p.maxHp}${p.fainted?' 已失去战斗能力':''}</div>
              <div class="pkm-exp">EXP: ${p.exp}/${p.nextLevel}${rememberedCount > 0 ? ` | 可换回技能:${rememberedCount}` : ''}</div>
            </div>
          </div>
          <div class="pkm-moves">${p.moves.map(m=>`<span class="type-badge" style="background:${FX.typeBg(m.type)}">${m.name}</span> 威${m.power===0?'-':m.power}`).join(' ')}</div>
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
    const seen = G.player.seen.includes(p.id)
    const evoInfo = p.evo ? `-> Lv.${p.evo[0]} ${getPokemonData(p.evo[1])?.name || '???'}` : '最终形态'
    const isShinySeen = G.player.shinySeen.includes(p.id)
    const types = seen ? p.types.split(',') : []
    const typeBadges = types.map(t => `<span class="type-badge" style="background:${FX.typeBg(t)}">${t}</span>`).join(' ')
    main.innerHTML = `
      <p class="section-title">📖 #${String(p.id).padStart(2,'0')} ${seen ? p.name : '???'}${isShinySeen ? ' <span class="shiny-badge">✨</span>' : ''}</p>
        <div class="pkm-card${isShinySeen ? ' shiny-card' : ''}" style="border-color:var(--accent);">
        ${seen ? spriteHTML(p.id, isShinySeen, 'large') : ''}
        <div class="pkm-types">${typeBadges || '???'}</div>
        <hr style="border-color:#003a10;margin:6px 0;">
        <div class="pkm-stat">HP: ${seen ? p.stats.hp : '???'}</div>
        <div class="pkm-stat">攻击: ${seen ? p.stats.atk : '???'}</div>
        <div class="pkm-stat">防御: ${seen ? p.stats.def : '???'}</div>
        <div class="pkm-stat">特攻: ${seen ? p.stats.spa : '???'}</div>
        <div class="pkm-stat">特防: ${seen ? p.stats.spd : '???'}</div>
        <div class="pkm-stat">速度: ${seen ? p.stats.spe : '???'}</div>
        <hr style="border-color:#003a10;margin:6px 0;">
        <div class="pkm-stat">捕获率: ${seen ? p.catchRate : '???'}</div>
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
      const types = seen ? p[2].split(',') : []
      const typeBadges = types.map(t => `<span class="type-badge" style="background:${FX.typeBg(t)}">${t}</span>`).join(' ')
      grid.innerHTML += `<div class="pkm-card${seen?'':' unseen'}${isShinySeen?' shiny-card':''}" onclick="${seen?`G.pokedexDetail=${p[0]};render()`:''}" style="cursor:${seen?'pointer':'default'};${seen?'':'opacity:0.45;'}">
        <div class="pkm-name">#${String(p[0]).padStart(2,'0')} ${seen ? p[1] : '???'}${isShinySeen ? ' <span class="shiny-badge">✨</span>' : ''}</div>
        ${seen ? `<div class="sprite-container small${isShinySeen ? ' shiny' : ''}" style="min-height:48px;margin:2px 0;">${isShinySeen ? '<div class="shiny-stars"><span></span><span></span><span></span></div>' : ''}<div class="sprite-shadow"></div><img class="sprite-img" src="${spriteSrc(p[0], isShinySeen, true)}" data-png="${spriteSrc(p[0], isShinySeen, false)}" onerror="if(this.dataset.fallback!=='1'){this.dataset.fallback='1';this.src=this.dataset.png}else{this.style.display='none'}" loading="lazy"></div>` : ''}
        <div class="pkm-types">${typeBadges || '???'}</div>
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

// 侧边栏队伍显示：
// - 在 start/choose/worldMap 视图下不显示
// - 其余视图展示 6 个槽位（精灵紧凑卡：迷你头像+ Lv + HP条 + 状态）
// - 点击：战斗中且可上场 = switchPokemon；其他情况 = 打开技能整理
function renderSidebarTeam() {
  const panel = $('team-panel')
  if (!panel) return
  const v = G.view
  const team = G.player.pokemon || []
  // 未选御三家 / 起始界面 / 大地图视图：清空不显示
  if (v === 'start' || v === 'choose' || v === 'worldMap' || team.length === 0) {
    panel.innerHTML = ''
    return
  }

  const active = getActivePokemon()
  const inBattle = !!G.battle && v === 'battle'
  const usableCount = team.filter(p => isPokemonUsable(p)).length

  let html = '<div class="team-panel-card">'
  html += '<div class="team-panel-header">'
  html += '<span class="team-panel-label">👥 队伍</span>'
  html += `<span class="team-panel-count">${team.length}/6</span>`
  html += '</div>'

  html += '<div class="team-list">'
  for (let i = 0; i < 6; i++) {
    const p = team[i]
    if (!p) {
      html += '<div class="team-item empty"><span class="team-empty-slot">— 空位 —</span></div>'
      continue
    }
    const isActive = p === active
    const fainted = p.fainted || p.hp <= 0
    const pct = Math.max(0, Math.min(100, Math.floor(p.hp / Math.max(1, p.maxHp) * 100)))
    let hpColor = 'var(--success)'
    if (pct <= 25) hpColor = 'var(--danger)'
    else if (pct <= 50) hpColor = 'var(--warning)'
    let statusBadge = ''
    if (p.status && p.status.type) statusBadge = `<span class="team-status team-status-${p.status.type}" title="${p.status.type}">●</span>`
    const cls = ['team-item']
    if (isActive) cls.push('is-active')
    if (fainted) cls.push('is-fainted')

    // action 决定点击行为
    let action = `openPokemonManager(${i})`
    if (inBattle && !isActive && !fainted) action = `switchPokemon(${i})`

    const src = spriteSrc(p.id, p.isShiny, false) // 侧边栏用静态图省资源
    preloadSprite(src)
    html += `<div class="${cls.join(' ')}" onclick="${action}">
      <div class="team-sprite">${p.isShiny ? '<span class="team-shiny-star" title="闪光">✨</span>' : ''}<img src="${src}" onerror="this.style.visibility='hidden'" loading="lazy" alt="${p.name}"></div>
      <div class="team-info">
        <div class="team-name-row">
          <span class="team-name">${p.name}</span>
          <span class="team-lv">Lv.${p.level}</span>
          ${statusBadge}
        </div>
        <div class="team-types">${p.types.map(t => `<span class="team-type-badge" style="background:${FX.typeBg(t)}">${t}</span>`).join('')}</div>
        <div class="team-hp-row">
          <div class="team-hp-bar"><div class="team-hp-bar-fill" style="width:${pct}%;background:${hpColor};"></div></div>
          <span class="team-hp-text">${p.hp}/${p.maxHp}${fainted ? ' · 濒死' : ''}</span>
        </div>
      </div>
      ${isActive ? '<span class="team-active-tag" title="首发">★</span>' : ''}
    </div>`
  }
  html += '</div>'

  // 概要
  const totalHpMax = team.reduce((s, p) => s + (p ? p.maxHp : 0), 0)
  const totalHpCur = team.reduce((s, p) => s + (p ? p.hp : 0), 0)
  const totalPct = totalHpMax > 0 ? Math.round(totalHpCur / totalHpMax * 100) : 0
  html += '<div class="team-summary">'
  html += `<span class="team-summary-item" title="可战斗 / 总数">${usableCount}/${team.length}</span>`
  html += `<span class="team-summary-item" title="全队 HP">❤ ${totalPct}%</span>`
  html += `<span class="team-summary-item" title="金钱">💰${G.player.money}</span>`
  html += '</div>'

  html += '</div>'
  panel.innerHTML = html
}

function renderLog() {
  const logDiv = $('log')
  logDiv.innerHTML = G.logs.slice(-6).map(l => '> ' + l).join('<br>')
  requestAnimationFrame(() => {
    logDiv.scrollTop = logDiv.scrollHeight
  })
}
