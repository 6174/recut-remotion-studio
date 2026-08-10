/**
 * [INPUT]: 依赖 materials/types 的 MaterialId；无运行时依赖
 * [OUTPUT]: 对外提供 ShotDescriptor、ShotGraphPlan、CameraDescriptor 与 shotAt 纯函数
 * [POS]: remotion-kit/src/three 的镜头契约层；时序、内容与 GPU renderer 通过它保持无内容耦合
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { MaterialId } from "../materials/types";

export type ShotContent = "html" | "media" | "both";

/** 扫描镜头 descriptor：镜头锚点（归一化 UV）、开始时点与扫描距离 */
export interface LensDescriptor {
  anchor: readonly [number, number];
  start: number;
  travel: number;
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
  /** 入场转场材质（transform）与持续帧数 */
  transition?: { material: MaterialId; durationFrames: number };
  /** 环境材质（ambient，全程叠加） */
  ambient?: MaterialId;
  /** 扫描镜头（magnify/glass 等光学镜头使用） */
  lens?: LensDescriptor;
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
