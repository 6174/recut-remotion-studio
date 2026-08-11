/**
 * [INPUT]: 依赖 Remotion spring/interpolate、palette、字幕构建、html-canvas 帧驱动互动推导
 *         与 three/ShotGraph 的镜头声明式模型
 * [OUTPUT]: 对外提供 createSceneContent（世界层内容函数）、SceneScreenLayer（屏幕层）与 buildGpuScenePlan（ShotGraph plan），
 *           把场景 beats 以明确的 world / screen 两层接入 Three-first GPU 合成
 * [POS]: scenarios/_shared 的 GPU 编排层。世界层 = 当前场景 beat + 交互 overlay（纯 frame 驱动）；
 *        效果层（post/transform/ambient 材质）与 Three camera / surface 轨由 buildGpuScenePlan 的 mapper 映射。
 *        screen beat 与字幕主题内部使用 Remotion hook，作为 DOM overlay 由 ProjectVideo 渲染，不进入纹理。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Palette } from "../../palette";
import { buildGlobalCaptions, computeTimings, DefaultContentBeat, totalDurationFrames } from "./SceneEngine";
import type { BeatRenderer, Scene } from "./types";
import { resolveInteractionState } from "../../html-canvas/interaction";
import type { InteractionEvent, InteractionState } from "../../html-canvas/types";
import type { CameraMoveDescriptor, LensDescriptor, ShotGraphPlan, SurfaceMoveDescriptor } from "../../three/types";
import type { MaterialId } from "../../materials/types";
import { CaptionTheme } from "../../captions";

export interface SceneGpuOptions {
  palette: Palette;
  scenes: Scene[];
  beats: Record<string, BeatRenderer>;
  defaultBeat?: BeatRenderer;
  resolveMediaUrl?: (assetId: string) => string | undefined;
  /** 帧驱动互动脚本（StagePlan.interaction） */
  interaction?: InteractionEvent[];
  /** 是否绘制交互 overlay（仅 cursor）到内容表面；缺省 true */
  overlay?: boolean;
  width: number;
  height: number;
}

/** 场景 → ShotGraph 镜头的映射：效果/转场/环境/相机轨均由场景决定，缺省 clean。 */
export interface SceneGpuPlanMappers {
  effectFor?: (scene: Scene) => MaterialId | undefined;
  transitionFor?: (scene: Scene) => MaterialId | undefined;
  ambientFor?: (scene: Scene) => MaterialId | undefined;
  lensFor?: (scene: Scene) => LensDescriptor | undefined;
  cameraFor?: (scene: Scene) => CameraMoveDescriptor | undefined;
  surfaceFor?: (scene: Scene) => SurfaceMoveDescriptor | undefined;
  optionsFor?: (scene: Scene) => Record<string, unknown> | undefined;
  transitionDurationFrames?: number;
}

interface ActiveScene {
  scene: Scene;
  local: number;
  frames: number;
}

/** 世界层与屏幕层共用同一个时序解析，避免两层在 cut 边界漂移。 */
const activeSceneAt = (fps: number, scenes: Scene[], frame: number): ActiveScene => {
  const timings = computeTimings(fps, scenes);
  let current = timings[timings.length - 1];
  let local = frame;
  for (const timing of timings) {
    if (frame < timing.start + timing.frames) {
      current = timing;
      local = frame - timing.start;
      break;
    }
  }
  return { scene: current.scene, local, frames: current.frames };
};

/** 帧驱动互动 overlay：只保留 cursor dot，纯 frame 输入。
 *  聚焦由场景自己的 GPU lens/material 表达，交互层不再压暗内容。 */
export const InteractionOverlay: React.FC<{
  interaction: InteractionState;
  active: boolean;
}> = ({ interaction, active }) => {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {interaction.pointer ? (
        <div
          style={{
            position: "absolute",
            left: interaction.pointer.x - 9,
            top: interaction.pointer.y - 9,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#ffffff",
            border: "2px solid rgba(17, 17, 17, 0.88)",
            boxShadow: "0 2px 8px rgba(17, 17, 17, 0.28)",
          }}
        />
      ) : null}
    </div>
  );
};

/** 互动窗口 [start, end]：从首个事件帧到末个事件帧 + 收尾 hold（缺省无事件则 inactive）。 */
const interactionWindow = (
  events: InteractionEvent[] | undefined,
): { start: number; end: number; active: (frame: number) => boolean } => {
  if (!events || events.length === 0) return { start: 0, end: -1, active: () => false };
  const frames = events.map((e) => ("startFrame" in e ? e.startFrame : e.frame));
  const start = Math.min(...frames);
  const end = Math.max(...frames) + 45;
  return { start, end, active: (frame) => frame >= start && frame <= end };
};

/** 字幕层（DOM overlay，供 ProjectVideo 叠在 Three 画面上）。CaptionTheme 内部订阅
 *  Remotion 帧，自身逐帧重渲染；因此不进入纹理。 */
export const SceneCaptionOverlay: React.FC<{
  scenes: Scene[];
  palette: Palette;
  fps: number;
  width: number;
}> = ({ scenes, palette: p, fps, width }) => {
  const data = buildGlobalCaptions(computeTimings(fps, scenes), fps);
  if (!data.lines.length) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: "7%", zIndex: 30, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ width: Math.round(width * 0.7), maxWidth: "70%" }}>
        <CaptionTheme data={data} theme={p.captionTheme || "pop"} primaryColor={p.captionPrimary || p.text} secondaryColor={p.captionSecondary || p.accent} fontSize={46} />
      </div>
    </div>
  );
};

/** 通用的标题/说明屏幕 beat；场景也可传入任意 BeatRenderer 取代它。 */
export const ScreenTitleBeat: BeatRenderer = ({ scene, p }) => (
  <AbsoluteFill style={{ pointerEvents: "none", color: p.text, fontFamily: p.fontFamily }}>
    <div style={{ position: "absolute", top: "7%", right: "6%", maxWidth: "38%", textAlign: "right" }}>
      {scene.kicker ? <div style={{ color: p.accent, fontSize: 24, fontWeight: 900, letterSpacing: "0.14em", marginBottom: 14 }}>{scene.kicker}</div> : null}
      {scene.title ? <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", textShadow: "0 2px 16px rgba(0, 0, 0, 0.2)" }}>{scene.title}</div> : null}
      {scene.subtitle ? <div style={{ marginTop: 16, fontSize: 27, fontWeight: 650, lineHeight: 1.35, opacity: 0.9 }}>{scene.subtitle as string}</div> : null}
    </div>
  </AbsoluteFill>
);

/**
 * 可选的屏幕空间 beat 层。仅 Scene.screenKind 指向的 renderer 会输出，
 * 因此世界层与屏幕层的内容归属始终由场景明确声明，而不是引擎猜测文字角色。
 */
export const SceneScreenLayer: React.FC<{
  palette: Palette;
  scenes: Scene[];
  beats: Record<string, BeatRenderer>;
  defaultBeat?: BeatRenderer;
  resolveMediaUrl?: (assetId: string) => string | undefined;
}> = ({ palette: p, scenes, beats, defaultBeat, resolveMediaUrl }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { scene, local, frames } = activeSceneAt(fps, scenes, frame);
  if (!scene.screenKind) return null;
  const Renderer = beats[scene.screenKind] ?? defaultBeat;
  if (!Renderer) return null;
  const opacity = Math.min(1, Math.max(0, local / 8), Math.max(0, (frames - local) / 8));
  return (
    <AbsoluteFill style={{ zIndex: 20, opacity, pointerEvents: "none" }}>
      <Renderer scene={scene} p={p} frame={local} fps={fps} width={width} height={height} resolveMediaUrl={resolveMediaUrl} layer="screen" />
    </AbsoluteFill>
  );
};

/** 把场景序列变成 (frame, fps) => ReactNode 的纯世界层内容渲染函数（供 HtmlSurface 捕获）。 */
export const createSceneContent = ({
  palette: p,
  scenes,
  beats,
  defaultBeat,
  resolveMediaUrl,
  interaction: interactionEvents,
  overlay = true,
  width,
  height,
}: SceneGpuOptions) => {
  return (frame: number, fps: number): React.ReactNode => {
    const { scene, local, frames } = activeSceneAt(fps, scenes, frame);
    const interaction = resolveInteractionState(interactionEvents, frame);
    const Renderer = beats[scene.kind] ?? defaultBeat ?? DefaultContentBeat;
    const fadeIn = Math.min(1, local / 8);
    const fadeOut = Math.min(1, Math.max(0, (frames - local) / 8));
    const imageUrl = scene.imageAssetId
      ? resolveMediaUrl?.(scene.imageAssetId)
      : undefined;
    const { active: interactionActive } = interactionWindow(interactionEvents);
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: p.background, opacity: Math.min(fadeIn, fadeOut) }}>
        {imageUrl ? (
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src={imageUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.06 * (1 - Math.min(1, local / 90))})` }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0) 30%, rgba(0,0,0,0.5))" }} />
          </div>
        ) : null}
        <Renderer scene={scene} p={p} frame={local} fps={fps} width={width} height={height} resolveMediaUrl={resolveMediaUrl} interaction={interaction} layer="world" />
        {overlay ? <InteractionOverlay interaction={interaction} active={interactionActive(frame)} /> : null}
      </div>
    );
  };
};

/** 把场景序列变成 ShotGraphPlan（每镜头可变时长），效果由 mapper 映射。 */
export const buildGpuScenePlan = (
  { scenes }: Pick<SceneGpuOptions, "scenes">,
  fps: number,
  mappers: SceneGpuPlanMappers = {},
): ShotGraphPlan => {
  const timings = computeTimings(fps, scenes);
  const transitionDuration = mappers.transitionDurationFrames ?? 18;
  const shots = timings.map((timing) => {
    const effect = mappers.effectFor?.(timing.scene);
    const transitionMaterial = mappers.transitionFor?.(timing.scene);
    const lens = mappers.lensFor?.(timing.scene);
    return {
      id: timing.scene.id,
      content: "html" as const,
      durationInFrames: timing.frames,
      effect,
      transition: transitionMaterial
        ? { material: transitionMaterial, durationFrames: transitionDuration }
        : undefined,
      ambient: mappers.ambientFor?.(timing.scene),
      lens,
      camera: mappers.cameraFor?.(timing.scene),
      surface: mappers.surfaceFor?.(timing.scene),
      effectOptions: mappers.optionsFor?.(timing.scene),
    };
  });
  return { durationInFrames: totalDurationFrames(fps, scenes), shots };
};
