import { createRoot } from "react-dom/client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Remotion from "remotion";
import * as JSXRuntime from "react/jsx-runtime";
import App from "./app";
import "./style.css";

// The per-project preview bundle is built by esbuild with react / react-dom /
// react/jsx-runtime / remotion external; its __require shim resolves them
// through this window.require bridge so the composition shares the same React
// and Remotion instances as @remotion/player (hooks context must match).
const previewExternals: Record<string, unknown> = {
  react: React,
  "react-dom": ReactDOM,
  "react/jsx-runtime": JSXRuntime,
  remotion: Remotion,
};
(window as unknown as { require?: (name: string) => unknown }).require = (name: string) => previewExternals[name];

createRoot(document.getElementById("root")!).render(<App />);
