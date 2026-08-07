"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";

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
      // Opacity between 0.02 and 0.08
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
      {/* Sample gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
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
        <h2
          style={{
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Film Grain Overlay
        </h2>
        <p style={{ color: "#93c5fd", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Subtle noise texture effect
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
            fill="white"
            opacity={cell.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
