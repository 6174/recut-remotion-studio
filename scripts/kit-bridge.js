/*
 * Remotion Studio — kit bridge: serve @recut/remotion-kit catalog to the background.
 *
 * ctx.files 只能访问项目 files 目录；app 包（含 packages/remotion-kit）只能由
 * shell 在默认 cwd（= app.Root）下访问。后台用 `node scripts/kit-bridge.js catalog`
 * 读取组件目录（附 kit 版本号），stdout 输出 JSON。Agent 读组件最新源码请直接用
 * 原生文件工具读 ~/.recut/apps/remotion-studio/packages/remotion-kit/src/...。
 */
const fs = require("fs");
const path = require("path");

const kit = path.join(__dirname, "..", "packages", "remotion-kit");
const cmd = process.argv[2];

function read(rel) {
  return fs.readFileSync(path.join(kit, rel), "utf8");
}

function print(value) {
  process.stdout.write(JSON.stringify(value));
}

if (cmd === "catalog") {
  try {
    const catalog = JSON.parse(read("catalog.json"));
    let version = "0.0.0";
    try {
      version = JSON.parse(read("manifest.json")).version || version;
    } catch (_) { /* 版本缺失时退化 */ }
    print({ ...catalog, kitVersion: version });
  } catch (_) {
    print({});
  }
} else {
  print({ error: "unknown command" });
  process.exit(1);
}
