/**
 * [INPUT]: 依赖 types.ts 的 SurfaceMoveDescriptor 与 CameraTrackEasing；输入仅为当前镜头 progress。
 * [OUTPUT]: 对外提供 resolveSurfaceTransform 纯函数，把表面 keyframes 解析为 R3F mesh 的 position/rotation/scale/bend/corner curl。
 * [POS]: three/ 的内容表面姿态执行层；ShotGraph 用它让单张 HtmlSurface 在真实 PerspectiveCamera 前快速落位。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { CameraTrackEasing, SurfaceMoveDescriptor } from "./types";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const ease = (value: number, easing: CameraTrackEasing) => {
  const t = clamp(value);
  if (easing === "linear") return t;
  if (easing === "ease-in") return t * t;
  if (easing === "ease-out") return 1 - (1 - t) * (1 - t);
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

type Vec3 = readonly [number, number, number];

const lerp3 = (from: Vec3, to: Vec3, progress: number): Vec3 => [
  from[0] + (to[0] - from[0]) * progress,
  from[1] + (to[1] - from[1]) * progress,
  from[2] + (to[2] - from[2]) * progress,
];

export interface SurfaceTransform {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  bend: number;
  cornerCurl: number;
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

/** 无状态表面轨解析：动作完成后保持末姿态，seek 与并发导出得到同一张“落位的纸”。 */
export const resolveSurfaceTransform = (
  move: SurfaceMoveDescriptor | undefined,
  progress: number,
): SurfaceTransform => {
  const identity: SurfaceTransform = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    bend: 0,
    cornerCurl: 0,
  };
  if (!move || move.keyframes.length === 0) return identity;

  const keys = [...move.keyframes].sort((left, right) => left.at - right.at);
  let from = keys[0];
  let to = keys[keys.length - 1];
  for (let index = 0; index < keys.length - 1; index += 1) {
    if (progress >= keys[index].at && progress <= keys[index + 1].at) {
      from = keys[index];
      to = keys[index + 1];
      break;
    }
  }
  const segment = from.at === to.at ? 1 : clamp((progress - from.at) / (to.at - from.at));
  const t = ease(segment, to.easing ?? "ease-in-out");
  const fromPosition = from.position ?? identity.position;
  const fromRotation = from.rotation ?? identity.rotation;
  const fromScale = from.scale ?? identity.scale;
  return {
    position: lerp3(fromPosition, to.position ?? fromPosition, t),
    rotation: lerp3(fromRotation, to.rotation ?? fromRotation, t),
    scale: lerp3(fromScale, to.scale ?? fromScale, t),
    bend: (from.bend ?? identity.bend) + ((to.bend ?? from.bend ?? identity.bend) - (from.bend ?? identity.bend)) * t,
    cornerCurl: (from.cornerCurl ?? identity.cornerCurl) + ((to.cornerCurl ?? from.cornerCurl ?? identity.cornerCurl) - (from.cornerCurl ?? identity.cornerCurl)) * t,
    corner: t < 0.5 ? (from.corner ?? to.corner) : (to.corner ?? from.corner),
  };
};
