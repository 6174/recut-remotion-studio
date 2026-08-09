/**
 * [INPUT]: 依赖项目 brief、素材状态、系统目录资源与 Player/日志/终端/导出子面板，以及按 kind 分模块的场景选择器
 * [OUTPUT]: 对外提供左预览、场景网格（打开对应场景模块生成 Prompt）、跨平台打开工作区、轻量维护工具与日志/终端分栏
 * [POS]: remotion-studio/ui 的工作面编排层；把创作决策置于首位，连接资源选择、预览、导出、终端和诊断
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  Captions,
  Clapperboard,
  Expand,
  ImagePlus,
  Sparkles,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Modal } from "./ui";
import { recut } from "./recut-sdk";
import { PlayerPanel, type PlayerPanelHandle } from "./player-panel";
import { LogPanel } from "./log-panel";
import { TerminalPanel } from "./terminal-panel";
import { ExportPanel } from "./export-panel";
import { TemplateFineTune } from "./fine-tunes/TemplateFineTune";
import { CaptionsFineTune } from "./fine-tunes/CaptionsFineTune";
import { CanvasFineTune } from "./fine-tunes/CanvasFineTune";
import { ComponentFineTune } from "./fine-tunes/ComponentFineTune";
import { DirectFineTune } from "./fine-tunes/DirectFineTune";
import { SrtFineTune } from "./fine-tunes/SrtFineTune";
import { MaterialsFineTune } from "./fine-tunes/MaterialsFineTune";
import type { FineTuneProps } from "./fine-tunes/FineTuneProps";
import type { Brief, Catalog, KitState, MediaAsset, MediaMap } from "./app";

interface StudioProps {
  assets: MediaAsset[];
  brief: Brief;
  catalog: Catalog;
  mediaMap: MediaMap;
  onRedesign: (diagnostic?: string) => void;
  setStatus: (status: string) => void;
  onHeaderActionsChange: (actions: WorkspaceActions | null) => void;
}

export interface WorkspaceActions {
  openWorkspace: () => void;
  openExport: () => void;
  buildPreview: () => void;
  restartPreview: () => void;
  resetWorkspace: () => void;
}

type FineTuneKind = "srt" | "template" | "captions" | "canvas" | "component" | "direct" | "materials";

interface FineTuneConfig {
  kind: FineTuneKind;
  title: string;
  description: string;
  basePrompt: string;
  Icon: React.FC<{ className?: string }>;
}

const FINE_TUNES: FineTuneConfig[] = [
  {
    kind: "template" as const,
    title: "选择成片模板",
    description: "重组整支视频的视觉、镜头与组件组合。",
    basePrompt: "请将当前视频改造成我选择的 Remotion 成片模板，按模板默认的视觉、场景结构、镜头顺序和组件组合重建。每个 beat 只突出一个巨大主张，禁止小字、小 tag、chip 和弱对比说明；背景、主色块、文字或光晕至少使用两层协调渐变，字幕无底框。",
    Icon: Clapperboard,
  },
  {
    kind: "captions" as const,
    title: "选择字幕风格",
    description: "为现有时间轴换一套字幕主题。",
    basePrompt: "请将当前视频的字幕替换为我选择的字幕风格，保持原有时间轴和文案不变，同时调整字号、行数、关键词强调和安全边距，确保可读性。字幕是无底框的高对比文字层，不得缩小成看不清的小字，也不能遮住主视觉。",
    Icon: Captions,
  },
  {
    kind: "canvas" as const,
    title: "适配目标画幅",
    description: "选择画布，重构移动端版式。",
    basePrompt: "请把当前视频适配为我选择的画布尺寸。重新安排安全边距、文字长度、素材裁切和信息层级，确保关键内容在该画幅下第一眼就能读清。",
    Icon: Expand,
  },
  {
    kind: "component" as const,
    title: "加入动态组件",
    description: "选择内置组件，强化一个重点段落。",
    basePrompt: "请在最能强化叙事的场景中加入我选择的内置 Remotion 组件。先阅读组件源码确认 API，只在内容需要的地方使用，并保持时间轴和视觉风格协调。",
    Icon: Sparkles,
  },
  {
    kind: "direct" as const,
    title: "重组镜头表达",
    description: "为现有内容重做镜头和转场。",
    basePrompt: "请重新编排这支视频的镜头表达：为开场建立明确钩子，中段按信息层级推进，结尾形成清晰收束。用导演语言选择镜头运动和转场，不要只是机械替换文案。用少量巨大文字分段表演主张，禁止 UI 化的小 tag；用背景、主色块、文字或光晕的协调渐变建立画面景深。",
    Icon: Clapperboard,
  },
  {
    kind: "direct" as const,
    title: "调整叙事节奏",
    description: "压缩重复信息，突出关键观点。",
    basePrompt: "请重排这支视频的叙事节奏：压缩重复信息，为关键观点留出呼吸，把每个场景的镜头时长和转场调整得更有推进感。保留选题与核心信息。",
    Icon: AlignCenter,
  },
  {
    kind: "materials" as const,
    title: "使用素材",
    description: "选择素材，再说明希望如何使用。",
    basePrompt: "",
    Icon: ImagePlus,
  },
  {
    kind: "srt" as const,
    title: "从 SRT 生成视频",
    description: "上传字幕并选择成片模板。",
    basePrompt: "请根据我上传的 SRT 字幕生成一支完整的 Remotion 视频：按字幕时间轴拆分自然段，为每段设计匹配的镜头和画面节奏，并严格使用我选择的成片模板。",
    Icon: Captions,
  },
];

const FINE_TUNE_MODULES: Partial<Record<FineTuneKind, React.FC<FineTuneProps>>> = {
  srt: SrtFineTune,
  template: TemplateFineTune,
  captions: CaptionsFineTune,
  canvas: CanvasFineTune,
  component: ComponentFineTune,
  direct: DirectFineTune,
  materials: MaterialsFineTune,
};

export function Studio({ assets, brief, catalog, mediaMap, onRedesign, setStatus, onHeaderActionsChange }: StudioProps) {
  const completed = assets.filter((item) => item.status === "completed");
  const playerRef = useRef<PlayerPanelHandle>(null);
  const resizeRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const [consoleHeight, setConsoleHeight] = useState(240);
  const [consoleTab, setConsoleTab] = useState("logs");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [fineTune, setFineTune] = useState<(FineTuneConfig & { key: number }) | null>(null);
  const [fineTunePrompt, setFineTunePrompt] = useState("");
  const [fineTuneSupplement, setFineTuneSupplement] = useState("");
  const [fineTuneReady, setFineTuneReady] = useState(true);
  const [kitState, setKitState] = useState<KitState | null>(null);

  useEffect(() => {
    recut.background.call("workspace.kit-state", {}).then(setKitState).catch(() => setKitState(null));
  }, []);

  const kitVersionHint = useMemo(() => {
    if (!kitState) return undefined;
    if (kitState.seededKitVersion && kitState.seededKitVersion !== kitState.kitVersion) {
      return `项目组件冻结于 v${kitState.seededKitVersion} · 目录 v${kitState.kitVersion}；选择后 AI 将按需升级所选组件`;
    }
    return `组件目录 v${kitState.kitVersion}`;
  }, [kitState]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const resize = resizeRef.current;
      if (!resize) return;
      setConsoleHeight(Math.min(480, Math.max(140, resize.startHeight + resize.startY - event.clientY)));
    };
    const stop = () => { resizeRef.current = null; document.body.classList.remove("is-resizing"); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
  }, []);

  useEffect(() => {
    onHeaderActionsChange({
      openWorkspace: () => {
        void recut.background.call("workspace.open", {})
          .then(() => setStatus("已在系统文件管理器中打开项目工作区。"))
          .catch((cause) => setStatus(cause instanceof Error ? cause.message : "打开项目文件夹失败"));
      },
      openExport: () => setExportOpen(true),
      buildPreview: () => void playerRef.current?.start(),
      restartPreview: () => void playerRef.current?.restart(),
      resetWorkspace: () => setResetOpen(true),
    });
    return () => onHeaderActionsChange(null);
  }, [onHeaderActionsChange]);

  const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
    resizeRef.current = { startY: event.clientY, startHeight: consoleHeight };
    document.body.classList.add("is-resizing");
  };

  const confirmReset = async () => {
    setResetting(true);
    try {
      await recut.background.call("workspace.reset", {});
      setResetOpen(false);
      setStatus("工作区已重置回骨架，正在重新启动预览…");
      await playerRef.current?.restart();
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "重置失败");
    } finally {
      setResetting(false);
    }
  };

  const finalPrompt = useMemo(() => {
    const dynamic = fineTunePrompt.trim();
    const supplement = fineTuneSupplement.trim();
    if (!supplement) return dynamic;
    return `${dynamic}\n\n补充要求：\n${supplement}`;
  }, [fineTunePrompt, fineTuneSupplement]);

  const openFineTune = (next: FineTuneConfig) => {
    const key = Date.now();
    const hasModule = Boolean(FINE_TUNE_MODULES[next.kind]);
    setFineTune({ ...next, key });
    setFineTunePrompt(hasModule ? "" : next.basePrompt);
    setFineTuneSupplement("");
    setFineTuneReady(true);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard?.writeText(finalPrompt);
      setStatus("编辑提示词已复制，可以补充后发送给 AI。");
    } catch {
      setStatus("无法访问剪贴板，请直接选择“交给 AI”。");
    }
  };

  const submitFineTune = () => {
    if (!fineTune) return;
    if (!fineTuneReady) {
      setStatus(fineTune.kind === "srt" ? "请上传一个 SRT 文件，或选择一个音视频素材。" : "请至少选择一个要使用的素材。");
      return;
    }
    const prompt = finalPrompt.trim();
    if (!prompt) {
      setStatus("请输入要交给 AI 的 Prompt。");
      return;
    }
    setFineTune(null);
    onRedesign(prompt);
  };

  return (
    <div className="flex min-h-0 flex-1 max-[1100px]:flex-col">
      <section className="min-h-0 min-w-0 flex-1 bg-terminal max-[1100px]:min-h-[24rem]">
        <PlayerPanel brief={brief} mediaMap={mediaMap} onAskAI={onRedesign} ref={playerRef} setStatus={setStatus} />
      </section>

      <aside className="flex w-96 min-h-0 shrink-0 flex-col border-l border-border bg-background max-[1100px]:w-full max-[1100px]:min-h-[30rem] max-[1100px]:border-l-0 max-[1100px]:border-t">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <section className="rounded-sm border border-primary/25 bg-primary/5 p-3">
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-primary">TEMPLATE</p><h2 className="mt-1 text-sm font-semibold">选择成片模板</h2></div>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />预览已连接</span>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">模板就是完整成片方案。选择后，Agent 会按它的导演视角重写视频的视觉、镜头与组件组合。</p>
            <Button className="mt-3 w-full" onClick={() => openFineTune(FINE_TUNES.find((item) => item.kind === "template")!)} type="button"><Clapperboard className="size-3.5" />从模板开始</Button>
          </section>

          <section className="rounded-sm border border-border bg-card p-3">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">EDIT CURRENT VIDEO</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FINE_TUNES.filter((item) => item.kind !== "template").map((item) => (
                <button className="min-h-24 rounded-xs border border-border bg-muted/20 p-2.5 text-left outline-none transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring/30" key={item.title} onClick={() => openFineTune(item)} type="button">
                  <span className="grid size-6 place-items-center rounded-xs bg-primary/10 text-primary"><item.Icon className="size-3.5" /></span>
                  <span className="mt-2 block text-xs font-semibold leading-4">{item.title}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{item.description}</span>
                </button>
              ))}
            </div>
          </section>

          <ExportPanel brief={brief} catalog={catalog} onOpenChange={setExportOpen} onRenderStarted={(renderId) => setStatus(`渲染任务 ${renderId} 已启动`)} open={exportOpen} showTrigger={false} />

        </div>

        <div className="relative shrink-0 border-t border-border bg-card" style={{ height: consoleHeight }}>
          <div aria-label="拖拽调整日志/终端高度" className="absolute inset-x-0 -top-1 z-10 h-2 cursor-ns-resize" onPointerDown={startResize} role="separator" tabIndex={0} />
          <Tabs className="h-full" onValueChange={setConsoleTab} value={consoleTab}>
            <TabsList className="justify-start">
              <TabsTrigger value="terminal">终端</TabsTrigger>
              <TabsTrigger value="logs">日志</TabsTrigger>
            </TabsList>
            <TabsContent value="terminal"><TerminalPanel /></TabsContent>
            <TabsContent value="logs"><LogPanel active={consoleTab === "logs"} /></TabsContent>
          </Tabs>
        </div>
      </aside>

      <Modal eyebrow="WORKSPACE" onClose={() => setResetOpen(false)} open={resetOpen} title="重置项目工作区？">
        <p className="text-sm leading-6 text-muted-foreground">会把项目 workspace 整体重置回 App 骨架并重新 seed（含预览/渲染所需的 Makefile、Vite 配置与工程结构）。</p>
        <p className="mt-2 rounded-xs border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">这会删除当前工作区里 AI 改写过的 composition 代码、素材登记与运行状态，且无法撤销。仅用于修复损坏/过旧的工作区。</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button disabled={resetting} onClick={() => setResetOpen(false)} type="button" variant="ghost">取消</Button>
          <Button disabled={resetting} onClick={() => void confirmReset()} type="button" variant="destructive">{resetting ? "正在重置…" : "确认重置"}</Button>
        </div>
      </Modal>

      <Modal eyebrow="AI FINE-TUNE" onClose={() => setFineTune(null)} open={fineTune !== null} title={fineTune?.title ?? "配置微调动作"} wide>
        {fineTune ? <div className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">选择要用的系统资源，自动生成 Prompt；你的补充要求单独填写，互不覆盖。</p>
          {(() => {
            const Module = FINE_TUNE_MODULES[fineTune.kind];
            if (!Module) return null;
            return <Module
              basePrompt={fineTune.basePrompt}
              brief={brief}
              catalog={catalog}
              completedAssets={completed}
              key={fineTune.key}
              kitVersionHint={kitVersionHint}
              onPrompt={setFineTunePrompt}
              onReady={setFineTuneReady}
              onStatus={setStatus}
            />;
          })()}
          <div className="border-t border-border pt-3">
            <label className="mb-1.5 block text-xs font-medium" htmlFor="fine-tune-prompt">生成的 Prompt（由选择自动生成）</label>
            <Textarea className="max-h-56 min-h-32 resize-y bg-muted/30 font-mono text-[11px] leading-5 text-foreground" id="fine-tune-prompt" readOnly value={fineTunePrompt} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" htmlFor="fine-tune-supplement">补充 Prompt（可选）</label>
            <Textarea className="max-h-48 min-h-24 resize-y bg-muted/10 text-[11px] leading-5 text-foreground" id="fine-tune-supplement" onChange={(event) => setFineTuneSupplement(event.target.value)} placeholder="补充你对这支视频的要求，如：竖屏 9:16、强调关键词、字幕放大、风格更克制等" value={fineTuneSupplement} />
          </div>
          <div className="flex justify-end gap-2 pt-1"><Button onClick={() => void copyPrompt()} type="button" variant="ghost">复制 Prompt</Button><Button onClick={submitFineTune} type="button">交给 AI</Button></div>
        </div> : null}
      </Modal>
    </div>
  );
}
