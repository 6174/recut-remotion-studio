/*
 * Remotion Studio — generate catalog.json `components` from the kit's
 * remotion-templates README (categories + descriptions) plus the built-in
 * motion components. Run after adding/renaming templates:
 *   node scripts/generate-catalog.js
 * Keeps the component catalog in sync with the actual kit sources.
 */
const fs = require("fs");
const path = require("path");

const app = path.join(__dirname, "..");
const readmePath = path.join(app, "packages", "remotion-kit", "src", "components", "remotion-templates", "README.md");
const catalogPath = path.join(app, "packages", "remotion-kit", "catalog.json");

const CATEGORY_LABELS = {
  "Charts & Data": "图表数据",
  "Text": "文字动效",
  "Content Animation": "内容动画",
  "Background": "背景效果",
  "Cinematic": "电影感",
  "Transition": "转场",
  "Logo & Branding": "标志品牌",
  "Intro & Outro": "片头片尾",
  "Image & Media": "图片媒体",
};

const MOTION_COMPONENTS = [
  { id: "PageCam", label: "PageCam", description: "页面镜头与相机运动", kind: "motion", category: "动态组件" },
  { id: "DigitRoll", label: "DigitRoll", description: "数字滚动强调", kind: "motion", category: "动态组件" },
  { id: "VerticalTicker", label: "VerticalTicker", description: "纵向信息流", kind: "motion", category: "动态组件" },
  { id: "FlashCut", label: "FlashCut", description: "闪切与节奏转场", kind: "motion", category: "动态组件" },
  { id: "FlatPanel", label: "FlatPanel", description: "扁平信息面板（需 3D 渲染环境）", kind: "motion", category: "动态组件" },
];

const rowRe = /^\|\s*(.+?)\s*\|\s*`([^`]+\.tsx)`\s*\|\s*(.+?)\s*\|$/;
const catRe = /^###\s+(.+?)\s+\((\d+)\)\s*$/;

const templates = [];
let category = "";
for (const line of fs.readFileSync(readmePath, "utf8").split("\n")) {
  const catMatch = line.match(catRe);
  if (catMatch) {
    category = CATEGORY_LABELS[catMatch[1]] || catMatch[1];
    continue;
  }
  const row = line.match(rowRe);
  if (row) {
    templates.push({ label: row[1], id: row[2].replace(/\.tsx$/, ""), description: row[3], category });
  }
}

function entry({ id, label, description, kind, category }) {
  const dir = kind === "template" ? "remotion-templates" : "";
  return {
    id,
    label,
    description,
    kind,
    category,
    path: `packages/remotion-kit/src/components/${dir ? `${dir}/` : ""}${id}.tsx`,
    workspacePath: `src/components/${dir ? `${dir}/` : ""}${id}.tsx`,
  };
}

const components = [
  ...templates.map((item) => entry({ ...item, kind: "template" })),
  ...MOTION_COMPONENTS.map((item) => entry({ ...item, kind: "motion" })),
];

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
catalog.components = components;
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
console.log(`generate-catalog: components updated (${components.length}: ${templates.length} templates + ${MOTION_COMPONENTS.length} motion components)`);
