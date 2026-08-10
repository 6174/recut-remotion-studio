/**
 * [INPUT]: 无运行时依赖；场景引擎与各场景 beat 渲染器共享的类型契约
 * [OUTPUT]: 对外提供 Scene、BeatRenderer、SceneEngineProps 等场景层类型
 * [POS]: scenarios/_shared 的类型层；每个场景定义自己的 beat kinds 与渲染器，
 *        共享引擎只负责背景/淡入淡出/字幕/时序，把每帧画面交给场景的 beat 渲染器
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type React from "react";
import type { Palette } from "../../palette";
import type { InteractionState } from "../../html-canvas/types";

/** 场景的一个节拍（beat）：一个信息变化，通常约 5 秒。kind 由场景自定义。 */
export interface Scene {
  id: string;
  kind: string;
  durationSec: number;
  title?: string;
  kicker?: string;
  narration?: string;
  imageAssetId?: string | null;
  /** beat 专属载荷：数字翻牌、要点列表、引述、CTA 等，由场景的 beat 渲染器消费。 */
  [key: string]: unknown;
}

/** beat 渲染器收到的上下文：已解析 palette、帧、fps、画布尺寸。 */
export interface BeatContext {
  scene: Scene;
  p: Palette;
  frame: number;
  fps: number;
  width: number;
  height: number;
  resolveMediaUrl?: (assetId: string) => string | undefined;
  /** 帧驱动的互动语义状态（Three-first 内容表面注入；无互动脚本时为 undefined）。 */
  interaction?: InteractionState;
}

export type BeatRenderer = React.FC<BeatContext>;

/** 场景引擎 props：一个场景由内置 palette（场景自带视觉）+ scenes（beat 序列）+ beats（渲染器表）组成。 */
export interface SceneEngineProps {
  /** 场景内置调色板：写死在场景模板里，AI 直接参考，不依赖全局设计系统。 */
  palette: Palette;
  scenes: Scene[];
  /** kind → 渲染器；引擎按 scene.kind 分发，缺省回退到默认 content 渲染器。 */
  beats: Record<string, BeatRenderer>;
  defaultBeat?: BeatRenderer;
  resolveMediaUrl?: (assetId: string) => string | undefined;
  bgmAssetId?: string | null;
}
