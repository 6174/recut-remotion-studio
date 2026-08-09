/**
 * [INPUT]: 依赖 CanvasEffect 契约、timeline 插值、targets 命中与 InteractionState
 * [OUTPUT]: 对外提供 cursorEffect（Cursor Director 的 paint renderer）
 * [POS]: src/html-canvas/effects 的互动导演效果。可见光标、hover halo、click ripple、
 *        drag trail 全部由 interaction 状态绘制，真实 pointer 事件不进入 render。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition, PaintContext } from "../CanvasEffect";
import { containsPoint } from "../targets";

const ARROW_PATH = "M1 1 L17 12.5 L11.5 13.1 L15 19 L12.7 20.2 L9.2 14.4 L1 18 Z";

const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const path = new Path2D(ARROW_PATH);
  ctx.save();
  ctx.translate(x - 1, y - 1);
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
  ctx.fill(path);
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = "rgba(10, 10, 14, 0.9)";
  ctx.stroke(path);
  ctx.restore();
};

const drawHoverHalo = (ctx: CanvasRenderingContext2D, paint: PaintContext) => {
  const { interaction, targets } = paint;
  const hovered = interaction.hoveredTargetId ?? interaction.pressedTargetId;
  if (!hovered || !interaction.pointer) return;
  const target = targets[hovered];
  if (target && !containsPoint(target, interaction.pointer)) return;
  const radius = 26;
  const gradient = ctx.createRadialGradient(interaction.pointer.x, interaction.pointer.y, radius * 0.35, interaction.pointer.x, interaction.pointer.y, radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.32)");
  gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.10)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(interaction.pointer.x, interaction.pointer.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(interaction.pointer.x, interaction.pointer.y, radius * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
};

const drawClickRipples = (ctx: CanvasRenderingContext2D, paint: PaintContext) => {
  const { interaction, frame } = paint;
  for (const click of interaction.clicks) {
    const since = frame - click.frame;
    if (since < 0 || since > 14) continue;
    const progress = since / 14;
    const radius = 8 + progress * 40;
    ctx.save();
    ctx.globalAlpha = (1 - progress) * 0.9;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2.4 * (1 - progress) + 0.6;
    ctx.beginPath();
    ctx.arc(click.x, click.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.arc(click.x, click.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

const drawDragTrail = (ctx: CanvasRenderingContext2D, paint: PaintContext) => {
  const { interaction } = paint;
  if (!interaction.drag) return;
  const { from, to, progress } = interaction.drag;
  ctx.save();
  ctx.lineCap = "round";
  const trail = Math.min(1, progress + 0.15);
  ctx.globalAlpha = 0.45 * trail;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(from.x + (to.x - from.x) * trail, from.y + (to.y - from.y) * trail);
  ctx.stroke();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "rgba(138, 244, 255, 0.95)";
  ctx.beginPath();
  ctx.arc(from.x, from.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.arc(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const cursorEffect: CanvasEffectDefinition = {
  id: "cursor",
  label: "Cursor Director",
  description: "模拟鼠标轨迹：可见光标、hover halo、click ripple 与 drag trail，全部帧驱动。",
  scope: "video",
  render: (paint: PaintContext) => {
    const { ctx, interaction } = paint;
    if (!interaction.pointer) return;
    drawDragTrail(ctx, paint);
    drawClickRipples(ctx, paint);
    drawHoverHalo(ctx, paint);
    drawArrow(ctx, interaction.pointer.x, interaction.pointer.y);
  },
};
