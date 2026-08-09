"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";

export default function CrossDissolve() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = fps * 2.5;
  const progress = Math.min(frame / totalFrames, 1);

  // Scene A fades out while Scene B fades in simultaneously
  const sceneAOpacity = 1 - progress;
  const sceneBOpacity = progress;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          opacity: sceneAOpacity,
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
          }}
        >
          Scene A
        </h2>
        <p style={{ color: "#93c5fd", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Dissolving away...
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
          opacity: sceneBOpacity,
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            marginBottom: "1rem",
          }}
        />
        <h2
          style={{
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Scene B
        </h2>
        <p style={{ color: "#c084fc", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Appearing...
        </p>
      </div>
    </div>
  );
}
