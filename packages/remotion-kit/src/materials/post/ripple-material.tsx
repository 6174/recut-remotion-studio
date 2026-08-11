/**
 * [INPUT]: 依赖 Three CanvasTexture、Remotion 派生镜头位置/时间与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 RippleMaterial，以径向涟漪折射扰动内容纹理（post 效果）
 * [POS]: remotion-kit/src/materials 的 post Effect Node；确定性、无历史帧，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uFrequency;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * uResolution - uCenter;
    float d = length(p);
    float wave = sin(d / uRadius * 3.14159265 * uFrequency - uTime * 4.0)
      * exp(-d / max(uRadius * 1.6, 1.0));
    vec2 direction = normalize(p + vec2(1e-4));
    vec2 uv = clamp(vUv + direction * wave * uStrength, 0.001, 0.999);
    vec3 color = texture2D(uMap, uv).rgb;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface RippleMaterialProps {
  center: readonly [number, number];
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  strength?: number;
  radius?: number;
  frequency?: number;
}

export const RippleMaterial: React.FC<RippleMaterialProps> = ({
  center,
  height,
  texture,
  time,
  width,
  strength = 0.045,
  radius = 320,
  frequency = 2.2,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uCenter: new THREE.Uniform(new THREE.Vector2(center[0] * width, center[1] * height)),
      uTime: new THREE.Uniform(time),
      uRadius: new THREE.Uniform(radius),
      uStrength: new THREE.Uniform(strength),
      uFrequency: new THREE.Uniform(frequency),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uCenter.value.set(center[0] * width, center[1] * height);
      u.uTime.value = time;
      u.uRadius.value = radius;
      u.uStrength.value = strength;
      u.uFrequency.value = frequency;
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
