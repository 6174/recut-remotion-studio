"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function LogoSplitReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each half expands outward from center
  const revealProgress = interpolate(frame, [10, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const halfWidth = interpolate(revealProgress, [0, 1], [0, 75]);
  const leftTranslate = interpolate(revealProgress, [0, 1], [0, -75]);
  const rightTranslate = interpolate(revealProgress, [0, 1], [0, 75]);

  // Company name fades in
  const nameOpacity = interpolate(frame, [fps * 1.6, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameTranslateY = interpolate(frame, [fps * 1.6, fps * 2.2], [15, 0], {
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
      <div
        style={{
          position: "relative",
          height: "80px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Left half */}
        <div
          style={{
            width: `${halfWidth}px`,
            height: "80px",
            background: "linear-gradient(135deg, #4361ee, #6240c9)",
            borderRadius: "16px 0 0 16px",
            transform: `translateX(${leftTranslate}px)`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
              fontFamily: "Inter, sans-serif",
              marginRight: "2px",
              opacity: revealProgress,
            }}
          >
            LO
          </span>
        </div>
        {/* Right half */}
        <div
          style={{
            width: `${halfWidth}px`,
            height: "80px",
            background: "linear-gradient(135deg, #6240c9, #7209b7)",
            borderRadius: "0 16px 16px 0",
            transform: `translateX(${rightTranslate}px)`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
              fontFamily: "Inter, sans-serif",
              marginLeft: "2px",
              opacity: revealProgress,
            }}
          >
            GO
          </span>
        </div>
      </div>
      <p
        style={{
          color: "white",
          fontSize: "1.8rem",
          fontWeight: "bold",
          fontFamily: "Inter, sans-serif",
          marginTop: "1.5rem",
          opacity: nameOpacity,
          transform: `translateY(${nameTranslateY}px)`,
        }}
      >
        Company Name
      </p>
    </div>
  );
}
