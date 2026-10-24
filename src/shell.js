/**
 * 应用外壳：把界面拆成几个空盒子，从上到下拼起来。
 *
 *   ┌──────────────────────────────────────┐
 *   │ topbar     标志 · 标题 · 主题切换      │
 *   ├──────────────────────────────────────┤
 *   │ ribbon     功能区（占位）              │
 *   ├──────────────────────────────────────┤
 *   │ formula    名称框 / 公式栏（占位）      │
 *   ├──────────────────────────────────────┤
 *   │ sheet      表格区（占位：CSS 画的网格） │
 *   ├──────────────────────────────────────┤
 *   │ tabs       工作表标签栏（占位）         │
 *   ├──────────────────────────────────────┤
 *   │ status     状态栏（占位）              │
 *   └──────────────────────────────────────┘
 *
 * 这里只有 DOM 结构，没有事件、没有数据、没有状态。
 * 每一块盒子右上角都标了“将来由哪个文件接管”，对照原项目看会很直观。
 *
 * 对照原项目：
 *   topbar   -> src/ui/menubar.js + src/ui/ribbon.js
 *   ribbon   -> src/ui/ribbon.js（64KB，所有按钮都在这儿）
 *   formula  -> src/ui/formulabar.js
 *   sheet    -> src/ui/grid.js（426KB，虚拟化网格）
 *   tabs     -> src/ui/sheettabs.js
 *   status   -> src/ui/statusbar.js
 * 骨架把这六个文件压成了这个文件里的六个函数。
 */
import { el } from './ui/dom.js';
import { applyTheme, currentTheme } from './ui/theme.js';

/** 表格图标（内联 SVG，省一次网络请求；原项目的图标来自 src/ui/icons.js）。 */
const ICON_TABLE = `
<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3" y="3" width="18" height="18" rx="2"/>
  <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
</svg>`;

/* ---------- 顶栏 ---------- */

function topbar() {
  return el('header.topbar', {},
    el('div.brand', {},
      el('span.brand-mark', { html: ICON_TABLE }),
      el('span', {}, 'Spreadsheet'),
      el('span.brand-sub', {}, '骨架')),
    el('span.topbar-spacer'),
    themeControl());
}

/**
 * 主题三态：跟随系统 / 亮 / 暗。
 * 状态只存在 localStorage（见 src/ui/theme.js），所以刷新页面也记得住。
 * 这不是“功能”，是每个界面都该有的基础能力，也是 CSS 变量体系的最小验证。
 */
function themeControl() {
  const modes = [['system', '系统'], ['light', '亮'], ['dark', '暗']];
  const buttons = modes.map(([mode, label]) => el('button.seg-btn', {
    type: 'button',
    'aria-pressed': String(currentTheme() === mode),
    dataset: { mode },
    onclick: () => {
      applyTheme(mode);
      for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    },
  }, label));

  return el('div.seg', { role: 'group', 'aria-label': '主题' }, ...buttons);
}

/* ---------- 占位带 ---------- */

/** 一条横向的带子：虚线框 + 说明文字，表示“这里将来放什么”。 */
function band(className, ...children) {
  return el(`div.band.${className}`, {}, el('span.ph-frame'), ...children);
}

/** 说明文字，路径用等宽字体标出来，一眼知道去哪儿改。 */
function note(text, file) {
  return el('span.ph-note', {}, text, ' · 占位（', el('code', {}, file), '）');
}

function ribbon() {
  return band('band-ribbon', note('功能区 Ribbon', 'src/ui/ribbon.js'));
}

function formulaBar() {
  return band('band-formula',
    el('span.fx-name', {}, 'A1'),
    el('span.fx-mark', {}, 'fx'),
    note('名称框 / 公式栏', 'src/ui/formulabar.js'));
}

function sheetTabs() {
  return band('band-tabs',
    el('span.tab-pill', {}, 'Sheet1'),
    note('工作表标签栏', 'src/ui/sheettabs.js'));
}

function statusBar() {
  return band('band-status',
    el('span', {}, '就绪 · 骨架版本 · 没有任何表格功能'),
    el('span.status-right', {},
      el('span', {}, '区域 A1'),
      el('span.status-sep'),
      el('span', {}, '100%')));
}

/* ---------- 表格区 ---------- */

/**
 * 表格区：一块 CSS 画出来的空网格（不是真单元格，DOM 里一个格子都没有）。
 * 中间那张卡片是路标，告诉读代码的人下一步该补什么。
 */
function sheet() {
  return el('main.sheet', {},
    el('article.sheet-card', {},
      el('span.eyebrow', {}, '骨架 · 无功能'),
      el('h1', {}, '空表格外壳'),
      el('p', {},
        '能启动、有布局、有主题——表格、公式、文件读写都还没有写。'),
      el('ol.steps', {},
        el('li', {}, el('code', {}, 'core/workbook.js'), '：单元格模型（值、格式、撤销）'),
        el('li', {}, el('code', {}, 'ui/grid.js'), '：把模型画到屏幕上，处理选中与输入'),
        el('li', {}, el('code', {}, 'ui/formulabar.js'), '：编辑公式，回车写回模型'),
        el('li', {}, el('code', {}, 'core/io.js'), '：读写 .xlsx / .csv')),
      el('p.hint', {
        html: '布局在 <code>src/shell.js</code> · 配色在 <code>src/styles/tokens.css</code> · 结构说明见 <code>README.md</code>',
      })));
}

/* ---------- 组装 ---------- */

export function mountShell() {
  return el('div.shell', {},
    topbar(),
    ribbon(),
    formulaBar(),
    sheet(),
    sheetTabs(),
    statusBar());
}
