import './styles/index.css';
import { mountShell } from './shell.js';

/**
 * 入口文件：整个应用只有三件事要在这里做。
 *
 *   1. 引入样式（CSS 的装载链在 src/styles/index.css 里）
 *   2. 把外壳挂到 index.html 里的 #app
 *   3. 收工
 *
 * 原项目（src/spreadsheet/src/main.js）在同样这个位置还做了：hash 路由、
 * Puter 登录、文件拖放、离线提示、协作房间……那些都是“功能”，骨架里一行没有。
 * 想知道功能是怎么长出来的，看 README.md 的“从骨架到功能”一节。
 */

const app = document.getElementById('app');

// replaceChildren 会顺手把 index.html 里的启动画面（.boot-splash）换掉：
// 这就是“启动画面 -> 真正界面”的交接点。
app.replaceChildren(mountShell());
