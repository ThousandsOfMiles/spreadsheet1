# Spreadsheet 骨架（spreadsheet1）

把原项目 `src/spreadsheet` 砍到只剩**能启动的外壳**：能 `npm run dev`、能 `npm run build`，
屏幕上能看到一个空表格的样子，但没有任何表格功能。

- **没有**：单元格、公式、选区、编辑、撤销、文件读写、云存储、登录、协作、AI、图表、打印、透视表……
- **有**：Vite 启动链、入口挂载、设计令牌（亮/暗两套）、六条栏的布局外壳、一个主题切换。

原始项目是 HeyPuter 的 spreadsheet：`src/` 下 581 个文件，`core/` 329 个、
`ui/` 159 个，光 `ui/grid.js` 就 426KB。看不懂是正常的——所以先看这个 11 个源文件、
约 40KB 的骨架，再按本文最后的顺序，一块一块把功能长回去。

---

## 运行

```bash
cd ProjectConstruction/spreadsheet1
npm install      # 只装一个 vite
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
npm run preview  # 本地看 dist/
```

Node 20+（Vite 8 的要求）。装完依赖，除 `node_modules/` 外没有任何生成物。

> 交付时已在一份完全相同的副本上验证过（Vite 8.3.5）：`npm run build` 通过
> （9 modules → `dist/` 里 2.2KB html + 6.9KB css + 4.4KB js），
> `npm run dev` 正常返回页面和全部模块，并在 jsdom 里跑过一遍外壳结构 + 主题切换的断言。
> 本目录里没有 `node_modules/`，所以第一次跑之前先 `npm install`。

---

## 目录

```
spreadsheet1/
├── index.html            挂载点 #app + 启动画面（写在 <head> 里，样式表没到也能显示）
├── vite.config.js        base:'./'、target es2022、端口 5173
├── public/favicon.svg    图标
├── README.md             本文件
└── src/
    ├── main.js           入口：引样式 → 建外壳 → 挂到 #app（全文件 20 行）
    ├── shell.js          外壳装配：六条横带 + 中间的空网格 + 说明卡片
    ├── ui/
    │   ├── dom.js         el() 极简 DOM 构造器（原项目同名函数）
    │   └── theme.js       主题三态：系统 / 亮 / 暗，落在 <html data-theme>
    └── styles/
        ├── index.css      样式入口，只 3 行 @import
        ├── tokens.css     设计变量：颜色、圆角、字体、各栏高度
        ├── base.css       重置 + 全局默认 + .app 一屏布局
        └── shell.css      外壳布局 + 用 CSS 背景画出来的空网格
```

三个空目录（`core/`、`lib/`、`views/`）里各只有一个说明文件，讲清楚“这个目录将来放什么”。
它们不是代码，是路标。

---

## 一次请求怎么变成屏幕上的界面

```
浏览器 → index.html
           ├─ <script> 内联：先读 localStorage 套用主题（防闪白）
           ├─ <style> 内联：启动画面，样式表还没加载就能看到东西
           └─ <script type="module" src="/src/main.js">
main.js
  ├─ import './styles/index.css'   → index.css 里 @import tokens → base → shell
  └─ import { mountShell } from './shell.js'
       └─ mountShell() 返回 <div class="shell">…</div>
app.replaceChildren(shell)         ← 启动画面被整块换掉，界面出现
```

就这三步。原项目的 `main.js` 有 510 行，多出来的全是“功能”（hash 路由、Puter 登录、
拖放打开文件、离线提示、协作房间、启动画面生命周期），骨架一行都不留。

---

## 外壳的六条横带

```
┌─────────────────────────────────────────────────────┐
│ topbar    标志 · Spreadsheet · 骨架      [系统|亮|暗] │ 48px
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┤
│ ┄┄ 功能区 Ribbon ┄┄（src/ui/ribbon.js）              │ 44px
├─────────────────────────────────────────────────────┤
│ [A1] fx  名称框 / 公式栏（src/ui/formulabar.js）      │ 40px
├─────────────────────────────────────────────────────┤
│ ┌─列头─────────────────────────────────────────────┐ │
│ │┌──┬──────┬──────┬──────┬──────┬──────┬──────┬───┐│ │
│ ││  │      │      │      │      │      │      │   ││ │
│ ││  │        空表格外壳（只有网格背景）            ││ │ 剩余高度
│ ││  │        能启动 · 有布局 · 有主题              ││ │ flex:1
│ ││  │        表格/公式/文件读写都还没写            ││ │
│ │└──┴──────┴──────┴──────┴──────┴──────┴──────┴───┘│ │
│ └──────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ [Sheet1] 工作表标签栏（src/ui/sheettabs.js）          │ 40px
├─────────────────────────────────────────────────────┤
│ 就绪 · 骨架版本       区域 A1 │ 100%                 │ 28px
└─────────────────────────────────────────────────────┘
```

| 横带 | 高度变量 | 骨架里的位置 | 原项目里对应的文件 |
|---|---|---|---|
| 顶栏 | `--topbar-h` | `shell.js: topbar()` | `ui/menubar.js`（37KB） |
| 功能区 | `--toolbar-h` | `shell.js: ribbon()` | `ui/ribbon.js`（64KB） |
| 公式栏 | `--formulabar-h` | `shell.js: formulaBar()` | `ui/formulabar.js`（17KB） |
| 表格区 | flex: 1 | `shell.js: sheet()` | `ui/grid.js`（**426KB**） |
| 标签栏 | `--tabs-h` | `shell.js: sheetTabs()` | `ui/sheettabs.js`（26KB） |
| 状态栏 | `--statusbar-h` | `shell.js: statusBar()` | `ui/statusbar.js`（26KB） |

中间那块“网格”是 `shell.css` 里两条 `repeating-linear-gradient` 画出来的，
DOM 里一个单元格都没有——真正的网格要等 `ui/grid.js`。

---

## 被砍掉了什么（原项目体量对照）

| 原项目目录 | 文件数 | 最大的几个 | 骨架里 |
|---|---|---|---|
| `core/` | 329 | `workbook.js` 843KB、`io.js` 188KB、`numfmt.js` 100KB | 空，只有 README |
| `ui/` | 159 | `grid.js` 426KB、`chartsvg.js` 186KB、`print.js` 103KB | 压成 `shell.js` |
| `styles/` | 29 | `components.css` 63KB、`chrome.css` 49KB、`grid.css` 40KB | 3 个文件 |
| `collab/` | 13 | `replica.js` 59KB | 无 |
| `lib/` | 19 | `doc.js` 79KB、`puter.js` 37KB | 空，只有 README |
| `vendor/` | 17 | `xlsx.mjs` 1.1MB、`pivot-style-presets.js` 238KB | 无（不 vendored 任何库） |
| `views/` | 3 | `editor.js` 442KB、`home.js` 38KB | 空，只有 README |
| `workers/` | 1 | `email-worker.js` 24KB | 无 |

另外这些**运行时依赖**也一起砍了，所以骨架不联网也能跑：
`https://js.puter.com/v2/`（云存储 SDK）、Plausible 统计、
`../../dev/puter-localhost.mjs`（Vite 插件，在原项目里负责把本地开发域名伪装成 Puter 的域名）、
构建协作 worker 的第二步。

---

## 从骨架到功能：建议顺序

想自己把功能长回来，就照这个顺序，每一步都能跑起来看到东西：

1. **`src/core/workbook.js`** —— 单元格模型：A1 坐标 ↔ (行, 列)，一格里存值、
   字符串、错误，加一个 `dirty` 脏标记。这一步没有界面，写点 console 断言就够。
2. **`src/core/refs.js`** —— 引用解析：`A1`、`$B$2`、`A1:C3`、`Sheet2!A1` 切成结构化对象。
3. **`src/ui/grid.js`** —— 把模型画成 DOM：先老老实实渲染 26 列 × 100 行；
   卡了再学原项目上虚拟化（只渲染视口内的格子）。
4. **选区 + 编辑** —— 方向键移动、双击进编辑、回车写回模型。到这一步它才“像个表格”。
5. **`src/core/formula/`** —— tokenizer → parser → evaluator，先支持 `=1+2`、`=A1+B1`，
   再加函数库。原项目在这里有 10 个文件。
6. **`src/core/io.js`** —— `.xlsx` 读写（原项目动态 `import('vendor/xlsx.mjs')`，约 1MB 只在真正读写时才加载）。
7. **`src/lib/`** —— 存到哪儿：原项目存在 Puter 云盘，也可以换成本地 `localStorage` 或你自己的后端。

每一步都在现有外壳里加一个文件，而不是把外壳推翻重写——这就是骨架的意义。

---

## 从原项目抄了什么、故意没抄什么

抄了（保持一致，方便对照）：
- 目录分层 `core/ ui/ lib/ views/ styles/` 和“逻辑不碰 DOM”的分工
- `tokens.css` 的变量名与取值（`--surface`、`--ink-3`、`--hairline`、`--grid`、`--accent`…）
- CSS 的组织方式：`index.css` 只做 `@import`，一个关注点一个文件
- `ui/dom.js` 里的 `el()`、`ui/theme.js` 的三态主题、`<html data-theme>` 的约定
- `vite.config.js` 的 `base: './'`、`target: 'es2022'`、端口 5173

故意没抄：路由、SDK 登录、Service Worker、无构建依赖的第三方 CDN 脚本、任何业务逻辑。

---

## 一句话

原项目 = 这个骨架 + 578 个文件的细节。
先看懂这 11 个源文件，再决定要不要那个 843KB 的 `workbook.js`。
