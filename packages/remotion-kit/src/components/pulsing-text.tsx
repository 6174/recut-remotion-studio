/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * continuous spring-like scale pulse with a green glow behind each glyph.
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function PulsingText() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const text = "Pulse";
  const fontSize = Math.round(width * 0.07);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 66%)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.13, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>CONTINUOUS PULSE</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: Math.round(width * 0.012),
        }}
      >
        {text.split("").map((char, i) => {
          const delay = i * 6;
          const pulse = interpolate(((frame - delay) % 30) / 30, [0, 0.5, 1], [1, 1.22, 1], { extrapolateRight: "clamp" });
          const opacity = interpolate(((frame - delay) % 30) / 30, [0, 0.5, 1], [0.55, 1, 0.55], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ position: "relative", transform: `scale(${pulse})` }}>
              <span
                style={{
                  position: "relative",
                  zIndex: 2,
                  fontFamily: kitFont.sans,
                  fontSize,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  textShadow: `0 ${Math.round(height * 0.006)}px ${Math.round(height * 0.02)}px rgba(0,0,0,0.4)`,
                }}
              >
                {char}
              </span>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: Math.round(fontSize * 0.9),
                  height: Math.round(fontSize * 0.9),
                  borderRadius: "50%",
                  background: `${kitTheme.green[500]}44`,
                  filter: "blur(22px)",
                  opacity,
                  zIndex: 1,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(width * 0.014), color: kitTheme.darkMuted }}>
          A steady heartbeat keeps emphasis alive.
        </span>
      </div>
    </AbsoluteFill>
  );
}
