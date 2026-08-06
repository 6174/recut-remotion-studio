/** Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 */

"use client";

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export default function ProgressSteps() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = ["Research", "Design", "Build", "Launch"];
  const framesPerStep = Math.floor(fps * 0.8);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #111827, #1f2937)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "60px",
          margin: 0,
          marginTop: 0,
          paddingBottom: "60px",
        }}
      >
        Project Timeline
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0px",
          position: "relative",
        }}
      >
        {steps.map((label, i) => {
          const stepStart = i * framesPerStep;
          const fillProgress = interpolate(
            frame,
            [stepStart, stepStart + framesPerStep * 0.6],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const isActive =
            frame >= stepStart && frame < stepStart + framesPerStep;
          const isComplete = frame >= stepStart + framesPerStep * 0.6;

          const pulse = isActive
            ? spring({
                frame: frame - stepStart,
                fps,
                config: { damping: 8, stiffness: 150, mass: 0.4 },
              })
            : 1;

          const circleScale = isActive ? 0.9 + pulse * 0.2 : isComplete ? 1.1 : 1;

          const lineProgress =
            i < steps.length - 1
              ? interpolate(
                  frame,
                  [stepStart + framesPerStep * 0.5, stepStart + framesPerStep],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )
              : 0;

          return (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: `3px solid ${fillProgress > 0 ? "#3b82f6" : "#4b5563"}`,
                    background:
                      fillProgress > 0
                        ? `linear-gradient(135deg, #3b82f6, #7209b7)`
                        : "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: `scale(${circleScale})`,
                    transition: "border-color 0.1s",
                  }}
                >
                  <span
                    style={{
                      color: fillProgress > 0 ? "white" : "#6b7280",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span
                  style={{
                    color: fillProgress > 0 ? "#93c5fd" : "#6b7280",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    marginTop: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  style={{
                    width: "80px",
                    height: "3px",
                    background: "#374151",
                    borderRadius: "2px",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: `${lineProgress * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #3b82f6, #a855f7)",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
