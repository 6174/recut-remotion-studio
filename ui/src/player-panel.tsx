import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, Play, RefreshCcw } from "lucide-react";
import { recut } from "./recut-sdk";
import type { Brief, MediaMap } from "./app";

interface ServeStatus {
  running: boolean;
  phase: string;
  port: number | null;
  url: string | null;
  error?: string | null;
  jobId?: string;
}

interface PlayerPanelProps {
  brief: Brief | null;
  mediaMap: MediaMap;
  settings?: { width: number; height: number; fps: number };
  setStatus: (status: string) => void;
}

const PREVIEW_SETTINGS = { width: 1920, height: 1080, fps: 30 };

export function PlayerPanel({ brief, mediaMap, settings = PREVIEW_SETTINGS, setStatus }: PlayerPanelProps) {
  const [serve, setServe] = useState<ServeStatus | null>(null);
  const [starting, setStarting] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const propsKey = useRef(0);
  const startedOnce = useRef(false);

  const writeProps = useCallback(async () => {
    if (!brief) return;
    propsKey.current += 1;
    try {
      await recut.background.call("preview.props", { media: mediaMap, settings });
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "写入预览配置失败");
    }
    return propsKey.current;
  }, [brief, mediaMap, settings, setStatus]);

  const refreshServe = useCallback(async () => {
    try {
      const next = await recut.background.call("preview.serve.status", {});
      setServe(next);
      return next as ServeStatus;
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "预览状态读取失败");
      return null;
    }
  }, [setStatus]);

  const startServe = useCallback(async () => {
    setStarting(true);
    try {
      await writeProps();
      await recut.background.call("preview.serve.start", {});
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "启动预览失败");
    } finally {
      setStarting(false);
      await refreshServe();
    }
  }, [refreshServe, setStatus, writeProps]);

  useEffect(() => {
    if (startedOnce.current) return;
    startedOnce.current = true;
    void refreshServe().then((status) => {
      if (status?.running) return;
      void startServe();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (brief) void writeProps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaMap, brief]);

  useEffect(() => {
    if (!serve?.running) return;
    const url = serve.url;
    if (url) setSrc(`${url}?props=${propsKey.current}`);
  }, [serve?.running, serve?.url, propsKey.current]);

  useEffect(() => {
    const timer = window.setInterval(() => void refreshServe(), 5000);
    return () => window.clearInterval(timer);
  }, [refreshServe]);

  if (serve?.running && src) {
    return <iframe className="preview-frame" src={src} title="Remotion 预览" />;
  }

  return (
    <div className="player-state">
      <div className="player-state-icon"><Loader2 className="size-6 spin" /></div>
      <h3>{starting ? "正在启动预览服务…" : "预览未启动"}</h3>
      <p className="muted">Vite dev server 会在 AI 改代码时自动热更新预览。</p>
      {serve?.error ? <pre className="studio-error">{serve.error}</pre> : null}
      <button className="btn primary" disabled={starting} onClick={() => void startServe()} type="button">
        {starting ? <Loader2 className="size-4 spin" /> : <Play className="size-4" />}启动预览
      </button>
      {serve?.phase === "interrupted" && <button className="btn ghost" onClick={() => void startServe()} type="button"><RefreshCcw className="size-4" />重启预览</button>}
    </div>
  );
}

export type { ServeStatus };
