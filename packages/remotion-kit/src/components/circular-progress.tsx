/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitRadius, kitTheme } from "./helpers/theme";

export default function CircularProgress() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const size = Math.round(Math.min(width, height) * 0.36);

  // Calculate progress based on frame
  const progress = interpolate(frame % 90, [0, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate rotation for the loading effect (frame-derived, deterministic)
  const rotation = (frame * 4) % 360;

  // Calculate radius and circumference
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Pulse effect
  const pulse = 1 + Math.sin(frame / 10) * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.012),
            letterSpacing: "0.4em",
            color: kitTheme.green[400],
            fontWeight: 600,
          }}
        >
          PROCESSING
        </span>

        <div
          style={{
            position: "relative",
            width: size,
            height: size,
            marginTop: Math.round(height * 0.03),
            transform: `scale(${pulse})`,
          }}
        >
          {/* Background circle */}
          <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={kitTheme.darkLine}
              strokeWidth="12"
            />
          </svg>

          {/* Progress circle */}
          <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
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
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={kitTheme.green[300]} />
                <stop offset="100%" stopColor={kitTheme.green[600]} />
              </linearGradient>
            </defs>
          </svg>

          {/* Rotating dot */}
          <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: "absolute", transform: `rotate(${rotation}deg)` }}>
            <circle cx="100" cy="20" r="8" fill={kitTheme.green[400]} stroke={kitTheme.darkSurface} strokeWidth="3" />
          </svg>

          {/* Percentage text */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: kitFont.mono,
              fontSize: Math.round(size * 0.17),
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
