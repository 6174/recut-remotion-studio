/**
 * [INPUT]: 依赖 CanvasEffect 契约、timeline 进度、targets 中心
 * [OUTPUT]: 对外提供 magnifierEffect（Magnifier 的 paint renderer）
 * [POS]: src/html-canvas/effects 的放大镜效果。对 cursor 或关键帧目标二次采样 HTML 纹理，
 *        绘制透镜、HUD 与可选色差；折射强度受预算限制，不做真实折射。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition, PaintContext } from "../CanvasEffect";
import type { Point } from "../types";
import { targetCenter } from "../targets";

const DEFAULT_RADIUS = 150;
const DEFAULT_ZOOM = 2;

const lensCenter = (paint: PaintContext): Point | null => {
  const { interaction, targets } = paint;
  if (interaction.pointer) return interaction.pointer;
  const hovered = interaction.hoveredTargetId ?? interaction.pressedTargetId;
  const target = hovered ? targets[hovered] : undefined;
  return target ? targetCenter(target) : null;
};

export const magnifierEffect: CanvasEffectDefinition = {
  id: "magnifier",
  label: "Magnifier",
  description: "细节放大镜：二次采样 HTML 纹理到透镜区域，带边缘与 HUD。",
  scope: "scene",
  schema: {
    radius: { type: "number", min: 40, max: 480, default: DEFAULT_RADIUS },
    zoom: { type: "number", min: 1.25, max: 4, default: DEFAULT_ZOOM },
    chromatic: { type: "boolean", default: false },
  },
  render: (paint: PaintContext, runtime) => {
    const { ctx, width, height, contentCanvas } = paint;
    const center = lensCenter(paint) ?? (runtime.target ? targetCenter(runtime.target) : null);
    if (!center) return;
    const { progress } = runtime;
    if (!progress.active) return;

    const radius = typeof runtime.clip.options?.radius === "number" ? runtime.clip.options.radius : DEFAULT_RADIUS;
    const zoom = typeof runtime.clip.options?.zoom === "number" ? runtime.clip.options.zoom : DEFAULT_ZOOM;
    const chromatic = runtime.clip.options?.chromatic === true;

    const enter = progress.phase === "exit" ? 1 - progress.exit : progress.enter;
    const grow = progress.phase === "enter" ? 0.5 + 0.5 * progress.enter : progress.phase === "exit" ? 1 - 0.5 * progress.exit : 1;
    const r = radius * Math.max(0.01, grow);
    if (enter <= 0) return;

    const cx = center.x;
    const cy = center.y;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // 从内容层（HtmlInCanvas layout canvas）采样放大区域；contentScale 对齐设计像素。
    const sourceSize = (r * 2) / zoom;
    if (contentCanvas) {
      const scale = contentCanvas.width > 0 ? contentCanvas.width / width : 1;
      try {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          contentCanvas,
          (cx - sourceSize / 2) * scale,
          (cy - sourceSize / 2) * scale,
          sourceSize * scale,
          sourceSize * scale,
          cx - r,
          cy - r,
          r * 2,
          r * 2,
        );
      } catch {
        ctx.fillStyle = "rgba(20, 24, 44, 0.55)";
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    } else {
      ctx.fillStyle = "rgba(20, 24, 44, 0.55)";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    if (chromatic) {
      ctx.globalCompositeOperation = "screen";
      ctx.strokeStyle = "rgba(255, 80, 120, 0.5)";
      ctx.lineWidth = r * 0.12;
      ctx.beginPath();
      ctx.arc(cx - r * 0.03, cy, r * 0.98, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(90, 190, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(cx + r * 0.03, cy, r * 0.98, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();

    // 透镜边缘 + HUD。
    ctx.save();
    ctx.globalAlpha = enter * 0.95;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.font = "600 22px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${zoom.toFixed(1)}×`, cx, cy - r - 14);
    ctx.fillText(`MAGNIFY ${width}×${height}`, cx, cy + r + 28);
    ctx.restore();
  },
};
