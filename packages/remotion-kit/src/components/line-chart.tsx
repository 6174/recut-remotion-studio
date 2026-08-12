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

export default function LineChart() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const data = [
    { x: 0, y: 25, label: "Jan" },
    { x: 1, y: 40, label: "Feb" },
    { x: 2, y: 35, label: "Mar" },
    { x: 3, y: 55, label: "Apr" },
    { x: 4, y: 50, label: "May" },
    { x: 5, y: 70, label: "Jun" },
    { x: 6, y: 65, label: "Jul" },
    { x: 7, y: 80, label: "Aug" },
    { x: 8, y: 75, label: "Sep" },
    { x: 9, y: 90, label: "Oct" },
  ];

  // Chart dimensions (viewBox units, scales responsively)
  const chartWidth = 880;
  const chartHeight = 400;
  const padding = 56;

  const xScale = (x: number) =>
    (x / (data.length - 1)) * (chartWidth - padding * 2) + padding;
  const yScale = (y: number) =>
    chartHeight - padding - (y / 100) * (chartHeight - padding * 2);

  // Build polyline points
  const points = data.map((d) => `${xScale(d.x)},${yScale(d.y)}`).join(" ");

  // Calculate total polyline length (approximate)
  let totalLength = 0;
  for (let i = 1; i < data.length; i++) {
    const dx = xScale(data[i].x) - xScale(data[i - 1].x);
    const dy = yScale(data[i].y) - yScale(data[i - 1].y);
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  // Animate line drawing (frame-derived, clamped for geometry)
  const dashOffset = interpolate(frame, [0, 60], [totalLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          width: "min(88%, 1080px)",
          padding: `${Math.round(height * 0.05)}px ${Math.round(width * 0.04)}px`,
          background: kitTheme.darkSurface,
          border: `1px solid ${kitTheme.darkLine}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.lg,
        }}
      >
        <div style={{ textAlign: "left" }}>
          <span
            style={{
              fontFamily: kitFont.mono,
              fontSize: Math.round(width * 0.011),
              letterSpacing: "0.4em",
              color: kitTheme.green[400],
              fontWeight: 600,
            }}
          >
            KPI DASHBOARD
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
              color: "#ffffff",
            }}
          >
            Revenue Growth
          </h1>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          style={{ display: "block", marginTop: Math.round(height * 0.02) }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={kitTheme.green[300]} />
              <stop offset="100%" stopColor={kitTheme.green[600]} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => (
            <line
              key={`grid-${val}`}
              x1={padding}
              y1={yScale(val)}
              x2={chartWidth - padding}
              y2={yScale(val)}
              stroke="rgba(255, 255, 255, 0.06)"
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
              fill={kitTheme.darkMuted}
              fontFamily={kitFont.mono}
              fontSize="12"
            >
              {val}
            </text>
          ))}

          {/* X-axis line */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke={kitTheme.darkLine}
            strokeWidth="1.5"
          />

          {/* Y-axis line */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke={kitTheme.darkLine}
            strokeWidth="1.5"
          />

          {/* X-axis labels */}
          {data.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={xScale(point.x)}
              y={chartHeight - padding + 26}
              textAnchor="middle"
              fill={kitTheme.darkMuted}
              fontFamily={kitFont.mono}
              fontSize="13"
            >
              {point.label}
            </text>
          ))}

          {/* Animated polyline */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
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
                r={5 * pointProgress}
                fill={kitTheme.darkSurface}
                stroke={kitTheme.green[400]}
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
