/**
 * [INPUT]: 依赖 Remotion 帧时钟、roughjs（手绘 SVG 生成器）与 doodle-explainer 的速写本调色板
 * [OUTPUT]: 对外提供白板涂鸦讲解的确定性手绘原语：点阵纸、歪扭方框/椭圆、手绘弧线箭头、
 *           下划线、荧光高亮、流式便签卡、编号步骤、数据条与进度条。
 * [POS]: scenarios/doodle-explainer 的视觉源语层。全部图形用 roughjs generator + 固定 seed
 *        生成（预览与导出逐帧一致），beats 只组合本文件原语；可读文字遵守 1080p 主信息 ≥56px、
 *        逐词字幕 ≥40px、辅助信息 ≥32px 的全局约束。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import rough from "roughjs";
import type { Drawable, Options, PathInfo } from "roughjs/bin/core";
import type { RoughGenerator } from "roughjs/bin/generator";
import type { Palette } from "../../palette";

export const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const enter = (frame: number, fps: number, delay = 0, damping = 16, stiffness = 140) =>
  spring({ frame: Math.max(0, frame - delay), fps, config: { damping, mass: 0.8, stiffness } });

/** 速写本墨色 / 暖纸底色（与全局 doodle 设计系统 token 对齐）。 */
export const INK = "#1d1836";
export const PAPER = "#fff8d7";
export const ACCENT = "#ff6b00";

const pathCache = new Map<string, PathInfo[]>();

/** 用固定 seed 的 roughjs generator 生成手绘路径并缓存：同 seed 必得同一组 path。 */
function roughPaths(
  key: string,
  seed: number,
  base: Options,
  build: (g: RoughGenerator) => Drawable | Drawable[],
): PathInfo[] {
  const k = `${key}:${seed}`;
  const hit = pathCache.get(k);
  if (hit) return hit;
  const g = rough.generator({ options: { seed, roughness: 1.6, bowing: 1.4, ...base } });
  const out = build(g);
  const list = Array.isArray(out) ? out : [out];
  const paths = list.flatMap((d) => g.toPaths(d));
  pathCache.set(k, paths);
  return paths;
}

/** 手绘矩形：歪扭双描边方框，可带半透明填充（高亮/便签）。 */
export const roughRect = (seed: number, x: number, y: number, w: number, h: number, opts: Options = {}) =>
  roughPaths(`rect:${seed}:${x}:${y}:${w}:${h}`, seed, { stroke: INK, strokeWidth: 7, ...opts }, (g) =>
    g.rectangle(x, y, w, h, { seed, strokeWidth: 7, ...opts }),
  );

/** 手绘椭圆：歪扭椭圆框。 */
export const roughEllipse = (seed: number, cx: number, cy: number, rx: number, ry: number, opts: Options = {}) =>
  roughPaths(`ellipse:${seed}:${cx}:${cy}:${rx}:${ry}`, seed, { stroke: INK, strokeWidth: 7, ...opts }, (g) =>
    g.ellipse(cx, cy, rx, ry, { seed, strokeWidth: 7, ...opts }),
  );

function arrowHead(x1: number, y1: number, x2: number, y2: number, size: number): [number, number][] {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a = angle - Math.PI / 7;
  const b = angle + Math.PI / 7;
  return [
    [x2, y2],
    [x2 - size * Math.cos(a), y2 - size * Math.sin(a)],
    [x2 - size * Math.cos(b), y2 - size * Math.sin(b)],
  ];
}

/** 手绘箭头：歪扭的线 + 一个手绘箭头三角，箭头方向由起点指向终点。 */
export type RoughArrowOptions = Options & { arrowhead?: number };
export const roughArrow = (seed: number, x1: number, y1: number, x2: number, y2: number, opts: RoughArrowOptions = {}) => {
  const headSize = typeof opts.arrowhead === "number" ? Number(opts.arrowhead) : 64;
  const { arrowhead, ...rest } = opts;
  const head: [number, number][] = arrowHead(x1, y1, x2, y2, headSize);
  return roughPaths(`arrow:${seed}:${x1}:${y1}:${x2}:${y2}`, seed, { stroke: INK, strokeWidth: 8, ...rest }, (g) => [
    g.line(x1, y1, x2, y2, { seed, strokeWidth: 8, ...rest }),
    g.polygon(head, { seed, strokeWidth: 6, ...rest }),
  ]);
};

/** 带自然弯曲幅度的手绘箭头：箭头头部沿最后一段切线朝向终点。 */
export const roughCurveArrow = (seed: number, points: number[][], opts: RoughArrowOptions = {}) => {
  const end = points[points.length - 1];
  const previous = points[points.length - 2];
  if (!end || !previous) return [];
  const headSize = typeof opts.arrowhead === "number" ? Number(opts.arrowhead) : 64;
  const { arrowhead, ...rest } = opts;
  return roughPaths(`curve-arrow:${seed}:${points.map((p) => p.join(",")).join("|")}`, seed, { stroke: INK, strokeWidth: 8, ...rest }, (g) => [
    g.curve(points as [number, number][], { seed, strokeWidth: 8, ...rest }),
    g.polygon(arrowHead(previous[0], previous[1], end[0], end[1], headSize), { seed, strokeWidth: 6, ...rest }),
  ]);
};

/** 手绘曲线（自由连线 / 下划线）：给一组点，画一条歪扭多段曲线。 */
export const roughCurve = (seed: number, points: number[][], opts: Options = {}) =>
  roughPaths(
    `curve:${seed}:${points.map((p) => p.join(",")).join("|")}`,
    seed,
    { stroke: INK, strokeWidth: 7, ...opts },
    (g) => g.curve(points as [number, number][], { seed, strokeWidth: 7, ...opts }),
  );

/** 手绘圆形编号徽章：歪扭圆 + 圆内数字（字号由外部控制，默认 44px）。 */
export const roughBadge = (seed: number, cx: number, cy: number, r: number, opts: Options = {}) =>
  roughEllipse(seed, cx, cy, r, r, opts);

/**
 * 动画手绘 SVG：把一组 roughjs path 渲染成可逐帧绘制的笔迹。
 * 描边 path 用 pathLength=1 + dashoffset 做「正在被画出来」的效果；填充 path 淡入。
 */
export const Sketch: React.FC<{
  paths: PathInfo[];
  frame: number;
  delay?: number;
  duration?: number;
  fillOpacity?: number;
  viewBox?: string;
  style?: React.CSSProperties;
}> = ({ paths, frame, delay = 0, duration = 26, fillOpacity = 1, viewBox = "0 0 1920 1080", style }) => {
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], clamp);
  const fade = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
  return (
    <svg viewBox={viewBox} style={{ position: "absolute", inset: 0, overflow: "visible", ...style }} pointerEvents="none">
      {paths.map((p, i) => {
        const isFill = Boolean(p.fill) && p.fill !== "none";
        return (
          <path
            key={i}
            d={p.d}
            fill={isFill ? p.fill : "none"}
            fillOpacity={isFill ? fillOpacity * fade : undefined}
            stroke={isFill ? "none" : p.stroke || INK}
            strokeWidth={isFill ? undefined : p.strokeWidth || 7}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={isFill ? undefined : 1}
            strokeDashoffset={isFill ? undefined : 1 - progress}
          />
        );
      })}
    </svg>
  );
};

/** 点阵速写本背景：只做纸张秩序，不承载阅读信息。 */
export const DotGrid: React.FC<{ color?: string; opacity?: number; size?: number }> = ({ color = INK, opacity = 0.14, size = 42 }) => (
  <div style={{ position: "absolute", inset: 0, opacity, backgroundImage: `radial-gradient(${color} 1.8px, transparent 1.8px)`, backgroundSize: `${size}px ${size}px` }} />
);

/** 手绘方框容器：流式卡片，尺寸只由调用者声明，不携带脱离布局的坐标。 */
export const SketchBox: React.FC<{
  seed: number;
  w: number;
  h: number;
  children?: React.ReactNode;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
  frame: number;
  delay?: number;
  duration?: number;
  rotation?: number;
}> = ({ seed, w, h, children, stroke, strokeWidth = 7, fill, fillOpacity = 0.18, frame, delay = 0, duration = 26, rotation = 0 }) => (
  <div style={{ position: "relative", flexShrink: 0, width: w, height: h, transform: `rotate(${rotation}deg)`, transformOrigin: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Sketch
      frame={frame}
      delay={delay}
      duration={duration}
      fillOpacity={fillOpacity}
      paths={roughRect(seed, 0, 0, w, h, { stroke, strokeWidth, fill })}
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: "100%", height: "100%" }}
    />
    {children}
  </div>
);

/** 手绘便签卡：流式便签，暖纸底色 + 顶部胶带条 + 歪扭边框。 */
export const SketchNote: React.FC<{
  seed: number;
  w: number;
  h: number;
  children?: React.ReactNode;
  tapeColor?: string;
  frame: number;
  delay?: number;
  rotation?: number;
  style?: React.CSSProperties;
}> = ({ seed, w, h, children, tapeColor = "#ffb020", frame, delay = 0, rotation = -2, style }) => {
  const progress = enter(frame, 30, delay, 15);
  return (
    <div style={{ position: "relative", flexShrink: 0, width: w, height: h, transform: `translateY(${(1 - progress) * 40}px) rotate(${rotation}deg)`, opacity: progress, ...style }}>
      <Sketch
        frame={frame}
        delay={delay}
        fillOpacity={0.95}
        paths={roughRect(seed, 0, 0, w, h, { fill: "#ffef9f", stroke: INK, strokeWidth: 7 })}
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", height: "100%" }}
      />
      <div style={{ position: "absolute", left: w * 0.34, top: -14, width: w * 0.32, height: 26, background: tapeColor, opacity: 0.7, transform: "rotate(-2deg)" }} />
      <div style={{ position: "absolute", inset: "26px 30px 22px", display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

/** 手绘芯片标签：歪扭椭圆 + 内部文字（≥32px）。 */
export const SketchChip: React.FC<{
  seed: number;
  children: React.ReactNode;
  color?: string;
  text?: string;
  bg?: string;
  frame: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ seed, children, color = INK, text = "#fff8d7", bg = "transparent", frame, delay = 0, style }) => {
  const fade = interpolate(frame, [delay, delay + 14], [0, 1], clamp);
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", opacity: fade, ...style }}>
      <Sketch frame={frame} delay={delay} fillOpacity={0.95} paths={roughEllipse(seed, 0, 0, 1, 1, {})} style={{ opacity: 0 }} />
      <span style={{ position: "relative", zIndex: 2, fontSize: 32, lineHeight: 1, fontWeight: 900, fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'PingFang SC', 'Noto Sans SC', sans-serif", letterSpacing: "-0.02em", color: text, background: bg, padding: "14px 26px" }}>
        {children}
      </span>
      <div style={{ position: "absolute", inset: 0, background: color, opacity: 0.2, transform: "rotate(-1.5deg)" }} />
    </div>
  );
};

/** 大字号标题：手绘字 + 可选手绘下划线。 */
export const SketchTitle: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  delay?: number;
  underlineSeed?: number;
  underlineColor?: string;
  underlineWidth?: number;
  lineHeight?: number;
}> = ({ children, color = INK, fontFamily, fontSize = 108, delay = 8, underlineSeed, underlineColor = ACCENT, underlineWidth, lineHeight = 0.98 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = enter(frame, fps, delay, 15);
  const lineWidth = underlineWidth ?? fontSize * 8;
  return (
    <div style={{ position: "relative", marginBottom: underlineSeed !== undefined ? 52 : 0, textAlign: "left" }}>
      <div style={{ fontSize, lineHeight, fontWeight: 950, letterSpacing: "-0.06em", color, fontFamily, transform: `translateY(${(1 - reveal) * 44}px)`, opacity: reveal }}>
        {children}
      </div>
      {underlineSeed !== undefined ? (
        <Sketch
          frame={frame}
          delay={delay + 14}
          duration={20}
          paths={roughCurve(underlineSeed, [
            [6, 18],
            [Math.round(lineWidth * 0.33), 34],
            [Math.round(lineWidth * 0.65), 14],
            [Math.round(lineWidth * 0.95), 30],
          ], { stroke: underlineColor, strokeWidth: 9 })}
          viewBox={`0 0 ${lineWidth} 52`}
          style={{ left: 0, top: "100%", right: "auto", bottom: "auto", width: lineWidth, height: 52 }}
        />
      ) : null}
    </div>
  );
};

/** 荧光高亮：在手绘椭圆填充上叠大号强调文字（marker 效果）。 */
export const SketchHighlight: React.FC<{
  seed: number;
  children: React.ReactNode;
  color?: string;
  frame: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ seed, children, color = ACCENT, frame, delay = 0, style }) => {
  const fade = interpolate(frame, [delay + 6, delay + 20], [0, 1], clamp);
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <Sketch frame={frame} delay={delay} fillOpacity={0.5} paths={roughEllipse(seed, 0, 0, 1, 1, {})} style={{ opacity: 0 }} />
      <div style={{ position: "relative", zIndex: 2, background: color, opacity: fade * 0.55, borderRadius: "50%", padding: "0.06em 0.5em 0.02em", transform: "rotate(-1deg)" }}>{children}</div>
    </div>
  );
};

/** 编号手绘步骤：歪扭圆徽章 + 大字号步骤文字。 */
export const SketchSteps: React.FC<{
  steps: string[];
  accent: string;
  text: string;
  fontFamily?: string;
  fontSize?: number;
  startFrame?: number;
}> = ({ steps, accent, text, fontFamily, fontSize = 42, startFrame = 12 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {steps.map((step, i) => {
        const delay = startFrame + i * 10;
        const opacity = interpolate(frame, [delay, delay + 14], [0, 1], clamp);
        const y = interpolate(frame, [delay, delay + 14], [30, 0], clamp);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, opacity, transform: `translateY(${y}px)` }}>
            <div style={{ position: "relative", width: 74, height: 74, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sketch frame={frame} delay={delay} fillOpacity={0.95} paths={roughBadge(40 + i, 37, 37, 36, { fill: "#fff8d7", stroke: INK, strokeWidth: 6 })} viewBox="0 0 74 74" style={{ width: "100%", height: "100%" }} />
              <span style={{ position: "relative", zIndex: 2, fontSize: 36, fontWeight: 950, fontFamily: "ui-monospace, monospace", color: INK }}>{i + 1}</span>
            </div>
            <span style={{ color: text, fontSize, lineHeight: 1.15, fontWeight: 900, fontFamily }}>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

/** 手绘数据条：手绘 track + 填充进度；只接收上游确认过的数据。 */
export const SketchBars: React.FC<{
  rows: { label: string; value: number; color: string }[];
  frame: number;
  startFrame?: number;
}> = ({ rows, frame, startFrame = 26 }) => (
  <div>
    {rows.map((row, index) => {
      const progress = interpolate(frame, [startFrame + index * 16, startFrame + 54 + index * 16], [0, row.value], clamp);
      return (
        <div key={row.label} style={{ marginTop: index === 0 ? 0 : 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 12, fontSize: 32, lineHeight: 1, fontWeight: 900 }}><span>{row.label}</span><span style={{ color: row.color }}>{Math.round(row.value * 100)}%</span></div>
          <div style={{ position: "relative", height: 26 }}>
            <Sketch frame={frame} delay={startFrame + index * 16} duration={20} paths={roughRect(80 + index, 0, 0, 780, 26, { stroke: INK, strokeWidth: 5 })} viewBox="0 0 780 26" style={{ width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", left: 8, top: 8, width: `${progress * 752}px`, height: 12, background: row.color, opacity: 0.85 }} />
          </div>
        </div>
      );
    })}
  </div>
);

/** 手绘进度条：歪扭描边的进度条，只作为动势。 */
export const SketchProgress: React.FC<{ color?: string; width?: number; delay?: number }> = ({ color = ACCENT, width = 560, delay = 22 }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [delay, delay + 46], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width, height: 34, marginTop: 46 }}>
      <Sketch frame={frame} delay={delay} duration={24} paths={roughRect(101, 0, 0, width, 34, { stroke: INK, strokeWidth: 6 })} viewBox={`0 0 ${width} 34`} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", left: 7, top: 7, height: 20, width: `${bar * (width - 14)}px`, background: color }} />
    </div>
  );
};
