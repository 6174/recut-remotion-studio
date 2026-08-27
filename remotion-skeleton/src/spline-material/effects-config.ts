/**
 * [INPUT]: 无外部依赖；纯数据与类型契约（与 types.ts 同构但服务于 Effects 面板）
 * [OUTPUT]: 对外提供 Effects 图层的元数据、参数 schema、默认状态与 makeEffect 工厂
 * [POS]: spline-material 的 Effects 面板事实来源；Effects 是全局后处理（未选中元素时作用于整个场景）
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Field, LayerParams, ParamValue } from "./types";

export type EffectKind =
  | "bloom"
  | "blur"
  | "chromatic"
  | "vignette"
  | "grain"
  | "noise"
  | "pixelate"
  | "colorAdjust"
  | "outline"
  | "glitch";

export type EffectState = {
  id: string;
  kind: EffectKind;
  name: string;
  visible: boolean;
  /** 行内 0-100 强度，映射 u_<id>_strength */
  opacity: number;
  params: LayerParams;
};

export type EffectKindMeta = {
  label: string;
  icon: EffectKind;
  defaults: LayerParams;
  fields: Field[];
};

const colorAdjustFields: Field[] = [
  { key: "brightness", label: "Brightness", type: "number", step: 0.02, group: 0 },
  { key: "contrast", label: "Contrast", type: "number", step: 0.02, group: 0 },
  { key: "saturation", label: "Saturation", type: "number", step: 0.02, group: 0 },
  { key: "hue", label: "Hue", type: "number", step: 0.01, group: 0 },
];

export const EFFECT_KIND_META: Record<EffectKind, EffectKindMeta> = {
  bloom: {
    label: "Bloom",
    icon: "bloom",
    defaults: { threshold: 0.72, intensity: 0.5, blur: 1.4 },
    fields: [
      { key: "threshold", label: "Threshold", type: "number", step: 0.02, group: 0 },
      { key: "intensity", label: "Intensity", type: "number", step: 0.02, group: 0 },
      { key: "blur", label: "Blur", type: "number", step: 0.05, group: 0 },
    ],
  },
  blur: {
    label: "Blur",
    icon: "blur",
    defaults: { amount: 4 },
    fields: [{ key: "amount", label: "Amount", type: "number", step: 0.2, group: 0 }],
  },
  chromatic: {
    label: "Chromatic",
    icon: "chromatic",
    defaults: { amount: 0.15 },
    fields: [{ key: "amount", label: "Amount", type: "number", step: 0.01, group: 0 }],
  },
  vignette: {
    label: "Vignette",
    icon: "vignette",
    defaults: { offset: 0.32, darkness: 0.6 },
    fields: [
      { key: "offset", label: "Offset", type: "number", step: 0.02, group: 0 },
      { key: "darkness", label: "Darkness", type: "number", step: 0.02, group: 0 },
    ],
  },
  grain: {
    label: "Grain",
    icon: "grain",
    defaults: { intensity: 0.28, size: 1.4, animated: "on" },
    fields: [
      { key: "intensity", label: "Intensity", type: "number", step: 0.02, group: 0 },
      { key: "size", label: "Size", type: "number", step: 0.1, group: 0 },
      { key: "animated", label: "Animated", type: "segment", options: ["on", "off"], group: 1 },
    ],
  },
  noise: {
    label: "Noise",
    icon: "noise",
    defaults: { intensity: 0.22 },
    fields: [{ key: "intensity", label: "Intensity", type: "number", step: 0.02, group: 0 }],
  },
  pixelate: {
    label: "Pixelate",
    icon: "pixelate",
    defaults: { pixelSize: 10 },
    fields: [{ key: "pixelSize", label: "Pixel Size", type: "number", step: 1, group: 0 }],
  },
  colorAdjust: {
    label: "Color Adjust",
    icon: "colorAdjust",
    defaults: { brightness: 0, contrast: 1, saturation: 1, hue: 0 },
    fields: colorAdjustFields,
  },
  outline: {
    label: "Outline",
    icon: "outline",
    defaults: { color: "#101014", threshold: 0.22, thickness: 1.4 },
    fields: [
      { key: "color", label: "Color", type: "color", group: 0 },
      { key: "threshold", label: "Threshold", type: "number", step: 0.02, group: 0 },
      { key: "thickness", label: "Thickness", type: "number", step: 0.1, group: 0 },
    ],
  },
  glitch: {
    label: "Glitch",
    icon: "glitch",
    defaults: { amount: 0.2, speed: 1 },
    fields: [
      { key: "amount", label: "Amount", type: "number", step: 0.02, group: 0 },
      { key: "speed", label: "Speed", type: "number", step: 0.1, group: 0 },
    ],
  },
};

export const EFFECT_MENU_ORDER: EffectKind[] = ["bloom", "blur", "chromatic", "vignette", "grain", "noise", "pixelate", "colorAdjust", "outline", "glitch"];

let effSeq = 0;
/** 随机后缀避免 HMR 重置计数器后与保留的 React state 撞 id（GLSL uniform 重名会编译失败） */
export const nextEffectId = () => `e${++effSeq}_${Math.random().toString(36).slice(2, 6)}`;

export const makeEffect = (kind: EffectKind, overrides: Partial<EffectState> = {}): EffectState => {
  const meta = EFFECT_KIND_META[kind];
  return {
    id: nextEffectId(),
    kind,
    name: meta.label,
    visible: true,
    opacity: 100,
    params: { ...meta.defaults },
    ...overrides,
  };
};

export const initialEffects = (): EffectState[] => [makeEffect("bloom")];

/** 每种 Effect 一句话说明（普通人视角），用于类型菜单悬浮与弹窗副标题 */
export const EFFECT_DESC: Record<string, string> = {
  bloom: "让画面中亮的部分晕开发光",
  blur: "整画面柔焦模糊",
  chromatic: "镜头色散：边缘红蓝重影",
  vignette: "镜头暗角：四周压暗",
  grain: "胶片颗粒质感",
  noise: "整屏彩色雪花噪点",
  pixelate: "马赛克像素风",
  colorAdjust: "调亮度 / 对比 / 饱和 / 色相",
  outline: "按明暗交界描一圈线",
  glitch: "信号故障式的画面撕裂",
};

/** 每个参数的通俗解释，key 为 `<kind>.<field>` */
export const EFFECT_HINTS: Record<string, string> = {
  "bloom.threshold": "多亮的部分才算发光",
  "bloom.intensity": "光晕强度",
  "bloom.blur": "光晕扩散范围",
  "blur.amount": "模糊程度",
  "chromatic.amount": "红蓝错位幅度",
  "vignette.offset": "暗角从多大范围开始",
  "vignette.darkness": "暗角浓度",
  "grain.intensity": "颗粒强度",
  "grain.size": "颗粒粗细",
  "grain.animated": "颗粒是否每帧闪动",
  "noise.intensity": "噪点浓度",
  "pixelate.pixelSize": "马赛克格子大小",
  "colorAdjust.brightness": "整体提亮或压暗",
  "colorAdjust.contrast": "明暗对比强度",
  "colorAdjust.saturation": "颜色鲜艳程度",
  "colorAdjust.hue": "整体转动色相",
  "outline.color": "描边颜色",
  "outline.threshold": "描边灵敏度",
  "outline.thickness": "描边粗细",
  "glitch.amount": "撕裂位移大小",
  "glitch.speed": "撕裂闪动频率",
};

export type { ParamValue };
