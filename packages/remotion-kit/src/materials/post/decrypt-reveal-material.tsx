/**
 * [INPUT]: 依赖 Three Texture、Remotion frame/fps 派生时间与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 DecryptRevealMaterial，逐字符乱码→正文的单次解锁揭示效果（post，文本专属）
 * [POS]: remotion-kit/src/materials 的 post Effect Node；每个字符的乱码偏移与解锁时点
 *        完全由 hash+time 派生，确定性、可 seek
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
  uniform float uProgress;
  varying vec2 vUv;

  ${GLSL_HASH12}

  float hSegment(vec2 p, float y) {
    float d = max(abs(p.y - y), abs(p.x) - 0.31);
    return 1.0 - smoothstep(0.035, 0.075, d);
  }

  float vSegment(vec2 p, float x, float y) {
    float d = max(abs(p.x - x), abs(p.y - y) - 0.19);
    return 1.0 - smoothstep(0.035, 0.075, d);
  }

  void main() {
    vec3 source = texture2D(uMap, vUv).rgb;
    // 任何入场材质在结束帧都必须是无损原纹理。
    if (uProgress >= 0.86) {
      gl_FragColor = vec4(source, 1.0);
      return;
    }
    float reveal = smoothstep(0.04, 0.82, clamp(uProgress, 0.0, 1.0));
    vec2 cells = vec2(uResolution.x / (uCell * 0.62), uResolution.y / uCell);
    vec2 cell = floor(vUv * cells);
    float resolveAt = hash12(cell + 1.7);
    float resolved = smoothstep(resolveAt - 0.12, resolveAt + 0.035, reveal);
    vec2 cellCenter = (cell + 0.5) / cells;
    vec3 cellColor = texture2D(uMap, clamp(cellCenter, 0.001, 0.999)).rgb;
    vec2 glyph = fract(vUv * cells) - 0.5;
    float tick = floor(uTime * 11.0);
    float a = step(0.47, hash12(cell + vec2(1.1, tick * 0.31)));
    float b = step(0.47, hash12(cell + vec2(2.3, tick * 0.53)));
    float c = step(0.47, hash12(cell + vec2(3.7, tick * 0.79)));
    float d = step(0.47, hash12(cell + vec2(5.9, tick * 0.97)));
    float e = step(0.47, hash12(cell + vec2(7.1, tick * 1.17)));
    float f = step(0.47, hash12(cell + vec2(8.3, tick * 1.39)));
    float g = step(0.47, hash12(cell + vec2(9.7, tick * 1.61)));
    // 7-segment cipher glyph：比随机采样块更接近真正的解密字符，同时保持纯 shader、可 seek。
    float cipher = max(max(a * hSegment(glyph, 0.31), b * vSegment(glyph, 0.31, 0.16)),
      max(c * vSegment(glyph, 0.31, -0.16), d * hSegment(glyph, -0.31)));
    cipher = max(cipher, max(e * vSegment(glyph, -0.31, -0.16), f * vSegment(glyph, -0.31, 0.16)));
    cipher = max(cipher, g * hSegment(glyph, 0.0));
    vec3 cipherInk = mix(vec3(0.44, 0.77, 1.0), cellColor * 1.35, 0.72);
    vec3 scrambled = mix(source * 0.055, cipherInk, cipher);
    vec3 color = mix(scrambled, source, resolved);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface DecryptRevealMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  cell?: number;
  /** ShotGraph 注入的单次效果进度；>= 0.86 时严格返回原图。 */
  progress?: number;
}

export const DecryptRevealMaterial: React.FC<DecryptRevealMaterialProps> = ({
  height,
  texture,
  time,
  width,
  cell = 26,
  progress = 1,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uCell: new THREE.Uniform(cell),
      uProgress: new THREE.Uniform(progress),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uCell.value = cell;
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
