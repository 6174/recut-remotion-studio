/**
 * [INPUT]: 本目录 types.ts 的 Field 类型与 glsl 噪声能力
 * [OUTPUT]: 对外提供 ObjectEffectState（物体级效果）、效果 schema/defaults、OE_DESC/OE_HINTS 注释与 makeObjectEffect 工厂
 * [POS]: spline-material 的物体级 Effects 数据模型；参数对齐 Spline 的 Edit Effect 面板
 *        （Drop Shadow: Offset/Blur/Color；Glass: Offset/Distortion/Depth/Blur/Aberration/Edge-Fill/Profile/Magnification；
 *          Noise: Simplex-Fbm-Voronoi-Sine + Blur/Uniform-Progressive/Amplitude/Scale/Stretch/Offset/Movement/Seed；
 *          Projection: Type/Radius/Blur/Offset）。Drop Shadow / Projection 为地面投影，其余为物体 shader 内效果
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Field } from "./types";

export type ObjectEffectKind =
  | "dropShadow"
  | "innerShadow"
  | "layerBlur"
  | "noise"
  | "glass"
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
  /** 渲染通道：shader = 物体着色器内；ground = 地面投影（剪影/圆盘） */
  stage: "shader" | "ground";
  defaults: Record<string, string | number | number[]>;
  fields: Field[];
};

export const OBJECT_EFFECT_META: Record<ObjectEffectKind, ObjectEffectMeta> = {
  dropShadow: {
    label: "Drop Shadow",
    desc: "跟随物体剪影的柔和投影",
    stage: "ground",
    defaults: { offsetX: 0, offsetY: 0.5, blur: 0.35, color: "#5c3540", strength: 55 },
    fields: [
      { key: "offsetX", label: "Offset", type: "vec2", prefix: "XY", step: 0.05, group: 0 },
      { key: "blur", label: "Blur", type: "number", step: 0.02, group: 1 },
      { key: "color", label: "Color", type: "color", group: 2 },
      { key: "strength", label: "Strength", type: "number", step: 1, group: 2 },
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
  noise: {
    label: "Noise",
    desc: "只在物体表面叠加噪声（调均匀/渐进与幅度）",
    stage: "shader",
    defaults: {
      noiseType: "simplex",
      blur: 0,
      type: "uniform",
      amplitude: 10,
      scale: 4,
      stretch: [1, 1],
      offset: [0, 0],
      movement: 0,
      seed: 0,
    },
    fields: [
      { key: "noiseType", label: "Noise Type", type: "select", options: ["simplex", "fbm", "voronoi", "sine"], group: 0 },
      { key: "blur", label: "Blur", type: "number", step: 0.05, group: 0 },
      { key: "type", label: "Type", type: "segment", options: ["uniform", "progressive"], group: 1 },
      { key: "amplitude", label: "Amplitude", type: "number", step: 0.5, group: 1 },
      { key: "scale", label: "Scale", type: "number", step: 0.1, group: 1 },
      { key: "stretch", label: "Stretch", type: "vec2", prefix: "XY", step: 0.1, group: 2 },
      { key: "offset", label: "Offset", type: "vec2", prefix: "XY", step: 0.1, group: 2 },
      { key: "movement", label: "Movement", type: "number", step: 0.1, group: 3 },
      { key: "seed", label: "Seed", type: "number", step: 1, group: 3 },
    ],
  },
  glass: {
    label: "Glass",
    desc: "把物体变成可折射的玻璃（带边缘/填充两种模式）",
    stage: "shader",
    defaults: { offset: [0, 0], distortion: 0.15, depth: 10, blur: 0.1, aberration: 0.05, edgeFill: "edge", profile: 0, magnification: 0 },
    fields: [
      { key: "offset", label: "Offset", type: "vec2", prefix: "XY", step: 0.1, group: 0 },
      { key: "distortion", label: "Distortion", type: "number", step: 0.01, group: 0 },
      { key: "depth", label: "Depth", type: "number", step: 0.5, group: 0 },
      { key: "blur", label: "Blur", type: "number", step: 0.01, group: 1 },
      { key: "aberration", label: "Aberration", type: "number", step: 0.01, group: 1 },
      { key: "edgeFill", label: "Mode", type: "segment", options: ["edge", "fill"], group: 2 },
      { key: "profile", label: "Profile", type: "number", step: 0.05, group: 2 },
      { key: "magnification", label: "Magnificat…", type: "number", step: 0.05, group: 2 },
    ],
  },
  projection: {
    label: "Projection",
    desc: "在地面上投影一个可调的环境光斑",
    stage: "ground",
    defaults: { type: "sphere", radius: 3, blur: 0.35, strength: 30, offsetX: 0.3, offsetZ: 0.2 },
    fields: [
      { key: "type", label: "Type", type: "select", options: ["sphere", "disc"], group: 0 },
      { key: "radius", label: "Radius", type: "number", step: 0.1, group: 0 },
      { key: "blur", label: "Blur", type: "number", step: 0.02, group: 1 },
      { key: "strength", label: "Strength", type: "number", step: 1, group: 1 },
      { key: "offsetX", label: "Offset X", type: "number", step: 0.05, group: 2 },
      { key: "offsetZ", label: "Offset Y", type: "number", step: 0.05, group: 2 },
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
  "noise",
  "glass",
  "projection",
  "noiseGlass",
];

export const OE_DESC: Record<string, string> = Object.fromEntries(
  (Object.keys(OBJECT_EFFECT_META) as ObjectEffectKind[]).map((kind) => [kind, OBJECT_EFFECT_META[kind].desc]),
);

export const OE_HINTS: Record<string, string> = {
  "dropShadow.offsetX": "影子偏移（X / Y）",
  "dropShadow.blur": "影子边缘模糊，0 = 剪影锐利",
  "dropShadow.color": "影子颜色",
  "dropShadow.strength": "影子浓度（颜色的不透明度）",
  "innerShadow.strength": "内阴影浓度",
  "innerShadow.power": "阴影向内收的范围",
  "layerBlur.amount": "柔焦程度，1 = 最模糊",
  "noise.noiseType": "噪声类型：Simplex / Fbm / Voronoi / Sine",
  "noise.blur": "弱化噪声对比，0.5 = 均匀",
  "noise.type": "Uniform = 均匀分布；Progressive = 沿高度渐隐",
  "noise.amplitude": "明暗扰动幅度",
  "noise.scale": "噪声密度，越大越细",
  "noise.stretch": "沿 X / Y 拉伸噪声",
  "noise.offset": "噪声的整体偏移",
  "noise.movement": "流动速度，0 = 静止",
  "noise.seed": "噪声种子，换一个花纹",
  "glass.offset": "折射采样偏移（X / Y）",
  "glass.distortion": "液态扭曲强度",
  "glass.depth": "玻璃厚度，颜色随厚度变重",
  "glass.blur": "玻璃模糊",
  "glass.aberration": "红蓝分离（色散）",
  "glass.edgeFill": "Edge = 只在边缘；Fill = 整体填充",
  "glass.profile": "边缘过渡的锐利程度",
  "glass.magnification": "折射放大倍率",
  "projection.type": "光斑形状：球形 / 圆盘",
  "projection.radius": "光斑半径",
  "projection.blur": "光斑边缘模糊",
  "projection.strength": "光斑浓度",
  "projection.offsetX": "光斑偏移（X）",
  "projection.offsetZ": "光斑偏移（Y）",
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
