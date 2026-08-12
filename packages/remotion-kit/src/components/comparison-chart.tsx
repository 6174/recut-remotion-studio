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
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function ComparisonChart() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const maxBarHeight = Math.round(height * 0.34);

  // Before value animation
  const beforeValue = Math.round(
    interpolate(frame, [10, 40], [0, 34], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const beforeBarHeight = interpolate(frame, [10, 40], [0, (34 / 100) * maxBarHeight], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // After value animation (starts slightly later)
  const afterValue = Math.round(
    interpolate(frame, [20, 50], [0, 89], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const afterBarHeight = interpolate(frame, [20, 50], [0, (89 / 100) * maxBarHeight], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider line animation
  const dividerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerHeight = interpolate(frame, [0, 20], [0, Math.round(height * 0.34)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 1px 1px, ${kitTheme.line} 1px, transparent 0) 0 0 / 26px 26px, linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(82%, 880px)",
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.md,
          padding: `${Math.round(height * 0.05)}px ${Math.round(width * 0.045)}px`,
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontFamily: kitFont.mono,
              fontSize: Math.round(width * 0.011),
              letterSpacing: "0.4em",
              color: kitTheme.green[600],
              fontWeight: 600,
            }}
          >
            BEFORE / AFTER
          </span>
          <h1
            style={{
              margin: 0,
              marginTop: Math.round(height * 0.01),
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.034),
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: kitTheme.ink,
              marginBottom: Math.round(height * 0.03),
            }}
          >
            Performance Comparison
          </h1>
        </div>

        {/* Comparison container */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            height: maxBarHeight + Math.round(height * 0.07),
            position: "relative",
          }}
        >
          {/* Before side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            {/* Value */}
            <div
              style={{
                fontFamily: kitFont.mono,
                fontSize: Math.round(width * 0.042),
                fontWeight: 700,
                color: kitTheme.muted,
                marginBottom: Math.round(height * 0.014),
              }}
            >
              {beforeValue}%
            </div>

            {/* Bar */}
            <div
              style={{
                width: "min(30%, 130px)",
                height: `${beforeBarHeight}px`,
                backgroundColor: kitTheme.gray[400],
                borderRadius: `${kitRadius.sm}px ${kitRadius.sm}px 0 0`,
              }}
            />

            {/* Label */}
            <div
              style={{
                fontFamily: kitFont.sans,
                fontSize: Math.round(width * 0.018),
                fontWeight: 600,
                color: kitTheme.inkSoft,
                marginTop: Math.round(height * 0.014),
              }}
            >
              Before
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 2,
              height: `${dividerHeight}px`,
              backgroundColor: kitTheme.lineStrong,
              opacity: dividerOpacity,
              alignSelf: "center",
              margin: `0 ${Math.round(width * 0.028)}px`,
            }}
          />

          {/* After side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            {/* Value */}
            <div
              style={{
                fontFamily: kitFont.mono,
                fontSize: Math.round(width * 0.042),
                fontWeight: 700,
                color: kitTheme.green[600],
                marginBottom: Math.round(height * 0.014),
              }}
            >
              {afterValue}%
            </div>

            {/* Bar */}
            <div
              style={{
                width: "min(30%, 130px)",
                height: `${afterBarHeight}px`,
                background: kitGradient.green,
                borderRadius: `${kitRadius.sm}px ${kitRadius.sm}px 0 0`,
              }}
            />

            {/* Label */}
            <div
              style={{
                fontFamily: kitFont.sans,
                fontSize: Math.round(width * 0.018),
                fontWeight: 600,
                color: kitTheme.inkSoft,
                marginTop: Math.round(height * 0.014),
              }}
            >
              After
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
