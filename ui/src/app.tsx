/**
 * [INPUT]: 依赖 Recut SDK 的项目状态、素材目录和 Agent compose，以及 Brief/Studio 子面板
 * [OUTPUT]: 对外提供归一化目录数据的 Remotion Studio 根视图、含跨平台项目文件夹入口的 Header 与 Brief→工作台状态切换
 * [POS]: remotion-studio/ui 的应用根；Header 承载工作台次级操作，Studio 实现打开工作区及创作操作
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Download, FolderOpen, RefreshCcw, RotateCcw } from "lucide-react";
import { Button } from "./components/ui/button";
import { BriefForm } from "./brief-form";
import { Studio, type WorkspaceActions } from "./studio";
import { recut, apiBase, projectId, mediaContentURL, getRecutLocale, useRecutLocale } from "./recut-sdk";
import { t } from "./i18n";

export type NarrativeSource =
  | { kind: "srt"; name: string; text: string }
  | { kind: "videos"; assetIds: string[]; names: string[] };

export interface Brief {
  id: string;
  template: string;
  topic: string;
  details: string;
  expectedDurationSec: number;
  materialAssetIds: string[];
  narrativeSource: NarrativeSource | null;
  createdAt: string;
}

export interface Catalog {
  scenarios: Record<string, { label: string; description: string; motion: string; components: string[]; defaultStyle?: string; skillBody?: string }>;
  captionThemes: Array<{ id: string; label: string; description: string }>;
  canvasSizes: Array<{ id: string; label: string; width: number; height: number; fps: number }>;
  components: Array<{ id: string; label: string; description: string; kind: string; category?: string; path: string; workspacePath: string }>;
  effects: Array<{
    id: string;
    label: string;
    description: string;
    engine: string;
    layer: string;
    intent: string;
    requires: string[];
    placement: string[];
    preview: { compositionId: string; durationInFrames: number; defaultProps: Record<string, unknown> };
    source: { exportName: string; path: string; workspacePath: string };
    prompt: { constraints: string[]; recommendedDurationFrames: number };
    /** Three GPU 材质的元数据（engine=three 时存在） */
    material?: {
      id: string;
      category: string;
      schema: Record<string, { type: "number" | "boolean"; min?: number; max?: number; default: number | boolean }>;
    };
    /** Camera Language v2 的可序列化 preset（engine=three-camera 时存在）。 */
    camera?: {
      verb: string;
      subject: { anchor: number[]; depth?: number };
      keyframes: Array<{ at: number; position?: number[]; fov?: number; roll?: number; easing?: string }>;
      lens?: { zoom: number; radius: number };
    };
    /** Camera Language v2 的表面姿态 preset（engine=three-camera 时存在）。 */
    surface?: Record<string, unknown>;
  }>;
  directives: Array<{ id: string; label: string; description: string; prompt: string }>;
}

export interface KitState {
  kitVersion: string;
  seededKitVersion: string | null;
}

export interface MediaAsset {
  id: string;
  kind: "image" | "video" | "audio" | "transcript";
  name: string;
  mimeType?: string;
  status: string;
  createdAt?: string;
}

export interface MediaMap {
  [assetId: string]: { kind: "image" | "video" | "audio"; url: string };
}

function normalizeCatalog(value: unknown): Catalog {
  const catalog = value && typeof value === "object" ? value as Partial<Catalog> : {};
  return {
    scenarios: catalog.scenarios ?? {},
    captionThemes: catalog.captionThemes ?? [],
    canvasSizes: catalog.canvasSizes ?? [],
    components: catalog.components ?? [],
    effects: catalog.effects ?? [],
    directives: catalog.directives ?? [],
  };
}

async function loadCatalog(): Promise<Catalog> {
  return normalizeCatalog(await recut.state.query("catalog.list"));
}

async function loadAssets(): Promise<MediaAsset[]> {
  if (!projectId) return [];
  const response = await fetch(`${apiBase}/v1/media/assets?projectId=${encodeURIComponent(projectId)}`);
  if (!response.ok) throw new Error(t(getRecutLocale(), "assets.loadFailed", { status: String(response.status) }));
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
  const locale = useRecutLocale();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [status, setStatus] = useState(t(locale, "status.connecting"));
  const [diagnostic, setDiagnostic] = useState(t(locale, "diag.waitingConnection"));
  const [workspaceActions, setWorkspaceActions] = useState<WorkspaceActions | null>(null);
  const loadingRef = useRef(false);

  const mediaMap = useMemo(() => buildMediaMap(assets), [assets]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = t(locale, "header.title");
  }, [locale]);

  const refresh = async (silent = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      if (!silent) setDiagnostic(t(locale, "diag.syncing"));
      const [nextCatalog, nextAssets, nextBrief] = await Promise.all([
        loadCatalog(),
        loadAssets(),
        recut.state.query("brief.latest").catch(() => null),
      ]);
      setCatalog(nextCatalog);
      setAssets(nextAssets);
      setBrief(nextBrief ?? null);
      setDiagnostic(nextBrief ? t(locale, "diag.ready") : t(locale, "diag.noBrief"));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : t(locale, "diag.unknownError");
      setDiagnostic(t(locale, "diag.syncFailed", { message }));
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

  const startDesign = async (input: { template: string; topic: string; details: string; materialAssetIds: string[]; narrativeSource: NarrativeSource | null }) => {
    setStatus(t(locale, "status.savingBrief"));
    const saved = await recut.background.call("project.create", input);
    setBrief(saved.value ?? saved);
    const template = catalog?.scenarios[input.template];
    const materialText = input.materialAssetIds.length
      ? t(locale, "prompt.materials", { assets: input.materialAssetIds.join("\n") })
      : "";
    const narrativeSource = input.narrativeSource;
    const narrativeSourceText = narrativeSource?.kind === "srt"
      ? t(locale, "prompt.narrativeSrt", { name: narrativeSource.name, text: narrativeSource.text })
      : narrativeSource?.kind === "videos"
        ? t(locale, "prompt.narrativeVideos", {
            videos: narrativeSource.assetIds.map((assetId, index) =>
              t(locale, "prompt.narrativeVideoItem", {
                name: narrativeSource.names[index] ?? t(locale, "prompt.unnamedVideo"),
                assetId,
              }),
            ).join("\n"),
          })
        : "";
    const detailsText = input.details ? t(locale, "prompt.details", { details: input.details }) : "";
    const prompt = t(locale, "prompt.startDesign", {
      template: input.template,
      templateLabel: template?.label ?? "",
      templateDescription: template?.description ?? "",
      topic: input.topic,
      details: detailsText,
      materials: materialText,
      narrative: narrativeSourceText,
      skill: template?.skillBody ?? "",
    });
    const composedPrompt = `${prompt}\n\n${t(locale, "prompt.videoConstraint")}`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(composedPrompt);
    } catch { /* 剪贴板不可用不影响 compose */ }
    await recut.agent.compose({ prompt: composedPrompt });
    setStatus(t(locale, "status.designSubmitted"));
  };

  const redesign = async (instruction: string | undefined) => {
    if (!brief) return;
    const prompt = t(locale, "prompt.redesign", {
      topic: brief.topic,
      instruction: instruction ?? "",
      videoConstraint: t(locale, "prompt.videoConstraint"),
    });
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(prompt);
    } catch { /* ignore */ }
    await recut.agent.compose({ prompt });
    setStatus(t(locale, "status.redesignSubmitted"));
  };

  if (!catalog) {
    return <div className="flex h-full flex-col"><header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4"><div className="flex min-w-0 items-center gap-3"><p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-primary">{t(locale, "header.eyebrow")}</p><h1 className="truncate text-sm font-semibold">{t(locale, "header.title")}</h1></div><span className="font-mono text-xs text-muted-foreground">{diagnostic}</span></header><div className="grid flex-1 place-items-center p-6"><p className="max-w-md text-center text-sm leading-6 text-muted-foreground">{diagnostic}</p></div></div>;
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4">
        <div className="flex min-w-0 items-center gap-3">
          <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-primary">{t(locale, "header.eyebrow")}</p>
          <h1 className="truncate text-sm font-semibold">{t(locale, "header.title")}</h1>
          {brief ? <span className="truncate rounded-xs bg-muted px-2 py-1 text-[11px] text-muted-foreground">{brief.topic} · {catalog.scenarios[brief.template]?.label ?? brief.template}</span> : null}
        </div>
        {brief && workspaceActions ? <div className="flex shrink-0 items-center gap-1"><Button aria-label={t(locale, "header.openWorkspaceAria")} className="px-2 text-[11px]" onClick={workspaceActions.openWorkspace} title={t(locale, "header.openWorkspaceTitle")} type="button" variant="ghost"><FolderOpen className="size-3.5" />{t(locale, "header.openFolder")}</Button><Button className="px-2 text-[11px]" onClick={workspaceActions.openExport} type="button" variant="ghost"><Download className="size-3.5" />{t(locale, "header.export")}</Button><Button className="px-2 text-[11px]" onClick={workspaceActions.buildPreview} type="button" variant="ghost"><RefreshCcw className="size-3.5" />{t(locale, "header.build")}</Button><Button className="px-2 text-[11px]" onClick={workspaceActions.restartPreview} type="button" variant="ghost"><RotateCcw className="size-3.5" />{t(locale, "header.restart")}</Button><Button className="px-2 text-[11px] text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={workspaceActions.resetWorkspace} type="button" variant="ghost"><AlertTriangle className="size-3.5" />{t(locale, "header.reset")}</Button></div> : null}
      </header>
      {!brief ? (
        <BriefForm catalog={catalog} onStart={startDesign} status={status} />
      ) : (
        <Studio assets={assets} brief={brief} catalog={catalog} mediaMap={mediaMap} onHeaderActionsChange={setWorkspaceActions} onRedesign={(instruction) => void redesign(instruction)} setStatus={setStatus} />
      )}
    </div>
  );
}
