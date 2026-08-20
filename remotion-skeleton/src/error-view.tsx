/**
 * [INPUT]: 依赖 React
 * [OUTPUT]: 对外提供预览页共用的错误浮层 ErrorView
 * [POS]: remotion-skeleton 的浏览器错误展示；只依赖 React，不依赖 composition 图，
 *        保证 composition 模块加载失败时仍能渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";

export function ErrorView({ title, detail }: { title: string; detail: string }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24, boxSizing: "border-box", background: "var(--background)", color: "var(--foreground)", fontFamily: "system-ui, sans-serif" }}>
      <strong style={{ fontSize: 15 }}>{title}</strong>
      <pre style={{ margin: 0, maxWidth: 720, maxHeight: 240, overflow: "auto", padding: 10, border: "1px solid oklch(0.5 0.14 28)", borderRadius: 8, background: "oklch(0.2 0.05 28)", color: "oklch(0.9 0.1 28)", fontSize: 11, whiteSpace: "pre-wrap" }}>{detail}</pre>
      <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>改代码后预览会自动热更新（必要时会整页刷新恢复）；构建/渲染问题可看 App 底部日志区。</span>
    </div>
  );
}
