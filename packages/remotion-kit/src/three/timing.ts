/**
 * [INPUT]: 依赖 @react-three/fiber、Remotion 帧时钟
 * [OUTPUT]: 对外提供 RemotionFrameInvalidator（帧变即 invalidate）与 seekSmooth 缓动工具
 * [POS]: remotion-kit/src/three 的时间工具；保证 demand frameloop 下 Remotion frame 变化立刻重绘 GPU 画面
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { useLayoutEffect } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** smoothstep 缓动：镜头扫描、入场与转场共用的确定性缓动 */
export const seekSmooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** 每次 Remotion frame 变化时触发一次 R3F invalidate，确保 demand frameloop 重绘。 */
export const RemotionFrameInvalidator: React.FC = () => {
  const frame = useCurrentFrame();
  const { invalidate } = useThree();
  useLayoutEffect(() => invalidate(), [frame, invalidate]);
  return null;
};
