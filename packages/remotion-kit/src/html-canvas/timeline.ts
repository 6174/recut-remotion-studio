/**
 * [INPUT]: 依赖 types 的 EffectTiming/EasingName 与 composition 帧
 * [OUTPUT]: 对外提供 clamp/ease/interpolateValue/effectProgress（纯函数，无渲染副作用）
 * [POS]: src/html-canvas 的时间层。帧 → 归一化进度 / 效果生命周期的纯数学；
 *        任何帧都返回稳定有限值，边界无分支爆炸。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { EffectTiming, EasingName } from "./types";

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** 归一化时间 (0..1) 经缓动映射。实现确定、无状态。 */
export const ease = (name: EasingName | undefined, t: number): number => {
  const x = clamp(t, 0, 1);
  switch (name ?? "linear") {
    case "easeIn":
      return x * x * x;
    case "easeOut":
      return 1 - Math.pow(1 - x, 3);
    case "easeInOut":
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    default:
      return x;
  }
};

export const interpolateValue = (from: number, to: number, t: number, easing?: EasingName): number => {
  return from + (to - from) * ease(easing, t);
};

export const interpolatePoint = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  t: number,
  easing?: EasingName,
): { x: number; y: number } => {
  const e = ease(easing, t);
  return { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
};

export type LifecyclePhase = "before" | "enter" | "play" | "exit" | "after";

export type EffectProgress = {
  phase: LifecyclePhase;
  /** 距 startFrame 的局部帧（可为负）。 */
  local: number;
  /** enter 归一化进度 0..1（enter 阶段外为 0 或 1）。 */
  enter: number;
  /** exit 归一化进度 0..1。 */
  exit: number;
  /** 是否处于 enter/play/exit 的任一活跃区间。 */
  active: boolean;
};

export const effectProgress = (timing: EffectTiming, frame: number): EffectProgress => {
  const local = frame - timing.startFrame;
  const enterEnd = timing.enterFrames;
  const hold = timing.holdFrames ?? 0;
  const playEnd = enterEnd + hold;
  const exitEnd = playEnd + timing.exitFrames;

  if (local < 0) {
    return { phase: "before", local, enter: 0, exit: 0, active: false };
  }
  if (local < enterEnd) {
    const enter = timing.enterFrames <= 0 ? 1 : clamp(local / timing.enterFrames, 0, 1);
    return { phase: "enter", local, enter, exit: 0, active: true };
  }
  if (local < playEnd) {
    return { phase: "play", local, enter: 1, exit: 0, active: true };
  }
  if (local < exitEnd) {
    const exit = timing.exitFrames <= 0 ? 1 : clamp((local - playEnd) / timing.exitFrames, 0, 1);
    return { phase: "exit", local, enter: 1, exit, active: true };
  }
  return { phase: "after", local, enter: 1, exit: 1, active: false };
};

/** 排序稳定的 easing 名集合（供 schema / catalog / 表单校验）。 */
export const EASING_NAMES: readonly EasingName[] = ["linear", "easeIn", "easeOut", "easeInOut"] as const;
