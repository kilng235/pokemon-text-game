// 剧情事件
// 每个事件: { id, location, condition, dialogue, battle, battleType?, onFinish }
const STORY_EVENTS = {
  // 月见山 - 火箭队抢夺化石
  mtMoonRocket: {
    location: 'mtMoon',
    condition: () => G.player.badge >= 1 && !G.storyFlags.mtMoonDone,
    dialogue: [
      { speaker: '火箭队手下', text: '站住！这里是火箭队的地盘！' },
      { speaker: '火箭队手下', text: '我们在挖掘化石，不想死就快滚！' },
    ],
    battle: { name: '火箭队手下', team: [[23,8], [41,8]] },
    onFinish: () => {
      G.storyFlags.mtMoonDone = true
      G.player.money += 300
      return '你击退了火箭队手下！获得 ¥300！'
    },
  },

  // 小茂 #3.5 - 紫苑宝可梦塔前（前置战）
  rivalLavender: {
    location: 'lavender',
    condition: () => G.storyFlags.mtMoonDone && !G.storyFlags.rivalLavenderDone && !G.storyFlags.lavenderDone,
    dialogue: [
      { speaker: '', text: '你刚踏入紫苑镇，一个熟悉的身影从墓碑后闪出——' },
      { speaker: '小茂', text: '你怎么也来紫苑了？' },
      { speaker: '小茂', text: '听说宝可梦之塔在闹鬼，不过我可不信那些。' },
      { speaker: '小茂', text: '先跟我打一场吧，热热身！' },
    ],
    battle: { name: '小茂', team: [[93,20], [92,22], [133,22]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalLavenderDone = true
      G.player.money += 500
      const pos = G.player.position
      chainNextStoryEvent(pos, 800)
      return '击败了小茂！获得 ¥500！小茂摆摆手走了，你向宝可梦之塔走去……'
    },
  },

  // 紫苑镇 - 灵骨塔火箭队
  lavenderTower: {
    location: 'lavender',
    condition: () => G.storyFlags.mtMoonDone && G.storyFlags.rivalLavenderDone && !G.storyFlags.lavenderDone,
    dialogue: [
      { speaker: '路人', text: '宝可梦之塔里闹鬼……有人看到幽灵出没。' },
      { speaker: '', text: '你鼓起勇气走进宝可梦之塔……' },
      { speaker: '火箭队手下', text: '可恶！谁让你进来的！' },
    ],
    battle: { name: '火箭队手下', team: [[92,13], [41,12], [42,14]] },
    onFinish: () => {
      G.storyFlags.lavenderDone = true
      G.player.money += 500
      return '击退了占据灵骨塔的火箭队！获得 ¥500！紫苑镇恢复了宁静。'
    },
  },

  // 小茂 #5.5 - 希鲁夫公司楼层（前置战）
  rivalSilph: {
    location: 'saffron',
    condition: () => G.storyFlags.lavenderDone && !G.storyFlags.rivalSilphDone && !G.storyFlags.silphDone && G.player.badge >= 4,
    dialogue: [
      { speaker: '', text: '金黄市的希鲁夫公司总部被火箭队占领，你冲了进去……' },
      { speaker: '', text: '刚上到楼层，电梯门开了，迎面竟是小茂。' },
      { speaker: '小茂', text: '哼，又见面了。' },
      { speaker: '小茂', text: '我是来抢功劳的——啊不，是来救员工的！' },
      { speaker: '小茂', text: '不过既然碰上了，先打一场再说！' },
    ],
    battle: { name: '小茂', team: [[64,36], [65,38], [133,38]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalSilphDone = true
      G.player.money += 900
      const pos = G.player.position
      chainNextStoryEvent(pos, 800)
      return '击败了小茂！获得 ¥900！小茂撇撇嘴："算你厉害，里面那个干部交给你了！"'
    },
  },

  // 金黄市 - 希鲁夫公司
  silphCo: {
    location: 'saffron',
    condition: () => G.storyFlags.lavenderDone && G.storyFlags.rivalSilphDone && !G.storyFlags.silphDone && G.player.badge >= 4,
    dialogue: [
      { speaker: '希鲁夫员工', text: '火箭队占领了整栋大楼！请帮帮我们！' },
      { speaker: '', text: '你冲进了希鲁夫公司总部……' },
      { speaker: '火箭队干部', text: '哼！又是你！别想妨碍火箭队的计划！' },
    ],
    battle: { name: '火箭队干部', team: [[24,20], [34,20], [89,22], [110,22]] },
    onFinish: () => {
      G.storyFlags.silphDone = true
      G.player.money += 1000
      return '从火箭队手中夺回了希鲁夫公司！获得 ¥1000！'
    },
  },

  // 小茂 #1 - 22号道路（初遇）
  rivalRoute22_1: {
    location: 'route22',
    condition: () => !G.storyFlags.rivalRoute22_1 && G.player.badge === 0,
    dialogue: [
      { speaker: '小茂', text: '哟！你也要出发旅行了？' },
      { speaker: '小茂', text: '我可是大木博士的孙子！跟你这种家伙可不一样！' },
      { speaker: '小茂', text: '让我看看你有几斤几两吧！' },
    ],
    battle: { name: '小茂', team: [[133,5]], statModifier: { atk: 0.6, spa: 0.6 } },
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
    battle: { name: '小茂', team: [[17,7], [133,6]] },
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
    battle: { name: '小茂', team: [[17,13], [64,12], [58,14]] },
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
    battle: { name: '小茂', team: [[17,16], [58,16], [102,15]] },
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
    battle: { name: '小茂', team: [[18,26], [59,26], [102,24], [112,25]] },
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
    battle: { name: '小茂', team: [[18,33], [59,33], [102,30], [112,32], [130,31]] },
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

  // 小茂 #2.5 - 圣安奴号甲板（前置战）
  rivalSsAnne: {
    location: 'ssAnne',
    condition: () => G.storyFlags.billDone && !G.storyFlags.rivalSsAnneDone && !G.storyFlags.ssAnneDone,
    dialogue: [
      { speaker: '', text: '你刚登上圣安奴号，甲板上一个熟悉的身影拦住了你……' },
      { speaker: '小茂', text: '哟！没想到在这儿碰到我吧？' },
      { speaker: '小茂', text: '船上这么多训练家，我可是最强的！让我证明给你看！' },
    ],
    battle: { name: '小茂', team: [[16,18], [19,18], [133,18]] },
    battleType: 'rival',
    onFinish: () => {
      G.storyFlags.rivalSsAnneDone = true
      G.player.money += 350
      const pos = G.player.position
      chainNextStoryEvent(pos, 800)
      return '击败了小茂！获得 ¥350！小茂悻悻地跑开了，你继续向船长室走去……'
    },
  },

  // 圣安奴号 - 船长的挑战
  ssAnne: {
    location: 'ssAnne',
    condition: () => G.storyFlags.billDone && G.storyFlags.rivalSsAnneDone && !G.storyFlags.ssAnneDone,
    dialogue: [
      { speaker: '', text: '你登上了圣安奴号！' },
      { speaker: '', text: '甲板上正在举行盛大的宴会，到处都是训练家。' },
      { speaker: '', text: '你一路击败了挑战者，来到了船长室……' },
      { speaker: '', text: '船长正痛苦地躺在椅子上。' },
      { speaker: '船长', text: '呜……我晕船了……' },
      { speaker: '船长', text: '年轻的训练家啊，来和我对战吧！也许转移注意力会好受些！' },
    ],
    battle: { name: '船长', team: [[72,16], [98,18], [120,20]] },
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
    battle: { name: '坂木', team: [[52,23], [111,25], [34,27]] },
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

  // 常青市 — 领取包裹
  getPackage: {
    location: 'viridian',
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

  // 浅红市 — 狩猎地带
  safariZone: {
    location: 'safariZone',
    condition: () => !G.storyFlags.safariDone,
    dialogue: [
      { speaker: '', text: '你来到了狩猎地带的入口……' },
      { speaker: '公园管理人', text: '欢迎来到狩猎地带！' },
      { speaker: '公园管理人', text: '这里是关都最大的野生宝可梦保护区。' },
      { speaker: '公园管理人', text: '这里有很多稀有的宝可梦，好好探索吧！' },
      { speaker: '', text: '你在狩猎地带里四处探索，发现了许多珍贵的宝可梦！' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.safariDone = true
      G.player.items.safariBall = (G.player.items.safariBall || 0) + 30
      G.player.items.surfHM = (G.player.items.surfHM || 0) + 1
      return '探索了狩猎地带！获得了30个狩猎球和HM03冲浪术！'
    },
  },

  // 月见山 — 化石选择
  mtMoonFossil: {
    location: 'mtMoon',
    condition: () => G.storyFlags.mtMoonDone && !G.storyFlags.gotFossil,
    dialogue: [
      { speaker: '', text: '在洞穴深处，你发现了两个奇怪的石头……' },
      { speaker: '化石研究员', text: '等等！那是珍贵的化石！' },
      { speaker: '化石研究员', text: '我是研究化石的专家。这里有两个化石，你可以选一个带走。' },
      { speaker: '化石研究员', text: '左边是菊石兽的化石，右边是化石盔的化石。' },
      { speaker: '化石研究员', text: '选好了就告诉我吧！' },
    ],
    battle: null,
    choices: [
      { text: '选择菊石兽化石', pokemonId: 138 },
      { text: '选择化石盔化石', pokemonId: 140 },
    ],
    onFinish: (choice) => {
      G.storyFlags.gotFossil = true
      const pkm = createPokemon(choice.pokemonId, 25)
      G.player.pokemon.push(pkm)
      return `获得了 ${pkm.name}！研究员会帮你复活它。`
    },
  },

  // 双子岛 — 急冻鸟
  seafoamIslands: {
    location: 'seafoamIslands',
    condition: () => G.player.items.surfHM && !G.storyFlags.seafoamDone,
    dialogue: [
      { speaker: '', text: '你用冲浪术进入了双子岛深处……' },
      { speaker: '', text: '冰冷的空气中，你看到了一只闪耀的宝可梦！' },
      { speaker: '神秘的声音', text: '你终于来了……训练家……' },
      { speaker: '', text: '是传说中的急冻鸟！' },
    ],
    battle: { name: '急冻鸟', team: [[144,50]] },
    battleType: 'legendary',
    onFinish: () => {
      G.storyFlags.seafoamDone = true
      return '击败了急冻鸟！你可以用精灵球捕捉它！'
    },
  },

  // 无人发电站 — 闪电鸟
  powerPlant: {
    location: 'powerPlant',
    condition: () => G.storyFlags.silphDone && !G.storyFlags.powerPlantDone,
    dialogue: [
      { speaker: '', text: '废弃的发电站里到处都是生锈的机器……' },
      { speaker: '研究员', text: '这里是无人发电站，听说有传说宝可梦出没。' },
      { speaker: '研究员', text: '小心点，电系宝可梦很危险！' },
      { speaker: '', text: '突然，一道闪电划过！' },
      { speaker: '', text: '是传说中的闪电鸟！' },
    ],
    battle: { name: '闪电鸟', team: [[145,50]] },
    battleType: 'legendary',
    onFinish: () => {
      G.storyFlags.powerPlantDone = true
      return '击败了闪电鸟！你可以用精灵球捕捉它！'
    },
  },

  // 红莲镇宝可梦屋 — 坂木的实验
  pokemonMansion: {
    location: 'pokemonMansion',
    condition: () => G.storyFlags.rocketHideoutDone && !G.storyFlags.mansionDone,
    dialogue: [
      { speaker: '', text: '你走进了废弃的宝可梦屋……' },
      { speaker: '', text: '到处都是散落的文件和实验器材。' },
      { speaker: '研究员笔记', text: '这是坂木的实验记录……他在研究强化宝可梦的方法。' },
      { speaker: '', text: '你在抽屉里发现了一把钥匙！' },
      { speaker: '研究员笔记', text: '这把钥匙可以打开红莲道馆的隐藏门。' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.mansionDone = true
      G.player.items.secretKey = (G.player.items.secretKey || 0) + 1
      G.player.money += 800
      return '获得了秘密钥匙！还发现了 ¥800 现金！'
    },
  },

  // 华蓝洞穴 — 超梦
  ceruleanCave: {
    location: 'ceruleanCave',
    condition: () => G.player.badge >= 8 && !G.storyFlags.ceruleanDone,
    dialogue: [
      { speaker: '', text: '洞穴越来越深，空气中弥漫着奇怪的气息……' },
      { speaker: '', text: '你感到一股强大的力量在前方！' },
      { speaker: '', text: '那是……传说中的超梦！' },
    ],
    battle: { name: '超梦', team: [[150,70]] },
    battleType: 'legendary',
    onFinish: () => {
      G.storyFlags.ceruleanDone = true
      return '击败了超梦！这只传说宝可梦已经认可了你的实力！'
    },
  },

  // 岩山隧道 — 登山者
  rockTunnel: {
    location: 'rockTunnel',
    condition: () => G.player.badge >= 3 && !G.storyFlags.rockTunnelDone,
    dialogue: [
      { speaker: '', text: '你走进了漆黑的岩山隧道……' },
      { speaker: '登山者', text: '喂！年轻人！这里很危险，没有灯可不行！' },
      { speaker: '登山者', text: '我是经常穿越这座隧道的登山客。' },
      { speaker: '登山者', text: '隧道另一头通向紫苑镇，我来带你过去吧！' },
      { speaker: '', text: '登山者帮你照亮了前方的路……' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.rockTunnelDone = true
      G.player.money += 200
      return '在登山者的帮助下安全穿越了岩山隧道！获得了 ¥200！'
    },
  },

  // 常青森林 — 捕虫少年
  viridianForest: {
    location: 'viridianForest',
    condition: () => !G.storyFlags.forestDone,
    dialogue: [
      { speaker: '', text: '你走进了茂密的常青森林……' },
      { speaker: '捕虫少年', text: '嘿！你是训练家吗？' },
      { speaker: '捕虫少年', text: '这片森林里有很多虫系宝可梦，我抓了好多！' },
      { speaker: '捕虫少年', text: '要不要比试一下？如果你赢了，我告诉你一条捷径！' },
    ],
    battle: { name: '捕虫少年', team: [[10,5], [13,6], [48,5]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.forestDone = true
      G.player.money += 150
      return '击败了捕虫少年！他告诉你穿过森林的捷径！获得了 ¥150！'
    },
  },

  // 脐眼岛 — Celio 介绍 + Lostelle 委托
  seviiArrival: {
    location: 'island1',
    condition: () => G.storyFlags.championDefeated && !G.storyFlags.seviiArrivalDone,
    dialogue: [
      { speaker: '', text: '渡轮缓缓靠岸，你踏上了脐眼岛——七之岛的大门。' },
      { speaker: '', text: '一位戴着眼镜的青年迎了上来。' },
      { speaker: 'Celio', text: '你好！我叫 Celio，是宝可梦网络中心的管理员。' },
      { speaker: 'Celio', text: '关都的联盟冠军啊……久仰大名。' },
      { speaker: 'Celio', text: '不瞒你说，七之岛最近被火箭队残党搞得鸡犬不宁……' },
      { speaker: 'Celio', text: '在我研究网络之余，能拜托你一件事吗？' },
      { speaker: 'Celio', text: '三之岛森林里有个叫 Lostelle 的小女孩失踪了，她父亲非常着急。' },
      { speaker: 'Celio', text: '请你先去三之岛的树果森林找找她吧！' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.seviiArrivalDone = true
      return 'Celio 拜托你去找寻失踪的小女孩 Lostelle。先去三之岛的树果森林看看吧。'
    },
  },

  // 三之岛树果森林 — 救出 Lostelle
  seviiLostelle: {
    location: 'island3_forest',
    condition: () => G.storyFlags.seviiArrivalDone && !G.storyFlags.seviiLostelleDone,
    dialogue: [
      { speaker: '', text: '你走进茂密的树果森林，远处传来哭声……' },
      { speaker: 'Lostelle', text: '呜呜呜……救救我……' },
      { speaker: '火箭队残党', text: '哼哼，小丫头别想跑！' },
      { speaker: '', text: '一个火箭队残党正拽着小女孩！' },
      { speaker: '火箭队残党', text: '哟，又来一个找死的？一起收拾了！' },
    ],
    battle: { name: '火箭队残党', team: [[22,30], [109,30]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.seviiLostelleDone = true
      G.player.money += 600
      return '救出 Lostelle！她父亲送来 ¥600 谢礼。Celio 传来消息——希望你去脐眼岛北部的 Ember 山找一块红宝石……'
    },
  },

  // Ember 山 — 火箭队挖红宝石
  seviiMtEmber: {
    location: 'island1_mtember',
    condition: () => G.storyFlags.seviiLostelleDone && !G.storyFlags.seviiMtEmberDone,
    dialogue: [
      { speaker: '', text: '你来到 Ember 山的火山口，远处传来挖凿声……' },
      { speaker: '火箭队残党', text: '快挖！这底下肯定有红宝石！' },
      { speaker: '火箭队残党', text: '谁？！竟然追到这里来了！' },
      { speaker: '火箭队残党', text: '别想拿走红宝石！上吧！' },
    ],
    battle: { name: '火箭队残党', team: [[66,40], [128,40]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.seviiMtEmberDone = true
      G.player.items.rubyPlate = (G.player.items.rubyPlate || 0) + 1
      G.player.money += 700
      return '击败火箭队残党！在火山洞穴深处找到了「红宝石」！Celio 让你继续寻找传说中的「蓝宝石」——据说藏在战怪岛的谜之遗迹里……'
    },
  },

  // 谜之遗迹（Dotted Hole） — 取得蓝宝石
  seviiDottedHole: {
    location: 'island6_ruins',
    condition: () => G.storyFlags.seviiMtEmberDone && !G.storyFlags.seviiDottedHoleDone,
    dialogue: [
      { speaker: '', text: '你来到战怪岛的谜之遗迹，入口刻着一行小字——' },
      { speaker: '石碑文字', text: '「LET ME GO」——迷宫以语言为钥。' },
      { speaker: '', text: '你按顺序念出文字，地板缓缓移开，露出一条暗道……' },
      { speaker: '', text: '遗迹之底，一颗发着幽光的蓝色宝石静静悬浮在空中。' },
      { speaker: '', text: '你伸手取下「蓝宝石」——' },
      { speaker: '火箭队干部', text: '哈！多谢你帮我们打开了陷阱！' },
      { speaker: '火箭队干部', text: '蓝宝石归我们了！想拿回来，就到群兰岛的仓库来吧！' },
      { speaker: '', text: '火箭队干部抢走蓝宝石，扬长而去……' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.seviiDottedHoleDone = true
      G.player.money += 500
      return '蓝宝石被火箭队干部抢走了！必须到群兰岛的火箭队仓库把它夺回来！'
    },
  },

  // 群兰岛火箭队仓库 — 夺回蓝宝石
  seviiRocketWarehouse: {
    location: 'island5_rocket',
    condition: () => G.storyFlags.seviiDottedHoleDone && !G.storyFlags.seviiRocketDone,
    dialogue: [
      { speaker: '', text: '你用谜之遗迹的暗语破解了仓库的密码门……' },
      { speaker: '', text: '里面盘踞着火箭队残党的精英。' },
      { speaker: '火箭队精英', text: '你又来了……这次不会再让你活着离开！' },
      { speaker: '火箭队精英', text: '就让这只恶魔系宝可梦送你上路！' },
    ],
    battle: { name: '火箭队精英', team: [[229,44], [262,45], [248,48]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.seviiRocketDone = true
      G.player.items.sapphirePlate = (G.player.items.sapphirePlate || 0) + 1
      G.player.money += 2000
      return '击败了火箭队精英！夺回「蓝宝石」！Celio 在脐眼岛等你交付红蓝宝石……'
    },
  },

  // 脐眼岛 — Celio 交付红蓝宝石，开通全岛网络
  seviiCelio: {
    location: 'island1',
    condition: () => G.storyFlags.seviiRocketDone && !G.storyFlags.seviiCelioDone,
    dialogue: [
      { speaker: '', text: '你回到脐眼岛，把红宝石和蓝宝石交给 Celio。' },
      { speaker: 'Celio', text: '太好了！这就是传说中的两颗宝石……' },
      { speaker: 'Celio', text: '让我接入网络中心……调试……' },
      { speaker: '', text: '——嗡嗡——机器启动——指示灯依次亮起——' },
      { speaker: 'Celio', text: '成功了！七之岛全岛网络正式开通！' },
      { speaker: 'Celio', text: '现在你可以自由来往各个小岛了。' },
      { speaker: 'Celio', text: '听说四之岛的冰霜洞穴、绝壁岛外海的小岛都有奇怪动静，去看看吧！' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.seviiCelioDone = true
      addLog('★ 七之岛全岛网络开通！可以自由来往各岛了。')
      return 'Celio 开通了全岛网络！现在可以去更远的岛屿探索了。'
    },
  },

  // 冰霜洞穴 — 科拿事件
  seviiIcefall: {
    location: 'island4_cave',
    condition: () => G.storyFlags.seviiCelioDone && !G.storyFlags.seviiIcefallDone,
    dialogue: [
      { speaker: '', text: '你走进冰霜洞穴深处，寒气刺骨……' },
      { speaker: '', text: '远处传来打斗声，一个穿白衣的女性正与火箭队残党缠斗。' },
      { speaker: '科拿', text: '呃……你们这群家伙真不怕死！' },
      { speaker: '火箭队残党', text: '哼，四天王又怎么样？今天我们要让你知道厉害！' },
      { speaker: '科拿', text: '哦？这位训练家是来帮我的？正好，一起上！' },
    ],
    battle: { name: '火箭队残党', team: [[169,45], [248,46]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.seviiIcefallDone = true
      G.player.money += 1000
      addLog('科拿：谢谢你，训练家。听说绝壁岛附近有座神秘小岛，叫 Birth Island……')
      return '协助科拿击退了火箭队残党！科拿提到绝壁岛外海有一座叫 Birth Island 的神秘小岛……'
    },
  },

  // Birth Island — 代欧奇希斯
  seviiBirth: {
    location: 'island7_birth',
    condition: () => G.storyFlags.seviiIcefallDone && !G.storyFlags.seviiBirthDone,
    dialogue: [
      { speaker: '', text: '你登上了 Birth Island——一座空无一物的小岛。' },
      { speaker: '', text: '岛中央立着一个黑色的三角形石碑。' },
      { speaker: '', text: '你试着靠近石碑，它突然发出刺眼的光芒……' },
      { speaker: '', text: '石碑缓缓旋转，化为一只来自宇宙的宝可梦！' },
      { speaker: '', text: '代欧奇希斯出现了！' },
    ],
    battle: { name: '代欧奇希斯', team: [[386,60]] },
    battleType: 'legendary',
    onFinish: () => {
      G.storyFlags.seviiBirthDone = true
      return '击败了来自宇宙的代欧奇希斯！你可以用精灵球捕捉它！'
    },
  },

  // 训练家之塔 — 最终挑战
  seviiTower: {
    location: 'island7_tower',
    condition: () => G.storyFlags.seviiBirthDone && !G.storyFlags.seviiTowerDone,
    dialogue: [
      { speaker: '', text: '训练家之塔——七之岛的顶点！' },
      { speaker: '', text: '传说只有最强的训练家才能登顶。' },
      { speaker: '塔主', text: '欢迎，关都的冠军。' },
      { speaker: '塔主', text: '要想登顶训练家之塔，先过我这关！' },
      { speaker: '塔主', text: '来吧！展示你真正的实力！' },
    ],
    battle: { name: '训练家之塔塔主', team: [[149,55], [131,55]] },
    battleType: 'story',
    onFinish: () => {
      G.storyFlags.seviiTowerDone = true
      addLog('★ 你征服了七之岛！真正的宝可梦大师的旅程才刚刚开始……')
      return '★ 登顶训练家之塔！完成了七之岛的全部挑战！你是真正的宝可梦大师！'
    },
  },

  // 红莲镇 — 道馆门前
  cinnabarGym: {
    location: 'cinnabar',
    condition: () => G.storyFlags.mansionDone && !G.storyFlags.cinnabarGymDone && G.player.badge < 7,
    dialogue: [
      { speaker: '', text: '你来到了红莲道馆的门前……' },
      { speaker: '道馆门卫', text: '红莲道馆的门被锁住了。' },
      { speaker: '道馆门卫', text: '听说在宝可梦屋里有一把秘密钥匙……' },
      { speaker: '', text: '你在背包里发现了秘密钥匙！' },
      { speaker: '道馆门卫', text: '哦！你有钥匙！请进吧！' },
    ],
    battle: null,
    onFinish: () => {
      G.storyFlags.cinnabarGymDone = true
      return '用秘密钥匙打开了红莲道馆的门！可以挑战馆主夏伯了！'
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
