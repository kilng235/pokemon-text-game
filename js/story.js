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

  // 海角小屋 - 正辉的求助
  billHouse: {
    location: 'billHouse',
    condition: () => !G.storyFlags.billDone,
    dialogue: [
      { speaker: '', text: '你走进了海角小屋……' },
      { speaker: '', text: '咦？桌上有一只奇怪的宝可梦——等等，那不是宝可梦！' },
      { speaker: '正辉', text: '救命啊！我被传输装置卡住了！！快帮我按下电脑！' },
      { speaker: '', text: '你按下了电脑上的传输按钮……' },
      { speaker: '', text: '——哔哔——传输完成——' },
      { speaker: '正辉', text: '哦！终于得救了！谢谢你救了我！' },
      { speaker: '正辉', text: '作为谢礼，这张圣安奴号的船票给你吧！枯叶港口的船就要出发了！' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.billDone = true
      G.player.items.sailTicket = (G.player.items.sailTicket || 0) + 1
      addLog('获得了圣安奴号的船票！')
      return '正辉感谢你的帮助，送给你一张圣安奴号的船票！'
    },
  },

  // 圣安奴号 - 船长的挑战
  ssAnne: {
    location: 'ssAnne',
    condition: () => G.storyFlags.billDone && !G.storyFlags.ssAnneDone,
    dialogue: [
      { speaker: '', text: '你登上了圣安奴号！' },
      { speaker: '', text: '甲板上正在举行盛大的宴会，到处都是训练家。' },
      { speaker: '', text: '你一路击败了挑战者，来到了船长室……' },
      { speaker: '', text: '船长正痛苦地躺在椅子上。' },
      { speaker: '船长', text: '呜……我晕船了……' },
      { speaker: '船长', text: '年轻的训练家啊，来和我对战吧！也许转移注意力会好受些！' },
    ],
    battle: { name: '船长', team: [[72,18], [98,20], [120,22]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.ssAnneDone = true
      G.player.money += 500
      G.player.items.cutHM = (G.player.items.cutHM || 0) + 1
      return '击败了晕船的船长！获得了HM01居合术！获得 ¥500！'
    },
  },

  // 火箭队秘密基地 - 坂木登场
  rocketHideout: {
    location: 'rocketHideout',
    condition: () => G.player.badge >= 4 && !G.storyFlags.rocketHideoutDone,
    dialogue: [
      { speaker: '', text: '你在彩虹市游戏厅发现了一条隐秘的楼梯……' },
      { speaker: '', text: '地下竟然别有洞天！这是一个巨大的火箭队基地！' },
      { speaker: '火箭队手下', text: '有人入侵！！干掉他！' },
      { speaker: '', text: '你一路击倒守卫，来到了最深处……' },
      { speaker: '坂木', text: '哼……竟然能来到这里，有点本事。' },
      { speaker: '坂木', text: '但你也就到此为止了！' },
    ],
    battle: { name: '坂木', team: [[52,25], [111,27], [34,29]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.rocketHideoutDone = true
      G.player.money += 1000
      return '坂木撤退了！火箭队秘密基地被摧毁！获得 ¥1000！'
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

  // 华蓝市 — 领取包裹
  getPackage: {
    location: 'cerulean',
    condition: () => !G.storyFlags.gotPackage,
    dialogue: [
      { speaker: '店员', text: '你好！你是大木博士派来的吧？' },
      { speaker: '店员', text: '这有一个寄给大木博士的包裹，请帮忙转交给他。' },
      { speaker: '', text: '获得了大木博士的包裹！' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.gotPackage = true
      G.player.items.pokeball = (G.player.items.pokeball || 0) + 5
      return '从店员那里领取了大木博士的包裹！还获得了5个精灵球作为谢礼！'
    },
  },

  // 真新镇 — 交付包裹 + 获得图鉴
  deliverPackage: {
    location: 'pallet',
    condition: () => G.storyFlags.gotPackage && !G.storyFlags.deliveredPackage,
    dialogue: [
      { speaker: '大木博士', text: '哦！你回来了！' },
      { speaker: '大木博士', text: '那是我的包裹！真是帮了大忙了！' },
      { speaker: '大木博士', text: '作为谢礼，我送你这台宝可梦图鉴！' },
      { speaker: '大木博士', text: '它会自动记录你遇到的宝可梦信息。' },
      { speaker: '', text: '获得了宝可梦图鉴！' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.deliveredPackage = true
      G.storyFlags.gotPokedex = true
      return '交付了包裹！从大木博士那里获得了宝可梦图鉴！'
    },
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
