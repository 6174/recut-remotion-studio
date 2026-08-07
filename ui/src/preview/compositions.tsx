/**
 * [INPUT]: 依赖 @recut/remotion-kit 的字幕主题/模板调色板/效果层/shotcraft 组件
 * [OUTPUT]: 对外提供 PreviewScene（按 kind+id 渲染真实组件的演示合成）与时长元数据
 * [POS]: remotion-studio/ui 预览层的合成端；与 workspace 渲染同一份 kit 组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import {
  BackgroundFX,
  buildCaptionsData,
  CaptionTheme,
  DigitRoll,
  FlashCut,
  resolvePalette,
  VerticalTicker,
} from "@recut/remotion-kit";
import * as Templates from "@recut/remotion-kit/templates";
import { CAPTION_DURATION_SEC, PREVIEW_FPS, SAMPLE_NARRATION } from "./sample";
import { RichTemplateDemo, richTemplateIds } from "./rich-templates";

export const PREVIEW_WIDTH = 1920;
export const PREVIEW_HEIGHT = 1080;

/**
 * `style` 是 Studio 的视觉风格样板；`template` 是可直接运行的 Remotion 模板。
 * 两者不能共用一个名称，否则组件目录里的模板会被错误派发到风格样板预览。
 */
export type PreviewKind = "caption" | "style" | "template" | "component";

export interface PreviewSpec {
  kind: PreviewKind;
  id: string;
}

export const previewDurationFrames = (kind: PreviewKind): number =>
  kind === "caption" ? Math.round((CAPTION_DURATION_SEC + 1.5) * PREVIEW_FPS) : Math.round(5 * PREVIEW_FPS);

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const CaptionPanel: React.FC<{ theme: string; palettePrimary?: string; paletteAccent?: string; compact?: boolean }> = ({
  theme,
  palettePrimary,
  paletteAccent,
  compact,
}) => {
  const { width, height } = useVideoConfig();
  const data = useMemo(() => buildCaptionsData(SAMPLE_NARRATION, 0.4, CAPTION_DURATION_SEC), []);
  return (
    <div
      style={{
        position: "absolute",
        bottom: compact ? height * 0.06 : height * 0.08,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 5%",
        pointerEvents: "none",
      }}
    >
      <CaptionTheme
        data={data}
        fontSize={compact ? Math.round(width / 34) : Math.round(width / 24)}
        primaryColor={palettePrimary ?? "#ffffff"}
        secondaryColor={paletteAccent ?? "#f5c044"}
        theme={theme}
      />
    </div>
  );
};

/** 字幕主题演示：中性深色底 + 主题自身的动效与字形。 */
export const CaptionDemo: React.FC<{ theme: string }> = ({ theme }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0d1017" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(130% 100% at 50% 0%, #1d2634 0%, #0d1017 60%)" }} />
      <div style={{ position: "absolute", top: "10%", left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: Math.max(16, Math.round(width / 110)), letterSpacing: "0.3em", color: "#9aa4b5" }}>
          CAPTION · {theme}
        </span>
      </div>
      <CaptionPanel theme={theme} />
      <div style={{ position: "absolute", bottom: height * 0.02, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.2em", color: "#4b5563" }}>LIVE ANIMATED PREVIEW</span>
      </div>
    </AbsoluteFill>
  );
};

/** 视觉模板演示：模板调色板 + 背景效果 + 标题排版 + 模板默认字幕主题。 */
export const TemplateDemo: React.FC<{ template: string }> = ({ template }) => {
  const palette = resolvePalette(template);
  const { width, height } = useVideoConfig();
  if (richTemplateIds.has(template)) return <RichTemplateDemo template={template} />;
  return (
    <AbsoluteFill style={{ background: palette.background }}>
      <BackgroundFX effectId={palette.effectId} palette={palette} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 10%" }}>
        <div style={{ fontFamily: MONO, fontSize: Math.max(18, Math.round(width / 100)), letterSpacing: "0.3em", color: palette.accent, fontWeight: 600, marginBottom: 26 }}>RECUT × REMOTION</div>
        <h1 style={{ fontSize: Math.max(56, Math.round(width / 20)), fontWeight: 900, color: palette.text, margin: 0, lineHeight: 1.08, fontFamily: palette.fontFamily, letterSpacing: "-0.03em" }}>把想法，写成成片</h1>
        <div style={{ width: Math.round(width / 11), height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${palette.accent}, ${palette.primary})`, marginTop: 28 }} />
      </div>
      <CaptionPanel compact paletteAccent={palette.accent} theme={palette.captionTheme || "pop"} />
      <div style={{ position: "absolute", bottom: height * 0.02, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.2em", color: "rgba(154,164,181,0.6)" }}>{template.toUpperCase()} · STYLE</span>
      </div>
    </AbsoluteFill>
  );
};

const DigitRollDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(135deg, #17100a 0%, #2a1d0f 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
    <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "0.28em", color: "#e8b341", fontWeight: 600 }}>REVENUE · 本季度</span>
    <div style={{ fontFamily: MONO }}>
      <DigitRoll color="#f5c044" fontSize={Math.max(72, Math.round(120 * 0.9))} value="4528900" />
    </div>
    <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.2em", color: "rgba(154,164,181,0.7)" }}>DIGIT ROLL</span>
  </AbsoluteFill>
);

const VerticalTickerDemo: React.FC = () => {
  const cards = (text: string, color: string) =>
    Array.from({ length: 5 }).map((_, index) => (
      <div key={index} style={{ background: color, borderRadius: 14, padding: "16px 24px", color: "#0d1017", fontWeight: 700, fontSize: 32, fontFamily: "system-ui, sans-serif" }}>{text}</div>
    ));
  return (
    <AbsoluteFill style={{ background: "#0d1017" }}>
      <VerticalTicker
        backgroundColor="#0d1017"
        columnWidth={340}
        columns={[
          { durationInSeconds: 3, direction: -1, items: cards("选题", "#f5c044") },
          { durationInSeconds: 4, direction: 1, items: cards("写代码", "#22d3ee") },
          { durationInSeconds: 5, direction: -1, items: cards("实时预览", "#a78bfa") },
        ]}
        maskHeight={180}
        tiltDeg={18}
      />
    </AbsoluteFill>
  );
};

const FlashCutDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "#0d1017" }}>
    <FlashCut duration={10} />
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <span style={{ fontFamily: MONO, fontSize: 28, letterSpacing: "0.28em", color: "#9aa4b5" }}>FLASH · 节奏转场</span>
    </div>
  </AbsoluteFill>
);

const PageCamDemo: React.FC = () => (
  <PlaceholderDemo label="PAGECAM" note="页面镜头预览需真实页面素材，请以代码为准。" />
);

const PlaceholderDemo: React.FC<{ label: string; note: string }> = ({ label, note }) => (
  <AbsoluteFill style={{ background: "#0d1017", display: "grid", placeItems: "center", padding: 32, textAlign: "center" }}>
    <div>
      <p style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.2em", color: "#9aa4b5" }}>{label}</p>
      <p style={{ color: "#5b6472", fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>{note}</p>
    </div>
  </AbsoluteFill>
);

const pascalCase = (id: string) => id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");

/** 模板真实预览：按 id 查模板目录 barrel，用默认 props 直接渲染真实组件。 */
const TemplatePreview: React.FC<{ id: string }> = ({ id }) => {
  const Component = (Templates as Record<string, React.ComponentType | undefined>)[pascalCase(id)];
  if (!Component) {
    return <PlaceholderDemo label={id} note="该模板无法直接预览，请以代码为准。" />;
  }
  return (
    <TemplateBoundary fallback={<PlaceholderDemo label={id} note="该模板需特定 props，预览以代码为准。" />}>
      <Component />
    </TemplateBoundary>
  );
};

class TemplateBoundary extends React.Component<{ fallback: React.ReactNode; children?: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export const ComponentDemo: React.FC<{ kind?: string; id: string }> = ({ kind, id }) => {
  switch (id) {
    case "DigitRoll":
      return <DigitRollDemo />;
    case "VerticalTicker":
      return <VerticalTickerDemo />;
    case "FlashCut":
      return <FlashCutDemo />;
    case "PageCam":
      return <PageCamDemo />;
    case "FlatPanel":
      return <PlaceholderDemo label="FLATPANEL" note="该组件依赖 three 3D 渲染环境，预览以代码为准。" />;
    default:
      return kind === "template" ? <TemplatePreview id={id} /> : <PlaceholderDemo label={id} note="暂无可视化预览，请以代码为准。" />;
  }
};

/** 按 kind+id 分发到真实组件的演示合成（PreviewCard / PreviewPicker 复用）。 */
export const PreviewScene: React.FC<PreviewSpec> = ({ kind, id }) => {
  if (kind === "caption") return <CaptionDemo theme={id} />;
  if (kind === "style") return <TemplateDemo template={id} />;
  return <ComponentDemo id={id} kind={kind} />;
};
