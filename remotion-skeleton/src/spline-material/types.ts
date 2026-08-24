/**
 * [INPUT]: 无外部依赖；纯数据与类型契约
 * [OUTPUT]: 对外提供图层/材质状态类型、20 种 Spline 图层的元数据与参数 schema、面板默认状态
 * [POS]: spline-material 实验的单一事实来源；引擎（layers.ts）与面板 UI 都按此 schema 渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

export type BlendMode =
  | "normal"
  | "add"
  | "subtract"
  | "multiply"
  | "screen"
  | "overlay"
  | "softlight"
  | "lighten"
  | "darken"
  | "divide"
  | "reflect"
  | "negation";

export const BLEND_MODES: BlendMode[] = [
  "normal",
  "add",
  "subtract",
  "multiply",
  "screen",
  "overlay",
  "softlight",
  "lighten",
  "darken",
  "divide",
  "reflect",
  "negation",
];

export const BLEND_LABEL: Record<BlendMode, string> = {
  normal: "Normal",
  add: "Add",
  subtract: "Subtract",
  multiply: "Multiply",
  screen: "Screen",
  overlay: "Overlay",
  softlight: "Soft Light",
  lighten: "Lighten",
  darken: "Darken",
  divide: "Divide",
  reflect: "Reflect",
  negation: "Negation",
};

/** 与 Spline 图层菜单（Image 2）一致的顺序 */
export type LayerKind =
  | "aiTexture"
  | "image"
  | "video"
  | "color"
  | "depth"
  | "normal"
  | "gradient"
  | "noise"
  | "fresnel"
  | "cavity"
  | "dust"
  | "rainbow"
  | "toon"
  | "outline"
  | "glass"
  | "reflection"
  | "matcap"
  | "displace"
  | "pattern"
  | "vertexColor";

export type NoiseType = "perlin" | "simplex" | "cell" | "white" | "curl";
export type LightingType = "lambert" | "phong" | "physical" | "toon" | "basic";
export type LightingMode = "mask" | "color";

export type ParamValue = string | number | number[];
export type LayerParams = Record<string, ParamValue>;

export type FieldType = "color" | "number" | "vec2" | "vec3" | "percent" | "select" | "segment";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  prefix?: string;
  step?: number;
  /** 相同 group 的字段连续渲染，group 变化处画分隔线（对应 Spline 弹窗的分组线） */
  group?: number;
};

export type KindMeta = {
  label: string;
  /** 图层行与类型菜单里的图标 */
  icon: LayerKind;
  /** color 类图层在行内直接展示 hex 值 */
  hexKey?: string;
  defaults: LayerParams;
  fields: Field[];
};

const noiseFields: Field[] = [
  { key: "mode", label: "Mode", type: "segment", options: ["mask", "color"], group: 0 },
  { key: "type", label: "Type", type: "select", options: ["perlin", "simplex", "cell", "white", "curl"], group: 1 },
  { key: "size", label: "Size", type: "vec3", prefix: "XYZ", group: 1 },
  { key: "scale", label: "Scale", type: "number", prefix: "S", step: 0.1, group: 1 },
  { key: "movement", label: "Movement", type: "number", prefix: "M", step: 0.1, group: 1 },
  { key: "colorA", label: "Color", type: "color", group: 1 },
  { key: "colorB", label: "Color", type: "color", group: 1 },
  { key: "colorC", label: "Color", type: "color", group: 1 },
  { key: "colorD", label: "Color", type: "color", group: 1 },
  { key: "distortion", label: "Distortion", type: "vec2", prefix: "XY", step: 0.1, group: 2 },
  { key: "factorA", label: "FactorA", type: "vec2", prefix: "XY", step: 0.1, group: 2 },
  { key: "factorB", label: "FactorB", type: "vec2", prefix: "XY", step: 0.1, group: 2 },
];

export const LAYER_KIND_META: Record<LayerKind, KindMeta> = {
  aiTexture: {
    label: "AI Texture",
    icon: "aiTexture",
    defaults: { tint: "#9aa0a6" },
    fields: [{ key: "tint", label: "Tint", type: "color", group: 0 }],
  },
  image: {
    label: "Image",
    icon: "image",
    defaults: { tint: "#8f8f8f" },
    fields: [{ key: "tint", label: "Tint", type: "color", group: 0 }],
  },
  video: {
    label: "Video",
    icon: "video",
    defaults: { tint: "#8f8f8f" },
    fields: [{ key: "tint", label: "Tint", type: "color", group: 0 }],
  },
  color: {
    label: "Color",
    icon: "color",
    hexKey: "color",
    defaults: { color: "#54545e" },
    fields: [{ key: "color", label: "Color", type: "color", group: 0 }],
  },
  depth: {
    label: "Depth",
    icon: "depth",
    defaults: { colorA: "#ffffff", colorB: "#1c1c1c", near: 2, far: 10 },
    fields: [
      { key: "colorA", label: "Color A", type: "color", group: 0 },
      { key: "colorB", label: "Color B", type: "color", group: 0 },
      { key: "near", label: "Near", type: "number", step: 0.1, group: 0 },
      { key: "far", label: "Far", type: "number", step: 0.5, group: 0 },
    ],
  },
  normal: {
    label: "Normal",
    icon: "normal",
    defaults: { direction: [1, 1, 1], tint: "#ffffff" },
    fields: [
      { key: "direction", label: "Direction", type: "vec3", prefix: "XYZ", step: 0.1, group: 0 },
      { key: "tint", label: "Tint", type: "color", group: 0 },
    ],
  },
  gradient: {
    label: "Gradient",
    icon: "gradient",
    defaults: { colorA: "#ffffff", colorB: "#232323", axes: "y", start: -1, end: 1, contrast: 1 },
    fields: [
      { key: "colorA", label: "Color A", type: "color", group: 0 },
      { key: "colorB", label: "Color B", type: "color", group: 0 },
      { key: "axes", label: "Axes", type: "select", options: ["x", "y", "z"], group: 0 },
      { key: "start", label: "Start", type: "number", step: 0.1, group: 1 },
      { key: "end", label: "End", type: "number", step: 0.1, group: 1 },
      { key: "contrast", label: "Contrast", type: "number", step: 0.1, group: 1 },
    ],
  },
  noise: {
    label: "Noise",
    icon: "noise",
    defaults: {
      mode: "color",
      type: "simplex",
      size: [100, 100, 100],
      scale: 1,
      movement: 1,
      colorA: "#666666",
      colorB: "#666666",
      colorC: "#ffffff",
      colorD: "#ffffff",
      distortion: [1, 1],
      factorA: [1.7, 9.2],
      factorB: [8.3, 2.8],
    },
    fields: noiseFields,
  },
  fresnel: {
    label: "Fresnel",
    icon: "fresnel",
    defaults: { color: "#ffffff", power: 3, intensity: 1, bias: 0 },
    fields: [
      { key: "color", label: "Color", type: "color", group: 0 },
      { key: "power", label: "Power", type: "number", step: 0.1, group: 0 },
      { key: "intensity", label: "Intensity", type: "number", step: 0.1, group: 0 },
      { key: "bias", label: "Bias", type: "number", step: 0.05, group: 0 },
    ],
  },
  cavity: {
    label: "Cavity",
    icon: "cavity",
    defaults: { scale: 2.5, threshold: 0.55, strength: 0.8 },
    fields: [
      { key: "scale", label: "Scale", type: "number", step: 0.1, group: 0 },
      { key: "threshold", label: "Threshold", type: "number", step: 0.05, group: 0 },
      { key: "strength", label: "Strength", type: "number", step: 0.05, group: 0 },
    ],
  },
  dust: {
    label: "Dust",
    icon: "dust",
    defaults: { color: "#ffffff", scale: 14, coverage: 0.18 },
    fields: [
      { key: "color", label: "Color", type: "color", group: 0 },
      { key: "scale", label: "Scale", type: "number", step: 0.5, group: 0 },
      { key: "coverage", label: "Coverage", type: "number", step: 0.02, group: 0 },
    ],
  },
  rainbow: {
    label: "Rainbow",
    icon: "rainbow",
    defaults: { hueShift: 0, saturation: 0.75 },
    fields: [
      { key: "hueShift", label: "Hue Shift", type: "number", step: 0.05, group: 0 },
      { key: "saturation", label: "Saturation", type: "number", step: 0.05, group: 0 },
    ],
  },
  toon: {
    label: "Toon",
    icon: "toon",
    defaults: { color: "#ff9060", steps: 3 },
    fields: [
      { key: "color", label: "Color", type: "color", group: 0 },
      { key: "steps", label: "Steps", type: "number", step: 1, group: 0 },
    ],
  },
  outline: {
    label: "Outline",
    icon: "outline",
    defaults: { color: "#101010", width: 0.08, threshold: 0.32 },
    fields: [
      { key: "color", label: "Color", type: "color", group: 0 },
      { key: "width", label: "Width", type: "number", step: 0.01, group: 0 },
      { key: "threshold", label: "Threshold", type: "number", step: 0.02, group: 0 },
    ],
  },
  glass: {
    label: "Glass",
    icon: "glass",
    defaults: { color: "#bfe3ef", edge: 0.9 },
    fields: [
      { key: "color", label: "Color", type: "color", group: 0 },
      { key: "edge", label: "Edge", type: "number", step: 0.05, group: 0 },
    ],
  },
  reflection: {
    label: "Reflection",
    icon: "reflection",
    defaults: { sky: "#bcd6ff", ground: "#3a2f2a", power: 1.2 },
    fields: [
      { key: "sky", label: "Sky", type: "color", group: 0 },
      { key: "ground", label: "Ground", type: "color", group: 0 },
      { key: "power", label: "Power", type: "number", step: 0.1, group: 0 },
    ],
  },
  matcap: {
    label: "Matcap",
    icon: "matcap",
    defaults: { light: "#f2f2f2", dark: "#3c3c3c", rim: 0.6 },
    fields: [
      { key: "light", label: "Light", type: "color", group: 0 },
      { key: "dark", label: "Dark", type: "color", group: 0 },
      { key: "rim", label: "Rim", type: "number", step: 0.05, group: 0 },
    ],
  },
  displace: {
    label: "Displace",
    icon: "displace",
    defaults: { strength: 0.22, scale: 2.4, offset: [0, 0, 0], type: "simplex" },
    fields: [
      { key: "type", label: "Type", type: "select", options: ["perlin", "simplex", "cell", "white", "curl"], group: 0 },
      { key: "strength", label: "Strength", type: "number", step: 0.01, group: 0 },
      { key: "scale", label: "Scale", type: "number", step: 0.1, group: 0 },
      { key: "offset", label: "Offset", type: "vec3", prefix: "XYZ", step: 0.1, group: 0 },
    ],
  },
  pattern: {
    label: "Pattern",
    icon: "pattern",
    defaults: { colorA: "#e8e8e8", colorB: "#3a3a3a", scale: 8, pattern: "checker" },
    fields: [
      { key: "pattern", label: "Type", type: "select", options: ["checker", "stripes"], group: 0 },
      { key: "colorA", label: "Color A", type: "color", group: 0 },
      { key: "colorB", label: "Color B", type: "color", group: 0 },
      { key: "scale", label: "Scale", type: "number", step: 0.5, group: 0 },
    ],
  },
  vertexColor: {
    label: "Vertex Color",
    icon: "vertexColor",
    defaults: { colorA: "#7fe0c3", colorB: "#7f9fe0" },
    fields: [
      { key: "colorA", label: "Color A", type: "color", group: 0 },
      { key: "colorB", label: "Color B", type: "color", group: 0 },
    ],
  },
};

/** Image 2 菜单顺序：AI Texture 置顶 + 分隔线，其余按 Spline 排列 */
export const LAYER_MENU_ORDER: LayerKind[] = [
  "aiTexture",
  "image",
  "video",
  "color",
  "depth",
  "normal",
  "gradient",
  "noise",
  "fresnel",
  "cavity",
  "dust",
  "rainbow",
  "toon",
  "outline",
  "glass",
  "reflection",
  "matcap",
  "displace",
  "pattern",
  "vertexColor",
];

export type LayerState = {
  id: string;
  kind: LayerKind;
  name: string;
  mode: BlendMode;
  visible: boolean;
  /** 行内的 0-100 不透明度，映射 u_<id>_alpha */
  opacity: number;
  params: LayerParams;
};

export type LightingState = {
  enabled: boolean;
  /** 行内的 0-100 光照强度，映射 u_lamina_lightStrength */
  strength: number;
  type: LightingType;
  color: string;
  shining: number;
  bumpMap: "none" | "noise";
  occlusion: boolean;
};

export const LIGHTING_DEFAULT: LightingState = { enabled: true, strength: 100, type: "phong", color: "#ffffff", shining: 48, bumpMap: "none", occlusion: true };

export const LIGHTING_FIELDS: Field[] = [
  { key: "type", label: "Type", type: "select", options: ["lambert", "phong", "physical", "toon"], group: 0 },
  { key: "color", label: "Color", type: "color", group: 0 },
  { key: "shining", label: "Shining", type: "number", step: 1, group: 0 },
  { key: "bumpMap", label: "Bump Map", type: "select", options: ["none", "noise"], group: 1 },
  { key: "occlusion", label: "Occlusion", type: "segment", options: ["on", "off"], group: 2 },
];

export type MaterialState = {
  /** 面板头部 Material 的 0-100 整体不透明度 */
  opacity: number;
  layers: LayerState[];
  lighting: LightingState;
  wireframe: boolean;
  shading: "normal" | "flat";
  sides: "both" | "front" | "back";
  shadows: "castreceive" | "cast" | "receive" | "off";
  collision: "visibility" | "on" | "off";
};

let seq = 0;
export const nextLayerId = () => `l${++seq}`;

export const makeLayer = (kind: LayerKind, overrides: Partial<LayerState> = {}): LayerState => {
  const meta = LAYER_KIND_META[kind];
  return {
    id: nextLayerId(),
    kind,
    name: meta.label,
    mode: "normal",
    visible: true,
    opacity: 100,
    params: { ...meta.defaults, ...(overrides.params ?? {}) },
    ...overrides,
  };
};

/** Image 1 的初始状态：Color 5454 + Noise + Lighting(Phong)；Lighting 是面板底部的固定行，不在 layers 里 */
export const initialMaterial = (): MaterialState => ({
  opacity: 100,
  layers: [makeLayer("color"), makeLayer("noise")],
  lighting: { ...LIGHTING_DEFAULT },
  wireframe: false,
  shading: "normal",
  sides: "front",
  shadows: "castreceive",
  collision: "visibility",
});
