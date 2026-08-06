import { useEffect, useMemo, useRef, useState } from "react";
import { BriefForm } from "./brief-form";
import { Studio } from "./studio";
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

export interface StudioStatus {
  running: boolean;
  phase: string;
  port: number | null;
  url: string | null;
  error?: string | null;
  jobId?: string;
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
  const [studio, setStudio] = useState<StudioStatus | null>(null);
  const [status, setStatus] = useState("连接中…");
  const [diagnostic, setDiagnostic] = useState("等待资源连接");
  const loadingRef = useRef(false);

  const mediaMap = useMemo(() => buildMediaMap(assets), [assets]);

  const refresh = async (silent = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      if (!silent) setDiagnostic("正在同步项目状态");
      const [nextCatalog, nextAssets, nextBrief, nextStudio] = await Promise.all([
        loadCatalog(),
        loadAssets(),
        recut.state.query("brief.latest").catch(() => null),
        recut.background.call("studio.status", {}).catch(() => null),
      ]);
      setCatalog(nextCatalog);
      setAssets(nextAssets);
      setBrief(nextBrief ?? null);
      setStudio(nextStudio ?? null);
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

  const syncStudioEnv = async (nextAssets: MediaAsset[]) => {
    try {
      await recut.background.call("studio.env", { api: apiBase, media: buildMediaMap(nextAssets) });
    } catch (cause) {
      console.warn("[remotion-studio] studio.env sync failed", cause);
    }
  };

  const startDesign = async (input: { template: string; topic: string; details: string; expectedDurationSec: number; materialAssetIds: string[] }) => {
    setStatus("正在保存项目 Brief…");
    const saved = await recut.background.call("project.create", input);
    setBrief(saved.value ?? saved);
    const template = catalog?.styleTemplates[input.template];
    const materialText = input.materialAssetIds.length
      ? `\n已选用素材（assetId）：\n${input.materialAssetIds.join("\n")}\n`
      : "";
    const prompt = `我要用 Remotion Studio 做一支程序化视频，请直接改写项目里的 Remotion 代码（项目私有 workspace），不要用任何结构化的设计契约。\n\n项目 Brief：\n- 风格模板：${input.template}（${template?.label ?? ""}；${template?.motion ?? ""}）\n- 选题：${input.topic}\n- 详细描述：${input.details || "无额外补充"}\n- 预期时长：${input.expectedDurationSec} 秒${materialText}\n\n开始前先做这些事：\n1. 调用 recut.skills.read 读本 App 的 remotion-studio skill，并读它的 references（effects.md / captions.md / directing.md），让用户确认想用的表达特效与字幕主题。\n2. 调用 workflow.context 看阶段与 workspace 状态；必要时 workspace.ensure。\n3. 用 code.list / code.read 读 workspace/compositions/ProjectVideo.tsx 与 workspace/Root.tsx 的当前代码。\n4. 用 code.write 直接改写：SCENES 与渲染层，复用 workspace/effects、workspace/captions 与 templates-vendor；媒体用 resolveMediaUrl(assetId) 引用真实素材，并用 composition.assets 登记代码里用到的所有 assetId。\n5. 保存后停下等待预览确认；不要调用 render.export。`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(prompt);
    } catch { /* 剪贴板不可用不影响 compose */ }
    await recut.agent.compose({ prompt });
    setStatus("设计任务已交给 AI。提示词已写入右侧 Agent 面板并复制到剪贴板；发送后 Remotion Studio 会热更新预览。");
  };

  const redesign = async () => {
    if (!brief) return;
    const prompt = `请继续在 Remotion Studio 中改写这支视频的 composition 代码。\n\n当前 Brief：${brief.topic}（${brief.details || ""}）\n\n请：\n1. 读 recut.skills.read 的 remotion-studio skill 及其 references，确认表达特效与字幕主题选择。\n2. 读 workflow.context 与当前 workspace 代码（code.list/code.read）。\n3. 用 code.write 直接改写 workspace/compositions/ProjectVideo.tsx（SCENES 与渲染层），遵循 directing.md 的导演语言与确定性渲染铁律。\n4. 用 composition.assets 登记代码引用的素材 assetId。\n5. 保存后停下等待预览确认；不要调用 render.export。`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(prompt);
    } catch { /* ignore */ }
    await recut.agent.compose({ prompt });
    setStatus("改写请求已交给 AI（已写入右侧 Agent 面板）。");
  };

  if (!catalog) {
    return <div className="app"><div className="topbar"><h1>Remotion Studio</h1><span className="status">{diagnostic}</span></div><div className="panel-body muted" style={{ padding: 24 }}>{diagnostic}</div></div>;
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="flex grow">
          <h1>Remotion Studio</h1>
          {brief ? <span className="meta">{brief.topic} · {catalog.styleTemplates[brief.template]?.label ?? brief.template}</span> : null}
        </div>
        <span className="status mono" data-testid="diagnostic">{diagnostic}</span>
      </div>
      {!brief ? (
        <BriefForm catalog={catalog} onStart={startDesign} status={status} />
      ) : (
        <Studio assets={assets} brief={brief} catalog={catalog} mediaMap={mediaMap} onMediaChanged={syncStudioEnv} onRedesign={() => void redesign()} setStatus={setStatus} studio={studio} onStudioChanged={setStudio} />
      )}
    </div>
  );
}
