/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * directional slide-in type with a green accent segment.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function SlideText() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const opacity = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });
  const slideX = spring({ frame, fps, from: Math.round(width * 0.12), to: 0, durationInFrames: 30, config: { damping: 14, mass: 0.6 } });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 66%)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.13, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>DIRECTIONAL SLIDE</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%) translateX(0)",
          textAlign: "center",
          padding: "0 8%",
          opacity,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.06),
            fontWeight: 900,
            letterSpacing: "-0.035em",
            color: "#ffffff",
            textShadow: `0 ${Math.round(height * 0.006)}px ${Math.round(height * 0.02)}px rgba(0,0,0,0.4)`,
            transform: `translateX(${slideX}px)`,
          }}
        >
          Sliding <span style={{ color: kitTheme.green[400] }}>Text</span>!
        </h1>
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(width * 0.014), color: kitTheme.darkMuted }}>
          Entrance from the side keeps momentum in the message.
        </span>
      </div>
    </AbsoluteFill>
  );
}
