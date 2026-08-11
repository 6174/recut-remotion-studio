/**
 * [INPUT]: 依赖 Three、R3F ShaderMaterial 与 shared/uniforms
 * [OUTPUT]: 对外提供 ClockWipeTransitionMaterial：B 以钟表指针式扇形扫入（remotion clock-wipe）
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
    vec2 center = (vUv - 0.5) * uAspect;
    float angle = atan(center.y, center.x);
    // 从 12 点钟起顺时针推进；uProgress 本身就是已扫过的扇形占比。
    float clockPosition = fract(0.25 - angle / 6.2831853);
    float edge = 1.0 - smoothstep(uProgress, uProgress + 0.018, clockPosition);
    vec3 a = texture2D(uMapA, vUv).rgb;
    vec3 b = texture2D(uMapB, vUv).rgb;
    gl_FragColor = vec4(mix(a, b, edge), 1.0);
  }
`;

export const ClockWipeTransitionMaterial: React.FC<ABTransitionProps> = ({
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
