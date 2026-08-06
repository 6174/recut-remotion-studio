/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 */

"use client";

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export default function LogoGlitchReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Decay factor: starts at 1 and goes to 0 over time
  const decay = interpolate(frame, [0, 30], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Pseudo-random offsets using sin for deterministic rendering
  const redOffsetX = Math.sin(frame * 7.3) * 15 * decay;
  const redOffsetY = Math.sin(frame * 5.1) * 10 * decay;
  const greenOffsetX = Math.sin(frame * 11.7) * 15 * decay;
  const greenOffsetY = Math.sin(frame * 3.9) * 10 * decay;
  const blueOffsetX = Math.sin(frame * 9.2) * 15 * decay;
  const blueOffsetY = Math.sin(frame * 6.4) * 10 * decay;

  // Clean logo appears after glitch settles
  const cleanOpacity = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });

  // Glow intensity increases as glitch settles
  const glowIntensity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Channel separation opacity fades out as clean logo appears
  const channelOpacity = interpolate(frame, [20, 35], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoStyle: React.CSSProperties = {
    width: "120px",
    height: "120px",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  };

  return (
    <div
      style={{
        position: "relative",
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
      {/* RGB Channel Copies */}
      <div
        style={{
          position: "relative",
          width: "120px",
          height: "120px",
        }}
      >
        {/* Red channel */}
        <div
          style={{
            ...logoStyle,
            background: "rgba(239, 68, 68, 0.6)",
            transform: `translate(${redOffsetX}px, ${redOffsetY}px)`,
            opacity: channelOpacity,
            mixBlendMode: "screen",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "1.8rem",
              fontWeight: "800",
              letterSpacing: "0.1em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            LOGO
          </span>
        </div>

        {/* Green channel */}
        <div
          style={{
            ...logoStyle,
            background: "rgba(34, 197, 94, 0.6)",
            transform: `translate(${greenOffsetX}px, ${greenOffsetY}px)`,
            opacity: channelOpacity,
            mixBlendMode: "screen",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "1.8rem",
              fontWeight: "800",
              letterSpacing: "0.1em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            LOGO
          </span>
        </div>

        {/* Blue channel */}
        <div
          style={{
            ...logoStyle,
            background: "rgba(59, 130, 246, 0.6)",
            transform: `translate(${blueOffsetX}px, ${blueOffsetY}px)`,
            opacity: channelOpacity,
            mixBlendMode: "screen",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "1.8rem",
              fontWeight: "800",
              letterSpacing: "0.1em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            LOGO
          </span>
        </div>

        {/* Clean logo */}
        <div
          style={{
            ...logoStyle,
            background: "linear-gradient(135deg, #4361ee, #7209b7)",
            opacity: cleanOpacity,
            boxShadow: `0 0 ${40 * glowIntensity}px rgba(67, 97, 238, ${0.5 * glowIntensity})`,
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "1.8rem",
              fontWeight: "800",
              letterSpacing: "0.1em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            LOGO
          </span>
        </div>
      </div>

      {/* Company Name */}
      <h2
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "700",
          marginTop: "1.5rem",
          marginBottom: 0,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.05em",
          opacity: cleanOpacity,
        }}
      >
        Company Name
      </h2>
      <p
        style={{
          color: "#93c5fd",
          fontSize: "1rem",
          marginTop: "0.5rem",
          fontFamily: "Inter, sans-serif",
          opacity: cleanOpacity,
        }}
      >
        Your tagline here
      </p>
    </div>
  );
}
