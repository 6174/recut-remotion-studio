"use client";

import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";

export default function ImageZoomReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const duration = fps * 2;

  const scale = interpolate(frame, [0, duration], [2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blur = interpolate(frame, [0, duration], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [duration * 0.6, duration], [0, 1], {
    extrapolateLeft: "clamp",
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
          width: "80%",
          height: "70%",
          borderRadius: "12px",
          overflow: "hidden",
          border: "3px solid #1e293b",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #4361ee, #7209b7, #a855f7)",
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "1.8rem",
            fontWeight: 600,
            opacity: textOpacity,
            fontFamily: "Inter, sans-serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          Featured Image
        </span>
      </div>
    </div>
  );
}
