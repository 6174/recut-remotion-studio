/**
 * [INPUT]: 依赖 remotion-kit 内部 transition 材质文件
 * [OUTPUT]: 对外提供 A/B 转场材质：fade / slide / wipe / flip / clock-wipe / iris / cross-zoom
 * [POS]: remotion-kit/src/materials/transition 的导出边界；由 ShotGraph 按 AB_TRANSITIONS 集合
 *        决定在镜头转场窗口内用「前镜头冻结纹理 A + 当前镜头实时纹理 B」挂载
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export { FadeTransitionMaterial } from "./fade-material";
export { SlideTransitionMaterial } from "./slide-material";
export { WipeTransitionMaterial } from "./wipe-material";
export { FlipTransitionMaterial } from "./flip-material";
export { ClockWipeTransitionMaterial } from "./clock-wipe-material";
export { IrisTransitionMaterial } from "./iris-material";
export { CrossZoomTransitionMaterial } from "./cross-zoom-material";
export { AB_TRANSITIONS } from "./types";
export type {
  ABTransitionProps,
  TransitionDirection,
  TransitionMaterialId,
} from "./types";
