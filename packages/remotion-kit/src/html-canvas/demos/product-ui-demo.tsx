/**
 * [INPUT]: 依赖 HtmlCanvasVideoStage、useInteraction、types 的 StagePlan
 * [OUTPUT]: 对外提供 PRODUCT_UI_DEMO_PLAN 与 ProductUiDemo（click → focus 的产品 UI 演示）
 * [POS]: src/html-canvas/demos 的叙事实例。一条 move → hover → click → pause 手势：
 *        鼠标点击“导出”按钮后舞台接管焦点，再点击“导出画质”设置行把焦点移过去；
 *        场景组件只消费同一脚本派生的语义状态。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { HtmlCanvasVideoStage } from "../HtmlCanvasVideoStage";
import { useInteraction } from "../InteractionScript";
import type { StagePlan } from "../types";

export const PRODUCT_UI_DEMO_WIDTH = 1920;
export const PRODUCT_UI_DEMO_HEIGHT = 1080;
export const PRODUCT_UI_DEMO_FRAMES = 240;

export const PRODUCT_UI_DEMO_PLAN: StagePlan = {
  targets: {
    "export-button": { kind: "rect", rect: { x: 1210, y: 830, width: 110, height: 54 }, radius: 12 },
    "focus:export-button": { kind: "rect", rect: { x: 1150, y: 770, width: 230, height: 174 }, radius: 24 },
    "key-section": { kind: "rect", rect: { x: 620, y: 260, width: 680, height: 120 }, radius: 16 },
    "focus:key-section": { kind: "rect", rect: { x: 560, y: 200, width: 800, height: 240 }, radius: 24 },
  },
  interaction: [
    { kind: "move", frame: 20, x: 960, y: 900 },
    { kind: "move", frame: 45, x: 1265, y: 857, easing: "easeInOut" },
    { kind: "hover", frame: 55, targetId: "export-button" },
    { kind: "click", frame: 70, targetId: "export-button" },
    { kind: "move", frame: 108, x: 1265, y: 857, easing: "easeInOut" },
    { kind: "move", frame: 142, x: 960, y: 320, easing: "easeInOut" },
    { kind: "hover", frame: 152, targetId: "key-section" },
    { kind: "click", frame: 168, targetId: "key-section" },
  ],
  effects: [
    {
      id: "cursor-director",
      scope: "video",
      effect: "cursor",
      timing: { startFrame: 12, enterFrames: 6, holdFrames: 186, exitFrames: 12 },
      zIndex: 30,
    },
    {
      id: "focus-export",
      scope: "scene",
      effect: "focus-spotlight",
      targetId: "focus:export-button",
      timing: { startFrame: 66, enterFrames: 20, holdFrames: 62, exitFrames: 16 },
      options: { dim: 0.74, edge: true },
      zIndex: 10,
    },
    {
      id: "focus-key",
      scope: "scene",
      effect: "focus-spotlight",
      targetId: "focus:key-section",
      timing: { startFrame: 162, enterFrames: 20, holdFrames: 40, exitFrames: 18 },
      options: { dim: 0.7, edge: true },
      zIndex: 11,
    },
  ],
};

const SETTING_ROWS = ["自动保存", "快捷键提示", "云端同步", "主题 · 深色"];

const SettingRow: React.FC<{ label: string; index: number }> = ({ label, index }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
      padding: "0 20px",
      marginTop: index === 0 ? 0 : 14,
      borderRadius: 14,
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
    }}
  >
    <span style={{ color: "#e7ebf6", fontSize: 30, fontWeight: 600 }}>{label}</span>
    <span style={{ width: 44, height: 24, borderRadius: 12, background: "#22d3ee", opacity: 0.9 }} />
  </div>
);

const DemoScene: React.FC = () => {
  const interaction = useInteraction();
  const exportHovered = interaction.hoveredTargetId === "export-button";
  const exportPressed = interaction.pressedTargetId === "export-button";
  const keyHovered = interaction.hoveredTargetId === "key-section";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#0b0d14",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.10), transparent 55%), linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "auto, 56px 56px, 56px 56px",
        fontFamily: "'Inter', system-ui, 'PingFang SC', 'Noto Sans SC', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 560,
          width: 800,
          height: 780,
          borderRadius: 28,
          background: "#10131c",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
          padding: 44,
        }}
      >
        <p style={{ margin: 0, color: "#8b93a7", fontSize: 24, letterSpacing: "0.14em", textTransform: "uppercase" }}>Settings</p>
        <h1 style={{ margin: "10px 0 0", color: "#f2f5fb", fontSize: 54, fontWeight: 800, letterSpacing: "-0.02em" }}>项目设置</h1>

        <div
          style={{
            marginTop: 34,
            padding: 20,
            borderRadius: 20,
            background: keyHovered ? "rgba(34, 211, 238, 0.10)" : "rgba(34, 211, 238, 0.05)",
            border: keyHovered ? "1px solid rgba(34, 211, 238, 0.7)" : "1px solid rgba(34, 211, 238, 0.22)",
            transition: "none",
          }}
        >
          <p style={{ margin: 0, color: "#a7eef7", fontSize: 22, letterSpacing: "0.1em" }}>导出画质</p>
          <p style={{ margin: "6px 0 0", color: "#e7ebf6", fontSize: 34, fontWeight: 700 }}>4K · 60fps · HDR</p>
          <p style={{ margin: "6px 0 0", color: "#6b7488", fontSize: 22 }}>适合电商详情与主图视频</p>
        </div>

        <div style={{ marginTop: 26 }}>
          {SETTING_ROWS.map((label, index) => (
            <SettingRow key={label} label={label} index={index} />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            right: 44,
            bottom: 44,
            width: 110,
            height: 54,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            background: exportPressed
              ? "linear-gradient(135deg, #0ea5c4, #22d3ee)"
              : exportHovered
                ? "linear-gradient(135deg, #13b8d8, #38e1f5)"
                : "linear-gradient(135deg, #22d3ee, #67e8f9)",
            boxShadow: exportHovered ? "0 0 0 3px rgba(34, 211, 238, 0.35), 0 12px 30px rgba(34, 211, 238, 0.35)" : "0 12px 30px rgba(34, 211, 238, 0.25)",
            transform: exportPressed ? "translateY(2px)" : "none",
          }}
        >
          <span style={{ color: "#06222a", fontSize: 26, fontWeight: 800 }}>导出</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          bottom: 60,
          color: "#5a6375",
          fontSize: 22,
          letterSpacing: "0.08em",
        }}
      >
        HTML-IN-CANVAS · CLICK → FOCUS DEMO
      </div>
    </div>
  );
};

export const ProductUiDemo: React.FC<{ plan?: StagePlan }> = ({ plan }) => (
  <HtmlCanvasVideoStage plan={plan ?? PRODUCT_UI_DEMO_PLAN}>
    <DemoScene />
  </HtmlCanvasVideoStage>
);

const DEMO_INTERACTION: StagePlan["interaction"] = [
  { kind: "move", frame: 20, x: 960, y: 900 },
  { kind: "move", frame: 45, x: 1265, y: 857, easing: "easeInOut" },
  { kind: "hover", frame: 55, targetId: "export-button" },
  { kind: "click", frame: 70, targetId: "export-button" },
  { kind: "move", frame: 108, x: 1265, y: 857, easing: "easeInOut" },
];

const DEMO_TARGETS: StagePlan["targets"] = {
  "export-button": { kind: "rect", rect: { x: 1210, y: 830, width: 110, height: 54 }, radius: 12 },
  "focus:export-button": { kind: "rect", rect: { x: 1150, y: 770, width: 230, height: 174 }, radius: 24 },
  "key-section": { kind: "rect", rect: { x: 620, y: 260, width: 680, height: 120 }, radius: 16 },
  "focus:key-section": { kind: "rect", rect: { x: 560, y: 200, width: 800, height: 240 }, radius: 24 },
};

const DEMO_CURSOR_CLIP = {
  id: "cursor-director",
  scope: "video" as const,
  effect: "cursor" as const,
  timing: { startFrame: 12, enterFrames: 6, holdFrames: 150, exitFrames: 12 },
  zIndex: 30,
};

/** 特效板块预览用的按效果定制的 StagePlan（同一产品 UI 场景，仅换轨道）。 */
export const planForEffect = (effect: string): StagePlan => {
  switch (effect) {
    case "focus-spotlight":
      return {
        targets: DEMO_TARGETS,
        interaction: DEMO_INTERACTION,
        effects: [
          DEMO_CURSOR_CLIP,
          { id: "focus-export", scope: "scene", effect: "focus-spotlight", targetId: "focus:export-button", timing: { startFrame: 66, enterFrames: 20, holdFrames: 62, exitFrames: 16 }, options: { dim: 0.74, edge: true }, zIndex: 10 },
        ],
      };
    case "magnifier":
      return {
        targets: DEMO_TARGETS,
        interaction: DEMO_INTERACTION,
        effects: [
          DEMO_CURSOR_CLIP,
          { id: "magnify-export", scope: "scene", effect: "magnifier", targetId: "export-button", timing: { startFrame: 64, enterFrames: 18, holdFrames: 80, exitFrames: 18 }, options: { radius: 150, zoom: 2.2, chromatic: true }, zIndex: 10 },
        ],
      };
    case "text-selection":
      return {
        targets: DEMO_TARGETS,
        interaction: DEMO_INTERACTION,
        effects: [
          DEMO_CURSOR_CLIP,
          {
            id: "select-key",
            scope: "scene",
            effect: "text-selection",
            targetId: "key-section",
            timing: { startFrame: 40, enterFrames: 44, holdFrames: 60, exitFrames: 20 },
            options: {
              color: "rgba(255, 224, 102, 0.45)",
              scan: true,
              tokens: [
                { x: 640, y: 286, width: 200, height: 38 },
                { x: 640, y: 342, width: 460, height: 50 },
              ],
            },
            zIndex: 12,
          },
        ],
      };
    case "ambient":
      return {
        targets: DEMO_TARGETS,
        interaction: DEMO_INTERACTION,
        effects: [
          DEMO_CURSOR_CLIP,
          { id: "ambient", scope: "video", effect: "ambient", timing: { startFrame: 0, enterFrames: 20, holdFrames: 190, exitFrames: 20 }, options: { grain: 0.05, vignette: 0.2 }, zIndex: 5 },
        ],
      };
    case "scene-transition":
      return {
        targets: DEMO_TARGETS,
        interaction: DEMO_INTERACTION,
        effects: [
          DEMO_CURSOR_CLIP,
          { id: "scene-transition", scope: "video", effect: "scene-transition", timing: { startFrame: 20, enterFrames: 30, holdFrames: 140, exitFrames: 30 }, options: { blur: 26 }, zIndex: 1 },
        ],
      };
    case "cursor":
    default:
      return PRODUCT_UI_DEMO_PLAN;
  }
};
