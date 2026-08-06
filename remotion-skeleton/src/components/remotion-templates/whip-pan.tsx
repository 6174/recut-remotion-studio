"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function WhipPan() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panStart = fps * 1;
  const panEnd = fps * 1.4;

  const translateA = interpolate(frame, [panStart, panEnd], [0, -100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateB = interpolate(frame, [panStart, panEnd], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Motion blur stretch effect during fast pan
  const stretchX = interpolate(
    frame,
    [panStart, (panStart + panEnd) / 2, panEnd],
    [1, 1.6, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

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
      {/* Scene A - Blue */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1e3a5f, #111827)",
          transform: `translateX(${translateA}%) scaleX(${stretchX})`,
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
          Blue content
        </p>
      </div>

      {/* Scene B - Purple */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #3b1f5e, #111827)",
          transform: `translateX(${translateB}%) scaleX(${stretchX})`,
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
          Purple content
        </p>
      </div>
    </div>
  );
}
