/**
 * [INPUT]: 依赖 Three、R3F ShaderMaterial 与 shared/uniforms
 * [OUTPUT]: 对外提供 CrossZoomTransitionMaterial：B 从小放大、A 同时推远（remotion cross-zoom 概念）
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
  varying vec2 vUv;

  vec2 zoomUv(vec2 uv, float scale) {
    return clamp((uv - 0.5) / max(scale, 0.05) + 0.5, 0.001, 0.999);
  }

  void main() {
    float p = smoothstep(0.0, 1.0, uProgress);
    float scaleA = mix(1.0, 0.25, p);
    float scaleB = mix(0.25, 1.0, p);
    vec3 a = texture2D(uMapA, zoomUv(vUv, scaleA)).rgb;
    vec3 b = texture2D(uMapB, zoomUv(vUv, scaleB)).rgb;
    float fade = smoothstep(0.25, 0.75, p);
    vec3 color = mix(a, b, fade);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const CrossZoomTransitionMaterial: React.FC<ABTransitionProps> = ({
  mapA,
  mapB,
  progress,
  width,
  height,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMapA: new THREE.Uniform(mapA),
      uMapB: new THREE.Uniform(mapB),
      uProgress: new THREE.Uniform(progress),
    }),
    (u) => {
      u.uMapA.value = mapA;
      u.uMapB.value = mapB;
      u.uProgress.value = progress;
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
