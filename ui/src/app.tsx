/**
 * [INPUT]: 依赖 Recut SDK 的项目状态、素材目录和 Agent compose，以及 Brief/Studio 子面板
 * [OUTPUT]: 对外提供 Remotion Studio 根视图、项目 Header 与 Brief→工作台状态切换
 * [POS]: remotion-studio/ui 的应用根；Header 承载工作台次级操作，Studio 承载创作场景和操作实现
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Download, RefreshCcw, RotateCcw } from "lucide-react";
import { Button } from "./components/ui/button";
import { BriefForm } from "./brief-form";
import { Studio, type WorkspaceActions } from "./studio";
import { recut, apiBase, projectId, mediaContentURL } from "./recut-sdk";

export interface Brief {
  id: string;
  template: string;
  topic: string;
  details: string;
  expectedDurationSec: number;
  materialAssetIds: string[];
  createdAt: string;
}

export interface Catalog {
  styleTemplates: Record<string, { label: string; description: string; motion: string }>;
  captionThemes: Array<{ id: string; label: string; description: string }>;
  canvasSizes: Array<{ id: string; label: string; width: number; height: number; fps: number }>;
}

export interface MediaAsset {
  id: string;
  kind: "image" | "video" | "audio";
  name: string;
  mimeType?: string;
  status: string;
  createdAt?: string;
}

export interface MediaMap {
  [assetId: string]: { kind: "image" | "video" | "audio"; url: string };
}

async function loadCatalog(): Promise<Catalog> {
  return recut.state.query("catalog.list");
}

async function loadAssets(): Promise<MediaAsset[]> {
  if (!projectId) return [];
  const response = await fetch(`${apiBase}/v1/media/assets?projectId=${encodeURIComponent(projectId)}`);
  if (!response.ok) throw new Error(`素材列表读取失败：${response.status}`);
  return response.json();
}

export function buildMediaMap(assets: MediaAsset[]): MediaMap {
  const map: MediaMap = {};
  for (const asset of assets) {
    if (asset.status !== "completed") continue;
    if (asset.kind === "video" || asset.kind === "audio" || asset.kind === "image") {
      map[asset.id] = { kind: asset.kind, url: mediaContentURL(asset.id) };
    }
  }
  return map;
}

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [status, setStatus] = useState("连接中…");
  const [diagnostic, setDiagnostic] = useState("等待资源连接");
  const [workspaceActions, setWorkspaceActions] = useState<WorkspaceActions | null>(null);
  const loadingRef = useRef(false);

  const mediaMap = useMemo(() => buildMediaMap(assets), [assets]);

  const refresh = async (silent = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      if (!silent) setDiagnostic("正在同步项目状态");
      const [nextCatalog, nextAssets, nextBrief] = await Promise.all([
        loadCatalog(),
        loadAssets(),
        recut.state.query("brief.latest").catch(() => null),
      ]);
      setCatalog(nextCatalog);
      setAssets(nextAssets);
      setBrief(nextBrief ?? null);
      setDiagnostic(nextBrief ? "项目已就绪" : "尚未创建 Brief");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "未知错误";
      setDiagnostic(`同步失败：${message}`);
      if (!silent) console.error("[remotion-studio] refresh failed", cause);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener("recut-sdk-ready", () => void refresh());
    void refresh();
    const unsubscribe = recut.events.subscribe((event) => {
      const capability = event as { type?: string; appId?: string; name?: string };
      if (capability.type === "app.capability.completed" && capability.appId === "recut.remotion-studio" && ["project.create", "render.export"].includes(String(capability.name))) {
        void refresh(true);
      }
    });
    return () => { window.removeEventListener("recut-sdk-ready", () => void refresh()); unsubscribe(); };
  }, []);

  const startDesign = async (input: { template: string; topic: string; details: string; expectedDurationSec: number; materialAssetIds: string[] }) => {
    setStatus("正在保存项目 Brief…");
    const saved = await recut.background.call("project.create", input);
    setBrief(saved.value ?? saved);
    const template = catalog?.styleTemplates[input.template];
    const materialText = input.materialAssetIds.length
      ? `\n已选用素材（assetId）：\n${input.materialAssetIds.join("\n")}\n`
      : "";
    const prompt = `我要用 Remotion Studio 做一支程序化视频，请直接改写项目里的 Remotion 代码（项目私有 workspace），不要用任何结构化的设计契约。\n\n项目 Brief：\n- 风格模板：${input.template}（${template?.label ?? ""}；${template?.motion ?? ""}）\n- 选题：${input.topic}\n- 详细描述：${input.details || "无额外补充"}\n- 预期时长：${input.expectedDurationSec} 秒${materialText}\n\n开始前先做这些事：\n1. 调用 recut.skills.read 读本 App 的 remotion-studio skill，并读它的 references（effects.md / captions.md / directing.md），让用户确认想用的表达特效与字幕主题。\n2. 调用 workflow.context 看阶段与 workspace 状态；必要时 workspace.ensure。\n3. 用 code.list / code.read 读 workspace/src/compositions/ProjectVideo.tsx 与 workspace/src/Root.tsx 的当前代码。\n4. 用 code.write 直接改写：SCENES 与渲染层，复用 workspace/src/effects、workspace/src/captions 与 src/components/remotion-templates；媒体用 resolveMediaUrl(assetId) 引用真实素材，并用 composition.assets 登记代码里用到的所有 assetId。\n5. 改完调用 preview.build 刷新内嵌 Player 预览。\n6. 保存后停下等待预览确认；不要调用 render.export。`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(prompt);
    } catch { /* 剪贴板不可用不影响 compose */ }
    await recut.agent.compose({ prompt });
    setStatus("设计任务已交给 AI。提示词已写入右侧 Agent 面板并复制到剪贴板；发送后 Player 预览会自动刷新。");
  };

  const redesign = async (instruction: string | undefined) => {
    if (!brief) return;
    const prompt = `请继续在 Remotion Studio 中改写这支视频的 composition 代码。\n\n当前 Brief：${brief.topic}（${brief.details || ""}）\n\n用户的改写要求：${instruction}\n\n请：\n1. 读 recut.skills.read 的 remotion-studio skill 及其 references，确认表达特效与字幕主题选择。\n2. 读 workflow.context 与当前 workspace 代码（code.list/code.read）。\n3. 用 code.write 直接改写 workspace/src/compositions/ProjectVideo.tsx（SCENES 与渲染层），遵循 directing.md 的导演语言与确定性渲染铁律。\n4. 用 composition.assets 登记代码引用的素材 assetId。\n5. 保存后停下等待预览确认（Vite 预览会自动热更新）；不要调用 render.export。`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(prompt);
    } catch { /* ignore */ }
    await recut.agent.compose({ prompt });
    setStatus("改写请求已交给 AI（已写入右侧 Agent 面板）。");
  };

  if (!catalog) {
    return <div className="flex h-full flex-col"><header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4"><div className="flex min-w-0 items-center gap-3"><p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-primary">REMOTION STUDIO</p><h1 className="truncate text-sm font-semibold">Remotion Studio</h1></div><span className="font-mono text-xs text-muted-foreground">{diagnostic}</span></header><div className="grid flex-1 place-items-center p-6"><p className="max-w-md text-center text-sm leading-6 text-muted-foreground">{diagnostic}</p></div></div>;
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4">
        <div className="flex min-w-0 items-center gap-3">
          <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-primary">REMOTION STUDIO</p>
          <h1 className="truncate text-sm font-semibold">Remotion Studio</h1>
          {brief ? <span className="truncate rounded-xs bg-muted px-2 py-1 text-[11px] text-muted-foreground">{brief.topic} · {catalog.styleTemplates[brief.template]?.label ?? brief.template}</span> : null}
        </div>
        {brief && workspaceActions ? <div className="flex shrink-0 items-center gap-1"><Button className="px-2 text-[11px]" onClick={workspaceActions.openExport} type="button" variant="ghost"><Download className="size-3.5" />导出</Button><Button className="px-2 text-[11px]" onClick={workspaceActions.buildPreview} type="button" variant="ghost"><RefreshCcw className="size-3.5" />构建</Button><Button className="px-2 text-[11px]" onClick={workspaceActions.restartPreview} type="button" variant="ghost"><RotateCcw className="size-3.5" />重启</Button><Button className="px-2 text-[11px] text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={workspaceActions.resetWorkspace} type="button" variant="ghost"><AlertTriangle className="size-3.5" />重置</Button></div> : null}
      </header>
      {!brief ? (
        <BriefForm catalog={catalog} onStart={startDesign} status={status} />
      ) : (
        <Studio assets={assets} brief={brief} catalog={catalog} mediaMap={mediaMap} onHeaderActionsChange={setWorkspaceActions} onRedesign={(instruction) => void redesign(instruction)} setStatus={setStatus} />
      )}
    </div>
  );
}
