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
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function CameraShake() {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Amplitude decays from ~15px to 0 over the duration
  const amplitude = interpolate(frame, [0, durationInFrames], [15, 0], {
    extrapolateRight: "clamp",
  });

  // Organic shake using multiple sine/cosine frequencies
  const shakeX = Math.sin(frame * 0.8) * amplitude;
  const shakeY = Math.cos(frame * 1.1) * amplitude;

  const titleSize = Math.round(width * 0.06);
  const captionSize = Math.round(width * 0.013);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Content card that shakes */}
      <div
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px)`,
          background: kitGradient.dark,
          border: `1px solid ${kitTheme.darkLine}`,
          borderRadius: kitRadius.lg,
          padding: `${Math.round(height * 0.05)}px ${Math.round(width * 0.06)}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: `${kitShadow.lg}, 0 0 60px rgba(28, 174, 88, 0.12)`,
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
          CAMERA SHAKE
        </span>
        <h1
          style={{
            fontFamily: kitFont.sans,
            color: "#ffffff",
            fontSize: titleSize,
            fontWeight: 900,
            margin: `${Math.round(height * 0.02)}px 0 0`,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          IMPACT
        </h1>
        <div
          style={{
            width: `${Math.round(width * 0.05)}px`,
            height: 4,
            background: kitGradient.green,
            margin: `${Math.round(height * 0.018)}px 0`,
            borderRadius: kitRadius.full,
          }}
        />
        <p
          style={{
            fontFamily: kitFont.sans,
            color: kitTheme.darkMuted,
            fontSize: captionSize,
            margin: 0,
            textAlign: "center",
          }}
        >
          A decaying shake lands the moment
        </p>
      </div>
    </div>
  );
}
