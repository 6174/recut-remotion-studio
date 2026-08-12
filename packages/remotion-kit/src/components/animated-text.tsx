/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * high-contrast white type, green accent, frame-derived sizing.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function AnimatedText() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const text = "Hello Remotion".split("");
  const fontSize = Math.round(width * 0.07);
  const charSpring = (i: number) => {
    const delay = i * 5;
    return {
      opacity: spring({ frame: frame - delay, fps, from: 0, to: 1, config: { mass: 0.5, damping: 10 } }),
      y: spring({ frame: frame - delay, fps, from: 46, to: 0, config: { mass: 0.5, damping: 12 } }),
    };
  };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>CHARACTER REVEAL</span>
      </div>
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", textAlign: "center", padding: "0 8%" }}>
        {text.map((char, i) => {
          const { opacity, y } = charSpring(i);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                color: "#ffffff",
                fontFamily: kitFont.sans,
                fontSize,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
                transform: `translateY(${y}px)`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(width * 0.014), color: kitTheme.darkMuted, letterSpacing: "0.02em" }}>
          One letter at a time, in perfect order.
        </span>
      </div>
    </AbsoluteFill>
  );
}
