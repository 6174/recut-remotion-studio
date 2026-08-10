/**
 * [INPUT]: 依赖 Remotion spring/interpolate、palette、字幕构建、html-canvas 帧驱动互动推导
 *         与 three/ShotGraph 的镜头声明式模型
 * [OUTPUT]: 对外提供 createSceneContent（纯内容渲染函数）与 buildGpuScenePlan（ShotGraph plan），
 *           把场景 beats 以「HTML surface 内容」的形式接入 Three-first GPU 合成
 * [POS]: scenarios/_shared 的 GPU 编排层。内容层 = 当前场景 beat + 字幕 + 交互 overlay（纯 frame 驱动）；
 *        效果层（post/transform/ambient 材质）由 buildGpuScenePlan 的 mapper 映射。
 *        字幕主题内部使用 Remotion hook，作为 DOM overlay 由 ProjectVideo 渲染，不进入纹理。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import type { Palette } from "../../palette";
import { buildGlobalCaptions, computeTimings, DefaultContentBeat, totalDurationFrames } from "./SceneEngine";
import type { BeatRenderer, Scene } from "./types";
import { resolveInteractionState } from "../../html-canvas/interaction";
import type { InteractionEvent, InteractionState, TargetMap } from "../../html-canvas/types";
import type { LensDescriptor, ShotGraphPlan } from "../../three/types";
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
  /** 目标几何（StagePlan.targets）：供交互 overlay 聚焦 */
  targets?: TargetMap;
  /** 是否绘制交互 overlay（cursor + focus dim）到内容表面；缺省 true */
  overlay?: boolean;
  width: number;
  height: number;
}

/** 场景 → ShotGraph 镜头的映射：效果/转场/环境/镜头均由场景决定，缺省 clean。 */
export interface SceneGpuPlanMappers {
  effectFor?: (scene: Scene) => MaterialId | undefined;
  transitionFor?: (scene: Scene) => MaterialId | undefined;
  ambientFor?: (scene: Scene) => MaterialId | undefined;
  lensFor?: (scene: Scene) => LensDescriptor | undefined;
  optionsFor?: (scene: Scene) => Record<string, unknown> | undefined;
  transitionDurationFrames?: number;
}

/** 帧驱动互动 overlay：focus dim（box-shadow 挖孔）+ cursor dot，纯 frame 输入。
 *  active=false（当前帧在互动窗口之外）时整体不渲染，避免 cursor 提前出现、
 *  hover 语义残留导致后续镜头被聚焦。 */
export const InteractionOverlay: React.FC<{
  interaction: InteractionState;
  targets?: TargetMap;
  accent: string;
  active: boolean;
}> = ({ interaction, targets, accent, active }) => {
  if (!active) return null;
  const focusTargetId = interaction.hoveredTargetId ?? interaction.pressedTargetId;
  const target = focusTargetId ? targets?.[focusTargetId] : undefined;
  const rect = target?.kind === "rect" ? target.rect : undefined;
  const radius = target?.kind === "rect" ? target.radius : 12;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {rect ? (
        <div
          style={{
            position: "absolute",
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            borderRadius: radius,
            boxShadow: `0 0 0 10000px rgba(0, 0, 0, 0.5), 0 0 0 3px ${accent}`,
          }}
        />
      ) : null}
      {interaction.pointer ? (
        <div
          style={{
            position: "absolute",
            left: interaction.pointer.x - 9,
            top: interaction.pointer.y - 9,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 0 2px ${accent}, 0 0 18px ${accent}`,
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

/** 把场景序列变成 (frame, fps) => ReactNode 的纯内容渲染函数（供 HtmlSurface 捕获）。 */
export const createSceneContent = ({
  palette: p,
  scenes,
  beats,
  defaultBeat,
  resolveMediaUrl,
  interaction: interactionEvents,
  targets,
  overlay = true,
  width,
  height,
}: SceneGpuOptions) => {
  return (frame: number, fps: number): React.ReactNode => {
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
    const interaction = resolveInteractionState(interactionEvents, frame);
    const Renderer = beats[current.scene.kind] ?? defaultBeat ?? DefaultContentBeat;
    const fadeIn = Math.min(1, local / 8);
    const fadeOut = Math.min(1, Math.max(0, (current.frames - local) / 8));
    const imageUrl = current.scene.imageAssetId
      ? resolveMediaUrl?.(current.scene.imageAssetId)
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
        <Renderer scene={current.scene} p={p} frame={local} fps={fps} width={width} height={height} resolveMediaUrl={resolveMediaUrl} interaction={interaction} />
        {overlay ? <InteractionOverlay interaction={interaction} targets={targets} accent={p.accent} active={interactionActive(frame)} /> : null}
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
      effectOptions: mappers.optionsFor?.(timing.scene),
    };
  });
  return { durationInFrames: totalDurationFrames(fps, scenes), shots };
};
