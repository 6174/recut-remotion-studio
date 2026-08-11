/**
 * [INPUT]: 依赖 materials/types 的 MaterialId；无运行时依赖
 * [OUTPUT]: 对外提供 ShotDescriptor、CameraMoveDescriptor、SurfaceMoveDescriptor、ShotGraphPlan、CameraDescriptor 与 shotAt 纯函数
 * [POS]: remotion-kit/src/three 的镜头契约层；时序、内容表面姿态、相机与 GPU renderer 通过它保持无内容耦合
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { MaterialId } from "../materials/types";
import type { TransitionMaterialId } from "../materials/transition/types";

export type ShotContent = "html" | "media" | "both";

/** 转场材质：单输入 transform 材质（bend/store-peel/cloth）或 A/B 双输入转场材质（remotion transitions） */
export type TransitionMaterial = MaterialId | TransitionMaterialId;

/** 扫描镜头 descriptor：镜头锚点（归一化 UV）、开始时点与扫描距离 */
export interface LensDescriptor {
  anchor: readonly [number, number];
  start: number;
  travel: number;
}

/** Shot Language v3：camera 动词只用于创作与 catalog；运行时由 keyframes 精确执行。 */
export type CameraVerb = "locked" | "drift" | "push-in" | "pull-out" | "truck" | "crane" | "orbit";
export type CameraTrackEasing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

/** 单一注意力目标。anchor 采用左上原点的 composition 归一化坐标；depth 只为未来多平面预留。 */
export interface CameraSubject {
  anchor: readonly [number, number];
  depth?: number;
}

/** 当前镜头局部进度的相机关键帧；target 统一由 subject 推导，避免三套焦点坐标漂移。 */
export interface CameraKeyframe {
  at: number;
  position?: readonly [number, number, number];
  fov?: number;
  roll?: number;
  easing?: CameraTrackEasing;
}

/** 单镜头的真实 Three camera 轨道。所有字段只由 shot progress 派生，天然可 seek。 */
export interface CameraMoveDescriptor {
  verb: CameraVerb;
  subject: CameraSubject;
  keyframes: readonly CameraKeyframe[];
}

/** 单张 HtmlSurface 的真实 Three 姿态轨。它让平面以 Z 位移、倾斜和缩放快速落位，形成可读的 2.5D 透视。 */
export interface SurfaceKeyframe {
  at: number;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: readonly [number, number, number];
  /** 与落位同帧插值的纵向曲率；0 为平面，正值形成可见的纸页弯曲。 */
  bend?: number;
  /** 局部纸角卷起的强度；corner 与 cornerCurl 一起使用，0 为关闭。 */
  cornerCurl?: number;
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  easing?: CameraTrackEasing;
}

/** 表面轨与 camera 轨正交：前者移动被拍对象，后者移动观看者。 */
export interface SurfaceMoveDescriptor {
  /** 内容承载外壳：plain 直接展示页面；browser 为有厚度的 Chrome 式窗口。后续设备模型只扩展此处。 */
  shell?: "plain" | "browser";
  /** 可与 bend / corner curl / post displacement 同时存在的确定性布料波动。 */
  cloth?: { amplitude: number; speed: number; scale: number };
  keyframes: readonly SurfaceKeyframe[];
}

/** 单个镜头的声明式描述；ShotGraph 按当前镜头挂载内容节点、效果与转场 */
export interface ShotDescriptor {
  id: string;
  /** 内容节点：HTML 表面 / 媒体证据平面 / 两者 */
  content: ShotContent;
  /** 本镜头时长（帧）；缺省用 plan.shotDurationInFrames */
  durationInFrames?: number;
  /** 主效果材质（post 或 ambient） */
  effect?: MaterialId;
  /** 入场转场材质（transform 或 A/B 转场）与持续帧数 */
  transition?: { material: TransitionMaterial; durationFrames: number };
  /** 环境材质（ambient，全程叠加） */
  ambient?: MaterialId;
  /** 扫描镜头（magnify/glass 等光学镜头使用） */
  lens?: LensDescriptor;
  /** 真实 Three 相机轨道；与 lens 共用同一 scene-owned subject 数据。 */
  camera?: CameraMoveDescriptor;
  /** 内容平面的真实 Three 姿态轨；单页可用它完成快速倾斜落位，不需要伪造多层。 */
  surface?: SurfaceMoveDescriptor;
  /** 镜头语义参数（如 magnify 的 zoom、center） */
  effectOptions?: Record<string, unknown>;
}

export interface CameraDescriptor {
  fov?: number;
  position?: readonly [number, number, number];
}

/** 整支成片的镜头图：时长 + 镜头序列（每镜头可自定义时长） */
export interface ShotGraphPlan {
  durationInFrames: number;
  shots: readonly ShotDescriptor[];
  shotDurationInFrames?: number;
}

export interface ShotAt {
  id: string;
  index: number;
  /** 当前镜头内的归一化进度 0..1 */
  progress: number;
  /** 当前镜头内的帧偏移（0 起） */
  frame: number;
  /** 当前镜头的全局起始帧 */
  start: number;
  /** 当前镜头的帧数 */
  frames: number;
  descriptor: ShotDescriptor;
}

/** 帧 → 当前镜头。支持每镜头独立时长；seek 与并发导出得到同一镜头。 */
export const shotAt = (frame: number, fps: number, plan: ShotGraphPlan): ShotAt => {
  const shots = plan.shots;
  const fallbackFrames = plan.shotDurationInFrames ?? Math.round(5 * fps);
  let cursor = 0;
  for (let index = 0; index < shots.length; index++) {
    const frames = shots[index].durationInFrames ?? fallbackFrames;
    if (frame < cursor + frames) {
      return {
        id: shots[index].id,
        index,
        progress: (frame - cursor) / Math.max(1, frames),
        frame: frame - cursor,
        start: cursor,
        frames,
        descriptor: shots[index],
      };
    }
    cursor += frames;
  }
  const last = shots[shots.length - 1];
  const lastFrames = last?.durationInFrames ?? fallbackFrames;
  return {
    id: last?.id ?? "",
    index: Math.max(0, shots.length - 1),
    progress: 1,
    frame: lastFrames,
    start: Math.max(0, cursor - lastFrames),
    frames: lastFrames,
    descriptor: last,
  };
};
