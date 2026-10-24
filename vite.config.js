import { defineConfig } from 'vite';

/**
 * 和原项目（src/spreadsheet/vite.config.js）保持同一套约定，但去掉了一切依赖：
 * - base: './'      打包后可以放在任意子路径下（分布式部署到 Puter 的 CDN 就靠它）
 * - target es2022   可以用顶层 await、可选链等语法，不用为老浏览器降级
 * - port 5173       原项目的固定端口，两个项目同时跑时 Vite 会自动换成 5174
 *
 * 原项目这里还挂了 ../../dev/puter-localhost.mjs 插件（本地模拟 Puter 域名）。
 * 骨架不需要云服务，所以没有引入任何 Vite 插件——装完依赖就能跑。
 */
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    cssTarget: 'safari15',
  },
  server: {
    port: 5173,
  },
});
