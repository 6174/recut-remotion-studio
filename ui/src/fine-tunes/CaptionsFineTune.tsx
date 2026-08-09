/**
 * [INPUT]: 依赖字幕主题目录、真实 Remotion 预览与 FineTuneProps 回调
 * [OUTPUT]: 对外提供字幕主题工作台：全部主题直出、静态辨识卡与不重建播放器的全尺寸动效预览
 * [POS]: remotion-studio/ui/fine-tunes 的字幕微调动作；将主题选择转译成可审阅的编辑 Prompt
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Check, Play } from "lucide-react";
import { LivePreview, PreviewCard } from "../preview/PreviewCard";
import type { FineTuneProps } from "./FineTuneProps";

const STYLE_META: Record<string, { cue: string; use: string }> = {
  pop: { cue: "弹性强调", use: "通用口播" },
  karaoke: { cue: "扫光进度", use: "歌词 / 解说" },
  poppin: { cue: "粗体高亮", use: "短视频口播" },
  "simple-one-word": { cue: "单词聚焦", use: "强节奏金句" },
  "kinetic-01": { cue: "主词放大", use: "观点表达" },
  "kinetic-02": { cue: "重排变体", use: "节奏剪辑" },
  hustle: { cue: "快速入场", use: "活力内容" },
  aarit: { cue: "逐字缩放", use: "情绪化叙事" },
  beast: { cue: "粗体冲击", use: "高能量标题" },
  grape: { cue: "倾斜强调", use: "轻松讲解" },
  "soft-ai": { cue: "柔焦浮现", use: "科技产品" },
  "gaming-stream": { cue: "霓虹发光", use: "游戏直播" },
  podcast: { cue: "双行段落", use: "访谈播客" },
};

export const CaptionsFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const [value, setValue] = useState(catalog.captionThemes[0]?.id || "");
  const [hovered, setHovered] = useState<string | null>(null);
  const activeId = hovered ?? value;
  const selected = catalog.captionThemes.find((item) => item.id === value);
  const active = catalog.captionThemes.find((item) => item.id === activeId) ?? selected;
  const activeMeta = STYLE_META[active?.id ?? ""];
  const prompt = useMemo(() => {
    const selected = catalog.captionThemes.find((item) => item.id === value);
    return `${basePrompt}\n\n字幕风格：${value}（${selected?.label ?? ""}；${selected?.description ?? ""}）`;
  }, [basePrompt, catalog, value]);

  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-sm border border-border bg-card shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">LIVE STYLE PREVIEW</p>
            <h3 className="mt-1 text-sm font-semibold">{active?.label ?? "选择一个字幕主题"}</h3>
          </div>
          {activeMeta ? <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] text-primary">{activeMeta.cue}</span> : null}
        </div>
        <LivePreview fullBleed showControls spec={{ id: active?.id ?? "pop", kind: "caption" }} />
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">{active?.description}</span>
          <span className="shrink-0 text-[10px] text-white/45">播放或拖动时间轴查看动效</span>
        </div>
      </section>

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="block text-xs font-semibold">选择字幕语言</span>
          <span className="mt-1 block text-[11px] text-muted-foreground">所有主题都在这里；悬停对比，点按后应用。</span>
        </div>
        {kitVersionHint ? <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-1 rounded-full bg-primary" />{kitVersionHint}</span> : null}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {catalog.captionThemes.map((item) => {
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
