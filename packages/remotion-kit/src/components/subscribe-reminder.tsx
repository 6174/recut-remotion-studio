/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * raised toast, green bell badge.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function SubscribeReminder() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const slideIn = spring({
    frame: Math.max(frame - 10, 0),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const translateY = interpolate(slideIn, [0, 1], [Math.round(height * 0.08), 0]);

  const bellPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [1, 1.12],
  );

  const badgeSize = Math.round(width * 0.024);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: kitTheme.darkMuted,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.02),
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          Your Video Content
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: Math.round(height * 0.03),
          right: Math.round(width * 0.025),
          display: "flex",
          alignItems: "center",
          gap: Math.round(width * 0.012),
          backgroundColor: kitTheme.darkSurface,
          backdropFilter: "blur(8px)",
          padding: `${Math.round(height * 0.012)}px ${Math.round(width * 0.02)}px`,
          borderRadius: kitRadius.full,
          transform: `translateY(${translateY}px)`,
          border: `1px solid ${kitTheme.darkLine}`,
          boxShadow: kitShadow.md,
        }}
      >
        <div
          style={{
            width: badgeSize,
            height: badgeSize,
            borderRadius: "50%",
            backgroundColor: kitGradient.green,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${bellPulse})`,
          }}
        >
          <svg
            width={badgeSize * 0.5}
            height={badgeSize * 0.5}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#ffffff",
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.012),
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Subscribe
          </span>
          <span
            style={{
              color: kitTheme.darkMuted,
              fontFamily: kitFont.mono,
              fontSize: Math.round(width * 0.009),
              letterSpacing: "0.05em",
            }}
          >
            @CreativeStudio
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
