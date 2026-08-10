/**
 * [INPUT]: 依赖 effects 目录、preview/PreviewCard、BrowserCapabilityGate/useHtmlInCanvasSupport 与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 EffectsFineTune：特效选择器（按表达目的分组）+ 关键帧 Player 预览 +
 *           位置编辑器 + 可编辑 Prompt；HTML-in-Canvas 预览和提交同样过 BrowserCapabilityGate
 * [POS]: remotion-studio/ui/fine-tunes 的镜头层微调动作。组件回答“画面里有什么”，
 *        特效回答“观众如何感受、注意和理解它”；放置是语义选择，不伪造 DOM selector。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { LivePreview } from "../preview/PreviewCard";
import { BrowserCapabilityGate, useHtmlInCanvasSupport } from "@recut/remotion-kit";
import type { FineTuneProps } from "./FineTuneProps";

const LAYER_GROUPS: Array<{ key: string; label: string }> = [
  { key: "interaction", label: "模拟交互" },
  { key: "content", label: "聚焦内容" },
  { key: "transition", label: "场景节奏" },
  { key: "background", label: "氛围背景" },
];

const GESTURES = ["move", "hover", "click", "drag", "scroll"] as const;
const SCENE_PHASES = ["scene-enter", "scene-play", "scene-exit", "background"] as const;

type PlacementMode = "agent" | "scene" | "connect" | "target" | "interaction";

export const EffectsFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, onPrompt, onReady }) => {
  const capability = useHtmlInCanvasSupport();
  const effects = catalog.effects ?? [];
  const [value, setValue] = useState(effects[0]?.id ?? "");
  const [hovered, setHovered] = useState<string | null>(null);
  const active = effects.find((item) => item.id === (hovered ?? value)) ?? effects[0];
  const requiresTransitionAdapter = active?.id === "scene-transition";
  const [placement, setPlacement] = useState<PlacementMode>("agent");
  const [sceneId, setSceneId] = useState("");
  const [phase, setPhase] = useState<(typeof SCENE_PHASES)[number]>("scene-play");
  const [fromScene, setFromScene] = useState("");
  const [toScene, setToScene] = useState("");
  const [targetDesc, setTargetDesc] = useState("");
  const [gesture, setGesture] = useState<(typeof GESTURES)[number]>("click");
  const [intensity, setIntensity] = useState(0.75);
  const [durationFrames, setDurationFrames] = useState<number>(active?.prompt?.recommendedDurationFrames ?? 90);

  useEffect(() => {
    setDurationFrames(active?.prompt?.recommendedDurationFrames ?? 90);
  }, [active?.id, active?.prompt?.recommendedDurationFrames]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof effects>();
    for (const item of effects) {
      const key = LAYER_GROUPS.find((g) => g.key === item.layer)?.label ?? item.layer;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [effects]);

  const placementText = useMemo(() => {
    switch (placement) {
      case "scene":
        return `放置位置：指定场景“${sceneId || "（待定）"}”的 ${phase}。`;
      case "connect":
        return `放置位置：连接场景“${fromScene || "（前）"}”与“${toScene || "（后）"}”的 between-scenes 转场。`;
      case "target":
        return `内容目标：${targetDesc || "（待补充自然语言描述）"}；请先读 SCENES 与 StagePlan，将其转为 scene-owned FocusTarget/Rect[]，并在回复中回报坐标与理由。`;
      case "interaction":
        return `指定互动：${gesture} 手势，发生时间由 Agent 按叙事节奏分配；CursorDirector 与目标效果共用同一 InteractionScript。`;
      case "agent":
      default:
        return "放置位置：Agent 决定最佳位置——先读 SCENES、StagePlan 与场景代码，选择叙事最需要的位置并解释原因。";
    }
  }, [placement, sceneId, phase, fromScene, toScene, targetDesc, gesture]);

  const prompt = useMemo(() => {
    if (!active) return "";
    return [
      basePrompt || "请把当前视频的表达增强为我选择的镜头层效果。",
      `特效：${active.label}（${active.description}）`,
      `引擎：${active.engine}（requires: ${active.requires.join("、")}）· 层级：${active.layer} · 意图：${active.intent}`,
      `推荐源码：${active.source.path}（项目落点 ${active.source.workspacePath}；改 composition 的 StagePlan 与必要场景代码，禁止粘贴独立 demo）`,
      placementText,
      `参数：时长 ${durationFrames} 帧 · 强度 ${Math.round(intensity * 100)}%`,
      "HTML-in-Canvas 硬约束：优先复用 @recut/remotion-kit/html-canvas，先写 InteractionScript 与 EffectClip 再写 JSX；坐标使用设计像素，禁止真实 pointer 事件回放；不嵌套 HtmlInCanvas；不支持时不降级。",
      "验收：预览与导出均走原生 HTML-in-Canvas 路径，目标几何可审阅，相同输入重复导出逐帧一致。",
    ].join("\n");
  }, [active, basePrompt, placementText, durationFrames, intensity]);

  useEffect(() => {
    onPrompt(prompt);
    // 原生 capture 不可用时，不能让 Agent 写出一个必然无法在 Player/renderer 验收的 StagePlan。
    onReady(capability.status === "supported" && !requiresTransitionAdapter);
  }, [capability.status, onPrompt, onReady, prompt, requiresTransitionAdapter]);

  if (effects.length === 0) {
    return <p className="text-xs text-muted-foreground">目录中暂无可用的镜头层效果。</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid min-h-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 max-md:grid-cols-1">
        <div className="max-h-[320px] min-h-0 space-y-2 overflow-y-auto rounded-xs border border-border bg-muted/10 p-2 pr-1">
          {groups.map(([label, list]) => (
            <div key={label}>
              <p className="px-1 pb-1 pt-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">{label}</p>
              <div className="space-y-1">
                {list.map((item) => {
                  const selected = item.id === value;
                  return (
                    <button
                      className={`flex w-full items-center gap-2 rounded-xs border p-2 text-left text-xs outline-none ${selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
                      key={item.id}
                      onFocus={() => setHovered(item.id)}
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered((current) => (current === item.id ? null : current))}
                      onClick={() => setValue(item.id)}
                      type="button"
                    >
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {selected ? <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-0 space-y-2">
          {requiresTransitionAdapter ? (
            <div className="grid h-80 place-items-center rounded-xs border border-dashed border-border bg-muted/10 p-6 text-center text-xs leading-5 text-muted-foreground">
              PageTurn / Peel 需要 root-level A/B texture 转场适配器；单输入 HtmlCanvasVideoStage 不会伪造或提交这个效果。
            </div>
          ) : (
            <BrowserCapabilityGate>
              <LivePreview
                key={`effect:${active?.id}`}
                autoPlay={false}
                height={320}
                initialFrame={72}
                showControls
                spec={{ id: active?.id ?? "", kind: "effect" }}
              />
            </BrowserCapabilityGate>
          )}
          {capability.status === "unsupported" ? <p className="text-[10px] leading-4 text-destructive">平台能力未就绪，已阻止提交该镜头层 Prompt。</p> : null}
          {requiresTransitionAdapter ? <p className="text-[10px] leading-4 text-destructive">该转场适配器尚未接入，已阻止提交，避免生成必然白屏的单输入 StagePlan。</p> : null}
          <p className="flex items-center gap-2 text-xs font-semibold">
            <span className="truncate">{active?.label}</span>
            <span className="min-w-0 flex-1 truncate text-[10px] font-normal text-muted-foreground">{active?.description}</span>
          </p>
          <p className="flex flex-wrap gap-1 text-[10px] leading-4 text-muted-foreground">
            {active?.placement.map((p) => <span className="rounded-sm border border-border bg-muted/20 px-1.5 py-0.5" key={p}>{p}</span>)}
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-xs border border-border bg-muted/10 p-3">
        <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">放置位置 · 语义选择</p>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            ["agent", "Agent 决定"],
            ["scene", "指定场景"],
            ["connect", "连接两场景"],
            ["target", "指定内容目标"],
            ["interaction", "指定互动"],
          ] as Array<[PlacementMode, string]>).map(([mode, label]) => (
            <button
              className={`rounded-xs border px-2 py-1.5 text-left text-[11px] outline-none ${placement === mode ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/40"}`}
              key={mode}
              onClick={() => setPlacement(mode)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {placement === "scene" ? (
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[10px] text-muted-foreground">场景 id（如 hook / feature-1）</span>
              <input className="h-8 w-full rounded-xs border border-border bg-card px-2 text-xs outline-none focus:border-primary/40" onChange={(e) => setSceneId(e.target.value)} placeholder="feature-1" value={sceneId} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] text-muted-foreground">放置阶段</span>
              <select className="h-8 w-full rounded-xs border border-border bg-card px-2 text-xs outline-none focus:border-primary/40" onChange={(e) => setPhase(e.target.value as (typeof SCENE_PHASES)[number])} value={phase}>
                {SCENE_PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>
        ) : null}

        {placement === "connect" ? (
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[10px] text-muted-foreground">前一个场景 id</span>
              <input className="h-8 w-full rounded-xs border border-border bg-card px-2 text-xs outline-none focus:border-primary/40" onChange={(e) => setFromScene(e.target.value)} placeholder="hook" value={fromScene} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] text-muted-foreground">后一个场景 id</span>
              <input className="h-8 w-full rounded-xs border border-border bg-card px-2 text-xs outline-none focus:border-primary/40" onChange={(e) => setToScene(e.target.value)} placeholder="pain" value={toScene} />
            </label>
          </div>
        ) : null}

        {placement === "target" ? (
          <label className="block">
            <span className="mb-1 block text-[10px] text-muted-foreground">用自然语言说明目标，如“设置页右上角的导出按钮”</span>
            <input className="h-8 w-full rounded-xs border border-border bg-card px-2 text-xs outline-none focus:border-primary/40" onChange={(e) => setTargetDesc(e.target.value)} placeholder="第二段标题中的关键词“一键自动化”" value={targetDesc} />
          </label>
        ) : null}

        {placement === "interaction" ? (
          <label className="block">
            <span className="mb-1 block text-[10px] text-muted-foreground">选择手势</span>
            <select className="h-8 w-full rounded-xs border border-border bg-card px-2 text-xs outline-none focus:border-primary/40" onChange={(e) => setGesture(e.target.value as (typeof GESTURES)[number])} value={gesture}>
              {GESTURES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
        ) : null}

        <div className="grid grid-cols-2 items-end gap-2">
          <label className="block">
            <span className="mb-1 block text-[10px] text-muted-foreground">强度 · {Math.round(intensity * 100)}%</span>
            <input className="h-8 w-full accent-primary" max={1} min={0.1} onChange={(e) => setIntensity(Number(e.target.value))} step={0.05} type="range" value={intensity} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] text-muted-foreground">时长（帧）</span>
            <input className="h-8 w-full rounded-xs border border-border bg-card px-2 text-xs outline-none focus:border-primary/40" min={12} onChange={(e) => setDurationFrames(Math.max(12, Number(e.target.value) || 12))} type="number" value={durationFrames} />
          </label>
        </div>
      </div>
    </div>
  );
};
