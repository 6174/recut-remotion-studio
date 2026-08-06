"use client";

import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export default function LogoBlurReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blur animates from 20 to 0
  const blur = interpolate(frame, [0, fps * 1.5], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Opacity from 0.3 to 1
  const opacity = interpolate(frame, [0, fps * 1.5], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Company name appears after logo is sharp
  const nameProgress = spring({
    frame: Math.max(0, frame - Math.round(fps * 1.5)),
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const nameOpacity = interpolate(nameProgress, [0, 1], [0, 1]);
  const nameTranslateY = interpolate(nameProgress, [0, 1], [20, 0]);

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
          filter: `blur(${blur}px)`,
          opacity,
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
