/**
 * [INPUT]: 依赖 remotion 的帧时钟、插值函数与 Img
 * [OUTPUT]: 对外提供 ParallaxPan，为图片提供可导出、可寻帧的平移动效
 * [POS]: remotion-templates 的电影感图片运动组件；与 KenBurns、ZoomPulse 共用图片动效职责
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 *
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitTheme } from "./helpers/theme";

export default function ParallaxPan() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const imageUrl = "https://images.pexels.com/photos/1644724/pexels-photo-1644724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const duration = 15;
  const scale = 1.2;

  const progress = interpolate(frame, [0, Math.max(1, duration * fps)], [0, 1], { extrapolateRight: "clamp" });
  const offset = interpolate(progress, [0, 1], [0, -20]);
  const translate = `translateX(${offset}%)`;

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
          transform: `${translate} scale(${scale})`,
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
          PARALLAX PAN
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
