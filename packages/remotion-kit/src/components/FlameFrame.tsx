/**
 * [INPUT]: 依赖 React 子节点与 Remotion 的 frame/videoConfig 动画时间
 * [OUTPUT]: 对外提供 FlameFrame：包裹任意内容的居中火焰框组件与 FlameFrameProps
 * [POS]: components 的内容容器特效；以真实 box 尺寸为单一事实源，替代需要猜测纹理坐标的 Flame Wrap 后处理
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface FlameFrameProps {
  /** 被火焰包裹的实际内容；未传时渲染一个可直接预览的标题卡片。 */
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  width?: number | string;
  minHeight?: number;
  padding?: number | string;
  color?: string;
  intensity?: number;
  style?: CSSProperties;
}

const EMBERS = [
  [8, 21, 0.2], [17, 10, 1.1], [29, 17, 2.3], [42, 8, 0.8],
  [57, 15, 1.8], [69, 6, 2.9], [82, 19, 0.5], [92, 12, 2.1],
];

/**
 * 内容与装饰共享同一个 relative box：SVG 用 inset 扩张到 box 外侧，因此宽高、换行和任意 children
 * 都会自然带动火焰边界，无需读取布局或向 effectOptions 写坐标。
 */
export const FlameFrame: React.FC<FlameFrameProps> = ({
  children,
  title = "FLAME FRAME",
  subtitle = "CONTENT LOCKED IN THE HEAT",
  width = "min(80vw, 920px)",
  minHeight = 260,
  padding = "54px 72px",
  color = "#ff5a16",
  intensity = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const arrival = spring({ frame, fps, config: { damping: 15, mass: 0.76, stiffness: 132 } });
  const rise = interpolate(arrival, [0, 1], [20, 0]);
  const scale = interpolate(arrival, [0, 1], [0.94, 1]);
  const flicker = 0.8 + 0.2 * Math.sin(time * 9.7) + 0.08 * Math.sin(time * 16.1 + 1.6);
  const flameOpacity = Math.max(0.46, Math.min(1, flicker * intensity));
  const flames = Array.from({ length: 17 }, (_, index) => ({
    height: 24 + 31 * (0.5 + 0.5 * Math.sin(time * 5.1 + index * 1.67)),
    lean: Math.sin(time * 3.8 + index * 2.27) * 13,
    left: 6 + index * 5.45,
    width: 13 + (index % 3) * 3,
  }));
  const defaultContent = (
    <div style={{ display: "grid", gap: 16, textAlign: "center" }}>
      <span style={{ color: "#ffcf71", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.28em" }}>SIGNAL / 01</span>
      <strong style={{ color: "#fff5df", fontFamily: "system-ui, sans-serif", fontSize: "clamp(34px, 6vw, 76px)", letterSpacing: "-0.055em", lineHeight: 0.92 }}>{title}</strong>
      <span style={{ color: "rgba(255, 219, 168, 0.68)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, letterSpacing: "0.17em" }}>{subtitle}</span>
    </div>
  );

  return (
    <div style={{ width: "100%", minHeight: "100%", display: "grid", placeItems: "center", padding: 44, boxSizing: "border-box" }}>
      <div
        style={{
          position: "relative",
          boxSizing: "border-box",
          width,
          minHeight,
          padding,
          overflow: "visible",
          isolation: "isolate",
          border: `1px solid ${color}`,
          background: "linear-gradient(145deg, rgba(40, 12, 4, 0.94), rgba(12, 8, 7, 0.96) 68%, rgba(47, 13, 3, 0.9))",
          boxShadow: `0 0 ${22 + flicker * 10}px rgba(255, 69, 6, ${0.22 * intensity}), inset 0 0 42px rgba(255, 73, 12, 0.11)`,
          opacity: arrival,
          transform: `translateY(${rise}px) scale(${scale})`,
          ...style,
        }}
      >
        <svg aria-hidden="true" preserveAspectRatio="none" style={{ position: "absolute", inset: "-34px -25px -27px", width: "calc(100% + 50px)", height: "calc(100% + 61px)", overflow: "visible", pointerEvents: "none", zIndex: 2 }} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="flame-frame-outer" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff4bf" /><stop offset="0.28" stopColor="#ffbd31" /><stop offset="0.65" stopColor={color} /><stop offset="1" stopColor="#b91c09" stopOpacity="0.45" /></linearGradient>
            <linearGradient id="flame-frame-inner" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff9df" /><stop offset="0.42" stopColor="#ffdc65" /><stop offset="1" stopColor="#ff6b12" stopOpacity="0.35" /></linearGradient>
            <filter id="flame-frame-glow" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="1.15" /></filter>
          </defs>
          <rect x="5.5" y="11" width="89" height="82" fill="none" opacity={0.42 * flameOpacity} rx="1.4" stroke={color} strokeWidth="0.72" />
          <path d="M 5.5 12 H 94.5" fill="none" filter="url(#flame-frame-glow)" opacity={flameOpacity} stroke={color} strokeWidth="3.8" />
          <path d="M 5.5 12 H 94.5" fill="none" opacity={flameOpacity} stroke="url(#flame-frame-outer)" strokeWidth="1.25" />
          <path d="M 5.5 12 C 4.1 34, 6.8 63, 5.5 92" fill="none" opacity={flameOpacity * 0.62} stroke={color} strokeWidth="1.1" />
          <path d="M 94.5 12 C 96.3 38, 93.2 61, 94.5 92" fill="none" opacity={flameOpacity * 0.62} stroke={color} strokeWidth="1.1" />
          <path d="M 5.5 92 C 29 94.2, 70 89.8, 94.5 92" fill="none" opacity={flameOpacity * 0.62} stroke={color} strokeWidth="1.1" />
        </svg>
        {flames.map((flame, index) => (
          <span key={index} style={{ position: "absolute", bottom: "calc(100% - 7px)", left: `${flame.left}%`, width: flame.width, height: flame.height * intensity, opacity: flameOpacity * (0.7 + (index % 4) * 0.07), pointerEvents: "none", transform: `translateX(-50%) rotate(${flame.lean}deg)`, transformOrigin: "50% 100%", clipPath: "polygon(50% 0%, 69% 29%, 97% 71%, 84% 100%, 16% 100%, 3% 71%, 31% 29%)", borderRadius: "52% 48% 26% 26%", background: `linear-gradient(to top, ${color} 0%, #ff9c19 40%, #ffe980 68%, rgba(255, 250, 202, 0) 100%)`, boxShadow: `0 0 ${8 + flame.height * 0.26}px rgba(255, 82, 9, 0.78)`, zIndex: 3 }} />
        ))}
        {EMBERS.map(([left, top, phase], index) => {
          const lift = (time * 15 + phase * 9) % 18;
          const wobble = Math.sin(time * 4.4 + phase * 3.2) * 4;
          const emberOpacity = Math.max(0, 0.72 - lift / 25) * flameOpacity;
          return <span key={index} style={{ position: "absolute", left: `${left}%`, top: `${top - lift}%`, width: 3 + (index % 3), height: 3 + (index % 3), borderRadius: "50%", background: index % 2 ? "#ffbf3f" : "#fff0ae", boxShadow: "0 0 8px #ff650d", opacity: emberOpacity, pointerEvents: "none", transform: `translateX(${wobble}px)`, zIndex: 3 }} />;
        })}
        <div style={{ position: "relative", zIndex: 1 }}>{children ?? defaultContent}</div>
      </div>
    </div>
  );
};
