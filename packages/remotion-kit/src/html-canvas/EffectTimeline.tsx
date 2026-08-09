/**
 * [INPUT]: 依赖 timeline 生命周期、types 的 StagePlan/EffectRuntime
 * [OUTPUT]: 对外提供 resolveActiveEffects（帧 → 活跃效果轨）与 useEffectTimeline
 * [POS]: src/html-canvas 的效果轨解析层。解析局部生命周期与全局层级轨，向 paint
 *        提供当前帧状态；不持有渲染副作用。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { effectProgress } from "./timeline";
import type { EffectRuntime } from "./CanvasEffect";
import type { StagePlan } from "./types";

/** 解析 plan 在当前帧的活跃效果轨，按 zIndex 升序返回。 */
export const resolveActiveEffects = (plan: StagePlan, frame: number): EffectRuntime[] => {
  const clips = plan.effects ?? [];
  const targets = plan.targets ?? {};
  return clips
    .map((clip) => {
      const progress = effectProgress(clip.timing, frame);
      return { clip, progress, target: clip.targetId ? targets[clip.targetId] : undefined };
    })
    .filter((runtime) => runtime.progress.active)
    .sort((a, b) => a.clip.zIndex - b.clip.zIndex);
};

export const useEffectTimeline = (plan: StagePlan): EffectRuntime[] => {
  const frame = useCurrentFrame();
  return useMemo(() => resolveActiveEffects(plan, frame), [plan, frame]);
};
