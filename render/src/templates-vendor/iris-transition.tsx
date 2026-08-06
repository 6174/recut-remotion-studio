"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function IrisTransition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const midPoint = fps * 1.25;
  const totalFrames = fps * 2.5;

  // First half: iris closes (75% → 0%)
  // Second half: iris opens (0% → 75%)
  const radius = frame <= midPoint
    ? interpolate(frame, [0, midPoint], [75, 0], {
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [midPoint, totalFrames], [0, 75], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const showSceneA = frame <= midPoint;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Scene underneath (B when closing, A already gone) */}
      {!showSceneA && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #3b1f5e, #111827)",
            clipPath: `circle(${radius}% at 50% 50%)`,
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
            Iris opening...
          </p>
        </div>
      )}

      {/* Scene A with iris closing */}
      {showSceneA && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #1e3a5f, #111827)",
            clipPath: `circle(${radius}% at 50% 50%)`,
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
            Iris closing...
          </p>
        </div>
      )}
    </div>
  );
}
