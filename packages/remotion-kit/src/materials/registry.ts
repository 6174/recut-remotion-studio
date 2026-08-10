/**
 * [INPUT]: 依赖 types 的 MaterialId/MaterialDefinition 与 schema 的 MATERIAL_SCHEMA
 * [OUTPUT]: 对外提供 MATERIAL_REGISTRY（materialId → MaterialDefinition）与 getMaterialDefinition
 * [POS]: remotion-kit/src/materials 的元数据注册层；catalog 的 engine=three effects 条目从同一来源生成
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MATERIAL_SCHEMA } from "./schema";
import type { MaterialDefinition, MaterialId, MaterialRegistry } from "./types";

export const MATERIAL_REGISTRY: MaterialRegistry = {
  glitch: {
    id: "glitch",
    label: "Glitch",
    category: "post",
    description: "横向 tearing、RGB split 与噪声 burst；突发型效果使用确定性时间窗口。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA.glitch,
  },
  crt: {
    id: "crt",
    label: "CRT",
    category: "post",
    description: "barrel、scanline、RGB aperture、vignette 与 flicker 的老式显像管效果。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA.crt,
  },
  vintage: {
    id: "vintage",
    label: "Vintage",
    category: "post",
    description: "gate weave、grain、scratch、dust、light leak 与 faded print 的胶片效果。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA.vintage,
  },
  magnify: {
    id: "magnify",
    label: "Magnify",
    category: "post",
    description: "带像素 HUD、AA、haze 与 chromatic aberration 的放大镜镜头。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA.magnify,
  },
  glass: {
    id: "glass",
    label: "Glass",
    category: "post",
    description: "rounded-SDF、rim normal、六波长折射、fresnel 与 GGX 反射的玻璃卡片。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA.glass,
  },
  bubble: {
    id: "bubble",
    label: "Bubble",
    category: "post",
    description: "metaball trail ray-march 水滴，保留平滑融合、折射、色散与动态 glints。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA.bubble,
  },
  "article-highlight": {
    id: "article-highlight",
    label: "Article Highlight",
    category: "post",
    description: "中心文字保持锐利时渐进模糊上下信息的 9x9 progressive Gaussian blur。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA["article-highlight"],
  },
  bend: {
    id: "bend",
    label: "Bend",
    category: "transform",
    description: "页面卷曲语义的顶点变形转场。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA.bend,
  },
  "store-peel": {
    id: "store-peel",
    label: "Store Peel",
    category: "transform",
    description: "cylinder curl、adhesive back 与双层 shine 的卷页转场。",
    consumesMap: true,
    schema: MATERIAL_SCHEMA["store-peel"],
  },
  clouds: {
    id: "clouds",
    label: "Clouds",
    category: "ambient",
    description: "无历史帧依赖的程序化 fBm 雾场环境。",
    consumesMap: false,
    schema: MATERIAL_SCHEMA.clouds,
  },
};

export const getMaterialDefinition = (id: string) =>
  MATERIAL_REGISTRY[id as MaterialId];
