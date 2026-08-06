/*
 * Remotion Studio — per-project Vite dev server for the hot-reload preview.
 *
 * Starts the skeleton Vite project (index.html hosting @remotion/player
 * against the project's composition workspace) and reports its port through
 * ${RECUT_APP_FILES_DIR}/serve/status.json so the Recut UI can iframe it. Vite
 * watches the workspace composition sources and hot-reloads the preview as the
 * AI edits code. Started as an indefinite ctx.shell.start job (timeoutSeconds: 0).
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
