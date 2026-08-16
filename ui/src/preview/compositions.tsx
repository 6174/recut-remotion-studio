/**
 * [INPUT]: 依赖 @recut/remotion-kit 的字幕主题/模板调色板/效果层/动态组件
 * [OUTPUT]: 对外提供 PreviewScene（按 kind+id 渲染真实组件、材质或 Three camera 的演示合成）与时长元数据；组件/模板演示统一铺在深色验收舞台上，杜绝白字白底；字幕预览使用固定安全轨道防止播放抖动
 * [POS]: remotion-studio/ui 预览层的合成端；与 workspace 渲染同一份 kit 组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import {
  buildCaptionsData,
  CaptionTheme,
  DigitRoll,
  DoodleExplainerVideo,
  FacelessExplainerVideo,
  FlashCut,
  FlameFrame,
  ProductLaunchVideo,
  VerticalTicker,
  EffectFixtureDemo,
} from "@recut/remotion-kit";
import * as Templates from "@recut/remotion-kit/templates";
import { CAPTION_DURATION_SEC, PREVIEW_FPS, SAMPLE_NARRATION } from "./sample";
import { MaterialPreview } from "./material-preview";
import { CameraPreview } from "./camera-preview";
import { getRecutLocale } from "../recut-sdk";
import { t } from "../i18n";

export const PREVIEW_WIDTH = 1920;
export const PREVIEW_HEIGHT = 1080;

/** `composition` 是成片模板；`template` 是可直接运行的内置组件模板；`material` 是 Three GPU 材质；`effect` 是交互 overlay。 */
export type PreviewKind = "caption" | "composition" | "template" | "component" | "effect" | "material" | "camera";

export interface PreviewSpec {
  kind: PreviewKind;
  id: string;
  thumbnail?: boolean;
}

export const previewDurationFrames = (spec: PreviewSpec): number => {
  if (spec.kind === "material") return Math.round(8 * PREVIEW_FPS);
  if (spec.kind === "camera") return Math.round(8 * PREVIEW_FPS);
  if (spec.kind === "effect") return Math.round(8 * PREVIEW_FPS);
  if (spec.kind === "caption") return Math.round((CAPTION_DURATION_SEC + 1.5) * PREVIEW_FPS);
  if (spec.kind === "composition") {
    // 场景预览跟随真实成片时长：product-launch 66s / faceless-explainer 55s / doodle-explainer 44s。
    const seconds = spec.id === "product-launch" ? 66 : spec.id === "faceless-explainer" ? 55 : spec.id === "doodle-explainer" ? 44 : 14;
    return Math.round(seconds * PREVIEW_FPS);
  }
  return Math.round(5 * PREVIEW_FPS);
};

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const CAPTION_PRIMARY = "#18211B";
const CAPTION_ACCENT = "#17A764";

const CaptionPanel: React.FC<{ theme: string; palettePrimary?: string; paletteAccent?: string; compact?: boolean; thumbnail?: boolean }> = ({
  theme,
  palettePrimary,
  paletteAccent,
  compact,
  thumbnail,
}) => {
  const { width, height } = useVideoConfig();
  const data = useMemo(() => buildCaptionsData(SAMPLE_NARRATION, 0.4, CAPTION_DURATION_SEC, 2), []);
  const laneHeight = height * (thumbnail ? 0.42 : compact ? 0.3 : 0.34);
  return (
    <div
      style={{
        position: "absolute",
        bottom: compact ? height * 0.06 : height * 0.08,
        height: laneHeight,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 5%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <CaptionTheme
        data={data}
        fontSize={thumbnail ? Math.round(width / 9) : compact ? Math.round(width / 34) : Math.round(width / 20)}
        primaryColor={palettePrimary ?? "#ffffff"}
        secondaryColor={paletteAccent ?? "#f5c044"}
        theme={theme}
      />
    </div>
  );
};

/** 字幕主题演示：默认白色网格全画布，直接检验无底框字幕的字形与层级。 */
export const CaptionDemo: React.FC<{ theme: string; thumbnail?: boolean }> = ({ theme, thumbnail }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#ffffff", backgroundImage: "linear-gradient(#e1e8e2 1px, transparent 1px), linear-gradient(90deg, #e1e8e2 1px, transparent 1px)", backgroundSize: "48px 48px" }}>
      <div style={{ position: "absolute", top: "10%", left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: Math.max(16, Math.round(width / 110)), letterSpacing: "0.3em", color: "#637367" }}>
          CAPTION · {theme}
        </span>
      </div>
      <CaptionPanel paletteAccent={CAPTION_ACCENT} palettePrimary={CAPTION_PRIMARY} theme={theme} thumbnail={thumbnail} />
      <div style={{ position: "absolute", bottom: height * 0.02, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.2em", color: "#77877c" }}>LIVE ANIMATED PREVIEW</span>
      </div>
    </AbsoluteFill>
  );
};

const DigitRollDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(135deg, #17100a 0%, #2a1d0f 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
    <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "0.28em", color: "#e8b341", fontWeight: 600 }}>{t(getRecutLocale(), "preview.revenueQuarter")}</span>
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
  const locale = getRecutLocale();
  return (
    <AbsoluteFill style={{ background: "#0d1017" }}>
      <VerticalTicker
        backgroundColor="#0d1017"
        columnWidth={340}
        columns={[
          { durationInSeconds: 3, direction: -1, items: cards(t(locale, "preview.tickerTopic"), "#f5c044") },
          { durationInSeconds: 4, direction: 1, items: cards(t(locale, "preview.tickerCode"), "#22d3ee") },
          { durationInSeconds: 5, direction: -1, items: cards(t(locale, "preview.tickerPreview"), "#a78bfa") },
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
      <span style={{ fontFamily: MONO, fontSize: 28, letterSpacing: "0.28em", color: "#9aa4b5" }}>{t(getRecutLocale(), "preview.flash")}</span>
    </div>
  </AbsoluteFill>
);

const FlameFrameDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #3d1507 0%, #160b08 46%, #08090d 100%)" }}>
    <FlameFrame />
  </AbsoluteFill>
);

const PageCamDemo: React.FC = () => (
  <PlaceholderDemo label="PAGECAM" note={t(getRecutLocale(), "preview.pagecamNote")} />
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
  const locale = getRecutLocale();
  const Component = (Templates as unknown as Record<string, React.ComponentType | undefined>)[pascalCase(id)];
  if (!Component) {
    return <PlaceholderDemo label={id} note={t(locale, "preview.templateUnavailable")} />;
  }
  return (
    <TemplateBoundary fallback={<PlaceholderDemo label={id} note={t(locale, "preview.templatePropsNote")} />}>
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
  const locale = getRecutLocale();
  switch (id) {
    case "DigitRoll":
      return <DigitRollDemo />;
    case "VerticalTicker":
      return <VerticalTickerDemo />;
    case "FlashCut":
      return <FlashCutDemo />;
    case "FlameFrame":
      return <FlameFrameDemo />;
    case "PageCam":
      return <PageCamDemo />;
    case "FlatPanel":
      return <PlaceholderDemo label="FLATPANEL" note={t(locale, "preview.component3dNote")} />;
    default:
      return kind === "template" ? <TemplatePreview id={id} /> : <PlaceholderDemo label={id} note={t(locale, "preview.noPreview")} />;
  }
};

/** 场景真实预览：渲染 kit 里的真实场景组件（beats + 模板内置 60s 完整 SCENES），
 *  展示这支模板真正的成片视觉，预览时长跟随场景真实成片时长。 */
const ScenarioDemo: React.FC<{ id: string }> = ({ id }) => {
  if (id === "product-launch") {
    return <ProductLaunchVideo />;
  }
  if (id === "doodle-explainer") {
    return <DoodleExplainerVideo />;
  }
  return <FacelessExplainerVideo />;
};

/** 按 kind+id 分发到真实组件的演示合成（PreviewCard / PreviewPicker 复用）。 */
export const PreviewScene: React.FC<PreviewSpec> = ({ kind, id, thumbnail }) => {
  if (kind === "caption") return <CaptionDemo theme={id} thumbnail={thumbnail} />;
  if (kind === "composition") return <ScenarioDemo id={id} />;
  if (kind === "material") return <MaterialPreview id={id} />;
  if (kind === "camera") return <CameraPreview id={id} />;
  if (kind === "effect") return <EffectPreview id={id} />;
  return (
    <AbsoluteFill style={{ background: "#0c100d", display: "grid", placeItems: "center", padding: "3.5%" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", border: "1px solid #2c352f", borderRadius: 14, background: "#0c100d", boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)" }}>
        <ComponentDemo id={id} kind={kind} />
      </div>
    </AbsoluteFill>
  );
};

/** HTML-in-Canvas 表达镜头真实预览：走唯一捕获舞台，与项目导出同一套 kit 舞台。 */
const EffectPreview: React.FC<{ id: string }> = ({ id }) => (
  <EffectFixtureDemo effect={id} />
);
