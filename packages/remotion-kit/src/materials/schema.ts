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
    motion: { type: "number", min: 0, max: 2, default: 1 },
  },
  vintage: {
    grain: { type: "number", min: 0, max: 0.5, default: 0.126 },
    vignette: { type: "number", min: 0, max: 1, default: 0.6 },
    warmth: { type: "number", min: 0, max: 1, default: 0.28 },
    fade: { type: "number", min: 0, max: 1, default: 0.385 },
  },
  vhs: {
    intensity: { type: "number", min: 0, max: 3, default: 1 },
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
  ripple: {
    strength: { type: "number", min: 0, max: 0.15, default: 0.045 },
    radius: { type: "number", min: 80, max: 900, default: 320 },
    frequency: { type: "number", min: 0.5, max: 6, default: 2.2 },
  },
  "article-highlight": {
    intensity: { type: "number", min: 0, max: 2, default: 1 },
    markerWidth: { type: "number", min: 0.1, max: 1, default: 0.54 },
    markerHeight: { type: "number", min: 0.02, max: 0.3, default: 0.115 },
  },
  asciify: {
    cell: { type: "number", min: 6, max: 40, default: 12 },
  },
  "retro-dither": {
    levels: { type: "number", min: 2, max: 12, default: 4 },
    grid: { type: "number", min: 2, max: 12, default: 4 },
  },
  displacement: {
    amount: { type: "number", min: 0, max: 0.15, default: 0.035 },
    scale: { type: "number", min: 0.5, max: 8, default: 2.4 },
  },
  droplets: {
    intensity: { type: "number", min: 0, max: 2, default: 1 },
    speed: { type: "number", min: 0.2, max: 3, default: 1 },
    scale: { type: "number", min: 0.15, max: 1.25, default: 0.4 },
    dropWidth: { type: "number", min: 0.4, max: 1.8, default: 1 },
    dropLength: { type: "number", min: 0.4, max: 2.2, default: 1 },
    refraction: { type: "number", min: 0, max: 0.8, default: 0.2 },
  },
  frost: {
    intensity: { type: "number", min: 0, max: 2, default: 1 },
  },
  "decrypt-reveal": {
    cell: { type: "number", min: 10, max: 80, default: 26 },
  },
  "particle-reveal": {
    cell: { type: "number", min: 8, max: 60, default: 22 },
    intensity: { type: "number", min: 0, max: 2, default: 1 },
  },
  "text-focus": {
    intensity: { type: "number", min: 0, max: 2, default: 1 },
    focusLeft: { type: "number", min: 0, max: 1, default: 0.05 },
    focusTop: { type: "number", min: 0, max: 1, default: 0.51 },
    focusWidth: { type: "number", min: 0.04, max: 1, default: 0.28 },
    focusHeight: { type: "number", min: 0.03, max: 1, default: 0.18 },
    focusFeather: { type: "number", min: 0.005, max: 0.18, default: 0.035 },
  },
  bend: {
    bend: { type: "number", min: 0, max: 1.2, default: 0.6 },
  },
  cloth: {
    amplitude: { type: "number", min: 0, max: 0.6, default: 0.18 },
    speed: { type: "number", min: 0.2, max: 4, default: 1.4 },
  },
  "store-peel": {},
  clouds: {
    opacity: { type: "number", min: 0, max: 1, default: 0.74 },
  },
  grid: {
    opacity: { type: "number", min: 0, max: 1, default: 0.5 },
    cell: { type: "number", min: 24, max: 320, default: 96 },
    speed: { type: "number", min: 0.1, max: 3, default: 0.75 },
  },
  liquid: {
    opacity: { type: "number", min: 0, max: 1, default: 0.8 },
  },
  "glyph-rain": {
    opacity: { type: "number", min: 0, max: 1, default: 0.8 },
    intensity: { type: "number", min: 0, max: 2, default: 1 },
  },
  laser: {
    opacity: { type: "number", min: 0, max: 1, default: 0.85 },
    intensity: { type: "number", min: 0, max: 2, default: 1 },
  },
  blaze: {
    opacity: { type: "number", min: 0, max: 1, default: 0.85 },
  },
  "particle-scroll": {
    opacity: { type: "number", min: 0, max: 1, default: 0.8 },
  },
};
