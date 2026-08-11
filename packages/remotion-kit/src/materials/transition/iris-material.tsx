/**
 * [INPUT]: 依赖 Three、R3F ShaderMaterial 与 shared/uniforms
 * [OUTPUT]: 对外提供 IrisTransitionMaterial：B 以圆形光圈从中心展开（remotion iris/circle）
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
  uniform vec2 uAspect;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * uAspect;
    float d = length(p);
    float radius = uProgress * 0.85;
    float mask = smoothstep(radius + 0.01, radius - 0.01, d);
    vec3 a = texture2D(uMapA, vUv).rgb;
    vec3 b = texture2D(uMapB, vUv).rgb;
    gl_FragColor = vec4(mix(a, b, mask), 1.0);
  }
`;

export const IrisTransitionMaterial: React.FC<ABTransitionProps> = ({
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
      uAspect: new THREE.Uniform(new THREE.Vector2(width / height, 1)),
    }),
    (u) => {
      u.uMapA.value = mapA;
      u.uMapB.value = mapB;
      u.uProgress.value = progress;
      u.uAspect.value.set(width / height, 1);
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
