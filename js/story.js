// 剧情事件
// 每个事件: { id, location, condition, dialogue, battle, onFinish }
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

  // 联盟 - 四天王
  eliteFour: {
    location: 'indigo',
    condition: () => G.player.badge >= 8 && !G.storyFlags.championDefeated,
    dialogue: [
      { speaker: '', text: '欢迎来到宝可梦联盟！' },
      { speaker: '联盟接待员', text: '只有集齐8枚徽章的训练家才有资格挑战四天王。' },
      { speaker: '', text: '你即将面对关都最强的训练家们！准备好了吗？' },
    ],
    battle: null,
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
