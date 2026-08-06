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

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export default function CircularProgress() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate progress based on frame
  const progress = interpolate(frame % 90, [0, 90], [0, 100], {
    extrapolateRight: "clamp",
  });

  // Calculate rotation for the loading effect
  const rotation = (frame * 4) % 360;

  // Calculate radius and circumference
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Pulse effect
  const pulse = 1 + Math.sin(frame / 10) * 0.05;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          transform: `scale(${pulse})`,
        }}
      >
        {/* Background circle */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          style={{
            position: "absolute",
            transform: "rotate(-90deg)",
          }}
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
          />
        </svg>

        {/* Progress circle */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          style={{
            position: "absolute",
            transform: "rotate(-90deg)",
          }}
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />

          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Rotating dots */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          style={{
            position: "absolute",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <circle cx="100" cy="20" r="8" fill="#3b82f6" />
        </svg>

        {/* Percentage text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "3rem",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
