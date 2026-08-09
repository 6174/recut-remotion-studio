/**
 * [INPUT]: 依赖 types 与 timeline 的 EffectProgress
 * [OUTPUT]: 对外提供 PaintContext/EffectRuntime/CanvasEffectDefinition 与 CanvasEffectRegistry 类型
 * [POS]: src/html-canvas 的原生 paint renderer 适配边界。每个效果只实现
 *        render(paint, runtime)（只读 frame 派生状态、确定性绘制）、getBounds 与 schema；
 *        坐标、时间、互动和生命周期由舞台统一负责。效果画在独立 overlay 上，
 *        需要采样内容时读 paint.contentCanvas（HtmlInCanvas 的 layout canvas）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { EffectClip, EffectId, EffectScope, FocusTarget, InteractionState, Rect, TargetMap } from "./types";
import type { EffectProgress } from "./timeline";

/** 单一效果轨在当前帧的完整绘制上下文。坐标均为设计像素。 */
export type PaintContext = {
  ctx: CanvasRenderingContext2D;
  /** composition 设计宽度/高度。 */
  width: number;
  height: number;
  /** 效果 overlay 的像素密度。 */
  pixelDensity: number;
  /** 设计像素 → 画布像素的换算比例。 */
  designScale: number;
  /** 内容层（HtmlInCanvas 的 layout canvas）：放大镜/转场等采样内容的唯一来源。 */
  contentCanvas?: HTMLCanvasElement | null;
  /** 当前全局帧。 */
  frame: number;
  /** 当前帧互动状态（与 InteractionScript 同一推导源）。 */
  interaction: InteractionState;
  /** 舞台计划声明的全部目标几何。 */
  targets: TargetMap;
};

/** 一条效果轨在当前帧的解析结果。 */
export type EffectRuntime = {
  clip: EffectClip;
  progress: EffectProgress;
  target: FocusTarget | undefined;
};

export type CanvasEffectRenderer = (paint: PaintContext, runtime: EffectRuntime) => void;

export type CanvasEffectDefinition = {
  id: EffectId;
  label: string;
  description: string;
  /** 该效果允许的层级（组件内部/场景/全片）。 */
  scope: EffectScope;
  render: CanvasEffectRenderer;
  /** 用于裁剪、纹理尺寸与 snapshot 测试。 */
  getBounds?: (runtime: EffectRuntime, paint: PaintContext) => Rect | null;
  /** 限制参数范围，给 catalog、Agent 与未来表单共用。 */
  schema?: Record<string, { type: "number" | "boolean" | "string" | "rect[]"; min?: number; max?: number; default?: unknown }>;
};

export type CanvasEffectRegistry = Record<EffectId, CanvasEffectDefinition>;
