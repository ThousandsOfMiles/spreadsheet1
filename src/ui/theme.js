/**
 * 主题：三态（跟随系统 / 亮 / 暗），落在 <html data-theme="…"> 上。
 *
 * 为什么这么简单的东西也要单独一个文件？
 * 因为配色全部来自 CSS 变量（src/styles/tokens.css），只要给 <html> 换一个
 * data-theme，整页颜色就跟着换，不需要任何组件知道自己是什么主题。
 *
 * 对照原项目：src/ui/theme.js 几乎一模一样，只是那边还顺带存了“区域格式”偏好。
 */
const LS_KEY = 'spreadsheet1:theme';
const LIGHT_THEME_COLOR = '#356d49';
const DARK_THEME_COLOR = '#28593a';

/** 'system' | 'light' | 'dark' */
export function currentTheme() {
  const stamped = document.documentElement.dataset.theme;
  return stamped === 'light' || stamped === 'dark' ? stamped : 'system';
}

/** 当前是不是暗色（system 时看系统偏好）。 */
export function isDark() {
  const mode = currentTheme();
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'light' || mode === 'dark') root.dataset.theme = mode;
  else delete root.dataset.theme; // 跟随系统：去掉标记，交给 CSS 的 prefers-color-scheme

  try {
    if (mode === 'light' || mode === 'dark') localStorage.setItem(LS_KEY, mode);
    else localStorage.removeItem(LS_KEY);
  } catch {
    // 隐私模式下 localStorage 可能不可用：主题这一次照样生效，只是记不住
  }

  syncThemeColor();
}

/** 让浏览器/系统状态栏的颜色也跟着变（index.html 里两个 meta 的默认值）。 */
function syncThemeColor() {
  const dark = isDark();
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute('content', dark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  }
}

// 系统在亮/暗之间切换时，如果用户选的是“跟随系统”，状态栏颜色要跟着改
if (typeof matchMedia === 'function') {
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColor);
}

syncThemeColor();
