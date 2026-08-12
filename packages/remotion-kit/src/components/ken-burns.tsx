/**
 * [INPUT]: 依赖 remotion 的帧时钟与插值函数
 * [OUTPUT]: 对外提供 KenBurns，为图片提供可导出、可寻帧的平移缩放效果
 * [POS]: remotion-templates 的电影感图片运动组件；与 ParallaxPan、ZoomPulse 共用图片动效职责
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 *
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitTheme } from "./helpers/theme";

export default function KenBurns() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const imageUrl = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba";
  const duration = 20;
  const scale = 1.5;
  const translateX = -50;
  const translateY = -30;

  const progress = interpolate(frame, [0, Math.max(1, duration * fps)], [0, 1], { extrapolateRight: "clamp" });
  const transform = `scale(${interpolate(progress, [0, 1], [1, scale])}) translate(${interpolate(progress, [0, 1], [0, translateX])}px, ${interpolate(progress, [0, 1], [0, translateY])}px)`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: kitTheme.dark,
        overflow: "hidden",
      }}
    >
      <Img
        src={imageUrl}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform,
        }}
      />
      {/* Bottom scrim for label contrast */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: Math.round(height * 0.28),
          background: "linear-gradient(180deg, rgba(12, 16, 13, 0) 0%, rgba(12, 16, 13, 0.82) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: Math.round(width * 0.05),
          bottom: Math.round(height * 0.06),
        }}
      >
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            letterSpacing: "0.5em",
            color: kitTheme.green[300],
            fontWeight: 600,
          }}
        >
          KEN BURNS
        </span>
        <div
          style={{
            width: Math.round(width * 0.06),
            height: 3,
            marginTop: Math.round(height * 0.012),
            background: kitGradient.green,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}
