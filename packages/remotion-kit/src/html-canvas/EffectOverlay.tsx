/**
 * [INPUT]: 依赖 remotion 帧、EffectTimeline 解析、InteractionScript 推导、registry
 * [OUTPUT]: 对外提供 EffectOverlay：内容层之上唯一的透明效果层，按 composition 帧逐帧绘制全部效果
 * [POS]: src/html-canvas 的效果引擎叶子组件。等价于 CanvasUI 的 output canvas + rAF 引擎，
 *        但时钟是 composition frame（确定性：预览与导出逐帧一致），且只在帧变化时重画这一层，
 *        不触碰内容层。内容采样读 contentCanvasRef（HtmlInCanvas 的 layout canvas）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import type { PaintContext } from "./CanvasEffect";
import { resolveActiveEffects } from "./EffectTimeline";
import { resolveInteractionState } from "./InteractionScript";
import { EFFECT_REGISTRY } from "./registry";
import type { StagePlan } from "./types";

export interface EffectOverlayProps {
  plan: StagePlan;
  width: number;
  height: number;
  pixelDensity?: number;
  /** HtmlInCanvas 的 layout canvas：放大镜/转场等采样内容的来源。 */
  contentCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const EffectOverlay: React.FC<EffectOverlayProps> = ({ plan, width, height, pixelDensity, contentCanvasRef }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const interaction = useMemo(() => resolveInteractionState(plan.interaction, frame), [plan.interaction, frame]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = pixelDensity ?? 1;
    const cw = Math.ceil(width * dpr);
    const ch = Math.ceil(height * dpr);
    if (canvas.width !== cw) canvas.width = cw;
    if (canvas.height !== ch) canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.reset();
    ctx.scale(dpr, dpr);

    const runtimes = resolveActiveEffects(plan, frame);
    const paint: PaintContext = {
      ctx,
      width,
      height,
      pixelDensity: dpr,
      designScale: dpr,
      contentCanvas: contentCanvasRef.current,
      frame,
      interaction,
      targets: plan.targets ?? {},
    };

    for (const runtime of runtimes) {
      const def = EFFECT_REGISTRY[runtime.clip.effect];
      if (!def) continue;
      ctx.save();
      def.render(paint, runtime);
      ctx.restore();
    }
  }, [frame, plan, width, height, pixelDensity, interaction, contentCanvasRef]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }} />;
};
