"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function BlindsTransition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blindCount = 8;
  const blinds = Array.from({ length: blindCount });

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
          Behind the blinds
        </p>
      </div>

      {/* Blinds containing Scene A */}
      {blinds.map((_, i) => {
        const delay = i * 3;
        const rotation = interpolate(frame, [fps * 0.5 + delay, fps * 1.5 + delay], [0, 90], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${(i / blindCount) * 100}%`,
              left: 0,
              width: "100%",
              height: `${100 / blindCount}%`,
              overflow: "hidden",
              transformOrigin: "center top",
              transform: `perspective(800px) rotateX(${rotation}deg)`,
              backfaceVisibility: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${blindCount * 100}%`,
                marginTop: `${-i * 100}%`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #1e3a5f, #111827)",
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
                Blinds opening...
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
