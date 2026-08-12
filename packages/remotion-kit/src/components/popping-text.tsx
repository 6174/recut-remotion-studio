/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * oversized pop-in type alternating ink-white and green with a hairline outline.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function PoppingText() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const text = "BINGO!".split("");
  const colors = [kitTheme.green[400], "#ffffff", kitTheme.green[300]];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 38%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 66%)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.13, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>POPPING SCALE</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: Math.round(width * 0.012),
        }}
      >
        {text.map((char, i) => {
          const delay = i * 7;
          const colorIndex = i % colors.length;
          const scale = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { mass: 0.4, damping: 8, stiffness: 110 } });
          const opacity = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { mass: 0.3, damping: 8, stiffness: 110 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                color: colors[colorIndex],
                fontFamily: kitFont.sans,
                fontSize: Math.round(width * 0.075),
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textShadow: `${Math.round(width * 0.0015)}px ${Math.round(width * 0.0015)}px 0 ${kitTheme.dark}, ${Math.round(width * 0.002)}px ${Math.round(width * 0.002)}px ${Math.round(width * 0.02)}px rgba(0,0,0,0.35)`,
                transform: `scale(${scale})`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(width * 0.014), color: kitTheme.darkMuted }}>
          Spring-scale entrance for your winning moment.
        </span>
      </div>
    </AbsoluteFill>
  );
}
