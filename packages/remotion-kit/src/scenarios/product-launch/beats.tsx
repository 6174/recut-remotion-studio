/**
 * [INPUT]: 依赖场景 beat 类型、设计系统 palette、动画原语库与 shotcraft 组件
 * [OUTPUT]: 对外提供 product-launch 的 beat 渲染器表（PRODUCT_LAUNCH_BEATS）
 * [POS]: scenarios/product-launch 的视觉语法层。60s 长片：每个 beat 有**唯一**的视觉主角
 *        （eye-catch），全片不重复同一种表达——霓虹 hero / 数字冲击 / 对仗分屏 / 玻璃证据 /
 *        超大数据 / 引述扫光 / 路线进度 / 发光 CTA，各有各的图形与动效。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DigitRoll } from "../../components/shotcraft";
import type { BeatRenderer, BeatContext } from "../_shared/types";
import { AccentRule, ClaimTitle, clamp, CtaButton, EvidenceCard, Eyebrow, GlowPill, neonField, PointList, Ring } from "./primitives";

/** ① 霓虹 hero：旋转光环 ×2 + 超大主张 + 发光 Pill（全片唯一的 hero 手法）。 */
const HookBeat: BeatRenderer = ({ scene, p }) => (
  <AbsoluteFill style={{ overflow: "hidden", color: p.text, fontFamily: p.fontFamily, background: p.background }}>
    <div style={neonField(p.accent, p.accent, p.background)} />
    <Ring color={p.text} size={1250} left={330} top={-340} />
    <Ring color={p.accent} size={980} left={-260} top={620} speed={-0.18} />
    <div style={{ position: "absolute", top: 90, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "PRODUCT / LAUNCH"}</Eyebrow></div>
    <div style={{ position: "absolute", top: 196, left: 112, maxWidth: 1180 }}>
      <ClaimTitle color={p.text} fontFamily={p.fontFamily} fontSize={104}>
        {scene.title}<br />
        <span style={{ color: p.accent }}>{(scene.subtitle as string) || "把结果，先讲出来"}</span>
      </ClaimTitle>
      {scene.narration ? <p style={{ margin: "30px 0 0", fontSize: 28, lineHeight: 1.5, color: p.text, opacity: 0.82 }}>{scene.narration}</p> : null}
    </div>
    <div style={{ position: "absolute", left: 112, bottom: 96, display: "flex", gap: 14 }}>
      <GlowPill color={p.accent} delay={70}>LAUNCH</GlowPill>
      <GlowPill color={p.primary} delay={82}>RESULT</GlowPill>
      <GlowPill color={p.text} delay={94}>NOW</GlowPill>
    </div>
  </AbsoluteFill>
);

/** ② 数字冲击：成本数字放大飞入（比「痛点」本身更抢眼），左标题压到最小。 */
const PainBeat: BeatRenderer = ({ scene, p, frame, width }) => {
  const painCost = ((scene.pain as { cost?: string; unit?: string }) || {}).cost || "40%";
  const unit = ((scene.pain as { cost?: string; unit?: string }) || {}).unit || "时间流失";
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  const scale = spring({ frame, fps: 30, from: 1.4, to: 1, config: { damping: 18, mass: 1.1 } });
  const painPoints = (scene.points as string[]) || [];
  return (
    <AbsoluteFill style={{ overflow: "hidden", color: p.text, fontFamily: p.fontFamily, background: p.background }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 78% 42%, ${p.primary}22 0%, transparent 50%)` }} />
      <div style={{ position: "absolute", top: 88, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "01 · 痛点"}</Eyebrow></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8%", opacity, transform: `scale(${scale})` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontSize: Math.max(140, Math.round(width / 6)), fontWeight: 900, color: p.accent, fontFamily: p.fontFamily, lineHeight: 0.9, textShadow: `0 0 80px ${p.accent}55` }}>{painCost}</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: p.text, opacity: 0.75 }}>{unit}</span>
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 800, margin: "28px 0 0", fontFamily: p.fontFamily, lineHeight: 1.1, maxWidth: "70%" }}>{scene.title}</h1>
        <div style={{ marginTop: 22, maxWidth: 560 }}>
          {painPoints.map((point, i) => {
            const d = 20 + i * 8;
            const o = interpolate(frame, [d, d + 12], [0, 1], clamp);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: o, marginTop: 10, fontSize: 22 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: p.accent, transform: "rotate(45deg)" }} />
                <span style={{ opacity: 0.75 }}>{point}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ③ 对仗分屏：现状 vs 愿景，两栏宽度此消彼长（全片唯一的分屏手法）。 */
const ContrastBeat: BeatRenderer = ({ scene, p, frame }) => {
  const before = ((scene.contrast as { before?: string; after?: string }) || {}).before || "现状";
  const after = ((scene.contrast as { before?: string; after?: string }) || {}).after || "改变之后";
  const beforeW = interpolate(frame, [20, 90], [0.5, 0.32], clamp);
  const afterW = interpolate(frame, [20, 90], [0.5, 0.68], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: p.background, color: p.text, fontFamily: p.fontFamily }}>
      <div style={{ position: "absolute", top: 80, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "CONTRAST"}</Eyebrow></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 6%" }}>
        <div style={{ width: `${beforeW * 100}%`, height: "72%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", borderRight: `1px solid ${p.accent}33`, transition: "none" }}>
          <div style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 22, letterSpacing: ".2em", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: p.text, opacity: 0.55, marginBottom: 20 }}>BEFORE</div>
            <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, opacity: 0.7 }}>{before}</div>
          </div>
        </div>
        <div style={{ width: `${afterW * 100}%`, height: "72%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 22, letterSpacing: ".2em", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: p.accent, marginBottom: 20 }}>AFTER</div>
            <div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.05, color: p.accent, textShadow: `0 0 60px ${p.accent}66` }}>{after}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", fontSize: 18, letterSpacing: ".3em", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: p.text, opacity: 0.45 }}>CHANGE HAPPENS HERE →</div>
    </AbsoluteFill>
  );
};

/** ④ 玻璃证据：产品截图浮在玻璃卡上（全片唯一的产品画面）。 */
const FeatureBeat: BeatRenderer = ({ scene, p, frame, width, resolveMediaUrl }) => {
  const points = (scene.points as string[]) || [];
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);
  const x = interpolate(frame, [0, 16], [-32, 0], clamp);
  const imageUrl = scene.imageAssetId ? resolveMediaUrl?.(scene.imageAssetId) : undefined;
  const rightW = Math.round(width * 0.42);
  return (
    <AbsoluteFill style={{ overflow: "hidden", color: p.text, fontFamily: p.fontFamily, background: p.background }}>
      <div style={{ position: "absolute", top: 80, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "FEATURE"}</Eyebrow></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 64, padding: "0 8%", opacity, transform: `translateX(${x}px)` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 68, fontWeight: 900, color: p.text, margin: 0, fontFamily: p.fontFamily, lineHeight: 1 }}>{scene.title}</h2>
          <AccentRule accent={p.accent} primary={p.primary} frame={frame} max={96} height={6} />
          <div style={{ marginTop: 26 }}><PointList points={points} accent={p.accent} text={p.text} fontFamily={p.fontFamily} fontSize={26} /></div>
        </div>
        <div style={{ width: rightW, flexShrink: 0 }}>
          <EvidenceCard p={p} width="100%">
            {imageUrl ? (
              <img src={imageUrl} alt="" style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 14, display: "block" }} />
            ) : (
              <div style={{ width: "100%", aspectRatio: "16 / 10", borderRadius: 14, background: `linear-gradient(135deg, ${p.accent}55, ${p.primary}55)`, display: "grid", placeItems: "center" }}>
                <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, letterSpacing: ".18em", color: p.text, opacity: 0.6 }}>PRODUCT SHOT</span>
              </div>
            )}
          </EvidenceCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ⑤ 超大数据：DigitRoll 超大字翻牌（全片唯一的数据主角）。 */
const MetricBeat: BeatRenderer = ({ scene, p, frame, width }) => {
  const metric = (scene.metric as { value?: string; label?: string; unit?: string }) || {};
  const value = metric.value || "83";
  const label = metric.label || scene.title || "";
  const unit = metric.unit || "%";
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  const rise = spring({ frame, fps: 30, from: 24, to: 0, config: { damping: 18, mass: 0.9 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", color: p.text, fontFamily: p.fontFamily, background: p.background }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 60%, ${p.accent}22 0%, transparent 55%)` }} />
      <div style={{ position: "absolute", top: 88, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "DATA"}</Eyebrow></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity, transform: `translateY(${rise}px)` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <DigitRoll value={value} fontSize={Math.max(130, Math.round(width / 7))} color={p.accent} />
          {unit ? <span style={{ fontFamily: p.fontFamily, fontSize: 60, fontWeight: 800, color: p.text }}>{unit}</span> : null}
        </div>
        <AccentRule accent={p.accent} primary={p.primary} frame={frame} max={160} height={6} />
        <p style={{ color: p.text, fontSize: 28, fontWeight: 400, marginTop: 24, fontFamily: p.fontFamily, maxWidth: "60%", lineHeight: 1.4 }}>{label}</p>
      </div>
    </AbsoluteFill>
  );
};

/** ⑥ 引述扫光：超大引号 + 一句证言 + 扫光掠过（全片唯一的证言手法）。 */
const TestimonialBeat: BeatRenderer = ({ scene, p, frame }) => {
  const quote = scene.quote || "真正改变了我们的工作方式。";
  const author = scene.author || "";
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  const scale = spring({ frame, fps: 30, from: 0.96, to: 1, config: { damping: 16, mass: 0.85 } });
  const sweep = interpolate(frame, [30, 70], [-1, 1.5], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: p.background, color: p.text, fontFamily: p.fontFamily }}>
      <div style={{ position: "absolute", top: 80, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "TESTIMONIAL"}</Eyebrow></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 16%", opacity, transform: `scale(${scale})` }}>
        <div style={{ fontSize: 130, lineHeight: 0.6, color: p.accent, opacity: 0.5, fontFamily: "Georgia, serif" }}>“</div>
        <p style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.2, fontFamily: p.fontFamily, maxWidth: "86%", marginTop: 8 }}>{quote as string}</p>
        {author ? <div style={{ marginTop: 32, fontSize: 20, letterSpacing: ".2em", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: p.accent }}>{author as string}</div> : null}
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: `${sweep * 60}%`, background: `linear-gradient(90deg, transparent, ${p.accent}22, transparent)`, transform: "skewX(-18deg)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/** ⑦ 路线进度：横向进度条 + 发光节点推进（全片唯一的「下一步」手法）。 */
const RoadmapBeat: BeatRenderer = ({ scene, p, frame, width }) => {
  const steps = ((scene.steps as string[]) || ["今天", "30 天", "持续优化"]).slice(0, 4);
  const gap = Math.round(width * 0.05);
  const barW = Math.round(width * 0.7);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: p.background, color: p.text, fontFamily: p.fontFamily }}>
      <div style={{ position: "absolute", top: 80, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "NEXT"}</Eyebrow></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ fontSize: 64, fontWeight: 900, margin: 0, fontFamily: p.fontFamily }}>{scene.title}</h2>
        <div style={{ marginTop: 60, width: barW, position: "relative", height: 8, borderRadius: 99, background: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${interpolate(frame, [30, 90], [0, 100], clamp)}%`, borderRadius: 99, background: `linear-gradient(90deg, ${p.accent}, ${p.primary})`, boxShadow: `0 0 30px ${p.accent}` }} />
        </div>
        <div style={{ marginTop: 30, display: "flex", gap }}>
          {steps.map((step, i) => {
            const d = 40 + i * 12;
            const o = interpolate(frame, [d, d + 10], [0, 1], clamp);
            const dot = interpolate(frame, [d, d + 10], [0, 1], clamp);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: o, minWidth: gap * 0.8, justifyContent: "center" }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: p.accent, transform: `scale(${0.4 + dot * 0.6})`, boxShadow: `0 0 16px ${p.accent}` }} />
                <span style={{ fontSize: 24, fontWeight: 600, fontFamily: p.fontFamily }}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ⑧ 发光 CTA：双光环 + 发光按钮 + 扫光（收尾，与开场 hero 呼应但不重复）。 */
const CtaBeat: BeatRenderer = ({ scene, p, frame, fps }) => {
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);
  const scale = spring({ frame, fps, from: 0.94, to: 1, config: { damping: 16, mass: 0.8 } });
  const sweep = interpolate(frame, [34, 80], [-1, 1.6], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", color: p.text, fontFamily: p.fontFamily, background: p.background }}>
      <div style={neonField(p.accent, p.primary, p.background)} />
      <Ring color={p.accent} size={1300} left={310} top={-360} speed={0.18} />
      <Ring color={p.primary} size={1600} left={140} top={-520} speed={-0.12} />
      <div style={{ position: "absolute", top: 88, left: 112 }}><Eyebrow color={p.accent}>{scene.kicker || "CTA"}</Eyebrow></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <h1 style={{ fontSize: 104, fontWeight: 900, margin: 0, fontFamily: p.fontFamily, lineHeight: 1 }}>{scene.title}</h1>
        <CtaButton label={(scene.ctaLabel as string) || "立即开始"} accent={p.accent} background={p.background} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 300, left: `${sweep * 60}%`, background: `linear-gradient(90deg, transparent, ${p.accent}22, transparent)`, transform: "skewX(-18deg)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/** product-launch 的全部 beat 渲染器表：每个 beat 一个唯一视觉主角，全片手法不重复。 */
export const PRODUCT_LAUNCH_BEATS: Record<string, BeatRenderer> = {
  hook: HookBeat,           // ① 霓虹 hero + 光环
  pain: PainBeat,           // ② 数字冲击
  contrast: ContrastBeat,   // ③ 对仗分屏
  feature: FeatureBeat,     // ④ 玻璃证据
  metric: MetricBeat,       // ⑤ 超大数据
  testimonial: TestimonialBeat, // ⑥ 引述扫光
  roadmap: RoadmapBeat,     // ⑦ 路线进度
  cta: CtaBeat,             // ⑧ 发光 CTA
};

export type { BeatContext };
