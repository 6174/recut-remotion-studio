/**
 * [INPUT]: 无运行时依赖；HTML-in-Canvas 舞台层所有模块共享的公共契约
 * [OUTPUT]: 对外提供 Rect/FocusTarget/EffectTiming/InteractionEvent/EffectClip/StagePlan 等类型
 * [POS]: src/html-canvas 的类型层。坐标一律以 composition 设计像素表达，禁止从
 *        pointer/DOM 量测推断；所有时间以帧表达，禁止 Date.now()/Math.random()/rAF。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

export type Point = { x: number; y: number };

export type Rect = { x: number; y: number; width: number; height: number };

/** 明确、可审阅的目标几何。text-selection 直接消费场景排版时产出的 token Rect[]。 */
export type FocusTarget =
  | { kind: "rect"; rect: Rect; radius?: number }
  | { kind: "circle"; cx: number; cy: number; radius: number }
  | { kind: "path"; points: Point[] };

export type TargetMap = Record<string, FocusTarget>;

/** 单个效果的局部生命周期。enter → play(hold) → exit 完全由帧描述。 */
export type EffectTiming = {
  startFrame: number;
  enterFrames: number;
  holdFrames?: number;
  exitFrames: number;
};

/** 帧驱动的互动脚本：鼠标轨迹与语义 UI 状态由事件列表推导，重放逐帧一致。 */
export type InteractionEvent =
  | { kind: "move"; frame: number; x: number; y: number; easing?: EasingName }
  | { kind: "hover"; frame: number; targetId: string }
  | { kind: "click"; frame: number; targetId: string }
  | { kind: "drag"; startFrame: number; endFrame: number; from: Point; to: Point }
  | { kind: "scroll"; frame: number; targetId: string; offsetY: number };

export type EasingName = "linear" | "easeIn" | "easeOut" | "easeInOut";

export type EffectId =
  | "cursor"
  | "focus-spotlight"
  | "text-selection"
  | "magnifier"
  | "scene-transition"
  | "ambient";

/** 效果作用层级：组件内部 / 当前场景 / 跨整支视频。 */
export type EffectScope = "component" | "scene" | "video";

/** 一条效果轨：在显式 zIndex 上运行一个效果，目标与时机来自舞台计划。 */
export type EffectClip = {
  id: string;
  scope: EffectScope;
  effect: EffectId;
  targetId?: string;
  timing: EffectTiming;
  zIndex: number;
  intensity?: number;
  /** 效果私有参数（如 selection 的 token rects、magnifier 的 zoom）。 */
  options?: Record<string, unknown>;
};

export type SceneBoundary = { sceneId: string; startFrame: number; endFrame: number };

/** StagePlan 是 composition 层的单一真相源：互动轨迹 + 效果轨 + 目标几何 + 场景边界。 */
export type StagePlan = {
  interaction?: InteractionEvent[];
  effects?: EffectClip[];
  targets?: TargetMap;
  scenes?: SceneBoundary[];
};

/** 由 InteractionScript 从事件列表推导出的当前帧互动状态（语义 UI 状态桥）。 */
export type InteractionState = {
  frame: number;
  /** 指针当前位置（设计像素）；无 move/drag 覆盖时可为 null。 */
  pointer: Point | null;
  /** 最近 hover/click 命中的 target id（语义悬停）。 */
  hoveredTargetId: string | null;
  /** 最近 click 的 target id；在 pressFrames 窗口内保持 pressed。 */
  pressedTargetId: string | null;
  /** 当前窗口内的 click 事件。 */
  clicks: Array<{ frame: number; targetId: string; x: number; y: number }>;
  /** 活跃 drag 阶段（from→to 插值），否则 null。 */
  drag: { from: Point; to: Point; progress: number } | null;
  /** 最近 scroll 事件的绝对滚动偏移与目标。 */
  scrollOffsetY: number;
  scrollTargetId: string | null;
  /** move 路径当前位置（不含 target 中心回退）。 */
  pathPoint: Point | null;
};
