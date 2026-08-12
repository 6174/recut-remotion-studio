/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * monospace type with green/blue RGB-split glitch and clean decay.
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function GlitchText() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fontSize = Math.round(width * 0.075);

  const burst = Math.sin(frame / 9) * Math.round(width * 0.006);
  const offset = interpolate(frame, [0, 24, 48, 72, 96], [1, 0.5, 0.2, 0.08, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 66%)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.13, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>SIGNAL BREAK</span>
      </div>
      <div
        style={{
          position: "relative",
          fontFamily: kitFont.mono,
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            color: kitTheme.green[400],
            transform: `translate(${burst * offset + 4}px, ${burst * 0.6 * offset}px)`,
            mixBlendMode: "screen",
            userSelect: "none",
          }}
        >
          GLITCH
        </div>
        <div
          style={{
            position: "absolute",
            color: kitTheme.blue,
            transform: `translate(${-burst * offset - 4}px, ${-burst * 0.6 * offset}px)`,
            mixBlendMode: "screen",
            userSelect: "none",
          }}
        >
          GLITCH
        </div>
        <div style={{ color: "#ffffff", textShadow: `0 ${Math.round(width * 0.004)}px ${Math.round(width * 0.012)}px rgba(0,0,0,0.5)` }}>GLITCH</div>
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.013), color: kitTheme.darkMuted, letterSpacing: "0.3em" }}>RGB SPLIT · DECAYS TO CLEAN</span>
      </div>
    </AbsoluteFill>
  );
}
