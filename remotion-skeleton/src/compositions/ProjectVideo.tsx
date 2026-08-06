/**
 * [INPUT]: 依赖 Remotion 时间轴、Brief/MediaMap 数据、效果注册表与字幕主题
 * [OUTPUT]: 对外提供 ProjectVideo、SCENES、resolvePalette、getProjectMetadata
 * [POS]: remotion-skeleton 的主成片编排器，连接场景内容、背景、字幕与品牌层
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveMediaUrl } from "../runtime/media";
import { MediaImage } from "../media";
import { BackgroundFX, Palette, useImageMotion } from "../effects/registry";
import { TextFX } from "../effects/text";
import { CaptionTheme, buildCaptionsData, CaptionsData } from "../captions";
import { Brief, MediaMap, ProjectVideoProps } from "../types";

/**
 * ProjectVideo — the per-project composition template. This is the file the AI
 * edits directly: rewrite SCENES (content) and/or the renderers below.
 *
 * Design system (driven by `resolvePalette` per template):
 *   - background / primary / accent / text / fontFamily / captionTheme
 *   - Tailwind utilities from src/index.css are available for layout/typography;
 *     palette-driven colors stay inline (they vary per template).
 *   - Reuse the built-in effects (effects/registry.tsx + effects/text.tsx), the
 *     81 vendored remotion-templates, and the 13 caption themes instead of
 *     hand-writing new animation — see skills/remotion-studio references.
 * Media is referenced by Recut assetId through resolveMediaUrl(assetId, media).
 * Everything is frame-driven and deterministic.
 */

export interface Scene {
  id: string;
  kind: "title" | "content" | "outro";
  title: string;
  kicker?: string;
  narration?: string;
  imageAssetId?: string | null;
  effectId?: string;
  durationSec: number;
}

const TEXT_EFFECT_IDS = ["bounce-text", "typewriter", "glitch", "cinematic-title", "slide-text", "lower-third"];

const TEMPLATE_PALETTES: Record<string, Palette> = {
  "paper-collage": { background: "#f4efe7", primary: "#14120f", accent: "#c46a2b", text: "#14120f", fontFamily: "Georgia, 'Songti SC', 'Noto Serif SC', 'Times New Roman', serif", captionTheme: "simple-one-word", captionPrimary: "#14120f", captionSecondary: "#c46a2b", effectId: "noise-grain" },
  "cinematic-dark": { background: "#0b0b12", primary: "#f5f2ea", accent: "#e8b341", text: "#f5f2ea", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "kinetic-01", captionPrimary: "#f5f2ea", captionSecondary: "#e8b341", effectId: "starfield" },
  "clean-editorial": { background: "#ffffff", primary: "#0f172a", accent: "#2563eb", text: "#0f172a", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "pop", captionPrimary: "#f8fafc", captionSecondary: "#93c5fd", effectId: "editorial-lines" },
  "vibrant-tech": { background: "#12002a", primary: "#ffffff", accent: "#22d3ee", text: "#ffffff", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "hustle", captionPrimary: "#ffffff", captionSecondary: "#22d3ee", effectId: "gradient-shift" },
};

export const resolvePalette = (brief?: Brief | null): Palette => {
  const fallback = TEMPLATE_PALETTES[brief?.template || ""] ?? TEMPLATE_PALETTES["clean-editorial"];
  return { ...fallback };
};

/**
 * 默认 SCENES 是一段演示成片：开场字 → 三个步骤（分别展示 slide-text、
 * 编辑排版标题、lower-third）→ 结尾。AI 改内容时替换 title/narration/素材即可；
 * 需要换动效就改 effectId（目录见 skills/remotion-studio/references/effects.md）。
 */
export const SCENES: Scene[] = [
  { id: "opening", kind: "title", title: "把想法，写成成片", kicker: "RECUT × REMOTION STUDIO", durationSec: 4 },
  { id: "body-1", kind: "content", title: "一个想法，就是起点", kicker: "01 · 选题", narration: "选定选题、风格与素材，剩下交给代码。", effectId: "slide-text", durationSec: 5 },
  { id: "body-2", kind: "content", title: "AI 直接改写代码", kicker: "02 · 写代码", narration: "保存即热更新，Player 里立刻看到新画面。", durationSec: 5 },
  { id: "body-3", kind: "content", title: "实时预览，反复打磨", kicker: "03 · 打磨", narration: "每一帧都由代码派生，预览与成片逐帧一致。", effectId: "lower-third", durationSec: 5 },
  { id: "closing", kind: "outro", title: "开始创作", kicker: "START", durationSec: 4 },
];

/** Single source of truth for the composition metadata; keep in sync with SCENES. */
export const getProjectMetadata = (props: ProjectVideoProps) => {
  const fps = props.settings?.fps ?? 30;
  const width = props.settings?.width ?? 1920;
  const height = props.settings?.height ?? 1080;
  const durationInFrames = Math.max(1, Math.round(SCENES.reduce((sum, scene) => sum + (scene.durationSec || 2), 0) * fps));
  return { durationInFrames, fps, width, height };
};

interface SceneTiming {
  scene: Scene;
  index: number;
  start: number;
  frames: number;
}

const computeTimings = (fps: number): SceneTiming[] => {
  let cursor = 0;
  return SCENES.map((scene, index) => {
    const frames = Math.max(1, Math.round((scene.durationSec || 2) * fps));
    const timing = { scene, index, start: cursor, frames };
    cursor += frames;
    return timing;
  });
};

const buildGlobalCaptions = (timings: SceneTiming[], fps: number): CaptionsData => {
  const lines: CaptionsData["lines"] = [];
  for (const { scene, start, frames } of timings) {
    if (scene.kind !== "content" || !scene.narration || scene.effectId) continue;
    const data = buildCaptionsData(scene.narration, start / fps, frames / fps);
    lines.push(...data.lines);
  }
  return { lines };
};

const FADE = 8;

const accentRule = (palette: Palette, maxWidth = 160): React.CSSProperties => ({
  width: maxWidth,
  height: 5,
  borderRadius: 3,
  background: `linear-gradient(90deg, ${palette.accent}, ${palette.primary})`,
});

const drawInWidth = (frame: number, from = 8, to = 50, max = 160) =>
  Math.round(interpolate(frame, [from, to], [0, max], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

const BrandMark: React.FC<{ palette: Palette }> = ({ palette }) => (
  <div style={{ position: "absolute", top: "4%", left: "5%", display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
    <span style={{ width: 12, height: 12, borderRadius: 3, background: palette.accent }} />
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14, letterSpacing: "0.22em", color: palette.text, fontWeight: 600 }}>RECUT STUDIO</span>
  </div>
);

const ProgressDots: React.FC<{ count: number; active: number; palette: Palette }> = ({ count, active, palette }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", bottom: "5%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12, zIndex: 20 }}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        const scale = isActive ? 1 + Math.sin(frame / 4) * 0.08 : 1;
        return (
          <span
            key={i}
            style={{
              width: isActive ? 26 : 8,
              height: 8,
              borderRadius: 4,
              background: isActive ? palette.accent : palette.text,
              opacity: isActive ? 1 : 0.28,
              transform: `scaleY(${scale})`,
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
};

const TitleLayer: React.FC<{ scene: Scene; palette: Palette }> = ({ scene, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, from: 40, to: 0, config: { damping: 16, mass: 0.9 } });
  const opacity = spring({ frame, fps, from: 0, to: 1, durationInFrames: 28 });
  const kickerOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruleWidth = drawInWidth(frame, 18, 58, 170);
  const hintOpacity = interpolate(frame, [40, 60], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 12%" }}>
      {scene.kicker ? (
        <div style={{ opacity: kickerOpacity, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 18, letterSpacing: "0.34em", color: palette.accent, fontWeight: 600, marginBottom: 26 }}>{scene.kicker}</div>
      ) : null}
      <h1 style={{ opacity, transform: `translateY(${rise}px)`, fontSize: 92, fontWeight: 900, color: palette.text, margin: 0, lineHeight: 1.08, fontFamily: palette.fontFamily, letterSpacing: "-0.03em" }}>{scene.title}</h1>
      <div style={{ ...accentRule(palette), width: ruleWidth, marginTop: 30 }} />
      {scene.narration ? <p style={{ opacity: opacity * 0.72, color: palette.text, fontSize: 26, fontWeight: 300, marginTop: 26, fontFamily: palette.fontFamily }}>{scene.narration}</p> : null}
      <div style={{ position: "absolute", bottom: "5%", opacity: hintOpacity, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, letterSpacing: "0.3em", color: palette.text }}>FRAME · DRIVEN · DETERMINISTIC</div>
    </div>
  );
};

const ContentHeading: React.FC<{ scene: Scene; index: number; palette: Palette }> = ({ scene, index, palette }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame, [0, 14], [-24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruleWidth = drawInWidth(frame, 6, 34, 96);
  const numeral = String(index + 1).padStart(2, "0");
  return (
    <div style={{ position: "absolute", top: "9%", left: "6%", right: "6%", opacity, transform: `translateX(${x}px)` }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 84, fontWeight: 900, color: palette.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>{numeral}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {scene.kicker ? <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, letterSpacing: "0.28em", color: palette.accent, fontWeight: 600 }}>{scene.kicker}</span> : null}
          <h2 style={{ fontSize: 58, fontWeight: 800, color: palette.text, margin: 0, lineHeight: 1.1, fontFamily: palette.fontFamily, letterSpacing: "-0.02em" }}>{scene.title}</h2>
        </div>
      </div>
      <div style={{ ...accentRule(palette, 96), width: ruleWidth, marginTop: 20 }} />
    </div>
  );
};

const OutroLayer: React.FC<{ scene: Scene; palette: Palette }> = ({ scene, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, from: 0.94, to: 1, config: { damping: 14, mass: 0.8 } });
  const opacity = spring({ frame, fps, from: 0, to: 1, durationInFrames: 26 });
  const ruleWidth = drawInWidth(frame, 20, 56, 150);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 12%", opacity, transform: `scale(${scale})` }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${palette.accent}, ${palette.primary})`, marginBottom: 30, boxShadow: "0 12px 32px rgba(0,0,0,0.18)" }} />
      {scene.kicker ? <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, letterSpacing: "0.34em", color: palette.accent, fontWeight: 600, marginBottom: 18 }}>{scene.kicker}</div> : null}
      <h1 style={{ fontSize: 84, fontWeight: 900, color: palette.text, margin: 0, lineHeight: 1.08, fontFamily: palette.fontFamily, letterSpacing: "-0.03em" }}>{scene.title}</h1>
      <div style={{ ...accentRule(palette), width: ruleWidth, marginTop: 26 }} />
    </div>
  );
};

const SceneLayer: React.FC<{ scene: Scene; index: number; count: number; media?: MediaMap; palette: Palette; frames: number }> = ({ scene, index, count, media, palette, frames }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [frames - FADE, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const motion = scene.imageAssetId ? useImageMotion("push-in", frames) : null;
  const isTextEffect = scene.effectId ? TEXT_EFFECT_IDS.includes(scene.effectId) : false;

  let body: React.ReactNode = null;
  if (isTextEffect && scene.effectId) {
    body = <TextFX effectId={scene.effectId} text={scene.title} subtitle={scene.kind === "outro" ? undefined : scene.narration} palette={palette} />;
  } else if (scene.kind === "content") {
    body = <ContentHeading scene={scene} index={index} palette={palette} />;
  } else if (scene.kind === "outro") {
    body = <OutroLayer scene={scene} palette={palette} />;
  } else {
    body = <TitleLayer scene={scene} palette={palette} />;
  }

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.imageAssetId ? (
        <AbsoluteFill>
          <MediaImage media={media} assetId={scene.imageAssetId} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...motion }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)" }} />
        </AbsoluteFill>
      ) : null}
      <BrandMark palette={palette} />
      {body}
      <ProgressDots count={count} active={index} palette={palette} />
    </AbsoluteFill>
  );
};

const CaptionLayer: React.FC<{ data: CaptionsData; palette: Palette; width: number }> = ({ data, palette, width }) => {
  if (!data.lines.length) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: "8%", zIndex: 30, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ width: "fit-content", maxWidth: Math.round(width * 0.86), padding: "16px 28px", borderRadius: 14, background: "rgba(15, 23, 42, 0.94)", boxShadow: "0 12px 28px rgba(15, 23, 42, 0.16)" }}>
        <CaptionTheme data={data} theme={palette.captionTheme || "pop"} primaryColor={palette.captionPrimary || palette.text} secondaryColor={palette.captionSecondary || palette.accent} fontSize={Math.max(42, Math.round(width / 26))} />
      </div>
    </div>
  );
};

export const ProjectVideo: React.FC<ProjectVideoProps> = ({ brief, media }) => {
  const { fps, width } = useVideoConfig();
  const palette = resolvePalette(brief);
  const timings = computeTimings(fps);
  const captionsData = buildGlobalCaptions(timings, fps);

  return (
    <AbsoluteFill style={{ background: palette.background }}>
      <BackgroundFX effectId={palette.effectId} palette={palette} />
      {timings.map(({ scene, index, start, frames }) => (
        <Sequence key={scene.id} from={start} durationInFrames={frames}>
          <SceneLayer scene={scene} index={index} count={timings.length} media={media} palette={palette} frames={frames} />
        </Sequence>
      ))}
      <CaptionLayer data={captionsData} palette={palette} width={width} />
      {/* BGM：把素材库音频 assetId 填进下面这一行即可 */}
      {false && <Audio src={resolveMediaUrl("", media) || ""} />}
    </AbsoluteFill>
  );
};
