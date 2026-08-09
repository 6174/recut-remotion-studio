/**
 * [INPUT]: 依赖 types 的 InteractionEvent/InteractionState/Point/EasingName 与 timeline 插值
 * [OUTPUT]: 对外提供 resolveInteractionState（帧驱动互动状态推导）与 resolvePointer
 * [POS]: src/html-canvas 的互动推导层。鼠标轨迹与语义 UI 状态只由事件列表 + 帧推导，
 *        重放/并发/跳帧逐帧一致；真实 pointer 事件、Date.now()、Math.random() 一律不进入。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { interpolatePoint } from "./timeline";
import type { EasingName, InteractionEvent, InteractionState, Point, TargetMap } from "./types";
import { targetCenter } from "./targets";

const PRESS_FRAMES = 10;
const CLICK_WINDOW_FRAMES = 12;

type MoveWaypoint = { frame: number; x: number; y: number; easing?: EasingName };

/** 统一取事件的起始帧（drag 用 startFrame）。 */
const eventFrame = (e: InteractionEvent): number => (e.kind === "drag" ? e.startFrame : e.frame);

export const sortEvents = (events: InteractionEvent[]): InteractionEvent[] =>
  [...events].sort((a, b) => eventFrame(a) - eventFrame(b));

const moveWaypoints = (events: InteractionEvent[]): MoveWaypoint[] =>
  events.filter((e) => e.kind === "move").map((e) => ({ frame: e.frame, x: e.x, y: e.y, easing: e.easing }));

/** 取 frame 处活跃的 drag 阶段（from→to 插值），否则 null。 */
const dragAt = (events: InteractionEvent[], frame: number): InteractionState["drag"] => {
  let active: InteractionState["drag"] = null;
  for (const e of events) {
    if (e.kind !== "drag") continue;
    if (frame >= e.startFrame && frame <= e.endFrame) {
      const t = e.endFrame === e.startFrame ? 1 : (frame - e.startFrame) / (e.endFrame - e.startFrame);
      active = { from: e.from, to: e.to, progress: Math.min(1, Math.max(0, t)) };
    }
  }
  return active;
};

/** move 路径插值：返回 frame 处的路径点；位于 drag 阶段时以 drag 位置覆盖。 */
export const pathPointAt = (events: InteractionEvent[], frame: number): Point | null => {
  const drag = dragAt(events, frame);
  if (drag) return interpolatePoint(drag.from, drag.to, drag.progress, "easeInOut");
  const waypoints = moveWaypoints(events);
  if (waypoints.length === 0) return null;
  if (frame <= waypoints[0].frame) return { x: waypoints[0].x, y: waypoints[0].y };
  const last = waypoints[waypoints.length - 1];
  if (frame >= last.frame) return { x: last.x, y: last.y };
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = b.frame === a.frame ? 1 : (frame - a.frame) / (b.frame - a.frame);
      // easing 属于终点关键帧：该段“缓动到达” b。
      return interpolatePoint(a, b, t, b.easing);
    }
  }
  return { x: last.x, y: last.y };
};

/** 由事件列表推导 frame 处的完整互动状态（纯函数）。 */
export const resolveInteractionState = (events: InteractionEvent[] | undefined, frame: number): InteractionState => {
  const sorted = sortEvents(events ?? []);
  const drag = dragAt(sorted, frame);

  let hoveredTargetId: string | null = null;
  let pressedTargetId: string | null = null;
  let scrollOffsetY = 0;
  let scrollTargetId: string | null = null;
  const clicks: InteractionState["clicks"] = [];

  for (const e of sorted) {
    if (eventFrame(e) > frame) break;
    if (e.kind === "hover") hoveredTargetId = e.targetId;
    if (e.kind === "click") {
      hoveredTargetId = e.targetId;
      pressedTargetId = e.targetId;
    }
    if (e.kind === "scroll") {
      scrollOffsetY = e.offsetY;
      scrollTargetId = e.targetId;
    }
  }

  for (const e of sorted) {
    if (e.kind !== "click") continue;
    if (e.frame > frame || frame - e.frame > CLICK_WINDOW_FRAMES) continue;
    const x = pathPointAt(sorted, e.frame);
    clicks.push({ frame: e.frame, targetId: e.targetId, x: x?.x ?? 0, y: x?.y ?? 0 });
  }

  if (pressedTargetId !== null && frame - lastClickFrame(sorted, frame) > PRESS_FRAMES) {
    pressedTargetId = null;
  }

  const pathPoint = pathPointAt(sorted, frame);
  const pointer = drag ? interpolatePoint(drag.from, drag.to, drag.progress, "easeInOut") : pathPoint;

  return {
    frame,
    pointer,
    hoveredTargetId,
    pressedTargetId,
    clicks,
    drag,
    scrollOffsetY,
    scrollTargetId,
    pathPoint,
  };
};

const lastClickFrame = (events: InteractionEvent[], frame: number): number => {
  let last = -Infinity;
  for (const e of events) {
    if (e.kind === "click" && e.frame <= frame) last = Math.max(last, e.frame);
  }
  return last;
};

/** 指针最终位置：move/drag 优先；否则回退到 hover/click 目标的中心（保证 cursor 可见）。 */
export const resolvePointer = (
  events: InteractionEvent[] | undefined,
  frame: number,
  targets?: TargetMap,
): Point | null => {
  const state = resolveInteractionState(events, frame);
  if (state.pointer) return state.pointer;
  const hovered = state.hoveredTargetId ?? state.pressedTargetId;
  const target = hovered ? targets?.[hovered] : undefined;
  return target ? targetCenter(target) : null;
};
