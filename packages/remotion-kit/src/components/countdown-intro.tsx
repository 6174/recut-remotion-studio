/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * mono digits, green progress ring.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function CountdownIntro() {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  const totalCountdownFrames = fps * 3;
  const secondFrames = fps;

  const currentSecond = Math.max(3 - Math.floor(frame / secondFrames), 0);
  const isCountdownDone = frame >= totalCountdownFrames;

  const frameInSecond = frame % secondFrames;
  const ringProgress = frameInSecond / secondFrames;

  const size = Math.round(Math.min(width * 0.22, 380));
  const radius = size * 0.39;
  const strokeWidth = Math.round(size * 0.033);

  const circumference = 2 * Math.PI * radius;
  const dashOffset = isCountdownDone ? circumference : circumference * ringProgress;

  const numberOpacity = isCountdownDone ? 0 : 1;

  const goScale = spring({
    frame: Math.max(frame - totalCountdownFrames, 0),
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const goOpacity = interpolate(
    frame,
    [totalCountdownFrames, totalCountdownFrames + 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={kitTheme.darkLine}
            strokeWidth={strokeWidth}
          />
          {!isCountdownDone && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={kitTheme.green[500]}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          )}
        </svg>
        {!isCountdownDone && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#ffffff",
              fontFamily: kitFont.mono,
              fontSize: Math.round(size * 0.42),
              fontWeight: 800,
              lineHeight: 1,
              opacity: numberOpacity,
            }}
          >
            {currentSecond}
          </span>
        )}
        {isCountdownDone && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${goScale})`,
              color: kitTheme.green[400],
              fontFamily: kitFont.mono,
              fontSize: Math.round(size * 0.36),
              fontWeight: 800,
              letterSpacing: "0.02em",
              opacity: goOpacity,
            }}
          >
            GO!
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
}
