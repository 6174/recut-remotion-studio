/**
 * [INPUT]: 依赖 remotion 帧时钟与 remotion-templates 背景组件
 * [OUTPUT]: 对外提供 Palette、BackgroundFX、GrainOverlay、useImageMotion、TextFX
 * [POS]: remotion-kit 的效果注册层；ui 模板演示与 workspace ProjectVideo 共用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export { BackgroundFX, GrainOverlay, useImageMotion } from "./registry";
export type { Palette } from "../palette";
export { TextFX } from "./text";
export type { TextFXProps } from "./text";