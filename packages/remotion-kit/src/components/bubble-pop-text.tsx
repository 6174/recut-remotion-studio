/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * green gradient bubbles popping with spring physics.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitShadow, kitTheme } from "./helpers/theme";

export default function BubblePopText() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const text = "HELLO";
  const bubble = Math.round(height * 0.17);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 90% at 50% 40%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 66%)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.13, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>POP IN</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: Math.round(width * 0.018),
        }}
      >
        {text.split("").map((char, i) => {
          const delay = i * 5;
          const scale = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping: 9, mass: 0.35, stiffness: 120 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `scale(${scale})`,
                width: bubble,
                height: bubble,
                lineHeight: `${bubble}px`,
                textAlign: "center",
                borderRadius: "50%",
                background: kitGradient.green,
                color: "#ffffff",
                fontFamily: kitFont.sans,
                fontSize: Math.round(bubble * 0.42),
                fontWeight: 800,
                letterSpacing: "-0.01em",
                boxShadow: kitShadow.md,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(width * 0.014), color: kitTheme.darkMuted }}>
          Impact, one letter at a time.
        </span>
      </div>
    </AbsoluteFill>
  );
}
