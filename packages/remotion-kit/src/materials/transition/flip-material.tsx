/**
 * [INPUT]: 依赖 Three、R3F ShaderMaterial 与 shared/uniforms
 * [OUTPUT]: 对外提供 FlipTransitionMaterial：卡片翻转 A→B（UV 收缩 + 交叉，remotion flip 的 3D 翻转近似）
 * [POS]: remotion-kit/src/materials/transition 的 A/B 转场材质；确定性、可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";
import type { ABTransitionProps } from "./types";

const fragmentShader = `
  uniform sampler2D uMapA;
  uniform sampler2D uMapB;
  uniform float uProgress;
  uniform float uHorizontal;
  varying vec2 vUv;

  void main() {
    float p = clamp(uProgress, 0.001, 0.999);
    float sweep = cos(p * 3.14159265);          // 1 → -1
    bool halfA = sweep >= 0.0;                   // 前 90° 显示 A
    float scale = abs(sweep);                    // 边缘压缩为 0
    vec2 uv = uHorizontal > 0.5
      ? vec2((vUv.x - 0.5) / max(scale, 0.02) + 0.5, vUv.y)
      : vec2(vUv.x, (vUv.y - 0.5) / max(scale, 0.02) + 0.5);
    vec3 color = halfA
      ? texture2D(uMapA, clamp(uv, 0.001, 0.999)).rgb
      : texture2D(uMapB, clamp(vec2(1.0 - uv.x, uv.y), 0.001, 0.999)).rgb;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface FlipTransitionMaterialProps extends ABTransitionProps {
  horizontal?: boolean;
}

export const FlipTransitionMaterial: React.FC<FlipTransitionMaterialProps> = ({
  mapA,
  mapB,
  progress,
  width,
  height,
  horizontal = true,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMapA: new THREE.Uniform(mapA),
      uMapB: new THREE.Uniform(mapB),
      uProgress: new THREE.Uniform(progress),
      uHorizontal: new THREE.Uniform(horizontal ? 1 : 0),
    }),
    (u) => {
      u.uMapA.value = mapA;
      u.uMapB.value = mapB;
      u.uProgress.value = progress;
      u.uHorizontal.value = horizontal ? 1 : 0;
    },
  );

  return (
    <shaderMaterial
      ref={material}
      fragmentShader={fragmentShader}
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={PASSTHROUGH_VERTEX}
    />
  );
};
