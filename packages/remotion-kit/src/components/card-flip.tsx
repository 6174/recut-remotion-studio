/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function CardFlip() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const rotation = spring({
    frame,
    fps,
    from: 0,
    to: 360,
    config: { damping: 15, mass: 0.5 },
  });

  const cardWidth = Math.round(width * 0.3);
  const cardHeight = Math.round(cardWidth * 1.4);
  const tileSize = Math.round(cardWidth * 0.28);

  return (
    <AbsoluteFill style={{ background: kitGradient.dark, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: height * 0.12, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>
          3D FLIP
        </span>
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", perspective: "1000px" }}>
        <div
          style={{
            width: cardWidth,
            height: cardHeight,
            transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              background: kitTheme.darkRaised,
              border: `1px solid ${kitTheme.darkLine}`,
              borderRadius: kitRadius.lg,
              boxShadow: kitShadow.lg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: Math.round(height * 0.02),
            }}
          >
            <div style={{ width: tileSize, height: tileSize, borderRadius: kitRadius.md, background: kitGradient.green }} />
            <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(cardWidth * 0.12), fontWeight: 900, letterSpacing: "-0.03em", color: "#ffffff" }}>
              Remotion
            </span>
            <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(cardWidth * 0.05), letterSpacing: "0.3em", color: kitTheme.darkMuted }}>
              FRONT
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              background: kitGradient.green,
              borderRadius: kitRadius.lg,
              boxShadow: kitShadow.lg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: Math.round(height * 0.02),
              transform: "rotateY(180deg)",
            }}
          >
            <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(cardWidth * 0.11), fontWeight: 900, letterSpacing: "-0.03em", color: "#ffffff" }}>
              Back
            </span>
            <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(cardWidth * 0.05), letterSpacing: "0.3em", color: "rgba(255, 255, 255, 0.85)" }}>
              KIT READY
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
