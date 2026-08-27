/**
 * [INPUT]: @react-three/fiber、drei（Grid/OrbitControls/TransformControls）、three RoundedBoxGeometry、
 *          本目录 layers.ts / PostFX.tsx / scene-model.ts
 * [OUTPUT]: 对外提供 MaterialPreview（多物体场景 + 点击选择 + 变换 gizmo）、VIEW_SCENES（5 套视口场景）与 GEOMETRIES
 * [POS]: spline-material 的可视验收区；R3F raycast 事件做选择（onClick / onPointerMissed），
 *        选中物体挂 TransformControls（move/rotate/scale）与反色轮廓壳；效果栈 = 各物体 effects + 全局 effects 顺序合成
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ContactShadows, Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type FC } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { EffectState } from "./effects-config";
import { PostFX } from "./PostFX";
import { buildShaderMaterial } from "./layers";
import type { SceneObject } from "./scene-model";
import type { MaterialState, SceneLightState } from "./types";
import { OBJECT_EFFECT_META, type ObjectEffectState } from "./object-effects";

/** 地面投影板共享的径向渐变贴图（确定性生成） */
let shadowBlobTexture: THREE.Texture | null = null;
const groundShadowTexture = () => {
  if (shadowBlobTexture) return shadowBlobTexture;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const paint = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  paint.addColorStop(0, "rgba(0,0,0,0.9)");
  paint.addColorStop(0.55, "rgba(0,0,0,0.42)");
  paint.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = paint;
  ctx.fillRect(0, 0, 128, 128);
  shadowBlobTexture = new THREE.CanvasTexture(canvas);
  shadowBlobTexture.colorSpace = THREE.SRGBColorSpace;
  return shadowBlobTexture;
};

export type GeometryKind = SceneObject["geometry"];

export const GEOMETRIES: Record<GeometryKind, () => THREE.BufferGeometry> = {
  knot: () => new THREE.TorusKnotGeometry(0.82, 0.3, 256, 40),
  sphere: () => new THREE.SphereGeometry(1.12, 128, 72),
  torus: () => new THREE.TorusGeometry(1.02, 0.44, 64, 128),
  capsule: () => new THREE.CapsuleGeometry(0.72, 1.1, 24, 64),
  roundedBox: () => new RoundedBoxGeometry(1.7, 1.15, 0.38, 5, 0.16),
};

export type SceneKind = "dark" | "white" | "neutral" | "checker" | "horizon";

export type SceneConfig = {
  label: string;
  background: string;
  /** 浅色场景：Lab 会据此切换视口内提示文字颜色 */
  light?: boolean;
  grid?: { cell: string; section: string };
  checker?: boolean;
  /** 垂直三段渐变背景 [上, 中, 下] */
  gradient?: [string, string, string];
  /** 接触阴影浓度 */
  shadowOpacity: number;
};

/** 视口场景预设：白底对齐 Spline 浅色视口（无网格 + 接触阴影）；棋盘格用于判透明/折射/像素化；Horizon 为摄影棚渐变棚 */
export const VIEW_SCENES: Record<SceneKind, SceneConfig> = {
  dark: { label: "Dark", background: "#141414", grid: { cell: "#262626", section: "#3a3a3a" }, shadowOpacity: 0.5 },
  white: { label: "White", background: "#f0eff2", light: true, shadowOpacity: 0.32 },
  neutral: { label: "Gray", background: "#9a9aa0", shadowOpacity: 0.38 },
  checker: { label: "Checker", background: "#eceae6", light: true, checker: true, shadowOpacity: 0.3 },
  horizon: { label: "Horizon", background: "#101012", grid: { cell: "#232326", section: "#333338" }, gradient: ["#08080a", "#43434e", "#08080a"], shadowOpacity: 0.55 },
};

/** 全部确定性生成（canvas 渐变/棋盘），无随机 */
const gradientTexture = (stops: [string, string, string]) => {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const paint = ctx.createLinearGradient(0, 0, 0, 512);
  paint.addColorStop(0, stops[0]);
  paint.addColorStop(0.55, stops[1]);
  paint.addColorStop(1, stops[0]);
  ctx.fillStyle = paint;
  ctx.fillRect(0, 0, 2, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const checkerTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fbfaf8";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#d7d4ce";
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillRect(64, 64, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(30, 30);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const useShader = (material: MaterialState, selected: boolean, sceneLight: SceneLightState, tonemapping: boolean, objectEffects: ObjectEffectState[]) => {
  const shader = useMemo(() => buildShaderMaterial(material, objectEffects), [material, objectEffects]);
  useEffect(() => () => shader.dispose(), [shader]);
  useEffect(() => {
    if (shader.uniforms.u_lamina_selected) shader.uniforms.u_lamina_selected.value = selected ? 1 : 0;
  }, [shader, selected]);
  useEffect(() => {
    if (shader.uniforms.u_lamina_lightIntensity) shader.uniforms.u_lamina_lightIntensity.value = sceneLight.enabled ? sceneLight.intensity : 0.25;
    if (shader.uniforms.u_lamina_ambient) shader.uniforms.u_lamina_ambient.value = sceneLight.ambient;
    if (shader.uniforms.u_lamina_tonemapping) shader.uniforms.u_lamina_tonemapping.value = tonemapping ? 1 : 0;
  }, [shader, sceneLight, tonemapping]);
  useFrame(({ clock }) => {
    shader.uniforms.u_lamina_time.value = clock.elapsedTime;
  });
  return shader;
};

const WireframeOverlay: FC<{ geometry: THREE.BufferGeometry }> = ({ geometry }) => (
  <mesh geometry={geometry} scale={1.002} raycast={() => null}>
    <meshBasicMaterial color="#565656" transparent opacity={0.35} wireframe />
  </mesh>
);

const ObjectMesh: FC<{
  object: SceneObject;
  selected: boolean;
  transformMode: "translate" | "rotate" | "scale";
  sceneLight: SceneLightState;
  tonemapping: boolean;
  onSelect: (id: string) => void;
  onTransform: (id: string, transform: Pick<SceneObject, "position" | "rotation" | "scale">) => void;
}> = ({ object, selected, transformMode, sceneLight, tonemapping, onSelect, onTransform }) => {
  const geometryBuilder = GEOMETRIES[object.geometry];
  const geo = useMemo(() => geometryBuilder(), [geometryBuilder]);
  useEffect(() => () => geo.dispose(), [geo]);
  const shader = useShader(object.material, selected, sceneLight, tonemapping, object.effects);
  const ref = useRef<THREE.Mesh>(null);
  const groundFx = object.effects.find((effect) => effect.visible && (effect.kind === "dropShadow" || effect.kind === "projection"));

  const commit = () => {
    if (!ref.current) return;
    const { position, rotation, scale } = ref.current;
    onTransform(object.id, { position: [position.x, position.y, position.z], rotation: [rotation.x, rotation.y, rotation.z], scale: scale.x });
  };

  return (
    <>
      <mesh
        ref={ref}
        geometry={geo}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        visible={object.visible}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onSelect(object.id);
        }}
      >
        <primitive object={shader} attach="material" />
      </mesh>
      {groundFx && object.visible ? (
        <mesh
          rotation-x={-Math.PI / 2}
          position={[
            object.position[0] + Number(groundFx.params.offsetX ?? 0),
            -1.545,
            object.position[2] + Number(groundFx.params.offsetZ ?? 0),
          ]}
          raycast={() => null}
        >
          <planeGeometry args={[2.4 * object.scale * Number(groundFx.params.size ?? 1), 2.4 * object.scale * Number(groundFx.params.size ?? 1)]} />
          <meshBasicMaterial map={groundShadowTexture()} transparent opacity={groundFx.opacity * 0.01 * Number(groundFx.params.strength ?? 0.5)} depthWrite={false} />
        </mesh>
      ) : null}
      {selected && object.visible ? (
        <TransformControls object={ref as unknown as React.MutableRefObject<THREE.Object3D>} mode={transformMode} onMouseUp={commit} size={0.8} />
      ) : null}
      {!selected && object.material.wireframe && object.visible ? <WireframeOverlay geometry={geo} /> : null}
    </>
  );
};

const SceneBackdrop: FC<{ config: SceneConfig }> = ({ config }) => {
  const bgTexture = useMemo(() => (config.gradient ? gradientTexture(config.gradient) : null), [config]);
  const floorTexture = useMemo(() => (config.checker ? checkerTexture() : null), [config]);
  useEffect(() => () => bgTexture?.dispose(), [bgTexture]);
  useEffect(() => () => floorTexture?.dispose(), [floorTexture]);
  return (
    <>
      {bgTexture ? <primitive object={bgTexture} attach="background" /> : <color attach="background" args={[config.background]} />}
      <ContactShadows position={[0, config.checker ? -1.549 : -1.548, 0]} opacity={config.shadowOpacity} scale={16} blur={2.6} far={3.2} resolution={512} color={config.light ? "#5a5550" : "#000000"} />
      {floorTexture ? (
        <mesh rotation-x={-Math.PI / 2} position={[0, -1.551, 0]} raycast={() => null}>
          <planeGeometry args={[90, 90]} />
          <meshBasicMaterial map={floorTexture} />
        </mesh>
      ) : null}
      {config.grid ? (
        <Grid
          position={[0, -1.55, 0]}
          args={[40, 40]}
          cellSize={0.6}
          cellThickness={0.6}
          cellColor={config.grid.cell}
          sectionSize={3}
          sectionThickness={1}
          sectionColor={config.grid.section}
          fadeDistance={26}
          fadeStrength={1.4}
          infiniteGrid
        />
      ) : null}
    </>
  );
};

export const MaterialPreview: FC<{
  objects: SceneObject[];
  selectedId: string | null;
  scene: SceneKind;
  globalEffects: EffectState[];
  transformMode: "translate" | "rotate" | "scale";
  sceneLight: SceneLightState;
  tonemapping: boolean;
  onSelect: (id: string | null) => void;
  onTransform: (id: string, transform: Pick<SceneObject, "position" | "rotation" | "scale">) => void;
}> = ({ objects, selectedId, scene, globalEffects, transformMode, sceneLight, tonemapping, onSelect, onTransform }) => {
  const config = VIEW_SCENES[scene];
  const activeEffects = useMemo(() => globalEffects.filter((effect) => effect.visible && effect.opacity > 0), [globalEffects]);
  return (
    <Canvas camera={{ fov: 40, position: [4.6, 2.3, 5.4] }} dpr={[1, 2]} gl={{ antialias: true }} onPointerMissed={() => onSelect(null)}>
      <SceneBackdrop config={config} />
      {objects.map((object) => (
        <ObjectMesh
          key={object.id}
          object={object}
          selected={object.id === selectedId}
          transformMode={transformMode}
          sceneLight={sceneLight}
          tonemapping={tonemapping}
          onSelect={onSelect}
          onTransform={onTransform}
        />
      ))}
      <OrbitControls makeDefault enablePan={false} minDistance={2.6} maxDistance={12} target={[0, 0.1, 0]} />
      {activeEffects.length ? <PostFX effects={activeEffects} /> : null}
    </Canvas>
  );
};
