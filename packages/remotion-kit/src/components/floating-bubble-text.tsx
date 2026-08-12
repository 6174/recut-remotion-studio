/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * floating glass pill with sine-wave wobble and green accent.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function FloatingBubbleText() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const float = Math.sin(frame / 30) * Math.round(height * 0.012);
  const scale = spring({ frame, fps, from: 0, to: 1, config: { damping: 14, mass: 0.6 } });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 90% at 50% 42%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 66%)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.13, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>FLOATING CHIP</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${float}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            position: "relative",
            padding: `${Math.round(height * 0.035)}px ${Math.round(width * 0.05)}px`,
            borderRadius: kitRadius.full,
            background: "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${kitTheme.darkLine}`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), ${kitShadow.md}`,
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: Math.round(width * 0.012),
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: kitTheme.green[400],
              boxShadow: `0 0 0 4px ${kitTheme.green[500]}33`,
            }}
          />
          <span
            style={{
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.03),
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            Floating
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(width * 0.014), color: kitTheme.darkMuted }}>
          Gentle sine-wave drift keeps the eye on the message.
        </span>
      </div>
    </AbsoluteFill>
  );
}
