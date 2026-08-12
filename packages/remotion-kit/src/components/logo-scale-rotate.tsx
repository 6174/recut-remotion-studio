/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * green monogram mark, high-contrast type, frame-derived scale + rotate.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function LogoScaleRotate() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Scale and rotate entrance with spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0, 1]);
  const rotation = interpolate(entrance, [0, 1], [0, 360]);

  // Subtle green glow pulse after settling
  const glowIntensity = frame > 20 ? 8 + Math.sin(frame * 0.15) * 4 : 0;

  // Wordmark slides up
  const nameProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const nameOpacity = interpolate(nameProgress, [0, 1], [0, 1]);
  const nameTranslateY = interpolate(nameProgress, [0, 1], [30, 0]);

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
          SCALE + ROTATE
        </span>
      </div>
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        <div
          style={{
            width: markSize,
            height: markSize,
            borderRadius: kitRadius.full,
            background: kitGradient.green,
            boxShadow: `0 0 ${glowIntensity}px ${glowIntensity / 2}px rgba(28, 174, 88, 0.5)`,
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
