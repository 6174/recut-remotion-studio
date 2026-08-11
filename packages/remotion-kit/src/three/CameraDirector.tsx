/**
 * [INPUT]: 依赖 R3F camera、Three 向量与 `types.ts` 的 CameraMoveDescriptor；输入仅为当前镜头 progress。
 * [OUTPUT]: 对外提供 resolveCameraFrame 纯函数与 CameraDirector 组件，逐帧确定性驱动 PerspectiveCamera。
 * [POS]: three/ 的相机执行层；ShotGraph 在内容平面已经确定后挂载它，所有场景共享同一套 camera 轨道语义。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import type { CameraDescriptor, CameraMoveDescriptor, CameraTrackEasing } from "./types";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const ease = (value: number, easing: CameraTrackEasing) => {
  const t = clamp(value);
  if (easing === "linear") return t;
  if (easing === "ease-in") return t * t;
  if (easing === "ease-out") return 1 - (1 - t) * (1 - t);
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

const lerp3 = (
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  progress: number,
): readonly [number, number, number] => [
  lerp(from[0], to[0], progress),
  lerp(from[1], to[1], progress),
  lerp(from[2], to[2], progress),
];

export interface ResolvedCameraFrame {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
  roll: number;
}

/** 设计空间 anchor（左上原点）投影到 HtmlSurface 主平面的 Three 世界坐标。 */
const subjectTarget = (
  move: CameraMoveDescriptor,
  planeWidth: number,
  planeHeight: number,
): readonly [number, number, number] => [
  (move.subject.anchor[0] - 0.5) * planeWidth,
  (0.5 - move.subject.anchor[1]) * planeHeight,
  move.subject.depth ?? 0,
];

/**
 * 解析当前镜头的相机状态。无状态、无随机数、无时间积分：seek 和并发渲染得到同一机位。
 * 每个 keyframe 的 easing 描述它从前一个 keyframe 接管时的速度曲线。
 */
export const resolveCameraFrame = (
  move: CameraMoveDescriptor | undefined,
  progress: number,
  fallback: CameraDescriptor,
  planeWidth: number,
  planeHeight: number,
): ResolvedCameraFrame => {
  const fallbackPosition = fallback.position ?? [0, 0, 8];
  const fallbackFov = fallback.fov ?? 34;
  if (!move || move.keyframes.length === 0) {
    return { position: fallbackPosition, target: [0, 0, 0], fov: fallbackFov, roll: 0 };
  }

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

  const segmentProgress = from.at === to.at
    ? 1
    : clamp((progress - from.at) / (to.at - from.at));
  const t = ease(segmentProgress, to.easing ?? "ease-in-out");
  const fromPosition = from.position ?? fallbackPosition;
  const toPosition = to.position ?? fromPosition;
  const fromFov = from.fov ?? fallbackFov;
  const toFov = to.fov ?? fromFov;
  const fromRoll = from.roll ?? 0;
  const toRoll = to.roll ?? fromRoll;

  return {
    position: lerp3(fromPosition, toPosition, t),
    target: subjectTarget(move, planeWidth, planeHeight),
    fov: lerp(fromFov, toFov, t),
    roll: lerp(fromRoll, toRoll, t),
  };
};

export interface CameraDirectorProps {
  move?: CameraMoveDescriptor;
  progress: number;
  fallback: CameraDescriptor;
  planeWidth: number;
  planeHeight: number;
}

/** 提交已解析的相机状态；`lookAt` 每帧重置朝向后再施加 roll，避免积累误差。 */
export const CameraDirector: React.FC<CameraDirectorProps> = ({
  move,
  progress,
  fallback,
  planeWidth,
  planeHeight,
}) => {
  const { camera } = useThree();
  const previousFov = useRef<number | null>(null);
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const resolved = resolveCameraFrame(move, progress, fallback, planeWidth, planeHeight);
    camera.position.set(...resolved.position);
    camera.lookAt(target.current.set(...resolved.target));
    camera.rotateZ((resolved.roll * Math.PI) / 180);
    if (camera instanceof THREE.PerspectiveCamera && previousFov.current !== resolved.fov) {
      camera.fov = resolved.fov;
      camera.updateProjectionMatrix();
      previousFov.current = resolved.fov;
    }
  });

  return null;
};
