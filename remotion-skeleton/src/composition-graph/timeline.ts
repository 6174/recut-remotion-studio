/**
 * [INPUT]: 依赖 shots/types 导出的 ShotId
 * [OUTPUT]: 对外提供 120 秒、24 镜头的 Remotion frame timing；不包含文案、布局或视觉样式
 * [POS]: composition-graph 的纯时间层；scene component 与 renderer effect 由 shot-scenes.tsx 拥有
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ShotId } from "./shots/types";

export const GRAPH_DURATION_IN_FRAMES = 30 * 120;
export const SHOT_DURATION_IN_FRAMES = 30 * 5;

export const SHOT_TIMELINE: readonly ShotId[] = [
  "opening",
  "react",
  "frame",
  "component",
  "cut",
  "composition",
  "html",
  "hic",
  "raster",
  "media",
  "ratio",
  "three",
  "depth",
  "magnify",
  "glitch",
  "bubble",
  "clouds",
  "effects",
  "agent",
  "preview",
  "render",
  "runtime",
  "result",
  "end",
];

export const shotAt = (frame: number, fps: number) => {
  const framesPerShot = Math.max(1, fps * 5);
  const index = Math.min(
    SHOT_TIMELINE.length - 1,
    Math.floor(frame / framesPerShot),
  );
  return {
    id: SHOT_TIMELINE[index],
    progress: (frame % framesPerShot) / framesPerShot,
  };
};
