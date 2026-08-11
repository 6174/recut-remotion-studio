/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 LiquidMaterial，输出域扭曲 fBm 流动场，作为环境材质
 * [POS]: remotion-kit/src/materials 的 ambient Effect Node；确定性、无历史帧，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_FBM2, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying vec2 vUv;

  ${GLSL_FBM2}

  void main() {
    vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 q = p + vec2(
      fbm2(p * 1.4 + uTime * 0.06),
      fbm2(p * 1.4 + vec2(5.2, 1.3) - uTime * 0.04)
    );
    float field = fbm2(p * 1.6 + 2.2 * q);
    vec3 color = mix(uColorA, uColorB, field);
    gl_FragColor = vec4(color, uOpacity);
  }
`;

export interface LiquidMaterialProps {
  height: number;
  time: number;
  width: number;
  opacity: number;
  colorA?: string;
  colorB?: string;
}

export const LiquidMaterial: React.FC<LiquidMaterialProps> = ({
  height,
  time,
  width,
  opacity,
  colorA = "#0ea5e9",
  colorB = "#7c3aed",
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uColorA: new THREE.Uniform(new THREE.Color(colorA)),
      uColorB: new THREE.Uniform(new THREE.Color(colorB)),
      uOpacity: new THREE.Uniform(opacity),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uColorA.value.set(colorA);
      u.uColorB.value.set(colorB);
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
