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

export default function LogoSpinReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo 3D rotation using spring
  const spinProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 60, mass: 1 },
  });

  const rotateY = 90 * (1 - spinProgress);
  const logoOpacity = spinProgress;

  // Company name slides up after logo settles
  const textProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.6 },
  });

  const textOpacity = textProgress;
  const textTranslateY = 30 * (1 - textProgress);

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
      {/* 3D Perspective Container */}
      <div
        style={{
          perspective: "1000px",
        }}
      >
        {/* Logo - circular with gradient */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4361ee, #7209b7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `rotateY(${rotateY}deg)`,
            opacity: logoOpacity,
            boxShadow: "0 0 50px rgba(114, 9, 183, 0.4)",
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

      {/* Company Name - slides up */}
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
          color: "#c084fc",
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
