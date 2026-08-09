"use client";

import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export default function LogoBounceDrop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo drops from above with spring bounce
  const drop = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.8 },
  });

  const translateY = interpolate(drop, [0, 1], [-200, 0]);

  // Squash and stretch on landing
  const squashProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 6, stiffness: 200, mass: 0.5 },
  });

  const scaleX = interpolate(squashProgress, [0, 0.5, 1], [1.3, 1.1, 1]);
  const scaleY = interpolate(squashProgress, [0, 0.5, 1], [0.7, 0.9, 1]);

  // Company name fades in after bounce
  const nameOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameTranslateY = interpolate(frame, [25, 40], [20, 0], {
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
          transform: `translateY(${translateY}px) scaleX(${scaleX}) scaleY(${scaleY})`,
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #4361ee, #7209b7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "1.4rem",
              fontWeight: "bold",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            LOGO
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
