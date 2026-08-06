/*
 * Remotion Studio — build the per-project preview bundle.
 *
 * Bundles the project's composition entry (${RECUT_APP_FILES_DIR}/workspace/
 * compositions/ProjectVideo.tsx) with esbuild into an IIFE that the Recut UI
 * loads into @remotion/player. react / react-dom / react/jsx-runtime / remotion
 * are external: the host UI exposes its own instances through window.require.
 * Writes workspace/preview/bundle.js + version.json (buildId) so the UI can
 * detect a rebuilt preview and reload.
 */
const fs = require("fs");
const path = require("path");
const { build } = require("esbuild");

const filesRoot = process.env.RECUT_APP_FILES_DIR;
if (!filesRoot) {
  console.error("preview: RECUT_APP_FILES_DIR is not set");
  process.exit(1);
}
const workspace = path.join(filesRoot, "workspace");
const entry = path.join(workspace, "compositions", "ProjectVideo.tsx");
const outDir = path.join(workspace, "preview");
const outfile = path.join(outDir, "bundle.js");

if (!fs.existsSync(entry)) {
  console.error(`preview: composition entry missing ${entry}（请先调用 workspace.ensure）`);
  process.exit(1);
}

build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: "iife",
  globalName: "RecutStudio",
  platform: "browser",
  target: ["es2020"],
  external: ["react", "react-dom", "react/jsx-runtime", "remotion"],
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "error",
})
  .then(() => {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "version.json"), JSON.stringify({ buildId: Date.now().toString(36), at: new Date().toISOString() }));
    console.log(`preview: built ${outfile}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("preview: build failed");
    console.error(String(error && error.stack ? error.stack : error));
    process.exit(1);
  });
