import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveMediaUrl } from "../runtime/media";
import { MediaImage } from "../media";
import { BackgroundFX, Palette, useImageMotion } from "../effects/registry";
import { TextFX } from "../effects/text";
import { CaptionTheme, buildCaptionsData, CaptionsData } from "../captions";
import { Brief, MediaMap, ProjectVideoProps } from "../types";

/**
 * ProjectVideo — the per-project composition template. This is the file the AI
 * edits directly: rewrite SCENES (content) and/or the renderers below. Media is
 * referenced by Recut assetId through resolveMediaUrl(assetId, media), which
 * resolves to the materialized file during export and to the content URL in
 * preview. Everything is frame-driven and deterministic.
 */

export interface Scene {
  id: string;
  kind: "title" | "content" | "outro";
  title: string;
  narration?: string;
  imageAssetId?: string | null;
  effectId?: string;
  durationSec: number;
}

const TEMPLATE_PALETTES: Record<string, Palette> = {
  "paper-collage": { background: "#f4efe7", primary: "#14120f", accent: "#c46a2b", text: "#14120f", fontFamily: "Georgia, 'Times New Roman', serif", captionTheme: "simple-one-word", captionPrimary: "#14120f", captionSecondary: "#c46a2b", effectId: "noise-grain" },
  "cinematic-dark": { background: "#0b0b12", primary: "#f5f2ea", accent: "#e8b341", text: "#f5f2ea", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", captionTheme: "kinetic-01", captionPrimary: "#f5f2ea", captionSecondary: "#e8b341", effectId: "starfield" },
  "clean-editorial": { background: "#f7f7f4", primary: "#111314", accent: "#1d5bd6", text: "#111314", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", captionTheme: "pop", captionPrimary: "#111314", captionSecondary: "#1d5bd6", effectId: "geometric" },
  "vibrant-tech": { background: "#12002a", primary: "#ffffff", accent: "#22d3ee", text: "#ffffff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", captionTheme: "hustle", captionPrimary: "#ffffff", captionSecondary: "#22d3ee", effectId: "gradient-shift" },
};

export const resolvePalette = (brief?: Brief | null): Palette => {
  const fallback = TEMPLATE_PALETTES[brief?.template || ""] ?? TEMPLATE_PALETTES["clean-editorial"];
  return { ...fallback };
};

export const SCENES: Scene[] = [
  { id: "opening", kind: "title", title: "Remotion Studio", effectId: "cinematic-title", durationSec: 4 },
  { id: "body-1", kind: "content", title: "选题", narration: "把想法写进这份代码，AI 会直接改写它。", durationSec: 5 },
  { id: "body-2", kind: "content", title: "改写", narration: "保存后 Player 会刷新预览。", imageAssetId: null, durationSec: 5 },
  { id: "closing", kind: "outro", title: "开始创作", durationSec: 4 },
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
  start: number;
  frames: number;
}

const computeTimings = (fps: number): SceneTiming[] => {
  let cursor = 0;
  return SCENES.map((scene) => {
    const frames = Math.max(1, Math.round((scene.durationSec || 2) * fps));
    const timing = { scene, start: cursor, frames };
    cursor += frames;
    return timing;
  });
};

const buildGlobalCaptions = (timings: SceneTiming[], fps: number): CaptionsData => {
  const lines: CaptionsData["lines"] = [];
  for (const { scene, start, frames } of timings) {
    if (scene.kind !== "content" || !scene.narration) continue;
    const data = buildCaptionsData(scene.narration, start / fps, frames / fps);
    lines.push(...data.lines);
  }
  return { lines };
};

const FADE = 6;

const TitleLayer: React.FC<{ scene: Scene; palette: Palette }> = ({ scene, palette }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 12], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity, transform: `translateY(${y}px)`, padding: "0 8%" }}>
      <h1 style={{ fontSize: "5rem", fontWeight: 900, color: palette.text, margin: 0, lineHeight: 1.05, fontFamily: palette.fontFamily, letterSpacing: "-0.02em" }}>{scene.title}</h1>
      <div style={{ width: 140, height: 6, background: palette.accent, borderRadius: 3, marginTop: 24 }} />
    </div>
  );
};

const ContentHeading: React.FC<{ scene: Scene; palette: Palette }> = ({ scene, palette }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: "6%", left: "5%", right: "5%", opacity }}>
      <h2 style={{ fontSize: "2.6rem", fontWeight: 800, color: palette.text, margin: 0, fontFamily: palette.fontFamily, lineHeight: 1.15 }}>{scene.title}</h2>
    </div>
  );
};

const OutroLayer: React.FC<{ scene: Scene; palette: Palette }> = ({ scene, palette }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 20], [0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity, transform: `scale(${scale})`, padding: "0 8%" }}>
      <div style={{ width: 60, height: 60, borderRadius: 30, background: palette.accent, marginBottom: 28, opacity: 0.9 }} />
      <h1 style={{ fontSize: "4rem", fontWeight: 900, color: palette.text, margin: 0, fontFamily: palette.fontFamily, lineHeight: 1.1 }}>{scene.title}</h1>
    </div>
  );
};

const SceneLayer: React.FC<{ scene: Scene; media?: MediaMap; palette: Palette; frames: number }> = ({ scene, media, palette, frames }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [frames - FADE, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const motion = scene.imageAssetId ? useImageMotion("push-in", frames) : null;
  const isTextEffect = Boolean(scene.effectId && ["bounce-text", "typewriter", "glitch", "cinematic-title", "slide-text", "lower-third"].includes(scene.effectId));

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.imageAssetId ? (
        <AbsoluteFill>
          <MediaImage media={media} assetId={scene.imageAssetId} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...motion }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)" }} />
        </AbsoluteFill>
      ) : null}
      {scene.kind === "content" ? (
        <>
          <ContentHeading scene={scene} palette={palette} />
          {isTextEffect && scene.effectId ? <TextFX effectId={scene.effectId} text={scene.title} subtitle={scene.narration} palette={palette} /> : null}
        </>
      ) : isTextEffect && scene.effectId ? (
        <TextFX effectId={scene.effectId} text={scene.title} subtitle={scene.kind === "outro" ? undefined : scene.narration} palette={palette} />
      ) : scene.kind === "outro" ? (
        <OutroLayer scene={scene} palette={palette} />
      ) : (
        <TitleLayer scene={scene} palette={palette} />
      )}
    </AbsoluteFill>
  );
};

const CaptionLayer: React.FC<{ data: CaptionsData; palette: Palette; width: number }> = ({ data, palette, width }) => {
  if (!data.lines.length) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: "7%", zIndex: 10, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ width: "100%", maxWidth: Math.round(width * 0.86) }}>
        <CaptionTheme data={data} theme={palette.captionTheme || "pop"} primaryColor={palette.captionPrimary || palette.text} secondaryColor={palette.captionSecondary || palette.accent} fontSize={Math.max(40, Math.round(width / 26))} />
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
      {timings.map(({ scene, start, frames }) => (
        <Sequence key={scene.id} from={start} durationInFrames={frames}>
          <SceneLayer scene={scene} media={media} palette={palette} frames={frames} />
        </Sequence>
      ))}
      <CaptionLayer data={captionsData} palette={palette} width={width} />
      {/* BGM：把素材库音频 assetId 填进下面这一行即可 */}
      {false && <Audio src={resolveMediaUrl("", media) || ""} />}
    </AbsoluteFill>
  );
};
