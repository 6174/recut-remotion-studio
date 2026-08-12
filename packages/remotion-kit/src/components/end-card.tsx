/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): paper canvas,
 * white card, ink type, green CTA.
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function EndCard() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    durationInFrames: 35,
    config: {
      damping: 12,
      mass: 0.6,
    },
  });

  const contentOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
  });

  const buttonOpacity = spring({
    frame: Math.max(0, frame - 20),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 25,
  });

  const iconsOpacity = spring({
    frame: Math.max(0, frame - 30),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 25,
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: contentOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "min(76%, 980px)",
          padding: `${Math.round(height * 0.06)}px ${Math.round(width * 0.05)}px`,
          borderRadius: kitRadius.lg,
          border: `1px solid ${kitTheme.line}`,
          boxShadow: kitShadow.lg,
          background: kitTheme.paper,
        }}
      >
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            fontWeight: 600,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: kitTheme.green[600],
          }}
        >
          Fin
        </span>
        <h1
          style={{
            margin: 0,
            marginTop: Math.round(height * 0.02),
            color: kitTheme.ink,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.055),
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Thanks for Watching
        </h1>
        <div
          style={{
            opacity: buttonOpacity,
            marginTop: Math.round(height * 0.035),
            padding: `${Math.round(height * 0.018)}px ${Math.round(width * 0.035)}px`,
            background: kitGradient.green,
            borderRadius: kitRadius.full,
            cursor: "pointer",
            boxShadow: kitShadow.md,
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontFamily: kitFont.sans,
              fontSize: Math.round(width * 0.018),
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            Subscribe for More
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: Math.round(width * 0.012),
            marginTop: Math.round(height * 0.035),
            opacity: iconsOpacity,
          }}
        >
          {[kitTheme.green[400], kitTheme.gray[300], kitTheme.gray[200], kitTheme.gray[300]].map(
            (color, i) => (
              <div
                key={i}
                style={{
                  width: Math.round(width * 0.02),
                  height: Math.round(width * 0.02),
                  borderRadius: "50%",
                  background: color,
                  boxShadow: kitShadow.sm,
                }}
              />
            )
          )}
        </div>
        <p
          style={{
            margin: 0,
            marginTop: Math.round(height * 0.03),
            color: kitTheme.faint,
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.01),
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Studio Creative
        </p>
      </div>
    </AbsoluteFill>
  );
}
