/**
 * [INPUT]: 依赖 React 的 CSSProperties 与 ReactNode
 * [OUTPUT]: 对外提供纸张画布、镜头题头、主标题、正文与确定性入场辅助函数
 * [POS]: composition-graph/shots 的视觉原子层；scene component 复用它们但各自拥有构图与叙事
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CSSProperties, ReactNode } from "react";

export const BASE: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: 1920,
  height: 1080,
  color: "#171310",
  background: "#f2eadc",
  fontFamily: '"Kaiti SC", "STKaiti", "Marker Felt", cursive',
};

export const reveal = (progress: number, start: number, duration = 0.16) =>
  Math.min(1, Math.max(0, (progress - start) / duration));

export const rise = (value: number, distance = 40): CSSProperties => ({
  opacity: value,
  transform: `translateY(${Math.round((1 - value) * distance)}px)`,
});

export const Shell: React.FC<{
  label: string;
  progress: number;
  children: ReactNode;
}> = ({ label, progress, children }) => (
  <div style={BASE}>
    <i
      data-capture-sentinel="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        background: "#77f5ba",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.33,
        backgroundImage:
          "radial-gradient(rgba(23,19,16,.21) .7px, transparent .9px)",
        backgroundSize: "7px 7px",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 128,
        right: -120,
        width: 640,
        height: 78,
        transform: "rotate(-7deg)",
        background: "#ff6414",
        opacity: 0.17,
      }}
    />
    <header
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        padding: "72px 106px",
        color: "#171310",
        opacity: reveal(progress, 0.04),
        font: '700 22px "Marker Felt", "Kaiti SC", cursive',
        letterSpacing: ".08em",
      }}
    >
      <span>{label}</span>
      <span>RECUT / REMOTION</span>
    </header>
    {children}
  </div>
);

export const Headline: React.FC<{
  children: ReactNode;
  progress: number;
  start?: number;
  width?: number;
}> = ({ children, progress, start = 0.14, width = 1120 }) => (
  <h1
    style={{
      position: "absolute",
      left: 106,
      top: 236,
      width,
      margin: 0,
      fontSize: 132,
      fontWeight: 900,
      lineHeight: 0.9,
      letterSpacing: 0,
      fontFamily:
        '"Arial Black", "Hiragino Sans GB", "PingFang SC", sans-serif',
      ...rise(reveal(progress, start), 52),
    }}
  >
    {children}
  </h1>
);

export const Detail: React.FC<{
  children: ReactNode;
  progress: number;
  start?: number;
  left?: number;
  top?: number;
  width?: number;
}> = ({
  children,
  progress,
  start = 0.62,
  left = 108,
  top = 610,
  width = 720,
}) => (
  <p
    style={{
      position: "absolute",
      left,
      top,
      width,
      margin: 0,
      color: "#3b3028",
      fontSize: 36,
      lineHeight: 1.28,
      fontFamily: '"Kaiti SC", "STKaiti", "Marker Felt", cursive',
      ...rise(reveal(progress, start), 28),
    }}
  >
    {children}
  </p>
);
