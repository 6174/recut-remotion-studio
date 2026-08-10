/**
 * [INPUT]: 依赖 html-canvas 各子模块（types/timeline/targets/interaction/registry/舞台）
 * [OUTPUT]: 对外提供 html-canvas 子模块稳定导出（StagePlan/EffectClip/舞台/门禁/效果注册表）
 * [POS]: src/html-canvas 的入口；场景与 Agent 只 import 本文件或 ./html-canvas 子路径，
 *        不直接 import <HtmlInCanvas> 或持有 WebGL context。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export type * from "./types";
export { clamp, ease, interpolateValue, interpolatePoint, effectProgress } from "./timeline";
export type { EffectProgress, LifecyclePhase } from "./timeline";
export {
  rectCenter,
  rectContains,
  circleContains,
  polygonContains,
  targetCenter,
  targetBounds,
  containsPoint,
  expandRect,
  clampPointToRect,
  targetRadius,
} from "./targets";
export { resolveInteractionState, resolvePointer, pathPointAt, sortEvents } from "./interaction";
export { InteractionContext, InteractionProvider, useInteraction, useInteractionEvents, useInteractionMaybe } from "./InteractionScript";
export { BrowserCapabilityGate, isHtmlInCanvasSupported, probeHtmlInCanvas, requireHtmlInCanvas, useHtmlInCanvasSupport } from "./BrowserCapabilityGate";
export type { CapabilityProbeResult, HtmlInCanvasCapability, SupportStatus } from "./BrowserCapabilityGate";
export { HtmlCanvasVideoStage } from "./HtmlCanvasVideoStage";
export type { HtmlCanvasVideoStageProps } from "./HtmlCanvasVideoStage";
export { GpuCompositor } from "./GpuCompositor";
export type { GpuCompositorRender } from "./GpuCompositor";
export { resolveActiveEffects, useEffectTimeline } from "./EffectTimeline";
export { EFFECT_REGISTRY, getEffectDefinition } from "./registry";
export type { CanvasEffectDefinition, CanvasEffectRenderer, EffectRuntime, PaintContext } from "./CanvasEffect";
export {
  PRODUCT_UI_DEMO_FRAMES,
  PRODUCT_UI_DEMO_HEIGHT,
  PRODUCT_UI_DEMO_PLAN,
  PRODUCT_UI_DEMO_WIDTH,
  planForEffect,
  ProductUiDemo,
} from "./demos/product-ui-demo";
export { EffectFixtureDemo } from "./demos/effect-fixtures";
