/**
 * [INPUT]: 依赖 CanvasEffect 契约、timeline 进度、targets 几何
 * [OUTPUT]: 对外提供 focusSpotlightEffect（Focus Spotlight 的 paint renderer）
 * [POS]: src/html-canvas/effects 的聚焦引导效果。内容纹理外压暗、目标区域保持清晰，
 *        带羽化与边缘光；可由 options.followPointer 让 hover/click 的目标接管焦点。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition, PaintContext } from "../CanvasEffect";
import type { FocusTarget } from "../types";
import { targetBounds, targetRadius } from "../targets";

const DEFAULT_DIM_OPACITY = 0.78;
const DEFAULT_EDGE = "rgba(138, 244, 255, 0.9)";

/** followPointer 时按 hover/click 目标接管；否则用 clip 声明的目标。 */
const resolveFocusTarget = (paint: PaintContext, clipTarget: FocusTarget | undefined): FocusTarget | undefined => {
  const follow = paint.targets[`focus:${paint.interaction.hoveredTargetId ?? ""}`];
  if (follow) return follow;
  return clipTarget;
};

export const focusSpotlightEffect: CanvasEffectDefinition = {
  id: "focus-spotlight",
  label: "Focus Spotlight",
  description: "聚焦引导：内容纹理外压暗、目标区域清晰，带羽化与边缘光。",
  scope: "scene",
  schema: {
    dim: { type: "number", min: 0.1, max: 0.95, default: 0.78 },
    edge: { type: "boolean", default: true },
    followPointer: { type: "boolean", default: false },
  },
  getBounds: (runtime, paint) => {
    const target = resolveFocusTarget(paint, runtime.target);
    return target ? targetBounds(target) : null;
  },
  render: (paint: PaintContext, runtime) => {
    const { ctx, width, height } = paint;
    const target = resolveFocusTarget(paint, runtime.target);
    if (!target) return;
    const { progress } = runtime;
    if (!progress.active) return;

    const dim = typeof runtime.clip.options?.dim === "number" ? runtime.clip.options.dim : DEFAULT_DIM_OPACITY;
    const edge = runtime.clip.options?.edge !== false;
    const enter = progress.phase === "exit" ? 1 - progress.exit : progress.enter;
    const grow = progress.phase === "enter" ? 0.35 + 0.65 * progress.enter : progress.phase === "exit" ? 1 - 0.65 * progress.exit : 1;

    const bounds = targetBounds(target);
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    const core = targetRadius(target) * Math.max(0.01, grow);
    const feather = Math.max(120, core * 0.9);
    const outer = core + feather;

    ctx.save();
    const gradient = ctx.createRadialGradient(cx, cy, core, cx, cy, outer);
    gradient.addColorStop(0, "rgba(6, 8, 24, 0)");
    gradient.addColorStop(0.62, `rgba(6, 8, 24, ${0.32 * dim * enter})`);
    gradient.addColorStop(1, `rgba(6, 8, 24, ${dim * enter})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    if (edge && enter > 0.02) {
      ctx.save();
      ctx.globalAlpha = enter * 0.9;
      ctx.strokeStyle = DEFAULT_EDGE;
      ctx.lineWidth = 3;
      if (target.kind === "circle") {
        ctx.beginPath();
        ctx.arc(cx, cy, core, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const r = target.kind === "rect" ? Math.min(target.radius ?? 18, bounds.width / 2, bounds.height / 2) : Math.min(18, bounds.width / 2, bounds.height / 2);
        roundRectPath(ctx, bounds.x, bounds.y, bounds.width, bounds.height, r);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
};

const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, r: number) => {
  const radius = Math.max(0, r);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};
