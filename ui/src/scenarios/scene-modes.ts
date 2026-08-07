/**
 * [INPUT]: 无运行时依赖；由 Studio 卡片和 CreationScenario 共同消费
 * [OUTPUT]: 对外提供可交付成片的场景定义、所需素材类型与对应 Agent skill id
 * [POS]: scenarios 的领域目录；把用户目标、UI 参数和 Agent 路由收敛为单一真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { MediaAsset } from "../app";

export type SceneAssetPolicy = {
  label: string;
  hint: string;
  kinds: MediaAsset["kind"][];
  required?: boolean;
};

export interface SceneMode {
  id: string;
  title: string;
  description: string;
  skill: string;
  outcome: string;
  basePrompt: string;
  asset?: SceneAssetPolicy;
}

export const SCENE_MODES: Record<string, SceneMode> = {
  "faceless-explainer": {
    id: "faceless-explainer",
    title: "无真人解说",
    description: "把选题、文章或脚本讲清楚，不依赖现成镜头。",
    skill: "faceless-explainer",
    outcome: "一支以文字、图解、数据和程序化画面讲清概念的解说片。",
    basePrompt: "请把当前 Brief 制作成无真人解说视频。用标题、图解、数据可视化和程序化视觉解释内容；先给结论或反常识钩子，再逐层拆解，最后回收为明确结论。不要假装存在人物采访、产品录屏或素材库中没有的实拍画面。",
  },
  "product-launch": {
    id: "product-launch",
    title: "产品发布片",
    description: "展示产品价值、核心功能与明确行动号召。",
    skill: "product-launch-video",
    outcome: "一支以真实产品证据为中心的发布或功能介绍短片。",
    basePrompt: "请把当前 Brief 制作成产品发布片。用“结果承诺 → 痛点 → 关键功能证据 → 收束 CTA”组织叙事；素材中有产品截图、录屏或标志时优先使用真实资产，不要手绘仿冒产品界面。每个功能只用一个可读的证据镜头。",
    asset: { label: "产品素材（可选）", hint: "可选产品截图、录屏、Logo 或演示视频；未选择时只用 Brief 中已确认的信息。", kinds: ["image", "video"] },
  },
  slideshow: {
    id: "slideshow",
    title: "图文故事",
    description: "把照片、截图或片段编排成有节奏的视觉叙事。",
    skill: "slideshow",
    outcome: "一支围绕所选图像和视频素材展开的图文叙事片。",
    basePrompt: "请围绕所选素材制作图文故事视频。先按叙事价值而非文件顺序挑选素材；每个镜头只服务一个信息点，使用克制的推近、平移或视差营造节奏，避免把素材做成无意义的自动轮播。",
    asset: { label: "图像或视频素材", hint: "至少选择一个图片或视频；Agent 只会使用这些真实素材。", kinds: ["image", "video"], required: true },
  },
  "talking-head-recut": {
    id: "talking-head-recut",
    title: "口播重剪",
    description: "围绕人物口播重新组织节奏、重点和辅助画面。",
    skill: "talking-head-recut",
    outcome: "一支保留人物为主线、由字幕和辅助画面强化重点的口播短片。",
    basePrompt: "请围绕所选口播素材重剪视频。先转录并按完整意思分段，保留说话者作为叙事锚点；用无底框逐词字幕突出少量关键短语，在合适的停顿插入素材或程序化辅助画面。不要伪造说话者动作、口型或新的人脸画面。",
    asset: { label: "口播视频", hint: "选择一个单一主体、音频清晰的口播视频。", kinds: ["video"], required: true },
  },
  "music-visual": {
    id: "music-visual",
    title: "音乐视觉化",
    description: "让音乐、歌词和画面在同一节奏上推进。",
    skill: "music-to-video",
    outcome: "一支围绕音乐节拍、歌词或情绪发展的视觉化短片。",
    basePrompt: "请围绕所选音乐制作视觉化视频。先识别段落、能量变化和可用歌词信息，再让剪辑、文字和画面强弱随段落推进；副歌或高潮只能有一个主视觉高潮，其余段落留出呼吸。没有可验证的歌词时不要编造歌词字幕。",
    asset: { label: "音乐素材", hint: "选择一首音频或带原声的视频；可在补充要求里说明歌词和目标情绪。", kinds: ["audio", "video"], required: true },
  },
  "captioned-clip": {
    id: "captioned-clip",
    title: "字幕高光片段",
    description: "把一句有价值的发言剪成更易传播的短片。",
    skill: "embedded-captions",
    outcome: "一支保留原始画面、以高可读字幕强化观点的短视频。",
    basePrompt: "请把所选音视频剪成字幕高光短片。先找一个独立、可在短时长内讲清的观点，剪掉寒暄和重复；字幕必须逐词对齐、始终可读，只有最重要的一句可做更强的视觉强调。原画面已有烧录字幕时不要叠加第二套字幕系统。",
    asset: { label: "音视频素材", hint: "选择音频清晰、内容完整的单段视频或音频。", kinds: ["video", "audio"], required: true },
  },
};
