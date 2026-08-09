/**
 * [INPUT]: 依赖共享 SceneEngine、product-launch 的 beat 渲染器、内置调色板与 HTML-in-Canvas 舞台
 * [OUTPUT]: 对外提供 PRODUCT_LAUNCH_PALETTE、buildProductLaunchScenes、buildProductLaunchStagePlan 与 ProductLaunchVideo
 * [POS]: scenarios/product-launch 的模板代码。场景自带一套内置视觉（palette + beats + 默认 SCENES），
 *        AI 直接参考本文件实现；本模板是视觉与叙事的完整选择，不依赖独立设计系统。
 *        叙事序列：hook → pain → contrast → feature×2 → metric → ui-detail（HTML-in-Canvas
 *        click → magnify 特写）→ feature → testimonial → metric → roadmap → cta。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { useVideoConfig } from "remotion";
import { SceneEngine } from "../../_shared/SceneEngine";
import { PRODUCT_LAUNCH_BEATS, PRODUCT_LAUNCH_UI_GEOMETRY } from "../beats";
import { HtmlCanvasVideoStage } from "../../../html-canvas/HtmlCanvasVideoStage";
import type { StagePlan } from "../../../html-canvas/types";
import type { Scene } from "../../_shared/types";
import type { Palette } from "../../../palette";

/** 产品发布的内置调色板：深紫夜底 + 青/洋红霓虹强调（高能、玻璃、发光的产品发布视觉）。 */
export const PRODUCT_LAUNCH_PALETTE: Palette = {
  background: "#10002c",
  primary: "#ffffff",
  accent: "#8af4ff",
  text: "#ffffff",
  fontFamily: "'Inter', system-ui, 'PingFang SC', 'Noto Sans SC', sans-serif",
  captionTheme: "hustle",
  captionPrimary: "#ffffff",
  captionSecondary: "#ff8ace",
  effectId: "gradient-shift",
};

export interface ProductLaunchVideoProps {
  topic?: string;
  productName?: string;
  scenes?: Scene[];
  resolveMediaUrl?: (assetId: string) => string | undefined;
  bgmAssetId?: string | null;
  /** HTML-in-Canvas 舞台计划；undefined = 启用内置 click→magnify 用例，null = 关闭。 */
  stagePlan?: StagePlan | null;
}

/** 产品发布默认 SCENES 全长（秒）：hook 5 + pain 5 + contrast 6 + feature×2 6 + metric 5 + ui-detail 6 + feature 6 + testimonial 5 + metric 5 + roadmap 5 + cta 6 = 66s。 */
export const PRODUCT_LAUNCH_DURATION_SEC = 66;

/** 产品发布的默认 SCENES：承诺 → 痛点 → 对比 → 功能证据×3 → 数据×2 → UI 特写 → 证言 → 路线 → CTA。 */
export const buildProductLaunchScenes = (props?: { topic?: string; productName?: string }): Scene[] => {
  const topic = props?.topic || "把结果，先讲出来";
  const product = props?.productName || "你的产品";
  return [
    { id: "hook", kind: "hook", title: topic, kicker: "RESULT · FIRST", subtitle: `${product} 先证明它能兑现的承诺`, durationSec: 5 },
    { id: "pain", kind: "pain", title: "现在的成本，比想象更高", kicker: "01 · 痛点", subtitle: "团队被困在重复劳动与低效流程里，时间一点点流失。", points: ["重复劳动 · 低效流程", "错误反复发生", "决策没有依据"], durationSec: 5 },
    { id: "contrast", kind: "contrast", title: "改变，从这里开始", kicker: "02 · 对比", contrast: { before: "重复劳动 · 低效流程", after: "一键自动化 · 数据驱动" }, durationSec: 6 },
    { id: "feature-1", kind: "feature", title: "一键自动化", kicker: "03 · 功能", points: ["把重复步骤交给系统", "错误率降到接近零", "上线即可看到变化"], durationSec: 6 },
    { id: "feature-2", kind: "feature", title: "数据驱动决策", kicker: "04 · 功能", points: ["实时看板展示关键指标", "每个数字都可下钻", "决策有据可依"], durationSec: 6 },
    { id: "metric-1", kind: "metric", title: "看得见的结果", kicker: "05 · 数据", metric: { value: "83", unit: "%", label: "平均效率提升" }, durationSec: 5 },
    { id: "ui-detail", kind: "ui-detail", title: "导出画质，一键开启", kicker: "06 · UI", ctaLabel: "导出", durationSec: 6 },
    { id: "feature-3", kind: "feature", title: "团队协作", kicker: "07 · 功能", points: ["所有人共享同一份真相", "权限与流程清晰", "交接零损耗"], durationSec: 6 },
    { id: "testimonial", kind: "testimonial", title: "客户怎么说", kicker: "08 · 证言", quote: "真正改变了我们的工作方式。", author: "产品负责人 · 已确认客户", durationSec: 5 },
    { id: "metric-2", kind: "metric", title: "回报", kicker: "09 · 数据", metric: { value: "3.2", unit: "×", label: "投入回报，来自已确认的客户数据" }, durationSec: 5 },
    { id: "roadmap", kind: "roadmap", title: "下一步", kicker: "10 · 路线", steps: ["今天接入", "30 天见效", "持续优化"], durationSec: 5 },
    { id: "cta", kind: "cta", title: "现在开始", kicker: "CTA", ctaLabel: "立即体验", durationSec: 6 },
  ];
};

/** 按场景时间轴计算 ui-detail beat 的 HTML-in-Canvas 舞台计划（产品 UI 特写 click → magnify）；
 *  无 ui-detail 场景时返回 null（关闭舞台）。坐标来自 beats 的 PRODUCT_LAUNCH_UI_GEOMETRY。 */
export const buildProductLaunchStagePlan = (scenes: Scene[], fps: number): StagePlan | null => {
  const list = scenes && scenes.length ? scenes : buildProductLaunchScenes();
  const uiIndex = list.findIndex((scene) => scene.kind === "ui-detail");
  if (uiIndex < 0) return null;
  const start = Math.round(list.slice(0, uiIndex).reduce((sum, scene) => sum + (scene.durationSec || 2), 0) * fps);
  const duration = Math.max(1, Math.round((list[uiIndex].durationSec || 6) * fps));
  const exportRect = PRODUCT_LAUNCH_UI_GEOMETRY["export-button"];
  const focusRect = PRODUCT_LAUNCH_UI_GEOMETRY["focus:export-button"];
  const cx = exportRect.x + exportRect.width / 2;
  const cy = exportRect.y + exportRect.height / 2;
  const beatFrames = Math.max(1, duration - 20);
  return {
    targets: {
      "export-button": { kind: "rect", rect: exportRect, radius: 14 },
      "focus:export-button": { kind: "rect", rect: focusRect, radius: 28 },
    },
    interaction: [
      { kind: "move", frame: start + 15, x: 960, y: 900 },
      { kind: "move", frame: start + 45, x: cx, y: cy, easing: "easeInOut" },
      { kind: "hover", frame: start + 55, targetId: "export-button" },
      { kind: "click", frame: start + 70, targetId: "export-button" },
      { kind: "move", frame: start + 105, x: cx, y: cy, easing: "easeInOut" },
    ],
    effects: [
      {
        id: "cursor-director",
        scope: "video",
        effect: "cursor",
        timing: { startFrame: start, enterFrames: 8, holdFrames: Math.max(0, beatFrames - 20), exitFrames: 12 },
        zIndex: 30,
      },
      {
        id: "magnify-export",
        scope: "scene",
        effect: "magnifier",
        targetId: "export-button",
        timing: { startFrame: start + 66, enterFrames: 18, holdFrames: Math.max(0, beatFrames - 66 - 18 - 16), exitFrames: 16 },
        options: { radius: 150, zoom: 2.2, chromatic: true },
        zIndex: 10,
      },
    ],
  };
};

export const ProductLaunchVideo: React.FC<ProductLaunchVideoProps> = ({ topic, productName, scenes, resolveMediaUrl, bgmAssetId, stagePlan }) => {
  const { fps } = useVideoConfig();
  const resolvedScenes = scenes && scenes.length ? scenes : buildProductLaunchScenes({ topic, productName });
  const scene = (
    <SceneEngine
      palette={PRODUCT_LAUNCH_PALETTE}
      scenes={resolvedScenes}
      beats={PRODUCT_LAUNCH_BEATS}
      resolveMediaUrl={resolveMediaUrl}
      bgmAssetId={bgmAssetId}
    />
  );
  const plan = stagePlan === undefined ? buildProductLaunchStagePlan(resolvedScenes, fps) : stagePlan;
  return plan ? <HtmlCanvasVideoStage plan={plan}>{scene}</HtmlCanvasVideoStage> : scene;
};
