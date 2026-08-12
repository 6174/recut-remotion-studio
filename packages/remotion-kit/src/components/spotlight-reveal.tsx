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

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitTheme } from "./helpers/theme";

export default function SpotlightReveal() {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Clip-path radius grows from 0% to 75%
  const radius = interpolate(frame, [0, durationInFrames * 0.8], [0, 75], {
    extrapolateRight: "clamp",
  });

  // Glow opacity peaks mid-animation then fades
  const glowOpacity = interpolate(
    frame,
    [0, durationInFrames * 0.3, durationInFrames * 0.8],
    [0, 0.6, 0],
    { extrapolateRight: "clamp" }
  );

  const titleSize = Math.round(width * 0.06);
  const captionSize = Math.round(width * 0.014);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: kitTheme.dark,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Revealed content behind clip */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
          clipPath: `circle(${radius}% at 50% 50%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Decorative top bar */}
        <div
          style={{
            width: Math.round(width * 0.06),
            height: 4,
            background: kitGradient.green,
            borderRadius: 999,
            marginBottom: Math.round(height * 0.02),
          }}
        />
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            letterSpacing: "0.5em",
            color: kitTheme.green[400],
            fontWeight: 600,
          }}
        >
          SPOTLIGHT REVEAL
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
          REVEALED
        </h1>
        <p
          style={{
            fontFamily: kitFont.sans,
            color: kitTheme.darkMuted,
            fontSize: captionSize,
            marginTop: Math.round(height * 0.014),
          }}
        >
          Spotlight reveal transition
        </p>
        {/* Decorative bottom bar */}
        <div
          style={{
            width: Math.round(width * 0.06),
            height: 4,
            background: kitGradient.green,
            borderRadius: 999,
            marginTop: Math.round(height * 0.02),
          }}
        />
      </div>

      {/* Glow at the edge of the circle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent ${radius - 2}%, rgba(28, 174, 88, ${glowOpacity}) ${radius}%, transparent ${radius + 3}%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
