/**
 * [INPUT]: 依赖 types 的 MaterialId/MaterialParamSchema
 * [OUTPUT]: 对外提供 MATERIAL_SCHEMA（materialId → 语义参数 schema），registry 与 catalog 从同一来源生成
 * [POS]: remotion-kit/src/materials 的参数元数据层；AI 写镜头时按 schema 暴露的参数取语义，不直接写 GLSL
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { MaterialId, MaterialParamSchema } from "./types";

export const MATERIAL_SCHEMA: Record<MaterialId, Record<string, MaterialParamSchema>> = {
  glitch: {
    intensity: { type: "number", min: 0, max: 3, default: 1.35 },
  },
  crt: {
    scan: { type: "number", min: 0, max: 1, default: 0.24 },
    vignette: { type: "number", min: 0, max: 1, default: 0.68 },
  },
  vintage: {
    grain: { type: "number", min: 0, max: 0.5, default: 0.126 },
    vignette: { type: "number", min: 0, max: 1, default: 0.6 },
    warmth: { type: "number", min: 0, max: 1, default: 0.28 },
    fade: { type: "number", min: 0, max: 1, default: 0.385 },
  },
  magnify: {
    zoom: { type: "number", min: 1, max: 4, default: 1.7 },
    radius: { type: "number", min: 60, max: 400, default: 140 },
    hud: { type: "number", min: 0, max: 1, default: 0.8 },
    aberration: { type: "number", min: 0, max: 2, default: 0.8 },
    haze: { type: "number", min: 0, max: 1, default: 0.2 },
  },
  glass: {
    zoom: { type: "number", min: 1, max: 4, default: 1.34 },
    ior: { type: "number", min: 1, max: 2.5, default: 1.5 },
    depth: { type: "number", min: 60, max: 500, default: 250 },
    reflect: { type: "number", min: 0, max: 1, default: 1 },
  },
  bubble: {
    intensity: { type: "number", min: 0, max: 2, default: 1 },
    refraction: { type: "number", min: 0, max: 200, default: 80 },
    dispersion: { type: "number", min: 0, max: 3, default: 1 },
    iridescence: { type: "number", min: 0, max: 2, default: 1 },
  },
  "article-highlight": {},
  bend: {
    bend: { type: "number", min: 0, max: 1.2, default: 0.6 },
  },
  "store-peel": {},
  clouds: {
    opacity: { type: "number", min: 0, max: 1, default: 0.74 },
  },
};
