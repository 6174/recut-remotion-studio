import { useState } from "react";
import { Download, FolderOpen, RotateCcw, Wand2 } from "lucide-react";
import { recut, mediaContentURL } from "./recut-sdk";
import { PlayerPanel } from "./player-panel";
import { LogPanel } from "./log-panel";
import { TerminalPanel } from "./terminal-panel";
import { ExportPanel } from "./export-panel";
import { Modal } from "./ui";
import type { Brief, Catalog, MediaAsset, MediaMap } from "./app";

interface StudioProps {
  assets: MediaAsset[];
  brief: Brief;
  catalog: Catalog;
  mediaMap: MediaMap;
  onRedesign: (instruction: string) => void;
  setStatus: (status: string) => void;
}

type Tab = "logs" | "terminal";

export function Studio({ assets, brief, catalog, mediaMap, onRedesign, setStatus }: StudioProps) {
  const [tab, setTab] = useState<Tab>("logs");
  const [exportOpen, setExportOpen] = useState(false);
  const [redesignOpen, setRedesignOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [instruction, setInstruction] = useState("");
  const completed = assets.filter((item) => item.status === "completed");

  const resetProject = async () => {
    setResetting(true);
    try {
      await recut.background.call("workspace.reset", {});
      setResetOpen(false);
      window.location.reload();
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "重置失败");
      setResetting(false);
    }
  };

  return (
    <div className="workspace">
      <section className="preview-area">
        <PlayerPanel brief={brief} mediaMap={mediaMap} setStatus={setStatus} />
      </section>

      <aside className="right-column">
        <div className="right-actions">
          <div className="right-actions-title">操作</div>
          <div className="right-actions-grid">
            <button className="btn" onClick={() => setRedesignOpen(true)} type="button"><Wand2 className="size-4" />重新设计</button>
            <button className="btn" onClick={() => setExportOpen(true)} type="button"><Download className="size-4" />导出设置</button>
            <button className="btn" onClick={() => setMaterialsOpen(true)} type="button"><FolderOpen className="size-4" />素材</button>
            <button className="btn danger" onClick={() => setResetOpen(true)} type="button"><RotateCcw className="size-4" />重置项目</button>
          </div>
          <div className="materials-chips">
            {completed.slice(0, 6).map((asset) => (
              <span className="chip" key={asset.id} title={asset.name}>
                {asset.kind}·{asset.name.length > 10 ? `${asset.name.slice(0, 10)}…` : asset.name}
              </span>
            ))}
            {completed.length === 0 ? <span className="muted" style={{ fontSize: 12 }}>暂无素材</span> : null}
          </div>
        </div>

        <div className="right-logs">
          <div className="side-tabs" role="tablist">
            <button aria-selected={tab === "logs"} className={`side-tab ${tab === "logs" ? "active" : ""}`} onClick={() => setTab("logs")} role="tab" type="button">日志</button>
            <button aria-selected={tab === "terminal"} className={`side-tab ${tab === "terminal" ? "active" : ""}`} onClick={() => setTab("terminal")} role="tab" type="button">终端</button>
          </div>
          {tab === "logs" ? <LogPanel /> : <TerminalPanel />}
        </div>
      </aside>

      <Modal onClose={() => setExportOpen(false)} open={exportOpen} title="导出设置" wide>
        <ExportPanel catalog={catalog} brief={brief} onRenderStarted={(renderId) => setStatus(`渲染任务 ${renderId} 已启动`)} />
      </Modal>

      <Modal onClose={() => { setRedesignOpen(false); setInstruction(""); }} open={redesignOpen} title="重新设计">
        <p className="muted" style={{ margin: "0 0 12px" }}>告诉 AI 想怎么改这支视频（风格、结构、特效、字幕、素材…）。它会在项目 workspace 里直接改写 composition 代码，Vite 预览会自动热更新。</p>
        <div className="field">
          <label htmlFor="redesign-instruction">改写要求</label>
          <textarea autoFocus className="textarea" id="redesign-instruction" onChange={(event) => setInstruction(event.target.value)} placeholder="例如：把开场改成星空推进，结尾加一句品牌标语，内容场景用我上传的那张图…" value={instruction} />
        </div>
        <div className="flex" style={{ justifyContent: "flex-end", gap: 10 }}>
          <button className="btn" onClick={() => { setRedesignOpen(false); setInstruction(""); }} type="button">取消</button>
          <button className="btn primary" disabled={!instruction.trim()} onClick={() => { onRedesign(instruction); setRedesignOpen(false); setInstruction(""); }} type="button">交给 AI 改写</button>
        </div>
      </Modal>

      <Modal onClose={() => setMaterialsOpen(false)} open={materialsOpen} title="素材引用">
        <p className="muted" style={{ margin: "0 0 12px" }}>代码里用 `resolveMediaUrl(assetId)` 引用的素材。上传/生成后回到这里或刷新即可看到。</p>
        {completed.map((asset) => (
          <div className="asset-card" key={asset.id}>
            {asset.kind === "image" ? <img alt={asset.name} src={mediaContentURL(asset.id)} /> : asset.kind === "video" ? <video muted src={mediaContentURL(asset.id)} /> : null}
            <span className="kind-badge">{asset.kind}</span>
            <span className="grow name">{asset.name}</span>
            <span className="mono muted">{asset.id.slice(0, 10)}</span>
          </div>
        ))}
        {completed.length === 0 ? <p className="muted">暂无素材；到素材库上传或生成后回到这里。</p> : null}
      </Modal>

      <Modal onClose={() => !resetting && setResetOpen(false)} open={resetOpen} title="重置项目">
        <p className="muted" style={{ margin: "0 0 12px" }}>
          这将把项目的 Remotion 工程 <strong>重置回 App 骨架</strong>：停止预览、删除当前 workspace 里 AI 改写的代码与素材登记，并从骨架重新 seed。
          用于测试或回退；<strong>此操作不可撤销</strong>。Brief 与已导出素材保留。
        </p>
        <div className="flex" style={{ justifyContent: "flex-end", gap: 10 }}>
          <button className="btn" disabled={resetting} onClick={() => setResetOpen(false)} type="button">取消</button>
          <button className="btn danger" disabled={resetting} onClick={() => void resetProject()} type="button">{resetting ? "重置中…" : "确认重置"}</button>
        </div>
      </Modal>
    </div>
  );
}
