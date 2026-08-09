/**
 * [INPUT]: 依赖设计系统 palette 与 Remotion 帧时钟
 * [OUTPUT]: 对外提供 product-launch 的场景专属动画原语：
 *           霓虹渐变、玻璃浮层、发光 Pill、光环、证据卡、数字卡、CTA 按钮。
 *           每个原语参数化、吃设计系统 palette，是产品发布片的视觉语言。
 * [POS]: scenarios/product-launch 的视觉原语层；beats 只组合这些原语 + shotcraft 组件，
 *        不手写裸 div。原语是场景专属的（产品发布 = 高能、玻璃、发光、证据）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Palette } from "../../palette";

export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
export const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const enter = (frame: number, fps: number, delay = 0, damping = 16, stiffness = 140) =>
  spring({ frame: Math.max(0, frame - delay), fps, config: { damping, mass: 0.8, stiffness } });

export const isDark = (hex: string) => {
  const m = hex.match(/[0-9a-f]{2}/gi);
  if (!m || m.length < 3) return false;
  const [r, g, b] = m.slice(0, 3).map((v) => parseInt(v, 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
};

/** 产品发布 = 玻璃浮层。面板表面：磨砂、半透明、细边框、深投影。 */
export const glassSurface = (p: Palette, opts?: { bordered?: boolean; strong?: boolean }) => {
  const dark = isDark(p.background);
  const bordered = opts?.bordered ?? true;
  const strong = opts?.strong ?? false;
  return {
    background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.55)",
    border: bordered ? (strong ? `2px solid ${p.accent}` : `1px solid ${p.accent}44`) : "none",
    borderRadius: strong ? 10 : 22,
    backdropFilter: "blur(14px)",
    boxShadow: strong
      ? `0 10px 0 ${dark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.18)"}`
      : `0 24px 70px ${dark ? "rgba(0,0,0,0.42)" : "rgba(15,23,42,0.16)"}`,
    color: p.text,
  } as React.CSSProperties;
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <div style={{ fontFamily: MONO, color, fontSize: 22, letterSpacing: "0.24em", fontWeight: 700 }}>{children}</div>
);

export const Ring: React.FC<{ color: string; size: number; left: number; top: number; speed?: number }> = ({ color, size, left, top, speed = 0.22 }) => {
  const frame = useCurrentFrame();
  return <div style={{ position: "absolute", width: size, height: size, left, top, border: `2px solid ${color}`, borderRadius: "50%", transform: `rotate(${frame * speed}deg)`, opacity: 0.16 }} />;
};

export const GlowPill: React.FC<{ children: React.ReactNode; color: string; delay?: number }> = ({ children, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = enter(frame, fps, delay);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, transform: `translateY(${(1 - progress) * 24}px) scale(${0.9 + progress * 0.1})`, opacity: progress, border: `1px solid ${color}55`, borderRadius: 999, padding: "11px 18px", color, fontFamily: MONO, fontSize: 17, background: "rgba(255,255,255,0.05)" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 16px ${color}` }} />
      {children}
    </span>
  );
};

/** 高能霓虹底：产品发布 hero / CTA 用。 */
export const neonField = (accent: string, secondary: string, base: string): React.CSSProperties => ({
  position: "absolute", inset: 0,
  background: `radial-gradient(circle at 17% 25%, ${secondary} 0%, transparent 28%), radial-gradient(circle at 83% 62%, ${accent} 0%, transparent 31%), linear-gradient(120deg, ${base}, ${base} 58%, ${accent}22)`,
});

/** 主张标题：缩放弹出（产品发布 = 结果先行，主张要「砸」出来）。 */
export const ClaimTitle: React.FC<{ children: React.ReactNode; color: string; fontFamily?: string; fontSize?: number; delay?: number; lineHeight?: number }> = ({ children, color, fontFamily, fontSize = 88, delay = 8, lineHeight = 0.98 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = enter(frame, fps, delay, 14);
  return (
    <div style={{ fontSize, lineHeight, fontWeight: 900, letterSpacing: "-0.06em", color, fontFamily, transform: `scale(${0.84 + reveal * 0.16})`, transformOrigin: "left", opacity: reveal }}>
      {children}
    </div>
  );
};

/** 玻璃证据卡：产品截图/占位浮在玻璃面板上，带推近运镜。 */
export const EvidenceCard: React.FC<{ p: Palette; children: React.ReactNode; width?: number | string; delay?: number }> = ({ p, children, width, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = enter(frame, fps, delay, 15);
  return (
    <div style={{ width, padding: 14, borderRadius: 22, ...glassSurface(p), transform: `translateY(${(1 - progress) * 60}px) rotate(${(1 - progress) * -3}deg)`, opacity: progress }}>
      {children}
    </div>
  );
};

/** 要点列表：发光项目符号 + 错峰滑入（功能证据）。 */
export const PointList: React.FC<{ points: string[]; accent: string; text: string; fontFamily?: string; fontSize?: number }> = ({ points, accent, text, fontFamily, fontSize = 24 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {points.map((point, i) => {
        const d = 12 + i * 6;
        const o = interpolate(frame, [d, d + 12], [0, 1], clamp);
        const x = interpolate(frame, [d, d + 12], [-20, 0], clamp);
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, opacity: o, transform: `translateX(${x}px)` }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: accent, marginTop: 7, flexShrink: 0, boxShadow: `0 0 12px ${accent}` }} />
            <span style={{ color: text, fontSize, fontWeight: 400, fontFamily }}>{point}</span>
          </div>
        );
      })}
    </div>
  );
};

/** 强调细线：accent → primary 渐变延展。 */
export const AccentRule: React.FC<{ accent: string; primary: string; frame: number; from?: number; to?: number; max?: number; height?: number }> = ({ accent, primary, frame, from = 16, to = 46, max = 140, height = 5 }) => (
  <div style={{ width: Math.round(interpolate(frame, [from, to], [0, max], clamp)), height, borderRadius: 3, background: `linear-gradient(90deg, ${accent}, ${primary})`, marginTop: 26 }} />
);

/** 发光 CTA 按钮。 */
export const CtaButton: React.FC<{ label: string; accent: string; background: string }> = ({ label, accent, background }) => (
  <div style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 12, background: accent, color: background, padding: "18px 44px", borderRadius: 999, fontFamily: MONO, fontSize: 21, fontWeight: 700, letterSpacing: "0.14em", boxShadow: `0 0 60px ${accent}66` }}>
    {label}
  </div>
);

/** 数字翻牌（数据 beat）：DigitRoll + 单位 + 标签，由 beat 组合。 */
export { Easing };
