/**
 * [INPUT]: @react-three/fiber、drei（Grid/OrbitControls）、three 与本目录 layers.ts 的 buildShaderMaterial
 * [OUTPUT]: 对外提供 MaterialPreview：Spline 风格深色视口，实时渲染面板状态驱动的图层材质
 * [POS]: spline-material 的可视验收区；每次状态变化重建 ShaderMaterial（lab 页可接受），时间 uniform 逐帧更新
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, type FC } from "react";
import * as THREE from "three";
import { buildShaderMaterial } from "./layers";
import type { MaterialState } from "./types";

export type GeometryKind = "knot" | "sphere" | "torus" | "capsule";

export const GEOMETRIES: Record<GeometryKind, () => THREE.BufferGeometry> = {
  knot: () => new THREE.TorusKnotGeometry(0.82, 0.3, 256, 40),
  sphere: () => new THREE.SphereGeometry(1.12, 128, 72),
  torus: () => new THREE.TorusGeometry(1.02, 0.44, 64, 128),
  capsule: () => new THREE.CapsuleGeometry(0.72, 1.1, 24, 64),
};

const MeshWithMaterial: FC<{ material: MaterialState; geometry: THREE.BufferGeometry }> = ({ geometry, material }) => {
  const shader = useMemo(() => buildShaderMaterial(material), [material]);
  useEffect(() => () => shader.dispose(), [shader]);
  useFrame(({ clock }) => {
    shader.uniforms.u_lamina_time.value = clock.elapsedTime;
  });
  return (
    <mesh geometry={geometry}>
      <primitive object={shader} attach="material" />
    </mesh>
  );
};

const WireframeOverlay: FC<{ geometry: THREE.BufferGeometry }> = ({ geometry }) => (
  <mesh geometry={geometry} scale={1.002}>
    <meshBasicMaterial color="#565656" transparent opacity={0.35} wireframe />
  </mesh>
);

export const MaterialPreview: FC<{ material: MaterialState; geometry: GeometryKind }> = ({ geometry, material }) => {
  const geometryBuilder = GEOMETRIES[geometry];
  const geo = useMemo(() => geometryBuilder(), [geometryBuilder]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <Canvas camera={{ fov: 42, position: [3.4, 1.7, 4.4] }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#141414"]} />
      <Grid
        position={[0, -1.55, 0]}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#262626"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#3a3a3a"
        fadeDistance={26}
        fadeStrength={1.4}
        infiniteGrid
      />
      <group rotation={[0.08, -0.5, 0]}>
        <MeshWithMaterial geometry={geo} material={material} />
        {material.wireframe ? <WireframeOverlay geometry={geo} /> : null}
      </group>
      <OrbitControls enablePan={false} minDistance={2.6} maxDistance={9} />
    </Canvas>
  );
};
