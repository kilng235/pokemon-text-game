# 我用 TraeWork 一天内完成一个随时随地都能玩的宝可梦网页游戏

## 一、我是谁，我卡在哪

- **个人背景**：业余独立游戏开发者，平时下班和周末做点小游戏项目。一直想做一款「不依赖任何后端、不依赖打包、双击 HTML 就能玩」的宝可梦文字 RPG，方便自己在公司午休、通勤地铁、家里 Windows 旧笔记本、图书馆公用机之间无缝切换进度。
- **当前痛点**：
  - 想玩的玩家需要「打开浏览器 → 立刻玩到 → 关掉浏览器 → 下次接着玩」。这就要求：(1) 不能有 node_modules / 构建步骤；(2) 存档不能丢；(3) 精灵图要现成的，不能自己画。
  - 想要的玩法不能缩水：8 个道馆 + 四天王 + 冠军，386 只宝可梦、400+ 招式、25 个主线任务都得在浏览器里跑出来。
  - 我一个人既要写策划、写代码、写文档、发论坛，三件事都要在一天内完成，凭人脑根本排不开。

## 二、我用 TraeWork 怎么解决的

模式：☐ Work ☑ Code ☐ Design

具体实践步骤：

- **第一步：让 Code 模式搭起「零依赖」的骨架**。
  把指令丢给 TraeWork：「用纯 HTML/CSS/JS 做一个宝可梦文字 RPG，要求打开 index.html 就能玩，不依赖任何后端」。它直接产出 `index.html`（只有 39 行，10 个 `<script>` 标签按顺序加载模块）+ `style.css` + 10 个 JS 模块文件，从一开始就把"能跑起来"当作硬性约束。精灵图采用 PokeAPI 官方仓库远程加载 PNG/GIF + 闪光 fallback，零自绘资源。
- **第二步：在 Code 模式里把游戏机制补齐**。
  接着让 TraeWork 继续补完 5,800+ 行 JS：
  - `data.js`：386 只宝可梦 / 400+ 招式 / 8 位馆主 / 4 天王 / 18 系属性克制表 / 25 种性格 / 25 种特性 / 性别比例；
  - `state.js`：用 `localStorage` 存进度（存档键 `pokemon_text_save_v3`），支持旧存档迁移，关闭页面前强制落盘；
  - `battle.js`：动态等级缩放（玩家最高级向区域偏置 0.4、上封顶 `playerMax+3`），8% 精英野生、1.5× 经验；
  - `quests.js`：25 个主线任务串起红蓝版全程；
  - `audio.js`：纯函数合成 BGM，无外部音频文件。
  全程没有任何 `node_modules`，没有 Webpack/Vite，纯文本编辑器即可维护。
- **第三步：用 Work + Code 模式补文档、跑交付**。
  TraeWork 把项目文档产成 4 份：`README.md`（对外介绍 + 操作说明）、`UPDATE_PLAN.md`（25 任务 / 动态等级 / 主线剧情优先级）、`PERFORMANCE_OPTIMIZATION.md`（Map 查找 + LRU 类型效果缓存）、`P0_BUG_FIXES.md`（BGM 循环 / EV 上限 / 战斗计时器泄漏）。最后帮我 `git add` → `chore: ignore .qoder/ directory` → `git commit` → `git push origin main`，整套流程一次跑通（`abd4444..c1d94a5 main -> main`）。

## 三、提效前后对比

| 环节 | 以前（人工手写 / 互相切换） | 现在（TraeWork 接管） |
|---|---|---|
| 项目骨架（HTML + 模块拆分） | 半天搭架构、写模块顺序 | 一句话直达，10 文件一次成型 |
| 宝可梦 / 招式 / 道馆数据 | 一周手动填 + 自己画精灵 | 秒级灌入数据，精灵直接走 PokeAPI |
| 存档与跨设备进度 | 自己写迁移脚本、写防抖 | 内置 localStorage + 版本迁移，关浏览器自动落盘 |
| 文档 + Git 提交流程 | 半天写 md + 手动敲命令 | Code 模式一键 `status → diff → commit → push` |
| 「从零想法到能玩到」的端到端时间 | 一周到两周 | **一天内完成** |

## 四、成果展示

- 产物 1（玩家视角）：[宝可梦文字版主入口](computer://e:\1\Juno\pokemon-text-game\index.html) —— 双击或拖进浏览器即可游玩，无登录、无安装；存档存在 `localStorage`，下次打开自动续关。
- 产物 2（开发者视角）：[项目 README](computer://e:\1\Juno\pokemon-text-game\README.md) —— 一份对外说明 + 玩法表 + 项目结构图，覆盖「关都地图 → 8 徽章 → 四天王 → 七之岛」完整流程。
- 产物 3（工程视角）：仓库内 10 个 JS 模块（`data.js` 1245 行、`battle.js` 870 行、`ui.js` 855 行 …），加 4 份配套文档（`UPDATE_PLAN.md` / `PERFORMANCE_OPTIMIZATION.md` / `P0_BUG_FIXES.md` / `pokemon-dex.md`），GitHub `main` 分支最新一次提交 `c1d94a5`。

## 五、实践经验总结

1. **"能玩到"是 1，其余全是 0"**。所有花里胡哨的功能（赛季、排行榜、AI 加成）都可以砍，但"用户双击一个文件就能玩 + 关掉再开还在原来的关卡"这两个体验不能砍。把"零依赖 + localStorage"当硬指标写到第一句 prompt，TraeWork 会主动把架构往这个方向收。
2. **远程资源能外包就外包**。精灵图如果自己画是 386 张 PNG；如果全部手绘工作日根本填不完。让 TraeWork 直接挂上 PokeAPI 官方仓库的 animated GIF + PNG fallback，再加一个 `onerror` 切到静态 PNG，就能在白天任何能联网的环境里玩到。
3. **文档和提交是同一条流水线**。我以前写完代码就卡在"写什么样的 README"上，结果拖了一周都没发版。现在让 TraeWork 把"README / UPDATE_PLAN / 优化记录 / Bug 修复记录"当成 4 件必交产物一次性跑出来，最后再统一 `commit + push`，几乎没有"开发完但没发版"的真空期。

## 六、分享你的实操对话（必填）

- **对话 1：搭骨架**（链接占位，建议附对话截图）
  - 改动说明：第一轮只输入一句「用纯 HTML/CSS/JS 做一个宝可梦文字 RPG，不依赖任何后端」，让 TraeWork 自己决定模块切分；后续追加「精灵图走 PokeAPI 远程 + 闪光版本」，收敛实现细节。
- **对话 2：灌数据 + 性能优化**（链接占位）
  - 改动说明：要求把 386 只宝可梦、400+ 招式、25 种任务一次性导入，并补上 Map 查找 + LRU 类型效果缓存两项优化，让其在浏览器里也不卡。
- **对话 3：出文档 + 提推送**（链接占位）
  - 改动说明：要求 TraeWork 同时产出 `README` / `UPDATE_PLAN` / `P0_BUG_FIXES` / `PERFORMANCE_OPTIMIZATION` 这 4 份文档，再执行 `git commit` + `git push`。中间踩到 PowerShell 不支持 `&&` 的坑，第二轮追加「用 `;` 分隔、提交信息 ASCII」绕过。
