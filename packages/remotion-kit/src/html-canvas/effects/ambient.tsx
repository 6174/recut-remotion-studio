/**
 * [INPUT]: 依赖 CanvasEffect 契约、timeline 进度
 * [OUTPUT]: 对外提供 ambientEffect（AmbientCanvasFX 的 paint renderer）
 * [POS]: src/html-canvas/effects 的氛围背景效果。确定性 grain/vignette/soft tint，
 *        作为背景 track 默认不与强透镜叠加；每场景最多一个。
 *        性能：grain 用 64px 噪声瓦片 + 单次 pattern fill（约 0.08ms/帧），
 *        不做 20k 次 fillRect 的逐格绘制。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition, PaintContext } from "../CanvasEffect";
import { clamp } from "../timeline";

const TILE = 64;

const cellNoise = (x: number, y: number, frame: number): number => {
  const value = Math.sin(x * 127.1 + y * 311.7 + frame * 74.7) * 43758.5453;
  return value - Math.floor(value);
};

let grainTile: HTMLCanvasElement | null = null;
let grainImage: ImageData | null = null;

/** 用可复用的小瓦片生成确定性 grain，并以 pattern 单次填充整帧。 */
const drawGrain = (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number, amount: number) => {
  if (!grainTile) {
    grainTile = document.createElement("canvas");
    grainTile.width = TILE;
    grainTile.height = TILE;
  }
  const gctx = grainTile.getContext("2d");
  if (!gctx) return;
  if (!grainImage) grainImage = gctx.createImageData(TILE, TILE);
  const d = grainImage.data;
  for (let i = 0; i < d.length; i += 4) {
    const idx = i / 4;
    const n = cellNoise(idx % TILE, Math.floor(idx / TILE), frame);
    d[i] = 255;
    d[i + 1] = 255;
    d[i + 2] = 255;
    d[i + 3] = Math.round(255 * (0.3 + n * 0.7) * amount);
  }
  gctx.putImageData(grainImage, 0, 0);
  const pattern = ctx.createPattern(grainTile, "repeat");
  if (!pattern) return;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
};

export const ambientEffect: CanvasEffectDefinition = {
  id: "ambient",
  label: "Ambient Canvas FX",
  description: "轻量背景材质：确定性 grain、vignette 与冷色调。",
  scope: "video",
  schema: {
    grain: { type: "number", min: 0, max: 0.35, default: 0.05 },
    vignette: { type: "number", min: 0, max: 0.7, default: 0.18 },
  },
  render: (paint: PaintContext, runtime) => {
    const { ctx, width, height, frame } = paint;
    const { progress } = runtime;
    if (!progress.active) return;
    const enter = progress.phase === "exit" ? 1 - progress.exit : progress.enter;
    if (enter <= 0) return;

    const grain = clamp(typeof runtime.clip.options?.grain === "number" ? runtime.clip.options.grain : 0.05, 0, 0.35);
    const vignette = clamp(typeof runtime.clip.options?.vignette === "number" ? runtime.clip.options.vignette : 0.18, 0, 0.7);

    ctx.save();
    ctx.globalAlpha = enter;

    if (grain > 0) {
      drawGrain(ctx, width, height, frame, grain);
    }

    if (vignette > 0) {
      const gradient = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.35, width / 2, height / 2, Math.hypot(width, height) / 2);
      gradient.addColorStop(0, "rgba(8, 10, 26, 0)");
      gradient.addColorStop(1, `rgba(8, 10, 26, ${vignette})`);
      ctx.globalAlpha = enter;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  },
};
