/**
 * [INPUT]: 依赖共享 SceneEngine、doodle-explainer 的 beat 渲染器与手绘速写本内置调色板
 * [OUTPUT]: 对外提供 DOODLE_EXPLAINER_PALETTE（速写本视觉）、buildDoodleExplainerScenes 与 DoodleExplainerVideo
 * [POS]: scenarios/doodle-explainer 的白板涂鸦讲解模板代码。场景自带内置 palette（来自全局
 *        doodle 设计系统的 token）+ beats + 默认 SCENES，用 roughjs 手绘原语把抽象概念画清楚；
 *        替换内容不替换视觉语法。叙事序列：hook（画出来）→ concept（核心定义）→ sketch（步骤拆解）
 *        → example（具体例子）→ analogy（类比）→ data（信号）→ recap（便签收束）→ conclusion（结论）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { SceneEngine } from "../../_shared/SceneEngine";
import { DOODLE_EXPLAINER_BEATS } from "../beats";
import { HtmlCanvasVideoStage } from "../../../html-canvas/HtmlCanvasVideoStage";
import type { StagePlan } from "../../../html-canvas/types";
import type { Scene } from "../../_shared/types";
import type { Palette } from "../../../palette";

/** 白板涂鸦讲解的内置调色板：暖纸速写本 + 墨色 + 橙色 marker（对齐全局 doodle 设计系统 token）。 */
export const DOODLE_EXPLAINER_PALETTE: Palette = {
  background: "#fff8d7",
  primary: "#1d1836",
  accent: "#ff6b00",
  text: "#1d1836",
  fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Trebuchet MS', 'PingFang SC', 'Noto Sans SC', sans-serif",
  captionTheme: "grape",
  captionPrimary: "#1d1836",
  captionSecondary: "#ff6b00",
  effectId: "none",
};

export interface DoodleExplainerVideoProps {
  topic?: string;
  scenes?: Scene[];
  resolveMediaUrl?: (assetId: string) => string | undefined;
  bgmAssetId?: string | null;
  /** HTML-in-Canvas 舞台计划；undefined = 启用内置 cursor+focus 用例，null = 关闭。 */
  stagePlan?: StagePlan | null;
}

/** 默认 SCENES 全长（秒）：hook 5 + concept 6 + sketch 6 + example 5 + analogy 5 + data 6 + recap 6 + conclusion 5 = 44s。 */
export const DOODLE_EXPLAINER_DURATION_SEC = 44;

/** 白板涂鸦讲解默认 SCENES：把一个抽象概念画成一页能读完的速写本。 */
export const buildDoodleExplainerScenes = (topic?: string): Scene[] => [
  { id: "hook", kind: "hook", title: topic || "把抽象概念，画出来就懂了", subtitle: "一支笔 + 一页速写本，把复杂的事讲成看得见的步骤。", kicker: "SKETCHBOOK · IDEA", durationSec: 5 },
  { id: "concept", kind: "concept", title: "先给概念画一个形状", kicker: "01 · 核心概念", definition: "一个抽象概念，值得先被看见：先圈出它解决什么问题，再展开怎么做到。", points: ["它解决什么问题", "它改变什么", "它不做什么"], durationSec: 6 },
  { id: "sketch", kind: "sketch", title: "拆成三步，一步步画", kicker: "02 · 步骤拆解", steps: ["起点：它从哪里来", "过程：关键动作", "结果：它带来什么"], durationSec: 6 },
  { id: "example", kind: "example", title: "用一个具体例子收束", kicker: "03 · 具体例子", narration: "抽象概念一旦落在一个能想象的例子上，观众就真的懂了。", example: "把「用户增长」画成「楼下水果店的回头客」", durationSec: 5 },
  { id: "analogy", kind: "analogy", title: "换一个角度再看", kicker: "04 · 类比", analogy: { source: "一场发布会", target: "一条产业路线" }, durationSec: 5 },
  { id: "data", kind: "data", title: "三条信号判断分量", kicker: "05 · 看数据", metric: { value: "3", unit: "个信号", label: "判断一个概念值不值得追" }, points: ["真的解决了吗", "成本降了吗", "现在能用上吗"], durationSec: 6 },
  { id: "recap", kind: "recap", title: "收进三张便签", kicker: "06 · 收束", points: ["画出一个形状", "拆成三步", "配一个例子"], durationSec: 6 },
  { id: "conclusion", kind: "conclusion", title: "复杂的事，一笔一笔画清楚", kicker: "THE TAKEAWAY", durationSec: 5 },
];

/** 白板涂鸦默认 SCENES 全长（帧，30fps）：hook 0–150 / concept 150–330 / sketch 330–510 / example 510–660 / analogy 660–810 / data 810–990 / recap 990–1170 / conclusion 1170–1320。 */
export const DOODLE_EXPLAINER_STAGE_PLAN: StagePlan = {
  targets: {
    "conclusion-title": { kind: "rect", rect: { x: 260, y: 380, width: 1400, height: 320 }, radius: 40 },
  },
  interaction: [
    { kind: "move", frame: 36, x: 240, y: 900 },
    { kind: "move", frame: 1195, x: 960, y: 520, easing: "easeInOut" },
    { kind: "hover", frame: 1210, targetId: "conclusion-title" },
    { kind: "click", frame: 1224, targetId: "conclusion-title" },
  ],
  effects: [
    { id: "cursor-director", scope: "video", effect: "cursor", timing: { startFrame: 0, enterFrames: 8, holdFrames: 1300, exitFrames: 12 }, zIndex: 30 },
    { id: "focus-conclusion", scope: "scene", effect: "focus-spotlight", targetId: "conclusion-title", timing: { startFrame: 1214, enterFrames: 20, holdFrames: 50, exitFrames: 20 }, options: { dim: 0.55, edge: true }, zIndex: 10 },
    { id: "paper-grain", scope: "video", effect: "ambient", timing: { startFrame: 0, enterFrames: 20, holdFrames: 1280, exitFrames: 20 }, options: { grain: 0.035, vignette: 0.12 }, zIndex: 5 },
  ],
};

export const DoodleExplainerVideo: React.FC<DoodleExplainerVideoProps> = ({ topic, scenes, resolveMediaUrl, bgmAssetId, stagePlan }) => {
  const scene = (
    <SceneEngine
      palette={DOODLE_EXPLAINER_PALETTE}
      scenes={scenes && scenes.length ? scenes : buildDoodleExplainerScenes(topic)}
      beats={DOODLE_EXPLAINER_BEATS}
      resolveMediaUrl={resolveMediaUrl}
      bgmAssetId={bgmAssetId}
    />
  );
  const plan = stagePlan === undefined ? DOODLE_EXPLAINER_STAGE_PLAN : stagePlan;
  return plan ? <HtmlCanvasVideoStage plan={plan}>{scene}</HtmlCanvasVideoStage> : scene;
};
