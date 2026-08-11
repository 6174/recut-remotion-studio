/**
 * [INPUT]: 依赖 Three Texture 与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 RetroDitherMaterial，以 Bayer 有序抖动 + 色阶量化渲染内容纹理（post 效果）
 * [POS]: remotion-kit/src/materials 的 post Effect Node；确定性抖动矩阵，无时间依赖，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uLevels;
  uniform float uGrid;
  uniform float uTime;
  varying vec2 vUv;

  float bayer2(vec2 p) {
    p = mod(p, 2.0);
    return mod(p.y + mod(p.x, 2.0) * 2.0, 4.0);
  }

  float bayer4(vec2 p) {
    vec2 q = mod(floor(p / 2.0), 2.0);
    return bayer2(p) + 4.0 * bayer2(q);
  }

  float dither(vec2 uv) {
    vec2 shifted = uv + vec2(fract(uTime * 0.7) * 0.5, fract(uTime * 0.45) * 0.5);
    return bayer4(floor(shifted * uResolution / uGrid)) / 16.0 - 0.5;
  }

  void main() {
    vec3 color = texture2D(uMap, vUv).rgb;
    vec3 quantized = floor(color * uLevels + dither(vUv)) / max(uLevels - 1.0, 1.0);
    float scan = 0.05 * sin(vUv.y * uResolution.y * 2.0 + uTime * 5.0);
    gl_FragColor = vec4(clamp(quantized + scan, 0.0, 1.0), 1.0);
  }
`;

export interface RetroDitherMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  levels?: number;
  grid?: number;
}

export const RetroDitherMaterial: React.FC<RetroDitherMaterialProps> = ({
  height,
  texture,
  time,
  width,
  levels = 4,
  grid = 4,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uLevels: new THREE.Uniform(levels),
      uGrid: new THREE.Uniform(grid),
      uTime: new THREE.Uniform(time),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uLevels.value = levels;
      u.uGrid.value = grid;
      u.uTime.value = time;
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
