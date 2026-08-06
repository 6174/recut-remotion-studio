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

export default function ProgressBars() {
  const frame = useCurrentFrame();

  const skills = [
    { label: "React", value: 90, color: "#4361ee" },
    { label: "TypeScript", value: 85, color: "#7209b7" },
    { label: "Node.js", value: 75, color: "#f72585" },
    { label: "Python", value: 60, color: "#4cc9f0" },
    { label: "Go", value: 45, color: "#a855f7" },
  ];

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
          width: "700px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          padding: "40px 50px",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            letterSpacing: "-0.5px",
            marginBottom: "35px",
            textAlign: "center",
          }}
        >
          Skills Overview
        </div>

        {/* Bars */}
        {skills.map((skill, i) => {
          const barProgress = interpolate(
            frame,
            [5 + i * 8, 25 + i * 8],
            [0, skill.value],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          const labelOpacity = interpolate(
            frame,
            [i * 8, 5 + i * 8],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          return (
            <div
              key={`skill-${i}`}
              style={{
                marginBottom: i < skills.length - 1 ? "22px" : "0",
                opacity: labelOpacity,
              }}
            >
              {/* Label row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {skill.label}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {Math.round(barProgress)}%
                </span>
              </div>

              {/* Bar track */}
              <div
                style={{
                  width: "100%",
                  height: "14px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "7px",
                  overflow: "hidden",
                }}
              >
                {/* Bar fill */}
                <div
                  style={{
                    width: `${barProgress}%`,
                    height: "100%",
                    backgroundColor: skill.color,
                    borderRadius: "7px",
                    boxShadow: `0 0 10px ${skill.color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
