/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * green monogram mark, high-contrast type, frame-derived 3D spin reveal.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function LogoSpinReveal() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Mark 3D rotation using spring
  const spinProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 60, mass: 1 },
  });

  const rotateY = 90 * (1 - spinProgress);
  const logoOpacity = spinProgress;

  // Wordmark slides up after the mark settles
  const textProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.6 },
  });

  const textOpacity = textProgress;
  const textTranslateY = 30 * (1 - textProgress);

  const markSize = Math.round(width * 0.14);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
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
            color: kitTheme.green[400],
            fontWeight: 600,
          }}
        >
          SPIN REVEAL
        </span>
      </div>
      <div
        style={{
          perspective: "1000px",
        }}
      >
        <div
          style={{
            width: markSize,
            height: markSize,
            borderRadius: kitRadius.full,
            background: kitGradient.green,
            boxShadow: `0 0 40px rgba(21, 137, 67, 0.4)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotateY(${rotateY}deg)`,
            opacity: logoOpacity,
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
            color: "#ffffff",
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.052),
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          Company Name
        </h2>
        <p
          style={{
            margin: `${Math.round(height * 0.012)}px 0 0`,
            color: kitTheme.darkMuted,
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.016),
            letterSpacing: "0.02em",
          }}
        >
          Spinning up something new
        </p>
      </div>
    </AbsoluteFill>
  );
}
