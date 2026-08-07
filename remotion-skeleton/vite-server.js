/**
 * [INPUT]: 依赖 Vite、项目 workspace 与 RECUT_APP_FILES_DIR 注入的状态目录
 * [OUTPUT]: 启动支持 ESM 配置的 Vite dev server，并将 starting/ready/failed 状态写入 serve/status.json
 * [POS]: remotion-skeleton 的预览进程入口；由 Makefile start 调用，供 Studio UI 安全嵌入热更新预览
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
const fs = require("fs");
const path = require("path");
const net = require("net");
const { createServer } = require("vite");

const filesRoot = process.env.RECUT_APP_FILES_DIR;
if (!filesRoot) {
  console.error("vite-server: RECUT_APP_FILES_DIR is not set");
  process.exit(1);
}
const root = __dirname;
const statusDir = path.join(filesRoot, "serve");
const statusFile = path.join(statusDir, "status.json");

function writeStatus(payload) {
  try {
    fs.mkdirSync(statusDir, { recursive: true });
    fs.writeFileSync(statusFile, JSON.stringify({ ...payload, pid: process.pid, at: new Date().toISOString() }));
  } catch (_) { /* status is best-effort */ }
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

(async () => {
  const port = await freePort();
  writeStatus({ phase: "starting", port });
  console.log(`vite-server: starting preview dev server on 127.0.0.1:${port}`);

  const server = await createServer({
    root,
    configFile: path.join(root, "vite.config.ts"),
    // Tailwind Vite 插件为 ESM；避免把 TS 配置打包成 CommonJS 后 require 失败。
    configLoader: "runner",
    logLevel: "info",
    server: {
      host: "127.0.0.1",
      port,
      strictPort: true,
    },
  });
  await server.listen();

  const actualPort = server.config.server.port || port;
  writeStatus({ phase: "ready", port: actualPort, error: null });
  console.log(`vite-server: ready at http://127.0.0.1:${actualPort}/`);

  const shutdown = async (signal) => {
    console.log(`vite-server: received ${signal}, closing`);
    writeStatus({ phase: "stopped", port: actualPort });
    await server.close();
    process.exit(0);
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
})().catch((error) => {
  console.error("vite-server: failed");
  console.error(String(error && error.stack ? error.stack : error));
  writeStatus({ phase: "failed", port: null, error: String(error && error.message ? error.message : error) });
  process.exit(1);
});
