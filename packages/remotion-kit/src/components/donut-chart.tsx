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

export default function DonutChart() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const segments = [
    { label: "Completed", value: 40, color: kitTheme.green[400] },
    { label: "In Progress", value: 25, color: kitTheme.green[200] },
    { label: "Pending", value: 20, color: kitTheme.gray[400] },
    { label: "Remaining", value: 15, color: kitTheme.gray[600] },
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = 300;
  const cy = 220;
  const radius = 120;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  // Center stat animation
  const centerValue = Math.round(
    interpolate(frame, [10, 50], [0, 78], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

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
          width: "min(82%, 760px)",
          padding: `${Math.round(height * 0.05)}px ${Math.round(width * 0.04)}px`,
          background: kitTheme.darkSurface,
          border: `1px solid ${kitTheme.darkLine}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.lg,
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontFamily: kitFont.mono,
              fontSize: Math.round(width * 0.011),
              letterSpacing: "0.4em",
              color: kitTheme.green[400],
              fontWeight: 600,
            }}
          >
            PROJECT STATUS
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
              color: "#ffffff",
            }}
          >
            Completion Rate
          </h1>
        </div>

        <svg
          viewBox="0 0 600 440"
          width="100%"
          style={{ display: "block", marginTop: Math.round(height * 0.015) }}
        >
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={kitTheme.darkLine}
            strokeWidth={strokeWidth}
          />

          {/* Donut segments */}
          {segments.map((segment, i) => {
            const segmentLength = (segment.value / total) * circumference;
            const currentOffset = cumulativeOffset;
            cumulativeOffset += segmentLength;

            const segmentProgress = interpolate(
              frame,
              [i * 12, 20 + i * 12],
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
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${animatedLength} ${circumference - animatedLength}`}
                strokeDashoffset={-currentOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
          })}

          {/* Center number */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontFamily={kitFont.mono}
            fontSize="46"
            fontWeight="700"
          >
            {centerValue}%
          </text>

          {/* Center label */}
          <text
            x={cx}
            y={cy + 32}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={kitTheme.darkMuted}
            fontFamily={kitFont.sans}
            fontSize="16"
          >
            Completion Rate
          </text>
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
              [5 + i * 12, 15 + i * 12],
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
                    color: kitTheme.gray[100],
                    fontFamily: kitFont.sans,
                    fontSize: Math.round(width * 0.013),
                  }}
                >
                  {segment.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
