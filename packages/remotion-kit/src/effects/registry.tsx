/**
 * [INPUT]: 依赖 Remotion 帧时钟、视频尺寸与各类背景效果组件
 * [OUTPUT]: 对外提供 Palette、BackgroundFX、GrainOverlay、useImageMotion
 * [POS]: effects 模块的背景与媒体运动注册层，为 ProjectVideo 提供可换肤效果
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import Starfield from "../components/starfield";
import BokehCircles from "../components/bokeh-circles";
import LiquidWave from "../components/liquid-wave";
import GradientShift from "../components/gradient-shift";
import MatrixRain from "../components/matrix-rain";
import type { Palette } from "../palette";

/**
 * Background effects. Visuals come from the vendored remotion-templates
 * components (reactvideoeditor.com, free to use); each one is wrapped with a
 * palette-tinted overlay so the design color system stays coherent.
 */
export const BackgroundFX: React.FC<{ effectId?: string; palette: Palette }> = ({ effectId, palette }) => {
  if (!effectId || effectId === "none") {
    return <div style={{ position: "absolute", inset: 0, background: palette.background }} />;
  }
  const body = (() => {
    switch (effectId) {
      case "starfield":
        return <Starfield />;
      case "bokeh":
        return <BokehCircles />;
      case "editorial-lines":
        return <EditorialLines palette={palette} />;
      case "liquid-wave":
        return <LiquidWave />;
      case "gradient-shift":
        return <GradientShift />;
      case "matrix-rain":
        return <MatrixRain />;
      case "noise-grain":
        return <GrainOverlay />;
      default:
        return null;
    }
  })();
  if (body === null) {
    return <div style={{ position: "absolute", inset: 0, background: palette.background }} />;
  }
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>{body}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: palette.background,
          opacity: 0.22,
        }}
      />
    </div>
  );
};

const EditorialLines: React.FC<{ palette: Palette }> = ({ palette }) => {
  const { width, height } = useVideoConfig();
  const rings = [
    { rx: 0.48, ry: 0.7, opacity: 0.1 },
    { rx: 0.55, ry: 0.78, opacity: 0.075 },
    { rx: 0.62, ry: 0.86, opacity: 0.055 },
    { rx: 0.69, ry: 0.94, opacity: 0.04 },
  ];
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {rings.map((ring, index) => (
        <ellipse key={index} cx={width / 2} cy={height / 2} rx={width * ring.rx} ry={height * ring.ry} fill="none" stroke={palette.primary} strokeWidth={2} opacity={ring.opacity} />
      ))}
    </svg>
  );
};

/**
 * Film-grain overlay (thin, transparent). Reuses the deterministic cell-noise
 * technique from the vendored noise-grain template without its baked-in
 * background/text so it can sit on top of any scene.
 */
export const GrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cellSize = 8;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const noise = ((index * 1237 + frame * 7919) % 997) / 997;
      cells.push({ x: col * cellSize, y: row * cellSize, opacity: 0.02 + noise * 0.06, key: index });
    }
  }
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {cells.map((cell) => (
        <rect key={cell.key} x={cell.x} y={cell.y} width={cellSize} height={cellSize} fill="white" opacity={cell.opacity} />
      ))}
    </svg>
  );
};

/**
 * Deterministic slow push-in / pan for scene images (replaces the CSS-keyframe
 * ken-burns template, which is not frame-driven and therefore not renderable).
 */
export const useImageMotion = (kind: "push-in" | "pan-left" = "push-in", durationFrames: number, delay = 0) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - delay);
  if (kind === "pan-left") {
    const scale = interpolate(local, [0, durationFrames], [1.15, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const x = interpolate(local, [0, durationFrames], [0, -3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { transform: `scale(${scale}) translateX(${x}%)` };
  }
  const scale = interpolate(local, [0, durationFrames], [1, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { transform: `scale(${scale})` };
};
