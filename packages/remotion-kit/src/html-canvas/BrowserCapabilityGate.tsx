/**
 * [INPUT]: 依赖 remotion 的 HtmlInCanvas（内部已按真实实现校验 API 存在性）
 * [OUTPUT]: 对外提供 BrowserCapabilityGate / probeHtmlInCanvas / requireHtmlInCanvas / useHtmlInCanvasSupport / HtmlInCanvasCapability
 * [POS]: src/html-canvas 的浏览器硬门禁。职责只有一件事：在 Player/Studio UI 之前验证原生能力，
 *        只允许或阻断，绝不返回 fallback；阻断时给出可操作的平台修复路径。
 *        准入唯一委托给 Remotion 的 HtmlInCanvas.isSupported()；诊断只解释 Origin Trial
 *        或 CanvasDrawElement feature 的平台配置，不参与准入判断，也不制造 fallback。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useState } from "react";
import { HtmlInCanvas } from "remotion";

export type HtmlInCanvasCapability = {
  api: boolean;
  originTrial: "configured" | "missing";
};

export type CapabilityProbeResult = {
  supported: boolean;
  detail: string;
  capability: HtmlInCanvasCapability;
};

const ORIGIN_TRIAL_SELECTOR = 'meta[http-equiv="origin-trial"][data-recut-html-in-canvas]';

/** 这是部署诊断，而不是第二套 capability gate；最终准入仍完全由 Remotion 决定。 */
const inspectPlatformCapability = (): HtmlInCanvasCapability => ({
  api: typeof document !== "undefined" && HtmlInCanvas.isSupported(),
  originTrial: typeof document !== "undefined" && document.querySelector(ORIGIN_TRIAL_SELECTOR)?.getAttribute("content")?.trim()
    ? "configured"
    : "missing",
});

const unsupportedDetail = (capability: HtmlInCanvasCapability): string => {
  const trial = capability.originTrial === "configured"
    ? "已配置 Recut Origin Trial，但当前 Chromium 未接受它（检查 token 的 origin、有效期与页面加载顺序）。"
    : "Recut 当前 origin 未配置 HTMLInCanvas Origin Trial。CanvasUI 能运行，是因为它为 canvasui.dev 注入了仅该域有效的 token；该 token 不能复用到 Recut。";
  return `${trial} 平台须为嵌入式 Chromium 启用 CanvasDrawElement，或为每个固定预览 origin 签发自己的 token。项目预览使用动态 localhost 端口，因此正式方案应由宿主浏览器启用 feature；不支持时本产品阻断原生镜头层，不伪装为 DOM 效果。`;
};

/** 唯一能力来源：Remotion 已排除 Chrome 147 等 API 表面存在但实现有缺陷的版本。 */
export const probeHtmlInCanvas = (): CapabilityProbeResult => {
  let capability: HtmlInCanvasCapability = { api: false, originTrial: "missing" };
  try {
    capability = inspectPlatformCapability();
    return capability.api
      ? { supported: true, detail: "Remotion：HTML-in-Canvas API 可用", capability }
      : { supported: false, detail: unsupportedDetail(capability), capability };
  } catch (error) {
    return { supported: false, detail: `${unsupportedDetail(capability)} 原因：${error instanceof Error ? error.message : String(error)}`, capability };
  }
};

export const isHtmlInCanvasSupported = (): boolean => {
  return probeHtmlInCanvas().supported;
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
  "平台启动嵌入式 Chromium 时启用 CanvasDrawElement；不要把 chrome://flags 交给终端用户配置。",
  "若使用 Origin Trial，必须为 Recut 的实际固定 origin 申请 token，并在初始 HTML 的 <head> 注入它；不能复用 CanvasUI 的 token。",
  "项目 Vite 预览使用动态 localhost 端口，不能把单个 origin token 当作通用开发方案。",
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
