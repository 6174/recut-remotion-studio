/**
 * [INPUT]: 依赖 @remotion/player、ProjectVideo 与 preview/props.json
 * [OUTPUT]: 对外提供读取 preview/props.json 并渲染 ProjectVideo 的 App 组件（由 bootstrap 动态加载并挂载）；Player 内容区域限制最大 960×540，居中显示
 * [POS]: remotion-skeleton 的浏览器预览根组件；固定无声视觉预览，避免宿主音频设备缺失时创建 WebAudio；入口与全局错误捕获在 bootstrap.tsx
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { ErrorView } from "./error-view";
import { ProjectVideo, getProjectMetadata } from "./compositions/ProjectVideo";

const FALLBACK_PROPS = { brief: null, media: {}, settings: { width: 1920, height: 1080, fps: 30 } };

export function App() {
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

  // 无声门控：项目只有真选了配乐（props.music.assetId）才解锁音量，否则保持默认静音，
  // 避免宿主无音频设备时创建 WebAudio（histamine behavior 不回归）。
  const hasMusic = Boolean(props && (props as { music?: { assetId?: string | null } | null }).music?.assetId);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1017" }}>
      <div style={{ width: "100%", height: "100%", maxWidth: 960, maxHeight: 540 }}>
        <Player
          acknowledgeRemotionLicense
          component={ProjectVideo}
          compositionHeight={meta.height}
          compositionWidth={meta.width}
          controls
          durationInFrames={meta.durationInFrames}
          fps={meta.fps}
          initialVolume={hasMusic ? 1 : 0}
          initiallyMuted={!hasMusic}
          inputProps={props}
          loop
          showVolumeControls={hasMusic}
          style={{ width: "100%", height: "100%" }}
          errorFallback={({ error: renderError }) => (
            <ErrorView title="composition 渲染出错" detail={(renderError as Error).stack || String(renderError)} />
          )}
        />
      </div>
    </div>
  );
}
