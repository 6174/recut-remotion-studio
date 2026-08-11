/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 GridMaterial，输出持续斜向掠过的程序化编辑网格（纸面/蓝图），作为环境材质
 * [POS]: remotion-kit/src/materials 的 ambient Effect Node；时间驱动但无历史帧，确定性、可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uCell;
  uniform float uLine;
  uniform float uMajorEvery;
  uniform float uSpeed;
  varying vec2 vUv;

  void main() {
    // 像素空间的连续平移：细格与主格用同一个坐标，循环越过边界时没有跳变。
    vec2 drift = uTime * uSpeed * vec2(22.0, -9.0);
    vec2 c = (vUv * uResolution + drift) / uCell;
    vec2 f = abs(fract(c) - 0.5);
    vec2 halfW = vec2(uLine) / uCell;
    float minor = max(
      1.0 - smoothstep(halfW.x, halfW.x * 3.0, f.x),
      1.0 - smoothstep(halfW.y, halfW.y * 3.0, f.y)
    );
    vec2 majorC = (vUv * uResolution + drift) / (uCell * uMajorEvery);
    vec2 majorF = abs(fract(majorC) - 0.5);
    float major = max(
      1.0 - smoothstep(0.5, 0.5 - 2.0 / (uCell.x * uMajorEvery), majorF.x),
      1.0 - smoothstep(0.5, 0.5 - 2.0 / (uCell.y * uMajorEvery), majorF.y)
    );
    float breathe = 0.92 + 0.08 * sin(uTime * 0.5);
    float alpha = (minor * 0.55 + major * 0.8) * uOpacity * breathe;
    gl_FragColor = vec4(uColor * alpha, alpha);
  }
`;

export interface GridMaterialProps {
  height: number;
  time: number;
  width: number;
  opacity: number;
  color?: string;
  cell?: number;
  line?: number;
  majorEvery?: number;
  /** 网格在屏幕上掠过的速度倍率。 */
  speed?: number;
}

export const GridMaterial: React.FC<GridMaterialProps> = ({
  height,
  time,
  width,
  opacity,
  color = "#334155",
  cell = 96,
  line = 1.2,
  majorEvery = 5,
  speed = 0.75,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uColor: new THREE.Uniform(new THREE.Color(color)),
      uOpacity: new THREE.Uniform(opacity),
      uCell: new THREE.Uniform(new THREE.Vector2(cell, cell)),
      uLine: new THREE.Uniform(line),
      uMajorEvery: new THREE.Uniform(majorEvery),
      uSpeed: new THREE.Uniform(speed),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uColor.value.set(color);
      u.uOpacity.value = opacity;
      u.uCell.value.set(cell, cell);
      u.uLine.value = line;
      u.uMajorEvery.value = majorEvery;
      u.uSpeed.value = speed;
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
