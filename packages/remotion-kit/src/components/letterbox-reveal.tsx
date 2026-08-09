"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function LetterboxReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barHeight = interpolate(frame, [0, fps * 2], [50, 12], {
    extrapolateRight: "clamp",
  });

  const contentOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], {
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
      {/* Content underneath */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: contentOpacity,
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "4rem",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "0.3em",
            fontFamily: "Inter, sans-serif",
          }}
        >
          CINEMATIC
        </h1>
        <p
          style={{
            color: "#93c5fd",
            fontSize: "1.2rem",
            marginTop: "1rem",
            letterSpacing: "0.15em",
            fontFamily: "Inter, sans-serif",
          }}
        >
          A letterbox reveal
        </p>
      </div>

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${barHeight}%`,
          backgroundColor: "#000000",
          zIndex: 10,
        }}
      />

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: `${barHeight}%`,
          backgroundColor: "#000000",
          zIndex: 10,
        }}
      />
    </div>
  );
}
