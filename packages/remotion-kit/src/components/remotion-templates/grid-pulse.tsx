"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";

export default function GridPulse() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const cols = 12;
  const rows = 8;
  const dotSize = 10;

  const spacingX = width / (cols + 1);
  const spacingY = height / (rows + 1);

  // Center of the grid
  const centerCol = (cols - 1) / 2;
  const centerRow = (rows - 1) / 2;

  const t = frame / fps;

  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = spacingX * (col + 1);
      const y = spacingY * (row + 1);

      // Distance from center in grid units
      const dx = col - centerCol;
      const dy = row - centerRow;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Wave: pulse travels outward from center
      const wave = Math.sin(t * 3 - distance * 0.8);
      const normalizedWave = wave * 0.5 + 0.5; // 0 to 1

      const opacity = 0.15 + normalizedWave * 0.85;
      const scale = 0.4 + normalizedWave * 0.6;

      dots.push({ x, y, opacity, scale, key: row * cols + col });
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {dots.map((dot) => (
        <div
          key={dot.key}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            opacity: dot.opacity,
            transform: `translate(-50%, -50%) scale(${dot.scale})`,
          }}
        />
      ))}
    </div>
  );
}
