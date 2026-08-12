/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * green monogram mark, high-contrast type, frame-derived bounce drop.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function LogoBounceDrop() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Mark drops from above with spring bounce
  const drop = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.8 },
  });

  const translateY = interpolate(drop, [0, 1], [-200, 0]);

  // Squash and stretch on landing
  const squashProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 6, stiffness: 200, mass: 0.5 },
  });

  const scaleX = interpolate(squashProgress, [0, 0.5, 1], [1.3, 1.1, 1]);
  const scaleY = interpolate(squashProgress, [0, 0.5, 1], [0.7, 0.9, 1]);

  // Wordmark fades in after the bounce
  const nameOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameTranslateY = interpolate(frame, [25, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const markSize = Math.round(width * 0.14);

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
          BOUNCE DROP
        </span>
      </div>
      <div
        style={{
          transform: `translateY(${translateY}px) scaleX(${scaleX}) scaleY(${scaleY})`,
        }}
      >
        <div
          style={{
            width: markSize,
            height: markSize,
            borderRadius: kitRadius.lg,
            background: kitGradient.green,
            boxShadow: kitShadow.md,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
