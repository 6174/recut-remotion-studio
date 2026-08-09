/**
 * [INPUT]: 依赖 remotion HtmlInCanvas、InteractionScript、EffectOverlay
 * [OUTPUT]: 对外提供 HtmlCanvasVideoStage（整支视频唯一的内容捕获面 + 效果层总合成器）
 * [POS]: src/html-canvas 的舞台层。架构对齐 CanvasUI 的两层模型：
 *        ① 内容层 = <HtmlInCanvas>（default onPaint，浏览器合成，脏了才重绘，静态内容零成本）；
 *        ② 效果层 = <EffectOverlay>（透明覆盖 canvas，帧驱动引擎，每帧只重画效果）。
 *        组件只贡献 clip/target/互动数据，绝不自行创建 <HtmlInCanvas>（嵌套检测会抛错）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { createContext, useContext, useEffect, useRef } from "react";
import { HtmlInCanvas, useVideoConfig } from "remotion";
import { requireHtmlInCanvas } from "./BrowserCapabilityGate";
import { EffectOverlay } from "./EffectOverlay";
import { InteractionProvider } from "./InteractionScript";
import type { StagePlan } from "./types";

/** 检测同一 React 树内的嵌套捕获面（跨 Player 的兄弟舞台不误伤）。 */
const StageContext = createContext(false);

export interface HtmlCanvasVideoStageProps {
  plan: StagePlan;
  width?: number;
  height?: number;
  pixelDensity?: number;
  children?: React.ReactNode;
}

/** 内容层静态壳：children 引用稳定时不随帧重渲染；动画 beat 靠 useCurrentFrame 自行订阅。 */
const ContentMemo = React.memo(({ children }: { children?: React.ReactNode }) => <>{children}</>);

const CONTENT_WRAPPER_STYLE: React.CSSProperties = { position: "absolute", inset: 0 };

export const HtmlCanvasVideoStage: React.FC<HtmlCanvasVideoStageProps> = ({ plan, width, height, pixelDensity, children }) => {
  requireHtmlInCanvas();
  const nested = useContext(StageContext);
  if (nested) {
    throw new Error("HtmlCanvasVideoStage 只允许存在一个；嵌套 HTML-in-Canvas 在服务器导出尚不支持。");
  }
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const designWidth = width ?? videoWidth;
  const designHeight = height ?? videoHeight;
  const effectiveDensity = pixelDensity ?? 1;
  const layoutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // 内容层 dirty-gated：挂载后主动 requestPaint 一次，让 HtmlInCanvas 的 default onPaint
  // 捕获已布局的内容（静态场景首次 paint 往往早于内容就绪，不补一次就会一直是空的）。
  // 之后的动画内容靠浏览器自然重绘驱动，不额外干预。
  useEffect(() => {
    const canvas = layoutCanvasRef.current as (HTMLCanvasElement & { requestPaint?: () => void }) | null;
    canvas?.requestPaint?.();
  }, []);

  return (
    <StageContext.Provider value={true}>
      <div style={{ position: "absolute", inset: 0 }}>
        <HtmlInCanvas width={designWidth} height={designHeight} pixelDensity={effectiveDensity} ref={layoutCanvasRef}>
          <InteractionProvider events={plan.interaction}>
            <div ref={contentRef} style={CONTENT_WRAPPER_STYLE}>
              <ContentMemo>{children}</ContentMemo>
            </div>
          </InteractionProvider>
        </HtmlInCanvas>
        <EffectOverlay
          plan={plan}
          width={designWidth}
          height={designHeight}
          pixelDensity={effectiveDensity}
          contentCanvasRef={layoutCanvasRef}
        />
      </div>
    </StageContext.Provider>
  );
};
