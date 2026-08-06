/**
 * [INPUT]: 依赖项目 brief、素材状态、系统目录资源与 Player/日志/终端/导出子面板
 * [OUTPUT]: 对外提供左预览、场景→参数→Prompt 的创作面、轻量维护工具与日志/终端分栏
 * [POS]: remotion-studio/ui 的工作面编排层；把创作决策置于首位，连接资源选择、预览、导出、终端和诊断
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  Captions,
  Clapperboard,
  Expand,
  ImagePlus,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Modal } from "./ui";
import { recut } from "./recut-sdk";
import { PlayerPanel, type PlayerPanelHandle } from "./player-panel";
import { LogPanel } from "./log-panel";
import { TerminalPanel } from "./terminal-panel";
import { ExportPanel } from "./export-panel";
import type { Brief, Catalog, MediaAsset, MediaMap } from "./app";

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
  openExport: () => void;
  buildPreview: () => void;
  restartPreview: () => void;
  resetWorkspace: () => void;
}

const CREATION_SCENARIOS = [
  {
    kind: "srt" as const,
    title: "从 SRT 生成视频",
    description: "上传字幕，选择模板和字幕风格。",
    prompt: "请根据我上传的 SRT 字幕生成一支完整的 Remotion 视频：按字幕时间轴拆分自然段，为每段设计匹配的镜头和画面节奏，并使用我选择的视觉模板与字幕风格。",
    Icon: Captions,
  },
  {
    kind: "template" as const,
    title: "选择视觉模板",
    description: "换一套色彩、排版和动效语言。",
    prompt: "请将当前视频改造成我选择的 Remotion 视觉模板，并统一更新色彩、字体层级、背景特效和转场。保留当前内容与时间轴。",
    Icon: Sparkles,
  },
  {
    kind: "captions" as const,
    title: "选择字幕风格",
    description: "为现有时间轴换一套字幕主题。",
    prompt: "请将当前视频的字幕替换为我选择的字幕风格，保持原有时间轴和文案不变，同时调整字号、行数、关键词强调和安全边距，确保可读性。",
    Icon: Captions,
  },
  {
    kind: "canvas" as const,
    title: "适配目标画幅",
    description: "选择画布，重构移动端版式。",
    prompt: "请把当前视频适配为我选择的画布尺寸。重新安排安全边距、文字长度、素材裁切和信息层级，确保关键内容在该画幅下第一眼就能读清。",
    Icon: Expand,
  },
  {
    kind: "component" as const,
    title: "加入动态组件",
    description: "选择内置组件，强化一个重点段落。",
    prompt: "请在最能强化叙事的场景中加入我选择的内置 Remotion 组件。先阅读组件源码确认 API，只在内容需要的地方使用，并保持时间轴和视觉风格协调。",
    Icon: Sparkles,
  },
  {
    kind: "direct" as const,
    title: "重组镜头表达",
    description: "为现有内容重做镜头和转场。",
    prompt: "请重新编排这支视频的镜头表达：为开场建立明确钩子，中段按信息层级推进，结尾形成清晰收束。用导演语言选择镜头运动和转场，不要只是机械替换文案。",
    Icon: Clapperboard,
  },
  {
    kind: "direct" as const,
    title: "调整叙事节奏",
    description: "压缩重复信息，突出关键观点。",
    prompt: "请重排这支视频的叙事节奏：压缩重复信息，为关键观点留出呼吸，把每个场景的镜头时长和转场调整得更有推进感。保留选题与核心信息。",
    Icon: AlignCenter,
  },
  {
    kind: "materials" as const,
    title: "用素材重剪",
    description: "选择素材，重做镜头和叙事节奏。",
    prompt: "请围绕我选择的素材重剪这支视频：先审视每段素材最有价值的信息，再把它们安排到最能支撑叙事的场景。使用 resolveMediaUrl(assetId) 引用真实素材，并用 composition.assets 登记所有 assetId；没有合适素材的位置保留干净的程序化视觉。",
    Icon: ImagePlus,
  },
] as const;

const selectClass = "h-8 w-full rounded-xs border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";
const COMPONENT_OPTIONS = [
  { id: "PageCam", label: "PageCam", description: "页面镜头与相机运动", path: "workspace/src/components/shotcraft/PageCam.tsx" },
  { id: "DigitRoll", label: "DigitRoll", description: "数字滚动强调", path: "workspace/src/components/shotcraft/DigitRoll.tsx" },
  { id: "VerticalTicker", label: "VerticalTicker", description: "纵向信息流", path: "workspace/src/components/shotcraft/VerticalTicker.tsx" },
  { id: "FlashCut", label: "FlashCut", description: "闪切与节奏转场", path: "workspace/src/components/shotcraft/FlashCut.tsx" },
  { id: "FlatPanel", label: "FlatPanel", description: "扁平信息面板", path: "workspace/src/components/shotcraft/FlatPanel.tsx" },
] as const;

export function Studio({ assets, brief, catalog, mediaMap, onRedesign, setStatus, onHeaderActionsChange }: StudioProps) {
  const completed = assets.filter((item) => item.status === "completed");
  const playerRef = useRef<PlayerPanelHandle>(null);
  const resizeRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const [consoleHeight, setConsoleHeight] = useState(240);
  const [consoleTab, setConsoleTab] = useState("logs");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [scenario, setScenario] = useState<(typeof CREATION_SCENARIOS)[number] | null>(null);
  const [scenarioTemplate, setScenarioTemplate] = useState("");
  const [scenarioCaption, setScenarioCaption] = useState("");
  const [scenarioCanvas, setScenarioCanvas] = useState("");
  const [scenarioComponent, setScenarioComponent] = useState(COMPONENT_OPTIONS[0].id);
  const [scenarioAssets, setScenarioAssets] = useState<MediaAsset[]>([]);
  const [srtSourceAsset, setSrtSourceAsset] = useState<MediaAsset | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [srtText, setSrtText] = useState("");

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

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard?.writeText(prompt);
      setStatus("编辑提示词已复制，可以补充后发送给 AI。");
    } catch {
      setStatus("无法访问剪贴板，请直接选择“交给 AI”。");
    }
  };

  const openScenario = (next: (typeof CREATION_SCENARIOS)[number]) => {
    setScenario(next);
    setScenarioTemplate(brief.template || Object.keys(catalog.styleTemplates)[0] || "");
    setScenarioCaption(catalog.captionThemes[0]?.id || "");
    setScenarioCanvas(catalog.canvasSizes[0]?.id || "");
    setScenarioComponent(COMPONENT_OPTIONS[0].id);
    setScenarioAssets([]);
    setSrtSourceAsset(null);
    setSrtFile(null);
    setSrtText("");
  };

  const buildScenarioPrompt = () => {
    if (!scenario) return;
    let prompt = scenario.prompt;
    if (scenario.kind === "template") {
      const selected = catalog.styleTemplates[scenarioTemplate];
      prompt += `\n\n视觉模板：${scenarioTemplate}（${selected?.label ?? ""}；${selected?.description ?? ""}；${selected?.motion ?? ""}）`;
    }
    if (scenario.kind === "captions") {
      const selected = catalog.captionThemes.find((item) => item.id === scenarioCaption);
      prompt += `\n\n字幕风格：${scenarioCaption}（${selected?.label ?? ""}；${selected?.description ?? ""}）`;
    }
    if (scenario.kind === "srt") {
      const selectedTemplate = catalog.styleTemplates[scenarioTemplate];
      const selectedCaption = catalog.captionThemes.find((item) => item.id === scenarioCaption);
      const sourceText = srtSourceAsset ? `\n字幕来源素材：${srtSourceAsset.name}（${srtSourceAsset.kind}，assetId: ${srtSourceAsset.id}）\n请先从该素材转录生成 SRT，再按时间轴构建视频，并在 composition.assets 中登记它。` : "";
      prompt += `\n\n视觉模板：${selectedTemplate?.label ?? scenarioTemplate}\n字幕风格：${selectedCaption?.label ?? scenarioCaption}${srtText.trim() ? `\nSRT 文件：${srtFile?.name ?? "未命名.srt"}\n\nSRT 内容：\n${srtText.slice(0, 16000)}` : sourceText || "\n请上传 .srt 文件或选择一个音视频素材。"}`;
    }
    if (scenario.kind === "canvas") {
      const selected = catalog.canvasSizes.find((item) => item.id === scenarioCanvas);
      prompt += `\n\n目标画布：${selected?.label ?? scenarioCanvas}（${selected?.width ?? ""}×${selected?.height ?? ""}，${selected?.fps ?? ""} fps）`;
    }
    if (scenario.kind === "component") {
      const selected = COMPONENT_OPTIONS.find((item) => item.id === scenarioComponent);
      prompt += `\n\n组件：${selected?.label ?? scenarioComponent}（${selected?.description ?? ""}）\n组件源码：${selected?.path ?? ""}`;
    }
    if (scenario.kind === "materials") {
      prompt += `\n\n优先使用以下素材：\n${scenarioAssets.map((asset) => `- ${asset.name}（${asset.kind}，assetId: ${asset.id}）`).join("\n")}`;
    }
    return prompt;
  };

  const submitScenario = () => {
    if (scenario?.kind === "srt" && !srtText.trim() && !srtSourceAsset) {
      setStatus("请上传一个 SRT 文件，或选择一个音视频素材。");
      return;
    }
    if (scenario?.kind === "materials" && scenarioAssets.length === 0) {
      setStatus("请至少选择一个用于重剪的素材。");
      return;
    }
    const prompt = buildScenarioPrompt();
    if (!prompt) return;
    setScenario(null);
    onRedesign(prompt);
  };

  const pickScenarioMaterials = async () => {
    try {
      const selection = await recut.media.pick({ kinds: ["image", "video", "audio"], multiple: true });
      if (!selection) return;
      const picked = Array.isArray(selection) ? selection : [selection];
      setScenarioAssets(picked.map((item) => ({ id: item.id, kind: item.kind as MediaAsset["kind"], name: item.name, status: "completed" })));
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "素材选择失败");
    }
  };

  const pickSrtSource = async () => {
    try {
      const selection = await recut.media.pick({ kinds: ["video", "audio"], multiple: false, selectedIDs: srtSourceAsset ? [srtSourceAsset.id] : undefined });
      if (!selection) return;
      const picked = Array.isArray(selection) ? selection[0] : selection;
      setSrtSourceAsset({ id: picked.id, kind: picked.kind as MediaAsset["kind"], name: picked.name, status: "completed" });
      setSrtFile(null);
      setSrtText("");
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "素材选择失败");
    }
  };

  const toggleScenarioAsset = (asset: MediaAsset) => {
    setScenarioAssets((current) => current.some((item) => item.id === asset.id) ? current.filter((item) => item.id !== asset.id) : [...current, asset]);
  };

  return (
    <div className="flex min-h-0 flex-1 max-[1100px]:flex-col">
      <section className="min-h-0 min-w-0 flex-1 bg-terminal max-[1100px]:min-h-[24rem]">
        <PlayerPanel brief={brief} mediaMap={mediaMap} onAskAI={onRedesign} ref={playerRef} setStatus={setStatus} />
      </section>

      <aside className="flex w-96 min-h-0 shrink-0 flex-col border-l border-border bg-background max-[1100px]:w-full max-[1100px]:min-h-[30rem] max-[1100px]:border-l-0 max-[1100px]:border-t">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <section className="rounded-sm border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-primary">CREATE</p><h2 className="mt-1 text-sm font-semibold">从一个创作场景开始</h2></div>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />预览已连接</span>
            </div>
            <Button className="mt-3 w-full" onClick={() => onRedesign("请先阅读当前 workspace 代码，然后询问我希望如何调整这支视频。不要改动代码，直到我给出明确的编辑要求。")} type="button"><MessageCircle className="size-3.5" />自由创作</Button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CREATION_SCENARIOS.map((item) => (
                <button className="min-h-24 rounded-xs border border-border bg-muted/20 p-2.5 text-left outline-none transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring/30" key={item.title} onClick={() => openScenario(item)} type="button">
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

      <Modal eyebrow="AI EDITING" onClose={() => setScenario(null)} open={scenario !== null} title={scenario?.title ?? "配置编辑场景"}>
        {scenario ? <div className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">选择要用的系统资源，生成一个完整 Prompt；你可以先复制修改，也可以直接交给 Agent。</p>
          {(scenario.kind === "template" || scenario.kind === "srt") ? <label className="block"><span className="mb-1.5 block text-xs font-medium">视觉模板</span><select className={selectClass} onChange={(event) => setScenarioTemplate(event.target.value)} value={scenarioTemplate}>{Object.entries(catalog.styleTemplates).map(([id, item]) => <option key={id} value={id}>{item.label} · {item.description}</option>)}</select></label> : null}
          {(scenario.kind === "captions" || scenario.kind === "srt") ? <label className="block"><span className="mb-1.5 block text-xs font-medium">字幕风格</span><select className={selectClass} onChange={(event) => setScenarioCaption(event.target.value)} value={scenarioCaption}>{catalog.captionThemes.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.description}</option>)}</select></label> : null}
          {scenario.kind === "canvas" ? <label className="block"><span className="mb-1.5 block text-xs font-medium">目标画布</span><select className={selectClass} onChange={(event) => setScenarioCanvas(event.target.value)} value={scenarioCanvas}>{catalog.canvasSizes.map((item) => <option key={item.id} value={item.id}>{item.label}（{item.width}×{item.height} · {item.fps} fps）</option>)}</select></label> : null}
          {scenario.kind === "component" ? <label className="block"><span className="mb-1.5 block text-xs font-medium">内置组件</span><select className={selectClass} onChange={(event) => setScenarioComponent(event.target.value)} value={scenarioComponent}>{COMPONENT_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.description}</option>)}</select></label> : null}
          {scenario.kind === "srt" ? <div className="space-y-3"><label className="block"><span className="mb-1.5 block text-xs font-medium">上传 SRT 字幕文件</span><Input accept=".srt,.vtt,text/plain" onChange={(event) => { const file = event.target.files?.[0] ?? null; setSrtFile(file); setSrtSourceAsset(null); setSrtText(""); if (file) void file.text().then(setSrtText).catch(() => setStatus("字幕文件读取失败，请更换后重试。")); }} type="file" />{srtFile ? <p className="mt-1.5 text-xs text-muted-foreground">已选择：{srtFile.name}</p> : <p className="mt-1.5 text-xs text-muted-foreground">上传后会把字幕时间轴交给 Agent，用于拆分场景。</p>}</label><div className="border-t border-border pt-3"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium">或者从 assets 选择音视频</span><Button className="px-2 text-[11px]" onClick={() => void pickSrtSource()} type="button" variant="outline">从素材库选择</Button></div>{completed.filter((asset) => asset.kind === "video" || asset.kind === "audio").length > 0 ? <div className="mt-2 space-y-1.5">{completed.filter((asset) => asset.kind === "video" || asset.kind === "audio").map((asset) => <button className={`flex w-full items-center gap-2 rounded-xs border p-2 text-left text-xs outline-none ${srtSourceAsset?.id === asset.id ? "border-primary bg-primary/5" : "border-border bg-muted/20"}`} key={asset.id} onClick={() => { setSrtSourceAsset(asset); setSrtFile(null); setSrtText(""); }} type="button"><span className="min-w-0 flex-1 truncate">{asset.name}</span><span className="font-mono text-[10px] text-muted-foreground">{asset.kind}</span></button>)}</div> : <p className="mt-2 text-xs leading-5 text-muted-foreground">项目内没有音视频素材；可从素材库选择。</p>}{srtSourceAsset ? <p className="mt-2 text-xs text-muted-foreground">已选择：{srtSourceAsset.name}。Agent 会先转录为 SRT。</p> : null}</div></div> : null}
          {scenario.kind === "materials" ? <div><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium">用于重剪的素材</span><Button className="px-2 text-[11px]" onClick={() => void pickScenarioMaterials()} type="button" variant="outline">从素材库选择</Button></div>{completed.length > 0 ? <div className="mt-2 space-y-1.5">{completed.map((asset) => <label className="flex cursor-pointer items-center gap-2 rounded-xs border border-border bg-muted/20 p-2" key={asset.id}><input checked={scenarioAssets.some((item) => item.id === asset.id)} className="accent-[var(--primary)]" onChange={() => toggleScenarioAsset(asset)} type="checkbox" /><span className="min-w-0 flex-1 truncate text-xs">{asset.name}</span><span className="font-mono text-[10px] text-muted-foreground">{asset.kind}</span></label>)}</div> : <p className="mt-2 text-xs leading-5 text-muted-foreground">项目内还没有可用素材。请从素材库选择，或先上传/生成素材。</p>}{scenarioAssets.some((asset) => !completed.some((item) => item.id === asset.id)) ? <p className="mt-2 text-xs text-muted-foreground">已从素材库选择 {scenarioAssets.filter((asset) => !completed.some((item) => item.id === asset.id)).length} 个素材。</p> : null}</div> : null}
          <div><span className="mb-1.5 block text-xs font-medium">生成的 Prompt</span><p className="max-h-40 overflow-y-auto rounded-xs border border-border bg-muted/30 p-2 text-[11px] leading-5 text-muted-foreground whitespace-pre-wrap">{buildScenarioPrompt()}</p></div>
          <div className="flex justify-end gap-2 pt-1"><Button onClick={() => void copyPrompt(buildScenarioPrompt() ?? "")} type="button" variant="ghost">复制 Prompt</Button><Button onClick={submitScenario} type="button">交给 AI</Button></div>
        </div> : null}
      </Modal>
    </div>
  );
}
