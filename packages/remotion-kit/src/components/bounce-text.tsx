/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): paper canvas,
 * hairline white card, ink type with green accent.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function BounceText() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, from: 60, to: 0, config: { damping: 18, mass: 0.6, stiffness: 120 } });
  const fadeIn = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 20, mass: 0.8 } });
  const scaleIn = spring({ frame, fps, from: 0.92, to: 1, config: { damping: 16, mass: 0.7, stiffness: 140 } });
  const bar = spring({ frame: frame - 8, fps, from: 0, to: 1, config: { damping: 14, mass: 0.5 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[600], fontWeight: 600 }}>BOUNCE IN</span>
      </div>
      <div
        style={{
          width: "min(78%, 1240px)",
          padding: `${Math.round(height * 0.06)}px ${Math.round(width * 0.05)}px`,
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.md,
          transform: `scale(${scaleIn})`,
        }}
      >
        <div style={{ transform: `translateX(${slideIn}px)` }}>
          <h1
            style={{
              margin: 0,
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.052),
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              color: kitTheme.ink,
            }}
          >
            Start Building
          </h1>
          <div
            style={{
              marginTop: Math.round(height * 0.022),
            width: `${bar * 24}%`,
            height: 6,
            borderRadius: 999,
            background: kitGradient.green,
            }}
          />
          <h2
            style={{
              margin: 0,
              marginTop: Math.round(height * 0.022),
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.022),
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: kitTheme.muted,
              opacity: fadeIn,
            }}
          >
            There&apos;s never been a better time
          </h2>
        </div>
      </div>
    </AbsoluteFill>
  );
}
