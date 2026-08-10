/**
 * [INPUT]: 依赖 remotion-kit 内部 three 模块各文件与 materials
 * [OUTPUT]: 对外提供 three-first GPU 合成运行时桥的稳定导出
 * [POS]: remotion-kit/src/three 的导出边界；成片根、skeleton 与场景模板从本入口引用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export { ThreeVideoCanvas } from "./ThreeVideoCanvas";
export {
  HtmlSurfaceContext,
  HtmlSurfacePlane,
  HtmlSurfaceProvider,
  supportsHtmlInCanvas,
  useHtmlSurfaceTexture,
} from "./HtmlSurface";
export type {
  HtmlSurfaceContextValue,
  HtmlSurfaceProviderProps,
  HtmlSurfaceRasterizer,
  HtmlSurfaceStatus,
} from "./HtmlSurface";
export { MediaPlane, useImageTexture } from "./MediaTexture";
export type { ImageTextureOptions, ImageTextureResult, MediaPlaneProps } from "./MediaTexture";
export { ShotGraph } from "./ShotGraph";
export type { EffectPhase, ShotGraphProps } from "./ShotGraph";
export { RemotionFrameInvalidator, seekSmooth } from "./timing";
export { shotAt } from "./types";
export type {
  CameraDescriptor,
  LensDescriptor,
  ShotAt,
  ShotContent,
  ShotDescriptor,
  ShotGraphPlan,
} from "./types";
