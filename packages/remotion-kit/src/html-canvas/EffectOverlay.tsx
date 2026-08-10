/**
 * [INPUT]: 依赖 Remotion 帧、EffectTimeline、InteractionScript 与 effect registry
 * [OUTPUT]: 对外提供 EffectOverlay：Cursor/Focus/Text/Ambient 的透明 2D overlay
 * [POS]: src/html-canvas 的轻量镜头层。它不读取、不复制 source canvas；重像素效果由 GpuCompositor 独立处理。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import type { PaintContext } from "./CanvasEffect";
import { resolveActiveEffects } from "./EffectTimeline";
import { resolveInteractionState } from "./interaction";
import { EFFECT_REGISTRY } from "./registry";
import type { StagePlan } from "./types";

export interface EffectOverlayProps {
  plan: StagePlan;
  width: number;
  height: number;
  pixelDensity: number;
}

export const EffectOverlay: React.FC<EffectOverlayProps> = ({ plan, width, height, pixelDensity }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interaction = useMemo(() => resolveInteractionState(plan.interaction, frame), [frame, plan.interaction]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const canvasWidth = Math.ceil(width * pixelDensity);
    const canvasHeight = Math.ceil(height * pixelDensity);
    if (canvas.width !== canvasWidth) canvas.width = canvasWidth;
    if (canvas.height !== canvasHeight) canvas.height = canvasHeight;
    context.reset();
    context.scale(pixelDensity, pixelDensity);
    const paint: PaintContext = {
      ctx: context,
      width,
      height,
      pixelDensity,
      designScale: pixelDensity,
      frame,
      interaction,
      targets: plan.targets ?? {},
    };
    for (const runtime of resolveActiveEffects(plan, frame)) {
      const definition = EFFECT_REGISTRY[runtime.clip.effect];
      if (!definition) continue;
      context.save();
      definition.render(paint, runtime);
      context.restore();
    }
  }, [frame, height, interaction, pixelDensity, plan, width]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 40 }} />;
};
