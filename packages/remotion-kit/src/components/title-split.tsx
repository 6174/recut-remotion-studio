"use client";

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export default function TitleSplit() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: -120,
    to: 0,
  });

  const bottomY = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: 120,
    to: 0,
  });

  const glowOpacity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.8],
  );

  const meetProgress = interpolate(frame, [0, 20], [0, 1], {
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
        gap: "0.25rem",
      }}
    >
      <h1
        style={{
          color: "transparent",
          fontSize: "5rem",
          fontWeight: 800,
          margin: 0,
          letterSpacing: "0.15em",
          WebkitTextStroke: "2px white",
          transform: `translateY(${topY}px)`,
          fontFamily: "Inter, sans-serif",
          textShadow: meetProgress === 1
            ? `0 0 ${20 * glowOpacity}px rgba(59, 130, 246, ${glowOpacity})`
            : "none",
        }}
      >
        CREATIVE
      </h1>
      <h1
        style={{
          color: "white",
          fontSize: "5rem",
          fontWeight: 800,
          margin: 0,
          letterSpacing: "0.15em",
          transform: `translateY(${bottomY}px)`,
          fontFamily: "Inter, sans-serif",
          textShadow: meetProgress === 1
            ? `0 0 ${20 * glowOpacity}px rgba(59, 130, 246, ${glowOpacity})`
            : "none",
        }}
      >
        STUDIO
      </h1>
    </div>
  );
}
