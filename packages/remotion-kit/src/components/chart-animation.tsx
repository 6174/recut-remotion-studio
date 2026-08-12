/**
 * [INPUT]: 依赖 Remotion 帧时钟与内置图表样例数据
 * [OUTPUT]: 对外提供 ChartAnimation，渲染按帧依次生长的 SVG 柱状图
 * [POS]: remotion-kit/components 的图表模板；可作为目录组件直接预览或被项目 composition 引入
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
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

export default function ChartAnimation() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Sample data points (can be replaced with your actual data)
  const data = [
    { x: 0, y: 50, label: "Jan" },
    { x: 1, y: 80, label: "Feb" },
    { x: 2, y: 30, label: "Mar" },
    { x: 3, y: 70, label: "Apr" },
    { x: 4, y: 45, label: "May" },
    { x: 5, y: 90, label: "Jun" },
    { x: 6, y: 60, label: "Jul" },
    { x: 7, y: 75, label: "Aug" },
    { x: 8, y: 40, label: "Sep" },
    { x: 9, y: 85, label: "Oct" },
  ];

  // Chart dimensions (viewBox units, scales responsively)
  const chartWidth = 880;
  const chartHeight = 400;
  const padding = 52;

  // Scale data to fit chart dimensions
  const xScale = (x: number) =>
    (x / (data.length - 1)) * (chartWidth - padding * 2) + padding;
  const yScale = (y: number) =>
    chartHeight - padding - (y / 100) * (chartHeight - padding * 2);

  const barWidth = ((chartWidth - padding * 2) / data.length) * 0.58;

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
            ANNUAL REPORT
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
            Monthly Performance
          </h1>
          <p
            style={{
              margin: 0,
              marginTop: Math.round(height * 0.008),
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.015),
              color: kitTheme.faint,
            }}
          >
            Data visualization for 2023
          </p>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          style={{ display: "block", marginTop: Math.round(height * 0.02) }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={kitTheme.green[400]} />
              <stop offset="100%" stopColor={kitTheme.green[600]} />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
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

          {/* X-axis baseline */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
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

          {/* Bar chart with frame-driven growth */}
          {data.map((point, i) => {
            const barHeight = (point.y / 100) * (chartHeight - padding * 2);
            const barProgress = interpolate(
              frame,
              [i * 3, 15 + i * 3],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const currentHeight = barHeight * barProgress;
            const currentY = chartHeight - padding - currentHeight;

            return (
              <g key={`bar-${i}`}>
                <rect
                  x={xScale(point.x) - barWidth / 2}
                  y={currentY}
                  width={barWidth}
                  height={currentHeight}
                  fill="url(#barGradient)"
                  rx={kitRadius.sm}
                />
                <text
                  x={xScale(point.x)}
                  y={currentY - 12}
                  textAnchor="middle"
                  fill={kitTheme.muted}
                  fontFamily={kitFont.mono}
                  fontSize="13"
                  fontWeight="600"
                  opacity={barProgress > 0.9 ? 1 : 0}
                >
                  {point.y}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
}
