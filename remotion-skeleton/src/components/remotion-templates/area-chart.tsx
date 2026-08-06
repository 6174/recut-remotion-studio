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

import { interpolate, useCurrentFrame } from "remotion";

export default function AreaChart() {
  const frame = useCurrentFrame();

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

  const chartWidth = 900;
  const chartHeight = 500;
  const padding = 70;

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

  // Clip rect animation - reveals left to right
  const clipWidth = interpolate(
    frame,
    [0, 60],
    [0, chartWidth - padding * 2],
    { extrapolateRight: "clamp" }
  );

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
        fontFamily: "Inter, system-ui, sans-serif",
        background: "linear-gradient(to bottom right, #111827, #1f2937)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${chartWidth}px`,
          height: `${chartHeight}px`,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          padding: "20px",
        }}
      >
        <svg width={chartWidth} height={chartHeight}>
          <defs>
            {/* Gradient fill for area */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4361ee" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4361ee" stopOpacity="0" />
            </linearGradient>

            {/* Clip path for reveal animation */}
            <clipPath id="revealClip">
              <rect
                x={padding}
                y={0}
                width={clipWidth}
                height={chartHeight}
              />
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
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map((val) => (
            <text
              key={`y-${val}`}
              x={padding - 15}
              y={yScale(val) + 5}
              textAnchor="end"
              fill="rgba(255,255,255,0.6)"
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
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />

          {/* X-axis labels */}
          {data.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={xScale(point.x)}
              y={chartHeight - padding + 25}
              textAnchor="middle"
              fill="rgba(255,255,255,0.8)"
              fontSize="13"
              fontWeight="500"
            >
              {point.label}
            </text>
          ))}

          {/* Area fill with clip */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            clipPath="url(#revealClip)"
          />

          {/* Line with clip */}
          <path
            d={linePath}
            fill="none"
            stroke="#4361ee"
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
                fill="white"
                stroke="#4361ee"
                strokeWidth="2"
                opacity={pointProgress}
              />
            );
          })}
        </svg>

        {/* Chart title */}
        <div
          style={{
            position: "absolute",
            top: "25px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "28px",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            letterSpacing: "-0.5px",
          }}
        >
          Performance Metrics
        </div>
      </div>
    </div>
  );
}
