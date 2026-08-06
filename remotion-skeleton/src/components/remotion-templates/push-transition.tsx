"use client";

import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export default function PushTransition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pushProgress = spring({
    frame: frame - fps * 0.8,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
      mass: 0.8,
    },
  });

  const translateA = -pushProgress * 100;
  const translateB = (1 - pushProgress) * 100;

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
          transform: `translateX(${translateA}%)`,
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
          Being pushed out...
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
          transform: `translateX(${translateB}%)`,
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
          Pushing in...
        </p>
      </div>
    </div>
  );
}
