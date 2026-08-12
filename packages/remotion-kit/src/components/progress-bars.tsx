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

export default function ProgressBars() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const skills = [
    { label: "React", value: 90 },
    { label: "TypeScript", value: 85 },
    { label: "Node.js", value: 75 },
    { label: "Python", value: 60 },
    { label: "Go", value: 45 },
  ];

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
          width: "min(78%, 860px)",
          padding: `${Math.round(height * 0.055)}px ${Math.round(width * 0.045)}px`,
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
            ENGINEERING
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
              marginBottom: Math.round(height * 0.035),
            }}
          >
            Skills Overview
          </h1>
        </div>

        {/* Bars */}
        {skills.map((skill, i) => {
          const barProgress = interpolate(
            frame,
            [5 + i * 8, 25 + i * 8],
            [0, skill.value],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const labelOpacity = interpolate(
            frame,
            [i * 8, 5 + i * 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={`skill-${i}`}
              style={{
                marginBottom: i < skills.length - 1 ? Math.round(height * 0.02) : 0,
                opacity: labelOpacity,
              }}
            >
              {/* Label row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: Math.round(height * 0.008),
                }}
              >
                <span
                  style={{
                    color: kitTheme.ink,
                    fontFamily: kitFont.sans,
                    fontSize: Math.round(width * 0.017),
                    fontWeight: 600,
                  }}
                >
                  {skill.label}
                </span>
                <span
                  style={{
                    color: kitTheme.muted,
                    fontFamily: kitFont.mono,
                    fontSize: Math.round(width * 0.015),
                    fontWeight: 500,
                  }}
                >
                  {Math.round(barProgress)}%
                </span>
              </div>

              {/* Bar track */}
              <div
                style={{
                  width: "100%",
                  height: Math.max(10, Math.round(height * 0.012)),
                  backgroundColor: kitTheme.paperDeep,
                  borderRadius: kitRadius.full,
                  overflow: "hidden",
                }}
              >
                {/* Bar fill */}
                <div
                  style={{
                    width: `${barProgress}%`,
                    height: "100%",
                    background: kitGradient.green,
                    borderRadius: kitRadius.full,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
