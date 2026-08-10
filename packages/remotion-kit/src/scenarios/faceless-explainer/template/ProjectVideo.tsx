/**
 * [INPUT]: 依赖 Three-first GPU 合成（ThreeVideoCanvas/ShotGraph）、共享 GpuSceneEngine、
 *          faceless-explainer 的 beat 渲染器与内置调色板
 * [OUTPUT]: 对外提供 FACELESS_EXPLAINER_PALETTE、buildFacelessExplainerScenes、FACELESS_EXPLAINER_STAGE_PLAN、
 *           buildFacelessExplainerGpuPlan 与 FacelessExplainerVideo
 * [POS]: scenarios/faceless-explainer 的科技新闻模板代码（Three-first 模式）。内容层（纸面网格、
 *        marker、大字）经 HtmlSurface 光栅化为 GPU 纹理；evidence 镜头用 article-highlight 材质保持中心
 *        锐利；concept/data 入场用 bend 转场；hover/focus 交互作为内容表面的 React overlay 与排版同帧。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, Audio, useVideoConfig } from "remotion";
import { ShotGraph } from "../../../three";
import type { ShotGraphPlan } from "../../../three/types";
import { buildGpuScenePlan, createSceneContent, SceneCaptionOverlay } from "../../_shared/GpuSceneEngine";
import { FACELESS_EXPLAINER_BEATS } from "../beats";
import type { StagePlan } from "../../../html-canvas/types";
import type { Scene } from "../../_shared/types";
import type { Palette } from "../../../palette";

/** 科技新闻解读的内置调色板：暖白到冷青渐变网格纸 + 荧光绿 marker + 渐变超大字。 */
export const FACELESS_EXPLAINER_PALETTE: Palette = {
  background: "#fffdf7",
  primary: "#111111",
  accent: "#55f436",
  text: "#111111",
  fontFamily: "'Arial Black', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
  captionTheme: "beast",
  captionPrimary: "#111111",
  captionSecondary: "#55f436",
  effectId: "none",
};

export interface FacelessExplainerVideoProps {
  topic?: string;
  scenes?: Scene[];
  resolveMediaUrl?: (assetId: string) => string | undefined;
  bgmAssetId?: string | null;
  /** 帧驱动互动脚本 + 目标几何；undefined = 启用内置 hover→focus 用例，null = 关闭。 */
  stagePlan?: StagePlan | null;
}

/** 无真人解说的默认 SCENES 全长（秒）：hook 5 + concept 6 + evidence 6 + evidence 6 + example 5 + analogy 5 + example 5 + data 6 + recap 6 + conclusion 5 = 55s。 */
export const FACELESS_EXPLAINER_DURATION_SEC = 55;

/** 科技新闻默认 SCENES：一条每日科技新闻，按“发生什么 → 为什么重要 → 该看什么”读懂。 */
export const buildFacelessExplainerScenes = (topic?: string): Scene[] => [
  { id: "hook", kind: "hook", title: topic || "今天的科技新闻，别只看标题", subtitle: "一条消息，用三个问题看懂它到底改变了什么。", kicker: "TODAY · TECH NEWS", durationSec: 5 },
  { id: "concept", kind: "concept", title: "先别急着转发", kicker: "01 · 读新闻的视角", definition: "科技新闻的价值，不在“宣布了什么”，而在“谁因此获得了新能力”。", points: ["能力变了？", "成本变了？", "谁能先用？"], durationSec: 6 },
  { id: "evidence-1", kind: "evidence", title: "先拆掉标题里的热闹", kicker: "02 · 发生了什么", steps: ["它真正发布了什么", "和上一代差在哪里", "今天能不能被使用"], durationSec: 6 },
  { id: "evidence-2", kind: "evidence", title: "再找它改变的路线", kicker: "03 · 为什么重要", steps: ["谁的工作方式会变", "成本会落在哪一段", "下一个动作可能是什么"], durationSec: 6 },
  { id: "example-1", kind: "example", title: "以“新模型发布”为例", kicker: "04 · 案例", narration: "重点不是参数有多大，而是它让什么任务第一次变得足够便宜、足够可靠。", durationSec: 5 },
  { id: "analogy", kind: "analogy", title: "换一个角度", kicker: "05 · 重新理解", analogy: { source: "一场发布会", target: "一条产业路线" }, durationSec: 5 },
  { id: "example-2", kind: "example", title: "从“很酷”追到“有用”", kicker: "06 · 继续追问", narration: "真正值得追的新闻，会在能力、价格和采用者之间留下清晰的变化。", durationSec: 5 },
  { id: "data", kind: "data", title: "三条关键信号", kicker: "07 · 值不值得追", metric: { value: "3", unit: "个问题", label: "判断一条新闻的分量" }, points: ["能力真的升级了吗", "成本真的下降了吗", "谁现在就能用上"], durationSec: 6 },
  { id: "recap", kind: "recap", title: "每天就这样读一条", kicker: "08 · 编辑清单", points: ["发生了什么", "谁会受影响", "什么时候兑现"], durationSec: 6 },
  { id: "conclusion", kind: "conclusion", title: "科技新闻的价值，在于它改变了什么", kicker: "THE TAKEAWAY", durationSec: 5 },
];

/** 科技新闻的帧驱动互动脚本（hover→focus）：claim 与 data-3 的轨迹与目标几何。
 *  效果在 GPU 路径由内容表面 overlay（focus dim + accent ring）表达，不再走 GpuCompositor。 */
export const FACELESS_EXPLAINER_STAGE_PLAN: StagePlan = {
  targets: {
    claim: { kind: "rect", rect: { x: 260, y: 320, width: 1400, height: 300 }, radius: 40 },
    "data-3": { kind: "rect", rect: { x: 720, y: 330, width: 480, height: 360 }, radius: 60 },
  },
  interaction: [
    { kind: "move", frame: 40, x: 240, y: 900 },
    { kind: "move", frame: 195, x: 960, y: 440, easing: "easeInOut" },
    { kind: "hover", frame: 210, targetId: "claim" },
    { kind: "move", frame: 430, x: 1560, y: 200, easing: "easeInOut" },
    { kind: "move", frame: 1170, x: 960, y: 500, easing: "easeInOut" },
    { kind: "hover", frame: 1185, targetId: "data-3" },
    { kind: "click", frame: 1200, targetId: "data-3" },
  ],
};

/** 科技新闻 GPU 镜头图：evidence 挂 article-highlight（中心锐利），concept/data 入场用 bend 转场。 */
export const buildFacelessExplainerGpuPlan = (scenes: Scene[], fps: number): ShotGraphPlan =>
  buildGpuScenePlan({ scenes }, fps, {
    transitionDurationFrames: 16,
    effectFor: (scene) => (scene.kind === "evidence" ? "article-highlight" : undefined),
    transitionFor: (scene) => (scene.id === "concept" || scene.id === "data" ? "bend" : undefined),
  });

export const FacelessExplainerVideo: React.FC<FacelessExplainerVideoProps> = ({ topic, scenes, resolveMediaUrl, bgmAssetId, stagePlan }) => {
  const { fps, width, height } = useVideoConfig();
  const resolvedScenes = scenes && scenes.length ? scenes : buildFacelessExplainerScenes(topic);
  const plan = stagePlan === undefined ? FACELESS_EXPLAINER_STAGE_PLAN : stagePlan;
  const gpuPlan = buildFacelessExplainerGpuPlan(resolvedScenes, fps);
  const content = createSceneContent({
    palette: FACELESS_EXPLAINER_PALETTE,
    scenes: resolvedScenes,
    beats: FACELESS_EXPLAINER_BEATS,
    resolveMediaUrl,
    interaction: plan?.interaction,
    targets: plan?.targets,
    width,
    height,
  });
  return (
    <AbsoluteFill>
      <ShotGraph
        background={FACELESS_EXPLAINER_PALETTE.background}
        plan={gpuPlan}
        renderContent={(shot) => content(shot.start + shot.frame, fps)}
      />
      <SceneCaptionOverlay scenes={resolvedScenes} palette={FACELESS_EXPLAINER_PALETTE} fps={fps} width={width} />
      {bgmAssetId && resolveMediaUrl ? <Audio src={resolveMediaUrl(bgmAssetId) || ""} /> : null}
    </AbsoluteFill>
  );
};
