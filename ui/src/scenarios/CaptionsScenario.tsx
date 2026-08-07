/**
 * [INPUT]: 依赖字幕主题目录、真实 Remotion 预览与场景 Prompt 回调
 * [OUTPUT]: 对外提供字幕主题工作台：分组浏览、静态辨识卡与可播放的全尺寸动效预览
 * [POS]: remotion-studio/ui 的字幕创作场景；将主题选择转译成可审阅的编辑 Prompt
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Check, Play } from "lucide-react";
import { LivePreview, PreviewCard } from "../preview/PreviewCard";
import type { ScenarioProps } from "./types";

type CaptionGroup = "sync" | "kinetic" | "expressive";

const GROUPS: Array<{ id: CaptionGroup; label: string; description: string }> = [
  { id: "sync", label: "逐词同步", description: "适合口播、教程和高信息密度内容" },
  { id: "kinetic", label: "动能排版", description: "让关键字成为画面的视觉重心" },
  { id: "expressive", label: "视觉强调", description: "只靠字形、阴影和动效建立识别度" },
];

const STYLE_META: Record<string, { group: CaptionGroup; cue: string; use: string }> = {
  pop: { group: "sync", cue: "弹性强调", use: "通用口播" },
  karaoke: { group: "sync", cue: "扫光进度", use: "歌词 / 解说" },
  poppin: { group: "sync", cue: "粗体高亮", use: "短视频口播" },
  "simple-one-word": { group: "sync", cue: "单词聚焦", use: "强节奏金句" },
  "kinetic-01": { group: "kinetic", cue: "主词放大", use: "观点表达" },
  "kinetic-02": { group: "kinetic", cue: "重排变体", use: "节奏剪辑" },
  hustle: { group: "kinetic", cue: "快速入场", use: "活力内容" },
  aarit: { group: "kinetic", cue: "逐字缩放", use: "情绪化叙事" },
  beast: { group: "kinetic", cue: "粗体冲击", use: "高能量标题" },
  grape: { group: "expressive", cue: "倾斜强调", use: "轻松讲解" },
  "soft-ai": { group: "expressive", cue: "柔焦浮现", use: "科技产品" },
  "gaming-stream": { group: "expressive", cue: "霓虹发光", use: "游戏直播" },
  podcast: { group: "expressive", cue: "双行段落", use: "访谈播客" },
};

export const CaptionsScenario: React.FC<ScenarioProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const [value, setValue] = useState(catalog.captionThemes[0]?.id || "");
  const [group, setGroup] = useState<CaptionGroup>("sync");
  const [hovered, setHovered] = useState<string | null>(null);
  const activeId = hovered ?? value;
  const selected = catalog.captionThemes.find((item) => item.id === value);
  const active = catalog.captionThemes.find((item) => item.id === activeId) ?? selected;
  const activeMeta = STYLE_META[active?.id ?? ""];
  const visibleThemes = catalog.captionThemes.filter((item) => (STYLE_META[item.id]?.group ?? "sync") === group);
  const prompt = useMemo(() => {
    const selected = catalog.captionThemes.find((item) => item.id === value);
    return `${basePrompt}\n\n字幕风格：${value}（${selected?.label ?? ""}；${selected?.description ?? ""}）`;
  }, [basePrompt, catalog, value]);

  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-sm border border-border bg-terminal shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-black/20 px-4 py-3 text-white">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">LIVE STYLE PREVIEW</p>
            <h3 className="mt-1 text-sm font-semibold">{active?.label ?? "选择一个字幕主题"}</h3>
          </div>
          {activeMeta ? <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] text-white/80">{activeMeta.cue}</span> : null}
        </div>
        <LivePreview key={active?.id} height={320} showControls spec={{ id: active?.id ?? "pop", kind: "caption" }} />
        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/25 px-4 py-2.5 text-xs text-white/70">
          <span className="min-w-0 truncate">{active?.description}</span>
          <span className="shrink-0 text-[10px] text-white/45">播放或拖动时间轴查看动效</span>
        </div>
      </section>

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="block text-xs font-semibold">选择字幕语言</span>
          <span className="mt-1 block text-[11px] text-muted-foreground">先看大预览；悬停仅作对比，点按后才会应用。</span>
        </div>
        {kitVersionHint ? <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-1 rounded-full bg-primary" />{kitVersionHint}</span> : null}
      </div>

      <div aria-label="字幕类别" className="grid grid-cols-3 gap-2" role="tablist">
        {GROUPS.map((item) => (
          <button
            aria-selected={group === item.id}
            className={`rounded-xs border p-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 ${group === item.id ? "border-primary bg-primary/8" : "border-border bg-muted/20 hover:border-primary/35"}`}
            key={item.id}
            onClick={() => setGroup(item.id)}
            role="tab"
            type="button"
          >
            <span className="block text-xs font-semibold">{item.label}</span>
            <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{item.description}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {visibleThemes.map((item) => {
          const meta = STYLE_META[item.id];
          const isSelected = item.id === value;
          return (
            <div key={item.id} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}>
              <PreviewCard
                description={`${meta?.cue ?? item.description} · ${meta?.use ?? "通用"}`}
                label={item.label}
                onBlur={() => setHovered(null)}
                onFocus={() => setHovered(item.id)}
                onSelect={() => setValue(item.id)}
                selected={isSelected}
                spec={{ id: item.id, kind: "caption" }}
              />
              {isSelected ? <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-primary"><Check className="size-3" />已选择</span> : <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><Play className="size-3" />悬停预览</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
