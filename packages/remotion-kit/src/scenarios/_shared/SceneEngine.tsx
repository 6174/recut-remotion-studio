/**
 * [INPUT]: 依赖 Remotion 帧时钟、palette、字幕构建与场景 beat 渲染器
 * [OUTPUT]: 对外提供 SceneEngine：一个按 beat 分发的场景编排器。
 *           引擎只负责画布（背景/淡入淡出）、字幕层、时序与媒体，把每一帧的主体
 *           画面交给场景注册的 beat 渲染器（beats[kind]）。这样每个场景的叙事
 *           结构与视觉语言都由自己的 beat 渲染器表达，而不是一个通用模板换文案；可读文字遵循
 *           1080p 主信息 ≥56px、无底框字幕 ≥40px、辅助信息 ≥32px 的全局门槛。
 * [POS]: scenarios/_shared 的共享编排引擎；场景模板只定义 SCENES（beat 序列）
 *        与 beats（每类 beat 的渲染器），引擎负责把两者粘合成成片。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundFX, useImageMotion } from "../../effects";
import { buildCaptionsData, CaptionTheme } from "../../captions";
import type { CaptionsData } from "../../captions";
import type { Palette } from "../../palette";
import type { BeatRenderer, Scene, SceneEngineProps } from "./types";

export * from "./types";

/** 默认 content beat：标题 + 序号 + 细线，作为未注册 kind 的兜底。 */
export const DefaultContentBeat: BeatRenderer = ({ scene, p, frame, fps }) => {
  const rise = spring({ frame, fps, from: 40, to: 0, config: { damping: 16, mass: 0.9 } });
  const opacity = spring({ frame, fps, from: 0, to: 1, durationInFrames: 24 });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 12%" }}>
      {scene.kicker ? <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 32, letterSpacing: "0.12em", color: p.accent, fontWeight: 800, marginBottom: 26 }}>{scene.kicker}</div> : null}
      <h1 style={{ opacity, transform: `translateY(${rise}px)`, fontSize: 92, fontWeight: 900, color: p.text, margin: 0, lineHeight: 1.08, fontFamily: p.fontFamily, letterSpacing: "-0.03em" }}>{scene.title}</h1>
      <div style={{ width: Math.round(interpolate(frame, [18, 58], [0, 170], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${p.accent}, ${p.primary})`, marginTop: 30 }} />
      {scene.narration ? <p style={{ opacity: opacity * 0.86, color: p.text, fontSize: 40, lineHeight: 1.25, fontWeight: 700, marginTop: 26, fontFamily: p.fontFamily }}>{scene.narration}</p> : null}
    </div>
  );
};

export const computeTimings = (fps: number, scenes: Scene[]) => {
  let cursor = 0;
  return scenes.map((scene, index) => {
    const frames = Math.max(1, Math.round((scene.durationSec || 2) * fps));
    const timing = { scene, index, start: cursor, frames };
    cursor += frames;
    return timing;
  });
};

export const buildGlobalCaptions = (timings: ReturnType<typeof computeTimings>, fps: number): CaptionsData => {
  const lines: CaptionsData["lines"] = [];
  for (const { scene, start, frames } of timings) {
    if (!scene.narration) continue;
    lines.push(...buildCaptionsData(scene.narration, start / fps, frames / fps).lines);
  }
  return { lines };
};

export const totalDurationFrames = (fps: number, scenes: Scene[]) =>
  Math.max(1, Math.round(scenes.reduce((sum, s) => sum + (s.durationSec || 2), 0) * fps));

const CaptionLayer: React.FC<{ data: CaptionsData; p: Palette; width: number }> = ({ data, p, width }) => {
  if (!data.lines.length) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: "7%", zIndex: 30, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ width: Math.round(width * 0.7), maxWidth: "70%" }}>
        <CaptionTheme data={data} theme={p.captionTheme || "pop"} primaryColor={p.captionPrimary || p.text} secondaryColor={p.captionSecondary || p.accent} fontSize={46} />
      </div>
    </div>
  );
};

const BeatLayer: React.FC<{ scene: Scene; p: Palette; beats: Record<string, BeatRenderer>; defaultBeat?: BeatRenderer; frames: number; resolveMediaUrl?: (id: string) => string | undefined }> = ({ scene, p, beats, defaultBeat, frames, resolveMediaUrl }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [frames - 8, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const Renderer = beats[scene.kind] ?? defaultBeat ?? DefaultContentBeat;
  const imageUrl = scene.imageAssetId ? resolveMediaUrl?.(scene.imageAssetId) : undefined;
  const motion = imageUrl ? useImageMotion("push-in", frames) : null;
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {imageUrl ? (
        <AbsoluteFill>
          <Img src={imageUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...motion }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0) 32%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5))" }} />
        </AbsoluteFill>
      ) : null}
      <Renderer scene={scene} p={p} frame={frame} fps={fps} width={width} height={height} resolveMediaUrl={resolveMediaUrl} />
    </AbsoluteFill>
  );
};

/** 场景引擎：把内置 palette（场景自带视觉）× SCENES（beat 序列）× beats（渲染器表）粘合成成片。 */
export const SceneEngine: React.FC<SceneEngineProps> = ({ palette: p, scenes, beats, defaultBeat, resolveMediaUrl, bgmAssetId }) => {
  const { fps, width } = useVideoConfig();
  const timings = computeTimings(fps, scenes);
  const captions = buildGlobalCaptions(timings, fps);

  return (
    <AbsoluteFill style={{ background: p.background }}>
      <BackgroundFX effectId={p.effectId} palette={p} />
      {timings.map(({ scene, start, frames }) => (
        <Sequence key={scene.id} from={start} durationInFrames={frames}>
          <BeatLayer scene={scene} p={p} beats={beats} defaultBeat={defaultBeat} frames={frames} resolveMediaUrl={resolveMediaUrl} />
        </Sequence>
      ))}
      <CaptionLayer data={captions} p={p} width={width} />
      {bgmAssetId && resolveMediaUrl ? <Audio src={resolveMediaUrl(bgmAssetId) || ""} /> : null}
    </AbsoluteFill>
  );
};
