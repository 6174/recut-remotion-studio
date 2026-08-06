"use client";

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export default function ChapterTitle() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [10, 40], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [5, 20], [0, 1], {
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          color: "#9ca3af",
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: 0,
          marginBottom: "0.5rem",
          opacity: labelOpacity,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Chapter
      </p>
      <h1
        style={{
          color: "white",
          fontSize: "8rem",
          fontWeight: 800,
          margin: 0,
          lineHeight: 1,
          transform: `scale(${numberScale})`,
          fontFamily: "Inter, sans-serif",
        }}
      >
        1
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            height: "1px",
            width: `${lineWidth}px`,
            backgroundColor: "#3b82f6",
          }}
        />
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            opacity: labelOpacity,
          }}
        />
        <div
          style={{
            height: "1px",
            width: `${lineWidth}px`,
            backgroundColor: "#3b82f6",
          }}
        />
      </div>
      <p
        style={{
          color: "#d1d5db",
          fontSize: "1.5rem",
          fontWeight: 300,
          margin: 0,
          letterSpacing: "0.1em",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: "Inter, sans-serif",
        }}
      >
        The Beginning
      </p>
    </div>
  );
}
