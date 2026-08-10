/**
 * [INPUT]: 依赖 R3F、Three、Remotion 帧时钟与 HTML texture renderer
 * [OUTPUT]: 对外提供 CompositionGraphScene、统一绘制 HTML、媒体、AI 对象和 GPU 特效节点
 * [POS]: composition-graph 的 GPU renderer；每个 visual node 仅从当前 Remotion frame 派生状态
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
import { useHtmlTexture } from "./html-texture";
import { useHtmlInCanvasTexture } from "./html-in-canvas-texture";
import { HtmlMagnifyMaterial } from "./magnify-material";

const particlePosition = (index: number) =>
  [
    ((index * 37) % 97) / 18 - 2.7,
    ((index * 53) % 89) / 18 - 2.45,
    ((index * 71) % 83) / 28 - 1.45,
  ] as const;

const useMediaTexture = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 360;
    const output = new THREE.CanvasTexture(canvas);
    output.colorSpace = THREE.SRGBColorSpace;
    output.minFilter = THREE.LinearMipmapLinearFilter;
    output.magFilter = THREE.LinearFilter;
    return output;
  }, []);
  const phase = frame / fps;
  useLayoutEffect(() => {
    const context = texture.image.getContext("2d") as CanvasRenderingContext2D;
    const gradient = context.createLinearGradient(0, 0, 720, 360);
    gradient.addColorStop(0, "#4b1f80");
    gradient.addColorStop(0.52, "#126a76");
    gradient.addColorStop(1, "#b75b3a");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 720, 360);
    context.fillStyle = "rgba(247, 250, 252, 0.72)";
    for (let index = 0; index < 12; index += 1)
      context.fillRect(((index * 86 + phase * 38) % 824) - 52, 0, 12, 360);
    texture.needsUpdate = true;
  }, [phase, texture]);
  return texture;
};

type HtmlRasterizer = "foreign-object" | "html-in-canvas";

interface HtmlCardProps {
  frame: number;
  fps: number;
  magnify: boolean;
  texture: THREE.Texture;
  width: number;
  height: number;
}

const HtmlCard = ({
  frame,
  fps,
  magnify,
  texture,
  width,
  height,
}: HtmlCardProps) => {
  const rise = Math.min(1, frame / 22);
  const seconds = frame / fps;
  const center: [number, number] = [
    0.5 + Math.sin(seconds * 0.9) * 0.19,
    0.52 + Math.cos(seconds * 1.1) * 0.1,
  ];
  return (
    <mesh
      position={[-0.26, 0.44 + (1 - rise) * 0.26, 0]}
      rotation={[0, -0.16, -0.03]}
    >
      <planeGeometry args={[5.9, (5.9 * height) / width]} />
      {magnify ? (
        <HtmlMagnifyMaterial
          aspect={width / height}
          center={center}
          intensity={0.92}
          radius={0.145}
          texture={texture}
          zoom={1.62}
        />
      ) : (
        <meshStandardMaterial
          map={texture}
          emissive="#425d86"
          emissiveMap={texture}
          emissiveIntensity={0.18}
        />
      )}
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
  return (
    <HtmlCard
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
  const { texture, width, height } = useHtmlInCanvasTexture({
    animate,
    frame,
    fps,
  });
  return (
    <HtmlCard
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
}> = ({ animate, magnify, rasterizer }) => {
  return rasterizer === "html-in-canvas" ? (
    <HtmlInCanvasNode animate={animate} magnify={magnify} />
  ) : (
    <ForeignObjectHtmlNode animate={animate} magnify={magnify} />
  );
};

const MediaNode = () => {
  const texture = useMediaTexture();
  return (
    <mesh position={[1.42, -1.22, 0.46]} rotation={[0, 0.16, 0.06]}>
      <planeGeometry args={[3.25, 1.63]} />
      <meshStandardMaterial
        map={texture}
        emissive="#2e6570"
        emissiveMap={texture}
        emissiveIntensity={0.28}
      />
    </mesh>
  );
};

const AiObjectNode = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  return (
    <mesh
      position={[-2.42, -1.32, 0.75]}
      rotation={[seconds * 0.35, seconds * 0.6, 0]}
    >
      <sphereGeometry args={[0.63, 64, 48]} />
      <meshStandardMaterial
        color="#79f5bc"
        emissive="#1c7c6c"
        emissiveIntensity={0.8}
        roughness={0.28}
        metalness={0.58}
      />
    </mesh>
  );
};

const ParticleNode = () => {
  const positions = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: 90 }, (_, index) =>
          particlePosition(index),
        ).flat(),
      ),
    [],
  );
  return (
    <points position={[0, 0, -0.85]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#9fb9d8"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
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
}> = ({ htmlAnimation, magnify, htmlRasterizer }) => {
  const { width, height } = useVideoConfig();
  return (
    <>
      <color attach="background" args={["#071019"]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 3, 4]} intensity={2.1} color="#b6d8ff" />
      <pointLight
        position={[-3, -1, 2]}
        intensity={18}
        color="#74f3ba"
        distance={8}
      />
      <HtmlNode
        animate={htmlAnimation}
        magnify={magnify}
        rasterizer={htmlRasterizer}
      />
      <MediaNode />
      <AiObjectNode />
      <ParticleNode />
      <PerformanceProbe />
      <RemotionFrameInvalidator />
      <mesh position={[0, 0, -1.25]}>
        <planeGeometry args={[(width / height) * 6.8, 6.8]} />
        <meshBasicMaterial color="#0a1722" />
      </mesh>
    </>
  );
};
