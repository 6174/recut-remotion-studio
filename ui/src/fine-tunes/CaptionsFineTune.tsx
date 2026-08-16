/**
 * [INPUT]: 依赖字幕主题目录、真实 Remotion 预览与 FineTuneProps 回调
 * [OUTPUT]: 对外提供字幕主题工作台：全部主题直出、静态辨识卡与不重建播放器的全尺寸动效预览
 * [POS]: remotion-studio/ui/fine-tunes 的字幕微调动作；将主题选择转译成可审阅的编辑 Prompt
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Check, Play } from "lucide-react";
import { LivePreview, PreviewCard } from "../preview/PreviewCard";
import { useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import type { FineTuneProps } from "./FineTuneProps";

const STYLE_META: Record<string, { cueKey: string; useKey: string }> = {
  pop: { cueKey: "captions.style.pop.cue", useKey: "captions.style.pop.use" },
  karaoke: { cueKey: "captions.style.karaoke.cue", useKey: "captions.style.karaoke.use" },
  poppin: { cueKey: "captions.style.poppin.cue", useKey: "captions.style.poppin.use" },
  "simple-one-word": { cueKey: "captions.style.simple-one-word.cue", useKey: "captions.style.simple-one-word.use" },
  "kinetic-01": { cueKey: "captions.style.kinetic-01.cue", useKey: "captions.style.kinetic-01.use" },
  "kinetic-02": { cueKey: "captions.style.kinetic-02.cue", useKey: "captions.style.kinetic-02.use" },
  hustle: { cueKey: "captions.style.hustle.cue", useKey: "captions.style.hustle.use" },
  aarit: { cueKey: "captions.style.aarit.cue", useKey: "captions.style.aarit.use" },
  beast: { cueKey: "captions.style.beast.cue", useKey: "captions.style.beast.use" },
  grape: { cueKey: "captions.style.grape.cue", useKey: "captions.style.grape.use" },
  "soft-ai": { cueKey: "captions.style.soft-ai.cue", useKey: "captions.style.soft-ai.use" },
  "gaming-stream": { cueKey: "captions.style.gaming-stream.cue", useKey: "captions.style.gaming-stream.use" },
  podcast: { cueKey: "captions.style.podcast.cue", useKey: "captions.style.podcast.use" },
};

export const CaptionsFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const locale = useRecutLocale();
  const [value, setValue] = useState(catalog.captionThemes[0]?.id || "");
  const [hovered, setHovered] = useState<string | null>(null);
  const activeId = hovered ?? value;
  const selected = catalog.captionThemes.find((item) => item.id === value);
  const active = catalog.captionThemes.find((item) => item.id === activeId) ?? selected;
  const activeMeta = STYLE_META[active?.id ?? ""];
  const prompt = useMemo(() => {
    const selected = catalog.captionThemes.find((item) => item.id === value);
    return t(locale, "captions.prompt", { basePrompt, value, label: selected?.label ?? "", description: selected?.description ?? "" });
  }, [basePrompt, catalog, locale, value]);

  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-sm border border-border bg-card shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">LIVE STYLE PREVIEW</p>
            <h3 className="mt-1 text-sm font-semibold">{active?.label ?? t(locale, "captions.defaultTitle")}</h3>
          </div>
          {activeMeta ? <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] text-primary">{t(locale, activeMeta.cueKey)}</span> : null}
        </div>
        <LivePreview fullBleed showControls spec={{ id: active?.id ?? "pop", kind: "caption" }} />
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">{active?.description}</span>
          <span className="shrink-0 text-[10px] text-white/45">{t(locale, "captions.playHint")}</span>
        </div>
      </section>

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="block text-xs font-semibold">{t(locale, "captions.languageLabel")}</span>
          <span className="mt-1 block text-[11px] text-muted-foreground">{t(locale, "captions.languageHint")}</span>
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
                description={`${meta ? t(locale, meta.cueKey) : item.description} · ${meta ? t(locale, meta.useKey) : t(locale, "captions.genericUse")}`}
                label={item.label}
                onBlur={() => setHovered(null)}
                onFocus={() => setHovered(item.id)}
                onSelect={() => setValue(item.id)}
                selected={isSelected}
                spec={{ id: item.id, kind: "caption" }}
              />
              {isSelected ? <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-primary"><Check className="size-3" />{t(locale, "captions.selected")}</span> : <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><Play className="size-3" />{t(locale, "captions.hover")}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
