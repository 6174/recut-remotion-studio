/**
 * [INPUT]: 依赖 React、react-dom、preview/props.json
 * [OUTPUT]: 对外提供 preview 入口：先挂全局错误捕获，再动态加载 player
 * [POS]: remotion-skeleton 的浏览器入口（index.html 引用本文件）；
 *        player 的 composition 图若在 import 阶段失败（如缺失命名导出），
 *        动态 import 会 reject，本文件用错误浮层替代黑屏
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorView } from "./error-view";

const container = document.getElementById("root");
let fatalShown = false;

function detailOf(cause: unknown): string {
  if (cause instanceof Error) return cause.stack || cause.message || String(cause);
  if (cause && typeof cause === "object" && "message" in cause) return String((cause as { message: unknown }).message);
  return String(cause);
}

function showFatal(title: string, detail: string) {
  if (fatalShown || !container) return;
  fatalShown = true;
  container.innerHTML = "";
  createRoot(container).render(<ErrorView title={title} detail={detail} />);
}

window.addEventListener("error", (event) => {
  if (event.target !== window) return;
  showFatal("预览运行时错误", detailOf(event.error) || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showFatal("未捕获的异步错误", detailOf(event.reason));
});

import("./player")
  .then(({ App }) => {
    if (!fatalShown && container) createRoot(container).render(<App />);
  })
  .catch((cause) => {
    showFatal("预览模块加载失败", detailOf(cause));
  });
