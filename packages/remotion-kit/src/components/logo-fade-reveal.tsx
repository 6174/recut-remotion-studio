/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): paper canvas,
 * green monogram mark, ink type, frame-derived fade reveal.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function LogoFadeReveal() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Mark fade + scale using spring
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const logoOpacity = logoProgress;
  const logoScale = 0.8 + 0.2 * logoProgress;

  // Wordmark fades in with delay
  const textProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 60, mass: 0.6 },
  });

  const textOpacity = textProgress;
  const textTranslateY = 20 * (1 - textProgress);

  const markSize = Math.round(width * 0.14);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.011),
            letterSpacing: "0.5em",
            color: kitTheme.green[600],
            fontWeight: 600,
          }}
        >
          FADE REVEAL
        </span>
      </div>
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            width: markSize,
            height: markSize,
            borderRadius: kitRadius.lg,
            background: kitGradient.green,
            boxShadow: kitShadow.md,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontFamily: kitFont.sans,
              fontSize: Math.round(markSize * 0.5),
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            R
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: Math.round(height * 0.04),
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: kitTheme.ink,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.052),
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          Company Name
        </h2>
        <p
          style={{
            margin: `${Math.round(height * 0.012)}px 0 0`,
            color: kitTheme.muted,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.016),
            letterSpacing: "0.02em",
          }}
        >
          Crafted with Remotion
        </p>
      </div>
    </AbsoluteFill>
  );
}
