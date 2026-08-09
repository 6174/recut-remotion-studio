/**
 * [INPUT]: 依赖 Vite、React、Tailwind 插件、项目 workspace 与其 node_modules 符号链接
 * [OUTPUT]: 对外提供以 ESM 执行的 Vite 预览配置（root、HMR、文件白名单与共享组件库解析）
 * [POS]: remotion-skeleton 的开发服务器配置；由 vite-server.js 的 config runner 加载
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// configLoader: "runner" 以 ESM 执行该文件，不能使用 CommonJS 的 __dirname。
const workspace = path.dirname(fileURLToPath(import.meta.url));
// The skeleton is a single Vite project. Its root is the project workspace:
// index.html hosts the @remotion/player page (src/player.tsx), which renders
// the composition from src/compositions/ProjectVideo.tsx — AI edits there
// hot-reload through Vite without touching the host page. props.json is served
// from workspace/preview (written by preview.props).
const nodeModulesReal = path.dirname(path.dirname(fs.realpathSync(path.join(workspace, "node_modules"))));

// @recut/remotion-kit 在 seed 时以拷贝模式放进 workspace/remotion-kit/（冻结副本）；
// 用别名把 bare import 指向本地副本，保证预览/渲染与项目冻结版本一致，
// 而不是 resolve 到 node_modules 里的 app 最新包（引用模式会随迭代漂移）。
// 设计系统在全局 recut-design-system skill，不随项目拷贝、不参与本工作区别名。
const kitAlias = (rel) => path.join(workspace, "remotion-kit", rel);

export default defineConfig({
  root: workspace,
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    hmr: { host: "127.0.0.1" },
    fs: {
      allow: [workspace, nodeModulesReal, path.join(workspace, "node_modules")],
    },
  },
  resolve: {
    alias: [
      { find: "@recut/remotion-kit/templates", replacement: kitAlias("src/components/remotion-templates") },
      { find: "@recut/remotion-kit/shotcraft", replacement: kitAlias("src/components/shotcraft") },
      { find: "@recut/remotion-kit/captions", replacement: kitAlias("src/captions/index.ts") },
      { find: "@recut/remotion-kit/effects", replacement: kitAlias("src/effects/index.ts") },
      { find: "@recut/remotion-kit", replacement: kitAlias("src/index.ts") },
    ],
  },
  publicDir: path.join(workspace, "preview"),
});
