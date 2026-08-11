/**
 * [INPUT]: 依赖 Three Texture、Remotion frame/fps 派生时间与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 DisplacementMaterial，以 fBm 域扭曲 UV 渲染内容纹理（post 效果）
 * [POS]: remotion-kit/src/materials 的 post Effect Node；确定性 fBm，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_FBM2, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uAmount;
  uniform float uScale;
  varying vec2 vUv;

  ${GLSL_FBM2}

  void main() {
    vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 drift = vec2(uTime * 0.16, uTime * 0.11);
    vec2 warp = vec2(
      fbm2(p * uScale + drift),
      fbm2(p * uScale + vec2(5.2, 1.3) - drift * 0.7)
    );
    // 移动的位移焦点：扭曲强度沿一个游走的中心增强
    vec2 center = vec2(0.5 + 0.34 * sin(uTime * 0.28), 0.5 + 0.22 * cos(uTime * 0.22));
    float focus = smoothstep(0.6, 0.0, length(p - center));
    vec2 uv = clamp(vUv + (warp - 0.5) * uAmount * (0.35 + focus), 0.001, 0.999);
    gl_FragColor = vec4(texture2D(uMap, uv).rgb, 1.0);
  }
`;

export interface DisplacementMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  amount?: number;
  scale?: number;
}

export const DisplacementMaterial: React.FC<DisplacementMaterialProps> = ({
  height,
  texture,
  time,
  width,
  amount = 0.035,
  scale = 2.4,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uAmount: new THREE.Uniform(amount),
      uScale: new THREE.Uniform(scale),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uAmount.value = amount;
      u.uScale.value = scale;
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
