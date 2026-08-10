/**
 * [INPUT]: 依赖 CanvasEffect 元数据合同
 * [OUTPUT]: 对外提供 sceneTransitionEffect（过渡能力声明）
 * [POS]: src/html-canvas/effects 的过渡占位。真实 A→B 转场必须由 Transition adapter 接收双输入
 *        texture；单场景 StagePlan 不得伪造为当前 canvas 的重复模糊。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition } from "../CanvasEffect";

export const sceneTransitionEffect: CanvasEffectDefinition = {
  id: "scene-transition",
  label: "Scene Transition",
  description: "双场景转场预留；PageTurn/Peel 必须走 root-level Transition adapter。",
  scope: "video",
  schema: {
    blur: { type: "number", min: 0, max: 60, default: 34 },
    tint: { type: "string", default: "rgba(8, 10, 26, 0)" },
  },
  render: () => {},
};
