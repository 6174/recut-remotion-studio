/**
 * [INPUT]: 依赖 HtmlCanvasVideoStage、InteractionScript 与 StagePlan；复用 ProductUiDemo 的产品交互实例
 * [OUTPUT]: 对外提供 EffectFixtureDemo：按效果 id 分发 Bubble/Magnify/Glitch/阅读/产品专属预览
 * [POS]: html-canvas/demos 的视觉验收层。它把每个效果绑定到适合其光学与叙事特性的 source 内容，
 *        禁止用同一张设置面板伪装所有效果的体验。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { HtmlCanvasVideoStage } from "../HtmlCanvasVideoStage";
import { useInteraction } from "../InteractionScript";
import type { StagePlan } from "../types";
import { PRODUCT_UI_DEMO_PLAN, ProductUiDemo } from "./product-ui-demo";

const FONT = "Inter, ui-sans-serif, system-ui, 'PingFang SC', sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const BUBBLE_PLAN: StagePlan = {
  interaction: [
    { kind: "move", frame: 0, x: 270, y: 770 },
    { kind: "move", frame: 18, x: 620, y: 570, easing: "easeOut" },
    { kind: "move", frame: 34, x: 1080, y: 430, easing: "easeInOut" },
  ],
  effects: [{ id: "bubble-fluid", scope: "scene", effect: "bubble", timing: { startFrame: 0, enterFrames: 12, holdFrames: 170, exitFrames: 18 }, options: { size: 132, trail: 24, follow: 0.5, blend: 14, refraction: 80, dispersion: 1.2, frost: 0.12, shine: 0.62, rim: 0.72, iridescence: 1.15 }, zIndex: 10 }],
};

const MAGNIFY_PLAN: StagePlan = {
  interaction: [
    { kind: "move", frame: 0, x: 580, y: 310 },
    { kind: "move", frame: 44, x: 980, y: 540, easing: "easeInOut" },
    { kind: "move", frame: 92, x: 1430, y: 610, easing: "easeInOut" },
  ],
  effects: [{ id: "scanner-lens", scope: "scene", effect: "magnifier", timing: { startFrame: 0, enterFrames: 10, holdFrames: 176, exitFrames: 20 }, options: { radius: 174, zoom: 2.15, chromatic: true }, zIndex: 10 }],
};

const GLITCH_PLAN: StagePlan = {
  effects: [{ id: "signal-corrupt", scope: "scene", effect: "glitch", timing: { startFrame: 42, enterFrames: 4, holdFrames: 74, exitFrames: 10 }, options: { shift: 46, rgbShift: 8, bursts: [{ startFrame: 52, durationFrames: 10, seed: 11 }, { startFrame: 70, durationFrames: 12, seed: 29 }, { startFrame: 96, durationFrames: 9, seed: 47 }] }, intensity: 0.94, zIndex: 10 }],
};

const READING_PLAN: StagePlan = {
  targets: {
    "reading:headline": { kind: "rect", rect: { x: 250, y: 230, width: 1390, height: 182 }, radius: 28 },
    "focus:headline": { kind: "rect", rect: { x: 190, y: 168, width: 1510, height: 305 }, radius: 44 },
  },
  interaction: [
    { kind: "move", frame: 0, x: 240, y: 720 },
    { kind: "move", frame: 44, x: 960, y: 320, easing: "easeInOut" },
    { kind: "hover", frame: 48, targetId: "reading:headline" },
    { kind: "click", frame: 82, targetId: "reading:headline" },
  ],
  effects: [
    { id: "reading-cursor", scope: "video", effect: "cursor", timing: { startFrame: 0, enterFrames: 8, holdFrames: 166, exitFrames: 12 }, zIndex: 30 },
    { id: "reading-focus", scope: "scene", effect: "focus-spotlight", targetId: "focus:headline", timing: { startFrame: 74, enterFrames: 18, holdFrames: 62, exitFrames: 18 }, options: { dim: 0.7, edge: true }, zIndex: 10 },
  ],
};

const SELECTION_PLAN: StagePlan = {
  ...READING_PLAN,
  effects: [
    { id: "selection-cursor", scope: "video", effect: "cursor", timing: { startFrame: 0, enterFrames: 8, holdFrames: 166, exitFrames: 12 }, zIndex: 30 },
    { id: "selection-words", scope: "scene", effect: "text-selection", targetId: "reading:headline", timing: { startFrame: 38, enterFrames: 44, holdFrames: 60, exitFrames: 18 }, options: { color: "rgba(129, 243, 203, 0.55)", scan: true, tokens: [{ x: 255, y: 252, width: 1120, height: 78 }, { x: 255, y: 342, width: 930, height: 72 }] }, zIndex: 12 },
  ],
};

const AmbientOrb: React.FC<{ left: number; top: number; size: number; color: string }> = ({ left, top, size, color }) => (
  <div style={{ position: "absolute", left, top, width: size, height: size, borderRadius: "50%", background: color, filter: "blur(1px)", opacity: 0.92 }} />
);

const BubbleEditorial: React.FC = () => (
  <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: FONT, color: "#effffe", background: "#031d22" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 35%, #167b79 0%, #073a43 28%, transparent 52%), radial-gradient(circle at 18% 82%, #12466a 0%, transparent 44%), linear-gradient(125deg, #071b33, #062328 58%, #011316)" }} />
    <AmbientOrb left={1210} top={90} size={420} color="#15aa95" />
    <AmbientOrb left={1360} top={500} size={320} color="#1960a8" />
    <AmbientOrb left={260} top={600} size={370} color="#114d91" />
    <div style={{ position: "absolute", inset: 46, border: "1px solid rgba(223,255,248,0.28)", borderRadius: 28 }} />
    <div style={{ position: "absolute", top: 94, left: 110, fontSize: 18, letterSpacing: "0.34em", color: "#9ee8d8" }}>LIQUID STUDY / 2026</div>
    <div style={{ position: "absolute", top: 160, left: 108, width: 690 }}>
      <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: "-0.075em", lineHeight: 0.86 }}>Soft<br />matter.</div>
      <p style={{ marginTop: 38, maxWidth: 435, color: "#b8e7e0", fontSize: 25, lineHeight: 1.45 }}>光学、流体与材料的交界处，所有细节都保持柔软而清晰。</p>
    </div>
    <div style={{ position: "absolute", right: 110, bottom: 100, width: 510, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {["REFRACT", "DISPERSE", "BLOOM"].map((label, index) => <div key={label} style={{ borderTop: "2px solid rgba(224,255,250,0.74)", paddingTop: 13, color: index === 1 ? "#94ffe9" : "#d9fffb", fontFamily: MONO, fontSize: 16 }}>{label}</div>)}
    </div>
  </div>
);

const MagnifyScanner: React.FC = () => (
  <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: MONO, color: "#bffaf0", background: "#071014" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.28, backgroundImage: "linear-gradient(rgba(96,255,217,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(96,255,217,.22) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
    <div style={{ position: "absolute", inset: "66px 76px", border: "1px solid rgba(116,255,221,.42)", padding: 38 }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#68f8d0", fontSize: 19, letterSpacing: "0.18em" }}><span>SCAN / MEMORY-08</span><span>LIVE ◉ 12.6ms</span></div>
      <div style={{ position: "absolute", top: 176, left: 38, right: 38, display: "grid", gridTemplateColumns: "1.18fr .82fr", gap: 70 }}>
        <div><div style={{ color: "#f0ffff", fontFamily: FONT, fontSize: 78, fontWeight: 750, letterSpacing: "-0.06em", lineHeight: 0.95 }}>Observe<br />the signal.</div><p style={{ marginTop: 38, maxWidth: 630, color: "#7bcfc0", fontSize: 21, lineHeight: 1.8 }}>以高分辨率读取复杂系统：每一层的噪声、纹理与细小的偏移，都是可被辨认的线索。</p></div>
        <div style={{ borderLeft: "1px solid rgba(116,255,221,.36)", paddingLeft: 42, fontSize: 20, lineHeight: 2.1 }}><div>FREQ  83.042 kHz</div><div>DEPTH 02.104 mm</div><div>PHASE 180.2°</div><div>NOISE -57.8 dB</div><div style={{ marginTop: 32, color: "#effffd" }}>STATUS / NOMINAL</div></div>
      </div>
      <div style={{ position: "absolute", left: 38, bottom: 42, right: 38, height: 130, display: "flex", alignItems: "end", gap: 8 }}>{Array.from({ length: 48 }).map((_, i) => <span key={i} style={{ width: 19, height: 12 + ((i * 47) % 93), background: i % 7 === 0 ? "#e6fff9" : "#1ba18d" }} />)}</div>
    </div>
  </div>
);

const GlitchSignal: React.FC = () => (
  <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: MONO, color: "#fff7ed", background: "#11060b" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg, rgba(255,54,97,.24), transparent 40%), repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 4px)" }} />
    <div style={{ position: "absolute", top: 90, left: 105, right: 105, display: "flex", justifyContent: "space-between", fontSize: 18, color: "#ff758f", letterSpacing: "0.2em" }}><span>CHANNEL 07 / EMERGENCY</span><span>REC ●</span></div>
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}><div><div style={{ fontFamily: FONT, fontSize: 154, fontWeight: 900, letterSpacing: "-0.095em", lineHeight: 0.8 }}>SIGNAL<br />LOST</div><p style={{ fontSize: 24, letterSpacing: "0.22em", color: "#ffb1c0", marginTop: 42 }}>RETRYING TRANSMISSION_</p></div></div>
    <div style={{ position: "absolute", left: 105, bottom: 94, right: 105, display: "flex", justifyContent: "space-between", color: "#d995a3", fontSize: 18 }}><span>ERR: 0x7F 3B 09</span><span>DO NOT ADJUST YOUR DISPLAY</span></div>
  </div>
);

const ReadingScene: React.FC = () => {
  const interaction = useInteraction();
  const active = interaction.hoveredTargetId === "reading:headline";
  return <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", fontFamily: FONT, background: "#f4f0e8", color: "#202018", padding: "110px 14%" }}>
    <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.24em", color: "#6e7467" }}>ESSAY / INTERACTION AS CINEMATOGRAPHY</div>
    <h1 style={{ margin: "44px 0 34px", maxWidth: 1430, fontSize: 100, lineHeight: 0.93, letterSpacing: "-0.075em", background: active ? "#d8f7e5" : "transparent", borderRadius: 20 }}>让信息获得<br />被看见的节奏。</h1>
    <p style={{ maxWidth: 850, fontSize: 30, lineHeight: 1.55, color: "#55564c" }}>镜头不是把屏幕盖上一层滤镜。它应该让观众知道：下一眼该看哪里，以及为什么这一处值得被看见。</p>
  </div>;
};

const TransitionUnavailable: React.FC = () => <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#0b0e13", color: "#d6dde7", fontFamily: FONT, textAlign: "center" }}><div><div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.24em", color: "#9ba7b9" }}>A/B TRANSITION ADAPTER</div><h2 style={{ margin: "24px 0 12px", fontSize: 54 }}>Page Turn 需要两个真实场景</h2><p style={{ color: "#8c97a6", fontSize: 22 }}>不再把翻页伪装为单输入镜头特效。</p></div></div>;

/** UI preview 的唯一 effect fixture dispatcher。 */
export const EffectFixtureDemo: React.FC<{ effect: string }> = ({ effect }) => {
  if (effect === "bubble") return <HtmlCanvasVideoStage plan={BUBBLE_PLAN}><BubbleEditorial /></HtmlCanvasVideoStage>;
  if (effect === "magnifier") return <HtmlCanvasVideoStage plan={MAGNIFY_PLAN}><MagnifyScanner /></HtmlCanvasVideoStage>;
  if (effect === "glitch") return <HtmlCanvasVideoStage plan={GLITCH_PLAN}><GlitchSignal /></HtmlCanvasVideoStage>;
  if (effect === "focus-spotlight") return <HtmlCanvasVideoStage plan={READING_PLAN}><ReadingScene /></HtmlCanvasVideoStage>;
  if (effect === "text-selection") return <HtmlCanvasVideoStage plan={SELECTION_PLAN}><ReadingScene /></HtmlCanvasVideoStage>;
  if (effect === "scene-transition") return <TransitionUnavailable />;
  return <ProductUiDemo plan={PRODUCT_UI_DEMO_PLAN} />;
};
