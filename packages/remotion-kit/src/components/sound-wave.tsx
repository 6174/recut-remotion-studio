/**
 * Free Remotion Template Component
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

import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function SoundWave() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const BAR_COUNT = 40;
  const maxBarHeight = Math.round(height * 0.42);
  const maxBarWidth = Math.round(width * 0.012);

  const bars = Array.from({ length: BAR_COUNT }).map((_, i) => {
    const seed = i * 1000;
    const rawHeight =
      Math.abs(Math.sin(frame / 10 + i / 2)) * maxBarHeight +
      random(seed) * maxBarHeight * 0.3;
    const barHeight = interpolate(
      rawHeight,
      [0, maxBarHeight * 1.3],
      [Math.round(maxBarHeight * 0.06), maxBarHeight],
      { extrapolateRight: "clamp" }
    );

    return {
      barHeight,
      active: i % 5 === 0,
    };
  });

  return (
    <AbsoluteFill style={{ background: kitGradient.dark, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: height * 0.12, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>
          NOW PLAYING
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: Math.round(width * 0.006) }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              width: maxBarWidth,
              height: `${bar.barHeight}px`,
              background: bar.active ? kitTheme.green[400] : kitTheme.darkMuted,
              borderRadius: kitRadius.full,
              boxShadow: bar.active ? "0 0 20px rgba(28, 174, 88, 0.35)" : "none",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
}
