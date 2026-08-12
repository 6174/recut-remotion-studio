/** Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function ProgressSteps() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const steps = ["Research", "Design", "Build", "Launch"];
  const framesPerStep = Math.floor(fps * 0.8);

  const circleSize = Math.round(width * 0.05);
  const stepWidth = Math.round(width * 0.11);
  const connectorWidth = Math.round(width * 0.11);

  return (
    <AbsoluteFill style={{ background: kitGradient.paper, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[600], fontWeight: 600 }}>
          PROJECT TIMELINE
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: stepWidth }}>
                <div
                  style={{
                    width: circleSize,
                    height: circleSize,
                    borderRadius: kitRadius.full,
                    border: `3px solid ${fillProgress > 0 ? kitTheme.green[500] : kitTheme.lineStrong}`,
                    background: fillProgress > 0 ? kitGradient.green : kitTheme.paper,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: `scale(${circleScale})`,
                    boxShadow: fillProgress > 0
                      ? `0 0 0 ${Math.round(circleSize * 0.08)}px rgba(28, 174, 88, 0.15)`
                      : "none",
                  }}
                >
                  <span
                    style={{
                      color: fillProgress > 0 ? "#ffffff" : kitTheme.faint,
                      fontSize: Math.round(circleSize * 0.38),
                      fontWeight: 800,
                      fontFamily: kitFont.mono,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span
                  style={{
                    color: fillProgress > 0 ? kitTheme.ink : kitTheme.faint,
                    fontSize: Math.round(width * 0.014),
                    fontWeight: 600,
                    marginTop: Math.round(height * 0.014),
                    whiteSpace: "nowrap",
                    fontFamily: kitFont.sans,
                  }}
                >
                  {label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  style={{
                    width: connectorWidth,
                    height: 4,
                    background: kitTheme.line,
                    borderRadius: kitRadius.full,
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: Math.round(height * 0.03),
                  }}
                >
                  <div
                    style={{
                      width: `${lineProgress * 100}%`,
                      height: "100%",
                      background: kitGradient.green,
                      borderRadius: kitRadius.full,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
