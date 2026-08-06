"use client";

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export default function SpotlightReveal() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Clip-path radius grows from 0% to 75%
  const radius = interpolate(frame, [0, durationInFrames * 0.8], [0, 75], {
    extrapolateRight: "clamp",
  });

  // Glow opacity peaks mid-animation then fades
  const glowOpacity = interpolate(
    frame,
    [0, durationInFrames * 0.3, durationInFrames * 0.8],
    [0, 0.6, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Revealed content behind clip */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #111827, #1e1b4b)",
          clipPath: `circle(${radius}% at 50% 50%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Decorative top bar */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #a855f7)",
            borderRadius: "2px",
            marginBottom: "1.5rem",
          }}
        />
        <h1
          style={{
            color: "white",
            fontSize: "3.5rem",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "0.1em",
          }}
        >
          REVEALED
        </h1>
        <p
          style={{
            color: "#c4b5fd",
            fontSize: "1.1rem",
            marginTop: "0.75rem",
          }}
        >
          Spotlight reveal transition
        </p>
        {/* Decorative bottom bar */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #a855f7, #3b82f6)",
            borderRadius: "2px",
            marginTop: "1.5rem",
          }}
        />
      </div>

      {/* Glow at the edge of the circle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent ${radius - 2}%, rgba(139, 92, 246, ${glowOpacity}) ${radius}%, transparent ${radius + 3}%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
