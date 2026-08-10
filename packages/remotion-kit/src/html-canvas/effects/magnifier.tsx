/**
 * [INPUT]: 依赖 CanvasEffect 元数据合同；像素 renderer 位于 GpuCompositor
 * [OUTPUT]: 对外提供 magnifierEffect（供 registry/catalog 声明）
 * [POS]: src/html-canvas/effects 的元数据叶子。真实 Magnify 必须读取 source texture，因此由
 *        GpuCompositor 的 image pass 执行，禁止退化为 overlay canvas 的 drawImage 裁剪。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CanvasEffectDefinition } from "../CanvasEffect";

export const magnifierEffect: CanvasEffectDefinition = {
  id: "magnifier",
  label: "Magnifier",
  description: "GPU 透镜：真实 HTML texture 放大、色差与 HUD，由 GpuCompositor 执行。",
  scope: "scene",
  schema: {
    radius: { type: "number", min: 40, max: 480, default: 150 },
    zoom: { type: "number", min: 1.25, max: 4, default: 2 },
    chromatic: { type: "boolean", default: false },
  },
  render: () => {},
};
