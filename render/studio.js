/*
 * Remotion Studio — long-running preview server for one project workspace.
 *
 * Starts `remotion studio` on the project's composition entry point
 * (${RECUT_APP_FILES_DIR}/workspace/index.ts) and reports its port through
 * ${RECUT_APP_FILES_DIR}/studio/status.json so the Recut UI can iframe it.
 *
 * Started as an indefinite ctx.shell.start job (timeoutSeconds: 0).
 */
const fs = require("fs");
const path = require("path");
const net = require("net");
const { spawn } = require("child_process");

const filesRoot = process.env.RECUT_APP_FILES_DIR;
if (!filesRoot) {
  console.error("studio: RECUT_APP_FILES_DIR is not set");
  process.exit(1);
}
const workspace = path.join(filesRoot, "workspace");
const entryPoint = path.join(workspace, "index.ts");
const statusDir = path.join(filesRoot, "studio");
const statusFile = path.join(statusDir, "status.json");

if (!fs.existsSync(entryPoint)) {
  writeStatus({ phase: "failed", port: null, error: `workspace entry missing: ${entryPoint}（请先调用 workspace.ensure）` });
  console.error(`studio: entry missing ${entryPoint}`);
  process.exit(1);
}

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

function waitForPort(port, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect({ host: "127.0.0.1", port });
      socket.setTimeout(1000);
      socket.once("connect", () => { socket.destroy(); resolve(); });
      socket.once("timeout", () => { socket.destroy(); retry(); });
      socket.once("error", () => { socket.destroy(); retry(); });
    };
    const retry = () => {
      if (Date.now() > deadline) return reject(new Error(`Studio did not start within ${timeoutMs / 1000}s`));
      setTimeout(attempt, 300);
    };
    attempt();
  });
}

(async () => {
  const port = await freePort();
  writeStatus({ phase: "starting", port });
  console.log(`studio: starting Remotion Studio on 127.0.0.1:${port}`);
  console.log(`studio: entry ${entryPoint}`);

  const cli = path.join(__dirname, "node_modules", "@remotion", "cli", "remotion-cli.js");
  const child = spawn(
    process.execPath,
    [cli, "studio", entryPoint, "--port", String(port), "--no-open", "--disable-ask-ai", "--disable-keyboard-shortcuts", "--ipv4"],
    { cwd: workspace, stdio: ["ignore", "pipe", "pipe"] },
  );

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));
  child.on("error", (error) => {
    writeStatus({ phase: "failed", port, error: String(error && error.message ? error.message : error) });
    process.exit(1);
  });
  child.on("exit", (code, signal) => {
    writeStatus({ phase: "stopped", port, error: `studio process exited (code=${code}, signal=${signal})` });
    process.exit(code || 0);
  });

  try {
    await waitForPort(port);
    writeStatus({ phase: "ready", port, error: null });
    console.log(`studio: ready at http://127.0.0.1:${port}`);
  } catch (error) {
    writeStatus({ phase: "failed", port, error: String(error && error.message ? error.message : error) });
    child.kill("SIGTERM");
    process.exit(1);
  }
})();
