/**
 * [INPUT]: 依赖 @remotion/player 与 preview/compositions 的 PreviewScene
 * [OUTPUT]: 对外提供 Player 大预览与代表帧卡片；视口外卡片自动卸载
 * [POS]: remotion-studio/ui 预览层的卡片原子；只渲染预览，不持有业务选择状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useRef, useState } from "react";
import { Player } from "@remotion/player";
import { PreviewScene, PreviewSpec, previewDurationFrames } from "./compositions";
import { PREVIEW_FPS } from "./sample";

export const LivePreview: React.FC<{ spec: PreviewSpec; aspectRatio?: string | number; height?: number; showControls?: boolean; autoPlay?: boolean; initialFrame?: number }> = ({ spec, aspectRatio = "16 / 9", height, showControls = false, autoPlay = true, initialFrame = 0 }) => {
  return (
    <div className="overflow-hidden rounded-xs bg-terminal" style={height ? { height, minHeight: 0 } : { aspectRatio, minHeight: 0 }}>
      <Player
        acknowledgeRemotionLicense
        component={PreviewScene}
        autoPlay={autoPlay}
        compositionHeight={1080}
        compositionWidth={1920}
        controls={showControls}
        durationInFrames={previewDurationFrames(spec)}
        fps={PREVIEW_FPS}
        initialFrame={initialFrame}
        inputProps={spec}
        loop
        muted
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

interface PreviewCardProps {
  spec: PreviewSpec;
  selected: boolean;
  label: string;
  description?: string;
  onSelect: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ spec, selected, label, description, onSelect, onFocus, onBlur, onMouseEnter, onMouseLeave }) => {
  const holderRef = useRef<HTMLButtonElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = holderRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: "120px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      className={`min-w-0 cursor-pointer rounded-sm border bg-card p-2 text-left outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/30 ${selected ? "border-primary bg-primary/5" : "border-border"}`}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter ?? onFocus}
      onMouseLeave={onMouseLeave}
      onClick={onSelect}
      ref={holderRef}
      type="button"
    >
      <div className="min-h-0">{inView ? <LivePreview autoPlay={false} initialFrame={48} spec={spec} /> : <div style={{ aspectRatio: "16 / 9" }} />}</div>
      <span className="mt-1.5 flex items-center justify-between gap-1">
        <span className="truncate text-xs font-semibold">{label}</span>
        {selected ? <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">✓</span> : null}
      </span>
      {description ? <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{description}</span> : null}
    </button>
  );
};
