/**
 * [INPUT]: three ShaderMaterial、本目录 glsl.ts 的 chunks 与 types.ts 的状态 schema
 * [OUTPUT]: 对外提供 buildMaterial(state) → { vertexShader, fragmentShader, uniforms, side } 与 buildShaderMaterial
 * [POS]: lamina 思路的移植实现：图层 = 静态 uniform + GLSL main 体，按 blend mode 合成 lamina_finalColor；
 *        用 __ID__ 字符串模板替代 lamina 的 glsl-tokenizer/descope，不依赖 three-custom-shader-material
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { BlendMode, LayerState, LightingState, MaterialState, LAYER_KIND_META } from "./types";
import { BLEND_CHUNK, HELPERS_CHUNK, LIGHTING_CHUNK, NOISE_CHUNK } from "./glsl";
import { getEnvTexture, getTexture, placeholderTexture } from "./textures";
import { envUrl } from "./env-presets";
import { ObjectEffectState, OBJECT_EFFECT_META } from "./object-effects";

const NOISE_FN: Record<string, string> = {
  perlin: "lamina_noise_perlin",
  simplex: "lamina_noise_simplex",
  cell: "lamina_noise_worley",
  white: "lamina_noise_white",
  curl: "lamina_noise_swirl",
};

const BLEND_FN: Record<BlendMode, string> = {
  normal: "lamina_blend_normal",
  add: "lamina_blend_add",
  subtract: "lamina_blend_subtract",
  multiply: "lamina_blend_multiply",
  screen: "lamina_blend_screen",
  overlay: "lamina_blend_overlay",
  softlight: "lamina_blend_softlight",
  lighten: "lamina_blend_lighten",
  darken: "lamina_blend_darken",
  divide: "lamina_blend_divide",
  reflect: "lamina_blend_reflect",
  negation: "lamina_blend_negation",
};

const LIGHTING_INDEX: Record<LightingState["type"], number> = { basic: 0, lambert: 1, phong: 2, physical: 3, toon: 4 };

type Template = { uniforms: string; body: string; vertex?: { uniforms: string; body: string } };

/** 每种图层的 GLSL 模板：__ID__ 替换为图层 id，%NOISE%/%AXIS%/%PAT% 在构建期烘焙 */
const FRAG: Record<string, Template> = {
  aiTexture: {
    uniforms: `uniform sampler2D u___ID___map;
uniform vec3 u___ID___tint;
uniform float u___ID___scale;`,
    body: `{
  vec2 f_uv___ID__ = fract(v_lamina_uv * max(u___ID___scale, 0.001));
  vec3 f_c___ID__ = texture(u___ID___map, f_uv___ID__).rgb * u___ID___tint;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,
  },
  image: {
    uniforms: `uniform sampler2D u___ID___map;
uniform vec3 u___ID___tint;
uniform float u___ID___scale;`,
    body: `{
  vec2 f_uv___ID__ = fract(v_lamina_uv * max(u___ID___scale, 0.001));
  vec3 f_c___ID__ = texture(u___ID___map, f_uv___ID__).rgb * u___ID___tint;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,
  },
  video: {
    uniforms: `uniform sampler2D u___ID___map;
uniform vec3 u___ID___tint;
uniform float u___ID___scale;`,
    body: `{
  vec2 f_uv___ID__ = fract(v_lamina_uv * max(u___ID___scale, 0.001));
  vec3 f_c___ID__ = texture(u___ID___map, f_uv___ID__).rgb * u___ID___tint;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,
  },
  color: {
    uniforms: "uniform vec3 u___ID___color;",
    body: `{
  f_lc___ID__ = vec4(u___ID___color, u___ID___alpha);
}`,
  },
  depth: {
    uniforms: `uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform float u___ID___near;
uniform float u___ID___far;`,
    body: `{
  float f_d___ID__ = clamp((length(v_lamina_worldPosition - cameraPosition) - u___ID___near) / max(u___ID___far - u___ID___near, 0.001), 0.0, 1.0);
  f_lc___ID__ = vec4(mix(u___ID___colorA, u___ID___colorB, f_d___ID__), u___ID___alpha);
}`,
  },
  normal: {
    uniforms: `uniform vec3 u___ID___direction;
uniform vec3 u___ID___tint;`,
    body: `{
  vec3 f_n___ID__ = normalize(v_lamina_normal) * 0.5 + 0.5;
  f_lc___ID__ = vec4(u___ID___tint * f_n___ID__ * u___ID___direction, u___ID___alpha);
}`,
  },
  gradient: {
    uniforms: `uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform float u___ID___start;
uniform float u___ID___end;
uniform float u___ID___contrast;`,
    body: `{
  float f_c___ID__ = v_lamina_position%AXIS% * u___ID___contrast;
  float f_s___ID__ = smoothstep(u___ID___start, u___ID___end, f_c___ID__);
  f_lc___ID__ = vec4(mix(u___ID___colorA, u___ID___colorB, f_s___ID__), u___ID___alpha);
}`,
  },
  noise: {
    uniforms: `uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform vec3 u___ID___colorC;
uniform vec3 u___ID___colorD;
uniform vec3 u___ID___size;
uniform float u___ID___scale;
uniform float u___ID___movement;
uniform vec2 u___ID___distortion;
uniform vec2 u___ID___factorA;
uniform vec2 u___ID___factorB;`,
    body: `{
  vec3 f_p___ID__ = v_lamina_position * (u___ID___size / 100.0) * max(u___ID___scale, 0.001);
  float f_t___ID__ = u_lamina_time * 0.2 * u___ID___movement;
  float f_nb___ID__ = %NOISE%(f_p___ID__ * max(u___ID___factorB.y, 0.001) + f_t___ID__) * u___ID___factorB.x * 0.1;
  vec3 f_w___ID__ = vec3(
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 31.7 + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 74.3 + f_t___ID__)) * u___ID___distortion.x * 0.35;
  float f_n___ID__ = lamina_normalize(%NOISE%(f_p___ID__ + f_w___ID__ + vec3(f_nb___ID__) + f_t___ID__));
  vec3 f_c___ID__ = mix(u___ID___colorA, u___ID___colorB, smoothstep(0.0, 0.25, f_n___ID__));
  f_c___ID__ = mix(f_c___ID__, u___ID___colorC, smoothstep(0.25, 0.65, f_n___ID__));
  f_c___ID__ = mix(f_c___ID__, u___ID___colorD, smoothstep(0.65, 1.0, f_n___ID__));
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,
    maskBody: `{
  vec3 f_p___ID__ = v_lamina_position * (u___ID___size / 100.0) * max(u___ID___scale, 0.001);
  float f_t___ID__ = u_lamina_time * 0.2 * u___ID___movement;
  float f_nb___ID__ = %NOISE%(f_p___ID__ * max(u___ID___factorB.y, 0.001) + f_t___ID__) * u___ID___factorB.x * 0.1;
  vec3 f_w___ID__ = vec3(
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 31.7 + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 74.3 + f_t___ID__)) * u___ID___distortion.x * 0.35;
  float f_n___ID__ = lamina_normalize(%NOISE%(f_p___ID__ + f_w___ID__ + vec3(f_nb___ID__) + f_t___ID__));
  lamina_finalColor.a *= mix(1.0, clamp(f_n___ID__, 0.0, 1.0), u___ID___alpha);
}`,
  } as Template & { maskBody: string },
  fresnel: {
    uniforms: `uniform vec3 u___ID___color;
uniform float u___ID___power;
uniform float u___ID___intensity;
uniform float u___ID___bias;`,
    body: `{
  float f_f___ID__ = pow(1.0 - abs(dot(normalize(v_lamina_viewDir), normalize(v_lamina_normal))), max(u___ID___power, 0.001));
  float f_fv___ID__ = clamp(u___ID___bias + u___ID___intensity * f_f___ID__, 0.0, 1.0);
  f_lc___ID__ = vec4(u___ID___color * f_fv___ID__, u___ID___alpha);
}`,
  },
  cavity: {
    uniforms: `uniform float u___ID___scale;
uniform float u___ID___threshold;
uniform float u___ID___strength;`,
    body: `{
  float f_n___ID__ = lamina_normalize(lamina_noise_simplex(v_lamina_position * max(u___ID___scale, 0.001)));
  float f_c___ID__ = 1.0 - smoothstep(u___ID___threshold, u___ID___threshold + 0.18, f_n___ID__);
  f_lc___ID__ = vec4(vec3(0.0), f_c___ID__ * u___ID___strength * u___ID___alpha);
}`,
  },
  dust: {
    uniforms: `uniform vec3 u___ID___color;
uniform float u___ID___scale;
uniform float u___ID___coverage;`,
    body: `{
  float f_n___ID__ = lamina_normalize(lamina_noise_simplex(v_lamina_position * max(u___ID___scale, 0.001)));
  float f_d___ID__ = smoothstep(1.0 - u___ID___coverage, 1.0 - u___ID___coverage * 0.6, f_n___ID__);
  f_lc___ID__ = vec4(u___ID___color, f_d___ID__ * u___ID___alpha);
}`,
  },
  rainbow: {
    uniforms: `uniform float u___ID___hueShift;
uniform float u___ID___saturation;`,
    body: `{
  float f_h___ID__ = fract(v_lamina_position.x * 0.18 + v_lamina_position.y * 0.22 + u___ID___hueShift);
  vec3 f_c___ID__ = lamina_hsl2rgb(vec3(f_h___ID__, clamp(u___ID___saturation, 0.0, 1.0), 0.6));
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,
  },
  toon: {
    uniforms: `uniform vec3 u___ID___color;
uniform float u___ID___steps;`,
    body: `{
  float f_ndl___ID__ = max(dot(normalize(v_lamina_normal), LAMINA_KEY), 0.0);
  float f_cel___ID__ = floor(f_ndl___ID__ * max(u___ID___steps, 1.0)) / max(u___ID___steps, 1.0);
  f_lc___ID__ = vec4(u___ID___color * (0.35 + 0.65 * f_cel___ID__), u___ID___alpha);
}`,
  },
  outline: {
    uniforms: `uniform vec3 u___ID___color;
uniform float u___ID___width;
uniform float u___ID___threshold;`,
    body: `{
  float f_rim___ID__ = 1.0 - abs(dot(normalize(v_lamina_viewDir), normalize(v_lamina_normal)));
  float f_o___ID__ = 1.0 - smoothstep(u___ID___threshold - u___ID___width, u___ID___threshold + 0.001, f_rim___ID__);
  f_lc___ID__ = vec4(u___ID___color, (1.0 - f_o___ID__) * u___ID___alpha);
}`,
  },
  glass: {
    uniforms: `uniform vec3 u___ID___color;
uniform float u___ID___transmission;
uniform float u___ID___refraction;
uniform float u___ID___thickness;
uniform float u___ID___aberration;
uniform float u___ID___roughness;`,
    body: `{
  vec3 f_N___ID__ = normalize(v_lamina_normal);
  vec3 f_V___ID__ = normalize(v_lamina_viewDir);
  float f_ndv___ID__ = max(dot(f_N___ID__, f_V___ID__), 0.0);
  float f_rough___ID__ = clamp(u___ID___roughness, 0.02, 1.0);
  float f_ior___ID__ = max(u___ID___refraction, 1.01);
  vec3 f_rd___ID__ = refract(-f_V___ID__, f_N___ID__, 1.0 / f_ior___ID__);
  if (dot(f_rd___ID__, f_rd___ID__) < 0.001) f_rd___ID__ = reflect(-f_V___ID__, f_N___ID__);
  float f_ab___ID__ = u___ID___aberration * 0.08;
  vec3 f_refr___ID__ = vec3(
    lamina_env(normalize(f_rd___ID__ + f_N___ID__ * f_ab___ID__), f_rough___ID__ * 2.0).r,
    lamina_env(f_rd___ID__, f_rough___ID__ * 2.0).g,
    lamina_env(normalize(f_rd___ID__ - f_N___ID__ * f_ab___ID__), f_rough___ID__ * 2.0).b);
  vec3 f_refl___ID__ = lamina_env(reflect(-f_V___ID__, f_N___ID__), f_rough___ID__ * 2.0);
  float f_F___ID__ = pow(1.0 - f_ndv___ID__, 5.0);
  vec3 f_c___ID__ = mix(u___ID___color * f_refr___ID__, f_refl___ID__, clamp(f_F___ID__ * 1.7 + 0.05, 0.0, 1.0));
  f_c___ID__ *= mix(vec3(1.0), u___ID___color, clamp(u___ID___thickness * (1.0 - f_ndv___ID__) * 0.85, 0.0, 1.0));
  f_lc___ID__ = vec4(f_c___ID__, clamp(u___ID___transmission + f_F___ID__ * 0.4, 0.0, 1.0));
}`,
  },
  reflection: {
    uniforms: `uniform vec3 u___ID___sky;
uniform vec3 u___ID___ground;
uniform float u___ID___power;`,
    body: `{
  vec3 f_r___ID__ = reflect(-normalize(v_lamina_viewDir), normalize(v_lamina_normal));
  float f_m___ID__ = pow(clamp(f_r___ID__.y * 0.5 + 0.5, 0.0, 1.0), max(u___ID___power, 0.001));
  f_lc___ID__ = vec4(mix(u___ID___ground, u___ID___sky, f_m___ID__), u___ID___alpha);
}`,
  },
  matcap: {
    uniforms: `uniform vec3 u___ID___light;
uniform vec3 u___ID___dark;
uniform float u___ID___rim;`,
    body: `{
  vec3 f_n___ID__ = normalize(v_lamina_normal);
  vec2 f_m___ID__ = f_n___ID__.xy * 0.5 + 0.5;
  vec3 f_c___ID__ = mix(u___ID___dark, u___ID___light, clamp(f_m___ID__.y * 0.85 + 0.15, 0.0, 1.0));
  f_c___ID__ += vec3(1.0) * smoothstep(0.16, 0.0, distance(f_m___ID__, vec2(0.64, 0.74))) * u___ID___rim;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,
  },
  pattern: {
    uniforms: `uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform float u___ID___scale;`,
    body: `{
  vec2 f_g___ID__ = v_lamina_uv * max(u___ID___scale, 0.001);
  float f_m___ID__ = %PAT%;
  f_lc___ID__ = vec4(mix(u___ID___colorA, u___ID___colorB, f_m___ID__), u___ID___alpha);
}`,
  },
  vertexColor: {
    uniforms: `uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;`,
    body: `{
  vec3 f_n___ID__ = normalize(v_lamina_normal);
  vec3 f_c___ID__ = mix(u___ID___colorA, u___ID___colorB, f_n___ID__.y * 0.5 + 0.5) * (0.75 + 0.25 * length(f_n___ID__.xz));
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,
  },
};

/** Displace 是唯一的 vertex 图层：移植 lamina Displace 的位移 + 邻域重算法线 */
const DISPLACE_VERTEX: NonNullable<Template["vertex"]> = {  uniforms: `uniform float u___ID___strength;
uniform float u___ID___scale;
uniform vec3 u___ID___offset;
vec3 lamina_displace___ID__(vec3 p) {
  float f_n = %NOISE%((p + u___ID___offset) * max(u___ID___scale, 0.001)) * u___ID___strength;
  return p + (f_n * normal);
}
vec3 lamina_orthogonal___ID__(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}`,
  body: `{
  vec3 f_newPos___ID__ = lamina_displace___ID__(lamina_finalPosition);
  float f_off___ID__ = 0.001;
  vec3 f_tan___ID__ = lamina_orthogonal___ID__(normal);
  vec3 f_bitan___ID__ = normalize(cross(normal, f_tan___ID__));
  vec3 f_n1___ID__ = lamina_displace___ID__(lamina_finalPosition + f_tan___ID__ * f_off___ID__);
  vec3 f_n2___ID__ = lamina_displace___ID__(lamina_finalPosition + f_bitan___ID__ * f_off___ID__);
  lamina_finalNormal = normalize(cross(f_n1___ID__ - f_newPos___ID__, f_n2___ID__ - f_newPos___ID__));
  lamina_finalPosition = f_newPos___ID__;
}`,
};

/** 物体级 Effects 的 fragment 片段：pre = 光照前（改 albedo），post = 光照后（改最终明暗/透明） */
const OBJECT_EFFECT_FRAG: Record<string, { uniforms: string; body: string; stage: "pre" | "post"; noise?: boolean }> = {
  noise: {
    stage: "pre",
    noise: true,
    uniforms: `uniform float u___ID___blur;
uniform float u___ID___type;
uniform float u___ID___amplitude;
uniform float u___ID___scale;
uniform vec2 u___ID___stretch;
uniform vec2 u___ID___offset;
uniform float u___ID___movement;
uniform float u___ID___seed;`,
    body: `{
  vec3 f_p___ID__ = v_lamina_position * max(u___ID___scale, 0.001) * vec3(max(u___ID___stretch.x, 0.001), 1.0, max(u___ID___stretch.y, 0.001));
  f_p___ID__ += vec3(u___ID___offset.x, u___ID___seed * 17.31, u___ID___offset.y);
  f_p___ID__ += u_lamina_time * u___ID___movement * 0.25;
  float f_oe___ID__ = lamina_normalize(%NOISE%(f_p___ID__));
  f_oe___ID__ = mix(f_oe___ID__, 0.5, clamp(u___ID___blur, 0.0, 1.0));
  float f_k___ID__ = 1.0 - u___ID___amplitude * 0.1 + f_oe___ID__ * u___ID___amplitude * 0.2;
  float f_fade___ID__ = u___ID___type > 0.5 ? clamp(v_lamina_position.y * 0.5 + 0.5, 0.0, 1.0) : 1.0;
  lamina_finalColor.rgb *= mix(1.0, f_k___ID__, clamp(u___ID___opacity * f_fade___ID__, 0.0, 1.0));
}`,
  },
  innerShadow: {
    stage: "post",
    uniforms: `uniform float u___ID___strength;
uniform float u___ID___power;`,
    body: `{
  float f_oe___ID__ = pow(1.0 - lamina_ndv, max(u___ID___power, 0.01));
  lamina_lit *= 1.0 - clamp(u___ID___strength * f_oe___ID__, 0.0, 1.0);
}`,
  },
  layerBlur: {
    stage: "post",
    uniforms: `uniform float u___ID___amount;`,
    body: `{
  float f_oe___ID__ = clamp(u___ID___amount, 0.0, 1.0);
  vec3 f_oeB___ID__ = lamina_env(normalize(v_lamina_normal), 3.0);
  lamina_lit = mix(lamina_lit, f_oeB___ID__, f_oe___ID__ * 0.8);
  lamina_finalColor.a *= 1.0 - f_oe___ID__ * 0.22 * pow(1.0 - lamina_ndv, 1.5);
}`,
  },
};

const linear = (hex: string) => new THREE.Color(hex).convertSRGBToLinear();

const asVec2 = (v: unknown, fallback: number[]) => {
  const arr = Array.isArray(v) && v.length >= 2 ? v : fallback;
  return new THREE.Vector2(arr[0], arr[1]);
};
const asVec3 = (v: unknown, fallback: number[]) => {
  const arr = Array.isArray(v) && v.length >= 3 ? v : fallback;
  return new THREE.Vector3(arr[0], arr[1], arr[2]);
};

export type BuiltMaterial = {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, THREE.IUniform>;
  side: THREE.Side;
};

const VERTEX_PRELUDE = /* glsl */ `
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
uniform float u_lamina_time;
`;

const FRAGMENT_PRELUDE = /* glsl */ `
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
`;

export function buildMaterial(state: MaterialState, objectEffects: ObjectEffectState[] = []): BuiltMaterial {
  const uniforms: Record<string, THREE.IUniform> = {
    u_lamina_time: { value: 0 },
    u_lamina_opacity: { value: state.opacity / 100 },
    u_lamina_lighting: { value: state.lighting.enabled ? LIGHTING_INDEX[state.lighting.type] : 0 },
    u_lamina_lightStrength: { value: state.lighting.strength / 100 },
    u_lamina_lightColor: { value: linear(state.lighting.color) },
    u_lamina_shininess: { value: state.lighting.shining },
    u_lamina_roughness: { value: state.lighting.roughness },
    u_lamina_metalness: { value: state.lighting.metalness },
    u_lamina_reflectivity: { value: state.lighting.reflectivity },
    u_lamina_glass: { value: state.lighting.glass },
    u_lamina_aberration: { value: state.lighting.aberration },
    u_lamina_thickness: { value: state.lighting.thickness },
    u_lamina_refraction: { value: state.lighting.refraction },
    u_lamina_blur: { value: state.lighting.blur },
    u_lamina_envEnabled: { value: state.env.enabled ? 1 : 0 },
    u_lamina_envExposure: { value: state.env.exposure },
    u_lamina_envRotation: { value: asVec3(state.env.rotation, [0, 0, 0]) },
    u_lamina_envHasMap: { value: state.env.map ? 1 : 0 },
    u_lamina_envMap: { value: getEnvTexture(envUrl(state.env.map)) },
    u_lamina_lightIntensity: { value: 1 },
    u_lamina_ambient: { value: 0.75 },
    u_lamina_tonemapping: { value: 0 },
    u_lamina_bump: { value: state.lighting.bumpMap === "noise" ? 1 : 0 },
    u_lamina_occlusion: { value: state.lighting.occlusion ? 1 : 0 },
    u_lamina_flat: { value: state.shading === "flat" ? 1 : 0 },
    u_lamina_selected: { value: 0 },
    u_lamina_fx_liquid: { value: 0 },
    u_lamina_fx_liquidAmount: { value: 0.5 },
    u_lamina_fx_ngScale: { value: 6 },
    u_lamina_fx_ngOpacity: { value: 0 },
    u_lamina_fx_glassOffset: { value: new THREE.Vector2(0, 0) },
    u_lamina_fx_glassMode: { value: 0 },
    u_lamina_fx_glassProfile: { value: 0 },
    u_lamina_fx_glassMag: { value: 0 },
    u_lamina_base: { value: linear("#ffffff") },
  };

  const fragChunks: string[] = [];
  const fragBodies: string[] = [];
  const vertChunks: string[] = [];
  const vertBodies: string[] = [];

  for (const layer of state.layers) {
    if (!layer.visible) continue;
    const id = layer.id;
    const meta = LAYER_KIND_META[layer.kind];
    const template = FRAG[layer.kind];
    if (!template || !meta) continue;

    uniforms[`u_${id}_alpha`] = { value: layer.opacity / 100 };
    for (const field of meta.fields) {
      const value = layer.params[field.key];
      const name = `u_${id}_${field.key}`;
      switch (field.type) {
        case "color":
          uniforms[name] = { value: linear(typeof value === "string" ? value : "#ffffff") };
          break;
        case "texture": {
          const url = String(value ?? "");
          uniforms[name] = { value: url ? getTexture(url) : placeholderTexture() };
          break;
        }
        case "vec2":
          uniforms[name] = { value: asVec2(value, [1, 1]) };
          break;
        case "vec3":
          uniforms[name] = { value: asVec3(value, [0, 0, 0]) };
          break;
        case "select":
        case "segment":
          uniforms[name] = { value: Math.max(field.options?.indexOf(String(value)) ?? 0, 0) };
          break;
        default:
          uniforms[name] = { value: typeof value === "number" ? value : 0 };
      }
    }

    const noiseFn = NOISE_FN[String(layer.params.type)] ?? NOISE_FN.simplex;
    const fill = (source: string) =>
      source.replaceAll("__ID__", id).replaceAll("%NOISE%", noiseFn).replaceAll("%AXIS%", `.${layer.params.axes ?? "y"}`).replaceAll(
        "%PAT%",
        layer.params.pattern === "stripes"
          ? `step(0.5, fract(f_g___ID__.x * 0.5))`.replaceAll("__ID__", id)
          : `mod(floor(f_g___ID__.x) + floor(f_g___ID__.y), 2.0)`.replaceAll("__ID__", id),
      );

    fragChunks.push(`uniform float u_${id}_alpha;\n${fill(template.uniforms)}`);
    const isMask = layer.kind === "noise" && layer.params.mode === "mask";
    const body = isMask ? (FRAG.noise as Template & { maskBody: string }).maskBody : template.body;
    if (isMask) {
      fragBodies.push(fill(body));
    } else {
      const blend = BLEND_FN[layer.mode];
      fragBodies.push(`{\n  vec4 f_lc___ID__;\n${fill(body)}\n  lamina_finalColor = ${blend}(lamina_finalColor, f_lc___ID__, u___ID___alpha);\n}`.replaceAll("__ID__", id));
    }

    if (layer.kind === "displace" && template !== undefined) {
      vertChunks.push(fill(DISPLACE_VERTEX.uniforms));
      vertBodies.push(fill(DISPLACE_VERTEX.body));
    }
  }

  /* ---------- 物体级 Effects（只作用于该物体的 shader） ---------- */
  const oePreBodies: string[] = [];
  const oePostBodies: string[] = [];
  for (const fx of objectEffects) {
    if (!fx.visible) continue;
    const meta = OBJECT_EFFECT_META[fx.kind];
    const template = OBJECT_EFFECT_FRAG[fx.kind];
    uniforms[`u_${fx.id}_opacity`] = { value: fx.opacity / 100 };
    if (template) {
      for (const field of meta.fields) {
        const value = fx.params[field.key];
        const name = `u_${fx.id}_${field.key}`;
        if (field.type === "color") uniforms[name] = { value: linear(typeof value === "string" ? value : "#ffffff") };
        else if (field.type === "select") uniforms[name] = { value: Math.max(field.options?.indexOf(String(value)) ?? 0, 0) };
        else if (field.type === "vec2") uniforms[name] = { value: asVec2(value, [0, 0]) };
        else uniforms[name] = { value: typeof value === "number" ? value : 0 };
      }
      let extraFns = "";
      let noiseFn = NOISE_FN[String(fx.params.noiseType)] ?? NOISE_FN.simplex;
      if (fx.params.noiseType === "fbm") extraFns = `float lamina_noise_fbm(vec3 p) { return lamina_noise_perlin(p) * 0.6 + lamina_noise_perlin(p * 2.7) * 0.4; }`;
      if (fx.params.noiseType === "sine") extraFns = `float lamina_noise_sine(vec3 p) { return sin(p.x) * sin(p.y) * sin(p.z) * 0.55 + sin((p.x + p.y + p.z) * 0.7) * 0.45; }`;
      if (fx.params.noiseType === "sine") noiseFn = "lamina_noise_sine";
      if (fx.params.noiseType === "fbm") noiseFn = "lamina_noise_fbm";
      if (extraFns) fragChunks.push(extraFns);
      const source = `uniform float u_${fx.id}_opacity;\n${template.uniforms.replaceAll("__ID__", fx.id).replaceAll("%NOISE%", noiseFn)}`;
      fragChunks.push(source);
      const body = template.body.replaceAll("__ID__", fx.id).replaceAll("%NOISE%", noiseFn);
      (template.stage === "pre" ? oePreBodies : oePostBodies).push(body);
    }
    if (fx.kind === "glass") {
      // Glass 效果 = 玻璃套件的非破坏变体（覆盖 lighting 玻璃参数 + fx uniforms）
      const vec = (key: string, fallback: [number, number]) => (Array.isArray(fx.params[key]) ? (fx.params[key] as number[]) : fallback);
      const num = (key: string, fallback: number) => (typeof fx.params[key] === "number" ? (fx.params[key] as number) : fallback);
      uniforms.u_lamina_glass.value = 1;
      uniforms.u_lamina_roughness.value = Math.max(uniforms.u_lamina_roughness.value as number, 0.04);
      uniforms.u_lamina_blur.value = num("blur", 0.1);
      uniforms.u_lamina_aberration.value = num("aberration", 0.05);
      uniforms.u_lamina_thickness.value = num("depth", 10) * 0.05;
      uniforms.u_lamina_refraction.value = 1.12 * (1 + num("magnification", 0) * 0.35);
      uniforms.u_lamina_fx_liquid.value = num("distortion", 0.15) > 0.001 ? 1 : 0;
      uniforms.u_lamina_fx_liquidAmount.value = num("distortion", 0.15);
      uniforms.u_lamina_fx_glassOffset.value = asVec2(vec("offset", [0, 0]), [0, 0]);
      uniforms.u_lamina_fx_glassMode.value = String(fx.params.edgeFill) === "fill" ? 1 : 0;
      uniforms.u_lamina_fx_glassProfile.value = num("profile", 0);
      uniforms.u_lamina_fx_glassMag.value = num("magnification", 0);
    }
    if (fx.kind === "noiseGlass") {
      uniforms.u_lamina_glass.value = 1;
      uniforms.u_lamina_blur.value = typeof fx.params.blur === "number" ? fx.params.blur : 0.08;
      uniforms.u_lamina_fx_ngScale.value = typeof fx.params.scale === "number" ? fx.params.scale : 6;
      uniforms.u_lamina_fx_ngOpacity.value = typeof fx.params.grain === "number" ? fx.params.grain : 0.55;
    }
  }

  const vertexShader = /* glsl */ `
${HELPERS_CHUNK}
${NOISE_CHUNK}
${VERTEX_PRELUDE}
${vertChunks.join("\n")}
void main() {
  vec3 lamina_finalPosition = position;
  vec3 lamina_finalNormal = normal;
${vertBodies.join("\n")}
  vec4 lamina_world = modelMatrix * vec4(lamina_finalPosition, 1.0);
  v_lamina_worldPosition = lamina_world.xyz;
  v_lamina_position = lamina_finalPosition;
  v_lamina_uv = uv;
  v_lamina_normal = normalize(mat3(modelMatrix) * lamina_finalNormal);
  v_lamina_viewDir = cameraPosition - lamina_world.xyz;
  gl_Position = projectionMatrix * viewMatrix * lamina_world;
}
`;

  const fragmentShader = /* glsl */ `
${HELPERS_CHUNK}
${NOISE_CHUNK}
${BLEND_CHUNK}
${FRAGMENT_PRELUDE}
${fragChunks.join("\n")}
${LIGHTING_CHUNK}
void main() {
  vec3 N = normalize(v_lamina_normal);
  vec3 V = normalize(v_lamina_viewDir);
  if (u_lamina_flat > 0.5) {
    vec3 lamina_face = normalize(cross(dFdx(v_lamina_worldPosition), dFdy(v_lamina_worldPosition)));
    N = dot(lamina_face, N) < 0.0 ? -lamina_face : lamina_face;
  }
  if (u_lamina_bump > 0.5) {
    vec3 lamina_T = normalize(cross(N, vec3(0.0, 1.0, 0.0)) + vec3(0.001));
    vec3 lamina_B = cross(N, lamina_T);
    vec3 lamina_bp = v_lamina_position * 6.0;
    float lamina_e = 0.05;
    float lamina_h0 = lamina_noise_simplex(lamina_bp);
    N = normalize(N - (lamina_T * (lamina_noise_simplex(lamina_bp + vec3(lamina_e, 0.0, 0.0)) - lamina_h0) + lamina_B * (lamina_noise_simplex(lamina_bp + vec3(0.0, lamina_e, 0.0)) - lamina_h0)) * 2.2);
  }
  vec4 lamina_finalColor = vec4(u_lamina_base, u_lamina_opacity);
  ${/* physical + glass>0 时物体半透明（对齐 Spline 的 Glass 连续参数） */
  ""}
  if (u_lamina_lighting > 2.5 && u_lamina_lighting < 3.5) {
    lamina_finalColor.a = mix(lamina_finalColor.a, lamina_finalColor.a * (1.0 - u_lamina_glass * 0.45), step(0.001, u_lamina_glass));
  }
${fragBodies.join("\n")}
${oePreBodies.join("\n")}
  vec3 lamina_lit = lamina_shade(lamina_finalColor.rgb, N, V);
  float lamina_ndv = max(dot(N, V), 0.0);
  lamina_lit *= mix(1.0, 0.5 + 0.5 * smoothstep(0.0, 1.0, lamina_ndv), u_lamina_occlusion);
${oePostBodies.join("\n")}
  lamina_lit += vec3(0.25, 0.55, 1.0) * pow(1.0 - lamina_ndv, 2.5) * u_lamina_selected * 1.1;
  if (u_lamina_fx_ngOpacity > 0.001) {
    float lamina_ng = lamina_normalize(lamina_noise_simplex(v_lamina_position * max(u_lamina_fx_ngScale, 0.001) + u_lamina_time * 0.15));
    lamina_lit = mix(lamina_lit, lamina_lit * (0.45 + 0.55 * lamina_ng), clamp(u_lamina_fx_ngOpacity, 0.0, 1.0));
  }
  if (u_lamina_tonemapping > 0.5) {
    lamina_lit = (lamina_lit * (2.51 * lamina_lit + 0.03)) / (lamina_lit * (2.43 * lamina_lit + 0.59) + 0.14);
  }
  gl_FragColor = vec4(pow(max(lamina_lit, vec3(0.0)), vec3(0.4545)), lamina_finalColor.a);
}
`;

  const side: THREE.Side = state.sides === "both" ? THREE.DoubleSide : state.sides === "back" ? THREE.BackSide : THREE.FrontSide;
  return { vertexShader, fragmentShader, uniforms, side };
}

export function buildShaderMaterial(state: MaterialState, objectEffects: ObjectEffectState[] = []): THREE.ShaderMaterial {
  const built = buildMaterial(state, objectEffects);
  return new THREE.ShaderMaterial({
    vertexShader: built.vertexShader,
    fragmentShader: built.fragmentShader,
    uniforms: built.uniforms,
    side: built.side,
    transparent: true,
    depthWrite: true,
  });
}
