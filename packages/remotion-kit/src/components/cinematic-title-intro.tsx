/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * white display title, green underline, mono eyebrow.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function CinematicTitleIntro() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const titleY = spring({
    frame,
    fps,
    from: 50,
    to: 0,
    durationInFrames: 40,
    config: {
      damping: 14,
      mass: 0.8,
    },
  });

  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
  });

  const underlineWidth = interpolate(frame, [20, 50], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: kitGradient.dark,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: kitFont.mono,
          fontSize: Math.round(width * 0.012),
          fontWeight: 600,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: kitTheme.green[400],
          marginBottom: Math.round(height * 0.03),
        }}
      >
        Film
      </span>
      <h1
        style={{
          margin: 0,
          color: "#ffffff",
          fontFamily: kitFont.sans,
          fontSize: Math.round(width * 0.06),
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Your Story Begins
      </h1>
      <div
        style={{
          width: `${underlineWidth}%`,
          maxWidth: Math.round(width * 0.28),
          height: 4,
          background: kitGradient.green,
          borderRadius: kitRadius.full,
          marginTop: Math.round(height * 0.03),
        }}
      />
      <p
        style={{
          margin: 0,
          marginTop: Math.round(height * 0.03),
          color: kitTheme.darkMuted,
          fontFamily: kitFont.sans,
          fontSize: Math.round(width * 0.02),
          fontWeight: 300,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: subtitleOpacity,
        }}
      >
        A Cinematic Experience
      </p>
    </AbsoluteFill>
  );
}
