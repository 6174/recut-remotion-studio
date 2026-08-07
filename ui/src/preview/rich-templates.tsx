/**
 * [INPUT]: 依赖 Remotion 帧时钟与 remotion-kit 的 DigitRoll、VerticalTicker 动态组件
 * [OUTPUT]: 对外提供 RichTemplateDemo（十四套可循环播放的完整视觉模板演示）
 * [POS]: remotion-studio/ui 预览层的模板样片；把 catalog 中的风格契约转为可观看的叙事片段
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DigitRoll, VerticalTicker } from "@recut/remotion-kit";
import { HyperframesInspiredDemo, hyperframesInspiredIds } from "./hyperframes-inspired";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "Inter, 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const enter = (frame: number, fps: number, delay = 0, damping = 16) =>
  spring({ frame: Math.max(0, frame - delay), fps, config: { damping, mass: 0.8, stiffness: 140 } });

const Eyebrow: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <div style={{ fontFamily: MONO, color, fontSize: 22, letterSpacing: "0.24em", fontWeight: 700 }}>{children}</div>
);

const Grid: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 0.14 }) => (
  <div style={{ position: "absolute", inset: 0, opacity, backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`, backgroundSize: "72px 72px" }} />
);

const Pill: React.FC<{ children: React.ReactNode; color: string; delay?: number }> = ({ children, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = enter(frame, fps, delay);
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 10, transform: `translateY(${(1 - progress) * 24}px) scale(${0.9 + progress * 0.1})`, opacity: progress, border: `1px solid ${color}55`, borderRadius: 999, padding: "11px 18px", color, fontFamily: MONO, fontSize: 17, background: "rgba(255,255,255,0.05)" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 16px ${color}` }} />{children}</span>;
};

const CodeLine: React.FC<{ children: React.ReactNode; delay: number; accent?: string }> = ({ children, delay, accent = "#8be9fd" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = enter(frame, fps, delay, 18);
  return <div style={{ overflow: "hidden", whiteSpace: "pre", fontFamily: MONO, fontSize: 25, lineHeight: 1.65, color: "#dce7ff", clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}><span style={{ color: accent }}>› </span>{children}</div>;
};

const RemotionExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = enter(frame, fps, 8, 15);
  const code = enter(frame, fps, 32);
  const player = enter(frame, fps, 62);
  const bar = interpolate(frame, [76, 142], [0, 1], { ...clamp, easing: Easing.bezier(0.25, 0.8, 0.25, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "radial-gradient(circle at 72% 18%, #274a9b 0%, #0d1530 32%, #050811 72%)", color: "#f7f9ff", fontFamily: SANS }}>
      <Grid color="#83a4ff" opacity={0.1} />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", background: "#4f7cff", filter: "blur(150px)", opacity: 0.2, top: -250, right: -100 }} />
      <div style={{ position: "absolute", top: 88, left: 112, right: 112, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow color="#a9c2ff">REMOTION / EXPLAINER</Eyebrow><Pill color="#78a4ff" delay={16}>React 驱动</Pill>
      </div>
      <div style={{ position: "absolute", top: 184, left: 112, transform: `translateY(${(1 - title) * 48}px)`, opacity: title }}>
        <div style={{ fontSize: 88, lineHeight: 0.98, fontWeight: 900, letterSpacing: "-0.06em" }}>Remotion<br /><span style={{ color: "#8eb1ff" }}>是什么？</span></div>
        <p style={{ margin: "28px 0 0", fontSize: 27, lineHeight: 1.45, color: "#b9c6e5" }}>用 React 组件、时间轴和数据<br />构建每一帧可控的视频。</p>
      </div>
      <div style={{ position: "absolute", left: 112, bottom: 110, width: 720, padding: "34px 38px", borderRadius: 28, background: "rgba(6,12,28,0.76)", border: "1px solid rgba(158,184,255,0.26)", boxShadow: "0 30px 80px rgba(0,0,0,.38)", transform: `translateY(${(1 - code) * 60}px) rotate(${(1 - code) * -3}deg)`, opacity: code }}>
        <CodeLine delay={36}><span style={{ color: "#ff8aa8" }}>const</span> Video = () ={">"}</CodeLine>
        <CodeLine delay={48}><span style={{ color: "#ff8aa8" }}>  return</span> &lt;Composition /&gt;</CodeLine>
        <CodeLine delay={60} accent="#a7f3d0">renderMedia(Video)</CodeLine>
      </div>
      <div style={{ position: "absolute", right: 118, bottom: 112, width: 670, height: 408, borderRadius: 32, background: "linear-gradient(135deg, #b2c9ff, #5678e9 46%, #192b70)", padding: 16, boxShadow: "0 34px 86px rgba(0,0,0,.45)", transform: `translateY(${(1 - player) * 100}px) rotate(${(1 - player) * 5}deg)`, opacity: player }}>
        <div style={{ height: "100%", borderRadius: 22, overflow: "hidden", background: "#101a3e", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 35%, #8eb1ff 0%, #4465d6 26%, #12235d 68%)" }} />
          <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", fontSize: 46, fontWeight: 900, letterSpacing: "-0.05em" }}>代码，正在变成视频</div>
          <div style={{ position: "absolute", left: 38, right: 38, bottom: 32, height: 8, borderRadius: 99, background: "rgba(255,255,255,.25)" }}><div style={{ height: "100%", width: `${bar * 100}%`, borderRadius: 99, background: "#fff", boxShadow: "0 0 20px #fff" }} /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProductLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = enter(frame, fps, 12, 14);
  const cards = ["组件化", "逐帧确定", "本地渲染"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#10002c", color: "#fff", fontFamily: SANS }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 17% 25%, #ff3eb5 0%, transparent 28%), radial-gradient(circle at 83% 62%, #00d6ff 0%, transparent 31%), linear-gradient(120deg, #19004a, #10002c 58%, #001c45)" }} />
      <div style={{ position: "absolute", width: 1250, height: 1250, left: 330, top: -340, border: "2px solid rgba(255,255,255,.16)", borderRadius: "50%", transform: `rotate(${frame * 0.22}deg)` }} />
      <div style={{ position: "absolute", top: 90, left: 112 }}><Eyebrow color="#8af4ff">PRODUCT / MOTION SYSTEM</Eyebrow></div>
      <div style={{ position: "absolute", top: 204, left: 112, transform: `scale(${0.84 + reveal * 0.16})`, transformOrigin: "left", opacity: reveal }}>
        <div style={{ fontSize: 82, lineHeight: 0.98, fontWeight: 900, letterSpacing: "-0.065em" }}>一个组件<br /><span style={{ color: "#7eeaff" }}>一支成片</span></div>
        <p style={{ fontSize: 25, color: "#ddd0ff", marginTop: 26 }}>不用剪时间轴。把时间写进代码。</p>
      </div>
      <div style={{ position: "absolute", right: 104, top: 150, width: 750, height: 610 }}>
        {cards.map((name, index) => {
          const progress = enter(frame, fps, 42 + index * 14);
          const y = index * 144;
          return <div key={name} style={{ position: "absolute", left: index % 2 ? 80 : 0, top: y, width: 570, padding: "31px 36px", borderRadius: 26, background: "rgba(23,15,65,.7)", border: "1px solid rgba(255,255,255,.24)", backdropFilter: "blur(12px)", display: "flex", justifyContent: "space-between", alignItems: "center", transform: `translateX(${(1 - progress) * 180}px) rotate(${(1 - progress) * 7}deg)`, opacity: progress }}><span style={{ fontSize: 36, fontWeight: 800 }}>{name}</span><span style={{ fontSize: 32, color: index === 1 ? "#ff8ace" : "#8af4ff" }}>0{index + 1}</span></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 112, bottom: 100, display: "flex", gap: 14 }}><Pill color="#ff8ace" delay={78}>React</Pill><Pill color="#8af4ff" delay={88}>Timeline</Pill><Pill color="#cbb8ff" delay={98}>MP4</Pill></div>
    </AbsoluteFill>
  );
};

const DataBriefing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [{ label: "脚本", value: 0.34, color: "#6377ff" }, { label: "组件", value: 0.62, color: "#8b5cf6" }, { label: "渲染", value: 0.9, color: "#f43f8c" }];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#f5f4ff", color: "#171634", fontFamily: SANS }}>
      <div style={{ position: "absolute", width: 760, height: 760, background: "#d5d1ff", filter: "blur(110px)", borderRadius: "50%", top: -330, left: -180 }} />
      <Grid color="#4d4ba1" opacity={0.08} />
      <div style={{ position: "absolute", top: 88, left: 112, right: 112, display: "flex", justifyContent: "space-between" }}><Eyebrow color="#5c58cb">DATA / EXPLAINED</Eyebrow><span style={{ fontFamily: MONO, fontSize: 18, color: "#66638e" }}>01—03</span></div>
      <div style={{ position: "absolute", left: 112, top: 204, fontSize: 76, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1.02 }}>从想法到成片<br /><span style={{ color: "#5d5ad1" }}>是一条数据链</span></div>
      <div style={{ position: "absolute", left: 112, bottom: 106, width: 760, padding: "35px 38px", background: "rgba(255,255,255,.7)", border: "1px solid rgba(77,75,161,.16)", borderRadius: 30, boxShadow: "0 28px 64px rgba(67,58,148,.12)" }}>
        <div style={{ fontFamily: MONO, fontSize: 18, color: "#69668e", letterSpacing: ".16em" }}>COMPONENTS / FRAME</div>
        <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 93, fontWeight: 800, color: "#292567" }}><DigitRoll color="#292567" delay={24} fontSize={93} value="000120" /><span style={{ fontSize: 28, marginLeft: 12 }}>frames</span></div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 260, width: 710, padding: "42px", background: "#171634", borderRadius: 32, color: "#fff", boxShadow: "0 30px 78px rgba(36,30,92,.25)" }}>
        {rows.map((row, index) => {
          const progress = interpolate(frame, [48 + index * 16, 98 + index * 16], [0, row.value], clamp);
          return <div key={row.label} style={{ marginBottom: index === rows.length - 1 ? 0 : 36 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 22, fontWeight: 700 }}><span>{row.label}</span><span style={{ color: row.color }}>{Math.round(row.value * 100)}%</span></div><div style={{ height: 18, borderRadius: 99, background: "#30305f", overflow: "hidden" }}><div style={{ height: "100%", width: `${progress * 100}%`, borderRadius: 99, background: row.color }} /></div></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const CreatorCollage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const notes = ["脚本", "镜头", "动效", "成片"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#f2eddf", color: "#1e1a16", fontFamily: "Georgia, 'Songti SC', serif" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.4, backgroundImage: "radial-gradient(#8e806d 0.8px, transparent 0.8px)", backgroundSize: "8px 8px" }} />
      <div style={{ position: "absolute", top: 84, left: 112 }}><Eyebrow color="#b4502b">CREATOR / COLLAGE</Eyebrow></div>
      <div style={{ position: "absolute", left: 112, top: 204, fontSize: 80, lineHeight: .98, letterSpacing: "-0.065em", fontWeight: 700 }}>把想法<br />贴成<span style={{ color: "#b4502b" }}>一支片</span></div>
      <div style={{ position: "absolute", right: 60, top: 56, width: 900, height: 920, transform: `rotate(${interpolate(frame, [0, 150], [-1.5, 1.5], clamp)}deg)` }}>
        {notes.map((note, index) => {
          const progress = enter(frame, fps, 22 + index * 15, 17);
          const positions = [{ x: 70, y: 80, color: "#f8c95f" }, { x: 420, y: 15, color: "#e7846c" }, { x: 255, y: 356, color: "#a8d7c3" }, { x: 600, y: 425, color: "#99b9dc" }];
          const position = positions[index];
          return <div key={note} style={{ position: "absolute", left: position.x, top: position.y, width: 310, height: 205, padding: 28, background: position.color, boxShadow: "12px 16px 0 rgba(39,28,19,.16)", transform: `translateY(${(1 - progress) * 130}px) rotate(${[-6, 5, -4, 8][index]}deg) scale(${0.82 + progress * .18})`, opacity: progress }}><div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: ".18em", opacity: .58 }}>0{index + 1}</div><div style={{ marginTop: 48, fontSize: 42, fontWeight: 700 }}>{note}</div></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 112, bottom: 100, fontFamily: SANS, fontSize: 23, maxWidth: 610, lineHeight: 1.5 }}>用镜头、文字和节奏，把抽象的观点做成可观看的叙事。</div>
    </AbsoluteFill>
  );
};

const TickerLab: React.FC = () => {
  const cards = (label: string, color: string) => Array.from({ length: 4 }, (_, index) => <div key={index} style={{ borderRadius: 18, padding: "22px", color: "#070b19", background: color, fontSize: 27, fontWeight: 900 }}>{label}</div>);
  return <AbsoluteFill style={{ background: "#071021", color: "#fff", overflow: "hidden", fontFamily: SANS }}><VerticalTicker backgroundColor="#071021" columnWidth={350} columns={[{ items: cards("REACT", "#8be9fd"), durationInSeconds: 3.5, direction: -1 }, { items: cards("FRAME", "#a78bfa"), durationInSeconds: 4.3, direction: 1 }, { items: cards("VIDEO", "#f8b4d9"), durationInSeconds: 3.8, direction: -1 }]} gap={24} maskHeight={180} scale={1.15} tiltDeg={16} /><div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", pointerEvents: "none" }}><div style={{ padding: "34px 52px", borderRadius: 30, background: "rgba(7,16,33,.84)", border: "1px solid rgba(255,255,255,.22)", backdropFilter: "blur(12px)" }}><Eyebrow color="#8be9fd">LIVE MOTION</Eyebrow><div style={{ marginTop: 16, fontSize: 72, fontWeight: 900, letterSpacing: "-.06em" }}>每一帧<br />都可编程</div></div></div></AbsoluteFill>;
};

export const richTemplateIds = new Set(["paper-collage", "cinematic-dark", "clean-editorial", "vibrant-tech", "motion-explainer", "product-launch", "data-briefing", "creator-collage", ...hyperframesInspiredIds]);

/** 视觉模板不是封面：每一套都包含开场、信息推进和收束，并可循环播放。 */
export const RichTemplateDemo: React.FC<{ template: string }> = ({ template }) => {
  if (hyperframesInspiredIds.has(template)) return <HyperframesInspiredDemo template={template} />;
  switch (template) {
    case "paper-collage":
    case "creator-collage": return <CreatorCollage />;
    case "cinematic-dark": return <TickerLab />;
    case "vibrant-tech":
    case "product-launch": return <ProductLaunch />;
    case "data-briefing": return <DataBriefing />;
    case "clean-editorial":
    case "motion-explainer": return <RemotionExplainer />;
    default: return null;
  }
};
