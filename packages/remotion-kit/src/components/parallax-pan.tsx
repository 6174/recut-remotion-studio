/**
 * [INPUT]: 依赖 remotion 的帧时钟、插值函数与 Img
 * [OUTPUT]: 对外提供 ParallaxPan，为图片提供可导出、可寻帧的平移动效
 * [POS]: remotion-templates 的电影感图片运动组件；与 KenBurns、ZoomPulse 共用图片动效职责
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
interface ParallaxPanProps {
  imageUrl?: string;
  duration?: number;
  direction?: "left-right" | "right-left" | "top-bottom" | "bottom-top";
  scale?: number;
}

export const ParallaxPan: React.FC<ParallaxPanProps> = ({
  imageUrl = "https://images.pexels.com/photos/1644724/pexels-photo-1644724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 15,
  direction = "left-right",
  scale = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, duration * fps)], [0, 1], { extrapolateRight: "clamp" });
  const offset = interpolate(progress, [0, 1], [0, -20]);
  const translate = direction === "right-left" ? `translateX(${-20 - offset}%)`
    : direction === "top-bottom" ? `translateY(${offset}%)`
      : direction === "bottom-top" ? `translateY(${-20 - offset}%)`
        : `translateX(${offset}%)`;

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
          transform: `${translate} scale(${scale})`,
        }}
      />
    </div>
  );
};

export default ParallaxPan;
