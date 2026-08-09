/**
 * [INPUT]: 依赖场景 beat 类型、faceless-explainer palette、Remotion 帧时钟与科技新闻视觉原语
 * [OUTPUT]: 对外提供科技新闻解读的 beat 渲染器表（FACELESS_EXPLAINER_BEATS）
 * [POS]: scenarios/faceless-explainer 的镜头组合层。每个 beat 只讲一个新闻判断，以网格纸、
 *        渐变 marker、渐变超大字、手绘箭头与眼睛形成统一但不重复的视觉表达。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { DigitRoll } from "../../components";
import type { BeatContext, BeatRenderer } from "../_shared/types";
import { clamp, DataBars, DiagramTitle, DoodleArrow, DoodleEyes, GlowProgress, gradientTextStyle, Grid, MarkerBlob, PaperCard, sceneBackground, StepList } from "./primitives";

const ink = "#111";
const backdrop = (p: BeatContext["p"]) => ({ backgroundColor: p.background, backgroundImage: sceneBackground(p) });
const titleGradient = "linear-gradient(110deg, #090f0d 0%, #18231d 48%, #159d75 100%)";

/** ① 新闻钩子：一条大标题、一块荧光 marker、一双看新闻的眼睛。 */
const HookBeat: BeatRenderer = ({ scene, p, frame }) => {
  const arrowY = interpolate(frame, [12, 30], [50, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <MarkerBlob color={p.accent} style={{ width: 1620, height: 800, left: 130, top: 180, transform: "rotate(-3deg)" }} />
      <DoodleEyes style={{ width: 310, height: 180, right: 140, top: 104, transform: "rotate(7deg)" }} pupilOffset={Math.round(interpolate(frame, [0, 40], [-5, 5], clamp))} />
      <div style={{ position: "absolute", top: 286, left: 150, maxWidth: 1450, transform: "rotate(-1.5deg)" }}>
        <div style={{ marginBottom: 28, fontSize: 54, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.05em", ...gradientTextStyle("linear-gradient(90deg, #111 0%, #55f436 58%, #159d75 100%)") }}>{scene.kicker || "TODAY · TECH NEWS"}</div>
        <DiagramTitle color={ink} gradient={titleGradient} fontFamily={p.fontFamily} fontSize={126}>{scene.title}</DiagramTitle>
        {scene.subtitle ? <div style={{ marginTop: 38, maxWidth: 1150, fontSize: 48, fontWeight: 900, lineHeight: 1.2 }}>{scene.subtitle as string}</div> : null}
      </div>
      <DoodleArrow color={p.accent} style={{ width: 950, height: 250, left: 580, bottom: 52, transform: `translateY(${arrowY}px) rotate(-4deg)` }} />
    </AbsoluteFill>
  );
};

/** ② 核心视角：中心大定义与三个看点，像一张科技媒体封面。 */
const ConceptBeat: BeatRenderer = ({ scene, p, frame }) => {
  const points = (scene.points as string[]) || [];
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);
  const scale = spring({ frame, fps: 30, from: 1.04, to: 1, config: { damping: 18, mass: 0.9 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <MarkerBlob color={p.accent} opacity={0.88} style={{ width: 1500, height: 740, left: 220, top: 192 }} />
      <DoodleEyes style={{ width: 250, height: 142, right: 180, top: 142, transform: "rotate(9deg)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 12%", textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <h1 style={{ margin: 0, maxWidth: 1420, fontSize: 108, fontWeight: 950, letterSpacing: "-0.08em", lineHeight: 0.96, ...gradientTextStyle(titleGradient) }}>{scene.title}</h1>
        {scene.definition ? <div style={{ maxWidth: 1220, marginTop: 34, fontSize: 50, fontWeight: 900, lineHeight: 1.18 }}>{scene.definition as string}</div> : null}
        <div style={{ width: "100%", maxWidth: 1080, marginTop: 46 }}><StepList steps={points} accent={p.accent} text={ink} fontFamily={p.fontFamily} fontSize={48} /></div>
      </div>
    </AbsoluteFill>
  );
};

/** ③ 拆解：将一条新闻还原成三次明确的判断。 */
const EvidenceBeat: BeatRenderer = ({ scene, p, frame }) => {
  const steps = (scene.steps as string[]) || [];
  const x = interpolate(frame, [0, 16], [-36, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <div style={{ position: "absolute", right: 78, top: 92, color: p.accent, fontSize: 360, lineHeight: 0.7, fontWeight: 950, letterSpacing: "-0.16em", transform: "rotate(8deg)", opacity: 0.95 }}>?</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 86, padding: "0 10%", transform: `translateX(${x}px)` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, marginBottom: 50, maxWidth: 1040, fontSize: 92, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.94, ...gradientTextStyle(titleGradient) }}>{scene.title}</h2>
          <StepList steps={steps} accent={p.accent} text={ink} fontFamily={p.fontFamily} />
        </div>
        <PaperCard p={p} width={430} rotation={4} style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 48, lineHeight: 1, fontWeight: 950 }}>别被标题带走</div>
          <div style={{ marginTop: 28, fontSize: 116, lineHeight: 0.86, letterSpacing: "-0.1em", fontWeight: 950, color: p.accent }}>WHY?</div>
          <div style={{ marginTop: 28, fontSize: 48, lineHeight: 1.18, fontWeight: 900 }}>看它改变了什么，而不只是它宣布了什么。</div>
        </PaperCard>
      </div>
    </AbsoluteFill>
  );
};

/** ④ 案例：把抽象新闻落到一张醒目的案件卡，不造假界面或指标。 */
const ExampleBeat: BeatRenderer = ({ scene, p, frame }) => {
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <MarkerBlob color={p.accent} style={{ width: 940, height: 700, right: 46, top: 202, transform: "rotate(6deg)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 68, padding: "0 10%", opacity }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ maxWidth: 900, margin: 0, fontSize: 92, fontWeight: 950, letterSpacing: "-0.08em", lineHeight: 0.94, ...gradientTextStyle(titleGradient) }}>{scene.title}</h2>
          {scene.narration ? <div style={{ marginTop: 36, maxWidth: 820, fontSize: 48, lineHeight: 1.18, fontWeight: 900 }}>{scene.narration}</div> : null}
          <DoodleArrow color={p.accent} style={{ width: 660, height: 200, left: 126, bottom: 114, transform: "rotate(-7deg)" }} />
        </div>
        <PaperCard p={p} width={520} style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 44, lineHeight: 1, fontWeight: 950, ...gradientTextStyle("linear-gradient(90deg, #111, #159d75)") }}>新闻现场</div>
          <div style={{ marginTop: 22, fontSize: 154, lineHeight: 0.84, color: ink, fontWeight: 950 }}>01</div>
          <div style={{ marginTop: 30, fontSize: 48, lineHeight: 1.15, fontWeight: 950 }}>这条消息，真正影响的是谁？</div>
        </PaperCard>
      </div>
    </AbsoluteFill>
  );
};

/** ⑤ 类比：将“发布会热闹”与“产业路线”放到一根箭头两端。 */
const AnalogyBeat: BeatRenderer = ({ scene, p, frame }) => {
  const source = ((scene.analogy as { source?: string; target?: string }) || {}).source || "一场发布会";
  const target = ((scene.analogy as { source?: string; target?: string }) || {}).target || "一条产业路线";
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <DoodleEyes style={{ width: 250, height: 142, left: 122, top: 112, transform: "rotate(-8deg)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 56, padding: "0 9%", opacity }}>
        <div style={{ width: 570, textAlign: "center" }}>
          <div style={{ fontSize: 56, lineHeight: 1, fontWeight: 950, ...gradientTextStyle("linear-gradient(90deg, #111, #55f436)") }}>看起来像</div>
          <div style={{ marginTop: 28, fontSize: 88, lineHeight: 0.94, fontWeight: 950, letterSpacing: "-0.08em" }}>{source}</div>
        </div>
        <DoodleArrow color={p.accent} style={{ position: "relative", width: 330, height: 170, flexShrink: 0, transform: "rotate(-7deg)" }} />
        <div style={{ width: 570, textAlign: "center" }}>
          <div style={{ fontSize: 56, lineHeight: 1, fontWeight: 950, ...gradientTextStyle("linear-gradient(90deg, #159d75, #111)") }}>其实要看</div>
          <div style={{ marginTop: 28, fontSize: 88, lineHeight: 0.94, fontWeight: 950, letterSpacing: "-0.08em" }}>{target}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ⑥ 关键信号：默认只显示分析维度；有真实数据时才绘制数据条。 */
const DataBeat: BeatRenderer = ({ scene, p, frame }) => {
  const metric = (scene.metric as { value?: string; label?: string; unit?: string }) || {};
  const rows = (scene.rows as { label: string; value: number }[]) || [];
  const points = (scene.points as string[]) || ["能力真的升级了吗", "成本真的下降了吗", "谁现在就能用上"];
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <MarkerBlob color={p.accent} opacity={0.84} style={{ width: 820, height: 820, left: 40, top: 142, transform: "rotate(-10deg)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 78, padding: "0 11%", opacity }}>
        <div style={{ width: 540, flexShrink: 0, textAlign: "center" }}>
          <div style={{ fontSize: 190, fontWeight: 950, lineHeight: 0.76, letterSpacing: "-0.12em" }}>{metric.value ? <DigitRoll color={ink} delay={16} fontSize={190} value={metric.value} /> : "3"}</div>
          <div style={{ marginTop: 30, fontSize: 56, fontWeight: 950 }}>{metric.unit || "个问题"}</div>
          <div style={{ marginTop: 22, fontSize: 44, fontWeight: 900, lineHeight: 1.16 }}>{metric.label || "判断一条新闻值不值得追"}</div>
        </div>
        <div style={{ flex: 1, maxWidth: 800 }}>
          {rows.length ? <DataBars rows={rows.map((row, index) => ({ ...row, color: index === 0 ? p.accent : ink }))} track="rgba(17,17,17,0.14)" /> : <StepList steps={points.slice(0, 3)} accent={p.accent} text={ink} fontFamily={p.fontFamily} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ⑦ 回看：将上一轮的判断落成可读的新闻编辑清单。 */
const RecapBeat: BeatRenderer = ({ scene, p, frame }) => {
  const points = ((scene.points as string[]) || ["先看发生了什么", "再看谁会受影响", "最后看什么时候兑现"]).slice(0, 3);
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity }}>
        <h2 style={{ margin: 0, fontSize: 88, fontWeight: 950, letterSpacing: "-0.08em", ...gradientTextStyle(titleGradient) }}>{scene.title}</h2>
        <div style={{ display: "flex", gap: 30, marginTop: 52 }}>
          {points.map((point, index) => {
            const delay = 20 + index * 10;
            const cardOpacity = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
            const y = interpolate(frame, [delay, delay + 12], [42, 0], clamp);
            return (
              <PaperCard key={point} p={p} width={410} delay={delay} rotation={index === 1 ? 0 : index === 0 ? -3 : 3} style={{ opacity: cardOpacity, transform: `translateY(${y}px) rotate(${index === 1 ? "0deg" : index === 0 ? "-3deg" : "3deg"})` }}>
                <div style={{ fontSize: 46, fontWeight: 950, ...gradientTextStyle("linear-gradient(90deg, #111, #159d75)") }}>0{index + 1}</div>
                <div style={{ marginTop: 28, fontSize: 48, fontWeight: 950, lineHeight: 1.08 }}>{point}</div>
              </PaperCard>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ⑧ 结论：用一条最终判断收束，并把绿色箭头推出画面。 */
const ConclusionBeat: BeatRenderer = ({ scene, p, frame }) => {
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);
  const scale = spring({ frame, fps: 30, from: 0.96, to: 1, config: { damping: 16, mass: 0.85 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...backdrop(p), color: p.text, fontFamily: p.fontFamily }}>
      <Grid color={ink} opacity={0.07} />
      <MarkerBlob color={p.accent} style={{ width: 1520, height: 700, left: 200, top: 210, transform: "rotate(3deg)" }} />
      <DoodleEyes style={{ width: 300, height: 170, right: 150, top: 94, transform: "rotate(8deg)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 13%", textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <DiagramTitle color={ink} gradient={titleGradient} fontFamily={p.fontFamily} fontSize={118} delay={0}>{scene.title}</DiagramTitle>
        <GlowProgress color={p.accent} />
      </div>
      <DoodleArrow color={p.accent} style={{ width: 690, height: 190, left: 615, bottom: 54, transform: "rotate(-4deg)" }} />
    </AbsoluteFill>
  );
};

/** 科技新闻解读的全部 beat 渲染器表：每个镜头只有一个清晰的信息主角。 */
export const FACELESS_EXPLAINER_BEATS: Record<string, BeatRenderer> = {
  hook: HookBeat,
  concept: ConceptBeat,
  evidence: EvidenceBeat,
  example: ExampleBeat,
  analogy: AnalogyBeat,
  data: DataBeat,
  recap: RecapBeat,
  conclusion: ConclusionBeat,
};

export type { BeatContext };
