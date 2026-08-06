"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";

export default function VignettePulse() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Oscillate vignette intensity between 0.3 and 0.8
  const vignetteStrength = 0.55 + 0.25 * Math.sin((frame / fps) * Math.PI * 2);

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
      {/* Sample content */}
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
          Your Content Here
        </h2>
        <p style={{ color: "#93c5fd", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Vignette pulses around the edges
        </p>
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, ${vignetteStrength}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
