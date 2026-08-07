/**
 * [INPUT]: 依赖 @remotion/player、ProjectVideo 与 preview/props.json
 * [OUTPUT]: 对外提供读取 preview/props.json 并渲染 ProjectVideo 的预览 React 根
 * [POS]: remotion-skeleton 的浏览器预览入口；可用性由 Studio 应用层的预览服务健康检查决定
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { ProjectVideo, getProjectMetadata } from "./compositions/ProjectVideo";

const FALLBACK_PROPS = { brief: null, media: {}, settings: { width: 1920, height: 1080, fps: 30 } };

function ErrorView({ title, detail }: { title: string; detail: string }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24, boxSizing: "border-box", background: "#0d1017", color: "#e8ecf4", fontFamily: "system-ui, sans-serif" }}>
      <strong style={{ fontSize: 15 }}>{title}</strong>
      <pre style={{ margin: 0, maxWidth: 720, maxHeight: 240, overflow: "auto", padding: 10, border: "1px solid #3a2730", borderRadius: 8, background: "#1a1114", color: "#ffb4b4", fontSize: 11, whiteSpace: "pre-wrap" }}>{detail}</pre>
      <span style={{ fontSize: 12, color: "#9aa4b5" }}>改代码后预览会自动热更新；构建/渲染问题可看 App 底部日志区。</span>
    </div>
  );
}

function App() {
  const [props, setProps] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/props.json")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("props.json 读取失败"))))
      .then((payload) => { if (!cancelled) setProps(payload); })
      .catch((cause) => { if (!cancelled) setError(cause && cause.message ? cause.message : String(cause)); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <ErrorView title="无法加载预览配置" detail={error} />;
  if (!props) return <div style={{ height: "100%", display: "grid", placeItems: "center", background: "#0d1017", color: "#9aa4b5", fontSize: 13 }}>加载预览…</div>;

  let meta;
  try {
    meta = getProjectMetadata(props);
  } catch (cause) {
    return <ErrorView title="composition 元数据计算失败" detail={(cause as Error).stack || String(cause)} />;
  }

  return (
    <Player
      acknowledgeRemotionLicense
      component={ProjectVideo}
      compositionHeight={meta.height}
      compositionWidth={meta.width}
      controls
      durationInFrames={meta.durationInFrames}
      fps={meta.fps}
      initiallyMuted
      inputProps={props}
      loop
      style={{ width: "100%", height: "100%" }}
      errorFallback={({ error: renderError }) => (
        <ErrorView title="composition 渲染出错" detail={(renderError as Error).stack || String(renderError)} />
      )}
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);
