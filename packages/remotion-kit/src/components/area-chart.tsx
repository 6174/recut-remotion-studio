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

export default function AreaChart() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const data = [
    { x: 0, y: 20, label: "Mon" },
    { x: 1, y: 45, label: "Tue" },
    { x: 2, y: 35, label: "Wed" },
    { x: 3, y: 60, label: "Thu" },
    { x: 4, y: 55, label: "Fri" },
    { x: 5, y: 75, label: "Sat" },
    { x: 6, y: 70, label: "Sun" },
    { x: 7, y: 85, label: "Mon" },
    { x: 8, y: 80, label: "Tue" },
    { x: 9, y: 95, label: "Wed" },
  ];

  // Chart dimensions (viewBox units, scales responsively)
  const chartWidth = 880;
  const chartHeight = 400;
  const padding = 56;

  const xScale = (x: number) =>
    (x / (data.length - 1)) * (chartWidth - padding * 2) + padding;
  const yScale = (y: number) =>
    chartHeight - padding - (y / 100) * (chartHeight - padding * 2);

  // Build line path
  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.x)} ${yScale(d.y)}`)
    .join(" ");

  // Build area path (closed polygon)
  const areaPath =
    linePath +
    ` L ${xScale(data[data.length - 1].x)} ${chartHeight - padding}` +
    ` L ${xScale(data[0].x)} ${chartHeight - padding} Z`;

  // Clip rect animation - reveals left to right (clamped geometry)
  const clipWidth = interpolate(
    frame,
    [0, 60],
    [0, chartWidth - padding * 2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
          width: "min(88%, 1080px)",
          padding: `${Math.round(height * 0.05)}px ${Math.round(width * 0.04)}px`,
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.md,
        }}
      >
        <div style={{ textAlign: "left" }}>
          <span
            style={{
              fontFamily: kitFont.mono,
              fontSize: Math.round(width * 0.011),
              letterSpacing: "0.4em",
              color: kitTheme.green[600],
              fontWeight: 600,
            }}
          >
            WEEKLY TREND
          </span>
          <h1
            style={{
              margin: 0,
              marginTop: Math.round(height * 0.012),
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.035),
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: kitTheme.ink,
            }}
          >
            Performance Metrics
          </h1>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          style={{ display: "block", marginTop: Math.round(height * 0.02) }}
        >
          <defs>
            {/* Gradient fill for area */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={kitTheme.green[500]} stopOpacity="0.35" />
              <stop offset="100%" stopColor={kitTheme.green[500]} stopOpacity="0" />
            </linearGradient>

            {/* Clip path for reveal animation */}
            <clipPath id="revealClip">
              <rect x={padding} y={0} width={clipWidth} height={chartHeight} />
            </clipPath>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => (
            <line
              key={`grid-${val}`}
              x1={padding}
              y1={yScale(val)}
              x2={chartWidth - padding}
              y2={yScale(val)}
              stroke={kitTheme.line}
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((val) => (
            <text
              key={`y-${val}`}
              x={padding - 16}
              y={yScale(val) + 4}
              textAnchor="end"
              fill={kitTheme.faint}
              fontFamily={kitFont.mono}
              fontSize="12"
            >
              {val}
            </text>
          ))}

          {/* Axes */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke={kitTheme.lineStrong}
            strokeWidth="1.5"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke={kitTheme.lineStrong}
            strokeWidth="1.5"
          />

          {/* X-axis labels */}
          {data.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={xScale(point.x)}
              y={chartHeight - padding + 26}
              textAnchor="middle"
              fill={kitTheme.faint}
              fontFamily={kitFont.mono}
              fontSize="13"
            >
              {point.label}
            </text>
          ))}

          {/* Area fill with clip */}
          <path d={areaPath} fill="url(#areaGradient)" clipPath="url(#revealClip)" />

          {/* Line with clip */}
          <path
            d={linePath}
            fill="none"
            stroke={kitTheme.green[600]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#revealClip)"
          />

          {/* Data points */}
          {data.map((point, i) => {
            const pointProgress = interpolate(
              frame,
              [5 + i * 6, 10 + i * 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <circle
                key={`point-${i}`}
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={4 * pointProgress}
                fill={kitTheme.paper}
                stroke={kitTheme.green[600]}
                strokeWidth="2.5"
                opacity={pointProgress}
              />
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
}
