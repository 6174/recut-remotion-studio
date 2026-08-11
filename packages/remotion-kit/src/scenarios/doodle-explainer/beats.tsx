/**
 * [INPUT]: 依赖场景 beat 类型、doodle-explainer 调色板、Remotion 帧时钟与手绘速写本视觉原语
 * [OUTPUT]: 对外提供白板涂鸦讲解的 beat 渲染器表（DOODLE_EXPLAINER_BEATS）
 * [POS]: scenarios/doodle-explainer 的镜头组合层。每个 beat 只讲一个新信息，全部图形来自
 *        roughjs（固定 seed）生成的手绘原语；一个 beat 只有一个眼睛该看的对象。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { DigitRoll } from "../../components";
import type { BeatContext, BeatRenderer } from "../_shared/types";
import {
  ACCENT,
  clamp,
  DotGrid,
  INK,
  PAPER,
  Sketch,
  SketchBars,
  SketchBox,
  SketchChip,
  SketchHighlight,
  SketchNote,
  SketchProgress,
  SketchSteps,
  SketchTitle,
  roughCurveArrow,
  roughCurve,
  roughEllipse,
  roughRect,
} from "./primitives";

const HAND = "'Comic Sans MS', 'Chalkboard SE', 'PingFang SC', 'Noto Sans SC', sans-serif";

/** ① 开场钩子：手绘大标题 + 涂鸦下划线 + 一支笔尖在「画」。 */
const HookBeat: BeatRenderer = ({ scene, p, frame }) => {
  const penX = interpolate(frame, [10, 90], [80, 560], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <Sketch frame={frame} delay={4} paths={roughEllipse(201, 1760, 250, 260, 210, { stroke: ACCENT, strokeWidth: 10 })} />
      <Sketch frame={frame} delay={8} duration={30} paths={roughRect(202, 90, 90, 1740, 840, { stroke: INK, strokeWidth: 9, fill: "#fffdf5", fillStyle: "solid" })} />
      <div style={{ position: "absolute", top: 120, left: 150, transform: "rotate(-1.2deg)" }}>
        <SketchChip seed={203} frame={frame} delay={6}>{scene.kicker || "SKETCHBOOK · IDEA"}</SketchChip>
      </div>
      <div style={{ position: "absolute", top: 300, left: 190, maxWidth: 1420, transform: "rotate(-1deg)" }}>
        <SketchTitle fontSize={120} fontFamily={HAND} underlineSeed={204} underlineColor={ACCENT}>
          {scene.title}
        </SketchTitle>
        {scene.subtitle ? <div style={{ marginTop: 42, maxWidth: 1160, fontSize: 44, fontWeight: 900, lineHeight: 1.3 }}>{scene.subtitle as string}</div> : null}
      </div>
      <Sketch frame={frame} delay={16} duration={34} paths={roughCurveArrow(205, [[1640, 790], [1710, 690], [1640, 570], [1480, 500]], { stroke: ACCENT, strokeWidth: 10, arrowhead: 84 })} />
      <div style={{ position: "absolute", left: 90, top: 830, fontSize: 44, fontWeight: 950, color: ACCENT, transform: "rotate(-4deg)", opacity: interpolate(frame, [20, 34], [0, 1], clamp) }}>画出来，就懂了</div>
      <Sketch frame={frame} delay={20} duration={30} paths={roughCurve(206, [[90, 940], [220, 955], [340, 938], [470, 952], [600, 940]], { stroke: INK, strokeWidth: 9 })} />
      <div style={{ position: "absolute", left: 600, top: 900, fontSize: 62, fontWeight: 950, color: INK, transform: `translateX(${penX}px)` }}>✎</div>
    </AbsoluteFill>
  );
};

/** ② 核心视角：中心大定义被手绘高亮，三枚手绘标签错峰落定。 */
const ConceptBeat: BeatRenderer = ({ scene, p, frame }) => {
  const points = (scene.points as string[]) || [];
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <div style={{ position: "absolute", top: 90, left: 150 }}><SketchChip seed={301} frame={frame} delay={6}>{scene.kicker || "01 · 核心概念"}</SketchChip></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 12%", opacity }}>
        <SketchHighlight seed={302} frame={frame} delay={8} style={{ fontSize: 88, fontWeight: 950, color: INK, textAlign: "center" }}>
          {scene.title}
        </SketchHighlight>
        {scene.definition ? <div style={{ maxWidth: 1280, marginTop: 44, fontSize: 46, fontWeight: 900, lineHeight: 1.3, textAlign: "center" }}>{scene.definition as string}</div> : null}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22, marginTop: 54 }}>
          {points.map((point, index) => (
            <SketchBox
              key={point}
              seed={310 + index}
              w={Math.max(250, point.length * 52)}
              h={86}
              frame={frame}
              delay={22 + index * 10}
              duration={22}
              stroke={INK}
              strokeWidth={7}
              rotation={index === 1 ? 1.5 : index === 0 ? -1.5 : 0}
            >
              <span style={{ fontSize: 34, fontWeight: 950, color: INK, padding: "0 34px" }}>{point}</span>
            </SketchBox>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ③ 步骤拆解：把抽象概念画成三张手绘步骤，箭头把它们连起来。 */
const SketchBeat: BeatRenderer = ({ scene, p, frame }) => {
  const steps = (scene.steps as string[]) || [];
  const x = interpolate(frame, [0, 18], [-40, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <div style={{ position: "absolute", top: 90, left: 150 }}><SketchChip seed={401} frame={frame} delay={6}>{scene.kicker || "02 · 一步步画"}</SketchChip></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 60, padding: "0 9%", transform: `translateX(${x}px)` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SketchTitle fontSize={88} fontFamily={HAND} underlineSeed={402} underlineColor={ACCENT}>{scene.title}</SketchTitle>
          <div style={{ marginTop: 54 }}>
            <SketchSteps steps={steps} accent={ACCENT} text={INK} fontFamily={HAND} startFrame={20} />
          </div>
        </div>
        <div style={{ flexShrink: 0, position: "relative", width: 520, height: 460 }}>
          <Sketch frame={frame} delay={16} duration={40} paths={roughRect(403, 0, 0, 520, 460, { stroke: ACCENT, strokeWidth: 9, fill: "#fffdf5", fillStyle: "solid" })} viewBox="0 0 520 460" style={{ width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 46, fontWeight: 950, color: ACCENT, transform: "rotate(-3deg)" }}>STEP BY STEP</div>
            <Sketch frame={frame} delay={24} duration={30} paths={roughCurveArrow(404, [[100, 360], [180, 300], [320, 315], [420, 230]], { stroke: INK, strokeWidth: 8, arrowhead: 56 })} viewBox="0 0 520 460" style={{ width: "100%", height: "100%" }} />
            <div style={{ fontSize: 130, lineHeight: 1, fontWeight: 950, color: INK }}>?</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ④ 具体例子：一张手绘便签卡，把抽象落成一句可感知的话。 */
const ExampleBeat: BeatRenderer = ({ scene, p, frame }) => {
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <div style={{ position: "absolute", top: 90, left: 150 }}><SketchChip seed={501} frame={frame} delay={6}>{scene.kicker || "03 · 举个例子"}</SketchChip></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 70, padding: "0 10%", opacity }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SketchTitle fontSize={92} fontFamily={HAND} underlineSeed={502} underlineColor={ACCENT}>{scene.title}</SketchTitle>
          {scene.narration ? <div style={{ marginTop: 36, maxWidth: 860, fontSize: 44, lineHeight: 1.3, fontWeight: 900 }}>{scene.narration}</div> : null}
          <div style={{ position: "relative", width: "100%", height: 150, marginTop: 24 }}>
            <Sketch frame={frame} delay={20} duration={30} paths={roughCurveArrow(503, [[100, 110], [230, 155], [420, 125], [610, 70]], { stroke: ACCENT, strokeWidth: 9, arrowhead: 72 })} viewBox="0 0 860 180" style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
        <SketchNote seed={504} w={560} h={430} frame={frame} delay={16} rotation={2.4}>
          <div style={{ fontSize: 32, lineHeight: 1, fontWeight: 950, color: ACCENT }}>FOR EXAMPLE</div>
          <div style={{ marginTop: 26, fontSize: 46, lineHeight: 1.18, fontWeight: 950, color: INK }}>{String(scene.example || "一个具体的、能立刻想象的例子。")}</div>
        </SketchNote>
      </div>
    </AbsoluteFill>
  );
};

/** ⑤ 类比：左边「看起来像」，中间手绘箭头，右边「其实是」——两根手绘框。 */
const AnalogyBeat: BeatRenderer = ({ scene, p, frame }) => {
  const source = ((scene.analogy as { source?: string; target?: string }) || {}).source || "一场发布会";
  const target = ((scene.analogy as { source?: string; target?: string }) || {}).target || "一条产业路线";
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <div style={{ position: "absolute", top: 90, right: 150 }}><SketchChip seed={601} frame={frame} delay={6}>{scene.kicker || "04 · 换个角度"}</SketchChip></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 40, padding: "0 8%", opacity }}>
        <SketchBox seed={602} w={560} h={430} frame={frame} delay={12} stroke={INK} strokeWidth={8} rotation={-1.6}>
          <div style={{ textAlign: "center", padding: "0 36px" }}>
            <div style={{ fontSize: 34, fontWeight: 950, color: ACCENT }}>看起来像</div>
            <div style={{ marginTop: 30, fontSize: 78, lineHeight: 1.02, fontWeight: 950, color: INK }}>{source}</div>
          </div>
        </SketchBox>
        <Sketch frame={frame} delay={30} duration={36} paths={roughCurveArrow(603, [[40, 210], [100, 120], [200, 130], [260, 180]], { stroke: ACCENT, strokeWidth: 10, arrowhead: 70 })} viewBox="0 0 300 300" style={{ position: "relative", width: 300, height: 300, transform: "rotate(-6deg)" }} />
        <SketchBox seed={604} w={560} h={430} frame={frame} delay={24} stroke={ACCENT} strokeWidth={8} fill={ACCENT} fillOpacity={0.08} rotation={1.8}>
          <div style={{ textAlign: "center", padding: "0 36px" }}>
            <div style={{ fontSize: 34, fontWeight: 950, color: ACCENT }}>其实要看</div>
            <div style={{ marginTop: 30, fontSize: 78, lineHeight: 1.02, fontWeight: 950, color: INK }}>{target}</div>
          </div>
        </SketchBox>
      </div>
    </AbsoluteFill>
  );
};

/** ⑥ 数据/信号：超大手绘数字或数据条，只显示真实数据。 */
const DataBeat: BeatRenderer = ({ scene, p, frame }) => {
  const metric = (scene.metric as { value?: string; label?: string; unit?: string }) || {};
  const rows = (scene.rows as { label: string; value: number }[]) || [];
  const points = (scene.points as string[]) || ["能力真的升级了吗", "成本真的下降了吗", "谁现在就能用上"];
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <Sketch frame={frame} delay={4} paths={roughEllipse(701, 1500, 250, 420, 400, { stroke: ACCENT, strokeWidth: 9 })} />
      <div style={{ position: "absolute", top: 90, left: 150 }}><SketchChip seed={702} frame={frame} delay={6}>{scene.kicker || "05 · 看数据"}</SketchChip></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 80, padding: "0 11%", opacity }}>
        <div style={{ width: 560, flexShrink: 0, textAlign: "center" }}>
          <div style={{ position: "relative", height: 420 }}>
            <Sketch frame={frame} delay={10} duration={30} paths={roughEllipse(703, 280, 210, 270, 190, { stroke: INK, strokeWidth: 8 })} viewBox="0 0 560 420" style={{ width: "100%", height: "100%" }} />
            <div style={{ position: "relative", zIndex: 1, paddingTop: 92 }}>
            <div style={{ fontSize: 200, fontWeight: 950, lineHeight: 0.78, color: INK, letterSpacing: "-0.1em" }}>
              {metric.value ? <DigitRoll color={INK} delay={16} fontSize={200} value={metric.value} /> : "3"}
            </div>
            <div style={{ marginTop: 34, fontSize: 52, fontWeight: 950, color: ACCENT }}>{metric.unit || "个信号"}</div>
            <div style={{ marginTop: 20, fontSize: 38, fontWeight: 900, lineHeight: 1.15, color: INK }}>{metric.label || "判断一件事值不值得追"}</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: 820 }}>
          {rows.length ? <SketchBars rows={rows.map((row, index) => ({ ...row, color: index === 0 ? ACCENT : INK }))} frame={frame} /> : <SketchSteps steps={points.slice(0, 3)} accent={ACCENT} text={INK} fontFamily={HAND} startFrame={22} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ⑦ 收束：三张手绘便签错峰落下，把方法压成清单。 */
const RecapBeat: BeatRenderer = ({ scene, p, frame }) => {
  const points = ((scene.points as string[]) || ["先看发生了什么", "再看谁会受影响", "最后看什么时候兑现"]).slice(0, 3);
  const opacity = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <div style={{ position: "absolute", top: 90, left: 150 }}><SketchChip seed={801} frame={frame} delay={6}>{scene.kicker || "06 · 收进便签"}</SketchChip></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity }}>
        <SketchTitle fontSize={76} fontFamily={HAND} underlineSeed={802} underlineColor={ACCENT}>{scene.title}</SketchTitle>
        <div style={{ display: "flex", gap: 44, marginTop: 64 }}>
          {points.map((point, index) => (
            <SketchNote
              key={point}
              seed={810 + index}
              w={430}
              h={300}
              frame={frame}
              delay={20 + index * 12}
              rotation={index === 1 ? 1.6 : index === 0 ? -3.2 : 3}
            >
              <div style={{ fontSize: 32, fontWeight: 950, color: ACCENT }}>0{index + 1}</div>
              <div style={{ marginTop: 24, fontSize: 42, fontWeight: 950, lineHeight: 1.1, color: INK }}>{point}</div>
            </SketchNote>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** ⑧ 结论：最后一句判断 + 手绘进度条。 */
const ConclusionBeat: BeatRenderer = ({ scene, p, frame }) => {
  const opacity = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER, color: INK, fontFamily: HAND }}>
      <DotGrid />
      <Sketch frame={frame} delay={4} paths={roughEllipse(901, 1560, 300, 320, 260, { stroke: ACCENT, strokeWidth: 10 })} />
      <div style={{ position: "absolute", top: 90, left: 150 }}><SketchChip seed={902} frame={frame} delay={6}>{scene.kicker || "THE TAKEAWAY"}</SketchChip></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 13%", textAlign: "center", opacity }}>
        <SketchTitle fontSize={104} fontFamily={HAND} underlineSeed={903} underlineColor={ACCENT} delay={10}>
          {scene.title}
        </SketchTitle>
        <SketchProgress color={ACCENT} delay={34} />
      </div>
      <Sketch frame={frame} delay={16} duration={30} paths={roughCurveArrow(904, [[1570, 820], [1730, 790], [1760, 640], [1640, 500]], { stroke: ACCENT, strokeWidth: 10, arrowhead: 82 })} />
    </AbsoluteFill>
  );
};

/** 白板涂鸦讲解的全部 beat 渲染器表。 */
export const DOODLE_EXPLAINER_BEATS: Record<string, BeatRenderer> = {
  hook: HookBeat,
  concept: ConceptBeat,
  sketch: SketchBeat,
  example: ExampleBeat,
  analogy: AnalogyBeat,
  data: DataBeat,
  recap: RecapBeat,
  conclusion: ConclusionBeat,
};

export type { BeatContext };
