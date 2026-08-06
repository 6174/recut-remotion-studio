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

import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export default function EndCard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    durationInFrames: 35,
    config: {
      damping: 12,
      mass: 0.6,
    },
  });

  const contentOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
  });

  const glowOpacity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.7]
  );

  const buttonOpacity = spring({
    frame: Math.max(0, frame - 20),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 25,
  });

  const iconsOpacity = spring({
    frame: Math.max(0, frame - 30),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 25,
  });

  const socialColors = ["#3b82f6", "#4361ee", "#7209b7", "#9333ea"];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #111827 0%, #1a1a2e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: contentOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 48,
          borderRadius: 16,
          border: `2px solid rgba(67, 97, 238, ${glowOpacity})`,
          boxShadow: `0 0 40px rgba(67, 97, 238, ${glowOpacity * 0.3})`,
          background: "rgba(17, 24, 39, 0.8)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "3.5rem",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "0.03em",
          }}
        >
          Thanks for Watching
        </h1>
        <div
          style={{
            opacity: buttonOpacity,
            marginTop: 32,
            padding: "14px 40px",
            background: "linear-gradient(90deg, #4361ee, #7209b7)",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Subscribe for More
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
            opacity: iconsOpacity,
          }}
        >
          {socialColors.map((color, i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
        </div>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.9rem",
            marginTop: 28,
            letterSpacing: "0.1em",
            fontWeight: 300,
          }}
        >
          STUDIO CREATIVE
        </p>
      </div>
    </div>
  );
}
