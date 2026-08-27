/**
 * [INPUT]: 本目录 types.ts 的 Field 类型与 glsl 噪声能力
 * [OUTPUT]: 对外提供 ObjectEffectState（物体级效果）、7 种效果 schema/defaults、OE_DESC/OE_HINTS 注释与 makeObjectEffect 工厂
 * [POS]: spline-material 的物体级 Effects 数据模型；对齐 Spline 选中元素的 3D Shape 效果菜单
 *        （Drop Shadow / Inner Shadow / Layer Blur / Layer Noise / Liquid Glass / Projection / Noise Glass），
 *        全部只作用于单个物体：shader 内效果走 layers.ts 管道，Drop Shadow / Projection 为地面投影板
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Field } from "./types";

export type ObjectEffectKind =
  | "dropShadow"
  | "innerShadow"
  | "layerBlur"
  | "layerNoise"
  | "liquidGlass"
  | "projection"
  | "noiseGlass";

export type ObjectEffectState = {
  id: string;
  kind: ObjectEffectKind;
  name: string;
  visible: boolean;
  /** 行内 0-100 强度 */
  opacity: number;
  params: Record<string, string | number | number[]>;
};

export type ObjectEffectMeta = {
  label: string;
  desc: string;
  /** 渲染通道：shader = 物体着色器内；ground = 地面投影板 */
  stage: "shader" | "ground";
  defaults: Record<string, string | number | number[]>;
  fields: Field[];
};

export const OBJECT_EFFECT_META: Record<ObjectEffectKind, ObjectEffectMeta> = {
  dropShadow: {
    label: "Drop Shadow",
    desc: "在地面投下柔和的影子",
    stage: "ground",
    defaults: { strength: 0.55, size: 1, offsetX: 0.45, offsetZ: 0.35 },
    fields: [
      { key: "strength", label: "Strength", type: "number", step: 0.02, group: 0 },
      { key: "size", label: "Size", type: "number", step: 0.05, group: 0 },
      { key: "offsetX", label: "Offset X", type: "number", step: 0.05, group: 1 },
      { key: "offsetZ", label: "Offset Z", type: "number", step: 0.05, group: 1 },
    ],
  },
  innerShadow: {
    label: "Inner Shadow",
    desc: "物体边缘向内压暗一圈",
    stage: "shader",
    defaults: { strength: 0.5, power: 2.2 },
    fields: [
      { key: "strength", label: "Strength", type: "number", step: 0.02, group: 0 },
      { key: "power", label: "Power", type: "number", step: 0.1, group: 0 },
    ],
  },
  layerBlur: {
    label: "Layer Blur",
    desc: "把这个物体整体柔焦模糊",
    stage: "shader",
    defaults: { amount: 0.45 },
    fields: [{ key: "amount", label: "Amount", type: "number", step: 0.02, group: 0 }],
  },
  layerNoise: {
    label: "Layer Noise",
    desc: "只在物体表面叠一层噪声纹理",
    stage: "shader",
    defaults: { type: "simplex", scale: 3, colorA: "#1c1c22", colorB: "#f2f2f2" },
    fields: [
      { key: "type", label: "Type", type: "select", options: ["perlin", "simplex", "cell", "white", "curl"], group: 0 },
      { key: "scale", label: "Scale", type: "number", step: 0.1, group: 0 },
      { key: "colorA", label: "Color A", type: "color", group: 0 },
      { key: "colorB", label: "Color B", type: "color", group: 0 },
    ],
  },
  liquidGlass: {
    label: "Liquid Glass",
    desc: "流动扭曲的液态玻璃",
    stage: "shader",
    defaults: { distortion: 0.5, refraction: 1.18, blur: 0.06 },
    fields: [
      { key: "distortion", label: "Distortion", type: "number", step: 0.02, group: 0 },
      { key: "refraction", label: "Refraction", type: "number", step: 0.01, group: 1 },
      { key: "blur", label: "Blur", type: "number", step: 0.01, group: 1 },
    ],
  },
  projection: {
    label: "Projection",
    desc: "朝一个方向拉长的投影",
    stage: "ground",
    defaults: { strength: 0.45, size: 1.15, offsetX: 1.1, offsetZ: 0.5 },
    fields: [
      { key: "strength", label: "Strength", type: "number", step: 0.02, group: 0 },
      { key: "size", label: "Size", type: "number", step: 0.05, group: 0 },
      { key: "offsetX", label: "Direction X", type: "number", step: 0.05, group: 1 },
      { key: "offsetZ", label: "Direction Z", type: "number", step: 0.05, group: 1 },
    ],
  },
  noiseGlass: {
    label: "Noise Glass",
    desc: "磨砂颗粒感的玻璃",
    stage: "shader",
    defaults: { blur: 0.08, scale: 6, grain: 0.55 },
    fields: [
      { key: "blur", label: "Blur", type: "number", step: 0.01, group: 0 },
      { key: "scale", label: "Noise Scale", type: "number", step: 0.1, group: 1 },
      { key: "grain", label: "Grain", type: "number", step: 0.02, group: 1 },
    ],
  },
};

export const OBJECT_EFFECT_MENU_ORDER: ObjectEffectKind[] = [
  "dropShadow",
  "innerShadow",
  "layerBlur",
  "layerNoise",
  "liquidGlass",
  "projection",
  "noiseGlass",
];

export const OE_DESC: Record<string, string> = Object.fromEntries(
  (Object.keys(OBJECT_EFFECT_META) as ObjectEffectKind[]).map((kind) => [kind, OBJECT_EFFECT_META[kind].desc]),
);

export const OE_HINTS: Record<string, string> = {
  "dropShadow.strength": "影子浓度",
  "dropShadow.size": "影子大小",
  "dropShadow.offsetX": "影子偏移（X 方向）",
  "dropShadow.offsetZ": "影子偏移（Z 方向）",
  "innerShadow.strength": "内阴影浓度",
  "innerShadow.power": "阴影向内收的范围",
  "layerBlur.amount": "柔焦程度，1 = 最模糊",
  "layerNoise.type": "噪声花纹风格",
  "layerNoise.scale": "噪声密度，越大越细",
  "layerNoise.colorA": "暗处噪声颜色",
  "layerNoise.colorB": "亮处噪声颜色",
  "liquidGlass.distortion": "液态扭曲强度",
  "liquidGlass.refraction": "折射弯折程度",
  "liquidGlass.blur": "玻璃模糊",
  "projection.strength": "投影浓度",
  "projection.size": "投影拉伸大小",
  "projection.offsetX": "投影方向（X）",
  "projection.offsetZ": "投影方向（Z）",
  "noiseGlass.blur": "玻璃模糊",
  "noiseGlass.scale": "颗粒密度",
  "noiseGlass.grain": "颗粒强度",
};

let oeSeq = 0;
export const nextObjectEffectId = () => `oe${++oeSeq}_${Math.random().toString(36).slice(2, 6)}`;

export const makeObjectEffect = (kind: ObjectEffectKind, overrides: Partial<ObjectEffectState> = {}): ObjectEffectState => {
  const meta = OBJECT_EFFECT_META[kind];
  return {
    id: nextObjectEffectId(),
    kind,
    name: meta.label,
    visible: true,
    opacity: 100,
    params: { ...meta.defaults },
    ...overrides,
  };
};
