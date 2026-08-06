"use client";

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export default function SplitScreen() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left panel slides in from left
  const leftSlide = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Right panel slides in from right with slight delay
  const rightSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const leftTranslateX = interpolate(leftSlide, [0, 1], [-100, 0]);
  const rightTranslateX = interpolate(rightSlide, [0, 1], [100, 0]);

  // Divider fades in after panels meet
  const dividerOpacity = interpolate(frame, [fps * 0.6, fps * 0.9], [0, 1], {
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
        display: "flex",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: "50%",
          height: "100%",
          transform: `translateX(${leftTranslateX}%)`,
          background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Panel A
        </h2>
        <p
          style={{
            color: "#bfdbfe",
            fontSize: "1rem",
            marginTop: "0.75rem",
            textAlign: "center",
          }}
        >
          Left side content slides in from the left edge
        </p>
      </div>

      {/* Right panel */}
      <div
        style={{
          width: "50%",
          height: "100%",
          transform: `translateX(${rightTranslateX}%)`,
          background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Panel B
        </h2>
        <p
          style={{
            color: "#ddd6fe",
            fontSize: "1rem",
            marginTop: "0.75rem",
            textAlign: "center",
          }}
        >
          Right side content slides in from the right edge
        </p>
      </div>

      {/* Center divider */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "2px",
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.8), transparent)",
          opacity: dividerOpacity,
        }}
      />
    </div>
  );
}
