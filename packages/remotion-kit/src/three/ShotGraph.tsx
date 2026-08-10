/**
 * [INPUT]: 依赖 HtmlSurfaceProvider/HtmlSurfacePlane、MediaTexture、MaterialElement、Remotion 帧时钟与 ShotGraphPlan
 * [OUTPUT]: 对外提供 ShotGraph：按当前镜头把内容以 Sequence 包进 HtmlSurfaceProvider（真实树光栅化），
 *           并在 ThreeVideoCanvas 场景内挂载内容平面、媒体证据平面、效果/转场材质与环境材质
 * [POS]: remotion-kit/src/three 的镜头装配层。镜头 descriptor 只声明内容与材质 id；
 *        内容在真实 React 树内渲染（hooks 可用），经 Sequence 获得镜头局部帧。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import * as THREE from "three";
import { MaterialElement } from "../materials/MaterialElement";
import { HtmlSurfacePlane, HtmlSurfaceProvider } from "./HtmlSurface";
import type { HtmlSurfaceRasterizer } from "./HtmlSurface";
import type { ShotAt, ShotGraphPlan } from "./types";
import { shotAt } from "./types";
import { RemotionFrameInvalidator, seekSmooth } from "./timing";
import { ThreeVideoCanvas } from "./ThreeVideoCanvas";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const PLANE_HEIGHT = 4.9;

/** 扫描镜头：Remotion shot progress 是唯一时钟，透镜扫过锚点而非停留成静态滤镜。 */
const scanLens = (
  anchor: readonly [number, number],
  progress: number,
  start: number,
  travel: number,
): readonly [number, number] => {
  const scan = seekSmooth((progress - start) / Math.max(1 - start, 0.01));
  const offsetX = (scan - 0.5) * travel;
  const offsetY = Math.sin(scan * Math.PI) * 0.035;
  return [clamp(anchor[0] + offsetX), clamp(anchor[1] + offsetY)];
};

export type EffectPhase = "transition" | "effect";

export interface ShotGraphProps {
  plan: ShotGraphPlan;
  /** HTML 内容分发：按当前镜头返回纯 React 内容；内容运行在真实树内，Remotion hooks 可用 */
  renderContent: (shot: ShotAt) => React.ReactNode;
  /** 媒体证据平面：返回 null 表示当前镜头不渲染媒体 */
  renderMedia?: (shot: ShotAt) => React.ReactNode;
  /** 语义参数动态派生：可以按 shot/progress/phase 覆盖 opacity、center、zoom 等 */
  resolveEffectOptions?: (
    shot: ShotAt,
    progress: number,
    phase: EffectPhase,
  ) => Record<string, unknown>;
  /** 内容画布像素尺寸（缺省取 composition 尺寸） */
  width?: number;
  height?: number;
  rasterizer?: HtmlSurfaceRasterizer;
  onRasterized?: (metrics: {
    adapter: HtmlSurfaceRasterizer;
    status: string;
    duration?: number;
  }) => void;
  background?: string;
  camera?: { fov?: number; position?: readonly [number, number, number] };
}

const ShotGraphScene: React.FC<{
  shot: ShotAt;
  renderMedia?: ShotGraphProps["renderMedia"];
  resolveEffectOptions?: ShotGraphProps["resolveEffectOptions"];
  width?: number;
  height?: number;
}> = ({ shot, renderMedia, resolveEffectOptions, width, height }) => {
  const { fps, width: videoWidth, height: videoHeight } = useVideoConfig();
  const canvasWidth = width ?? videoWidth;
  const canvasHeight = height ?? videoHeight;
  const progress = shot.progress;
  const descriptor = shot.descriptor;
  const framesPerShot = shot.frames;

  const transition =
    descriptor.transition &&
    progress * framesPerShot < descriptor.transition.durationFrames
      ? descriptor.transition
      : undefined;
  const phase: EffectPhase = transition ? "transition" : "effect";

  const media = descriptor.content === "media" || descriptor.content === "both"
    ? renderMedia?.(shot)
    : null;
  const hasHtml = descriptor.content === "html" || descriptor.content === "both";

  const baseOptions =
    phase === "transition" && transition
      ? {
          ...(descriptor.effectOptions ?? {}),
          progress: clamp((progress * framesPerShot) / transition.durationFrames),
        }
      : (descriptor.effectOptions ?? {});
  const mergedOptions = {
    ...baseOptions,
    ...(resolveEffectOptions?.(shot, progress, phase) ?? {}),
  };

  // 光学镜头（magnify/glass）：由 shot progress 派生扫描中心，覆盖静态 center。
  const isLensEffect = descriptor.effect === "magnify" || descriptor.effect === "glass";
  const lensOptions =
    phase === "effect" && descriptor.lens && isLensEffect
      ? {
          ...mergedOptions,
          center: scanLens(
            [descriptor.lens.anchor[0], 1 - descriptor.lens.anchor[1]],
            progress,
            descriptor.lens.start,
            descriptor.lens.travel,
          ),
        }
      : mergedOptions;

  const materialId =
    phase === "transition" && transition
      ? transition.material
      : phase === "effect"
        ? descriptor.effect
        : undefined;

  const material = (texture: THREE.Texture) => (
    <MaterialElement
      id={materialId as NonNullable<typeof materialId>}
      map={texture}
      frame={shot.start + shot.frame}
      fps={fps}
      height={canvasHeight}
      options={lensOptions}
      width={canvasWidth}
    />
  );

  return (
    <>
      {hasHtml ? (
        <HtmlSurfacePlane material={materialId ? material : undefined} />
      ) : null}
      {media}
      {descriptor.ambient ? (
        <mesh position={[0, 0, 0.12]} renderOrder={2}>
          <planeGeometry args={[(videoWidth / videoHeight) * PLANE_HEIGHT, PLANE_HEIGHT]} />
          <MaterialElement
            id={descriptor.ambient}
            map={null}
            frame={shot.start + shot.frame}
            fps={fps}
            height={canvasHeight}
            options={mergedOptions}
            width={canvasWidth}
          />
        </mesh>
      ) : null}
      <RemotionFrameInvalidator />
    </>
  );
};

/**
 * ShotGraph：整支成片的镜头装配根。内容经 HtmlSurfaceProvider 在真实树内光栅化为纹理，
 * 场景（平面 + 材质）在 ThreeVideoCanvas 内绘制；字幕/BGM 由调用方作为 DOM overlay 叠加。
 */
export const ShotGraph: React.FC<ShotGraphProps> = ({
  plan,
  renderContent,
  renderMedia,
  resolveEffectOptions,
  width,
  height,
  rasterizer,
  onRasterized,
  background = "#08131f",
  camera,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shot = shotAt(frame, fps, plan);
  const content = (
    <Sequence from={shot.start} durationInFrames={shot.frames} name={`shot-${shot.id}`}>
      {renderContent(shot)}
    </Sequence>
  );
  return (
    <HtmlSurfaceProvider
      content={content}
      frame={frame}
      fps={fps}
      height={height}
      onRasterized={onRasterized}
      rasterizer={rasterizer}
      width={width}
    >
      <ThreeVideoCanvas background={background} camera={camera}>
        <ShotGraphScene
          height={height}
          renderMedia={renderMedia}
          resolveEffectOptions={resolveEffectOptions}
          shot={shot}
          width={width}
        />
      </ThreeVideoCanvas>
    </HtmlSurfaceProvider>
  );
};
