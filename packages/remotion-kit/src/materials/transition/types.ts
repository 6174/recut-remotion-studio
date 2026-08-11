/**
 * [INPUT]: 无运行时依赖；A/B 转场材质共享的契约
 * [OUTPUT]: 对外提供 TransitionMaterialId、TransitionDirection、ABTransitionProps 与 AB_TRANSITIONS 集合
 * [POS]: remotion-kit/src/materials/transition 的类型层；ShotGraph 据 AB_TRANSITIONS 判定
 *        该转场需要双输入（前镜头冻结纹理 A + 当前镜头实时纹理 B）而非单输入 MaterialElement
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type * as THREE from "three";

/** A/B 转场材质 id（可挂到 ShotDescriptor.transition.material） */
export type TransitionMaterialId =
  | "fade"
  | "slide"
  | "wipe"
  | "flip"
  | "clock-wipe"
  | "iris"
  | "cross-zoom";

/** 需要双输入（A=前镜头冻结纹理，B=当前镜头实时纹理）的转场材质集合 */
export const AB_TRANSITIONS: ReadonlySet<string> = new Set<TransitionMaterialId>([
  "fade",
  "slide",
  "wipe",
  "flip",
  "clock-wipe",
  "iris",
  "cross-zoom",
]);

/** 方向型转场（slide/wipe）的方向 */
export type TransitionDirection =
  | "from-left"
  | "from-right"
  | "from-top"
  | "from-bottom";

/** A/B 转场材质统一 props */
export interface ABTransitionProps {
  mapA: THREE.Texture;
  mapB: THREE.Texture;
  /** 转场进度 0..1（0=全 A，1=全 B） */
  progress: number;
  width: number;
  height: number;
  direction?: TransitionDirection;
}
