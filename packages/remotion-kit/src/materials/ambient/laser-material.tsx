/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 LaserMaterial，输出确定性扫描激光线（环境氛围）
 * [POS]: remotion-kit/src/materials 的 ambient Effect Node；扫描位置由 time 派生，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_HASH12, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntensity;
  varying vec2 vUv;

  ${GLSL_HASH12}

  void main() {
    float scan = fract(uTime * 0.22);
    float y = scan * 1.2 - 0.1;
    float d = abs(vUv.y - y);
    float core = smoothstep(0.004, 0.0, d);
    float halo = exp(-d * d / (0.006 * 0.006));
    float beam = core * 1.6 + halo * 0.35;
    float jitter = (hash12(vec2(floor(vUv.y * uResolution.y * 0.2), floor(uTime * 8.0))) - 0.5) * 0.05;
    float flicker = 0.85 + 0.15 * sin(uTime * 9.0 + vUv.x * 40.0);
    vec3 color = vec3(1.0, 0.12, 0.35);
    float alpha = beam * flicker * uOpacity * uIntensity;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

export interface LaserMaterialProps {
  height: number;
  time: number;
  width: number;
  opacity: number;
  intensity?: number;
}

export const LaserMaterial: React.FC<LaserMaterialProps> = ({
  height,
  time,
  width,
  opacity,
  intensity = 1,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uOpacity: new THREE.Uniform(opacity),
      uIntensity: new THREE.Uniform(intensity),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uOpacity.value = opacity;
      u.uIntensity.value = intensity;
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
