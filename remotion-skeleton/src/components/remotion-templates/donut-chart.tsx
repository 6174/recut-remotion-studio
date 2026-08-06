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

export default function DonutChart() {
  const frame = useCurrentFrame();

  const segments = [
    { label: "Completed", value: 40, color: "#4361ee" },
    { label: "In Progress", value: 25, color: "#7209b7" },
    { label: "Pending", value: 20, color: "#f72585" },
    { label: "Remaining", value: 15, color: "#4cc9f0" },
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = 300;
  const cy = 230;
  const radius = 120;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  // Center stat animation
  const centerValue = Math.round(
    interpolate(frame, [10, 50], [0, 78], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
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
          width: "600px",
          height: "520px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          padding: "20px",
        }}
      >
        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "28px",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            letterSpacing: "-0.5px",
          }}
        >
          Completion Rate
        </div>

        <svg width={600} height={460} style={{ marginTop: "10px" }}>
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
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
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
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
            y={cy - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="48"
            fontWeight="bold"
          >
            {centerValue}%
          </text>

          {/* Center label */}
          <text
            x={cx}
            y={cy + 30}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="16"
          >
            Completion Rate
          </text>
        </svg>

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {segments.map((segment, i) => {
            const legendOpacity = interpolate(
              frame,
              [5 + i * 12, 15 + i * 12],
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );

            return (
              <div
                key={`legend-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: legendOpacity,
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: segment.color,
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "13px",
                  }}
                >
                  {segment.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
