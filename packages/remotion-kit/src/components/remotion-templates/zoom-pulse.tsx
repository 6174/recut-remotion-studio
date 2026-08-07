/**
 * [INPUT]: 依赖 remotion 的帧时钟、插值函数与 Img
 * [OUTPUT]: 对外提供 ZoomPulse，为图片提供可导出、可寻帧的循环缩放效果
 * [POS]: remotion-templates 的电影感图片运动组件；与 KenBurns、ParallaxPan 共用图片动效职责
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
interface ZoomPulseProps {
  imageUrl?: string;
  duration?: number;
  minScale?: number;
  maxScale?: number;
}

export const ZoomPulse: React.FC<ZoomPulseProps> = ({
  imageUrl = "https://images.pexels.com/photos/1726310/pexels-photo-1726310.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 4,
  minScale = 1,
  maxScale = 1.1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = Math.max(1, duration * fps);
  const phase = (frame % cycle) / cycle;
  const scale = interpolate(phase, [0, 0.5, 1], [minScale, maxScale, minScale]);
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
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
};

export default ZoomPulse;
