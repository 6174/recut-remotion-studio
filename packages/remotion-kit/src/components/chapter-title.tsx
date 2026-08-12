/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * mono chapter numeral, green rule, high-contrast type.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitRadius, kitTheme } from "./helpers/theme";

export default function ChapterTitle() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const numberScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const labelOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [10, 40], [0, Math.round(width * 0.1)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontFamily: kitFont.mono,
          fontSize: Math.round(width * 0.014),
          fontWeight: 600,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: kitTheme.green[400],
          marginBottom: Math.round(height * 0.03),
          opacity: labelOpacity,
        }}
      >
        Chapter
      </span>
      <h1
        style={{
          margin: 0,
          color: "#ffffff",
          fontFamily: kitFont.mono,
          fontSize: Math.round(width * 0.16),
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textShadow: "0 16px 48px rgba(0, 0, 0, 0.45)",
          transform: `scale(${numberScale})`,
        }}
      >
        1
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: Math.round(width * 0.02),
          marginTop: Math.round(height * 0.03),
          marginBottom: Math.round(height * 0.02),
        }}
      >
        <div style={{ height: 1, width: lineWidth, background: kitTheme.green[500] }} />
        <div
          style={{
            width: Math.round(width * 0.006),
            height: Math.round(width * 0.006),
            borderRadius: kitRadius.full,
            background: kitTheme.green[400],
            opacity: labelOpacity,
          }}
        />
        <div style={{ height: 1, width: lineWidth, background: kitTheme.green[500] }} />
      </div>
      <p
        style={{
          margin: 0,
          color: kitTheme.darkMuted,
          fontFamily: kitFont.sans,
          fontSize: Math.round(width * 0.024),
          fontWeight: 300,
          letterSpacing: "0.08em",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        The Beginning
      </p>
    </AbsoluteFill>
  );
}
