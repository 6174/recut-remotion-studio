/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark neutral
 * stage with a smooth green liquid wave.
 */

"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";
import { kitGradient, kitTheme } from "./helpers/theme";

export default function LiquidWave() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const numberOfPoints = 50;
  const points = Array.from({ length: numberOfPoints + 1 }).map((_, i) => {
    const x = (i / numberOfPoints) * width;
    const waveHeight = Math.sin(frame / 20 + i / 5) * height * 0.06;
    const y = height / 2 + waveHeight;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} style={{ background: kitGradient.dark }}>
      <defs>
        <linearGradient id="greenWave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={kitTheme.green[700]} />
          <stop offset="50%" stopColor={kitTheme.green[500]} />
          <stop offset="100%" stopColor={kitTheme.green[400]} />
        </linearGradient>
      </defs>
      <path
        d={`M 0,${height} ${points.join(" ")} ${width},${height} Z`}
        fill="url(#greenWave)"
        style={{
          filter: "blur(10px)",
        }}
      />
    </svg>
  );
}
