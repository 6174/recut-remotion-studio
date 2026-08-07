/**
 * [INPUT]: 依赖 remotion 的帧时钟与插值函数
 * [OUTPUT]: 对外提供 KenBurns，为图片提供可导出、可寻帧的平移缩放效果
 * [POS]: remotion-templates 的电影感图片运动组件；与 ParallaxPan、ZoomPulse 共用图片动效职责
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface KenBurnsProps {
  imageUrl?: string;
  duration?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  imageUrl = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
  duration = 20,
  scale = 1.5,
  translateX = -50,
  translateY = -30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, duration * fps)], [0, 1], { extrapolateRight: "clamp" });
  const transform = `scale(${interpolate(progress, [0, 1], [1, scale])}) translate(${interpolate(progress, [0, 1], [0, translateX])}px, ${interpolate(progress, [0, 1], [0, translateY])}px)`;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <Img
        src={imageUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform,
        }}
      />
    </div>
  );
};

export default KenBurns;
