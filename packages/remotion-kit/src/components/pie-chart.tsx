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
import { kitFont, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function PieChart() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const segments = [
    { label: "Product A", value: 35, color: kitTheme.green[500] },
    { label: "Product B", value: 25, color: kitTheme.green[300] },
    { label: "Product C", value: 20, color: kitTheme.green[700] },
    { label: "Product D", value: 12, color: kitTheme.gray[400] },
    { label: "Product E", value: 8, color: kitTheme.gray[200] },
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = 300;
  const cy = 215;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

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
          width: "min(82%, 760px)",
          padding: `${Math.round(height * 0.05)}px ${Math.round(width * 0.04)}px`,
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.md,
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
            PORTFOLIO MIX
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
            }}
          >
            Market Share
          </h1>
        </div>

        <svg
          viewBox="0 0 600 430"
          width="100%"
          style={{ display: "block", marginTop: Math.round(height * 0.015) }}
        >
          {/* Pie segments */}
          {segments.map((segment, i) => {
            const segmentLength = (segment.value / total) * circumference;
            const currentOffset = cumulativeOffset;
            cumulativeOffset += segmentLength;

            const segmentProgress = interpolate(
              frame,
              [i * 10, 15 + i * 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const animatedLength = segmentLength * segmentProgress;

            return (
              <circle
                key={`seg-${i}`}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="78"
                strokeDasharray={`${animatedLength} ${circumference - animatedLength}`}
                strokeDashoffset={-currentOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
          })}

          {/* Center circle for visual balance */}
          <circle cx={cx} cy={cy} r={58} fill={kitTheme.paper} />
        </svg>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: Math.round(width * 0.018),
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: Math.round(height * 0.015),
          }}
        >
          {segments.map((segment, i) => {
            const legendOpacity = interpolate(
              frame,
              [5 + i * 10, 15 + i * 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={`legend-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: legendOpacity,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: kitRadius.full,
                    backgroundColor: segment.color,
                  }}
                />
                <span
                  style={{
                    color: kitTheme.muted,
                    fontFamily: kitFont.sans,
                    fontSize: Math.round(width * 0.013),
                  }}
                >
                  {segment.label} ({segment.value}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
