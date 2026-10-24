/**
 * 极简 DOM 构造器，从原项目 src/ui/dom.js 里只摘了 el() 和 append()。
 *
 *   el('button.btn.btn-primary', { type: 'button', onclick: fn }, '保存')
 *
 * spec 用 `标签.类名.类名` 的写法；attrs 里 onclick 之类的 on* 走 addEventListener，
 * style 传对象，dataset 传对象，剩下的按属性/属性值设置。
 * 原文件还有 debounce、formatBytes、relativeTime 等工具函数，那是给功能用的，骨架不需要。
 */
export function el(spec, attrs = {}, ...children) {
  const [tag, ...classes] = spec.split('.');
  const node = document.createElement(tag || 'div');
  if (classes.length) node.className = classes.join(' ');

  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined) continue;
    // false 表示“这个属性不要”，跳过即可（条件属性常用 `title: cond && '…'`）。
    if (value === false && typeof node[key] !== 'boolean') continue;

    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2), value);
    } else if (key === 'html') {
      node.innerHTML = value;
    } else if (key === 'dataset') {
      Object.assign(node.dataset, value);
    } else if (key === 'style' && typeof value === 'object') {
      for (const [prop, val] of Object.entries(value)) {
        if (prop.startsWith('--')) node.style.setProperty(prop, val);
        else node.style[prop] = val;
      }
    } else if (key in node) {
      node[key] = value;
    } else {
      node.setAttribute(key, value === true ? '' : value);
    }
  }

  append(node, children);
  return node;
}

/** 子节点按顺序追加；`cond && el(...)` 里的 false / null / undefined 自动丢掉。 */
export function append(node, children) {
  for (const child of children.flat(Infinity)) {
    if (!child) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}
