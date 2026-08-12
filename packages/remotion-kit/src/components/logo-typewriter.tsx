/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * green monogram mark, high-contrast type, frame-derived typewriter.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function LogoTypewriter() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const text = "ACME STUDIO";

  // Icon appears first via spring scale
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.6 },
  });

  const iconOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter starts after icon settles
  const typeStart = 15;
  const charsPerFrame = 0.15;
  const charsVisible = Math.min(
    Math.floor(Math.max(0, frame - typeStart) * charsPerFrame),
    text.length
  );
  const displayedText = text.slice(0, charsVisible);

  // Blinking cursor
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const showCursor = frame > typeStart && (charsVisible < text.length || cursorVisible);

  const iconSize = Math.round(width * 0.05);
  const textSize = Math.round(width * 0.05);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        display: "flex",
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
          TYPEWRITER
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: Math.round(width * 0.018) }}>
        {/* Icon */}
        <div
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: kitRadius.full,
            background: kitGradient.green,
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
            flexShrink: 0,
          }}
        />
        {/* Typewriter text */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: "#ffffff",
              fontFamily: kitFont.sans,
              fontSize: textSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              whiteSpace: "pre",
            }}
          >
            {displayedText}
          </span>
          {showCursor && (
            <span
              style={{
                color: kitTheme.green[400],
                fontFamily: kitFont.sans,
                fontSize: textSize,
                fontWeight: 900,
                marginLeft: "2px",
              }}
            >
              |
            </span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
}
