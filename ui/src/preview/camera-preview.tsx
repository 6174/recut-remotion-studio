/**
 * [INPUT]: 依赖 Remotion 帧时钟、ThreeVideoCanvas、CameraMoveDescriptor、SurfaceMoveDescriptor 与 MaterialElement。
 * [OUTPUT]: 对外提供 CameraPreview，以真实 Three camera、表面姿态轨和确定性样例纹理播放镜头层 preset。
 * [POS]: ui/preview 的镜头样片；EffectsFineTune 用它预览 catalog 中的 camera 条目，不伪造 CSS 动画；单张样片以倾斜快速落位展示 2.5D。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MaterialElement } from "@recut/remotion-kit";
import {
  RemotionFrameInvalidator,
  BrowserSurfaceShell,
  SurfacePlaneGeometry,
  ThreeVideoCanvas,
  resolveSurfaceTransform,
  type CameraMoveDescriptor,
  type SurfaceMoveDescriptor,
} from "@recut/remotion-kit/three";
import * as THREE from "three";

const PLANE_HEIGHT = 4.9;
const DURATION_IN_FRAMES = 180;

const CAMERA_PRESETS: Record<string, CameraMoveDescriptor> = {
  "camera-drift": {
    verb: "drift",
    subject: { anchor: [0.52, 0.48] },
    keyframes: [
      { at: 0, position: [-0.26, 0.14, 8.25], fov: 34 },
      { at: 0.16, position: [0.2, -0.08, 7.9], fov: 33, easing: "ease-out" },
      { at: 1, position: [0.2, -0.08, 7.9], fov: 33, easing: "linear" },
    ],
  },
  "camera-push-in": {
    verb: "push-in",
    subject: { anchor: [0.54, 0.5] },
    keyframes: [
      { at: 0, position: [0, 0, 8.2], fov: 34 },
      { at: 0.16, position: [0.1, -0.04, 5.9], fov: 30, easing: "ease-out" },
      { at: 1, position: [0.1, -0.04, 5.9], fov: 30, easing: "linear" },
    ],
  },
  "camera-pull-out": {
    verb: "pull-out",
    subject: { anchor: [0.52, 0.48] },
    keyframes: [
      { at: 0, position: [0.08, -0.03, 5.9], fov: 30 },
      { at: 0.16, position: [-0.12, 0.1, 8.3], fov: 34, easing: "ease-out" },
      { at: 1, position: [-0.12, 0.1, 8.3], fov: 34, easing: "linear" },
    ],
  },
  "camera-truck": {
    verb: "truck",
    subject: { anchor: [0.46, 0.5] },
    keyframes: [
      { at: 0, position: [-0.5, 0.02, 8], fov: 34 },
      { at: 0.16, position: [0.5, -0.02, 8], fov: 34, easing: "ease-out" },
      { at: 1, position: [0.5, -0.02, 8], fov: 34, easing: "linear" },
    ],
  },
  "camera-crane": {
    verb: "crane",
    subject: { anchor: [0.5, 0.46] },
    keyframes: [
      { at: 0, position: [-0.12, 0.42, 8.45], fov: 34 },
      { at: 0.16, position: [0.1, -0.14, 7.55], fov: 32, easing: "ease-out" },
      { at: 1, position: [0.1, -0.14, 7.55], fov: 32, easing: "linear" },
    ],
  },
  "camera-lens-inspect": {
    verb: "push-in",
    subject: { anchor: [0.68, 0.58] },
    keyframes: [
      { at: 0, position: [0, 0, 8.2], fov: 34 },
      { at: 0.16, position: [0.16, -0.08, 5.9], fov: 30, easing: "ease-out" },
      { at: 1, position: [0.16, -0.08, 5.9], fov: 30, easing: "linear" },
    ],
  },
  "surface-corner-curl": {
    verb: "push-in",
    subject: { anchor: [0.66, 0.34] },
    keyframes: [{ at: 0, position: [0.1, 0.02, 8.3], fov: 34 }, { at: 0.16, position: [0.08, -0.04, 6.7], fov: 32, easing: "ease-out" }, { at: 1, position: [0.08, -0.04, 6.7], fov: 32, easing: "linear" }],
  },
  "surface-dutch-settle": {
    verb: "locked",
    subject: { anchor: [0.5, 0.5] },
    keyframes: [{ at: 0, position: [0, 0, 8], fov: 34 }, { at: 1, position: [0, 0, 8], fov: 34, easing: "linear" }],
  },
  "surface-browser-rise": {
    verb: "crane",
    subject: { anchor: [0.5, 0.48] },
    keyframes: [{ at: 0, position: [-0.1, 0.32, 8.4], fov: 34 }, { at: 0.16, position: [0.06, -0.06, 7.25], fov: 32, easing: "ease-out" }, { at: 1, position: [0.06, -0.06, 7.25], fov: 32, easing: "linear" }],
  },
  "surface-cloth-breathe": {
    verb: "drift",
    subject: { anchor: [0.5, 0.5] },
    keyframes: [{ at: 0, position: [-0.08, 0.06, 8.15], fov: 34 }, { at: 0.16, position: [0.08, -0.04, 7.75], fov: 33, easing: "ease-out" }, { at: 1, position: [0.08, -0.04, 7.75], fov: 33, easing: "linear" }],
  },
};

const SURFACE_PRESETS: Record<string, SurfaceMoveDescriptor> = {
  "camera-drift": { keyframes: [{ at: 0, position: [-0.42, 0.2, -0.8], rotation: [0.05, -0.14, -0.03], scale: [0.88, 0.88, 1], bend: 0.18 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-push-in": { keyframes: [{ at: 0, position: [-0.6, 0.28, -1.25], rotation: [0.08, -0.22, -0.05], scale: [0.78, 0.78, 1], bend: 0.35 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-pull-out": { keyframes: [{ at: 0, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0 }, { at: 0.16, position: [0.5, -0.22, -1], rotation: [-0.06, 0.16, 0.04], scale: [0.82, 0.82, 1], bend: 0.22, easing: "ease-out" }] },
  "camera-truck": { keyframes: [{ at: 0, position: [-0.62, 0.12, -0.9], rotation: [0.04, -0.2, -0.04], scale: [0.84, 0.84, 1], bend: 0.24 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-crane": { keyframes: [{ at: 0, position: [0.1, 0.56, -1.2], rotation: [0.16, -0.08, -0.05], scale: [0.79, 0.79, 1], bend: 0.32 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-lens-inspect": { keyframes: [{ at: 0, position: [-0.54, 0.22, -1.2], rotation: [0.07, -0.2, -0.04], scale: [0.8, 0.8, 1], bend: 0.3 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "surface-corner-curl": { keyframes: [{ at: 0, position: [0.58, 0.3, -1.28], rotation: [0.14, 0.46, 0.18], scale: [0.76, 0.76, 1], bend: 0.14, corner: "top-right", cornerCurl: 0.82 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, corner: "top-right", cornerCurl: 0, easing: "ease-out" }] },
  "surface-dutch-settle": { keyframes: [{ at: 0, position: [-0.32, 0.16, -1.05], rotation: [0.08, -0.62, -0.48], scale: [0.82, 0.82, 1], bend: 0.2 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "surface-browser-rise": { shell: "browser", keyframes: [{ at: 0, position: [0.08, -0.58, -1.3], rotation: [0.34, -0.14, 0.04], scale: [0.76, 0.76, 1], bend: 0.12 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "surface-cloth-breathe": { cloth: { amplitude: 0.035, speed: 1.1, scale: 1.25 }, keyframes: [{ at: 0, position: [0.12, 0.26, -1.05], rotation: [0.08, -0.16, 0.03], scale: [0.84, 0.84, 1], bend: 0.28 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
};

const drawCameraFixture = (context: CanvasRenderingContext2D, width: number, height: number) => {
  context.fillStyle = "#0c1324";
  context.fillRect(0, 0, width, height);
  const glow = context.createRadialGradient(width * 0.68, height * 0.48, 16, width * 0.68, height * 0.48, width * 0.48);
  glow.addColorStop(0, "rgba(34, 211, 238, 0.28)");
  glow.addColorStop(1, "rgba(12, 19, 36, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#263652";
  context.fillRect(width * 0.54, height * 0.16, width * 0.34, height * 0.68);
  context.fillStyle = "#15233d";
  context.fillRect(width * 0.58, height * 0.23, width * 0.26, height * 0.13);
  context.fillStyle = "#22d3ee";
  context.fillRect(width * 0.08, height * 0.18, width * 0.16, height * 0.018);
  context.fillStyle = "#e7f4ff";
  context.font = `800 ${Math.round(height * 0.08)}px system-ui, sans-serif`;
  context.fillText("CAMERA", width * 0.08, height * 0.39);
  context.fillStyle = "#8fa7c7";
  context.font = `600 ${Math.round(height * 0.03)}px system-ui, sans-serif`;
  context.fillText("Three camera · subject anchor", width * 0.08, height * 0.47);
  context.fillText("deterministic keyframes", width * 0.08, height * 0.52);
  context.fillStyle = "#38bdf8";
  context.fillRect(width * 0.08, height * 0.62, width * 0.3, height * 0.008);
  context.fillStyle = "#ffffff";
  context.font = `900 ${Math.round(height * 0.1)}px system-ui, sans-serif`;
  context.fillText("LOOK HERE", width * 0.08, height * 0.74);
  context.fillStyle = "#22d3ee";
  context.beginPath();
  context.arc(width * 0.68, height * 0.58, Math.max(8, Math.round(height * 0.026)), 0, Math.PI * 2);
  context.fill();
};

const useCameraTexture = (width: number, height: number) => {
  const [texture] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const output = new THREE.CanvasTexture(canvas);
    output.colorSpace = THREE.SRGBColorSpace;
    output.minFilter = THREE.LinearFilter;
    output.magFilter = THREE.LinearFilter;
    return output;
  });

  useLayoutEffect(() => {
    drawCameraFixture(texture.image.getContext("2d") as CanvasRenderingContext2D, width, height);
    texture.needsUpdate = true;
  }, [height, texture, width]);
  useLayoutEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

const CameraFixtureSurface: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const texture = useCameraTexture(width, height);
  const isLensInspect = id === "camera-lens-inspect";
  const isBrowserShell = isLensInspect || id === "surface-browser-rise";
  const progress = (frame % DURATION_IN_FRAMES) / Math.max(1, DURATION_IN_FRAMES - 1);
  const surface = resolveSurfaceTransform(SURFACE_PRESETS[id], progress);
  return (
    <ThreeVideoCanvas
      background="#0c1324"
      cameraMove={CAMERA_PRESETS[id] ?? CAMERA_PRESETS["camera-drift"]}
      cameraProgress={progress}
    >
      <group position={surface.position} rotation={surface.rotation as unknown as THREE.Euler} scale={surface.scale}>
        {isBrowserShell ? <BrowserSurfaceShell height={PLANE_HEIGHT} width={(width / height) * PLANE_HEIGHT} /> : null}
        <mesh>
          <SurfacePlaneGeometry bend={surface.bend} cloth={SURFACE_PRESETS[id]?.cloth} corner={surface.corner} cornerCurl={surface.cornerCurl} height={PLANE_HEIGHT} time={frame / fps} width={(width / height) * PLANE_HEIGHT} />
          {isLensInspect ? (
            <MaterialElement
              frame={frame}
              fps={fps}
              height={height}
              id="magnify"
              map={texture}
              options={{ center: [0.68, 0.42], zoom: 1.75, radius: 138, hud: 0.78 }}
              width={width}
            />
          ) : (
            <meshBasicMaterial map={texture} toneMapped={false} />
          )}
        </mesh>
      </group>
      <RemotionFrameInvalidator />
    </ThreeVideoCanvas>
  );
};

export const CameraPreview: React.FC<{ id: string }> = ({ id }) =>
  <CameraFixtureSurface id={id} />;
