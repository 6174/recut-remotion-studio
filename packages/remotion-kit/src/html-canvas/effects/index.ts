/**
 * [INPUT]: 依赖各效果的 renderer 定义
 * [OUTPUT]: 对外提供全部 Canvas 效果的 definition（供 registry 与 catalog 消费）
 * [POS]: src/html-canvas/effects 的入口；新增效果只需在此注册一个 renderer，不复制舞台逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export { cursorEffect } from "./cursor";
export { focusSpotlightEffect } from "./focus-spotlight";
export { textSelectionEffect } from "./text-selection";
export { magnifierEffect } from "./magnifier";
export { sceneTransitionEffect } from "./scene-transition";
export { ambientEffect } from "./ambient";
export type { CanvasEffectDefinition, CanvasEffectRenderer, EffectRuntime, PaintContext } from "../CanvasEffect";
