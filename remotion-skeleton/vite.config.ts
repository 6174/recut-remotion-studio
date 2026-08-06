import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

// The skeleton is a single Vite project. Its root is the project workspace:
// index.html hosts the @remotion/player page (src/player.tsx), which renders
// the composition from src/compositions/ProjectVideo.tsx — AI edits there
// hot-reload through Vite without touching the host page. props.json is served
// from workspace/preview (written by preview.props).
const workspace = __dirname;
const nodeModulesReal = path.dirname(path.dirname(fs.realpathSync(path.join(workspace, "node_modules"))));

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
  publicDir: path.join(workspace, "preview"),
});
