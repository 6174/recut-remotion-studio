/**
 * [INPUT]: 依赖 Remotion 帧时钟、视频尺寸与 faceless-explainer 的渐变科技新闻 palette
 * [OUTPUT]: 对外提供科技新闻解读的确定性视觉原语：网格纸、marker 色块、手绘箭头、卡通眼睛、
 *           大字号标题、渐变文字、步骤和数据条。
 * [POS]: scenarios/faceless-explainer 的视觉源语层。beats 只组合本文件原语，不重造风格细节；
 *        主信息遵守 1080p ≥56px，场景内必要辅助信息 ≥44px；冻结兼容组件例外。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Palette } from "../../palette";

export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
export const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/** 场景专属背景：暖白纸面上叠加青绿光晕与冷蓝边缘，避免大色块变成平面。 */
export const sceneBackground = (p: Palette) =>
  `radial-gradient(circle at 13% 18%, ${p.accent}32 0%, transparent 30%), radial-gradient(circle at 88% 82%, #64d7ff26 0%, transparent 34%), linear-gradient(135deg, ${p.background} 0%, #f7fff0 48%, #edf9ff 100%)`;

/** 主标题渐变：黑色负责轮廓，青绿负责把文字推成视觉主角。 */
export const gradientTextStyle = (gradient = "linear-gradient(110deg, #0b1110 0%, #17251e 48%, #159d75 100%)"): React.CSSProperties => ({
  backgroundImage: gradient,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

export const enter = (frame: number, fps: number, delay = 0, damping = 16, stiffness = 140) =>
  spring({ frame: Math.max(0, frame - delay), fps, config: { damping, mass: 0.8, stiffness } });

/** 冻结 workspace 的旧 beat 仍会用到：保留这个纯函数，避免升级时把旧项目打断。 */
export const isDark = (hex: string) => {
  const channels = hex.match(/[0-9a-f]{2}/gi);
  if (!channels || channels.length < 3) return false;
  const [r, g, b] = channels.slice(0, 3).map((value) => parseInt(value, 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
};

/** 网格纸：参考图的秩序底，不承载任何阅读信息。 */
export const Grid: React.FC<{ color: string; opacity?: number; size?: number }> = ({ color, opacity = 0.08, size = 38 }) => (
  <div style={{ position: "absolute", inset: 0, opacity, backgroundImage: `radial-gradient(circle at 20% 16%, #55f43628 0%, transparent 28%), radial-gradient(circle at 82% 84%, #64d7ff22 0%, transparent 32%), linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`, backgroundSize: `100% 100%, 100% 100%, ${size}px ${size}px, ${size}px ${size}px` }} />
);

/** 荧光笔不规则色块：用 SVG 而不是随机路径，确保预览与导出逐帧一致。 */
export const MarkerBlob: React.FC<{ color: string; style?: React.CSSProperties; opacity?: number }> = ({ color, style, opacity = 1 }) => (
  <svg viewBox="0 0 1000 640" preserveAspectRatio="none" style={{ position: "absolute", overflow: "visible", ...style }}>
    <defs>
      <linearGradient id="faceless-marker-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c7ff70" />
        <stop offset="45%" stopColor={color} />
        <stop offset="78%" stopColor="#45e1a1" />
        <stop offset="100%" stopColor="#66d9ff" />
      </linearGradient>
    </defs>
    <path d="M69 111C172 10 330 33 467 59c150 28 344-29 435 87 80 101 89 307-19 398-98 83-292 50-427 73-136 22-342 43-404-73-61-115-72-325 17-433Z" fill="url(#faceless-marker-gradient)" opacity={opacity} />
  </svg>
);

/** 夸张眼睛：只承担情绪，不以小字假装信息。 */
export const DoodleEyes: React.FC<{ style?: React.CSSProperties; pupilOffset?: number }> = ({ style, pupilOffset = 0 }) => (
  <svg viewBox="0 0 320 180" style={{ position: "absolute", overflow: "visible", ...style }}>
    <path d="M35 103C35 49 70 18 111 26c39 8 58 50 43 99-14 44-45 57-76 42-28-13-43-34-43-64Z" fill="#fff" stroke="#111" strokeWidth="8" />
    <path d="M166 94c3-55 42-85 83-73 39 12 53 58 30 103-21 41-55 50-83 30-24-17-32-38-30-60Z" fill="#fff" stroke="#111" strokeWidth="8" />
    <ellipse cx={105 + pupilOffset} cy="79" rx="26" ry="37" fill="#111" transform={`rotate(20 ${105 + pupilOffset} 79)`} />
    <ellipse cx={231 + pupilOffset} cy="74" rx="27" ry="38" fill="#111" transform={`rotate(20 ${231 + pupilOffset} 74)`} />
    <path d="M64 27c22-20 49-19 67 0" fill="none" stroke="#111" strokeWidth="9" strokeLinecap="round" />
    <path d="M196 22c22-20 49-19 67 0" fill="none" stroke="#111" strokeWidth="9" strokeLinecap="round" />
    <path d="M147 143c17 2 30 10 39 24" fill="none" stroke="#111" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

/** 手绘曲线箭头：用来把眼线从标题带向结论。 */
export const DoodleArrow: React.FC<{ color: string; style?: React.CSSProperties; flip?: boolean }> = ({ color, style, flip = false }) => (
  <svg viewBox="0 0 780 250" preserveAspectRatio="none" style={{ position: "absolute", overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
    <path d="M20 198C196 220 267 113 399 157c94 31 148 53 284-61" fill="none" stroke={color} strokeWidth="29" strokeLinecap="round" />
    <path d="m628 67 69 33-27 76" fill="none" stroke={color} strokeWidth="29" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

/** 黑底荧光标签：最小 32px，标签也应能被读到。 */
export const MarkerChip: React.FC<{ children: React.ReactNode; color: string; dark?: boolean; style?: React.CSSProperties }> = ({ children, color, dark = true, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", padding: "12px 20px", borderRadius: 999, background: dark ? "#111" : color, color: dark ? color : "#111", fontSize: 32, lineHeight: 1, letterSpacing: "-0.03em", fontWeight: 900, fontFamily: "'Arial Black', 'PingFang SC', 'Noto Sans SC', sans-serif", ...style }}>
    {children}
  </div>
);

/** 画面标题：第一眼就读到的唯一主张。 */
export const DiagramTitle: React.FC<{ children: React.ReactNode; color: string; fontFamily?: string; fontSize?: number; delay?: number; lineHeight?: number; gradient?: string }> = ({ children, color, fontFamily, fontSize = 112, delay = 8, lineHeight = 0.94, gradient }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = enter(frame, fps, delay, 15);
  return (
    <div style={{ fontSize, lineHeight, fontWeight: 950, letterSpacing: "-0.08em", color, fontFamily, ...(gradient ? gradientTextStyle(gradient) : {}), transform: `translateY(${(1 - reveal) * 48}px)`, opacity: reveal }}>
      {children}
    </div>
  );
};

/** 兼容旧模板的强调线；新科技新闻模板优先使用 DoodleArrow。 */
export const AccentRule: React.FC<{ accent: string; primary: string; frame: number; from?: number; to?: number; max?: number; height?: number }> = ({ accent, primary, frame, from = 18, to = 54, max = 220, height = 10 }) => (
  <div style={{ width: Math.round(interpolate(frame, [from, to], [0, max], clamp)), height, borderRadius: 999, background: `linear-gradient(90deg, ${accent}, ${primary})`, marginTop: 28 }} />
);

/** 兼容旧模板的概念标签；同样遵循标签字号 ≥32px。 */
export const ConceptPills: React.FC<{ items: string[]; accent: string; text: string; background: string; fontFamily?: string }> = ({ items, accent, text, background, fontFamily }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
      {items.map((item, index) => {
        const delay = 18 + index * 8;
        const opacity = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
        return <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 22px", border: `3px solid ${accent}`, borderRadius: 999, background, color: text, fontSize: 32, fontWeight: 900, fontFamily, opacity }}><span style={{ width: 14, height: 14, borderRadius: "50%", background: accent }} />{item}</span>;
      })}
    </div>
  );
};

/** 兼容旧模板的代码窗；旧项目仍可预览，但不再以不可读的小字承载内容。 */
export const CodeWindow: React.FC<{ lines: { text: string; accent?: string }[]; borderColor: string; accent?: string }> = ({ lines, borderColor, accent = "#55f436" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = enter(frame, fps, 24);
  return (
    <div style={{ padding: "34px 38px", border: `5px solid ${borderColor}`, borderRadius: 28, background: "#111", boxShadow: "16px 18px 0 rgba(17,17,17,0.2)", transform: `translateY(${(1 - progress) * 60}px) rotate(${(1 - progress) * -3}deg)`, opacity: progress }}>
      {lines.map((line, index) => {
        const reveal = enter(frame, fps, 30 + index * 12, 18);
        return <div key={index} style={{ overflow: "hidden", whiteSpace: "pre", fontFamily: MONO, fontSize: 34, lineHeight: 1.5, color: "#fffdf7", clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}><span style={{ color: line.accent || accent }}>› </span>{line.text}</div>;
      })}
    </div>
  );
};

/** 大字号步骤：每个步骤是可以在手机上读完的一条新闻判断。 */
export const StepList: React.FC<{ steps: string[]; accent: string; text: string; fontFamily?: string; fontSize?: number }> = ({ steps, accent, text, fontFamily, fontSize = 48 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {steps.map((step, i) => {
        const d = 14 + i * 7;
        const opacity = interpolate(frame, [d, d + 14], [0, 1], clamp);
        const y = interpolate(frame, [d, d + 14], [28, 0], clamp);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity, transform: `translateY(${y}px)` }}>
            <span style={{ width: 62, height: 62, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: "50%", background: "#111", color: accent, fontSize: 32, fontWeight: 900, fontFamily: MONO }}>{i + 1}</span>
            <span style={{ color: text, fontSize, lineHeight: 1.15, fontWeight: 900, fontFamily }}>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

/** 数据条：数据标签与百分比均保持大字号；只接收上游确认过的数据。 */
export const DataBars: React.FC<{ rows: { label: string; value: number; color: string }[]; track: string; startFrame?: number }> = ({ rows, track, startFrame = 30 }) => {
  const frame = useCurrentFrame();
  return (
    <div>
      {rows.map((row, index) => {
        const progress = interpolate(frame, [startFrame + index * 14, startFrame + 50 + index * 14], [0, row.value], clamp);
        return (
          <div key={row.label} style={{ marginTop: index === 0 ? 0 : 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 12, fontSize: 44, lineHeight: 1, fontWeight: 900 }}><span>{row.label}</span><span style={{ color: row.color }}>{Math.round(row.value * 100)}%</span></div>
            <div style={{ height: 20, borderRadius: 99, background: track, overflow: "hidden" }}><div style={{ height: "100%", width: `${progress * 100}%`, borderRadius: 99, background: row.color }} /></div>
          </div>
        );
      })}
    </div>
  );
};

/** 新闻便签：白纸、黑字、绿色边缘，作为例子与回看的可读容器。 */
export const PaperCard: React.FC<{ p: Palette; children: React.ReactNode; width?: number | string; delay?: number; rotation?: number; style?: React.CSSProperties }> = ({ p, children, width, delay = 0, rotation = -1, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = enter(frame, fps, delay, 15);
  return (
    <div style={{ width, padding: "38px 40px", border: "7px solid #111", borderRadius: 28, background: "linear-gradient(135deg, #fffdf7 0%, #f2ffec 64%, #ecfaff 100%)", boxShadow: `16px 18px 0 ${p.accent}`, transform: `translateY(${(1 - progress) * 60}px) rotate(${rotation}deg)`, opacity: progress, ...style }}>
      {children}
    </div>
  );
};

/** 结论进度条：只作为动势，不承载需要阅读的小字。 */
export const GlowProgress: React.FC<{ color: string; width?: number; delay?: number }> = ({ color, width = 520, delay = 20 }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [delay, delay + 50], [0, 1], { ...clamp, easing: Easing.bezier(0.25, 0.8, 0.25, 1) });
  return (
    <div style={{ width, height: 26, borderRadius: 99, border: "5px solid #111", background: "#fffdf7", marginTop: 44, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${bar * 100}%`, background: `linear-gradient(90deg, ${color}, #45e1a1, #66d9ff)` }} />
    </div>
  );
};
