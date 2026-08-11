/**
 * [INPUT]: 依赖 Three、R3F ShaderMaterial 与 shared/uniforms
 * [OUTPUT]: 对外提供 WipeTransitionMaterial：B 沿方向揭入覆盖 A（remotion wipe 的 clip-path 概念）
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
  uniform float uSign;
  varying vec2 vUv;

  void main() {
    float p = uProgress;
    vec3 a = texture2D(uMapA, vUv).rgb;
    vec3 b = texture2D(uMapB, vUv).rgb;
    float boundary;
    if (uHorizontal > 0.5) {
      boundary = uSign > 0.5 ? p : 1.0 - p;
      vec3 color = vUv.x <= boundary ? b : a;
      gl_FragColor = vec4(color, 1.0);
    } else {
      boundary = uSign > 0.5 ? p : 1.0 - p;
      vec3 color = vUv.y <= boundary ? b : a;
      gl_FragColor = vec4(color, 1.0);
    }
  }
`;

export interface WipeTransitionMaterialProps extends ABTransitionProps {
  direction?: "from-left" | "from-right" | "from-top" | "from-bottom";
}

export const WipeTransitionMaterial: React.FC<WipeTransitionMaterialProps> = ({
  mapA,
  mapB,
  progress,
  width,
  height,
  direction = "from-left",
}) => {
  const horizontal = direction === "from-left" || direction === "from-right";
  const sign = direction === "from-left" || direction === "from-top" ? 1 : 0;
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMapA: new THREE.Uniform(mapA),
      uMapB: new THREE.Uniform(mapB),
      uProgress: new THREE.Uniform(progress),
      uHorizontal: new THREE.Uniform(horizontal ? 1 : 0),
      uSign: new THREE.Uniform(sign),
    }),
    (u) => {
      u.uMapA.value = mapA;
      u.uMapB.value = mapB;
      u.uProgress.value = progress;
      u.uHorizontal.value = horizontal ? 1 : 0;
      u.uSign.value = sign;
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
