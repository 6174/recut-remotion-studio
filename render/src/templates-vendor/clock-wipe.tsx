"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function ClockWipe() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = fps * 2.5;

  const angle = interpolate(frame, [0, totalFrames], [0, 360], {
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
      {/* Scene B (underneath) - Purple */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #3b1f5e, #111827)",
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
          Revealed by clock wipe
        </p>
      </div>

      {/* Scene A (on top, wiped away) - Blue */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1e3a5f, #111827)",
          clipPath: `polygon(50% 50%, 50% 0%, ${angle <= 90 ? `${50 + 50 * Math.tan((angle * Math.PI) / 180)}% 0%` : "100% 0%"}${angle > 90 ? `, 100% ${angle <= 180 ? `${50 * Math.tan(((angle - 90) * Math.PI) / 180)}%` : "100%"}` : ""}${angle > 180 ? `, ${100 - 50 * Math.tan(((angle - 180) * Math.PI) / 180)}% 100%` : ""}${angle > 270 ? `, 0% ${100 - 50 * Math.tan(((angle - 270) * Math.PI) / 180)}%` : ""}${angle >= 360 ? ", 0% 0%, 50% 0%" : ""})`,
          opacity: angle >= 360 ? 0 : 1,
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
          Clock wipe transition
        </p>
      </div>
    </div>
  );
}
