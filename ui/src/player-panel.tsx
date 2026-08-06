import { useCallback, useEffect, useRef, useState } from "react";
import { Player } from "@remotion/player";
import { AlertTriangle, Loader2, RefreshCcw } from "lucide-react";
import { recut, apiBase, projectId } from "./recut-sdk";
import type { Brief, MediaMap } from "./app";

const APP_ID = "recut.remotion-studio";
const previewURL = `${apiBase}/v1/projects/${encodeURIComponent(projectId)}/apps/${APP_ID}/files/workspace/preview/bundle.js`;

interface PreviewModule {
  component: React.ComponentType<{ brief?: Brief | null; media?: MediaMap; settings?: { width?: number; height?: number; fps?: number } }>;
  getMetadata: (props: unknown) => { durationInFrames: number; fps: number; width: number; height: number };
}

declare global {
  interface Window {
    RecutStudio?: {
      ProjectVideo?: React.ComponentType<unknown>;
      getProjectMetadata?: (props: unknown) => { durationInFrames: number; fps: number; width: number; height: number };
    };
  }
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    document.querySelector("script[data-recut-preview]")?.remove();
    const script = document.createElement("script");
    script.src = url;
    script.dataset.recutPreview = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`预览 bundle 加载失败：${url}`));
    document.head.appendChild(script);
  });
}

interface PlayerPanelProps {
  brief: Brief | null;
  mediaMap: MediaMap;
  setStatus: (status: string) => void;
}

export function PlayerPanel({ brief, mediaMap, setStatus }: PlayerPanelProps) {
  const [mod, setMod] = useState<PreviewModule | null>(null);
  const [buildId, setBuildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const mounted = useRef(true);

  const loadPreview = useCallback(async () => {
    try {
      setError(null);
      await loadScript(previewURL);
      if (!mounted.current) return;
      const studio = window.RecutStudio;
      if (!studio?.ProjectVideo || !studio.getProjectMetadata) throw new Error("预览 bundle 未导出 ProjectVideo");
      setMod({ component: studio.ProjectVideo, getMetadata: studio.getProjectMetadata });
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : "预览加载失败");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const pollVersion = useCallback(async () => {
    try {
      const version = await recut.state.query("preview.version");
      const nextBuildId = version?.buildId ?? null;
      setBuildId((current) => {
        if (current !== null && nextBuildId !== null && nextBuildId !== current) void loadPreview();
        return nextBuildId;
      });
    } catch { /* 未构建时忽略 */ }
  }, [loadPreview]);

  useEffect(() => {
    mounted.current = true;
    void loadPreview();
    const timer = window.setInterval(() => void pollVersion(), 3000);
    return () => { mounted.current = false; window.clearInterval(timer); };
  }, [loadPreview, pollVersion]);

  const rebuild = async () => {
    setBuilding(true);
    setError(null);
    try {
      await recut.background.call("preview.build", {});
      setStatus("预览已重建。");
      await loadPreview();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "预览构建失败");
      setStatus(cause instanceof Error ? cause.message : "预览构建失败");
    } finally {
      setBuilding(false);
    }
  };

  const settings = { width: 1920, height: 1080, fps: 30 };
  const meta = mod ? (() => { try { return mod.getMetadata({ brief, media: mediaMap, settings }); } catch { return null; } })() : null;

  if (loading) {
    return (
      <div className="player-state">
        <Loader2 className="size-6 spin" />
        <p className="muted">正在加载预览 bundle…</p>
      </div>
    );
  }

  if (error || !mod || !meta) {
    return (
      <div className="player-state">
        <AlertTriangle className="size-6" style={{ color: "var(--danger)" }} />
        <h3>预览不可用</h3>
        <pre className="studio-error">{error ?? "预览 bundle 无效"}</pre>
        <button className="btn primary" disabled={building} onClick={() => void rebuild()} type="button">
          {building ? <Loader2 className="size-4 spin" /> : <RefreshCcw className="size-4" />}重建预览
        </button>
      </div>
    );
  }

  return (
    <div className="stage-box" key={buildId ?? "initial"}>
      <Player
        acknowledgeRemotionLicense
        component={mod.component}
        compositionHeight={meta.height}
        compositionWidth={meta.width}
        controls
        durationInFrames={meta.durationInFrames}
        fps={meta.fps}
        initiallyMuted
        inputProps={{ brief, media: mediaMap, settings }}
        loop
        style={{ width: "100%", aspectRatio: `${meta.width} / ${meta.height}` }}
      />
      <div className="flex between" style={{ marginTop: 14 }}>
        <span className="muted mono">{meta.width}×{meta.height} @ {meta.fps}fps · {Math.round(meta.durationInFrames / meta.fps)}s{buildId ? ` · build ${buildId}` : ""}</span>
        <button className="btn" disabled={building} onClick={() => void rebuild()} type="button">
          {building ? <Loader2 className="size-4 spin" /> : <RefreshCcw className="size-4" />}重建预览
        </button>
      </div>
    </div>
  );
}
