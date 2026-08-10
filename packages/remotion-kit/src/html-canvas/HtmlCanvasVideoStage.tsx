/**
 * [INPUT]: 依赖 Remotion AbsoluteFill/useCurrentFrame、InteractionScript、GpuCompositor 与 EffectOverlay
 * [OUTPUT]: 对外提供 HtmlCanvasVideoStage（capture + GPU 像素层 + 2D 引导层）
 * [POS]: src/html-canvas 的舞台层。逐行对齐 Remotion 官方 HtmlInCanvasPresentation：手动设置
 *        canvas.layoutSubtree，在 paint 事件捕获 firstChild，再经 OffscreenCanvas 2D drawElementImage 输出。
 *        只有该基线显示 source 后，才允许在其后接入独立的单-pass 镜头 adapter。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { createContext, useContext, useLayoutEffect, useMemo, useRef } from "react";
import { AbsoluteFill, HtmlInCanvas, useCurrentFrame, useVideoConfig } from "remotion";
import { requireHtmlInCanvas } from "./BrowserCapabilityGate";
import { EffectOverlay } from "./EffectOverlay";
import { GpuCompositor } from "./GpuCompositor";
import { InteractionProvider } from "./InteractionScript";
import { resolveInteractionState } from "./interaction";
import type { StagePlan } from "./types";

const StageContext = createContext(false);
const STAGE_DIAGNOSTIC_VERSION = "official-presentation-capture-20260809.5";

export interface HtmlCanvasVideoStageProps {
  plan: StagePlan;
  width?: number;
  height?: number;
  pixelDensity?: number;
  /**
   * HTML 画面自身变化时递增。它是 source capture 的显式失效信号；特效的逐帧进度不是 source 变化，
   * 因此不得把 frame 传进来。未提供时，舞台仍会在语义 hover/click/scroll 状态变化时自动重捕获。
   */
  sourceVersion?: string | number;
  children?: React.ReactNode;
}

const STAGE_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

const GPU_STYLE: React.CSSProperties = { ...STAGE_STYLE, pointerEvents: "none", zIndex: 20 };

/**
 * 官方 HtmlInCanvasPresentation 的单输入截取版。
 *
 * 注意：不能用普通 2D canvas 在主线程重画。先 transfer 到 OffscreenCanvas，才能让 Chromium
 * 同时保留 layoutSubtree 的 paint record 与输出位图；这正是官方 transition 的关键路径。
 */
export const HtmlCanvasVideoStage: React.FC<HtmlCanvasVideoStageProps> = ({ plan, width, height, pixelDensity, sourceVersion, children }) => {
  requireHtmlInCanvas();
  const nested = useContext(StageContext);
  if (nested) throw new Error("HtmlCanvasVideoStage 只允许存在一个；嵌套 HTML-in-Canvas 在服务器导出尚不支持。");

  const frame = useCurrentFrame();
  const { width: videoWidth, height: videoHeight, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<OffscreenCanvas | null>(null);
  const captureContextRef = useRef<OffscreenCanvasRenderingContext2D | null>(null);
  const compositorRef = useRef<GpuCompositor | null>(null);
  const didLogPaintRef = useRef(false);
  const designWidth = width ?? videoWidth;
  const designHeight = height ?? videoHeight;
  const density = pixelDensity ?? 1;
  const frameRef = useRef(frame);
  const planRef = useRef(plan);
  const densityRef = useRef(density);
  const fpsRef = useRef(fps);
  const semanticState = useMemo(() => resolveInteractionState(plan.interaction, frame), [frame, plan.interaction]);
  const semanticVersion = `${semanticState.hoveredTargetId ?? ""}|${semanticState.pressedTargetId ?? ""}|${semanticState.scrollTargetId ?? ""}|${semanticState.scrollOffsetY}|${semanticState.clicks.map((click) => `${click.frame}:${click.targetId}`).join(",")}`;
  frameRef.current = frame;
  planRef.current = plan;
  densityRef.current = density;
  fpsRef.current = fps;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const gpuCanvas = gpuCanvasRef.current;
    if (!canvas) throw new Error("HtmlInCanvas capture canvas 未挂载");
    if (!gpuCanvas) throw new Error("HtmlInCanvas GPU output canvas 未挂载");
    const captureCanvas = canvas.transferControlToOffscreen();
    const captureContext = captureCanvas.getContext("2d");
    if (!captureContext) throw new Error("无法创建 HtmlInCanvas OffscreenCanvas 2D context");
    const compositor = new GpuCompositor(gpuCanvas.transferControlToOffscreen());
    captureCanvasRef.current = captureCanvas;
    captureContextRef.current = captureContext;
    compositorRef.current = compositor;
    console.warn("[Recut HtmlCanvasVideoStage] capture host ready", {
      version: STAGE_DIAGNOSTIC_VERSION,
      renderer: "official-html-in-canvas-presentation-copy",
      supported: HtmlInCanvas.isSupported(),
      width: designWidth,
      height: designHeight,
      pixelDensity: density,
      href: window.location.href,
    });
    return () => {
      captureCanvasRef.current = null;
      captureContextRef.current = null;
      compositor.destroy();
      compositorRef.current = null;
    };
  }, [density, designHeight, designWidth]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("HtmlInCanvas capture canvas 未挂载");
    canvas.layoutSubtree = true;
    const onPaint = () => {
      const content = canvas.firstElementChild;
      const captureCanvas = captureCanvasRef.current;
      const captureContext = captureContextRef.current;
      if (!content || !captureCanvas || !captureContext) return;
      const image = canvas.captureElementImage(content);
      try {
        captureContext.reset();
        captureContext.drawElementImage(image, 0, 0);
        const compositor = compositorRef.current;
        compositor?.upload(captureCanvas);
        compositor?.render({ frame: frameRef.current, fps: fpsRef.current, plan: planRef.current, pixelDensity: densityRef.current });
        if (!didLogPaintRef.current) {
          didLogPaintRef.current = true;
          console.warn("[Recut HtmlCanvasVideoStage] first paint copied", {
            version: STAGE_DIAGNOSTIC_VERSION,
            child: content.tagName,
            canvasWidth: captureCanvas.width,
            canvasHeight: captureCanvas.height,
          });
        }
      } finally {
        image.close();
      }
    };
    canvas.addEventListener("paint", onPaint);
    // 初次 capture 必须由官方 paint pipeline 产生，不能假设首帧会自动触发。
    canvas.requestPaint?.();
    return () => canvas.removeEventListener("paint", onPaint);
  }, []);

  // source 与时间特效是两类不同数据：只有 HTML 的语义状态或显式 sourceVersion 改变，
  // 才重走昂贵的 capture + texImage2D。鼠标轨迹、光学折射、glitch seed 一律只跑 GPU render。
  useLayoutEffect(() => {
    canvasRef.current?.requestPaint?.();
  }, [semanticVersion, sourceVersion]);

  // 每一帧只保留一个全屏 GPU draw；没有新 source 时绝不 requestPaint/上传整张纹理。
  useLayoutEffect(() => {
    compositorRef.current?.render({ frame, fps, plan, pixelDensity: density });
  }, [density, fps, frame, plan]);

  return (
    <StageContext.Provider value={true}>
      <AbsoluteFill>
        <canvas ref={canvasRef} width={Math.ceil(designWidth * density)} height={Math.ceil(designHeight * density)} style={STAGE_STYLE}>
          <InteractionProvider events={plan.interaction}>{children}</InteractionProvider>
        </canvas>
        <canvas ref={gpuCanvasRef} width={Math.ceil(designWidth * density)} height={Math.ceil(designHeight * density)} style={GPU_STYLE} />
        <EffectOverlay height={designHeight} pixelDensity={density} plan={plan} width={designWidth} />
      </AbsoluteFill>
    </StageContext.Provider>
  );
};
