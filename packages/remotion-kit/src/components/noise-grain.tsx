/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * subtle film grain, high-contrast mono eyebrow + sans title.
 */

"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function NoiseGrain() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cellSize = 8;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  // Deterministic pseudo-random based on index and frame
  const pseudoRandom = (index: number, f: number) => {
    const val = ((index * 1237 + f * 7919) % 997) / 997;
    return val;
  };

  // Build grain cells
  const grainCells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const noise = pseudoRandom(index, frame);
      // Opacity between 0.02 and 0.08 — keep the grain subtle
      const opacity = 0.02 + noise * 0.06;
      grainCells.push({ col, row, opacity, key: index });
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark stage background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        }}
      />
      {/* Centered sample text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
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
          SUBTLE TEXTURE
        </span>
        <h2
          style={{
            color: "#ffffff",
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.045),
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: 0,
            marginTop: Math.round(height * 0.02),
          }}
        >
          Film Grain Overlay
        </h2>
        <p
          style={{
            color: kitTheme.darkMuted,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.014),
            marginTop: Math.round(height * 0.012),
          }}
        >
          Subtle noise texture effect, frame-synced for film warmth.
        </p>
      </div>
      {/* Grain overlay using SVG for performance */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {grainCells.map((cell) => (
          <rect
            key={cell.key}
            x={cell.col * cellSize}
            y={cell.row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#ffffff"
            opacity={cell.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
