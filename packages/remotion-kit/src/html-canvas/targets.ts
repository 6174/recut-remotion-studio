/**
 * [INPUT]: 依赖 types 的 Point/Rect/FocusTarget
 * [OUTPUT]: 对外提供 targetCenter/targetBounds/containsPoint/expandRect 等纯几何函数
 * [POS]: src/html-canvas 的目标几何层。所有坐标均为设计像素；效果只消费显式几何，
 *        不做 CSS selector 扫描或 DOM layout 读回。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { FocusTarget, Point, Rect } from "./types";
import { clamp } from "./timeline";

export const rectCenter = (rect: Rect): Point => ({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });

export const rectContains = (rect: Rect, point: Point): boolean =>
  point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;

export const circleContains = (cx: number, cy: number, radius: number, point: Point): boolean => {
  const dx = point.x - cx;
  const dy = point.y - cy;
  return dx * dx + dy * dy <= radius * radius;
};

/** 点是否位于 path 多边形内（射线法，纯函数）。 */
export const polygonContains = (points: Point[], point: Point): boolean => {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i];
    const b = points[j];
    const intersect = a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const targetCenter = (target: FocusTarget): Point => {
  switch (target.kind) {
    case "rect":
      return rectCenter(target.rect);
    case "circle":
      return { x: target.cx, y: target.cy };
    case "path": {
      if (target.points.length === 0) return { x: 0, y: 0 };
      const sum = target.points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
      return { x: sum.x / target.points.length, y: sum.y / target.points.length };
    }
  }
};

export const targetBounds = (target: FocusTarget): Rect => {
  switch (target.kind) {
    case "rect":
      return { ...target.rect };
    case "circle":
      return { x: target.cx - target.radius, y: target.cy - target.radius, width: target.radius * 2, height: target.radius * 2 };
    case "path": {
      if (target.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const p of target.points) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
  }
};

export const containsPoint = (target: FocusTarget, point: Point): boolean => {
  switch (target.kind) {
    case "rect":
      return rectContains(target.rect, point);
    case "circle":
      return circleContains(target.cx, target.cy, target.radius, point);
    case "path":
      return polygonContains(target.points, point);
  }
};

/** 以 (px) 均匀外扩矩形；amount 为负时收缩。 */
export const expandRect = (rect: Rect, amount: number): Rect => ({
  x: rect.x - amount,
  y: rect.y - amount,
  width: rect.width + amount * 2,
  height: rect.height + amount * 2,
});

export const clampPointToRect = (point: Point, rect: Rect): Point => ({
  x: clamp(point.x, rect.x, rect.x + rect.width),
  y: clamp(point.y, rect.y, rect.y + rect.height),
});

/** 圆形 target 的质心半径（用于 spotlight 的羽毛半径估算）。 */
export const targetRadius = (target: FocusTarget): number => {
  const b = targetBounds(target);
  return Math.hypot(b.width, b.height) / 2;
};
