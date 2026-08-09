/**
 * [INPUT]: 依赖 CanvasEffect 契约、timeline 进度
 * [OUTPUT]: 对外提供 sceneTransitionEffect（Scene Transition 的 paint renderer）
 * [POS]: src/html-canvas/effects 的场景进出效果。在 capture-space 对相邻场景做
 *        focus blur reveal；以最小 zIndex 运行并重绘基础纹理，不嵌套 HtmlInCanvas。
 *        注意：elementImage 只能在它被捕获的那张 canvas 上绘制（不能跨画布），
 *        因此 blur 直接以 ctx.filter 绘制在同一 canvas 上，只在该轨的 enter/exit 窗口生效。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition, PaintContext } from "../CanvasEffect";

const MAX_BLUR = 34;

export const sceneTransitionEffect: CanvasEffectDefinition = {
  id: "scene-transition",
  label: "Scene Transition",
  description: "场景进出：enter 时前一幕失焦淡出，exit 时下一幕由模糊聚焦。",
  scope: "video",
  schema: {
    blur: { type: "number", min: 0, max: 60, default: MAX_BLUR },
    tint: { type: "string", default: "rgba(8, 10, 26, 0)" },
  },
  render: (paint: PaintContext, runtime) => {
    const { ctx, width, height, contentCanvas } = paint;
    const { progress } = runtime;
    if (!progress.active) return;

    const maxBlur = typeof runtime.clip.options?.blur === "number" ? runtime.clip.options.blur : MAX_BLUR;
    const tint = typeof runtime.clip.options?.tint === "string" ? runtime.clip.options.tint : "rgba(8, 10, 26, 0)";

    // enter：前一幕 blur 0 → max 并淡出；play：保持 max；exit：下一幕由 max → 0 聚焦。
    const blur =
      progress.phase === "enter" ? maxBlur * progress.enter : progress.phase === "exit" ? maxBlur * (1 - progress.exit) : maxBlur;
    const alpha = progress.phase === "enter" ? 1 - 0.6 * progress.enter : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    if (contentCanvas) {
      if (blur > 2.5) ctx.filter = `blur(${Math.round(blur)}px)`;
      try {
        ctx.drawImage(contentCanvas, 0, 0, width, height);
      } catch {
        ctx.fillStyle = "rgba(8, 10, 26, 1)";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.filter = "none";
    } else {
      ctx.fillStyle = "rgba(8, 10, 26, 1)";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    if (tint !== "rgba(8, 10, 26, 0)") {
      ctx.save();
      ctx.globalAlpha = progress.phase === "enter" ? progress.enter : progress.phase === "exit" ? 1 - progress.exit : 1;
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  },
};
