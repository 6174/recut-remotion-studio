/**
 * [INPUT]: 依赖 remotion 的 HtmlInCanvas（内部已按真实实现校验 API 存在性）
 * [OUTPUT]: 对外提供 BrowserCapabilityGate / probeHtmlInCanvas / requireHtmlInCanvas / useHtmlInCanvasSupport
 * [POS]: src/html-canvas 的浏览器硬门禁。职责只有一件事：在 Player/Studio UI 之前验证原生能力，
 *        只允许或阻断，绝不返回 fallback；阻断时给出可操作的平台修复路径。
 *        判断来源与 canvas-ui 的 supportsHtmlInCanvas() 一致：在真实 canvas 上检查
 *        drawElementImage/requestPaint/captureElementImage 是否为函数（同步、可靠），
 *        不做脆弱的 paint 事件等待。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useState } from "react";
import { HtmlInCanvas } from "remotion";

export type CapabilityProbeResult = { supported: boolean; detail: string };

const chromeVersion = (): string => {
  const match = typeof navigator !== "undefined" ? navigator.userAgent.match(/\b(?:HeadlessChrome|Chrome)\/(\d+)/) : null;
  return match ? `Chrome ${match[1]}` : "未知浏览器";
};

const FLAG_HINT =
  "当前预览 Chromium 未暴露 HTML-in-Canvas API（需 Chrome 148+，早期版本还需 chrome://flags/#canvas-draw-element 即运行特征 CanvasDrawElement）。" +
  "平台应使用并固定满足要求的预览 Chromium；不支持时本产品阻断创作与预览，不提供降级路径。";

/** 与 canvas-ui supportsHtmlInCanvas() 相同的同步表面检查；多查 captureElementImage（Remotion 需要）。 */
export const probeHtmlInCanvas = (): CapabilityProbeResult => {
  if (typeof document === "undefined") {
    return { supported: false, detail: "无 document（SSR），无法探测" };
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const missing: string[] = [];
  if (typeof ctx?.drawElementImage !== "function") missing.push("drawElementImage");
  if (typeof canvas.requestPaint !== "function") missing.push("requestPaint");
  if (typeof canvas.captureElementImage !== "function") missing.push("captureElementImage");
  if (missing.length > 0) {
    return { supported: false, detail: `${chromeVersion()}：缺少 ${missing.join("、")}。${FLAG_HINT}` };
  }
  return { supported: true, detail: `${chromeVersion()}：HTML-in-Canvas API 可用` };
};

export const isHtmlInCanvasSupported = (): boolean => {
  try {
    return HtmlInCanvas.isSupported();
  } catch {
    return probeHtmlInCanvas().supported;
  }
};

/** 同步硬阻断：舞台渲染期调用；与门禁同一判断来源。 */
export const requireHtmlInCanvas = (): void => {
  const result = probeHtmlInCanvas();
  if (!result.supported) {
    throw new Error(result.detail);
  }
};

export type SupportStatus =
  | { status: "supported"; detail?: undefined }
  | { status: "unsupported"; detail?: string };

export const useHtmlInCanvasSupport = (): SupportStatus => {
  const [state] = useState<SupportStatus>(() => {
    const result = probeHtmlInCanvas();
    return result.supported ? { status: "supported" } : { status: "unsupported", detail: result.detail };
  });
  return state;
};

const SUPPORT_STEPS = [
  "更新 Chrome 到 148 或更高版本（预览由平台提供的 Chromium 承载，请由平台负责升级）。",
  "早期版本需启用 chrome://flags/#canvas-draw-element（运行特征 CanvasDrawElement）并重启浏览器。",
  "本产品把该能力作为硬门槛：不支持时不会伪装成普通 DOM 预览。",
];

export const BrowserCapabilityGate: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const state = useHtmlInCanvasSupport();
  if (state.status === "supported") return <>{children}</>;
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
        minHeight: 160,
        padding: 24,
        background: "#160d0d",
        color: "#f6d9d9",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 1.7,
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 700, letterSpacing: "0.08em" }}>HTML-IN-CANVAS 不可用</p>
        <p style={{ margin: "6px 0 0", opacity: 0.9 }}>{state.detail}</p>
        <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", opacity: 0.85 }}>
          {SUPPORT_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
