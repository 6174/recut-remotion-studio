/**
 * [INPUT]: 依赖 Three Texture、Remotion frame/fps 派生时间与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 ParticleRevealMaterial：内容由粒子汇聚揭示——未揭示区显示散射碎片 +
 *          悬浮光点，进度完成后严格落成真实内容（post，内容入场动画）
 * [POS]: remotion-kit/src/materials 的 post Effect Node；粒子位置/揭示时点完全由 hash+time 派生，确定性、可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_HASH12, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uCell;
  uniform float uIntensity;
  uniform float uProgress;
  varying vec2 vUv;

  ${GLSL_HASH12}

  void main() {
    vec3 source = texture2D(uMap, vUv).rgb;
    // 入场效果只能沿 shot 的 0→1 生命周期前进；终态不允许残留任何碎片。
    if (uProgress >= 0.86) {
      gl_FragColor = vec4(source, 1.0);
      return;
    }
    float reveal = smoothstep(0.04, 0.82, clamp(uProgress, 0.0, 1.0));
    vec2 cells = uResolution / uCell;
    vec2 cell = floor(vUv * cells);
    vec2 st = fract(vUv * cells) - 0.5;
    float revealAt = hash12(cell + 4.1);
    float resolved = step(revealAt, reveal);
    vec2 cellCenter = (cell + 0.5) / cells;

    // 未揭示：散射碎片（采样远处）+ 一颗悬浮光点
    vec2 farCell = vec2(
      mod(cell.x + 5.0 + floor(hash12(cell + 5.1) * 22.0), cells.x),
      mod(cell.y + 4.0 + floor(hash12(cell + 6.3) * 16.0), cells.y)
    );
    vec3 scatter = texture2D(uMap, clamp((farCell + 0.5) / cells, 0.001, 0.999)).rgb;
    vec2 particlePos = vec2(hash12(cell + 1.3), hash12(cell + 2.1));
    float drift = 0.06 * sin(uTime * (0.5 + hash12(cell + 3.7)) + hash12(cell + 8.9) * 6.0);
    vec2 p = st - vec2(particlePos.x, particlePos.y + drift);
    float glow = (1.0 - smoothstep(0.0, 0.15, length(p))) * (0.35 + 0.65 * hash12(cell + 9.3));
    vec3 accent = mix(vec3(0.55, 0.75, 1.0), vec3(1.0, 0.9, 0.6), hash12(cell + 7.1));

    vec3 debris = mix(scatter * 0.24, accent, glow * uIntensity);
    vec3 color = mix(debris, source, resolved);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface ParticleRevealMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  cell?: number;
  intensity?: number;
  /** ShotGraph 注入的单次效果进度；>= 0.86 时严格返回原图。 */
  progress?: number;
}

export const ParticleRevealMaterial: React.FC<ParticleRevealMaterialProps> = ({
  height,
  texture,
  time,
  width,
  cell = 22,
  intensity = 1,
  progress = 1,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uCell: new THREE.Uniform(cell),
      uIntensity: new THREE.Uniform(intensity),
      uProgress: new THREE.Uniform(progress),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uCell.value = cell;
      u.uIntensity.value = intensity;
      u.uProgress.value = progress;
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
