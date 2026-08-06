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

if (!fs.existsSync(workspace)) {
  copyTree(skeleton, workspace);
  console.log(`seed: seeded workspace from ${skeleton}`);
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
  fs.writeFileSync(markerPath, JSON.stringify({ template: "recut-remotion-studio", seededAt: new Date().toISOString() }));
}
console.log(`seed: workspace ready at ${workspace}`);
process.exit(0);
