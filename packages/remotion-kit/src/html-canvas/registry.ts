/**
 * [INPUT]: 依赖 effects 目录的各 renderer 定义
 * [OUTPUT]: 对外提供 EFFECT_REGISTRY（effectId → CanvasEffectDefinition）与 getEffectDefinition
 * [POS]: src/html-canvas 的效果注册层；舞台按 clip.effect 查表绘制，catalog 从同一来源生成条目
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectRegistry } from "./CanvasEffect";
import { ambientEffect } from "./effects/ambient";
import { cursorEffect } from "./effects/cursor";
import { focusSpotlightEffect } from "./effects/focus-spotlight";
import { magnifierEffect } from "./effects/magnifier";
import { sceneTransitionEffect } from "./effects/scene-transition";
import { textSelectionEffect } from "./effects/text-selection";

export const EFFECT_REGISTRY: CanvasEffectRegistry = {
  cursor: cursorEffect,
  "focus-spotlight": focusSpotlightEffect,
  "text-selection": textSelectionEffect,
  magnifier: magnifierEffect,
  "scene-transition": sceneTransitionEffect,
  ambient: ambientEffect,
};

export const getEffectDefinition = (id: string) => EFFECT_REGISTRY[id as keyof CanvasEffectRegistry];
