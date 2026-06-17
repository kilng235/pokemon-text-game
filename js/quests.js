// 主线任务系统
// 每个任务: { id, name, desc, guidance, check() → bool }

const QUEST_ORDER = [
  'choose_starter', 'first_rival', 'go_viridian', 'get_package',
  'deliver_package', 'get_pokedex', 'go_pewter', 'beat_brock',
  'mt_moon', 'beat_misty', 'bill_house', 'ss_anne',
  'beat_surge', 'rock_tunnel', 'pokemon_tower', 'beat_erika',
  'rocket_hideout', 'silph_co', 'beat_sabrina', 'beat_koga',
  'safari_zone', 'beat_blaine', 'beat_giovanni',
  'final_rival', 'elite_four',
  // 七之岛篇章
  'sevii_arrival', 'sevii_rocket', 'sevii_ruins', 'sevii_tower',
]

const QUESTS = {
  choose_starter: {
    id: 'choose_starter', name: '选择搭档',
    desc: '在大木博士的研究所选择初始宝可梦',
    guidance: '前往大木博士的研究所，选择一只宝可梦作为搭档。',
    check: () => G.player.pokemon.length > 0,
  },
  first_rival: {
    id: 'first_rival', name: '击败小茂',
    desc: '战胜小茂，证明你的实力',
    guidance: '小茂向你发起了挑战！用你刚选的宝可梦应战吧。',
    check: () => G.storyFlags.firstRivalDone,
  },
  go_viridian: {
    id: 'go_viridian', name: '前往常青市',
    desc: '沿着1号道路前往常青市',
    guidance: '向北穿过1号道路，前往常青市。',
    check: () => G.player.position === 'viridian',
  },
  get_package: {
    id: 'get_package', name: '领取包裹',
    desc: '去友好商店领取大木博士的包裹',
    guidance: '去华蓝市的友好商店取一个包裹。',
    check: () => G.storyFlags.gotPackage,
  },
  deliver_package: {
    id: 'deliver_package', name: '交付包裹',
    desc: '把包裹送回大木博士的研究所',
    guidance: '把包裹带回真新镇的大木博士研究所。',
    check: () => G.player.badge >= 1 || G.storyFlags.deliveredPackage,
  },
  get_pokedex: {
    id: 'get_pokedex', name: '获得图鉴',
    desc: '从大木博士那里获得宝可梦图鉴',
    guidance: '大木博士给了你宝可梦图鉴！可以记录遇到的宝可梦了。',
    check: () => G.player.badge >= 1 || G.storyFlags.gotPokedex,
  },
  go_pewter: {
    id: 'go_pewter', name: '前往深灰市',
    desc: '穿过常青森林前往深灰市',
    guidance: '穿过2号道路和常青森林，前往深灰市。',
    check: () => G.player.position === 'pewter',
  },
  beat_brock: {
    id: 'beat_brock', name: '挑战深灰道馆',
    desc: '击败馆主小刚，获得灰色徽章',
    guidance: '深灰市有第一个道馆，挑战馆主小刚吧！',
    check: () => G.player.badge >= 1,
  },
  mt_moon: {
    id: 'mt_moon', name: '穿越月见山',
    desc: '穿越月见山，前往华蓝市',
    guidance: '穿越月见山，据说那里有珍贵的化石。',
    check: () => G.player.position === 'cerulean' || G.storyFlags.mtMoonDone,
  },
  beat_misty: {
    id: 'beat_misty', name: '挑战华蓝道馆',
    desc: '击败馆主小霞，获得蓝色徽章',
    guidance: '华蓝市的道馆是水属性，挑战馆主小霞。',
    check: () => G.player.badge >= 2,
  },
  bill_house: {
    id: 'bill_house', name: '海角小屋',
    desc: '帮助变成宝可梦的正辉',
    guidance: '沿着24号道路前往海角小屋，帮助变成宝可梦的正辉。',
    check: () => G.storyFlags.billDone,
  },
  ss_anne: {
    id: 'ss_anne', name: '圣安奴号',
    desc: '登上圣安奴号，打败船长',
    guidance: '拿着船票前往枯叶市的港口，登上圣安奴号。',
    check: () => G.storyFlags.ssAnneDone,
  },
  beat_surge: {
    id: 'beat_surge', name: '挑战枯叶道馆',
    desc: '击败馆主马志士，获得橙色徽章',
    guidance: '枯叶市的道馆是电属性，挑战馆主马志士。',
    check: () => G.player.badge >= 3,
  },
  rock_tunnel: {
    id: 'rock_tunnel', name: '穿越岩石隧道',
    desc: '穿越黑暗的岩石隧道',
    guidance: '穿越岩石隧道，前往紫苑镇。',
    check: () => G.player.position === 'lavender',
  },
  pokemon_tower: {
    id: 'pokemon_tower', name: '紫苑镇宝可梦塔',
    desc: '解决宝可梦塔的火箭队事件',
    guidance: '紫苑镇的宝可梦塔里有火箭队在捣乱。',
    check: () => G.storyFlags.lavenderDone,
  },
  beat_erika: {
    id: 'beat_erika', name: '挑战彩虹道馆',
    desc: '击败馆主莉佳，获得彩虹徽章',
    guidance: '彩虹市的道馆是草属性，挑战馆主莉佳。',
    check: () => G.player.badge >= 4,
  },
  rocket_hideout: {
    id: 'rocket_hideout', name: '火箭队秘密基地',
    desc: '摧毁彩虹市游戏厅下的火箭队基地',
    guidance: '彩虹市游戏厅后面有火箭队的秘密基地。',
    check: () => G.storyFlags.rocketHideoutDone,
  },
  silph_co: {
    id: 'silph_co', name: '希鲁夫公司',
    desc: '从火箭队手中夺回希鲁夫公司',
    guidance: '火箭队占领了金黄市的希鲁夫公司总部。',
    check: () => G.storyFlags.silphDone,
  },
  beat_sabrina: {
    id: 'beat_sabrina', name: '挑战金黄道馆',
    desc: '击败馆主娜姿，获得金黄徽章',
    guidance: '金黄市的道馆是超能属性，挑战馆主娜姿。',
    check: () => G.player.badge >= 5,
  },
  beat_koga: {
    id: 'beat_koga', name: '挑战浅红道馆',
    desc: '击败馆主阿桔，获得浅红徽章',
    guidance: '浅红市的道馆是毒属性，挑战馆主阿桔。',
    check: () => G.player.badge >= 6,
  },
  safari_zone: {
    id: 'safari_zone', name: '狩猎地带',
    desc: '前往浅红市的狩猎地带获得冲浪术',
    guidance: '前往浅红市的狩猎地带，可以获得秘传机。',
    check: () => G.storyFlags.safariDone,
  },
  beat_blaine: {
    id: 'beat_blaine', name: '挑战红莲道馆',
    desc: '击败馆主夏伯，获得深红徽章',
    guidance: '红莲镇的道馆是火属性，挑战馆主夏伯。',
    check: () => G.player.badge >= 7,
  },
  beat_giovanni: {
    id: 'beat_giovanni', name: '挑战常青道馆',
    desc: '击败常青道馆馆主坂木',
    guidance: '常青市的道馆终于开了，馆主竟然是坂木老大！',
    check: () => G.player.badge >= 8,
  },
  final_rival: {
    id: 'final_rival', name: '最终决战',
    desc: '在22号道路与小茂进行最后的对决',
    guidance: '在22号道路，小茂正在等你……这是最后的决战。',
    check: () => G.storyFlags.rivalRoute22_2,
  },
  elite_four: {
    id: 'elite_four', name: '挑战四天王',
    desc: '击败四天王和冠军，成为联盟冠军',
    guidance: '击败四天王和冠军小茂，成为宝可梦联盟冠军！',
    check: () => G.storyFlags.championDefeated,
  },
  // 七之岛篇章
  sevii_arrival: {
    id: 'sevii_arrival', name: '启程七之岛',
    desc: '前往脐眼岛，开启七之岛的冒险',
    guidance: '从枯叶市乘船前往七之岛，探索这片未知的群岛。',
    check: () => G.storyFlags.seviiArrivalDone,
  },
  sevii_rocket: {
    id: 'sevii_rocket', name: '火箭队残党',
    desc: '击败群兰岛火箭队仓库的残党',
    guidance: '前往群兰岛的火箭队仓库，彻底击败火箭队残党。',
    check: () => G.storyFlags.seviiRocketDone,
  },
  sevii_ruins: {
    id: 'sevii_ruins', name: '遗迹的秘密',
    desc: '探索战怪岛遗迹，揭开代欧奇希斯的谜团',
    guidance: '前往战怪岛的遗迹谷，寻找传说中的宝可梦。',
    check: () => G.storyFlags.seviiRuinsDone,
  },
  sevii_tower: {
    id: 'sevii_tower', name: '征服七之岛',
    desc: '登顶训练家之塔，完成七之岛的全部挑战',
    guidance: '前往绝壁岛的训练家之塔，证明你是最强的训练家！',
    check: () => G.storyFlags.seviiTowerDone,
  },
}

function initQuests() {
  if (!G.quests) {
    G.quests = { current: 'choose_starter', completed: [] }
  }
}

function getQuest(id) { return QUESTS[id] || null }

function getCurrentQuest() {
  initQuests()
  return G.quests.current ? getQuest(G.quests.current) : null
}

function getQuestProgress() {
  initQuests()
  return `${G.quests.completed.length + (G.quests.current ? 1 : 0)}/${QUEST_ORDER.length}`
}

function updateQuest() {
  initQuests()
  const curId = G.quests.current
  if (!curId) return
  const cur = QUESTS[curId]
  if (!cur) return
  if (cur.check()) {
    G.quests.completed.push(curId)
    const idx = QUEST_ORDER.indexOf(curId)
    if (idx >= 0 && idx + 1 < QUEST_ORDER.length) {
      G.quests.current = QUEST_ORDER[idx + 1]
      addLog(`📋 任务完成：${cur.name}`)
    } else {
      G.quests.current = null
      addLog(`🎉 全部冒险完成！你成为了真正的宝可梦大师！`)
    }
    saveGame()
  }
}
