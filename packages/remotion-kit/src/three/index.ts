/**
 * [INPUT]: 依赖 remotion-kit 内部 three 模块各文件与 materials
 * [OUTPUT]: 对外提供 three-first GPU 合成、CameraDirector 与镜头契约的稳定导出
 * [POS]: remotion-kit/src/three 的导出边界；成片根、skeleton 与场景模板从本入口引用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export { ThreeVideoCanvas } from "./ThreeVideoCanvas";
export { CameraDirector, resolveCameraFrame } from "./CameraDirector";
export type { CameraDirectorProps, ResolvedCameraFrame } from "./CameraDirector";
export { resolveSurfaceTransform } from "./SurfaceMotion";
export type { SurfaceTransform } from "./SurfaceMotion";
export { BrowserSurfaceShell } from "./SurfaceShell";
export type { BrowserSurfaceShellProps } from "./SurfaceShell";
export {
  FrozenSurface,
  FrozenSurfaceContext,
  HtmlSurfaceContext,
  HtmlSurfacePlane,
  HtmlSurfaceProvider,
  SurfacePlaneGeometry,
  supportsHtmlInCanvas,
  useFrozenSurfaceTexture,
  useHtmlSurfaceTexture,
} from "./HtmlSurface";
export type {
  FrozenSurfaceProps,
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
  CameraKeyframe,
  CameraMoveDescriptor,
  CameraSubject,
  CameraTrackEasing,
  CameraVerb,
  LensDescriptor,
  ShotAt,
  ShotContent,
  ShotDescriptor,
  ShotGraphPlan,
  SurfaceKeyframe,
  SurfaceMoveDescriptor,
} from "./types";
