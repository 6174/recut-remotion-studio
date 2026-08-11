/**
 * [INPUT]: 依赖 React Three Fiber mesh 契约、drei MeshTransmissionMaterial 与 Three.js 几何
 * [OUTPUT]: 对外提供 SplineLikeShape、SplineLikeTorus 与参数化材质类型
 * [POS]: spline-like 实验的形状核心；可直接被 Remotion ThreeCanvas Composition 复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MeshTransmissionMaterial } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export type SplineLikeMaterial = {
  color: string;
  roughness: number;
  transmission: number;
  thickness: number;
  ior: number;
  chromaticAberration: number;
  anisotropy: number;
  samples: number;
  resolution: number;
  background?: string;
};

export type SplineLikeShapeProps = {
  width: number;
  height: number;
  depth: number;
  radius: number;
  material: SplineLikeMaterial;
} & Omit<ThreeElements["mesh"], "geometry" | "material">;

export type SplineLikeTorusProps = {
  majorRadius: number;
  tubeRadius: number;
  verticalScale?: number;
  organic?: number;
  material: SplineLikeMaterial;
} & Omit<ThreeElements["mesh"], "geometry" | "material">;

function roundedRectangle(width: number, height: number, radius: number) {
  const corner = Math.min(radius, width / 2, height / 2);
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + corner, y);
  shape.lineTo(x + width - corner, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + corner);
  shape.lineTo(x + width, y + height - corner);
  shape.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
  shape.lineTo(x + corner, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - corner);
  shape.lineTo(x, y + corner);
  shape.quadraticCurveTo(x, y, x + corner, y);
  return shape;
}

function Surface({ geometry, material, meshProps }: { geometry: THREE.BufferGeometry; material: SplineLikeMaterial; meshProps: Omit<ThreeElements["mesh"], "geometry" | "material"> }) {
  const background = useMemo(() => material.background ? new THREE.Color(material.background) : undefined, [material.background]);
  return <mesh geometry={geometry} renderOrder={100} {...meshProps}>
    <MeshTransmissionMaterial anisotropy={material.anisotropy} attenuationColor="#ffffff" attenuationDistance={0.5} background={background} chromaticAberration={material.chromaticAberration} clearcoat={0.1} clearcoatRoughness={0.1} color={material.color} ior={material.ior} resolution={material.resolution} roughness={material.roughness} samples={material.samples} thickness={material.thickness} toneMapped={false} transmission={material.transmission} />
  </mesh>;
}

export const SplineLikeShape: React.FC<SplineLikeShapeProps> = ({ depth, height, material, radius, width, ...meshProps }) => {
  const geometry = useMemo(() => {
    const bevel = Math.min(depth * 0.22, 0.032);
    const result = new THREE.ExtrudeGeometry(roundedRectangle(width, height, radius), { bevelEnabled: true, bevelSegments: 3, bevelSize: bevel, bevelThickness: bevel, curveSegments: 24, depth: Math.max(depth - bevel * 2, 0.001) });
    result.center();
    return result;
  }, [depth, height, radius, width]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <Surface geometry={geometry} material={material} meshProps={meshProps} />;
};

export const SplineLikeTorus: React.FC<SplineLikeTorusProps> = ({ majorRadius, material, organic = 0, tubeRadius, verticalScale = 1, ...meshProps }) => {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 18 }, (_, index) => {
      const angle = index / 18 * Math.PI * 2;
      const bulge = 1 + Math.sin(angle * 2 - 0.45) * organic;
      return new THREE.Vector3(Math.cos(angle) * majorRadius * bulge, Math.sin(angle) * majorRadius * verticalScale, Math.cos(angle * 2 + 0.4) * organic * 0.15);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, true, "centripetal"), 256, tubeRadius, 64, true);
  }, [majorRadius, organic, tubeRadius, verticalScale]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <Surface geometry={geometry} material={material} meshProps={meshProps} />;
};
