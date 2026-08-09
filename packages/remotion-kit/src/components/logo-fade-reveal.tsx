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

import { useCurrentFrame, spring, useVideoConfig } from "remotion";

export default function LogoFadeReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo fade + scale using spring
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const logoOpacity = logoProgress;
  const logoScale = 0.8 + 0.2 * logoProgress;

  // Company name fades in with delay
  const textProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 60, mass: 0.6 },
  });

  const textOpacity = textProgress;
  const textTranslateY = 20 * (1 - textProgress);

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
      {/* Logo */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #4361ee, #7209b7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          boxShadow: "0 0 40px rgba(67, 97, 238, 0.3)",
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
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
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
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        Your tagline here
      </p>
    </div>
  );
}
