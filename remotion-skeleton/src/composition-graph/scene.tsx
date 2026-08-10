/**
 * [INPUT]: 依赖 R3F、Three、Remotion 帧时钟、HTML texture renderer 与 CanvasUI 语义 effect materials
 * [OUTPUT]: 对外提供 CompositionGraphScene，以全幅 Three composition 表达 24 个五秒 Remotion 镜头
 * [POS]: composition-graph 的 GPU renderer；HTML 只以纹理输入存在，画面空间、转场和特效均由 Three nodes 完成
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useFrame, useThree } from "@react-three/fiber";
import {
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { HtmlBubbleMaterial } from "./bubble-material";
import { HtmlArticleHighlightMaterial } from "./article-highlight-material";
import { HtmlBendMaterial } from "./bend-material";
import { CanvasUiCloudsMaterial } from "./clouds-material";
import { HtmlCrtMaterial } from "./crt-material";
import { HtmlGlitchMaterial } from "./glitch-material";
import { HtmlGlassMaterial } from "./glass-material";
import { useHtmlInCanvasTexture } from "./html-in-canvas-texture";
import { useHtmlTexture } from "./html-texture";
import { HtmlMagnifyMaterial } from "./magnify-material";
import { HtmlStorePeelMaterial } from "./store-peel-material";
import { HtmlVintageMaterial } from "./vintage-material";
import { sceneFor, type ShotId } from "./shots/scenes";
import { shotAt } from "./timeline";

type HtmlRasterizer = "foreign-object" | "html-in-canvas";

const FRAME_HEIGHT = 4.9;
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// Remotion 的 shot progress 是唯一时钟：透镜扫过锚点，而非停留成一个静态滤镜。
const scanLens = (
  anchor: readonly [number, number],
  progress: number,
  start: number,
  travel: number,
): [number, number] => {
  const scan = smooth((progress - start) / Math.max(1 - start, 0.01));
  const offsetX = (scan - 0.5) * travel;
  const offsetY = Math.sin(scan * Math.PI) * 0.035;
  return [clamp(anchor[0] + offsetX), clamp(anchor[1] + offsetY)];
};

const drawMediaPreview = (
  context: CanvasRenderingContext2D,
  id: ShotId,
  time: number,
) => {
  context.fillStyle = "#0d1926";
  context.fillRect(0, 0, 960, 540);
  context.fillStyle = "#14273a";
  context.fillRect(28, 28, 904, 392);
  const glow = context.createRadialGradient(670, 175, 10, 670, 175, 360);
  glow.addColorStop(0, "#4a78d8");
  glow.addColorStop(0.48, "#234b76");
  glow.addColorStop(1, "#101f31");
  context.fillStyle = glow;
  context.fillRect(28, 28, 904, 392);
  context.fillStyle = "rgba(105, 227, 186, 0.95)";
  context.fillRect(86, 92, 240, 10);
  context.fillStyle = "#f3f7fa";
  context.font = "700 54px Arial";
  context.fillText("LIVE COMPOSITION", 82, 184);
  context.fillStyle = "#b9d0dc";
  context.font = "32px Arial";
  context.fillText(id.toUpperCase(), 82, 238);
  context.fillStyle = "#69e3ba";
  context.fillRect(82, 308, 376, 14);
  context.fillStyle = "#f3f7fa";
  context.beginPath();
  context.arc(760, 227, 84, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#3156c6";
  context.beginPath();
  context.arc(760, 227, 62, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#69e3ba";
  context.fillRect(28, 454, 904, 42);
  context.fillStyle = "#071019";
  context.fillRect(44, 470, 850, 10);
  context.fillStyle = "#f3f7fa";
  context.fillRect(44, 470, ((time % 5) / 5) * 850, 10);
};

const useMediaTexture = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    const output = new THREE.CanvasTexture(canvas);
    output.colorSpace = THREE.SRGBColorSpace;
    output.minFilter = THREE.LinearFilter;
    output.magFilter = THREE.LinearFilter;
    return output;
  }, []);
  const shot = shotAt(frame, fps);
  useLayoutEffect(() => {
    drawMediaPreview(
      texture.image.getContext("2d") as CanvasRenderingContext2D,
      shot.id,
      frame / fps,
    );
    texture.needsUpdate = true;
  }, [frame, fps, shot.id, texture]);
  useLayoutEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

interface HtmlFrameProps {
  id: ShotId;
  progress: number;
  frame: number;
  fps: number;
  magnify: boolean;
  texture: THREE.Texture;
  width: number;
  height: number;
}

const HtmlFrame = ({
  id,
  progress,
  frame,
  fps,
  magnify,
  texture,
  width,
  height,
}: HtmlFrameProps) => {
  const enter = smooth(progress / 0.13);
  const renderer = sceneFor(id);
  const lensAnchor = renderer.lens ?? ([0.5, 0.5] as const);
  const lensCenter: [number, number] = [lensAnchor[0], 1 - lensAnchor[1]];
  const activeEffect =
    progress < 0.2 && renderer.transition !== "clean"
      ? renderer.transition
      : renderer.effect;
  const lensStart = renderer.lensStart ?? 0;
  const movingLensCenter = scanLens(
    lensCenter,
    progress,
    lensStart,
    renderer.lensTravel ?? 0.28,
  );
  const showMagnify =
    activeEffect === "magnify" && magnify && progress >= lensStart;
  const material =
    activeEffect === "store-peel" ? (
      <HtmlStorePeelMaterial
        height={height}
        progress={progress / 0.2}
        texture={texture}
        time={frame / fps}
        width={width}
      />
    ) : activeEffect === "bend" ? (
      <HtmlBendMaterial bend={(1 - enter) * 1.12} texture={texture} />
    ) : showMagnify ? (
      <HtmlMagnifyMaterial
        center={movingLensCenter}
        height={height}
        texture={texture}
        width={width}
        zoom={1.7}
      />
    ) : activeEffect === "glitch" ? (
      <HtmlGlitchMaterial
        aspect={width / height}
        intensity={1.35}
        texture={texture}
        time={progress * 3.7}
      />
    ) : activeEffect === "glass" ? (
      <HtmlGlassMaterial
        center={lensCenter}
        texture={texture}
        height={height}
        width={width}
        zoom={1.34}
      />
    ) : activeEffect === "bubble" ? (
      <HtmlBubbleMaterial
        aspect={width / height}
        height={height}
        intensity={1}
        texture={texture}
        time={frame / fps}
        width={width}
      />
    ) : activeEffect === "crt" ? (
      <HtmlCrtMaterial
        height={height}
        texture={texture}
        time={frame / fps}
        width={width}
      />
    ) : activeEffect === "vintage" ? (
      <HtmlVintageMaterial
        height={height}
        texture={texture}
        time={frame / fps}
        width={width}
      />
    ) : activeEffect === "article-highlight" ? (
      <HtmlArticleHighlightMaterial
        height={height}
        texture={texture}
        width={width}
      />
    ) : (
      <meshBasicMaterial map={texture} toneMapped={false} />
    );
  const turn = activeEffect === "bend" ? (1 - enter) * 0.15 : 0;
  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[0, turn, 0]}
      scale={[1 + (1 - enter) * 0.035, 1 + (1 - enter) * 0.035, 1]}
    >
      <planeGeometry
        args={[(width / height) * FRAME_HEIGHT, FRAME_HEIGHT, 32, 1]}
      />
      {material}
    </mesh>
  );
};

const ForeignObjectHtmlNode: React.FC<{
  animate: boolean;
  magnify: boolean;
}> = ({ animate, magnify }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { texture, width, height } = useHtmlTexture({ animate, frame, fps });
  const shot = shotAt(frame, fps);
  return (
    <HtmlFrame
      id={shot.id}
      progress={shot.progress}
      frame={frame}
      fps={fps}
      height={height}
      magnify={magnify}
      texture={texture}
      width={width}
    />
  );
};

const HtmlInCanvasNode: React.FC<{ animate: boolean; magnify: boolean }> = ({
  animate,
  magnify,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { texture, width, height, status } = useHtmlInCanvasTexture({
    animate,
    frame,
    fps,
  });
  if (status !== "verified") {
    return <ForeignObjectHtmlNode animate={animate} magnify={magnify} />;
  }
  const shot = shotAt(frame, fps);
  return (
    <HtmlFrame
      id={shot.id}
      progress={shot.progress}
      frame={frame}
      fps={fps}
      height={height}
      magnify={magnify}
      texture={texture}
      width={width}
    />
  );
};

const HtmlNode: React.FC<{
  animate: boolean;
  magnify: boolean;
  rasterizer: HtmlRasterizer;
}> = ({ animate, magnify, rasterizer }) =>
  rasterizer === "html-in-canvas" ? (
    <HtmlInCanvasNode animate={animate} magnify={magnify} />
  ) : (
    <ForeignObjectHtmlNode animate={animate} magnify={magnify} />
  );

const MediaNode = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shot = shotAt(frame, fps);
  const texture = useMediaTexture();
  if (!sceneFor(shot.id).media) return null;
  const enter = smooth(shot.progress / 0.17);
  return (
    <mesh
      position={[1.87, -0.18, 0.18]}
      rotation={[0, -0.12, 0.012]}
      scale={0.8 + enter * 0.2}
    >
      <planeGeometry args={[3.02, 1.7]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const CloudsNode = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const shot = shotAt(frame, fps);
  const opacity =
    sceneFor(shot.id).effect === "clouds"
      ? 0.74 * smooth(shot.progress / 0.18) * smooth((1 - shot.progress) / 0.18)
      : 0;
  return (
    <mesh position={[0, 0, 0.12]} renderOrder={2}>
      <planeGeometry args={[(width / height) * FRAME_HEIGHT, FRAME_HEIGHT]} />
      <CanvasUiCloudsMaterial opacity={opacity} time={frame / fps} />
    </mesh>
  );
};

const PerformanceProbe = () => {
  const { isRendering } = useRemotionEnvironment();
  const lastSample = useRef(performance.now());
  const frames = useRef(0);
  useFrame(() => {
    if (isRendering) return;
    frames.current += 1;
    const now = performance.now();
    if (now - lastSample.current < 500) return;
    window.dispatchEvent(
      new CustomEvent("composition-graph-metrics", {
        detail: {
          fps: Math.round((frames.current * 1000) / (now - lastSample.current)),
        },
      }),
    );
    frames.current = 0;
    lastSample.current = now;
  });
  return null;
};

const RemotionFrameInvalidator = () => {
  const frame = useCurrentFrame();
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => invalidate(), [frame, invalidate]);
  return null;
};

export const CompositionGraphScene: React.FC<{
  htmlAnimation: boolean;
  magnify: boolean;
  htmlRasterizer: HtmlRasterizer;
}> = ({ htmlAnimation, magnify, htmlRasterizer }) => (
  <>
    <color attach="background" args={["#08131f"]} />
    <HtmlNode
      animate={htmlAnimation}
      magnify={magnify}
      rasterizer={htmlRasterizer}
    />
    <MediaNode />
    <CloudsNode />
    <PerformanceProbe />
    <RemotionFrameInvalidator />
  </>
);
