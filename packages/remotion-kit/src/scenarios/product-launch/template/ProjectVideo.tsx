/**
 * [INPUT]: 依赖共享 SceneEngine、product-launch 的 beat 渲染器与内置调色板
 * [OUTPUT]: 对外提供 PRODUCT_LAUNCH_PALETTE（场景内置视觉）、buildProductLaunchScenes 与 ProductLaunchVideo
 * [POS]: scenarios/product-launch 的模板代码。场景自带一套内置视觉（palette + beats + 默认 SCENES），
 *        AI 直接参考本文件实现，不读全局设计系统；用户想换风格时走外层 design-system 迭代。
 *        叙事序列：hook（结果承诺）→ pain（痛点）→ feature×2（功能证据）→ metric（数据）→ cta（行动号召）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { SceneEngine } from "../../_shared/SceneEngine";
import { PRODUCT_LAUNCH_BEATS } from "../beats";
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
}

/** 产品发布的默认 SCENES 全长（秒）：hook 5 + pain 5 + contrast 6 + feature×2 6 + metric 5 + feature 6 + testimonial 5 + metric 5 + roadmap 5 + cta 6 = 60s。 */
export const PRODUCT_LAUNCH_DURATION_SEC = 60;

/** 产品发布的默认 SCENES：承诺 → 痛点 → 对比 → 功能证据×3 → 数据×2 → 证言 → 路线 → CTA。 */
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
    { id: "feature-3", kind: "feature", title: "团队协作", kicker: "06 · 功能", points: ["所有人共享同一份真相", "权限与流程清晰", "交接零损耗"], durationSec: 6 },
    { id: "testimonial", kind: "testimonial", title: "客户怎么说", kicker: "07 · 证言", quote: "真正改变了我们的工作方式。", author: "产品负责人 · 已确认客户", durationSec: 5 },
    { id: "metric-2", kind: "metric", title: "回报", kicker: "08 · 数据", metric: { value: "3.2", unit: "×", label: "投入回报，来自已确认的客户数据" }, durationSec: 5 },
    { id: "roadmap", kind: "roadmap", title: "下一步", kicker: "09 · 路线", steps: ["今天接入", "30 天见效", "持续优化"], durationSec: 5 },
    { id: "cta", kind: "cta", title: "现在开始", kicker: "CTA", ctaLabel: "立即体验", durationSec: 6 },
  ];
};

export const ProductLaunchVideo: React.FC<ProductLaunchVideoProps> = ({ topic, productName, scenes, resolveMediaUrl, bgmAssetId }) => (
  <SceneEngine
    palette={PRODUCT_LAUNCH_PALETTE}
    scenes={scenes && scenes.length ? scenes : buildProductLaunchScenes({ topic, productName })}
    beats={PRODUCT_LAUNCH_BEATS}
    resolveMediaUrl={resolveMediaUrl}
    bgmAssetId={bgmAssetId}
  />
);
