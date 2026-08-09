"use client";

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export default function SubscribeReminder() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: Math.max(frame - 10, 0),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const translateY = interpolate(slideIn, [0, 1], [100, 0]);

  const bellPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [1, 1.15],
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#374151",
            fontSize: "1.5rem",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Your Video Content
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          padding: "0.6rem 1.2rem",
          borderRadius: "999px",
          transform: `translateY(${translateY}px)`,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${bellPulse})`,
          }}
        >
          <span style={{ color: "white", fontSize: "0.8rem" }}>&#128276;</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Subscribe
          </span>
          <span
            style={{
              color: "#9ca3af",
              fontSize: "0.65rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            @CreativeStudio
          </span>
        </div>
      </div>
    </div>
  );
}
