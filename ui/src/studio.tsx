/**
 * [INPUT]: 依赖项目 brief、素材状态、系统目录资源与 Player/日志/终端/导出子面板，以及按 kind 分模块的场景选择器
 * [OUTPUT]: 对外提供左预览、场景网格（打开对应场景模块生成 Prompt）、按模块能力门禁的提交、跨平台打开工作区、轻量维护工具与日志/终端分栏
 * [POS]: remotion-studio/ui 的工作面编排层；把创作决策置于首位，连接资源选择、预览、导出、终端和诊断
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Captions,
  Clapperboard,
  Expand,
  ImagePlus,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Modal } from "./ui";
import { recut, useRecutLocale } from "./recut-sdk";
import { t } from "./i18n";
import { PlayerPanel, type PlayerPanelHandle } from "./player-panel";
import { LogPanel } from "./log-panel";
import { TerminalPanel } from "./terminal-panel";
import { ExportPanel } from "./export-panel";
import { TemplateFineTune } from "./fine-tunes/TemplateFineTune";
import { CaptionsFineTune } from "./fine-tunes/CaptionsFineTune";
import { CanvasFineTune } from "./fine-tunes/CanvasFineTune";
import { ComponentFineTune } from "./fine-tunes/ComponentFineTune";
import { EffectsFineTune } from "./fine-tunes/EffectsFineTune";
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

type FineTuneKind = "template" | "captions" | "canvas" | "component" | "materials" | "effects";

interface FineTuneConfig {
  kind: FineTuneKind;
  titleKey: string;
  descriptionKey: string;
  basePromptKey: string;
  Icon: React.FC<{ className?: string }>;
}

const FINE_TUNES: FineTuneConfig[] = [
  {
    kind: "effects" as const,
    titleKey: "fineTune.effects.title",
    descriptionKey: "fineTune.effects.description",
    basePromptKey: "fineTune.effects.basePrompt",
    Icon: MousePointer2,
  },
  {
    kind: "component" as const,
    titleKey: "fineTune.component.title",
    descriptionKey: "fineTune.component.description",
    basePromptKey: "fineTune.component.basePrompt",
    Icon: Sparkles,
  },
  {
    kind: "materials" as const,
    titleKey: "fineTune.materials.title",
    descriptionKey: "fineTune.materials.description",
    basePromptKey: "fineTune.materials.basePrompt",
    Icon: ImagePlus,
  },
  {
    kind: "template" as const,
    titleKey: "fineTune.template.title",
    descriptionKey: "fineTune.template.description",
    basePromptKey: "fineTune.template.basePrompt",
    Icon: Clapperboard,
  },
  {
    kind: "captions" as const,
    titleKey: "fineTune.captions.title",
    descriptionKey: "fineTune.captions.description",
    basePromptKey: "fineTune.captions.basePrompt",
    Icon: Captions,
  },
  {
    kind: "canvas" as const,
    titleKey: "fineTune.canvas.title",
    descriptionKey: "fineTune.canvas.description",
    basePromptKey: "fineTune.canvas.basePrompt",
    Icon: Expand,
  },
];

const FINE_TUNE_MODULES: Partial<Record<FineTuneKind, React.FC<FineTuneProps>>> = {
  template: TemplateFineTune,
  captions: CaptionsFineTune,
  canvas: CanvasFineTune,
  component: ComponentFineTune,
  effects: EffectsFineTune,
  materials: MaterialsFineTune,
};

export function Studio({ assets, brief, catalog, mediaMap, onRedesign, setStatus, onHeaderActionsChange }: StudioProps) {
  const locale = useRecutLocale();
  const fineTunes = useMemo<Array<FineTuneConfig & { title: string; description: string; basePrompt: string }>>(
    () => FINE_TUNES.map((item) => ({ ...item, title: t(locale, item.titleKey), description: t(locale, item.descriptionKey), basePrompt: t(locale, item.basePromptKey) })),
    [locale],
  );
  const completed = assets.filter((item) => item.status === "completed");
  const playerRef = useRef<PlayerPanelHandle>(null);
  const resizeRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const [consoleHeight, setConsoleHeight] = useState(240);
  const [consoleTab, setConsoleTab] = useState("logs");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [fineTune, setFineTune] = useState<(FineTuneConfig & { title: string; description: string; basePrompt: string; key: number }) | null>(null);
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
      return t(locale, "kit.hintFrozen", { seeded: kitState.seededKitVersion, kit: kitState.kitVersion });
    }
    return t(locale, "kit.hintVersion", { kit: kitState.kitVersion });
  }, [kitState, locale]);

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
          .then(() => setStatus(t(locale, "studio.openWorkspaceDone")))
          .catch((cause) => setStatus(cause instanceof Error ? cause.message : t(locale, "studio.openWorkspaceFailed")));
      },
      openExport: () => setExportOpen(true),
      buildPreview: () => void playerRef.current?.start(),
      restartPreview: () => void playerRef.current?.restart(),
      resetWorkspace: () => setResetOpen(true),
    });
    return () => onHeaderActionsChange(null);
  }, [onHeaderActionsChange, locale]);

  const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
    resizeRef.current = { startY: event.clientY, startHeight: consoleHeight };
    document.body.classList.add("is-resizing");
  };

  const confirmReset = async () => {
    setResetting(true);
    try {
      await recut.background.call("workspace.reset", {});
      setResetOpen(false);
      setStatus(t(locale, "studio.resetStatus"));
      await playerRef.current?.restart();
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : t(locale, "studio.resetFailed"));
    } finally {
      setResetting(false);
    }
  };

  const finalPrompt = useMemo(() => {
    const dynamic = fineTunePrompt.trim();
    const supplement = fineTuneSupplement.trim();
    if (!supplement) return dynamic;
    return t(locale, "prompt.supplement", { supplement });
  }, [fineTunePrompt, fineTuneSupplement, locale]);

  const openFineTune = (next: FineTuneConfig & { title: string; description: string; basePrompt: string }) => {
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
      setStatus(t(locale, "studio.promptCopied"));
    } catch {
      setStatus(t(locale, "studio.promptCopyFailed"));
    }
  };

  const submitFineTune = () => {
    if (!fineTune) return;
    if (!fineTuneReady) {
      setStatus(t(locale, "studio.needMaterial"));
      return;
    }
    const prompt = finalPrompt.trim();
    if (!prompt) {
      setStatus(t(locale, "studio.needPrompt"));
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
              <div><p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-primary">TEMPLATE</p><h2 className="mt-1 text-sm font-semibold">{t(locale, "studio.templateTitle")}</h2></div>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />{t(locale, "studio.previewConnected")}</span>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{t(locale, "studio.templateDescription")}</p>
            <Button className="mt-3 w-full" onClick={() => openFineTune(fineTunes.find((item) => item.kind === "template")!)} type="button"><Clapperboard className="size-3.5" />{t(locale, "studio.startFromTemplate")}</Button>
          </section>

          <section className="rounded-sm border border-border bg-card p-3">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">EDIT CURRENT VIDEO</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {fineTunes.filter((item) => item.kind !== "template").map((item) => (
                <button className="min-h-24 rounded-xs border border-border bg-muted/20 p-2.5 text-left outline-none transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring/30" key={item.title} onClick={() => openFineTune(item)} type="button">
                  <span className="grid size-6 place-items-center rounded-xs bg-primary/10 text-primary"><item.Icon className="size-3.5" /></span>
                  <span className="mt-2 block text-xs font-semibold leading-4">{item.title}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{item.description}</span>
                </button>
              ))}
            </div>
          </section>

          <ExportPanel brief={brief} catalog={catalog} onOpenChange={setExportOpen} onRenderStarted={(renderId) => setStatus(t(locale, "studio.renderStarted", { renderId }))} open={exportOpen} showTrigger={false} />

        </div>

        <div className="relative shrink-0 border-t border-border bg-card" style={{ height: consoleHeight }}>
          <div aria-label={t(locale, "studio.resizeAria")} className="absolute inset-x-0 -top-1 z-10 h-2 cursor-ns-resize" onPointerDown={startResize} role="separator" tabIndex={0} />
          <Tabs className="h-full" onValueChange={setConsoleTab} value={consoleTab}>
            <TabsList className="justify-start">
              <TabsTrigger value="terminal">{t(locale, "studio.tabTerminal")}</TabsTrigger>
              <TabsTrigger value="logs">{t(locale, "studio.tabLogs")}</TabsTrigger>
            </TabsList>
            <TabsContent value="terminal"><TerminalPanel active={consoleTab === "terminal"} /></TabsContent>
            <TabsContent value="logs"><LogPanel active={consoleTab === "logs"} /></TabsContent>
          </Tabs>
        </div>
      </aside>

      <Modal eyebrow="WORKSPACE" onClose={() => setResetOpen(false)} open={resetOpen} title={t(locale, "studio.resetModalTitle")}>
        <p className="text-sm leading-6 text-muted-foreground">{t(locale, "studio.resetModalBody1")}</p>
        <p className="mt-2 rounded-xs border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">{t(locale, "studio.resetModalBody2")}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button disabled={resetting} onClick={() => setResetOpen(false)} type="button" variant="ghost">{t(locale, "studio.cancel")}</Button>
          <Button disabled={resetting} onClick={() => void confirmReset()} type="button" variant="destructive">{resetting ? t(locale, "studio.resetting") : t(locale, "studio.confirmReset")}</Button>
        </div>
      </Modal>

      <Modal eyebrow="AI FINE-TUNE" onClose={() => setFineTune(null)} open={fineTune !== null} title={fineTune?.title ?? t(locale, "studio.fineTuneModalTitle")} wide>
        {fineTune ? <div className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">{t(locale, "studio.fineTuneModalBody")}</p>
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
            <label className="mb-1.5 block text-xs font-medium" htmlFor="fine-tune-prompt">{t(locale, "studio.fineTunePromptLabel")}</label>
            <Textarea className="max-h-56 min-h-32 resize-y bg-muted/30 font-mono text-[11px] leading-5 text-foreground" id="fine-tune-prompt" readOnly value={fineTunePrompt} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" htmlFor="fine-tune-supplement">{t(locale, "studio.fineTuneSupplementLabel")}</label>
            <Textarea className="max-h-48 min-h-24 resize-y bg-muted/10 text-[11px] leading-5 text-foreground" id="fine-tune-supplement" onChange={(event) => setFineTuneSupplement(event.target.value)} placeholder={t(locale, "prompt.fineTuneSupplementPlaceholder")} value={fineTuneSupplement} />
          </div>
          <div className="flex justify-end gap-2 pt-1"><Button onClick={() => void copyPrompt()} type="button" variant="ghost">{t(locale, "studio.copyPrompt")}</Button><Button disabled={!fineTuneReady} onClick={submitFineTune} type="button">{t(locale, "studio.submitToAI")}</Button></div>
        </div> : null}
      </Modal>
    </div>
  );
}
