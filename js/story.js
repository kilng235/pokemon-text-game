// 剧情事件
// 每个事件: { id, location, condition, dialogue, battle, battleType?, onFinish }
const STORY_EVENTS = {
  // 月见山 - 火箭队抢夺化石
  mtMoonRocket: {
    location: 'mtMoon',
    condition: () => !G.storyFlags.mtMoonDone,
    dialogue: [
      { speaker: '火箭队手下', text: '站住！这里是火箭队的地盘！' },
      { speaker: '火箭队手下', text: '我们在挖掘化石，不想死就快滚！' },
    ],
    battle: { name: '火箭队手下', team: [[23,10], [41,10]] },
    onFinish: () => {
      G.storyFlags.mtMoonDone = true
      G.player.money += 300
      return '你击退了火箭队手下！获得 ¥300！'
    },
  },

  // 紫苑镇 - 灵骨塔火箭队
  lavenderTower: {
    location: 'lavender',
    condition: () => G.storyFlags.mtMoonDone && !G.storyFlags.lavenderDone,
    dialogue: [
      { speaker: '路人', text: '宝可梦之塔里闹鬼……有人看到幽灵出没。' },
      { speaker: '', text: '你鼓起勇气走进宝可梦之塔……' },
      { speaker: '火箭队手下', text: '可恶！谁让你进来的！' },
    ],
    battle: { name: '火箭队手下', team: [[92,15], [41,14], [42,16]] },
    onFinish: () => {
      G.storyFlags.lavenderDone = true
      G.player.money += 500
      return '击退了占据灵骨塔的火箭队！获得 ¥500！紫苑镇恢复了宁静。'
    },
  },

  // 金黄市 - 希鲁夫公司
  silphCo: {
    location: 'saffron',
    condition: () => G.storyFlags.lavenderDone && !G.storyFlags.silphDone && G.player.badge >= 4,
    dialogue: [
      { speaker: '希鲁夫员工', text: '火箭队占领了整栋大楼！请帮帮我们！' },
      { speaker: '', text: '你冲进了希鲁夫公司总部……' },
      { speaker: '火箭队干部', text: '哼！又是你！别想妨碍火箭队的计划！' },
    ],
    battle: { name: '火箭队干部', team: [[24,22], [34,22], [89,24], [110,24]] },
    onFinish: () => {
      G.storyFlags.silphDone = true
      G.player.money += 1000
      return '从火箭队手中夺回了希鲁夫公司！获得 ¥1000！'
    },
  },

  // 小茂 #1 - 22号道路（初遇）
  rivalRoute22_1: {
    location: 'route22',
    condition: () => !G.storyFlags.rivalRoute22_1 && !G.storyFlags.firstRivalDone && G.player.badge === 0,
    dialogue: [
      { speaker: '小茂', text: '哟！你也要出发旅行了？' },
      { speaker: '小茂', text: '我可是大木博士的孙子！跟你这种家伙可不一样！' },
      { speaker: '小茂', text: '让我看看你有几斤几两吧！' },
    ],
    battle: { name: '小茂', team: [[133,5]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalRoute22_1 = true
      G.player.money += 200
      return '击败了小茂！获得 ¥200！小茂不甘心地跑开了。'
    },
  },

  // 小茂 #2 - 4号道路（月见山后）
  rivalRoute4: {
    location: 'route4',
    condition: () => G.storyFlags.mtMoonDone && !G.storyFlags.rivalRoute4 && G.player.badge >= 1,
    dialogue: [
      { speaker: '小茂', text: '哟，居然通过了月见山？' },
      { speaker: '小茂', text: '看来你也稍微有点本事了。' },
      { speaker: '小茂', text: '不过跟我比还差得远呢！上吧！' },
    ],
    battle: { name: '小茂', team: [[17,9], [133,8]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalRoute4 = true
      G.player.money += 400
      return '再次击败了小茂！获得 ¥400！'
    },
  },

  // 小茂 #3 - 5号道路（华蓝市后）
  rivalRoute5: {
    location: 'route5',
    condition: () => !G.storyFlags.rivalRoute5 && G.player.badge >= 2,
    dialogue: [
      { speaker: '小茂', text: '哼！我已经收集第二个徽章了！你呢？' },
      { speaker: '小茂', text: '……算了，反正你肯定不如我！' },
      { speaker: '小茂', text: '来啊，让我看看你的成长！' },
    ],
    battle: { name: '小茂', team: [[17,15], [64,14], [58,16]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalRoute5 = true
      G.player.money += 600
      return '击败了小茂！获得 ¥600！小茂的表情有些扭曲。'
    },
  },

  // 小茂 #4 - 8号道路（紫苑镇后）
  rivalRoute8: {
    location: 'route8',
    condition: () => !G.storyFlags.rivalRoute8 && G.player.badge >= 3,
    dialogue: [
      { speaker: '小茂', text: '紫苑镇……你也听说了灵骨塔的事？' },
      { speaker: '小茂', text: '我忙着训练，没空管那些。' },
      { speaker: '小茂', text: '倒是你，别多管闲事！来对战！' },
    ],
    battle: { name: '小茂', team: [[17,18], [58,18], [102,17]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalRoute8 = true
      G.player.money += 800
      return '击败了小茂！获得 ¥800！小茂气得直跺脚。'
    },
  },

  // 小茂 #5 - 16号道路（彩虹市后）
  rivalRoute16: {
    location: 'route16',
    condition: () => !G.storyFlags.rivalRoute16 && G.player.badge >= 6,
    dialogue: [
      { speaker: '小茂', text: '你已经拿到6个徽章了？！' },
      { speaker: '小茂', text: '……可恶，我绝对不会输给你！' },
      { speaker: '小茂', text: '这次是我最后的警告！输了别哭鼻子！' },
    ],
    battle: { name: '小茂', team: [[18,28], [59,28], [102,26], [112,27]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalRoute16 = true
      G.player.money += 1200
      return '击败了小茂！获得 ¥1200！小茂沉默不语地离开了。'
    },
  },

  // 小茂 #6 - 22号道路（决战前）
  rivalRoute22_2: {
    location: 'route22',
    condition: () => !G.storyFlags.rivalRoute22_2 && G.player.badge >= 7,
    dialogue: [
      { speaker: '小茂', text: '我们又见面了……' },
      { speaker: '小茂', text: '这就是最后的道路。通往联盟的路……' },
      { speaker: '小茂', text: '但只有一个人能通过！那就是我！' },
    ],
    battle: { name: '小茂', team: [[18,35], [59,35], [102,32], [112,34], [130,33]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalRoute22_2 = true
      G.player.money += 1500
      return '击败了小茂！获得 ¥1500！小茂低下了头……你通过了最后的考验。'
    },
  },

  // 联盟 - 四天王
  eliteFour: {
    location: 'indigo',
    condition: () => G.player.badge >= 8 && !G.storyFlags.championDefeated,
    dialogue: [
      { speaker: '', text: '欢迎来到宝可梦联盟！' },
      { speaker: '联盟接待员', text: '只有集齐8枚徽章的训练家才有资格挑战四天王。' },
      { speaker: '联盟接待员', text: '你即将面对关都最强的训练家们！准备好了吗？' },
    ],
    battle: true, // 用于触发战斗按钮
    onFinish: null,
  },
}

// 战斗后事件触发
function checkStoryTrigger(locationId) {
  for (const [key, ev] of Object.entries(STORY_EVENTS)) {
    if (ev.location === locationId && ev.condition()) {
      return key
    }
  }
  return null
}
