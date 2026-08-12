/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * split display type, green accent.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function TitleSplit() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const topY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: -Math.round(height * 0.1),
    to: 0,
  });

  const bottomY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: Math.round(height * 0.1),
    to: 0,
  });

  const meetProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fontSize = Math.round(width * 0.08);
  const strokeWidth = Math.max(1, Math.round(width * 0.002));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        gap: Math.round(height * 0.012),
      }}
    >
      <h1
        style={{
          margin: 0,
          color: "transparent",
          fontFamily: kitFont.sans,
          fontSize,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          WebkitTextStroke: `${strokeWidth}px ${kitTheme.gray[100]}`,
          transform: `translateY(${topY}px)`,
        }}
      >
        CREATIVE
      </h1>
      <h1
        style={{
          margin: 0,
          color: "#ffffff",
          fontFamily: kitFont.sans,
          fontSize,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          transform: `translateY(${bottomY}px)`,
          opacity: meetProgress,
        }}
      >
        STUDIO
      </h1>
      <div
        style={{
          height: 4,
          width: `${meetProgress * 30}%`,
          background: kitGradient.green,
          borderRadius: kitRadius.full,
          marginTop: Math.round(height * 0.02),
        }}
      />
    </AbsoluteFill>
  );
}
