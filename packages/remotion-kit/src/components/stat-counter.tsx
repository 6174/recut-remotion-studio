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

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function StatCounter() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Spring entrance
  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Count up animation
  const count = Math.round(
    interpolate(frame, [10, 60], [0, 1247], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const subStatsOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bar = spring({ frame: frame - 20, fps, from: 0, to: 1, config: { damping: 14, mass: 0.5 } });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          background: kitTheme.darkSurface,
          border: `1px solid ${kitTheme.darkLine}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.lg,
          padding: `${Math.round(height * 0.07)}px ${Math.round(width * 0.06)}px`,
          textAlign: "center",
          transform: `scale(${scaleSpring})`,
        }}
      >
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            letterSpacing: "0.4em",
            color: kitTheme.green[400],
            fontWeight: 600,
          }}
        >
          MONTHLY METRIC
        </span>

        {/* Main number */}
        <div
          style={{
            marginTop: Math.round(height * 0.02),
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.085),
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#ffffff",
          }}
        >
          {count.toLocaleString()}
        </div>

        {/* Accent bar */}
        <div
          style={{
            margin: `${Math.round(height * 0.016)}px auto 0`,
            width: `${bar * 18}%`,
            height: 5,
            borderRadius: kitRadius.full,
            background: kitGradient.green,
          }}
        />

        {/* Label */}
        <div
          style={{
            marginTop: Math.round(height * 0.018),
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.022),
            color: kitTheme.darkMuted,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          Total Users
        </div>

        {/* Sub stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: Math.round(width * 0.03),
            marginTop: Math.round(height * 0.028),
            opacity: subStatsOpacity,
          }}
        >
          <span
            style={{
              color: kitTheme.green[400],
              fontFamily: kitFont.mono,
              fontSize: Math.round(width * 0.017),
              fontWeight: 600,
            }}
          >
            ↑ 12.5%
          </span>
          <span
            style={{
              color: kitTheme.darkMuted,
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.017),
              fontWeight: 400,
            }}
          >
            This Month
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
