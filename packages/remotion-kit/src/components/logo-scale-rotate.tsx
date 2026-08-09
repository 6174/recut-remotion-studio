"use client";

import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export default function LogoScaleRotate() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale and rotate entrance with spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0, 1]);
  const rotation = interpolate(entrance, [0, 1], [0, 360]);

  // Subtle glow pulse after settling
  const glowIntensity = frame > 20 ? 8 + Math.sin(frame * 0.15) * 4 : 0;

  // Company name slides up
  const nameProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const nameOpacity = interpolate(nameProgress, [0, 1], [0, 1]);
  const nameTranslateY = interpolate(nameProgress, [0, 1], [30, 0]);

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
          transform: `scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4361ee, #7209b7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 0 ${glowIntensity}px ${glowIntensity / 2}px rgba(67, 97, 238, 0.6)`,
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
              fontFamily: "Inter, sans-serif",
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
