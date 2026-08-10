/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 CanvasUiCloudsMaterial，输出无历史帧依赖的程序化 fBm 雾场（环境层）
 * [POS]: remotion-kit/src/materials 的 ambient Effect Node；可 seek 的单 pass 渲染，不消费内容纹理
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_FBM2, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  ${GLSL_FBM2}

  void main() {
    vec2 p = vUv * vec2(1.78, 1.0);
    float drift = uTime * 0.08;
    float field = fbm2(p * 2.4 + vec2(drift, -drift * 0.4));
    float detail = fbm2(p * 5.0 - vec2(drift * 1.8, drift));
    float mist = smoothstep(0.5, 0.87, field * 0.76 + detail * 0.24);
    float edge = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    vec3 color = mix(vec3(0.04, 0.17, 0.23), vec3(0.25, 0.82, 0.67), field);
    gl_FragColor = vec4(color * mist, mist * edge * uOpacity);
  }
`;

export interface CanvasUiCloudsMaterialProps {
  time: number;
  opacity: number;
}

export const CanvasUiCloudsMaterial: React.FC<CanvasUiCloudsMaterialProps> = ({
  time,
  opacity,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uTime: new THREE.Uniform(time),
      uOpacity: new THREE.Uniform(opacity),
    }),
    (u) => {
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
