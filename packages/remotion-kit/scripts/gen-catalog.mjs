#!/usr/bin/env node
/**
 * [INPUT]: 依赖下面的 SCENARIO_SPEC（成片模板目录）
 * [OUTPUT]: 生成 catalog.json（scenarios + captionThemes/canvasSizes/components/directives）
 * [POS]: remotion-kit 目录生成器；成片模板、组件、字幕主题、画布与导演指令从下方内联目录拼接
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
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
  // 动态组件（shotcraft）
  ["PageCam", "PageCam", "页面镜头与相机运动", "shotcraft", "动态组件"],
  ["DigitRoll", "DigitRoll", "数字滚动强调", "shotcraft", "动态组件"],
  ["VerticalTicker", "VerticalTicker", "纵向信息流", "shotcraft", "动态组件"],
  ["FlashCut", "FlashCut", "闪切与节奏转场", "shotcraft", "动态组件"],
  ["FlatPanel", "FlatPanel", "扁平信息面板（需 3D 渲染环境）", "shotcraft", "动态组件"],
].map(([id, label, description, kind, category]) => ({
  id,
  label,
  description,
  kind,
  category,
  path: kind === "shotcraft" ? `packages/remotion-kit/src/components/${id}.tsx` : `packages/remotion-kit/src/components/${id}.tsx`,
  workspacePath: kind === "shotcraft" ? `src/components/${id}.tsx` : `src/components/${id}.tsx`,
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
  directives: DIRECTIVES,
};

writeFileSync(join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
console.log(`generated catalog.json (${Object.keys(scenarios).length} scenarios, ${COMPONENTS.length} components)`);
