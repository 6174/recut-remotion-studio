/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * monochrome glitch channels with a single green accent, high-contrast type.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function LogoGlitchReveal() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Decay factor: starts at 1 and goes to 0 over time
  const decay = interpolate(frame, [0, 30], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Deterministic offsets using sin for a pseudo-glitch without randomness
  const neutralOffsetX = Math.sin(frame * 7.3) * 15 * decay;
  const neutralOffsetY = Math.sin(frame * 5.1) * 10 * decay;
  const accentOffsetX = Math.sin(frame * 11.7) * 15 * decay;
  const accentOffsetY = Math.sin(frame * 3.9) * 10 * decay;
  const deepOffsetX = Math.sin(frame * 9.2) * 15 * decay;
  const deepOffsetY = Math.sin(frame * 6.4) * 10 * decay;

  // Clean logo appears after glitch settles
  const cleanOpacity = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });

  // Glow intensity increases as glitch settles
  const glowIntensity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Channel separation opacity fades out as clean logo appears
  const channelOpacity = interpolate(frame, [20, 35], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const markSize = Math.round(width * 0.14);

  const channelStyle: React.CSSProperties = {
    width: markSize,
    height: markSize,
    borderRadius: kitRadius.lg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
  };

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
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            letterSpacing: "0.5em",
            color: kitTheme.green[400],
            fontWeight: 600,
          }}
        >
          GLITCH REVEAL
        </span>
      </div>
      <div
        style={{
          position: "relative",
          width: markSize,
          height: markSize,
        }}
      >
        {/* Neutral channel */}
        <div
          style={{
            ...channelStyle,
            background: `rgba(255, 255, 255, 0.05)`,
            border: `1px solid ${kitTheme.darkLine}`,
            transform: `translate(${neutralOffsetX}px, ${neutralOffsetY}px)`,
            opacity: channelOpacity,
            mixBlendMode: "screen",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: kitFont.sans,
              fontSize: Math.round(markSize * 0.5),
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            R
          </span>
        </div>

        {/* Green accent channel */}
        <div
          style={{
            ...channelStyle,
            background: `rgba(60, 192, 106, 0.22)`,
            transform: `translate(${accentOffsetX}px, ${accentOffsetY}px)`,
            opacity: channelOpacity,
            mixBlendMode: "screen",
          }}
        >
          <span
            style={{
              color: kitTheme.green[300],
              fontFamily: kitFont.sans,
              fontSize: Math.round(markSize * 0.5),
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            R
          </span>
        </div>

        {/* Deep neutral channel */}
        <div
          style={{
            ...channelStyle,
            background: kitTheme.dark,
            border: `1px solid ${kitTheme.darkLine}`,
            transform: `translate(${deepOffsetX}px, ${deepOffsetY}px)`,
            opacity: channelOpacity,
            mixBlendMode: "screen",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: kitFont.sans,
              fontSize: Math.round(markSize * 0.5),
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            R
          </span>
        </div>

        {/* Clean logo */}
        <div
          style={{
            ...channelStyle,
            background: kitGradient.green,
            boxShadow: `0 0 ${24 * glowIntensity}px rgba(28, 174, 88, ${0.45 * glowIntensity}), ${kitShadow.md}`,
            opacity: cleanOpacity,
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontFamily: kitFont.sans,
              fontSize: Math.round(markSize * 0.5),
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            R
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: Math.round(height * 0.04),
          opacity: cleanOpacity,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#ffffff",
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.052),
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          Company Name
        </h2>
        <p
          style={{
            margin: `${Math.round(height * 0.012)}px 0 0`,
            color: kitTheme.darkMuted,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.016),
            letterSpacing: "0.02em",
          }}
        >
          Resilient by design
        </p>
      </div>
    </AbsoluteFill>
  );
}
