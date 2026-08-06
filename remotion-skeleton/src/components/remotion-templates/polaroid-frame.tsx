"use client";

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export default function PolaroidFrame() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dropIn = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const translateY = interpolate(dropIn, [0, 1], [-300, 0]);
  const rotation = interpolate(dropIn, [0, 1], [8, -3]);
  const opacity = interpolate(dropIn, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "12px 12px 48px 12px",
          borderRadius: "4px",
          transform: `translateY(${translateY}px) rotate(${rotation}deg)`,
          opacity,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            width: "260px",
            height: "260px",
            background: "linear-gradient(135deg, #4361ee, #7209b7)",
            borderRadius: "2px",
          }}
        />
        <p
          style={{
            textAlign: "center",
            color: "#374151",
            fontSize: "0.95rem",
            fontWeight: 500,
            margin: 0,
            marginTop: "12px",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
          }}
        >
          Summer 2024
        </p>
      </div>
    </div>
  );
}
