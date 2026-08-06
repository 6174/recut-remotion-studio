import { Wand2 } from "lucide-react";
import { mediaContentURL } from "./recut-sdk";
import { PlayerPanel } from "./player-panel";
import { LogPanel } from "./log-panel";
import { ExportPanel } from "./export-panel";
import type { Brief, Catalog, MediaAsset, MediaMap } from "./app";

interface StudioProps {
  assets: MediaAsset[];
  brief: Brief;
  catalog: Catalog;
  mediaMap: MediaMap;
  onRedesign: () => void;
  setStatus: (status: string) => void;
}

export function Studio({ assets, brief, catalog, mediaMap, onRedesign, setStatus }: StudioProps) {
  const completed = assets.filter((item) => item.status === "completed");

  return (
    <div className="workspace">
      <div className="studio">
        <section className="stage-area">
          <PlayerPanel brief={brief} mediaMap={mediaMap} setStatus={setStatus} />
        </section>

        <aside className="side-area">
          <div className="side-body">
            <div className="flex between" style={{ marginBottom: 14 }}>
              <button className="btn" onClick={onRedesign} type="button"><Wand2 className="size-4" />重新设计</button>
            </div>

            <ExportPanel catalog={catalog} brief={brief} onRenderStarted={(renderId) => setStatus(`渲染任务 ${renderId} 已启动`)} />

            <div className="panel" style={{ marginTop: 14 }}>
              <div className="panel-head"><h2>素材引用</h2></div>
              <div className="panel-body">
                <p className="muted" style={{ margin: 0, fontSize: 12 }}>代码里用 `resolveMediaUrl(assetId)` 引用的素材会显示在这里。</p>
                {completed.map((asset) => (
                  <div className="asset-card" key={asset.id}>
                    {asset.kind === "image" ? <img alt={asset.name} src={mediaContentURL(asset.id)} /> : asset.kind === "video" ? <video muted src={mediaContentURL(asset.id)} /> : null}
                    <span className="kind-badge">{asset.kind}</span>
                    <span className="grow name">{asset.name}</span>
                    <span className="mono muted">{asset.id.slice(0, 8)}</span>
                  </div>
                ))}
                {completed.length === 0 ? <p className="muted" style={{ margin: 0 }}>暂无素材；到素材库上传或生成后回到这里。</p> : null}
              </div>
            </div>
          </div>
        </aside>
      </div>
      <LogPanel />
    </div>
  );
}
