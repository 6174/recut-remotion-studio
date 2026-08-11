#!/usr/bin/env node
/**
 * [INPUT]: 依赖下面的 SCENARIO_SPEC（成片模板目录）与 materials 的 registry/schema
 * [OUTPUT]: 生成 catalog.json（scenarios + captionThemes/canvasSizes/components/effects〔materials + camera〕/directives）
 * [POS]: remotion-kit 目录生成器；内联内容目录与 Three 材质注册表共同投影为 UI 目录
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT_VERSION = "0.6.0";

const readExistingCatalog = () => {
  try {
    return JSON.parse(readFileSync(join(ROOT, "catalog.json"), "utf8"));
  } catch {
    return {};
  }
};

/** 目录不能手抄 Three effect：从 TS 注册表取同一份定义，避免重新生成 catalog 时悄悄删掉材质。 */
const readMaterialSchema = () => {
  const source = readFileSync(join(ROOT, "src", "materials", "schema.ts"), "utf8")
    .replace(/^import[^\n]*\n/gm, "")
    .replace("export const MATERIAL_SCHEMA: Record<MaterialId, Record<string, MaterialParamSchema>> =", "const MATERIAL_SCHEMA =");
  return Function(`${source}\nreturn MATERIAL_SCHEMA;`)();
};

const readMaterialRegistry = (schema) => {
  const source = readFileSync(join(ROOT, "src", "materials", "registry.ts"), "utf8")
    .replace(/^import[^\n]*\n/gm, "")
    .split("export const getMaterialDefinition")[0]
    .replace("export const MATERIAL_REGISTRY: MaterialRegistry =", "const MATERIAL_REGISTRY =");
  return Function("MATERIAL_SCHEMA", `${source}\nreturn MATERIAL_REGISTRY;`)(schema);
};

const THREE_MATERIALS = Object.values(readMaterialRegistry(readMaterialSchema()));
// 场景即成片模板：brief.template 存模板 id，模板内置视觉、组件和导演规划。
const SCENARIO_SPEC = [
  {
    id: "faceless-explainer",
    label: "科技新闻解读",
    description: "把一条科技新闻拆成事实、影响与可验证的后续信号。",
    skill: "faceless-explainer",
    skillPath: "src/scenarios/faceless-explainer/SKILL.md",
    components: ["AnimatedText", "TitleSplit", "LowerThird", "StatCounter"],
    implemented: true,
    motion: "荧光绿纸面新闻钩子 → 大字号事实/影响拆解 → 三条信号 → 一句结论；网格纸、marker、箭头与眼睛建立强风格表达。",
  },
  {
    id: "product-launch",
    label: "产品发布片",
    description: "展示产品价值、核心功能与明确行动号召。",
    skill: "product-launch",
    skillPath: "src/scenarios/product-launch/SKILL.md",
    components: ["SpotlightReveal", "CardFlip", "EndCard", "DigitRoll"],
    implemented: true,
    motion: "结果承诺 → 痛点 → 功能证据 → 收束 CTA；每个功能只用一个可读的证据镜头。",
  },
  {
    id: "doodle-explainer",
    label: "白板涂鸦讲解",
    description: "用一页手绘速写本把抽象概念讲成看得见的步骤。",
    skill: "doodle-explainer",
    skillPath: "src/scenarios/doodle-explainer/SKILL.md",
    components: ["SketchBox", "SketchNote", "DigitRoll"],
    implemented: true,
    motion: "画出来 → 给形状 → 拆步骤 → 举例子 → 换角度 → 看信号 → 便签收束 → 结论；roughjs 手绘速写本 + 橙色 marker 建立强风格表达。",
  },
  {
    id: "data-briefing",
    label: "数据叙事报告",
    description: "结论、关键数字和分层图表的报告结构。",
    skill: "data-briefing",
    skillPath: "src/scenarios/data-briefing/SKILL.md",
    components: ["DigitRoll", "ChartAnimation", "ProgressBars", "StatCounter"],
    implemented: false,
    motion: "结论先行 → 数据逐项显现 → 回到行动结论；让数字承担运动。",
  },
  {
    id: "motion-explainer",
    label: "概念讲解片",
    description: "问题钩子、代码/图解证据与播放器收束的三段讲解结构。",
    skill: "motion-explainer",
    skillPath: "src/scenarios/motion-explainer/SKILL.md",
    components: ["AnimatedText", "TitleSplit", "LowerThird"],
    implemented: false,
    motion: "提问 → 拆解 → 结论；信息以可读的递进而不是装饰堆叠出现。",
  },
  {
    id: "creator-collage",
    label: "创作者拼贴板",
    description: "标题、错峰素材卡和旁白收束的观点叙事结构。",
    skill: "creator-collage",
    skillPath: "src/scenarios/creator-collage/SKILL.md",
    components: ["PhotoStack", "AnimatedList", "TextHighlight"],
    implemented: false,
    motion: "主题定调 → 灵感卡拼贴 → 一句旁白收束；像完成一面灵感墙。",
  },
  {
    id: "slideshow",
    label: "图文故事",
    description: "把照片、截图或片段编排成有节奏的视觉叙事。",
    skill: "slideshow",
    skillPath: "src/scenarios/slideshow/SKILL.md",
    components: ["GalleryGrid", "ImageCarousel", "PhotoStack"],
    implemented: false,
    motion: "先按叙事价值排序，交替使用静止、推近、平移，避免机械轮播。",
  },
  {
    id: "talking-head-recut",
    label: "口播重剪",
    description: "围绕人物口播重新组织节奏、重点和辅助画面。",
    skill: "talking-head-recut",
    skillPath: "src/scenarios/talking-head-recut/SKILL.md",
    components: ["Caption", "LowerThird", "QuoteCard"],
    implemented: false,
    motion: "转录后按完整意思分段，说话者为锚点，字幕逐词对齐，只在关键短语放大。",
  },
  {
    id: "music-visual",
    label: "音乐视觉化",
    description: "让音乐、歌词和画面在同一节奏上推进。",
    skill: "music-visual",
    skillPath: "src/scenarios/music-visual/SKILL.md",
    components: ["SoundWave", "ParticleExplosion", "RotatingCarousel"],
    implemented: false,
    motion: "先找段落与能量变化，镜头切换只在节拍节点产生节奏；副歌只设一个主视觉高潮。",
  },
  {
    id: "captioned-clip",
    label: "字幕高光片段",
    description: "把一句有价值的发言剪成更易传播的短片。",
    skill: "captioned-clip",
    skillPath: "src/scenarios/captioned-clip/SKILL.md",
    components: ["Caption", "KineticTitle", "TextHighlight"],
    implemented: false,
    motion: "先挑一段自洽观点，剪掉寒暄重复；字幕逐词同步、始终可读，只有一句做视觉高潮。",
  },
];

const CAPTION_THEMES = [
  { id: "pop", label: "Pop 弹入", description: "缩放弹入，清爽通用" },
  { id: "karaoke", label: "Karaoke 扫光", description: "逐词高亮扫过，适合歌词式字幕" },
  { id: "kinetic-01", label: "Kinetic 动能排版", description: "主词放大、侧词对齐的动能排版" },
  { id: "kinetic-02", label: "Kinetic 变体", description: "动能排版第二套" },
  { id: "hustle", label: "Hustle 快节奏", description: "快速进入，活力十足" },
  { id: "grape", label: "Grape 倾斜强调", description: "无底框的倾斜强调字幕" },
  { id: "beast", label: "Beast 粗体高对比", description: "粗体加高对比阴影" },
  { id: "poppin", label: "Poppin 大写字幕", description: "全大写 Poppins 字体" },
  { id: "aarit", label: "Aarit 逐字缩放", description: "电影感逐字缩放与渐变扫光" },
  { id: "soft-ai", label: "Soft AI 柔焦", description: "无底框的柔焦浮现" },
  { id: "gaming-stream", label: "Gaming 霓虹", description: "霓虹发光游戏风格" },
  { id: "simple-one-word", label: "单字聚焦", description: "每次只高亮一个词" },
  { id: "podcast", label: "Podcast 播客", description: "播客风格的段落字幕" },
];

const CANVAS_SIZES = [
  { id: "1080p", label: "1080p 横屏", width: 1920, height: 1080, fps: 30 },
  { id: "vertical", label: "1080×1920 竖屏", width: 1080, height: 1920, fps: 30 },
  { id: "square", label: "1080×1080 方形", width: 1080, height: 1080, fps: 30 },
];

const COMPONENTS = [
  // 图表数据
  ["chart-animation", "Bar Chart", "Animated SVG bar chart with staggered bar growth", "template", "图表数据"],
  ["line-chart", "Line Chart", "SVG polyline drawing left-to-right with data points", "template", "图表数据"],
  ["pie-chart", "Pie Chart", "Segmented circle with sequential segment reveals", "template", "图表数据"],
  ["donut-chart", "Donut Chart", "Ring chart with animated segments and centre metric", "template", "图表数据"],
  ["area-chart", "Area Chart", "Gradient-filled area under a line, revealing left to right", "template", "图表数据"],
  ["progress-bars", "Progress Bars", "Horizontal bars filling to different widths", "template", "图表数据"],
  ["stat-counter", "Stat Counter", "Large number counting up with comma formatting", "template", "图表数据"],
  ["comparison-chart", "Comparison Chart", "Side-by-side before/after metric comparison", "template", "图表数据"],
  ["circular-progress", "Circular Progress", "Animated progress ring with percentage", "template", "图表数据"],
  // 文字动效
  ["animated-text", "Animated Text", "Character-by-character text reveal", "template", "文字动效"],
  ["bounce-text", "Bounce Text", "Spring bounce entrance for titles", "template", "文字动效"],
  ["bubble-pop-text", "Bubble Pop Text", "Characters pop in inside bubbles", "template", "文字动效"],
  ["floating-bubble-text", "Floating Text Chip", "Floating label with sine-wave wobble", "template", "文字动效"],
  ["glitch-text", "Glitch Text", "RGB split glitch with decay", "template", "文字动效"],
  ["popping-text", "Popping Scale Text", "Spring-based scale pop entrance", "template", "文字动效"],
  ["pulsing-text", "Pulsing Text", "Continuous scale pulse for emphasis", "template", "文字动效"],
  ["slide-text", "Slide Text", "Directional slide-in text", "template", "文字动效"],
  ["typewriter-subtitle", "Typewriter Subtitle", "Character-by-character typing with cursor", "template", "文字动效"],
  // 内容动画
  ["animated-list", "Animated List", "Staggered list item entrance", "template", "内容动画"],
  ["card-flip", "Card Flip", "3D card flip with front/back content", "template", "内容动画"],
  ["countdown-timer", "Countdown Timer", "5-4-3-2-1-GO with spring scale", "template", "内容动画"],
  ["notification-pop", "Notification Pop", "Stacking notification toasts", "template", "内容动画"],
  ["particle-explosion", "Particle Explosion", "Burst particles from centre", "template", "内容动画"],
  ["progress-steps", "Progress Steps", "Step indicator filling in sequence", "template", "内容动画"],
  ["rotating-carousel", "Rotating Carousel", "3D rotating card carousel", "template", "内容动画"],
  ["sound-wave", "Sound Wave", "Audio waveform bar visualiser", "template", "内容动画"],
  ["text-highlight", "Text Highlight", "Sequential word highlighting", "template", "内容动画"],
  // 背景效果
  ["bokeh-circles", "Bokeh Circles", "Floating soft circles with drift", "template", "背景效果"],
  ["geometric-patterns", "Geometric Patterns", "Rotating/scaling geometric shapes", "template", "背景效果"],
  ["gradient-shift", "Gradient Shift", "Slowly shifting ambient gradient", "template", "背景效果"],
  ["grid-pulse", "Grid Pulse", "Dot grid with ripple wave pulse", "template", "背景效果"],
  ["liquid-wave", "Liquid Wave", "Flowing SVG wave shapes", "template", "背景效果"],
  ["matrix-rain", "Matrix Rain", "Falling code rain columns", "template", "背景效果"],
  ["noise-grain", "Noise Grain", "Subtle film grain overlay", "template", "背景效果"],
  ["pixel-transition", "Pixel Transition", "Pixelated grid reveal", "template", "背景效果"],
  ["starfield", "Starfield", "Flying-through-space star effect", "template", "背景效果"],
  // 电影感
  ["camera-shake", "Camera Shake", "Decaying shake for impact moments", "template", "电影感"],
  ["film-burn", "Film Burn", "Warm light leak overlay", "template", "电影感"],
  ["ken-burns", "Ken Burns", "Pan and zoom for images", "template", "电影感"],
  ["letterbox-reveal", "Letterbox Reveal", "Black bars retracting to reveal", "template", "电影感"],
  ["parallax-pan", "Parallax Pan", "Multi-layer parallax scrolling", "template", "电影感"],
  ["spotlight-reveal", "Spotlight Reveal", "Expanding circle clip-path reveal", "template", "电影感"],
  ["vignette-pulse", "Vignette Pulse", "Pulsing darkened edges overlay", "template", "电影感"],
  ["whip-pan", "Whip Pan", "Fast horizontal pan with motion blur", "template", "电影感"],
  ["zoom-pulse", "Zoom Pulse", "Rhythmic zoom in/out pulse", "template", "电影感"],
  // 转场
  ["blinds-transition", "Blinds Transition", "Horizontal blinds opening", "template", "转场"],
  ["clock-wipe", "Clock Wipe", "Radial clock-hand sweep", "template", "转场"],
  ["cross-dissolve", "Cross Dissolve", "Classic cross-fade between scenes", "template", "转场"],
  ["fade-through-black", "Fade Through Black", "Dip to black between scenes", "template", "转场"],
  ["iris-transition", "Iris Transition", "Circular iris close/open", "template", "转场"],
  ["morph-transition", "Morph Transition", "Scale-and-fade morph", "template", "转场"],
  ["push-transition", "Push Transition", "New scene pushes old off-screen", "template", "转场"],
  ["slide-wipe", "Slide Wipe", "Spring-driven panel slide", "template", "转场"],
  ["zoom-through", "Zoom Through", "Zoom in then zoom out reveal", "template", "转场"],
  // 标志品牌
  ["logo-blur-reveal", "Logo Blur Reveal", "Focus-pull blur to sharp", "template", "标志品牌"],
  ["logo-bounce-drop", "Logo Bounce Drop", "Drop from above with bounce", "template", "标志品牌"],
  ["logo-fade-reveal", "Logo Fade Reveal", "Fade in with subtle scale-up", "template", "标志品牌"],
  ["logo-glitch-reveal", "Logo Glitch Reveal", "RGB split glitch decaying to clean", "template", "标志品牌"],
  ["logo-scale-rotate", "Logo Scale Rotate", "Spinning scale entrance", "template", "标志品牌"],
  ["logo-spin-reveal", "Logo Spin Reveal", "3D Y-axis spin reveal", "template", "标志品牌"],
  ["logo-split-reveal", "Logo Split Reveal", "Left/right halves expanding", "template", "标志品牌"],
  ["logo-stroke-draw", "Logo Stroke Draw", "SVG stroke drawing animation", "template", "标志品牌"],
  ["logo-typewriter", "Logo Typewriter", "Icon + typed company name", "template", "标志品牌"],
  // 片头片尾
  ["chapter-title", "Chapter Title", "Chapter number with extending lines", "template", "片头片尾"],
  ["cinematic-title-intro", "Cinematic Title Intro", "Title spring-in with growing underline", "template", "片头片尾"],
  ["countdown-intro", "Countdown Intro", "Ring countdown 3-2-1-GO", "template", "片头片尾"],
  ["credits-roll", "Credits Roll", "Scrolling movie-style credits", "template", "片头片尾"],
  ["end-card", "End Card", "Outro with subscribe CTA", "template", "片头片尾"],
  ["lower-third", "Lower Third", "News-style name/title bar", "template", "片头片尾"],
  ["quote-card", "Quote Card", "Animated quotation with attribution", "template", "片头片尾"],
  ["subscribe-reminder", "Subscribe Reminder", "Floating subscribe overlay", "template", "片头片尾"],
  ["title-split", "Title Split", "Split text meeting in centre", "template", "片头片尾"],
  // 图片媒体
  ["gallery-grid", "Gallery Grid", "Staggered 2x3 grid reveal", "template", "图片媒体"],
  ["image-carousel", "Image Carousel", "Horizontal sliding with centre focus", "template", "图片媒体"],
  ["image-comparison-slider", "Image Comparison Slider", "Before/after sliding divider", "template", "图片媒体"],
  ["image-zoom-reveal", "Image Zoom Reveal", "Zoom-out focus-pull reveal", "template", "图片媒体"],
  ["masonry-gallery", "Masonry Gallery", "Pinterest-style staggered grid", "template", "图片媒体"],
  ["photo-stack", "Photo Stack", "Overlapping frames with rotation", "template", "图片媒体"],
  ["picture-in-picture", "Picture in Picture", "PiP overlay layout", "template", "图片媒体"],
  ["polaroid-frame", "Polaroid Frame", "Polaroid-style photo with drop-in", "template", "图片媒体"],
  ["split-screen", "Split Screen", "Two panels sliding to meet", "template", "图片媒体"],
  // 动态组件
  ["PageCam", "PageCam", "页面镜头与相机运动", "motion", "动态组件"],
  ["DigitRoll", "DigitRoll", "数字滚动强调", "motion", "动态组件"],
  ["VerticalTicker", "VerticalTicker", "纵向信息流", "motion", "动态组件"],
  ["FlashCut", "FlashCut", "闪切与节奏转场", "motion", "动态组件"],
  ["FlameFrame", "Flame Frame", "居中内容框 + 自适应橙黄火焰边框", "motion", "动态组件"],
  ["FlatPanel", "FlatPanel", "扁平信息面板（需 3D 渲染环境）", "motion", "动态组件"],
].map(([id, label, description, kind, category]) => ({
  id,
  label,
  description,
  kind,
  category,
  path: `packages/remotion-kit/src/components/${id}.tsx`,
  workspacePath: `src/components/${id}.tsx`,
}));

const DIRECTIVES = [
  { id: "hook-opening", label: "钩子开场", description: "开场三秒抓住注意力", prompt: "开场三秒内建立明确钩子：用有张力的画面、悬念或反常识结论抓住注意力，不要让观众在开场就流失。" },
  { id: "info-ladder", label: "信息层级推进", description: "先结论后展开，逐层加深", prompt: "中段按信息层级推进：先给结论/观点，再逐层展开论据，每个 content 场景只说一个新信息，避免堆砌。" },
  { id: "strong-close", label: "强收束结尾", description: "呼应开头，明确落点", prompt: "结尾形成清晰收束：呼应开场的钩子，把全片信息收敛到一个明确结论或行动号召，不拖泥带水。" },
  { id: "suspense-reveal", label: "悬念-揭示", description: "先埋问题，后给答案", prompt: "用悬念-揭示结构组织镜头：先埋设一个待解答的问题，中段逐步给出线索，结尾揭示答案，制造追看感。" },
  { id: "emotional-arc", label: "情绪弧线", description: "起承转合，张弛有度", prompt: "设计完整的情绪弧线：开场轻快引入，中段升高张力，关键处回落，结尾释放情绪；节奏张弛有度。" },
  { id: "contrast-pairing", label: "对比对仗", description: "两组画面互相映照", prompt: "用对比/对仗结构组织镜头：两个场景（如现状 vs 愿景、问题 vs 解法）互相映照，形成记忆点。" },
  { id: "rapid-fire", label: "快节奏推进", description: "高密度信息，快速切换", prompt: "采用快节奏推进：短镜头、快速转场、高密度信息，适合社交媒体的强节奏；注意信息可读性。" },
  { id: "breathing-room", label: "留白呼吸", description: "关键信息后停顿", prompt: "关键信息落定后留出呼吸：在重点镜头后放慢节奏、加停留，让观众消化，而不是全程匀速。" },
];

// HTML-in-Canvas 表达镜头层（首批实现）。engine/layer/placement 决定它如何与鼠标、
// 场景进出、背景或组件内生命周期组合；source.path 是 Agent 改写 composition 时读取的源码。
const HTML_CANVAS_EFFECTS = [
  {
    id: "cursor",
    label: "Cursor Director",
    description: "模拟鼠标轨迹：move/hover/click/drag/scroll 的可见光标、hover halo、click ripple 与 drag trail。",
    engine: "html-canvas",
    layer: "interaction",
    intent: "guide",
    requires: ["html-in-canvas"],
    placement: ["scene-play", "target", "video-background"],
    preview: { compositionId: "product-ui-demo", durationInFrames: 240, defaultProps: { effect: "cursor" } },
    source: { exportName: "cursorEffect", path: "packages/remotion-kit/src/html-canvas/effects/cursor.tsx", workspacePath: "src/html-canvas/effects/cursor.tsx" },
    prompt: { constraints: ["互动脚本先于 JSX", "真实 pointer 事件不进入 render"], recommendedDurationFrames: 180 },
  },
  {
    id: "focus-spotlight",
    label: "Focus Spotlight",
    description: "聚焦引导：内容纹理外压暗、目标区域清晰，带羽化与边缘光；可由 hover/click 接管 target。",
    engine: "html-canvas",
    layer: "content",
    intent: "emphasize",
    requires: ["html-in-canvas"],
    placement: ["target", "scene-play"],
    preview: { compositionId: "product-ui-demo", durationInFrames: 240, defaultProps: { effect: "focus-spotlight" } },
    source: { exportName: "focusSpotlightEffect", path: "packages/remotion-kit/src/html-canvas/effects/focus-spotlight.tsx", workspacePath: "src/html-canvas/effects/focus-spotlight.tsx" },
    prompt: { constraints: ["target 使用设计像素", "一个 target 起步"], recommendedDurationFrames: 90 },
  },
  {
    id: "text-selection",
    label: "Text Selection",
    description: "文本选择与荧光笔：按 token Rect[] 逐词/逐行 reveal，可选扫读光；文本保留在 source HTML。",
    engine: "html-canvas",
    layer: "content",
    intent: "emphasize",
    requires: ["html-in-canvas"],
    placement: ["target", "scene-play"],
    preview: { compositionId: "product-ui-demo", durationInFrames: 240, defaultProps: { effect: "text-selection" } },
    source: { exportName: "textSelectionEffect", path: "packages/remotion-kit/src/html-canvas/effects/text-selection.tsx", workspacePath: "src/html-canvas/effects/text-selection.tsx" },
    prompt: { constraints: ["输入 token Rect[]", "不做 DOM 文本搜索"], recommendedDurationFrames: 90 },
  },
  {
    id: "magnifier",
    label: "Magnifier",
    description: "GPU 细节放大镜：采样当前 HTML texture，透镜、HUD、色差与 click ripple 走同一合成 pass。",
    engine: "html-canvas",
    layer: "content",
    intent: "inspect",
    requires: ["html-in-canvas"],
    placement: ["target", "scene-play"],
    preview: { compositionId: "product-ui-demo", durationInFrames: 240, defaultProps: { effect: "magnifier" } },
    source: { exportName: "magnifierEffect", path: "packages/remotion-kit/src/html-canvas/effects/magnifier.tsx", workspacePath: "src/html-canvas/effects/magnifier.tsx" },
    prompt: { constraints: ["一个 lens", "必须走 GpuCompositor source texture", "折射强度受预算限制"], recommendedDurationFrames: 90 },
  },
  {
    id: "glitch",
    label: "Glitch Burst",
    description: "GPU 广播故障：实时 HTML texture 水平撕裂、RGB split、损坏块与模拟噪点。",
    engine: "html-canvas",
    layer: "scene",
    intent: "emphasize",
    requires: ["html-in-canvas", "webgl2"],
    placement: ["scene-enter", "scene-play", "scene-exit"],
    preview: { compositionId: "product-ui-demo", durationInFrames: 240, defaultProps: { effect: "glitch" } },
    source: { exportName: "GpuCompositor", path: "packages/remotion-kit/src/html-canvas/GpuCompositor.ts", workspacePath: "src/html-canvas/GpuCompositor.ts" },
    prompt: { constraints: ["burst 区间与 seed 必须帧驱动", "不得使用 Math.random 或 interval"], recommendedDurationFrames: 24 },
  },
  {
    id: "bubble",
    label: "Bubble",
    description: "GPU 液态气泡：脚本轨迹驱动 metaball trail、折射与高光，读取真实 HTML texture。",
    engine: "html-canvas",
    layer: "interaction",
    intent: "inspect",
    requires: ["html-in-canvas", "webgl2"],
    placement: ["target", "scene-play"],
    preview: { compositionId: "product-ui-demo", durationInFrames: 240, defaultProps: { effect: "bubble" } },
    source: { exportName: "GpuCompositor", path: "packages/remotion-kit/src/html-canvas/GpuCompositor.ts", workspacePath: "src/html-canvas/GpuCompositor.ts" },
    prompt: { constraints: ["trail 从 InteractionScript 历史采样得到", "每镜头最多一个 heavy effect"], recommendedDurationFrames: 120 },
  },
  {
    id: "ambient",
    label: "Ambient Canvas FX",
    description: "轻量背景材质：确定性 grain、vignette 与冷色调；默认不与强透镜叠加。",
    engine: "html-canvas",
    layer: "background",
    intent: "atmosphere",
    requires: ["html-in-canvas"],
    placement: ["video-background", "scene-play"],
    preview: { compositionId: "product-ui-demo", durationInFrames: 240, defaultProps: { effect: "ambient" } },
    source: { exportName: "ambientEffect", path: "packages/remotion-kit/src/html-canvas/effects/ambient.tsx", workspacePath: "src/html-canvas/effects/ambient.tsx" },
    prompt: { constraints: ["每场景最多一个", "默认关闭"], recommendedDurationFrames: 240 },
  },
];

const THREE_EFFECTS = THREE_MATERIALS.map((material) => ({
  id: material.id,
  label: material.label,
  description: material.description,
  engine: "three",
  layer: material.category,
  intent: material.category === "ambient" ? "atmosphere" : material.category === "transform" ? "transition" : "emphasize",
  placement: material.category === "ambient" ? ["ambient", "scene-play"] : material.category === "transform" ? ["transition"] : ["scene-play", "scene-enter", "scene-exit"],
  requires: ["three", "html-surface"],
  material,
  source: {
    exportName: "MaterialElement",
    path: "packages/remotion-kit/src/materials/MaterialElement.tsx",
    workspacePath: "src/materials/MaterialElement.tsx",
  },
  prompt: {
    constraints: [
      "material 只消费内容纹理与 schema 声明的语义参数",
      "逐帧只更新 uniform，不重建 shader",
      "确定性：固定 seed，禁 random/Date.now",
    ],
  },
}));

// Shot Language v3 属于镜头层特效：camera 观看、surface 快速落位/弯曲、focus/lens 管注意力。
// 因此单独声明 engine/layer，UI 可在同一个弹框中分组、用真实 Three fixture 预览。
const QUICK_SURFACE_LANDS = {
  "camera-drift": { keyframes: [{ at: 0, position: [-0.42, 0.2, -0.8], rotation: [0.05, -0.14, -0.03], scale: [0.88, 0.88, 1], bend: 0.18 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-push-in": { keyframes: [{ at: 0, position: [-0.6, 0.28, -1.25], rotation: [0.08, -0.22, -0.05], scale: [0.78, 0.78, 1], bend: 0.35 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-pull-out": { keyframes: [{ at: 0, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0 }, { at: 0.16, position: [0.5, -0.22, -1], rotation: [-0.06, 0.16, 0.04], scale: [0.82, 0.82, 1], bend: 0.22, easing: "ease-out" }] },
  "camera-truck": { keyframes: [{ at: 0, position: [-0.62, 0.12, -0.9], rotation: [0.04, -0.2, -0.04], scale: [0.84, 0.84, 1], bend: 0.24 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-crane": { keyframes: [{ at: 0, position: [0.1, 0.56, -1.2], rotation: [0.16, -0.08, -0.05], scale: [0.79, 0.79, 1], bend: 0.32 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
  "camera-lens-inspect": { keyframes: [{ at: 0, position: [-0.54, 0.22, -1.2], rotation: [0.07, -0.2, -0.04], scale: [0.8, 0.8, 1], bend: 0.3 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
};

const CAMERA_EFFECTS = [
  {
    id: "camera-drift",
    label: "Camera Drift",
    description: "纸面以微倾姿态快速落位，再由轻量平移建立呼吸感；动作后保留阅读。",
    engine: "three-camera",
    layer: "camera",
    intent: "guide",
    requires: ["three", "html-surface"],
    placement: ["scene-play", "target"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "camera-drift" } },
    source: { exportName: "CameraDirector", path: "packages/remotion-kit/src/three/CameraDirector.tsx", workspacePath: "src/three/CameraDirector.tsx" },
    camera: { verb: "drift", subject: { anchor: [0.52, 0.48] }, keyframes: [{ at: 0, position: [-0.26, 0.14, 8.25], fov: 34 }, { at: 0.16, position: [0.2, -0.08, 7.9], fov: 33, easing: "ease-out" }, { at: 1, position: [0.2, -0.08, 7.9], fov: 33, easing: "linear" }] },
    surface: QUICK_SURFACE_LANDS["camera-drift"],
    prompt: { constraints: ["动作应在约 1 秒内完成", "落位后保留阅读 hold", "不得与大运动并列"], recommendedDurationFrames: 54 },
  },
  {
    id: "camera-push-in",
    label: "Push In",
    description: "页面从斜后方弯曲落位，同时沿视线推进并锁定主体；用于快速收束到具体主张。",
    engine: "three-camera",
    layer: "camera",
    intent: "emphasize",
    requires: ["three", "html-surface"],
    placement: ["scene-play", "target"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "camera-push-in" } },
    source: { exportName: "CameraDirector", path: "packages/remotion-kit/src/three/CameraDirector.tsx", workspacePath: "src/three/CameraDirector.tsx" },
    camera: { verb: "push-in", subject: { anchor: [0.54, 0.5] }, keyframes: [{ at: 0, position: [0, 0, 8.2], fov: 34 }, { at: 0.16, position: [0.1, -0.04, 5.9], fov: 30, easing: "ease-out" }, { at: 1, position: [0.1, -0.04, 5.9], fov: 30, easing: "linear" }] },
    surface: QUICK_SURFACE_LANDS["camera-push-in"],
    prompt: { constraints: ["终点纹理必须高清", "动作结束后至少 hold 15f", "不与 crash zoom 同段叠加"], recommendedDurationFrames: 54 },
  },
  {
    id: "camera-pull-out",
    label: "Pull Out",
    description: "从细节快速释放，页面后撤并轻弯离开，重新交代系统全貌。",
    engine: "three-camera",
    layer: "camera",
    intent: "connect",
    requires: ["three", "html-surface"],
    placement: ["scene-play", "target"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "camera-pull-out" } },
    source: { exportName: "CameraDirector", path: "packages/remotion-kit/src/three/CameraDirector.tsx", workspacePath: "src/three/CameraDirector.tsx" },
    camera: { verb: "pull-out", subject: { anchor: [0.52, 0.48] }, keyframes: [{ at: 0, position: [0.08, -0.03, 5.9], fov: 30 }, { at: 0.16, position: [-0.12, 0.1, 8.3], fov: 34, easing: "ease-out" }, { at: 1, position: [-0.12, 0.1, 8.3], fov: 34, easing: "linear" }] },
    surface: QUICK_SURFACE_LANDS["camera-pull-out"],
    prompt: { constraints: ["只用于完成一个信息点后的释放", "不得作为无意义的缩小"], recommendedDurationFrames: 72 },
  },
  {
    id: "camera-truck",
    label: "Camera Truck",
    description: "横向移镜，适合比较与扫描；多平面场景会产生真实视差，单平面只保留轻视角变化。",
    engine: "three-camera",
    layer: "camera",
    intent: "guide",
    requires: ["three", "html-surface"],
    placement: ["scene-play"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "camera-truck" } },
    source: { exportName: "CameraDirector", path: "packages/remotion-kit/src/three/CameraDirector.tsx", workspacePath: "src/three/CameraDirector.tsx" },
    camera: { verb: "truck", subject: { anchor: [0.46, 0.5] }, keyframes: [{ at: 0, position: [-0.5, 0.02, 8], fov: 34 }, { at: 0.16, position: [0.5, -0.02, 8], fov: 34, easing: "ease-out" }, { at: 1, position: [0.5, -0.02, 8], fov: 34, easing: "linear" }] },
    surface: QUICK_SURFACE_LANDS["camera-truck"],
    prompt: { constraints: ["动作应在约 1 秒内完成", "单平面用倾斜与曲面制造透视", "保持文字可读"], recommendedDurationFrames: 54 },
  },
  {
    id: "camera-crane",
    label: "Camera Crane",
    description: "从略高机位平滑落向主体，适合开场揭示或把数据、对象带入观看中心。",
    engine: "three-camera",
    layer: "camera",
    intent: "guide",
    requires: ["three", "html-surface"],
    placement: ["scene-enter", "scene-play", "target"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "camera-crane" } },
    source: { exportName: "CameraDirector", path: "packages/remotion-kit/src/three/CameraDirector.tsx", workspacePath: "src/three/CameraDirector.tsx" },
    camera: { verb: "crane", subject: { anchor: [0.5, 0.46] }, keyframes: [{ at: 0, position: [-0.12, 0.42, 8.45], fov: 34 }, { at: 0.16, position: [0.1, -0.14, 7.55], fov: 32, easing: "ease-out" }, { at: 1, position: [0.1, -0.14, 7.55], fov: 32, easing: "linear" }] },
    surface: QUICK_SURFACE_LANDS["camera-crane"],
    prompt: { constraints: ["有地板或背景参照时更成立", "不要和同段页面大位移叠加"], recommendedDurationFrames: 90 },
  },
  {
    id: "camera-lens-inspect",
    label: "Lens Inspect",
    description: "先推进到具体主体，再以放大镜检查同一个细节；用于产品 UI、数据与需要确认的证据。",
    engine: "three-camera",
    layer: "camera",
    intent: "inspect",
    requires: ["three", "html-surface"],
    placement: ["scene-play", "target"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "camera-lens-inspect" } },
    source: { exportName: "CameraDirector", path: "packages/remotion-kit/src/three/CameraDirector.tsx", workspacePath: "src/three/CameraDirector.tsx" },
    camera: { verb: "push-in", subject: { anchor: [0.68, 0.58] }, keyframes: [{ at: 0, position: [0, 0, 8.2], fov: 34 }, { at: 0.16, position: [0.16, -0.08, 5.9], fov: 30, easing: "ease-out" }, { at: 1, position: [0.16, -0.08, 5.9], fov: 30, easing: "linear" }], lens: { zoom: 1.75, radius: 138 } },
    surface: QUICK_SURFACE_LANDS["camera-lens-inspect"],
    prompt: { constraints: ["camera subject 与 descriptor.lens.anchor 必须同源", "先到焦点再显示 lens", "每镜头最多一个强光学主角"], recommendedDurationFrames: 90 },
  },
  {
    id: "surface-corner-curl",
    label: "Corner Curl Land",
    description: "页面从右上纸角卷起、带 yaw 与 roll 落入镜头；适合章节卡、报价卡或一张需要被揭开的关键信息。",
    engine: "three-camera",
    layer: "camera",
    intent: "reveal",
    requires: ["three", "html-surface"],
    placement: ["scene-enter", "target"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "surface-corner-curl" } },
    source: { exportName: "SurfaceMotion", path: "packages/remotion-kit/src/three/SurfaceMotion.ts", workspacePath: "src/three/SurfaceMotion.ts" },
    camera: { verb: "push-in", subject: { anchor: [0.66, 0.34] }, keyframes: [{ at: 0, position: [0.1, 0.02, 8.3], fov: 34 }, { at: 0.16, position: [0.08, -0.04, 6.7], fov: 32, easing: "ease-out" }, { at: 1, position: [0.08, -0.04, 6.7], fov: 32, easing: "linear" }] },
    surface: { keyframes: [{ at: 0, position: [0.58, 0.3, -1.28], rotation: [0.14, 0.46, 0.18], scale: [0.76, 0.76, 1], bend: 0.14, corner: "top-right", cornerCurl: 0.82 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, corner: "top-right", cornerCurl: 0, easing: "ease-out" }] },
    prompt: { constraints: ["只卷一个明确角", "动作应在约 1 秒内完成", "落位后保持平整可读"], recommendedDurationFrames: 54 },
  },
  {
    id: "surface-dutch-settle",
    label: "Dutch Settle",
    description: "页面以大幅 roll 与侧向 yaw 进入，最后正面归位；用于强调、警报、立场反转或章节断点。",
    engine: "three-camera",
    layer: "camera",
    intent: "impact",
    requires: ["three", "html-surface"],
    placement: ["scene-enter", "scene-play"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "surface-dutch-settle" } },
    source: { exportName: "SurfaceMotion", path: "packages/remotion-kit/src/three/SurfaceMotion.ts", workspacePath: "src/three/SurfaceMotion.ts" },
    camera: { verb: "locked", subject: { anchor: [0.5, 0.5] }, keyframes: [{ at: 0, position: [0, 0, 8], fov: 34 }, { at: 1, position: [0, 0, 8], fov: 34, easing: "linear" }] },
    surface: { keyframes: [{ at: 0, position: [-0.32, 0.16, -1.05], rotation: [0.08, -0.62, -0.48], scale: [0.82, 0.82, 1], bend: 0.2 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
    prompt: { constraints: ["只用于一次强调", "不与 glitch 或第二次大转动同段叠加", "归位后至少 hold 20f"], recommendedDurationFrames: 54 },
  },
  {
    id: "surface-browser-rise",
    label: "Browser Rise",
    description: "有厚度的浏览器外框从俯视角升起并正面落定；适合 SaaS 功能、网页成果或操作步骤。",
    engine: "three-camera",
    layer: "camera",
    intent: "showcase",
    requires: ["three", "html-surface"],
    placement: ["scene-enter", "target"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "surface-browser-rise" } },
    source: { exportName: "BrowserSurfaceShell", path: "packages/remotion-kit/src/three/SurfaceShell.tsx", workspacePath: "src/three/SurfaceShell.tsx" },
    camera: { verb: "crane", subject: { anchor: [0.5, 0.48] }, keyframes: [{ at: 0, position: [-0.1, 0.32, 8.4], fov: 34 }, { at: 0.16, position: [0.06, -0.06, 7.25], fov: 32, easing: "ease-out" }, { at: 1, position: [0.06, -0.06, 7.25], fov: 32, easing: "linear" }] },
    surface: { shell: "browser", keyframes: [{ at: 0, position: [0.08, -0.58, -1.3], rotation: [0.34, -0.14, 0.04], scale: [0.76, 0.76, 1], bend: 0.12 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
    prompt: { constraints: ["shell 与页面必须共享同一 surface 轨", "动作应在约 1 秒内完成", "screen title 不进入外框透视"], recommendedDurationFrames: 54 },
  },
  {
    id: "surface-cloth-breathe",
    label: "Cloth Breathe",
    description: "轻布料波动叠加弯曲落位，再以微推镜呼吸；适合海报、品牌卡或情绪段，不用于密集阅读。",
    engine: "three-camera",
    layer: "camera",
    intent: "atmosphere",
    requires: ["three", "html-surface"],
    placement: ["scene-enter"],
    preview: { compositionId: "camera-preview", durationInFrames: 180, defaultProps: { effect: "surface-cloth-breathe" } },
    source: { exportName: "SurfacePlaneGeometry", path: "packages/remotion-kit/src/three/HtmlSurface.tsx", workspacePath: "src/three/HtmlSurface.tsx" },
    camera: { verb: "drift", subject: { anchor: [0.5, 0.5] }, keyframes: [{ at: 0, position: [-0.08, 0.06, 8.15], fov: 34 }, { at: 0.16, position: [0.08, -0.04, 7.75], fov: 33, easing: "ease-out" }, { at: 1, position: [0.08, -0.04, 7.75], fov: 33, easing: "linear" }] },
    surface: { cloth: { amplitude: 0.035, speed: 1.1, scale: 1.25 }, keyframes: [{ at: 0, position: [0.12, 0.26, -1.05], rotation: [0.08, -0.16, 0.03], scale: [0.84, 0.84, 1], bend: 0.28 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] },
    prompt: { constraints: ["只用于少字的品牌/情绪画面", "cloth amplitude 不超过 0.05", "不与 lens 或 displacement 同段叠加"], recommendedDurationFrames: 54 },
  },
];

const EFFECTS = [...HTML_CANVAS_EFFECTS, ...THREE_EFFECTS, ...CAMERA_EFFECTS];

const scenarios = Object.fromEntries(
  SCENARIO_SPEC.filter((s) => s.implemented).map((s) => {
    // 每个场景携带完整 SKILL.md（导演手册全文），UI 选择模板时把全文拼进 Prompt，
    // 让 AI 拿到场景的端到端参考（适用/内置视觉/分镜/组件/验收），而不是一句空泛指令。
    let skillBody = "";
    try {
      skillBody = readFileSync(join(ROOT, "src", "scenarios", s.id, "SKILL.md"), "utf8");
    } catch (_) { /* SKILL.md 缺失时保留空 */ }
    return [s.id, { ...s, skillBody }];
  }),
);

const catalog = {
  scenarios,
  captionThemes: CAPTION_THEMES,
  canvasSizes: CANVAS_SIZES,
  components: COMPONENTS,
  effects: EFFECTS,
  directives: DIRECTIVES,
};

// 历史目录里由独立流程维护、不归本生成器管理的键，保留原值随目录一起发布：
// designSystems（151 套设计系统元数据）与 kitVersion（后台 workspace.kit-state 消费）。
for (const key of ["designSystems", "kitVersion"]) {
  const prev = readExistingCatalog()[key];
  if (prev !== undefined) catalog[key] = prev;
}
catalog.kitVersion = KIT_VERSION;

writeFileSync(join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
console.log(`generated catalog.json (${Object.keys(scenarios).length} scenarios, ${COMPONENTS.length} components, ${EFFECTS.length} effects, kit v${KIT_VERSION})`);
