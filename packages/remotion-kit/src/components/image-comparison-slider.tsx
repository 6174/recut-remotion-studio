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

export default function ImageComparisonSlider() {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const duration = fps * 3;
  const dividerPercent = interpolate(frame, [10, duration], [5, 95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boxW = Math.round(width * 0.82);
  const boxH = Math.round(boxW * 0.6);
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
          position: "relative",
          width: boxW,
          height: boxH,
          borderRadius: kitRadius.md,
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          boxShadow: kitShadow.lg,
          overflow: "hidden",
        }}
      >
        {/* After (full background) */}
        <div style={{ position: "absolute", inset: 0 }}>
          <PhotoSurface
            gradient={`linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[300]} 100%)`}
            sun={kitTheme.green[600]}
            hill={kitTheme.green[500]}
            glow="rgba(28, 174, 88, 0.28)"
          />
          <div
            style={{
              position: "absolute",
              top: Math.round(chip * 1.4),
              right: Math.round(chip * 1.4),
              padding: `${Math.round(chip * 0.8)}px ${Math.round(chip * 1.6)}px`,
              borderRadius: kitRadius.full,
              background: kitTheme.green[500],
              fontFamily: kitFont.mono,
              fontSize: chip,
              letterSpacing: "0.22em",
              fontWeight: 600,
              color: kitTheme.paper,
            }}
          >
            AFTER
          </div>
        </div>

        {/* Before (clipped) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 ${100 - dividerPercent}% 0 0)`,
          }}
        >
          <PhotoSurface
            gradient={`linear-gradient(135deg, ${kitTheme.gray[100]} 0%, ${kitTheme.gray[300]} 100%)`}
            sun={kitTheme.paper}
            hill={kitTheme.gray[400]}
            glow="rgba(12, 16, 13, 0.14)"
          />
          <div
            style={{
              position: "absolute",
              top: Math.round(chip * 1.4),
              left: Math.round(chip * 1.4),
              padding: `${Math.round(chip * 0.8)}px ${Math.round(chip * 1.6)}px`,
              borderRadius: kitRadius.full,
              background: kitTheme.paper,
              border: `1px solid ${kitTheme.lineStrong}`,
              fontFamily: kitFont.mono,
              fontSize: chip,
              letterSpacing: "0.22em",
              fontWeight: 600,
              color: kitTheme.muted,
            }}
          >
            BEFORE
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${dividerPercent}%`,
            width: 2,
            backgroundColor: kitTheme.ink,
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: Math.round(chip * 3.2),
              height: Math.round(chip * 3.2),
              borderRadius: "50%",
              backgroundColor: kitTheme.paper,
              border: `3px solid ${kitTheme.green[500]}`,
              boxShadow: kitShadow.md,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}
