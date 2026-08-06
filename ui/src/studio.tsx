import { useEffect, useRef, useState } from "react";
import { Loader2, Play, RefreshCcw, Wand2, XCircle } from "lucide-react";
import { recut, apiBase, projectId, mediaContentURL } from "./recut-sdk";
import { ExportPanel } from "./export-panel";
import type { Brief, Catalog, MediaAsset, MediaMap, StudioStatus } from "./app";

interface StudioProps {
  assets: MediaAsset[];
  brief: Brief;
  catalog: Catalog;
  mediaMap: MediaMap;
  studio: StudioStatus | null;
  onStudioChanged: (status: StudioStatus) => void;
  onMediaChanged: (assets: MediaAsset[]) => void;
  onRedesign: () => void;
  setStatus: (status: string) => void;
}

const phaseLabel: Record<string, string> = {
  starting: "正在启动 Remotion Studio…",
  ready: "Remotion Studio 已就绪",
  stopped: "预览未启动",
  interrupted: "预览已中断",
  failed: "预览启动失败",
  cancelled: "预览已停止",
};

export function Studio({ assets, brief, catalog, mediaMap, studio, onStudioChanged, onMediaChanged, onRedesign, setStatus }: StudioProps) {
  const [starting, setStarting] = useState(false);
  const [envSynced, setEnvSynced] = useState(false);
  const pollRef = useRef<number | null>(null);

  const refreshStudio = async () => {
    try {
      const next = await recut.background.call("studio.status", {});
      onStudioChanged(next);
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "预览状态读取失败");
    }
  };

  const startStudio = async () => {
    setStarting(true);
    try {
      await recut.background.call("studio.start", {});
      setEnvSynced(false);
      await refreshStudio();
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "启动预览失败");
    } finally {
      setStarting(false);
    }
  };

  const stopStudio = async () => {
    try {
      await recut.background.call("studio.stop", {});
      onStudioChanged({ running: false, phase: "stopped", port: null, url: null });
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "停止预览失败");
    }
  };

  useEffect(() => {
    void refreshStudio();
    return () => { if (pollRef.current) window.clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    if (studio?.running) {
      pollRef.current = window.setInterval(() => void refreshStudio(), 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studio?.running]);

  useEffect(() => {
    if (!studio?.running || envSynced) return;
    setEnvSynced(true);
    void onMediaChanged(assets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studio?.running, envSynced]);

  useEffect(() => {
    if (studio?.running && envSynced) void onMediaChanged(assets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  const iframeURL = studio?.url ? `${studio.url}/?projectId=${encodeURIComponent(projectId)}&api=${encodeURIComponent(apiBase)}` : null;

  return (
    <div className="studio">
      <section className="stage-area" style={{ padding: 0, background: "#0a0c10" }}>
        {studio?.running && iframeURL ? (
          <iframe className="studio-frame" src={iframeURL} title="Remotion Studio 预览" />
        ) : (
          <div className="studio-empty">
            <div className="studio-empty-icon"><Play className="size-5" /></div>
            <h3>{phaseLabel[studio?.phase ?? "stopped"] ?? studio?.phase}</h3>
            <p className="muted">Remotion Studio 是每个项目的实时预览服务器；启动后 AI 改代码即热更新。</p>
            {studio?.error ? <pre className="studio-error">{studio.error}</pre> : null}
            <button className="btn primary" disabled={starting} onClick={() => void startStudio()} type="button">
              {starting ? <Loader2 className="size-4 spin" /> : <Play className="size-4" />}启动预览
            </button>
          </div>
        )}
      </section>

      <aside className="side-area">
        <div className="side-body">
          <div className="flex between" style={{ marginBottom: 14 }}>
            <button className="btn" onClick={onRedesign} type="button"><Wand2 className="size-4" />重新设计</button>
            {studio?.running ? (
              <button className="btn ghost small" onClick={() => void stopStudio()} type="button"><XCircle className="size-3.5" />停止预览</button>
            ) : (
              <button className="btn ghost small" onClick={() => void startStudio()} type="button"><RefreshCcw className="size-3.5" />重启预览</button>
            )}
          </div>

          <ExportPanel catalog={catalog} brief={brief} onRenderStarted={(renderId) => setStatus(`渲染任务 ${renderId} 已启动`)} />

          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panel-head"><h2>素材引用</h2></div>
            <div className="panel-body">
              <p className="muted" style={{ margin: 0, fontSize: 12 }}>代码里用 `resolveMediaUrl(assetId)` 引用的素材会显示在这里。</p>
              {assets.filter((item) => item.status === "completed").map((asset) => (
                <div className="asset-card" key={asset.id}>
                  {asset.kind === "image" ? <img alt={asset.name} src={mediaContentURL(asset.id)} /> : asset.kind === "video" ? <video muted src={mediaContentURL(asset.id)} /> : null}
                  <span className="kind-badge">{asset.kind}</span>
                  <span className="grow name">{asset.name}</span>
                  <span className="mono muted">{asset.id.slice(0, 8)}</span>
                </div>
              ))}
              {assets.filter((item) => item.status === "completed").length === 0 ? <p className="muted" style={{ margin: 0 }}>暂无素材；到素材库上传或生成后回到这里。</p> : null}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
