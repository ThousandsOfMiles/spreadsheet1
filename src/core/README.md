# core/ —— 纯逻辑，不碰 DOM

原项目这里放了 329 个文件，全部是“没有界面也能跑”的东西：

- `workbook.js`  文档模型：工作表、单元格、惰性求值、撤销、合并、名称、筛选、规则…
- `cell.js`      A1 坐标 ↔ (行, 列)
- `refs.js`      引用解析与重写（复制、插入、删除、改名时公式怎么跟着变）
- `formula/`     词法 → 语法 → 求值 → 函数库
- `format.js` / `numfmt.js`  数字格式与自定义格式码
- `io.js`        `.xlsx` / `.csv` 读写（通过动态 import 的 SheetJS）
- `selection.js` 选区与键盘导航规则
- `clipboard.js` 剪贴板的 HTML 表格

骨架里是空的。写新逻辑时遵守一条：**这个目录不 import 任何 `ui/` 下的东西**，
这样它以后能在 Node 里被测试（原项目的 `tests/` 就是这么测的）。
