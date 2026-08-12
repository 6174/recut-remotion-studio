/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): paper canvas,
 * fine grid, green stroke-drawn mark, ink type.
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function LogoStrokeDraw() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Hexagon perimeter approx: 6 * side length. Side = 50, perimeter ~ 300
  const hexPerimeter = 300;
  // Triangle perimeter approx: 3 * side. Side ~ 50, perimeter ~ 150
  const triPerimeter = 150;

  const hexOffset = interpolate(frame, [0, fps * 1.2], [hexPerimeter, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const triOffset = interpolate(frame, [fps * 0.4, fps * 1.6], [triPerimeter, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fill fades in after outlines are drawn
  const fillOpacity = interpolate(frame, [fps * 1.6, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Wordmark fades in
  const nameOpacity = interpolate(frame, [fps * 2.0, fps * 2.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hexagon points (centered at 60,60, radius 50)
  const hexPoints = "60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35";
  // Inner triangle (centered at 60,60, radius 30)
  const triPoints = "60,30 85.98,75 34.02,75";

  const markSize = Math.round(width * 0.15);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.5,
          backgroundImage: `linear-gradient(${kitTheme.line} 1px, transparent 1px), linear-gradient(90deg, ${kitTheme.line} 1px, transparent 1px)`,
          backgroundSize: `${Math.round(width * 0.04)}px ${Math.round(width * 0.04)}px`,
          maskImage: "radial-gradient(70% 70% at 50% 50%, #000 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, #000 0%, transparent 100%)",
        }}
      />
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            letterSpacing: "0.5em",
            color: kitTheme.green[600],
            fontWeight: 600,
          }}
        >
          STROKE DRAW
        </span>
      </div>
      <svg width={markSize} height={markSize} viewBox="0 0 120 120">
        <defs>
          <linearGradient id="logoFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={kitTheme.green[400]} />
            <stop offset="100%" stopColor={kitTheme.green[600]} />
          </linearGradient>
        </defs>
        {/* Hexagon fill */}
        <polygon points={hexPoints} fill="url(#logoFillGrad)" opacity={fillOpacity * 0.3} />
        {/* Hexagon stroke */}
        <polygon
          points={hexPoints}
          fill="none"
          stroke={kitTheme.green[500]}
          strokeWidth="2.5"
          strokeDasharray={hexPerimeter}
          strokeDashoffset={hexOffset}
          strokeLinejoin="round"
        />
        {/* Triangle fill */}
        <polygon points={triPoints} fill="url(#logoFillGrad)" opacity={fillOpacity} />
        {/* Triangle stroke */}
        <polygon
          points={triPoints}
          fill="none"
          stroke={kitTheme.green[600]}
          strokeWidth="2.5"
          strokeDasharray={triPerimeter}
          strokeDashoffset={triOffset}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          marginTop: Math.round(height * 0.04),
          opacity: nameOpacity,
        }}
      >
        <p
          style={{
            margin: 0,
            color: kitTheme.ink,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.052),
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          Company Name
        </p>
      </div>
    </AbsoluteFill>
  );
}
