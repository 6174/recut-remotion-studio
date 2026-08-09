"use client";

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export default function CameraShake() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Amplitude decays from ~15px to 0 over the duration
  const amplitude = interpolate(frame, [0, durationInFrames], [15, 0], {
    extrapolateRight: "clamp",
  });

  // Organic shake using multiple sine/cosine frequencies
  const shakeX = Math.sin(frame * 0.8) * amplitude;
  const shakeY = Math.cos(frame * 1.1) * amplitude;

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
      {/* Content card that shakes */}
      <div
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px)`,
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "16px",
          padding: "2.5rem 3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.15)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "3.5rem",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "0.15em",
          }}
        >
          IMPACT
        </h1>
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #3b82f6, #a855f7)",
            margin: "1rem 0",
            borderRadius: "2px",
          }}
        />
        <p
          style={{
            color: "#93c5fd",
            fontSize: "1.1rem",
            margin: 0,
            textAlign: "center",
          }}
        >
          Camera shake with decaying amplitude
        </p>
      </div>
    </div>
  );
}
