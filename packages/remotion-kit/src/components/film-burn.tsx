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

export default function FilmBurn() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const totalFrames = fps * 3;
  const progress = Math.min(frame / totalFrames, 1);

  // Peak at mid-animation
  const intensity = interpolate(frame, [0, totalFrames * 0.5, totalFrames], [0, 0.85, 0], {
    extrapolateRight: "clamp",
  });

  const xShift1 = 50 + Math.sin(frame * 0.05) * 30;
  const yShift1 = 50 + Math.cos(frame * 0.04) * 20;
  const xShift2 = 50 + Math.sin(frame * 0.07 + 2) * 25;
  const yShift2 = 50 + Math.cos(frame * 0.06 + 1) * 30;
  const xShift3 = 50 + Math.sin(frame * 0.03 + 4) * 20;
  const yShift3 = 50 + Math.cos(frame * 0.08 + 3) * 15;

  const titleSize = Math.round(width * 0.045);
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
      {/* Sample dark content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
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
          FILM BURN
        </span>
        <h2
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
          Film Burn Effect
        </h2>
        <p
          style={{
            fontFamily: kitFont.sans,
            color: kitTheme.darkMuted,
            fontSize: captionSize,
            marginTop: Math.round(height * 0.014),
            letterSpacing: "0.02em",
          }}
        >
          Warm light leak washes the frame
        </p>
      </div>

      {/* Film burn overlay - gradient 1 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${xShift1}% ${yShift1}%, rgba(230, 168, 0, ${intensity * 0.7}), transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Film burn overlay - gradient 2 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${xShift2}% ${yShift2}%, rgba(230, 168, 0, ${intensity * 0.5}), transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      {/* Film burn overlay - gradient 3 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${xShift3}% ${yShift3}%, rgba(255, 255, 255, ${intensity * 0.3}), transparent 40%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
