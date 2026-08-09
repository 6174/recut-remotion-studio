/**
 * [INPUT]: 依赖 CanvasEffect 契约、timeline 进度、types 的 Rect
 * [OUTPUT]: 对外提供 textSelectionEffect（Text Selection 的 paint renderer）
 * [POS]: src/html-canvas/effects 的文本选择效果。消费场景排版时产出的 token Rect[]，
 *        按 enter 进度逐词/逐行 reveal；文本本身始终保留在 source HTML 中。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition, PaintContext } from "../CanvasEffect";
import type { Rect } from "../types";
import { clamp } from "../timeline";

const DEFAULT_COLOR = "rgba(255, 224, 102, 0.5)";
const SCAN_COLOR = "rgba(255, 255, 255, 0.32)";

const tokenRects = (options: Record<string, unknown> | undefined): Rect[] => {
  const raw = options?.tokens;
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is Rect => Boolean(item) && typeof item === "object" && typeof (item as Rect).x === "number");
};

export const textSelectionEffect: CanvasEffectDefinition = {
  id: "text-selection",
  label: "Text Selection",
  description: "文本选择与荧光笔：按 token Rect[] 逐词/逐行 reveal，可选扫读光。",
  scope: "scene",
  schema: {
    color: { type: "string", default: DEFAULT_COLOR },
    scan: { type: "boolean", default: false },
  },
  getBounds: (runtime) => {
    const rects = tokenRects(runtime.clip.options);
    if (rects.length === 0) return null;
    const first = rects[0];
    const merged = rects.reduce(
      (acc, r) => ({
        x: Math.min(acc.x, r.x),
        y: Math.min(acc.y, r.y),
        width: Math.max(acc.width, r.x + r.width) - Math.min(acc.x, r.x),
        height: Math.max(acc.height, r.y + r.height) - Math.min(acc.y, r.y),
      }),
      { ...first },
    );
    return merged;
  },
  render: (paint: PaintContext, runtime) => {
    const { ctx } = paint;
    const rects = tokenRects(runtime.clip.options);
    if (rects.length === 0) return;
    const { progress } = runtime;
    if (!progress.active) return;

    const color = typeof runtime.clip.options?.color === "string" ? runtime.clip.options.color : DEFAULT_COLOR;
    const scan = runtime.clip.options?.scan === true;
    const enter = progress.phase === "exit" ? 1 - progress.exit : progress.enter;
    if (enter <= 0) return;

    const revealed = Math.floor(clamp(enter, 0, 1) * rects.length);
    ctx.save();
    ctx.fillStyle = color;
    for (let i = 0; i < revealed; i++) {
      const r = rects[i];
      ctx.fillRect(r.x, r.y, r.width, r.height);
    }
    if (scan && revealed > 0) {
      const last = rects[Math.min(revealed, rects.length) - 1];
      const sweep = 1 - (1 - (enter * rects.length - revealed)) * 2;
      ctx.fillStyle = SCAN_COLOR;
      ctx.fillRect(last.x, last.y, Math.max(2, last.width * Math.max(0, sweep)), last.height);
    }
    ctx.restore();
  },
};
