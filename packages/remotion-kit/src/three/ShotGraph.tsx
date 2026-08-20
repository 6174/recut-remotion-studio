/**
 * [INPUT]: 依赖 HtmlSurfaceProvider/FrozenSurface/HtmlSurfacePlane、MediaTexture、MaterialElement、
 *          transition A/B 转场材质、Remotion 帧时钟与 ShotGraphPlan
 * [OUTPUT]: 对外提供 ShotGraph：按当前镜头把内容以 Sequence 包进 HtmlSurfaceProvider（真实树光栅化），
 *           在 ThreeVideoCanvas 场景内挂载有真实姿态的内容平面与可替换外壳、媒体证据平面、效果/转场材质与环境材质；
 *           A/B 转场（remotion transitions）用 FrozenSurface 冻结前镜头纹理作为输入 A
 * [POS]: remotion-kit/src/three 的镜头装配层。镜头 descriptor 声明内容、材质与可选 Three camera 轨；
 *        内容在真实 React 树内渲染（hooks 可用），经 Sequence 获得镜头局部帧。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import * as THREE from "three";
import { MaterialElement } from "../materials/MaterialElement";
import type { MaterialId } from "../materials/types";
import { AB_TRANSITIONS } from "../materials/transition/types";
import { FadeTransitionMaterial } from "../materials/transition/fade-material";
import { SlideTransitionMaterial } from "../materials/transition/slide-material";
import { WipeTransitionMaterial } from "../materials/transition/wipe-material";
import { FlipTransitionMaterial } from "../materials/transition/flip-material";
import { ClockWipeTransitionMaterial } from "../materials/transition/clock-wipe-material";
import { IrisTransitionMaterial } from "../materials/transition/iris-material";
import { CrossZoomTransitionMaterial } from "../materials/transition/cross-zoom-material";
import {
  FrozenSurface,
  HtmlSurfacePlane,
  HtmlSurfaceProvider,
  useFrozenSurfaceTexture,
  useHtmlSurfaceTexture,
} from "./HtmlSurface";
import type { HtmlSurfaceRasterizer } from "./HtmlSurface";
import type { CameraDescriptor, ShotAt, ShotGraphPlan } from "./types";
import { shotAt } from "./types";
import { RemotionFrameInvalidator, seekSmooth } from "./timing";
import { ThreeVideoCanvas } from "./ThreeVideoCanvas";
import { resolveSurfaceTransform } from "./SurfaceMotion";
import { BrowserSurfaceShell } from "./SurfaceShell";

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
  /** 整支片的静态基础机位；逐镜头运动由 ShotDescriptor.camera 接管。 */
  camera?: CameraDescriptor;
}

/** 按转场材质 id 挂载 A/B 双输入转场材质。 */
const AbTransitionMaterial: React.FC<{
  material: string;
  mapA: THREE.Texture;
  mapB: THREE.Texture;
  progress: number;
  width: number;
  height: number;
}> = ({ material, mapA, mapB, progress, width, height }) => {
  switch (material) {
    case "slide":
      return <SlideTransitionMaterial mapA={mapA} mapB={mapB} progress={progress} width={width} height={height} direction="from-left" />;
    case "wipe":
      return <WipeTransitionMaterial mapA={mapA} mapB={mapB} progress={progress} width={width} height={height} direction="from-left" />;
    case "flip":
      return <FlipTransitionMaterial mapA={mapA} mapB={mapB} progress={progress} width={width} height={height} />;
    case "clock-wipe":
      return <ClockWipeTransitionMaterial mapA={mapA} mapB={mapB} progress={progress} width={width} height={height} />;
    case "iris":
      return <IrisTransitionMaterial mapA={mapA} mapB={mapB} progress={progress} width={width} height={height} />;
    case "cross-zoom":
      return <CrossZoomTransitionMaterial mapA={mapA} mapB={mapB} progress={progress} width={width} height={height} />;
    case "fade":
    default:
      return <FadeTransitionMaterial mapA={mapA} mapB={mapB} progress={progress} width={width} height={height} />;
  }
};

const ShotGraphScene: React.FC<{
  shot: ShotAt;
  inTransition: boolean;
  renderMedia?: ShotGraphProps["renderMedia"];
  resolveEffectOptions?: ShotGraphProps["resolveEffectOptions"];
  width?: number;
  height?: number;
}> = ({ shot, inTransition, renderMedia, resolveEffectOptions, width, height }) => {
  const { fps, width: videoWidth, height: videoHeight } = useVideoConfig();
  const canvasWidth = width ?? videoWidth;
  const canvasHeight = height ?? videoHeight;
  const frozen = useFrozenSurfaceTexture();
  const live = useHtmlSurfaceTexture();
  const progress = shot.progress;
  const descriptor = shot.descriptor;
  const framesPerShot = shot.frames;
  const transition = inTransition ? descriptor.transition : undefined;
  const phase: EffectPhase = transition ? "transition" : "effect";
  const transitionProgress = transition
    ? clamp((progress * framesPerShot) / transition.durationFrames)
    : 0;

  // A/B 双输入转场：frozen.texture = 前镜头 A，live.texture = 当前镜头 B
  const isAb = Boolean(transition && AB_TRANSITIONS.has(transition.material));
  if (isAb && transition && frozen.texture && live.texture) {
    return (
      <mesh>
        <planeGeometry args={[(canvasWidth / canvasHeight) * PLANE_HEIGHT, PLANE_HEIGHT, 32, 32]} />
        <AbTransitionMaterial
          height={canvasHeight}
          mapA={frozen.texture}
          mapB={live.texture}
          material={transition.material}
          progress={transitionProgress}
          width={canvasWidth}
        />
        <RemotionFrameInvalidator />
      </mesh>
    );
  }

  const media = descriptor.content === "media" || descriptor.content === "both"
    ? renderMedia?.(shot)
    : null;
  const hasHtml = descriptor.content === "html" || descriptor.content === "both";

  const baseOptions =
    phase === "transition" && transition
      ? {
          ...(descriptor.effectOptions ?? {}),
          progress: transitionProgress,
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

  // A/B 转场由 AbTransitionMaterial 消费两张纹理，绝不能误挂到单输入 MaterialElement。
  const materialId: MaterialId | undefined =
    phase === "transition" && transition && !AB_TRANSITIONS.has(transition.material)
      ? transition.material as MaterialId
      : phase === "effect"
        ? descriptor.effect
        : undefined;

  const material = materialId
    ? (texture: THREE.Texture) => (
        <MaterialElement
          id={materialId}
          map={texture}
          frame={shot.start + shot.frame}
          fps={fps}
          height={canvasHeight}
          options={lensOptions}
          width={canvasWidth}
        />
      )
    : undefined;
  const surface = resolveSurfaceTransform(descriptor.surface, progress);

  return (
    <>
      {hasHtml ? (
        <group
          position={surface.position as [number, number, number]}
          rotation={surface.rotation as [number, number, number]}
          scale={surface.scale as [number, number, number]}
        >
          {descriptor.surface?.shell === "browser" ? (
            <BrowserSurfaceShell height={PLANE_HEIGHT} width={(canvasWidth / canvasHeight) * PLANE_HEIGHT} />
          ) : null}
          <HtmlSurfacePlane bend={surface.bend} cloth={descriptor.surface?.cloth} corner={surface.corner} cornerCurl={surface.cornerCurl} material={material} time={(shot.start + shot.frame) / fps} />
        </group>
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
 * 场景（平面 + 材质）在 ThreeVideoCanvas 内绘制；A/B 转场用 FrozenSurface 冻结前镜头纹理。
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
  background = "#070c08",
  camera,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shot = shotAt(frame, fps, plan);
  const canvasWidth = width ?? 1920;
  const canvasHeight = height ?? 1080;

  const transition = shot.descriptor.transition;
  const inTransition = Boolean(
    transition && shot.progress * shot.frames < transition.durationFrames,
  );
  const isAb = Boolean(transition && AB_TRANSITIONS.has(transition.material));

  const content = (
    <Sequence from={shot.start} durationInFrames={shot.frames} name={`shot-${shot.id}`}>
      {renderContent(shot)}
    </Sequence>
  );

  // A/B 转场：冻结前镜头的最后一帧作为输入 A。
  let frozenContent: React.ReactNode = null;
  if (inTransition && isAb && shot.index > 0) {
    const prevShot = shotAt(Math.max(0, shot.start - 1), fps, plan);
    frozenContent = (
      <Sequence from={prevShot.start} durationInFrames={prevShot.frames} name={`prev-${prevShot.id}`}>
        {renderContent(prevShot)}
      </Sequence>
    );
  }

  const scene = (
    <ShotGraphScene
      height={height}
      inTransition={inTransition}
      renderMedia={renderMedia}
      resolveEffectOptions={resolveEffectOptions}
      shot={shot}
      width={width}
    />
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
      {frozenContent ? (
        <FrozenSurface content={frozenContent} height={canvasHeight} rasterizer={rasterizer} width={canvasWidth}>
          <ThreeVideoCanvas background={background} camera={camera} cameraMove={shot.descriptor.camera} cameraProgress={shot.progress}>
            {scene}
          </ThreeVideoCanvas>
        </FrozenSurface>
      ) : (
        <ThreeVideoCanvas background={background} camera={camera} cameraMove={shot.descriptor.camera} cameraProgress={shot.progress}>
          {scene}
        </ThreeVideoCanvas>
      )}
    </HtmlSurfaceProvider>
  );
};
