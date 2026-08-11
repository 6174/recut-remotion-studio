/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 GlyphRainMaterial，输出确定性下落字符列（矩阵风），作为环境材质
 * [POS]: remotion-kit/src/materials 的 ambient Effect Node；字符笔画与下落位置完全由 hash+time 派生，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_HASH12, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntensity;
  varying vec2 vUv;

  ${GLSL_HASH12}

  // 多种类字符笔画（竖/横/框/斜/十/点），由 hash 决定，像矩阵里的假名/二进制
  float charStroke(vec2 p, float type) {
    float t = 0.0;
    if (type < 0.17) t = 1.0 - smoothstep(0.12, 0.34, abs(p.x));
    else if (type < 0.33) t = 1.0 - smoothstep(0.12, 0.34, abs(p.y));
    else if (type < 0.5) {
      float ex = 1.0 - smoothstep(0.1, 0.32, abs(p.x));
      float ey = 1.0 - smoothstep(0.1, 0.32, abs(p.y));
      t = max(ex, ey);
    } else if (type < 0.67) t = 1.0 - smoothstep(0.12, 0.36, abs(p.x + p.y));
    else if (type < 0.83) {
      float v = 1.0 - smoothstep(0.1, 0.32, abs(p.x));
      float h = 1.0 - smoothstep(0.1, 0.32, abs(p.y));
      t = max(v, h);
    } else t = 1.0 - smoothstep(0.08, 0.3, length(p));
    return t;
  }

  float cellPattern(vec2 uv, float seed) {
    vec2 c = floor(uv);
    vec2 p = fract(uv) - 0.5;
    float type = hash12(vec2(c.x, seed + floor(c.y * 7.3)));
    float on = step(0.38, hash12(vec2(c.x + 11.0, seed + floor(c.y * 3.1))));
    return charStroke(p, type) * on;
  }

  void main() {
    float cols = 44.0;
    vec2 uv = vec2(vUv.x * cols, vUv.y * uResolution.y / 22.0);
    float col = floor(uv.x);
    float seed = hash12(vec2(col, 0.0));
    float speed = 0.6 + seed * 0.5;
    float head = fract(seed * 3.0 + uTime * speed);
    float offset = uv.y - head * (uResolution.y / 22.0);
    float cellY = floor(offset);
    float cellP = fract(offset) - 0.5;
    float trail = exp(-cellY * 0.16);
    float glyph = cellPattern(vec2(uv.x, cellP + 0.5), col);
    float glow = step(-1.0, cellY) * step(cellY, 0.0);
    float brightness = trail * (0.22 + glow * 0.78);
    vec3 color = vec3(0.1, 0.95, 0.55);
    float alpha = glyph * brightness * uOpacity * uIntensity;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

export interface GlyphRainMaterialProps {
  height: number;
  time: number;
  width: number;
  opacity: number;
  intensity?: number;
}

export const GlyphRainMaterial: React.FC<GlyphRainMaterialProps> = ({
  height,
  time,
  width,
  opacity,
  intensity = 1,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uOpacity: new THREE.Uniform(opacity),
      uIntensity: new THREE.Uniform(intensity),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
      u.uOpacity.value = opacity;
      u.uIntensity.value = intensity;
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
