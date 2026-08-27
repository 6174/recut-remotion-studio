/**
 * [INPUT]: three ShaderMaterial 与本目录 effects-config.ts 的 schema、glsl.ts 的 helpers
 * [OUTPUT]: 对外提供 buildEffectMaterial(effects) → 全屏后处理 ShaderMaterial（采样 tDiffuse，按 EffectState 顺序合成）
 * [POS]: spline-material 的 Effects 实现；与 layers.ts 同构（__ID__ 模板 + 顺序合成），但作用于屏幕空间而非材质空间
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { HELPERS_CHUNK } from "./glsl";
import { EffectKind, EffectState, EFFECT_KIND_META } from "./effects-config";

type FX = { uniforms: string; func: string };

const FX_DEF: Record<EffectKind, FX> = {
  colorAdjust: {
    uniforms: `uniform float u___ID___brightness;
uniform float u___ID___contrast;
uniform float u___ID___saturation;
uniform float u___ID___hue;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  col *= (1.0 + u___ID___brightness);
  col = (col - 0.5) * u___ID___contrast + 0.5;
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(l), col, clamp(u___ID___saturation, 0.0, 2.0));
  float a = u___ID___hue * 6.2831853;
  float c = cos(a); float s = sin(a);
  mat3 hue = mat3(0.299, 0.587, 0.114, 0.596, -0.274, -0.322, 0.211, -0.523, 0.312) * mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * mat3(1.0, 0.956, 0.621, 1.0, -0.272, -0.647, 1.0, -1.106, 1.703);
  col = hue * col;
  return clamp(col, 0.0, 1.0);
}`,
  },
  bloom: {
    uniforms: `uniform float u___ID___threshold;
uniform float u___ID___intensity;
uniform float u___ID___blur;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  vec3 sum = vec3(0.0);
  for (int i = -2; i <= 2; i++) {
    for (int j = -2; j <= 2; j++) {
      vec2 o = vec2(float(i), float(j)) * u___ID___blur / u_res;
      vec3 s = texture(tDiffuse, uv + o).rgb;
      sum += max(s - u___ID___threshold, 0.0);
    }
  }
  return col + (sum / 25.0) * u___ID___intensity;
}`,
  },
  blur: {
    uniforms: `uniform float u___ID___amount;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  vec3 sum = vec3(0.0); float w = 0.0;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 o = vec2(float(i), float(j)) * u___ID___amount / u_res;
      sum += texture(tDiffuse, uv + o).rgb;
      w += 1.0;
    }
  }
  return sum / w;
}`,
  },
  chromatic: {
    uniforms: `uniform float u___ID___amount;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 o = (uv - 0.5) * u___ID___amount * 0.12;
  return vec3(texture(tDiffuse, uv + o).r, texture(tDiffuse, uv).g, texture(tDiffuse, uv - o).b);
}`,
  },
  vignette: {
    uniforms: `uniform float u___ID___offset;
uniform float u___ID___darkness;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  float d = distance(uv, vec2(0.5));
  float v = 1.0 - smoothstep(0.8 - u___ID___offset, 0.8, d);
  return col * (1.0 - (1.0 - v) * u___ID___darkness);
}`,
  },
  grain: {
    uniforms: `uniform float u___ID___intensity;
uniform float u___ID___size;
uniform float u___ID___animated;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 p = uv * u_res / max(u___ID___size, 0.5) + (u___ID___animated > 0.5 ? u_time : 0.0);
  float g = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  return col + (g - 0.5) * u___ID___intensity;
}`,
  },
  noise: {
    uniforms: `uniform float u___ID___intensity;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 p = uv * u_res * 0.5;
  vec3 n = vec3(
    fract(sin(dot(p + vec2(0.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453),
    fract(sin(dot(p + vec2(31.4, 17.2), vec2(12.9898, 78.233))) * 43758.5453),
    fract(sin(dot(p + vec2(7.1, 53.7), vec2(12.9898, 78.233))) * 43758.5453));
  return mix(col, n, u___ID___intensity);
}`,
  },
  pixelate: {
    uniforms: `uniform float u___ID___pixelSize;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 uvp = floor(uv * max(u___ID___pixelSize, 1.0)) / max(u___ID___pixelSize, 1.0);
  return texture(tDiffuse, uvp + 0.5 / max(u___ID___pixelSize, 1.0)).rgb;
}`,
  },
  outline: {
    uniforms: `uniform vec3 u___ID___color;
uniform float u___ID___threshold;
uniform float u___ID___thickness;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 px = 1.5 / u_res;
  float gx = -dot(texture(tDiffuse, uv - vec2(px.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114)) + dot(texture(tDiffuse, uv + vec2(px.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
  float gy = -dot(texture(tDiffuse, uv - vec2(0.0, px.y)).rgb, vec3(0.299, 0.587, 0.114)) + dot(texture(tDiffuse, uv + vec2(0.0, px.y)).rgb, vec3(0.299, 0.587, 0.114));
  float edge = clamp(length(vec2(gx, gy)) * u___ID___thickness * 4.0, 0.0, 1.0);
  edge *= step(u___ID___threshold, 0.5);
  return mix(col, u___ID___color, edge);
}`,
  },
  glitch: {
    uniforms: `uniform float u___ID___amount;
uniform float u___ID___speed;`,
    func: `vec3 fx___ID__(vec3 col, vec2 uv) {
  float t = floor(u_time * u___ID___speed);
  float line = step(0.97, fract(sin(floor(uv.y * 42.0) + t) * 43758.5453));
  vec2 uv2 = uv + vec2(line * u___ID___amount * 0.08 * sin(t * 1.7), 0.0);
  return texture(tDiffuse, uv2).rgb;
}`,
  },
};

const helpers = /* glsl */ `
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 u_res;
uniform float u_time;
${HELPERS_CHUNK}
`;

export function buildEffectMaterial(effects: EffectState[]): THREE.ShaderMaterial {
  const uniforms: Record<string, THREE.IUniform> = {
    tDiffuse: { value: null },
    u_res: { value: new THREE.Vector2(1, 1) },
    u_time: { value: 0 },
  };
  const uniformChunks: string[] = [];
  const funcChunks: string[] = [];
  const applies: string[] = [];

  for (const effect of effects) {
    if (!effect.visible) continue;
    const id = effect.id;
    const meta = EFFECT_KIND_META[effect.kind];
    const fx = FX_DEF[effect.kind];
    if (!fx) continue;
    uniforms[`u_${id}_strength`] = { value: effect.opacity / 100 };
    for (const field of meta.fields) {
      const value = effect.params[field.key];
      const name = `u_${id}_${field.key}`;
      if (field.type === "color") uniforms[name] = { value: new THREE.Color(String(value ?? "#000000")) };
      else if (field.type === "segment") uniforms[name] = { value: value === "on" ? 1 : 0 };
      else if (field.type === "vec2" || field.type === "vec3") uniforms[name] = { value: Array.isArray(value) ? new THREE.Vector2(value[0], value[1]) : new THREE.Vector2(0, 0) };
      else uniforms[name] = { value: typeof value === "number" ? value : 0 };
    }
    const fill = (source: string) => source.replaceAll("__ID__", id);
    uniformChunks.push(`uniform float u_${id}_strength;\n${fill(fx.uniforms)}`);
    funcChunks.push(fill(fx.func));
    applies.push(`col = mix(col, fx_${id}(col, uv), u_${id}_strength);`);
  }

  const fragmentShader = /* glsl */ `
${helpers}
${uniformChunks.join("\n")}
${funcChunks.join("\n")}
void main() {
  vec2 uv = vUv;
  vec3 col = texture(tDiffuse, uv).rgb;
${applies.join("\n")}
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

  return new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
}
