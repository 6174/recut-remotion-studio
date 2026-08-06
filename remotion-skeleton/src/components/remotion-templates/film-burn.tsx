"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function FilmBurn() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = fps * 3;
  const progress = Math.min(frame / totalFrames, 1);

  // Peak at mid-animation
  const intensity = interpolate(frame, [0, totalFrames * 0.5, totalFrames], [0, 0.85, 0], {
    extrapolateRight: "clamp",
  });

  const xShift1 = 50 + Math.sin(frame * 0.05) * 30;
  const yShift1 = 50 + Math.cos(frame * 0.04) * 20;
  const xShift2 = 50 + Math.sin(frame * 0.07 + 2) * 25;
  const yShift2 = 50 + Math.cos(frame * 0.06 + 1) * 30;
  const xShift3 = 50 + Math.sin(frame * 0.03 + 4) * 20;
  const yShift3 = 50 + Math.cos(frame * 0.08 + 3) * 15;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        overflow: "hidden",
      }}
    >
      {/* Sample dark content */}
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
        <h2
          style={{
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Film Burn Effect
        </h2>
        <p style={{ color: "#93c5fd", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Light leak overlay
        </p>
      </div>

      {/* Film burn overlay - gradient 1 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${xShift1}% ${yShift1}%, rgba(249, 115, 22, ${intensity * 0.7}), transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Film burn overlay - gradient 2 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${xShift2}% ${yShift2}%, rgba(251, 191, 36, ${intensity * 0.5}), transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      {/* Film burn overlay - gradient 3 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${xShift3}% ${yShift3}%, rgba(255, 255, 255, ${intensity * 0.3}), transparent 40%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
