/**
 * fx.js - 战斗特效引擎
 * 负责属性粒子、屏幕震动、闪光、伤害数字、招式特效
 * 全局入口：window.FX
 */
(function () {
  'use strict';

  // === 属性配色（贴近官方属性图标色卡） ===
  const TYPE_COLORS = {
    '普通': '#A8A878', '火': '#F08030', '水': '#6890F0', '草': '#78C850',
    '电': '#F8D030', '冰': '#98D8D8', '格斗': '#C03028', '毒': '#A040A0',
    '地面': '#E0C068', '飞行': '#A890F0', '超能': '#F85888', '虫': '#A8B820',
    '岩石': '#B8A038', '幽灵': '#705898', '龙': '#7038F8', '恶': '#705848',
    '钢': '#B8B8D0', '妖精': '#EE99AC',
  };

  const TYPE_BG = {
    '普通': 'linear-gradient(135deg,#C6C6A7,#A8A878)', '火': 'linear-gradient(135deg,#F5AC78,#F08030)',
    '水': 'linear-gradient(135deg,#9DB7F5,#6890F0)', '草': 'linear-gradient(135deg,#A7DB8D,#78C850)',
    '电': 'linear-gradient(135deg,#FAE078,#F8D030)', '冰': 'linear-gradient(135deg,#BCE6E6,#98D8D8)',
    '格斗': 'linear-gradient(135deg,#D67873,#C03028)', '毒': 'linear-gradient(135deg,#C183C1,#A040A0)',
    '地面': 'linear-gradient(135deg,#EBD69D,#E0C068)', '飞行': 'linear-gradient(135deg,#C6B7F5,#A890F0)',
    '超能': 'linear-gradient(135deg,#FA92B2,#F85888)', '虫': 'linear-gradient(135deg,#C6D16E,#A8B820)',
    '岩石': 'linear-gradient(135deg,#D1C17D,#B8A038)', '幽灵': 'linear-gradient(135deg,#9B85B7,#705898)',
    '龙': 'linear-gradient(135deg,#A27DFA,#7038F8)', '恶': 'linear-gradient(135deg,#A29288,#705848)',
    '钢': 'linear-gradient(135deg,#D1D1E0,#B8B8D0)', '妖精': 'linear-gradient(135deg,#F4BDC9,#EE99AC)',
  };

  // === 招式特效模板：按 effect/key 命中 ===
  // 每个返回 {particle, screen, sound, hitFlash} 元数据
  const MOVE_FX = {
    // 火系
    '火花': { color: '#F08030', particles: 'fire', shake: 'small', flash: '#F08030' },
    '火焰喷射': { color: '#F08030', particles: 'fire', shake: 'medium', flash: '#F8B030', big: true },
    '大字爆炎': { color: '#F08030', particles: 'explosion', shake: 'large', flash: '#FFD040', big: true },
    '火焰旋涡': { color: '#F08030', particles: 'vortex', shake: 'small', flash: '#F08030' },
    '闪焰冲锋': { color: '#F08030', particles: 'charge', shake: 'medium', flash: '#FFD040', big: true },
    // 水系
    '水枪': { color: '#6890F0', particles: 'water', shake: 'small', flash: '#6890F0' },
    '水炮': { color: '#6890F0', particles: 'water', shake: 'medium', flash: '#9DB7F5', big: true },
    '泡沫光线': { color: '#9DB7F5', particles: 'bubbles', shake: 'small', flash: '#9DB7F5' },
    '冲浪': { color: '#6890F0', particles: 'wave', shake: 'large', flash: '#6890F0', big: true },
    '水之波动': { color: '#6890F0', particles: 'ripple', shake: 'small', flash: '#9DB7F5' },
    // 草系
    '藤鞭': { color: '#78C850', particles: 'vine', shake: 'small', flash: '#78C850' },
    '飞叶快刀': { color: '#78C850', particles: 'leaves', shake: 'small', flash: '#78C850' },
    '阳光烈焰': { color: '#78C850', particles: 'beam', shake: 'large', flash: '#FFFFFF', big: true },
    '种子炸弹': { color: '#78C850', particles: 'seeds', shake: 'medium', flash: '#78C850' },
    '吸取': { color: '#78C850', particles: 'drain', shake: 'small', flash: '#78C850' },
    // 电系
    '电击': { color: '#F8D030', particles: 'spark', shake: 'small', flash: '#FFFFFF' },
    '十万伏特': { color: '#F8D030', particles: 'spark', shake: 'medium', flash: '#FFFAA0', big: true },
    '打雷': { color: '#F8D030', particles: 'thunder', shake: 'large', flash: '#FFFFFF', big: true },
    '电球': { color: '#F8D030', particles: 'orb', shake: 'small', flash: '#F8D030' },
    // 冰系
    '冰冻拳': { color: '#98D8D8', particles: 'ice', shake: 'small', flash: '#98D8D8' },
    '急冻光线': { color: '#98D8D8', particles: 'beam', shake: 'medium', flash: '#BCE6E6', big: true },
    '暴风雪': { color: '#98D8D8', particles: 'snow', shake: 'large', flash: '#FFFFFF', big: true },
    '冰冻之风': { color: '#98D8D8', particles: 'snow', shake: 'small', flash: '#BCE6E6' },
    // 格斗
    '空手劈': { color: '#C03028', particles: 'slash', shake: 'small', flash: '#C03028' },
    '劈瓦': { color: '#C03028', particles: 'slash', shake: 'medium', flash: '#D67873' },
    // 毒
    '毒针': { color: '#A040A0', particles: 'needle', shake: 'small', flash: '#A040A0' },
    '污泥炸弹': { color: '#A040A0', particles: 'sludge', shake: 'medium', flash: '#A040A0' },
    // 地面
    '地震': { color: '#E0C068', particles: 'quake', shake: 'large', flash: '#E0C068', big: true },
    '挖洞': { color: '#E0C068', particles: 'dust', shake: 'medium', flash: '#E0C068' },
    // 飞行
    '起风': { color: '#A890F0', particles: 'wind', shake: 'small', flash: '#A890F0' },
    '翅膀攻击': { color: '#A890F0', particles: 'slash', shake: 'small', flash: '#A890F0' },
    '神鸟猛击': { color: '#A890F0', particles: 'slash', shake: 'large', flash: '#FFFFFF', big: true },
    // 超能
    '念力': { color: '#F85888', particles: 'psy', shake: 'small', flash: '#F85888' },
    '精神强念': { color: '#F85888', particles: 'psy', shake: 'medium', flash: '#FA92B2', big: true },
    // 虫
    '虫咬': { color: '#A8B820', particles: 'slash', shake: 'small', flash: '#A8B820' },
    // 岩石
    '落石': { color: '#B8A038', particles: 'rocks', shake: 'medium', flash: '#B8A038' },
    '岩崩': { color: '#B8A038', particles: 'rocks', shake: 'large', flash: '#B8A038', big: true },
    // 幽灵
    '舌舔': { color: '#705898', particles: 'shadow', shake: 'small', flash: '#705898' },
    '暗影球': { color: '#705898', particles: 'orb', shake: 'medium', flash: '#705898', big: true },
    // 龙
    '龙之怒': { color: '#7038F8', particles: 'flame', shake: 'medium', flash: '#7038F8' },
    '逆鳞': { color: '#7038F8', particles: 'rage', shake: 'large', flash: '#A27DFA', big: true },
    // 恶
    '咬碎': { color: '#705848', particles: 'slash', shake: 'medium', flash: '#705848' },
    // 钢
    '金属爪': { color: '#B8B8D0', particles: 'slash', shake: 'small', flash: '#B8B8D0' },
    '铁尾': { color: '#B8B8D0', particles: 'slash', shake: 'medium', flash: '#D1D1E0' },
    // 妖精
    '妖精之风': { color: '#EE99AC', particles: 'wind', shake: 'small', flash: '#EE99AC' },
    '月亮之力': { color: '#EE99AC', particles: 'beam', shake: 'large', flash: '#FFFFFF', big: true },
    // 普通/默认
    '撞击': { color: '#A8A878', particles: 'impact', shake: 'small', flash: '#C6C6A7' },
    '百万吨重拳': { color: '#A8A878', particles: 'impact', shake: 'medium', flash: '#FFFFFF', big: true },
    '劈开': { color: '#A8A878', particles: 'slash', shake: 'small', flash: '#C6C6A7' },
    '舍身冲撞': { color: '#A8A878', particles: 'impact', shake: 'medium', flash: '#FFFFFF', big: true },
    '破坏光线': { color: '#FFFFFF', particles: 'beam', shake: 'large', flash: '#FFFFFF', big: true },
    '头锤': { color: '#A8A878', particles: 'impact', shake: 'small', flash: '#C6C6A7' },
    '角撞': { color: '#A8A878', particles: 'impact', shake: 'small', flash: '#C6C6A7' },
  };

  // 按属性回退
  const TYPE_DEFAULT_FX = {
    '火': { color: '#F08030', particles: 'fire', shake: 'medium', flash: '#F08030' },
    '水': { color: '#6890F0', particles: 'water', shake: 'medium', flash: '#6890F0' },
    '草': { color: '#78C850', particles: 'leaves', shake: 'medium', flash: '#78C850' },
    '电': { color: '#F8D030', particles: 'spark', shake: 'medium', flash: '#FFFAA0' },
    '冰': { color: '#98D8D8', particles: 'snow', shake: 'medium', flash: '#BCE6E6' },
    '格斗': { color: '#C03028', particles: 'impact', shake: 'medium', flash: '#C03028' },
    '毒': { color: '#A040A0', particles: 'sludge', shake: 'medium', flash: '#A040A0' },
    '地面': { color: '#E0C068', particles: 'quake', shake: 'large', flash: '#E0C068' },
    '飞行': { color: '#A890F0', particles: 'wind', shake: 'small', flash: '#A890F0' },
    '超能': { color: '#F85888', particles: 'psy', shake: 'medium', flash: '#F85888' },
    '虫': { color: '#A8B820', particles: 'slash', shake: 'small', flash: '#A8B820' },
    '岩石': { color: '#B8A038', particles: 'rocks', shake: 'medium', flash: '#B8A038' },
    '幽灵': { color: '#705898', particles: 'shadow', shake: 'medium', flash: '#705898' },
    '龙': { color: '#7038F8', particles: 'flame', shake: 'large', flash: '#7038F8' },
    '恶': { color: '#705848', particles: 'shadow', shake: 'medium', flash: '#705848' },
    '钢': { color: '#B8B8D0', particles: 'slash', shake: 'medium', flash: '#B8B8D0' },
    '妖精': { color: '#EE99AC', particles: 'beam', shake: 'medium', flash: '#EE99AC' },
    '普通': { color: '#A8A878', particles: 'impact', shake: 'small', flash: '#C6C6A7' },
  };

  function getMoveFx(move) {
    if (!move) return TYPE_DEFAULT_FX['普通'];
    if (MOVE_FX[move.name]) return MOVE_FX[move.name];
    return TYPE_DEFAULT_FX[move.type] || TYPE_DEFAULT_FX['普通'];
  }

  function typeColor(type) { return TYPE_COLORS[type] || '#A8A878'; }
  function typeBg(type) { return TYPE_BG[type] || TYPE_BG['普通']; }

  // === DOM 工具 ===
  function getStage() {
    return document.getElementById('battle-stage') || document.getElementById('main');
  }
  function getFxLayer() {
    const stage = getStage();
    if (!stage) return null;
    let layer = stage.querySelector('.fx-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'fx-layer';
      const stagePos = window.getComputedStyle(stage).position;
      if (stagePos === 'static') stage.style.position = 'relative';
      stage.appendChild(layer);
    }
    return layer;
  }

  // === 屏幕震动 ===
  function shake(intensity) {
    const stage = getStage();
    if (!stage) return;
    const cls = 'shake-' + (intensity || 'small');
    // 监听动画结束后再移除 class，避免 reflow 竞争
    function onEnd() {
      stage.classList.remove(cls);
      stage.removeEventListener('animationend', onEnd);
    }
    stage.addEventListener('animationend', onEnd);
    stage.classList.remove('shake-small', 'shake-medium', 'shake-large');
    void stage.offsetWidth; // reflow
    stage.classList.add(cls);
  }
  // === 闪光 ===
  function flash(color, duration) {
    const layer = getFxLayer();
    if (!layer) return;
    const el = document.createElement('div');
    el.className = 'fx-flash';
    el.style.background = color || '#FFFFFF';
    layer.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, duration || 250);
  }

  // === 粒子系统 ===
  function spawnParticles(target, kind, color, count) {
    const layer = getFxLayer();
    if (!layer) return;
    const rect = target ? target.getBoundingClientRect() : null;
    const stageRect = layer.getBoundingClientRect();
    let cx = rect ? (rect.left - stageRect.left + rect.width / 2) : (stageRect.width / 2);
    let cy = rect ? (rect.top - stageRect.top + rect.height / 2) : (stageRect.height / 2);
    const n = count || 18;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('div');
      p.className = 'fx-particle fx-' + kind;
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.background = color || '#fff';
      p.style.animationDelay = (Math.random() * 0.15) + 's';
      const ang = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 80;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      layer.appendChild(p);
      trackTimer(setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, 900 + Math.random() * 200));
    }
  }

  // === 伤害数字 ===
  function showDamage(target, amount, kind) {
    const layer = getFxLayer();
    if (!layer || !target) return;
    // 移除同一目标已有的伤害数字，避免重叠
    const existing = layer.querySelectorAll('.fx-damage');
    for (let i = 0; i < existing.length; i++) {
      const ex = existing[i];
      const exRect = ex._targetRect;
      if (!exRect) continue;
      const tRect = target.getBoundingClientRect();
      if (Math.abs(exRect.left - tRect.left) < 30 && Math.abs(exRect.top - tRect.top) < 30) {
        if (ex.parentNode) ex.parentNode.removeChild(ex);
      }
    }
    const rect = target.getBoundingClientRect();
    const stageRect = layer.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'fx-damage ' + (kind === 'crit' ? 'crit' : kind === 'heal' ? 'heal' : kind === 'miss' ? 'miss' : '');
    el.textContent = kind === 'miss' ? '未命中' : (kind === 'heal' ? '+' : '-') + amount;
    el.style.left = (rect.left - stageRect.left + rect.width / 2) + 'px';
    el.style.top = (rect.top - stageRect.top + 20) + 'px';
    el._targetRect = rect;
    layer.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1100);
  }

  // === 综合播放 ===
  function playMove(move, targetEl, options) {
    const fx = getMoveFx(move);
    options = options || {};
    if (fx.flash) flash(fx.flash, fx.big ? 280 : 180);
    if (fx.shake) shake(fx.shake);
    if (fx.particles && targetEl) {
      spawnParticles(targetEl, fx.particles, fx.color, fx.big ? 28 : 16);
    }
    // 命中目标抖动
    if (targetEl) {
      const img = targetEl.querySelector('.sprite-img') || targetEl;
      img.classList.remove('fx-hit-shake');
      void img.offsetWidth;
      img.classList.add('fx-hit-shake');
      setTimeout(() => img.classList.remove('fx-hit-shake'), 500);
    }
  }

  function playStatus(targetEl, statusType) {
    if (!targetEl) return;
    const map = {
      sleep: { color: '#8a7fff', particles: 'z' },
      paralyze: { color: '#F8D030', particles: 'spark' },
      poison: { color: '#A040A0', particles: 'bubble' },
      burn: { color: '#F08030', particles: 'fire' },
      confuse: { color: '#F85888', particles: 'star' },
    };
    const m = map[statusType];
    if (!m) return;
    spawnParticles(targetEl, m.particles, m.color, 12);
    flash(m.color, 150);
  }

  function playFaint(targetEl) {
    if (!targetEl) return;
    const img = targetEl.querySelector('.sprite-img') || targetEl;
    img.classList.add('fx-faint');
    setTimeout(() => img.classList.remove('fx-faint'), 800);
  }

  function playHeal(targetEl) {
    if (!targetEl) return;
    spawnParticles(targetEl, 'heal', '#78C850', 16);
    flash('#A7DB8D', 200);
  }

  function playCapture(targetEl, success) {
    if (!targetEl) return;
    const img = targetEl.querySelector('.sprite-img') || targetEl;
    img.classList.add('fx-capture-in');
    setTimeout(() => {
      img.classList.remove('fx-capture-in');
      if (success) {
        flash('#FFD700', 400);
        spawnParticles(targetEl, 'star', '#FFD700', 24);
      }
    }, 800);
  }

  const pendingTimers = [];
  function trackTimer(t) { pendingTimers.push(t); }
  function cleanup() {
    pendingTimers.forEach(t => clearTimeout(t));
    pendingTimers.length = 0;
    const layer = getFxLayer();
    if (layer) layer.innerHTML = '';
  }

  window.FX = {
    TYPE_COLORS,
    TYPE_BG,
    typeColor,
    typeBg,
    getMoveFx,
    shake,
    flash,
    spawnParticles,
    showDamage,
    playMove,
    playStatus,
    playFaint,
    playHeal,
    playCapture,
    getFxLayer,
    cleanup,
    trackTimer,
  };
})();
