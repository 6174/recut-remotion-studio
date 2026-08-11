/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 ParticleScrollMaterial，输出确定性漂浮微粒流（环境材质）
 * [POS]: remotion-kit/src/materials 的 ambient Effect Node；微粒位置由 hash+time 派生，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_HASH12, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  ${GLSL_HASH12}

  void main() {
    vec2 grid = vec2(28.0, 20.0);
    vec2 cell = floor(vUv * grid);
    vec2 p = fract(vUv * grid) - 0.5;
    float seed = hash12(cell);
    float drift = fract(uTime * (0.06 + seed * 0.1) + seed * 4.0);
    vec2 center = vec2(
      (seed - 0.5) * 1.4,
      fract(seed * 7.3 + uTime * (0.04 + seed * 0.05)) - 0.5
    );
    vec2 delta = p - center;
    float radius = 0.05 + seed * 0.06;
    float twinkle = 0.55 + 0.45 * sin(uTime * (1.0 + seed * 2.0) + seed * 20.0);
    float dot = (1.0 - smoothstep(radius * 0.3, radius, length(delta))) * twinkle;
    vec3 color = mix(vec3(0.65, 0.8, 1.0), vec3(1.0, 0.95, 0.8), seed);
    float alpha = dot * uOpacity * (0.5 + drift * 0.5);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

export interface ParticleScrollMaterialProps {
  height: number;
  time: number;
  width: number;
  opacity: number;
}

export const ParticleScrollMaterial: React.FC<ParticleScrollMaterialProps> = ({
  height,
  time,
  width,
  opacity,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uOpacity: new THREE.Uniform(opacity),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uOpacity.value = opacity;
    },
  );

  return (
    <shaderMaterial
      ref={material}
      depthWrite={false}
      fragmentShader={fragmentShader}
      transparent
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={PASSTHROUGH_VERTEX}
    />
  );
};
