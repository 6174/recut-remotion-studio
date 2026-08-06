/*
 * Remotion Studio — seed the per-project composition workspace.
 *
 * Copies the App template (render/src) into ${RECUT_APP_FILES_DIR}/workspace on
 * first use, links workspace/node_modules to the App render workspace so both
 * Remotion Studio preview and render.js resolve `remotion`/`react`, and writes
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

if (!fs.existsSync(workspace)) {
  fs.mkdirSync(workspace, { recursive: true });
  const template = path.join(__dirname, "src");
  for (const entry of fs.readdirSync(template)) {
    fs.cpSync(path.join(template, entry), path.join(workspace, entry), { recursive: true });
  }
  console.log(`seed: seeded workspace from ${template}`);
}

const nodeModulesLink = path.join(workspace, "node_modules");
if (!fs.existsSync(nodeModulesLink)) {
  try {
    fs.symlinkSync(path.join(__dirname, "node_modules"), nodeModulesLink, "dir");
  } catch (error) {
    try {
      fs.symlinkSync(path.join(__dirname, "node_modules"), nodeModulesLink, "junction");
    } catch (inner) {
      console.error(`seed: failed to link node_modules: ${String(inner && inner.message ? inner.message : inner)}`);
      process.exit(1);
    }
  }
  console.log("seed: linked workspace/node_modules -> app render/node_modules");
}

fs.mkdirSync(path.join(workspace, "public"), { recursive: true });
const packageJson = path.join(workspace, "package.json");
if (!fs.existsSync(packageJson)) {
  fs.writeFileSync(packageJson, JSON.stringify({
    name: "recut-remotion-studio-workspace",
    private: true,
    version: "0.0.0",
    dependencies: { remotion: "4.0.506", react: "18.3.1", "react-dom": "18.3.1" },
  }, null, 2));
}
if (!fs.existsSync(markerPath)) {
  fs.writeFileSync(markerPath, JSON.stringify({ template: "recut-remotion-studio", seededAt: new Date().toISOString() }));
}
console.log(`seed: workspace ready at ${workspace}`);
process.exit(0);
