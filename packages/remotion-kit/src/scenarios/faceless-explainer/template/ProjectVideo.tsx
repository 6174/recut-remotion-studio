/**
 * [INPUT]: 依赖 Three-first GPU 合成（ThreeVideoCanvas/ShotGraph）、共享 GpuSceneEngine、
 *          faceless-explainer 的 beat 渲染器与内置调色板
 * [OUTPUT]: 对外提供 FACELESS_EXPLAINER_PALETTE、buildFacelessExplainerScenes、
 *           buildFacelessExplainerGpuPlan 与 FacelessExplainerVideo
 * [POS]: scenarios/faceless-explainer 的科技新闻模板代码（Three-first 模式）。纸面网格、marker 与大字
 *        经 HtmlSurface 光栅化为 GPU 纹理；全片用 vintage 材质提供克制的纸面纹理，hook/data 以快速倾斜落位 + Three camera 进入；不再绘制 spotlight 聚焦遮罩。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, Audio, useVideoConfig } from "remotion";
import { ShotGraph } from "../../../three";
import type { CameraMoveDescriptor, ShotGraphPlan, SurfaceMoveDescriptor } from "../../../three/types";
import { buildGpuScenePlan, createSceneContent, SceneCaptionOverlay } from "../../_shared/GpuSceneEngine";
import { FACELESS_EXPLAINER_BEATS } from "../beats";
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

/** 新闻开场一秒内落稳：先由纸面自身倾斜归正建立透视，再保留阅读时间。 */
const FACELESS_HOOK_DRIFT_CAMERA: CameraMoveDescriptor = {
  verb: "drift",
  subject: { anchor: [0.5, 0.43] },
  keyframes: [
    { at: 0, position: [-0.2, 0.14, 8.25], fov: 34 },
    { at: 0.16, position: [0.14, -0.06, 7.9], fov: 33, easing: "ease-out" },
    { at: 1, position: [0.14, -0.06, 7.9], fov: 33, easing: "linear" },
  ],
};

/** 数据段快速推到数字后静止；不使用 motion blur 侵占阅读时间。 */
const FACELESS_DATA_PUSH_CAMERA: CameraMoveDescriptor = {
  verb: "push-in",
  subject: { anchor: [0.5, 0.47] },
  keyframes: [
    { at: 0, position: [0, 0, 8.1], fov: 34 },
    { at: 0.16, position: [0.04, -0.02, 7.1], fov: 32, easing: "ease-out" },
    { at: 1, position: [0.04, -0.02, 7.1], fov: 32, easing: "linear" },
  ],
};

const FACELESS_HOOK_LAND_SURFACE: SurfaceMoveDescriptor = {
  keyframes: [
    { at: 0, position: [-0.48, 0.28, -1.05], rotation: [0.07, -0.2, -0.06], scale: [0.82, 0.82, 1], bend: 0.26 },
    { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" },
    { at: 1, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "linear" },
  ],
};

const FACELESS_DATA_LAND_SURFACE: SurfaceMoveDescriptor = {
  keyframes: [
    { at: 0, position: [0.56, -0.24, -1.18], rotation: [-0.06, 0.18, 0.04], scale: [0.8, 0.8, 1], bend: 0.3 },
    { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" },
    { at: 1, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "linear" },
  ],
};

/** 科技新闻 GPU 镜头图：全片挂 vintage，提供轻微胶片颗粒、褪色与暗角纹理。 */
export const buildFacelessExplainerGpuPlan = (scenes: Scene[], fps: number): ShotGraphPlan =>
  buildGpuScenePlan({ scenes }, fps, {
    transitionDurationFrames: 16,
    effectFor: () => "vintage",
    cameraFor: (scene) => {
      if (scene.kind === "hook") return FACELESS_HOOK_DRIFT_CAMERA;
      if (scene.kind === "data") return FACELESS_DATA_PUSH_CAMERA;
      return undefined;
    },
    surfaceFor: (scene) => {
      if (scene.kind === "hook") return FACELESS_HOOK_LAND_SURFACE;
      if (scene.kind === "data") return FACELESS_DATA_LAND_SURFACE;
      return undefined;
    },
    optionsFor: () => ({ grain: 0.075, vignette: 0.16, warmth: 0.12, fade: 0.06 }),
  });

export const FacelessExplainerVideo: React.FC<FacelessExplainerVideoProps> = ({ topic, scenes, resolveMediaUrl, bgmAssetId }) => {
  const { fps, width, height } = useVideoConfig();
  const resolvedScenes = scenes && scenes.length ? scenes : buildFacelessExplainerScenes(topic);
  const gpuPlan = buildFacelessExplainerGpuPlan(resolvedScenes, fps);
  const content = createSceneContent({
    palette: FACELESS_EXPLAINER_PALETTE,
    scenes: resolvedScenes,
    beats: FACELESS_EXPLAINER_BEATS,
    resolveMediaUrl,
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
