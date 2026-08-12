/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

const PhotoSurface = ({
  gradient,
  sun,
  hill,
  glow,
}: {
  gradient: string;
  sun: string;
  hill: string;
  glow: string;
}) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: gradient }} />
    <div
      style={{
        position: "absolute",
        top: "16%",
        right: "15%",
        width: "18%",
        aspectRatio: "1",
        borderRadius: "50%",
        background: sun,
        boxShadow: `0 0 28px ${glow}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "34%",
        bottom: 0,
        background: hill,
        clipPath:
          "polygon(0 100%, 0 64%, 24% 38%, 42% 58%, 60% 32%, 82% 58%, 100% 40%, 100% 100%)",
        opacity: 0.55,
      }}
    />
  </div>
);

export default function ImageZoomReveal() {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const duration = fps * 2;

  const scale = interpolate(frame, [0, duration], [1.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blur = interpolate(frame, [0, duration], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [duration * 0.6, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardW = Math.round(width * 0.62);
  const cardH = Math.round(cardW * 0.72);
  const chip = Math.round(width * 0.011);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: cardW,
          borderRadius: kitRadius.lg,
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          boxShadow: kitShadow.lg,
          overflow: "hidden",
          padding: Math.round(cardW * 0.03),
        }}
      >
        <div
          style={{
            position: "relative",
            height: cardH,
            borderRadius: kitRadius.md,
            overflow: "hidden",
            background: kitTheme.paper,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${scale})`,
              filter: `blur(${blur}px)`,
              overflow: "hidden",
            }}
          >
            <PhotoSurface
              gradient={`linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[300]} 100%)`}
              sun={kitTheme.green[600]}
              hill={kitTheme.green[500]}
              glow="rgba(28, 174, 88, 0.28)"
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: Math.round(cardW * 0.03),
              bottom: Math.round(cardW * 0.03),
              padding: `${Math.round(chip * 0.8)}px ${Math.round(chip * 1.6)}px`,
              borderRadius: kitRadius.full,
              background: "rgba(255, 255, 255, 0.92)",
              border: `1px solid ${kitTheme.line}`,
              opacity: textOpacity,
            }}
          >
            <span
              style={{
                fontFamily: kitFont.mono,
                fontSize: chip,
                letterSpacing: "0.22em",
                fontWeight: 600,
                color: kitTheme.ink,
              }}
            >
              FEATURED IMAGE
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
