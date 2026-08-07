/**
 * [INPUT]: 依赖 Remotion 帧时钟；设计原则参考 HyperFrames Design 的公开预设描述
 * [OUTPUT]: 对外提供 HyperframesInspiredDemo 与对应的模板 ID 集合
 * [POS]: preview 层的设计系统转译器；以逐帧确定的 Remotion 实现提供更多可播放样片
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "Inter, 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const enter = (frame: number, fps: number, delay = 0) => spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 15, mass: 0.8, stiffness: 150 } });

const SolarBiennale: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const title = enter(frame, fps, 12); const bloom = interpolate(frame, [0, 130], [0.7, 1.12], clamp);
  return <AbsoluteFill style={{ background: "#f5eddd", color: "#17223b", overflow: "hidden", fontFamily: "Georgia, 'Songti SC', serif" }}>
    <div style={{ position: "absolute", width: 980, height: 980, borderRadius: "50%", background: "#ffd326", top: -250, right: -120, transform: `scale(${bloom})`, boxShadow: "0 0 150px rgba(255,211,38,.45)" }} />
    <div style={{ position: "absolute", inset: 68, borderTop: "1px solid #17223b", borderBottom: "1px solid #17223b" }} />
    <div style={{ position: "absolute", top: 94, left: 112, font: `700 20px ${MONO}`, letterSpacing: ".22em" }}>BIENNALE / 2026</div>
    <div style={{ position: "absolute", left: 112, top: 264, opacity: title, transform: `translateY(${(1 - title) * 55}px)`, fontSize: 96, lineHeight: .92, letterSpacing: "-.07em", fontWeight: 700 }}>让每一个观点<br />都<span style={{ color: "#e25721" }}>照亮</span>一帧</div>
    <div style={{ position: "absolute", right: 130, bottom: 115, width: 385, paddingTop: 22, borderTop: "1px solid #17223b", font: `22px/1.45 ${SANS}` }}>温暖纸张、太阳黄光晕与克制细线，适合文化、教育和有温度的讲解。</div>
  </AbsoluteFill>;
};

const BlockFrame: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const cards = ["写脚本", "排镜头", "导出 MP4"];
  return <AbsoluteFill style={{ background: "#ffed4a", color: "#101010", overflow: "hidden", fontFamily: SANS }}>
    <div style={{ position: "absolute", top: 78, left: 100, font: `900 26px ${MONO}` }}>BLOCKFRAME</div>
    <div style={{ position: "absolute", left: 100, top: 182, fontSize: 105, fontWeight: 950, lineHeight: .84, letterSpacing: "-.09em" }}>视频<br />不是黑盒</div>
    <div style={{ position: "absolute", right: 110, top: 130, width: 770 }}>{cards.map((card, index) => { const p = enter(frame, fps, 18 + index * 18); return <div key={card} style={{ marginBottom: 25, padding: "27px 32px", border: "5px solid #101010", background: ["#ff8ac3", "#6cf0c2", "#83a4ff"][index], boxShadow: "13px 13px 0 #101010", transform: `translateX(${(1 - p) * 210}px) rotate(${(1 - p) * 4}deg)`, opacity: p, display: "flex", justifyContent: "space-between", fontSize: 39, fontWeight: 900 }}><span>{card}</span><span>0{index + 1}</span></div>; })}</div>
    <div style={{ position: "absolute", left: 100, bottom: 88, padding: "13px 18px", border: "4px solid #101010", background: "#fff", font: `700 20px ${MONO}` }}>THICK TYPE / HARD CUT / NO APOLOGY</div>
  </AbsoluteFill>;
};

const CobaltGrid: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const p = enter(frame, fps, 12);
  return <AbsoluteFill style={{ background: "#f7f2e9", color: "#111d5a", overflow: "hidden", fontFamily: SANS }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#3159d9 1px, transparent 1px), linear-gradient(90deg, #3159d9 1px, transparent 1px)", backgroundSize: "160px 135px", opacity: .24 }} />
    <div style={{ position: "absolute", top: 78, left: 112, right: 112, display: "flex", justifyContent: "space-between", font: `700 18px ${MONO}`, letterSpacing: ".15em" }}><span>COBALT / FIELD NOTES</span><span>001—003</span></div>
    <div style={{ position: "absolute", top: 230, left: 112, width: 1050, fontFamily: "Georgia, 'Songti SC', serif", fontSize: 89, lineHeight: .95, letterSpacing: "-.06em", transform: `translateY(${(1 - p) * 56}px)`, opacity: p }}>用网格<br />把复杂讲清楚</div>
    {["输入：选题与素材", "过程：组件与时间轴", "输出：可复现成片"].map((text, index) => { const y = 565 + index * 105; const width = interpolate(frame, [45 + index * 15, 100 + index * 15], [0, 660 - index * 95], clamp); return <div key={text} style={{ position: "absolute", left: 112, top: y, display: "flex", gap: 24, alignItems: "center" }}><span style={{ width: 38, font: `700 17px ${MONO}` }}>0{index + 1}</span><div style={{ width, height: 44, background: index === 1 ? "#3159d9" : "#e7e1d4", border: "1px solid #111d5a", display: "grid", placeItems: "center", overflow: "hidden", whiteSpace: "nowrap", fontSize: 20, color: index === 1 ? "#fff" : "#111d5a" }}>{text}</div></div>; })}
  </AbsoluteFill>;
};

const BoldPoster: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const p = enter(frame, fps, 10); const tilt = interpolate(frame, [0, 100], [-7, -2], clamp);
  return <AbsoluteFill style={{ background: "#f7eee1", color: "#d52323", overflow: "hidden", fontFamily: "Arial Black, 'PingFang SC', sans-serif" }}>
    <div style={{ position: "absolute", right: -50, top: -100, width: 750, height: 1300, background: "#d52323", transform: `rotate(${tilt}deg)` }} />
    <div style={{ position: "absolute", left: 106, top: 76, color: "#141414", font: `900 21px ${MONO}`, letterSpacing: ".16em" }}>BOLD POSTER / REMOTION</div>
    <div style={{ position: "absolute", left: 98, top: 200, fontSize: 145, lineHeight: .78, letterSpacing: "-.11em", transform: `scale(${.82 + p * .18}) rotate(${(1 - p) * -4}deg)`, transformOrigin: "left", opacity: p }}>把<br />想法<br /><span style={{ color: "#141414" }}>打出来</span></div>
    <div style={{ position: "absolute", right: 95, bottom: 105, width: 530, color: "#fff", fontFamily: SANS, fontSize: 31, fontWeight: 900, lineHeight: 1.05 }}>一句核心观点。<br />一个强势画面。<br />一次明确收束。</div>
  </AbsoluteFill>;
};

const Capsule: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const pills = ["选题", "结构", "动效", "交付"];
  return <AbsoluteFill style={{ background: "#fff2e4", color: "#1d2447", overflow: "hidden", fontFamily: "Georgia, 'Songti SC', serif" }}>
    <div style={{ position: "absolute", inset: 70, borderRadius: 68, background: "#ff7566" }} />
    <div style={{ position: "absolute", top: 136, left: 190, right: 190, textAlign: "center", fontSize: 84, lineHeight: .93, fontWeight: 700, letterSpacing: "-.065em" }}>每个阶段<br />都恰好<span style={{ color: "#fff2e4" }}>一粒胶囊</span></div>
    <div style={{ position: "absolute", left: 220, right: 220, bottom: 170, display: "flex", justifyContent: "center", gap: 20 }}>{pills.map((pill, index) => { const p = enter(frame, fps, 22 + index * 14); return <div key={pill} style={{ padding: "27px 35px", borderRadius: 999, background: ["#ffe16a", "#8fe3d0", "#a9bcff", "#fff2e4"][index], boxShadow: "0 11px 0 rgba(29,36,71,.24)", font: `700 29px ${SANS}`, transform: `translateY(${(1 - p) * 95}px)`, opacity: p }}>{pill}</div>; })}</div>
  </AbsoluteFill>;
};

const EditorialForest: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const p = enter(frame, fps, 12);
  return <AbsoluteFill style={{ background: "#f4ebd6", color: "#1e4d3b", overflow: "hidden", fontFamily: "Georgia, 'Songti SC', serif" }}>
    <div style={{ position: "absolute", right: -80, bottom: -210, width: 930, height: 930, borderRadius: "50%", background: "#1e4d3b" }} />
    <div style={{ position: "absolute", left: 100, top: 82, color: "#d86079", font: `700 20px ${MONO}`, letterSpacing: ".18em" }}>EDITORIAL / FOREST</div>
    <div style={{ position: "absolute", left: 100, top: 220, width: 960, fontSize: 94, lineHeight: .92, letterSpacing: "-.07em", transform: `translateY(${(1 - p) * 52}px)`, opacity: p }}>让叙事<br />像森林一样<br /><span style={{ color: "#d86079" }}>层层生长</span></div>
    {[["观点", 104, 690], ["镜头", 410, 760], ["节奏", 720, 684]].map(([name, left, top], index) => { const progress = enter(frame, fps, 46 + index * 16); return <div key={String(name)} style={{ position: "absolute", left: Number(left), top: Number(top), padding: "20px 28px", borderRadius: 999, background: index === 1 ? "#d86079" : "#f4ebd6", color: index === 1 ? "#fff" : "#1e4d3b", border: "1px solid #1e4d3b", font: `700 27px ${SANS}`, transform: `scale(${.72 + progress * .28})`, opacity: progress }}>{name}</div>; })}
  </AbsoluteFill>;
};

export const hyperframesInspiredIds = new Set(["biennale-yellow", "blockframe", "cobalt-grid", "bold-poster", "capsule-editorial", "editorial-forest"]);

export const HyperframesInspiredDemo: React.FC<{ template: string }> = ({ template }) => {
  switch (template) {
    case "biennale-yellow": return <SolarBiennale />;
    case "blockframe": return <BlockFrame />;
    case "cobalt-grid": return <CobaltGrid />;
    case "bold-poster": return <BoldPoster />;
    case "capsule-editorial": return <Capsule />;
    case "editorial-forest": return <EditorialForest />;
    default: return null;
  }
};
