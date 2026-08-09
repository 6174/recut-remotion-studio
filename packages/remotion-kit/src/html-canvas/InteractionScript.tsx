/**
 * [INPUT]: 依赖 interaction 纯推导、types 的 InteractionEvent/InteractionState 与 Remotion 帧
 * [OUTPUT]: 对外提供 InteractionProvider / useInteraction 与 resolveInteractionState / resolvePointer
 * [POS]: src/html-canvas 的互动脚本桥。帧驱动鼠标、click/hover/drag/scroll 与语义 UI 状态；
 *        场景组件读取同一脚本派生的 state，因此导出无论并发、跳帧还是重播都一致。
 *        绝不向真实 DOM dispatch pointer event。
 *        性能：语义值只在 hover/press/click/scroll 变化时以稳定引用发布（指针移动不算），
 *        静态组件不会被 context 拖着重渲染；效果层自己按帧取完整状态。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { createContext, useContext, useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { resolveInteractionState } from "./interaction";
import type { InteractionEvent, InteractionState, TargetMap } from "./types";

export { resolveInteractionState, resolvePointer, pathPointAt } from "./interaction";
export type { InteractionEvent, InteractionState } from "./types";

export const InteractionContext = createContext<InteractionState | null>(null);

/** 语义指纹：排除持续变化的 pointer，只含 hover/press/click/scroll。 */
const semanticFingerprint = (s: InteractionState): string => {
  const clicks = s.clicks.map((c) => `${c.frame}:${c.targetId}:${c.x}:${c.y}`).join(",");
  return `${s.hoveredTargetId ?? ""}|${s.pressedTargetId ?? ""}|${s.scrollTargetId ?? ""}|${s.scrollOffsetY}|${clicks}`;
};

const useStableInteraction = (raw: InteractionState): InteractionState => {
  const prevRef = useRef<InteractionState | null>(null);
  const prevFingerprintRef = useRef("");
  return useMemo(() => {
    const fp = semanticFingerprint(raw);
    if (prevRef.current && fp === prevFingerprintRef.current) {
      return prevRef.current;
    }
    prevFingerprintRef.current = fp;
    prevRef.current = raw;
    return raw;
  }, [raw]);
};

export const InteractionProvider: React.FC<{ events?: InteractionEvent[]; children?: React.ReactNode }> = ({ events, children }) => {
  const frame = useCurrentFrame();
  const raw = useMemo(() => resolveInteractionState(events, frame), [events, frame]);
  const value = useStableInteraction(raw);
  return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
};

/** 在捕获面内部读取当前帧语义互动状态；必须在 HtmlCanvasVideoStage 内使用。 */
export const useInteraction = (): InteractionState => {
  const state = useContext(InteractionContext);
  if (!state) {
    throw new Error("useInteraction 必须在 HtmlCanvasVideoStage（HtmlInCanvas 捕获面）内部使用");
  }
  return state;
};

/** 捕获面外的组件安全读取：在舞台内返回互动状态，舞台外返回 null（如未启用舞台的 beat）。 */
export const useInteractionMaybe = (): InteractionState | null => {
  return useContext(InteractionContext);
};

/** 效果层 / 脚本消费的完整帧状态（含 pointer），逐帧变化。 */
export const useInteractionEvents = (events?: InteractionEvent[], targets?: TargetMap) => {
  const frame = useCurrentFrame();
  return useMemo(() => resolveInteractionState(events, frame), [events, frame, targets]);
};
