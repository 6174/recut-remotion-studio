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

export type FieldType = "color" | "number" | "vec2" | "vec3" | "percent" | "select" | "segment" | "texture";

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
    defaults: { map: "", tint: "#ffffff", scale: 1 },
    fields: [
      { key: "map", label: "Image", type: "texture", group: 0 },
      { key: "tint", label: "Tint", type: "color", group: 0 },
      { key: "scale", label: "Scale", type: "number", step: 0.1, group: 1 },
    ],
  },
  image: {
    label: "Image",
    icon: "image",
    defaults: { map: "", tint: "#ffffff", scale: 1 },
    fields: [
      { key: "map", label: "Image", type: "texture", group: 0 },
      { key: "tint", label: "Tint", type: "color", group: 0 },
      { key: "scale", label: "Scale", type: "number", step: 0.1, group: 1 },
    ],
  },
  video: {
    label: "Video",
    icon: "video",
    defaults: { map: "", tint: "#ffffff", scale: 1 },
    fields: [
      { key: "map", label: "Image", type: "texture", group: 0 },
      { key: "tint", label: "Tint", type: "color", group: 0 },
      { key: "scale", label: "Scale", type: "number", step: 0.1, group: 1 },
    ],
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
    defaults: { color: "#ffffff", transmission: 0.92, refraction: 1.14, thickness: 0.55, aberration: 0.05, roughness: 0.08 },
    fields: [
      { key: "color", label: "Color", type: "color", group: 0 },
      { key: "transmission", label: "Transmission", type: "number", step: 0.02, group: 0 },
      { key: "refraction", label: "Refraction", type: "number", step: 0.01, group: 1 },
      { key: "thickness", label: "Thickness", type: "number", step: 0.05, group: 1 },
      { key: "aberration", label: "Aberration", type: "number", step: 0.01, group: 1 },
      { key: "roughness", label: "Blur", type: "number", step: 0.01, group: 2 },
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
  /** PBR（physical 类型生效） */
  roughness: number;
  metalness: number;
  reflectivity: number;
  /** Glass 套件（对齐 Spline Material 区的连续玻璃参数，0 = 实体） */
  glass: number;
  aberration: number;
  thickness: number;
  refraction: number;
  blur: number;
  bumpMap: "none" | "noise";
  occlusion: boolean;
};

export const LIGHTING_DEFAULT: LightingState = {
  enabled: true,
  strength: 100,
  type: "physical",
  color: "#ffffff",
  shining: 48,
  roughness: 0.16,
  metalness: 0,
  reflectivity: 1,
  glass: 0,
  aberration: 0.05,
  thickness: 0.5,
  refraction: 1.12,
  blur: 0.1,
  bumpMap: "none",
  occlusion: true,
};

export const LIGHTING_FIELDS: Field[] = [
  { key: "type", label: "Type", type: "select", options: ["lambert", "phong", "physical", "toon"], group: 0 },
  { key: "color", label: "Color", type: "color", group: 0 },
  { key: "shining", label: "Shining", type: "number", step: 1, group: 0 },
  { key: "roughness", label: "Roughness", type: "number", step: 0.01, group: 1 },
  { key: "metalness", label: "Metalness", type: "number", step: 0.01, group: 1 },
  { key: "reflectivity", label: "Reflectivity", type: "number", step: 0.05, group: 1 },
  { key: "glass", label: "Glass", type: "number", step: 0.02, group: 1 },
  { key: "aberration", label: "Aberration", type: "number", step: 0.01, group: 2 },
  { key: "thickness", label: "Thickness", type: "number", step: 0.05, group: 2 },
  { key: "refraction", label: "Refraction", type: "number", step: 0.01, group: 2 },
  { key: "blur", label: "Blur", type: "number", step: 0.01, group: 2 },
  { key: "bumpMap", label: "Bump Map", type: "select", options: ["none", "noise"], group: 3 },
  { key: "occlusion", label: "Occlusion", type: "segment", options: ["on", "off"], group: 3 },
];

/** 程序化环境贴图（对应 Spline 的 Environment Map 区） */
export type EnvState = {
  enabled: boolean;
  preset: "studio" | "bright" | "warm" | "night" | "sunset";
  exposure: number;
  rotation: number;
};

export const ENV_DEFAULT: EnvState = { enabled: true, preset: "studio", exposure: 1, rotation: 0 };

/** 场景级 Light 区（对齐 Spline：Intensity/Color/Ambient Intensity） */
export type SceneLightState = {
  enabled: boolean;
  intensity: number;
  color: string;
  ambient: number;
};

export const SCENE_LIGHT_DEFAULT: SceneLightState = { enabled: true, intensity: 1, color: "#ffffff", ambient: 0.75 };

export type MaterialState = {
  /** 面板头部 Material 的 0-100 整体不透明度 */
  opacity: number;
  layers: LayerState[];
  lighting: LightingState;
  env: EnvState;
  wireframe: boolean;
  shading: "normal" | "flat";
  sides: "both" | "front" | "back";
  shadows: "castreceive" | "cast" | "receive" | "off";
  collision: "visibility" | "on" | "off";
};

let seq = 0;
/** 随机后缀避免 HMR 重置计数器后与保留的 React state 撞 id（GLSL uniform 重名会编译失败） */
export const nextLayerId = () => `l${++seq}_${Math.random().toString(36).slice(2, 6)}`;

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

/** Image 1 的初始状态：Color 5454 + Noise + Lighting(Physical)；Lighting 是面板底部的固定行，不在 layers 里 */
export const initialMaterial = (): MaterialState => ({
  opacity: 100,
  layers: [makeLayer("color"), makeLayer("noise")],
  lighting: { ...LIGHTING_DEFAULT },
  env: { ...ENV_DEFAULT },
  wireframe: false,
  shading: "normal",
  sides: "front",
  shadows: "castreceive",
  collision: "visibility",
});

/** 每种图层一句话说明（普通人视角），用于类型菜单悬浮与弹窗副标题 */
export const LAYER_DESC: Record<string, string> = {
  aiTexture: "用一张图片（比如 AI 生成的图）贴在表面",
  image: "上传本地图片作为表面贴图",
  video: "视频贴图占位：当前与 Image 相同方式采样",
  color: "一层纯色底",
  depth: "按远近距离混合两种颜色",
  normal: "把表面朝向显示成颜色，常用于调试或科技感",
  gradient: "两种颜色沿一个方向渐变过渡",
  noise: "程序噪声混四色，做大理石 / 云雾 / 流动纹理",
  fresnel: "物体边缘发亮，像逆光时的轮廓光",
  cavity: "往凹缝处压暗，强调磨损细节",
  dust: "在表面撒一层细小颗粒",
  rainbow: "按位置铺开彩虹色相",
  toon: "卡通式分档明暗",
  outline: "在轮廓边缘画一圈描边",
  glass: "透明玻璃，带折射、厚度与色散",
  reflection: "像镜面一样反射一个虚拟天空",
  matcap: "固定打光的球面材质，快速获得金属 / 陶瓷感",
  displace: "真实挤出表面凹凸（改变几何形状）",
  pattern: "棋盘格或条纹的程序图案",
  vertexColor: "按表面朝向上下混合两种颜色",
  lighting: "决定表面的打光方式与反射质感",
};

/** 每个参数的通俗解释，key 为 `<kind>.<field>`；lighting 也走这套 */
export const LAYER_HINTS: Record<string, string> = {
  "image.map": "点击方块选一张本地图片",
  "image.tint": "给贴图叠色，白色 = 原色",
  "image.scale": "贴图重复密度，越大越密",
  "video.map": "点击方块选一张本地图片",
  "video.tint": "给贴图叠色，白色 = 原色",
  "video.scale": "贴图重复密度，越大越密",
  "aiTexture.map": "点击方块选一张本地图片",
  "aiTexture.tint": "给贴图叠色，白色 = 原色",
  "aiTexture.scale": "贴图重复密度，越大越密",
  "color.color": "物体的基础颜色",
  "depth.colorA": "近处的颜色",
  "depth.colorB": "远处的颜色",
  "depth.near": "从多近开始过渡",
  "depth.far": "到多远完全变成远色",
  "normal.direction": "X / Y / Z 三个方向的强度",
  "normal.tint": "整体亮度与染色",
  "gradient.colorA": "渐变起点的颜色",
  "gradient.colorB": "渐变终点的颜色",
  "gradient.axes": "渐变沿哪个轴铺开",
  "gradient.start": "渐变开始的位置",
  "gradient.end": "渐变结束的位置",
  "gradient.contrast": "分界的生硬程度",
  "noise.mode": "Color = 当颜色画；Mask = 只控制透明度",
  "noise.type": "噪声花纹的风格",
  "noise.size": "X / Y / Z 方向的纹理密度",
  "noise.scale": "整体缩放，越大纹理越细",
  "noise.movement": "流动速度，0 = 静止",
  "noise.colorA": "最暗处的颜色",
  "noise.colorB": "偏暗处的颜色",
  "noise.colorC": "偏亮处的颜色",
  "noise.colorD": "最亮处的颜色",
  "noise.distortion": "把纹理扭歪（X = 强度，Y = 频率）",
  "noise.factorA": "细节层的强度与频率",
  "noise.factorB": "第二层细节的强度与频率",
  "fresnel.color": "边缘光的颜色",
  "fresnel.power": "边缘范围收得多细，越大越细",
  "fresnel.intensity": "边缘光亮度",
  "fresnel.bias": "整体加亮的底量",
  "cavity.scale": "裂缝纹理大小",
  "cavity.threshold": "判定凹缝的范围",
  "cavity.strength": "凹缝压暗的程度",
  "dust.color": "颗粒颜色",
  "dust.scale": "颗粒密集程度",
  "dust.coverage": "被颗粒覆盖的比例",
  "rainbow.hueShift": "整体转动色相",
  "rainbow.saturation": "颜色鲜艳程度",
  "toon.color": "卡通底色",
  "toon.steps": "明暗分几档，越大过渡越多",
  "outline.color": "描边颜色",
  "outline.width": "描边粗细",
  "outline.threshold": "多大转角才出描边",
  "glass.color": "玻璃的染色",
  "glass.transmission": "透过程，1 = 全透",
  "glass.refraction": "折射弯折程度",
  "glass.thickness": "厚度感，越厚颜色越重",
  "glass.aberration": "边缘红蓝分离（色散）",
  "glass.roughness": "毛玻璃模糊程度",
  "reflection.sky": "反射中的天空色",
  "reflection.ground": "反射中的地面色",
  "reflection.power": "上下过渡的对比",
  "matcap.light": "受光面的颜色",
  "matcap.dark": "背光面的颜色",
  "matcap.rim": "边缘高光强度",
  "displace.type": "凹凸花纹的风格",
  "displace.strength": "凹凸深度",
  "displace.scale": "凹凸密度",
  "displace.offset": "花纹的整体偏移",
  "pattern.pattern": "格子还是条纹",
  "pattern.colorA": "第一格的颜色",
  "pattern.colorB": "第二格的颜色",
  "pattern.scale": "图案大小，越大越密",
  "vertexColor.colorA": "朝上部分的颜色",
  "vertexColor.colorB": "朝下部分的颜色",
  "lighting.type": "打光模型：从简单到物理",
  "lighting.color": "高光的颜色",
  "lighting.shining": "高光锐利程度，越大光斑越小",
  "lighting.roughness": "表面粗糙度，0 = 镜面",
  "lighting.metalness": "金属度，1 = 纯金属",
  "lighting.reflectivity": "环境反射强度",
  "lighting.glass": "玻璃感，0 = 实体，1 = 全透明",
  "lighting.aberration": "玻璃边缘红蓝分离（色散）",
  "lighting.thickness": "玻璃厚度感，越厚颜色越重",
  "lighting.refraction": "折射弯折程度",
  "lighting.blur": "玻璃的磨砂模糊",
  "lighting.bumpMap": "用噪声给表面加细凹凸",
  "lighting.occlusion": "边缘环境光遮蔽",
};
