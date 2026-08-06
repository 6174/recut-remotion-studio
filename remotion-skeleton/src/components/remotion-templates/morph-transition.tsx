"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function MorphTransition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = fps * 2.5;

  // Scene A: scale 1→0.5, opacity 1→0
  const scaleA = interpolate(frame, [0, totalFrames], [1, 0.5], {
    extrapolateRight: "clamp",
  });
  const opacityA = interpolate(frame, [0, totalFrames * 0.6], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Scene B: scale 1.5→1, opacity 0→1
  const scaleB = interpolate(frame, [0, totalFrames], [1.5, 1], {
    extrapolateRight: "clamp",
  });
  const opacityB = interpolate(frame, [totalFrames * 0.4, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Scene A */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: opacityA,
          transform: `scale(${scaleA})`,
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            marginBottom: "1rem",
          }}
        />
        <h2
          style={{
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Scene A
        </h2>
        <p style={{ color: "#93c5fd", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Morphing away...
        </p>
      </div>

      {/* Scene B */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: opacityB,
          transform: `scale(${scaleB})`,
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #a855f7, #7209b7)",
            marginBottom: "1rem",
          }}
        />
        <h2
          style={{
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Scene B
        </h2>
        <p style={{ color: "#c084fc", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Morphing in...
        </p>
      </div>
    </div>
  );
}
