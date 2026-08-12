/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function LetterboxReveal() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const barHeight = interpolate(frame, [0, fps * 2], [50, 12], {
    extrapolateRight: "clamp",
  });

  const contentOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleSize = Math.round(width * 0.05);
  const captionSize = Math.round(width * 0.014);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        overflow: "hidden",
      }}
    >
      {/* Content underneath */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: contentOpacity,
        }}
      >
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            letterSpacing: "0.5em",
            color: kitTheme.green[400],
            fontWeight: 600,
          }}
        >
          LETTERBOX REVEAL
        </span>
        <h1
          style={{
            fontFamily: kitFont.sans,
            color: "#ffffff",
            fontSize: titleSize,
            fontWeight: 900,
            margin: `${Math.round(height * 0.02)}px 0 0`,
            letterSpacing: "-0.03em",
            textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          CINEMATIC
        </h1>
        <p
          style={{
            fontFamily: kitFont.sans,
            color: kitTheme.darkMuted,
            fontSize: captionSize,
            marginTop: Math.round(height * 0.014),
            letterSpacing: "0.15em",
          }}
        >
          A letterbox reveal
        </p>
      </div>

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${barHeight}%`,
          backgroundColor: kitTheme.dark,
          zIndex: 10,
        }}
      />

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: `${barHeight}%`,
          backgroundColor: kitTheme.dark,
          zIndex: 10,
        }}
      />
    </div>
  );
}
