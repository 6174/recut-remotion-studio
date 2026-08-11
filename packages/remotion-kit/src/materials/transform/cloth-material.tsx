/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、振幅和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 ClothMaterial，以顶点正弦波动模拟布料起伏（transform 转场/变形）
 * [POS]: remotion-kit/src/materials 的 transform Effect Node；仅顶点位移，确定性、可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { useMaterialUniforms } from "../shared/uniforms";

const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uSpeed;
  uniform float uScale;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 transformed = position;
    float wave = sin(uv.x * uScale * 6.283 + uTime * uSpeed)
      * cos(uv.y * uScale * 4.712 + uTime * uSpeed * 0.7);
    transformed.z += wave * uAmplitude;
    transformed.x += sin(uv.y * uScale * 5.0 + uTime * uSpeed * 0.5) * uAmplitude * 0.3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(uMap, vUv);
  }
`;

export interface ClothMaterialProps {
  texture: THREE.Texture;
  time: number;
  amplitude?: number;
  speed?: number;
  scale?: number;
}

export const ClothMaterial: React.FC<ClothMaterialProps> = ({
  texture,
  time,
  amplitude = 0.18,
  speed = 1.4,
  scale = 1.2,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uTime: new THREE.Uniform(time),
      uAmplitude: new THREE.Uniform(amplitude),
      uSpeed: new THREE.Uniform(speed),
      uScale: new THREE.Uniform(scale),
    }),
    (u) => {
      u.uTime.value = time;
      u.uAmplitude.value = amplitude;
      u.uSpeed.value = speed;
      u.uScale.value = scale;
    },
  );

  return (
    <shaderMaterial
      ref={material}
      fragmentShader={fragmentShader}
      side={THREE.DoubleSide}
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={vertexShader}
    />
  );
};
