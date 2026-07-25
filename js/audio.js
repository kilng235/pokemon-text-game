/**
 * audio.js - Web Audio API 合成音效与背景音乐模块
 * 零依赖：所有声音均由 OscillatorNode 合成，无需外部音频文件
 * 全局入口：window.AU（音频引擎）
 */
(function () {
  'use strict';

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    // 浏览器不支持 Web Audio API，提供空实现避免报错
    window.AU = {
      init() {}, playClick() {}, play() {}, sfx() {},
      setBgm() {}, stopBgm() {}, setVolume() {},
      toggleSound() {}, toggleMusic() {}
    };
    return;
  }

  let ctx = null;          // AudioContext
  let masterGain = null;   // 主音量
  let sfxGain = null;      // 音效音量
  let musicGain = null;    // 音乐音量
  let currentBgm = null;   // 当前 BGM 名称
  let bgmNodes = [];       // 当前 BGM 正在使用的节点
  let bgmTimer = null;     // BGM 循环定时器

  // 状态（与 G 同步，但音频模块自己维护避免循环依赖）
  let soundOn = true;
  let musicOn = true;
  let volume = 0.4;

  // 音效节流：记录上次播放时间，避免快速连续合成
  let lastSfxTime = 0;
  const SFX_THROTTLE_MS = 60; // 同一帧内多次调用只播放第一次

  // ---------- 基础初始化 ----------
  function init() {
    if (ctx) return;
    try {
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      sfxGain = ctx.createGain();
      musicGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      sfxGain.connect(masterGain);
      musicGain.connect(masterGain);
      applyVolume();
    } catch (e) {
      console.warn('AudioContext init failed:', e);
    }
  }

  // 浏览器自动播放策略：首次用户交互后才能解锁
  function resume() {
    if (!ctx) init();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(function () {});
    }
  }

  function applyVolume() {
    if (!masterGain) return;
    masterGain.gain.value = soundOn || musicOn ? volume : 0;
    if (sfxGain) sfxGain.gain.value = soundOn ? 1.0 : 0;
    if (musicGain) musicGain.gain.value = musicOn ? 0.5 : 0;
  }

  // ---------- 单个音效合成器 ----------
  /**
   * 播放一个简单音符
   * @param {number} freq 频率(Hz)
   * @param {number} start 相对开始时间(秒)
   * @param {number} dur 时长(秒)
   * @param {string} type 波形 sine|square|triangle|sawtooth
   * @param {number} peak 峰值音量 0-1
   * @param {number} target 连接目标（默认 sfxGain）
   */
  function note(freq, start, dur, type, peak, target) {
    if (!ctx) return;
    const t0 = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(target || sfxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // 滑音（频率随时间变化）
  function slide(f1, f2, start, dur, type, peak, target) {
    if (!ctx) return;
    const t0 = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(f1, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(target || sfxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // 噪音（用于打击/爆炸效果）
  function noise(start, dur, peak, target) {
    if (!ctx) return;
    const t0 = ctx.currentTime + start;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.value = peak;
    src.connect(g);
    g.connect(target || sfxGain);
    src.start(t0);
  }

  // ---------- 音效库 ----------
  const SFX = {
    click: function () {
      note(660, 0, 0.06, 'square', 0.25);
      note(880, 0.02, 0.05, 'square', 0.18);
    },
    move: function () {
      note(523, 0, 0.08, 'triangle', 0.3);
      note(784, 0.06, 0.08, 'triangle', 0.25);
    },
    encounter: function () {
      // 野生遭遇：紧张上升
      note(440, 0, 0.1, 'sawtooth', 0.25);
      note(587, 0.1, 0.1, 'sawtooth', 0.25);
      note(880, 0.2, 0.15, 'square', 0.3);
      note(1175, 0.3, 0.2, 'square', 0.25);
    },
    battleStart: function () {
      // 战斗开始（训练家）
      note(330, 0, 0.12, 'square', 0.3);
      note(330, 0.13, 0.12, 'square', 0.3);
      note(440, 0.26, 0.18, 'square', 0.3);
      note(660, 0.44, 0.25, 'square', 0.3);
    },
    hit: function () {
      // 攻击命中
      note(220, 0, 0.05, 'square', 0.3);
      noise(0, 0.08, 0.2);
    },
    // 按属性分类的攻击音效
    hitFire: function () {
      note(523, 0, 0.08, 'sawtooth', 0.3);
      noise(0.04, 0.18, 0.25);
      note(330, 0.12, 0.1, 'sawtooth', 0.2);
    },
    hitWater: function () {
      slide(880, 440, 0, 0.18, 'sine', 0.3);
      note(220, 0.16, 0.12, 'sine', 0.25);
    },
    hitGrass: function () {
      note(660, 0, 0.06, 'triangle', 0.25);
      note(880, 0.06, 0.06, 'triangle', 0.22);
      note(990, 0.12, 0.08, 'triangle', 0.2);
    },
    hitElectric: function () {
      note(1568, 0, 0.04, 'square', 0.3);
      note(2093, 0.04, 0.04, 'square', 0.25);
      note(1318, 0.08, 0.08, 'square', 0.25);
      noise(0.08, 0.06, 0.15);
    },
    hitIce: function () {
      note(1760, 0, 0.06, 'triangle', 0.3);
      note(1568, 0.06, 0.06, 'triangle', 0.25);
      note(1318, 0.12, 0.1, 'triangle', 0.2);
      noise(0.16, 0.1, 0.1);
    },
    hitFighting: function () {
      note(110, 0, 0.08, 'square', 0.35);
      noise(0, 0.12, 0.3);
      note(146, 0.1, 0.06, 'square', 0.25);
    },
    hitPoison: function () {
      note(220, 0, 0.12, 'sawtooth', 0.25);
      note(196, 0.1, 0.1, 'sawtooth', 0.2);
    },
    hitGround: function () {
      note(80, 0, 0.18, 'sawtooth', 0.35);
      noise(0, 0.18, 0.35);
      note(98, 0.18, 0.1, 'sawtooth', 0.25);
    },
    hitPsychic: function () {
      slide(880, 1760, 0, 0.18, 'sine', 0.28);
      note(1760, 0.18, 0.15, 'sine', 0.25);
    },
    hitRock: function () {
      note(110, 0, 0.1, 'square', 0.3);
      noise(0.08, 0.15, 0.3);
      note(146, 0.16, 0.06, 'square', 0.2);
    },
    hitGhost: function () {
      slide(220, 110, 0, 0.3, 'sine', 0.28);
      note(110, 0.3, 0.15, 'sine', 0.2);
    },
    hitBug: function () {
      note(880, 0, 0.04, 'square', 0.2);
      note(740, 0.05, 0.04, 'square', 0.2);
      note(880, 0.1, 0.04, 'square', 0.2);
      note(740, 0.15, 0.04, 'square', 0.2);
    },
    hitDragon: function () {
      note(110, 0, 0.15, 'sawtooth', 0.32);
      note(146, 0.15, 0.12, 'sawtooth', 0.28);
      noise(0.2, 0.15, 0.25);
    },
    hitSteel: function () {
      note(2093, 0, 0.05, 'square', 0.3);
      note(1760, 0.05, 0.05, 'square', 0.25);
      note(1568, 0.1, 0.08, 'square', 0.2);
      noise(0.1, 0.06, 0.15);
    },
    hitFlying: function () {
      slide(440, 880, 0, 0.18, 'sine', 0.28);
      noise(0.18, 0.1, 0.2);
    },
    hitFairy: function () {
      note(1318, 0, 0.08, 'sine', 0.28);
      note(1568, 0.08, 0.08, 'sine', 0.25);
      note(1760, 0.16, 0.12, 'sine', 0.22);
    },
    superEffective: function () {
      // 效果拔群
      note(880, 0, 0.08, 'square', 0.3);
      note(1175, 0.06, 0.08, 'square', 0.3);
      note(1568, 0.12, 0.15, 'square', 0.3);
    },
    notEffective: function () {
      // 效果不理想
      note(330, 0, 0.12, 'sine', 0.3);
      note(247, 0.1, 0.15, 'sine', 0.25);
    },
    miss: function () {
      // 攻击失误
      slide(660, 220, 0, 0.2, 'sine', 0.25);
    },
    faint: function () {
      // 宝可梦倒下
      slide(440, 110, 0, 0.5, 'sawtooth', 0.3);
    },
    victory: function () {
      // 战斗胜利
      note(523, 0, 0.12, 'square', 0.3);
      note(659, 0.12, 0.12, 'square', 0.3);
      note(784, 0.24, 0.12, 'square', 0.3);
      note(1047, 0.36, 0.25, 'square', 0.3);
    },
    defeat: function () {
      // 战斗失败
      note(440, 0, 0.2, 'sawtooth', 0.3);
      note(370, 0.2, 0.2, 'sawtooth', 0.3);
      note(294, 0.4, 0.4, 'sawtooth', 0.3);
    },
    capture: function () {
      // 捕获成功：欢呼上行
      note(523, 0, 0.1, 'square', 0.3);
      note(659, 0.1, 0.1, 'square', 0.3);
      note(784, 0.2, 0.1, 'square', 0.3);
      note(1047, 0.3, 0.1, 'square', 0.3);
      note(1319, 0.4, 0.3, 'square', 0.3);
    },
    captureFail: function () {
      // 捕获失败：球破
      note(330, 0, 0.08, 'square', 0.3);
      noise(0.08, 0.1, 0.25);
    },
    ballThrow: function () {
      // 丢球
      slide(880, 440, 0, 0.15, 'sine', 0.25);
    },
    levelUp: function () {
      // 升级
      note(784, 0, 0.1, 'square', 0.3);
      note(988, 0.1, 0.1, 'square', 0.3);
      note(1175, 0.2, 0.1, 'square', 0.3);
      note(1568, 0.3, 0.25, 'square', 0.3);
    },
    evolve: function () {
      // 进化：神秘长音
      slide(440, 880, 0, 0.6, 'sine', 0.25);
      slide(880, 1760, 0.6, 0.4, 'sine', 0.25);
      note(1760, 1.0, 0.3, 'triangle', 0.3);
    },
    badge: function () {
      // 获得徽章：庄严
      note(523, 0, 0.15, 'triangle', 0.3);
      note(659, 0.15, 0.15, 'triangle', 0.3);
      note(784, 0.3, 0.15, 'triangle', 0.3);
      note(1047, 0.45, 0.4, 'triangle', 0.35);
    },
    heal: function () {
      // 宝可梦中心治愈
      note(784, 0, 0.1, 'sine', 0.3);
      note(988, 0.1, 0.1, 'sine', 0.3);
      note(1175, 0.2, 0.2, 'sine', 0.3);
    },
    buy: function () {
      // 购买
      note(880, 0, 0.06, 'square', 0.25);
      note(1320, 0.05, 0.1, 'square', 0.25);
    },
    error: function () {
      // 错误提示
      note(200, 0, 0.15, 'sawtooth', 0.3);
      note(200, 0.16, 0.15, 'sawtooth', 0.3);
    },
    select: function () {
      // 选中/确认（轻提示）
      note(880, 0, 0.05, 'square', 0.2);
    }
  };

  // ---------- BGM 系统 ----------
  // 简单的循环旋律（音符序列），[频率, 时长]；0 表示休止
  const BGM = {
    title: {
      tempo: 0.28,
      notes: [
        [523, 0.5], [659, 0.5], [784, 0.5], [1047, 0.5],
        [784, 0.5], [659, 0.5], [523, 1.0],
        [587, 0.5], [698, 0.5], [880, 0.5], [1175, 0.5],
        [880, 0.5], [698, 0.5], [587, 1.0]
      ]
    },
    explore: {
      tempo: 0.32,
      notes: [
        [392, 0.5], [523, 0.5], [659, 0.5], [523, 0.5],
        [440, 0.5], [587, 0.5], [698, 0.5], [587, 0.5],
        [349, 0.5], [440, 0.5], [523, 0.5], [440, 0.5],
        [330, 0.5], [392, 0.5], [523, 0.5], [392, 0.5]
      ]
    },
    battle: {
      tempo: 0.18,
      notes: [
        [330, 0.3], [330, 0.3], [392, 0.3], [494, 0.6],
        [392, 0.3], [330, 0.3], [294, 0.6],
        [330, 0.3], [392, 0.3], [494, 0.3], [659, 0.6],
        [523, 0.3], [392, 0.3], [330, 0.9]
      ]
    },
    gym: {
      tempo: 0.2,
      notes: [
        [262, 0.4], [311, 0.4], [392, 0.4], [523, 0.8],
        [466, 0.4], [392, 0.4], [311, 0.8],
        [349, 0.4], [415, 0.4], [523, 0.4], [698, 0.8],
        [622, 0.4], [523, 0.4], [392, 1.2]
      ]
    }
  };

  function stopBgm() {
    if (bgmTimer) {
      clearTimeout(bgmTimer);
      bgmTimer = null;
    }
    bgmNodes.forEach(function (n) {
      try { n.stop(); n.disconnect(); } catch (e) {}
    });
    bgmNodes = [];
    currentBgm = null;
  }

  function setBgm(name) {
    if (!ctx) return;
    if (!musicOn) {
      currentBgm = name; // 记录意图，开启音乐后播放
      return;
    }
    if (currentBgm === name) return;
    stopBgm();
    const track = BGM[name];
    if (!track) return;
    currentBgm = name;
    playBgmLoop(track);
  }

  function playBgmLoop(track) {
    let idx = 0;
    function step() {
      if (!currentBgm || !ctx) return;
      const n = track.notes[idx];
      if (n[0] > 0) {
        const t0 = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = n[0];
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.35, t0 + 0.02);
        g.gain.setValueAtTime(0.35, t0 + n[1] * track.tempo * 0.8);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + n[1] * track.tempo);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(t0);
        osc.stop(t0 + n[1] * track.tempo + 0.05);
        bgmNodes.push(osc);
        // 清理已结束节点
        setTimeout(function () {
          const i = bgmNodes.indexOf(osc);
          if (i >= 0) bgmNodes.splice(i, 1);
        }, (n[1] * track.tempo + 0.1) * 1000);
      }
      idx = (idx + 1) % track.notes.length;
    }
    step();
    function scheduleNext() { bgmTimer = setTimeout(step, 200); }
    scheduleNext();
  }

  // ---------- 对外接口 ----------
  function playClick() {
    if (!soundOn) return;
    resume();
    SFX.click();
  }

  function sfx(name) {
    if (!soundOn) return;
    resume();
    const now = Date.now();
    if (now - lastSfxTime < SFX_THROTTLE_MS) return;
    lastSfxTime = now;
    const fn = SFX[name];
    if (fn) fn();
  }

  // 根据招式属性播放对应命中音效
  function sfxByType(type) {
    if (!soundOn) return;
    resume();
    const map = {
      '火': 'hitFire', '水': 'hitWater', '草': 'hitGrass', '电': 'hitElectric',
      '冰': 'hitIce', '格斗': 'hitFighting', '毒': 'hitPoison', '地面': 'hitGround',
      '超能': 'hitPsychic', '岩石': 'hitRock', '幽灵': 'hitGhost', '虫': 'hitBug',
      '龙': 'hitDragon', '钢': 'hitSteel', '飞行': 'hitFlying', '妖精': 'hitFairy',
      '普通': 'hit', '恶': 'hitGhost',
    };
    const fn = SFX[map[type] || 'hit'];
    if (fn) fn();
  }

  function toggleSound() {
    soundOn = !soundOn;
    applyVolume();
    return soundOn;
  }

  function toggleMusic() {
    musicOn = !musicOn;
    applyVolume();
    if (musicOn && currentBgm) {
      const tmp = currentBgm;
      currentBgm = null;
      setBgm(tmp);
    } else if (!musicOn) {
      stopBgm();
    }
    return musicOn;
  }

  function setVolume(v) {
    volume = v;
    applyVolume();
  }

  function setSoundOn(v) { soundOn = !!v; applyVolume(); }
  function setMusicOn(v) {
    const prev = musicOn;
    musicOn = !!v;
    applyVolume();
    if (musicOn && !prev && currentBgm) {
      const tmp = currentBgm;
      currentBgm = null;
      setBgm(tmp);
    } else if (!musicOn) {
      stopBgm();
    }
  }

  function isSoundOn() { return soundOn; }
  function isMusicOn() { return musicOn; }

  // 根据 addLog 消息文本推断要播放的音效
  function playByMessage(msg) {
    if (!soundOn || !ctx) return;
    if (typeof msg !== 'string') return;
    // 优先级1：战斗结果（胜利/失败）最先判定，避免被其他关键词覆盖
    if (msg.indexOf('被击败了') >= 0) { SFX.defeat(); return; }
    if (msg.indexOf('获得了胜利') >= 0) { SFX.victory(); return; }
    // 优先级2：高亮事件（进化/徽章/升级/捕捉）
    if (msg.indexOf('进化了') >= 0) { SFX.evolve(); return; }
    if (msg.indexOf('徽章') >= 0) { SFX.badge(); return; }
    if (msg.indexOf('升到了') >= 0) { SFX.levelUp(); return; }
    if (msg.indexOf('捕捉了') >= 0 || msg.indexOf('成功收服') >= 0) { SFX.capture(); return; }
    if (msg.indexOf('挣脱了') >= 0) { SFX.captureFail(); return; }
    // 优先级3：宝可梦倒下
    if (msg.indexOf('倒下了') >= 0) { SFX.faint(); return; }
    // 优先级4：战斗反馈
    if (msg.indexOf('效果拔群') >= 0) { SFX.superEffective(); return; }
    if (msg.indexOf('效果不太好') >= 0) { SFX.notEffective(); return; }
    if (msg.indexOf('没有命中') >= 0) { SFX.miss(); return; }
    if (msg.indexOf('回复了') >= 0 || msg.indexOf('恢复了活力') >= 0) { SFX.heal(); return; }
    // 优先级5：动作音效
    if (msg.indexOf('丢出了') >= 0) { SFX.ballThrow(); return; }
    if (msg.indexOf('出现了') >= 0) { SFX.encounter(); return; }
    if (msg.indexOf('购买了') >= 0) { SFX.buy(); return; }
    if (msg.indexOf('向你发起了挑战') >= 0 || msg.indexOf('派出了') >= 0) { SFX.battleStart(); return; }
    // 优先级6：提示与反馈
    if (msg.indexOf('余额不足') >= 0 || msg.indexOf('没有能战斗') >= 0 ||
        msg.indexOf('无法到达') >= 0 || msg.indexOf('逃跑失败') >= 0) { SFX.error(); return; }
    if (msg.indexOf('成功逃跑了') >= 0) { SFX.select(); return; }
  }

  window.AU = {
    init: init,
    resume: resume,
    playClick: playClick,
    sfx: sfx,
    sfxByType: sfxByType,
    setBgm: setBgm,
    stopBgm: stopBgm,
    setVolume: setVolume,
    setSoundOn: setSoundOn,
    setMusicOn: setMusicOn,
    toggleSound: toggleSound,
    toggleMusic: toggleMusic,
    isSoundOn: isSoundOn,
    isMusicOn: isMusicOn,
    playByMessage: playByMessage
  };
})();
