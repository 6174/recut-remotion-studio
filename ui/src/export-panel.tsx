/**
 * [INPUT]: 依赖导出目录、项目 brief、后台 render 操作与可选的父级受控 open 状态
 * [OUTPUT]: 对外提供可内置或由 Header 触发的模态化导出设置、环境状态、任务进度与历史产物
 * [POS]: remotion-studio/ui 的次级导出工具；只在用户准备成片时展开渲染细节，不参与预览服务生命周期
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2, Play, XCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { mediaContentURL, recut } from "./recut-sdk";
import { Modal } from "./ui";
import type { Brief, Catalog } from "./app";

interface ExportPanelProps { catalog: Catalog; brief: Brief; onRenderStarted: (renderId: string) => void; open?: boolean; onOpenChange?: (open: boolean) => void; showTrigger?: boolean; }
interface ExportRecord { renderId: string; status: string; label: string; settings: { width: number; height: number; fps: number; codec: string }; assetId?: string; createdAt: string; }
interface RenderState { renderId: string; status: "queued" | "running" | "completed" | "failed" | "cancelled" | "interrupted"; progress?: { progress?: number; message?: string }; assetId?: string; error?: string; }

const statusLabel: Record<string, string> = { queued: "排队中", running: "渲染中", completed: "完成", failed: "失败", cancelled: "已取消", interrupted: "被中断" };
const fieldClass = "mt-1 h-8 w-full rounded-xs border border-input bg-background px-2 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

export function ExportPanel({ catalog, brief, onRenderStarted, open: controlledOpen, onOpenChange, showTrigger = true }: ExportPanelProps) {
  const [size, setSize] = useState("1080p");
  const [fps, setFps] = useState(30);
  const [codec, setCodec] = useState("h264");
  const [setup, setSetup] = useState<{ ready: boolean; checks: Record<string, { ok: boolean; version?: string; error?: string }> } | null>(null);
  const [checkingSetup, setCheckingSetup] = useState(false);
  const [render, setRender] = useState<RenderState | null>(null);
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const pollTimer = useRef<number | null>(null);
  const selectedSize = catalog.canvasSizes.find((item) => item.id === size) ?? catalog.canvasSizes[0];
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const refreshExports = useCallback(async () => { try { setExports(await recut.state.query("export.list")); } catch { /* 历史记录不阻塞当前导出。 */ } }, []);
  useEffect(() => { void refreshExports(); }, [refreshExports]);
  useEffect(() => () => { if (pollTimer.current) window.clearInterval(pollTimer.current); }, []);

  const checkSetup = async () => {
    setCheckingSetup(true);
    try {
      const result = await recut.background.call("render.setup", {});
      setSetup(result);
      return result as { ready: boolean; checks: Record<string, { ok: boolean; version?: string; error?: string }> };
    } catch (cause) {
      const result = { ready: false, checks: { error: { ok: false, error: cause instanceof Error ? cause.message : "检查失败" } } };
      setSetup(result);
      return result;
    } finally { setCheckingSetup(false); }
  };

  const poll = useCallback((renderId: string) => {
    if (pollTimer.current) window.clearInterval(pollTimer.current);
    pollTimer.current = window.setInterval(async () => {
      try {
        const next = await recut.background.call("render.status", { renderId }) as RenderState;
        setRender(next);
        if (["completed", "failed", "cancelled", "interrupted"].includes(next.status)) { if (pollTimer.current) window.clearInterval(pollTimer.current); pollTimer.current = null; void refreshExports(); }
      } catch (cause) {
        if (pollTimer.current) window.clearInterval(pollTimer.current);
        pollTimer.current = null;
        setRender((current) => current ? { ...current, status: "failed", error: cause instanceof Error ? cause.message : "状态查询失败" } : null);
      }
    }, 2000);
  }, [refreshExports]);

  const startRender = async () => {
    setBusy(true);
    try {
      const currentSetup = await checkSetup();
      if (!currentSetup.ready) throw new Error("渲染环境未就绪，请先检查下方项目");
      const started = await recut.background.call("render.export", { width: selectedSize.width, height: selectedSize.height, fps, codec, label: "remotion 渲染导出" });
      setRender({ renderId: started.renderId, status: "queued" });
      onRenderStarted(started.renderId);
      poll(started.renderId);
    } catch (cause) { setRender({ renderId: "", status: "failed", error: cause instanceof Error ? cause.message : "渲染启动失败" }); } finally { setBusy(false); }
  };

  const cancel = async () => {
    if (!render?.renderId) return;
    try { await recut.background.call("render.cancel", { renderId: render.renderId }); setRender({ ...render, status: "cancelled" }); } catch { /* 取消请求失败时保留当前状态。 */ }
  };

  const progress = Math.round(((render?.progress?.progress ?? 0) * 100));
  return <>
    {showTrigger ? <Button className="px-2 text-[11px]" onClick={() => setOpen(true)} type="button" variant="ghost"><Download className="size-3.5" />导出</Button> : null}
    <Modal eyebrow="EXPORT" onClose={() => setOpen(false)} open={open} title="导出成片" wide>
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{brief.topic}。选择最终输出规格后开始本地渲染；预览不受影响。</p>
        <div className="rounded-xs border border-border p-3">
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-medium">画布<select className={fieldClass} id="export-size" onChange={(event) => setSize(event.target.value)} value={size}>{catalog.canvasSizes.map((item) => <option key={item.id} value={item.id}>{item.label}（{item.width}×{item.height}）</option>)}</select></label><label className="block text-xs font-medium">帧率<select className={fieldClass} id="export-fps" onChange={(event) => setFps(Number(event.target.value))} value={fps}><option value={30}>30 fps</option><option value={24}>24 fps</option></select></label></div>
          <label className="mt-3 block max-w-64 text-xs font-medium">编码<select className={fieldClass} id="export-codec" onChange={(event) => setCodec(event.target.value)} value={codec}><option value="h264">H.264</option><option value="h265">H.265</option><option value="vp9">VP9</option></select></label>
          <div className="mt-4 flex justify-end"><Button disabled={busy || render?.status === "running" || render?.status === "queued"} onClick={() => void startRender()} type="button">{busy ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}渲染导出 MP4</Button></div>
        </div>
        {setup ? <section className="rounded-xs border border-border p-3"><div className="flex items-center justify-between"><h3 className="text-xs font-semibold">渲染环境</h3><Button className="px-2 text-[11px]" onClick={() => void checkSetup()} type="button" variant="ghost">{checkingSetup ? "检查中…" : "重新检查"}</Button></div><div className="mt-2 space-y-1">{Object.entries(setup.checks).map(([key, check]) => <div className="flex items-start justify-between gap-3 font-mono text-[11px]" key={key}><span>{key}</span><span className={check.ok ? "text-primary" : "text-destructive"}>{check.ok ? `就绪${check.version ? ` · ${check.version}` : ""}` : check.error ?? "不可用"}</span></div>)}</div></section> : null}
        {render ? <section className="rounded-xs border border-border p-3"><div className="flex items-center justify-between text-xs"><h3 className="font-semibold">当前渲染 · {statusLabel[render.status] ?? render.status}</h3>{["queued", "running"].includes(render.status) ? <Button className="px-2 text-[11px]" onClick={() => void cancel()} type="button" variant="ghost"><XCircle className="size-3.5 text-destructive" />取消</Button> : null}</div>{["queued", "running"].includes(render.status) ? <><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div><p className="mt-2 font-mono text-[10px] text-muted-foreground">{render.progress?.message ?? "等待任务开始…"}</p></> : null}{render.status === "completed" && render.assetId ? <a className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline" download href={mediaContentURL(render.assetId)}><Download className="size-3.5" />下载 MP4</a> : null}{render.status === "failed" ? <p className="mt-3 text-xs leading-5 text-destructive">{render.error ?? "渲染失败"}</p> : null}</section> : null}
        {exports.length > 0 ? <section className="rounded-xs border border-border p-3"><h3 className="text-xs font-semibold">历史导出</h3><div className="mt-2 space-y-2">{exports.map((record) => <div className="flex items-center justify-between gap-3 text-xs" key={record.renderId}><div className="min-w-0"><p className="truncate">{record.label}</p><p className="font-mono text-[10px] text-muted-foreground">{record.settings.width}×{record.settings.height} · {statusLabel[record.status] ?? record.status}</p></div>{record.assetId ? <a aria-label={`下载 ${record.label}`} className="text-primary" download href={mediaContentURL(record.assetId)}><Play className="size-4" /></a> : null}</div>)}</div></section> : null}
      </div>
    </Modal>
  </>;
}
