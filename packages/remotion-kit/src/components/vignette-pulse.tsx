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

import { useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function VignettePulse() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Oscillate vignette intensity between 0.3 and 0.8
  const vignetteStrength = 0.55 + 0.25 * Math.sin((frame / fps) * Math.PI * 2);

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
      {/* Sample content */}
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
          VIGNETTE PULSE
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
          Your Content Here
        </h2>
        <p
          style={{
            fontFamily: kitFont.sans,
            color: kitTheme.darkMuted,
            fontSize: captionSize,
            marginTop: Math.round(height * 0.014),
          }}
        >
          Vignette pulses around the edges
        </p>
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, ${vignetteStrength}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
