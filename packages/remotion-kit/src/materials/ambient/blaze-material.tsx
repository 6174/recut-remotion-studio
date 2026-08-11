/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 BlazeMaterial，输出域扭曲 fBm 火焰/能量场（环境材质）
 * [POS]: remotion-kit/src/materials 的 ambient Effect Node；确定性 fBm，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_FBM2, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  ${GLSL_FBM2}

  vec3 fireRamp(float t) {
    vec3 a = vec3(0.04, 0.01, 0.01);
    vec3 b = vec3(0.9, 0.1, 0.02);
    vec3 c = vec3(1.0, 0.55, 0.05);
    vec3 d = vec3(1.0, 0.95, 0.5);
    float i = clamp(t, 0.0, 1.0);
    return i < 0.5 ? mix(a, b, i * 2.0) : mix(b, c, (i - 0.5) * 2.0);
  }

  void main() {
    vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0);
    float f = fbm2(p * 2.0 + vec2(uTime * 0.12, -uTime * 0.08));
    float heat = fbm2(p * 4.0 - vec2(uTime * 0.2, uTime * 0.1));
    float field = clamp(f * 0.7 + heat * 0.45, 0.0, 1.0);
    vec3 color = fireRamp(field);
    float alpha = field * uOpacity;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

export interface BlazeMaterialProps {
  height: number;
  time: number;
  width: number;
  opacity: number;
}

export const BlazeMaterial: React.FC<BlazeMaterialProps> = ({
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
