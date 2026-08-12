/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * split green monogram, high-contrast type, frame-derived reveal.
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function LogoSplitReveal() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Each half expands outward from center
  const revealProgress = interpolate(frame, [10, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const halfWidth = interpolate(revealProgress, [0, 1], [0, 75]);
  const leftTranslate = interpolate(revealProgress, [0, 1], [0, -75]);
  const rightTranslate = interpolate(revealProgress, [0, 1], [0, 75]);

  // Wordmark fades in
  const nameOpacity = interpolate(frame, [fps * 1.6, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameTranslateY = interpolate(frame, [fps * 1.6, fps * 2.2], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const markHeight = Math.round(width * 0.1);
  const letterSize = Math.round(markHeight * 0.55);

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
          SPLIT REVEAL
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: markHeight,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Left half */}
        <div
          style={{
            width: `${halfWidth}px`,
            height: markHeight,
            background: kitGradient.green,
            borderRadius: `${kitRadius.md}px 0 0 ${kitRadius.md}px`,
            transform: `translateX(${leftTranslate}px)`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontFamily: kitFont.sans,
              fontSize: letterSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginRight: "1px",
              opacity: revealProgress,
            }}
          >
            R
          </span>
        </div>
        {/* Right half */}
        <div
          style={{
            width: `${halfWidth}px`,
            height: markHeight,
            background: kitTheme.green[600],
            borderRadius: `0 ${kitRadius.md}px ${kitRadius.md}px 0`,
            transform: `translateX(${rightTranslate}px)`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontFamily: kitFont.sans,
              fontSize: letterSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginLeft: "1px",
              opacity: revealProgress,
            }}
          >
            ec
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: Math.round(height * 0.04),
          opacity: nameOpacity,
          transform: `translateY(${nameTranslateY}px)`,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#ffffff",
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.055),
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          Company Name
        </p>
      </div>
    </AbsoluteFill>
  );
}
