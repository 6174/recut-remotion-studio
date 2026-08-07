/*
 * Remotion Studio — seed the per-project composition workspace.
 *
 * Copies the App skeleton (remotion-skeleton/) into ${RECUT_APP_FILES_DIR}/workspace
 * on first use (excluding node_modules / package-lock.json / browser cache),
 * links workspace/node_modules to the App skeleton's dependency store so the
 * preview dev server and render.js resolve `remotion`/`react`/`vite`, and writes
 * the .recut-workspace marker. Never overwrites an existing workspace so AI
 * edits are preserved.
 */
const fs = require("fs");
const path = require("path");

const filesRoot = process.env.RECUT_APP_FILES_DIR;
if (!filesRoot) {
  console.error("seed: RECUT_APP_FILES_DIR is not set");
  process.exit(1);
}
const workspace = path.join(filesRoot, "workspace");
const markerPath = path.join(workspace, ".recut-workspace");
const skeleton = path.join(__dirname, "remotion-skeleton");
// 共享组件库 @recut/remotion-kit：seed 时「整包拷贝」进 workspace/remotion-kit/（冻结副本）。
// workspace 的 vite/render 用别名把 `@recut/remotion-kit` 指向该副本；组件规范源仍只在
// packages/remotion-kit，app 迭代不影响历史项目（kitVersion 记录在 .recut-workspace）。
const kitSrc = path.join(__dirname, "packages", "remotion-kit");
const manifestPath = path.join(kitSrc, "manifest.json");
const skip = new Set(["node_modules", ".remotion", "package-lock.json", ".git"]);

function copyTree(source, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(source)) {
    if (skip.has(entry)) continue;
    const srcPath = path.join(source, entry);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyTree(srcPath, path.join(dest, entry));
    } else {
      fs.copyFileSync(srcPath, path.join(dest, entry));
    }
  }
}

function kitVersion() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8")).version || "0.0.0";
  } catch (_) {
    return "0.0.0";
  }
}

if (!fs.existsSync(workspace)) {
  copyTree(skeleton, workspace);
  // 整包拷贝 kit → workspace/remotion-kit，保证新项目即当前目录版本。
  copyTree(kitSrc, path.join(workspace, "remotion-kit"));
  console.log(`seed: seeded workspace from ${skeleton} + remotion-kit v${kitVersion()}`);
}

const nodeModulesLink = path.join(workspace, "node_modules");
if (!fs.existsSync(nodeModulesLink)) {
  try {
    fs.symlinkSync(path.join(skeleton, "node_modules"), nodeModulesLink, "dir");
  } catch (error) {
    try {
      fs.symlinkSync(path.join(skeleton, "node_modules"), nodeModulesLink, "junction");
    } catch (inner) {
      console.error(`seed: failed to link node_modules: ${String(inner && inner.message ? inner.message : inner)}`);
      process.exit(1);
    }
  }
  console.log("seed: linked workspace/node_modules -> remotion-skeleton/node_modules");
}

if (!fs.existsSync(markerPath)) {
  fs.writeFileSync(markerPath, JSON.stringify({ template: "recut-remotion-studio", seededAt: new Date().toISOString(), kitVersion: kitVersion() }));
}
console.log(`seed: workspace ready at ${workspace}`);
process.exit(0);
