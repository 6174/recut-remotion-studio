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

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
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

export default function PictureInPicture() {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const pipScale = spring({
    frame: Math.max(frame - 15, 0),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const pad = Math.round(width * 0.025);
  const pipW = Math.round(width * 0.2);
  const pipH = Math.round(pipW * 0.62);
  const chip = Math.round(width * 0.011);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Main content */}
      <div
        style={{
          position: "absolute",
          inset: pad,
          borderRadius: kitRadius.lg,
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          boxShadow: kitShadow.md,
          overflow: "hidden",
        }}
      >
        <PhotoSurface
          gradient={`linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`}
          sun={kitTheme.paper}
          hill={kitTheme.gray[400]}
          glow="rgba(12, 16, 13, 0.12)"
        />
        <div
          style={{
            position: "absolute",
            left: Math.round(width * 0.025),
            bottom: Math.round(width * 0.025),
            padding: `${Math.round(chip * 0.8)}px ${Math.round(chip * 1.6)}px`,
            borderRadius: kitRadius.full,
            background: "rgba(255, 255, 255, 0.92)",
            border: `1px solid ${kitTheme.line}`,
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
            MAIN CONTENT
          </span>
        </div>
      </div>

      {/* Picture-in-picture */}
      <div
        style={{
          position: "absolute",
          right: pad,
          bottom: pad,
          width: pipW,
          height: pipH,
          borderRadius: kitRadius.md,
          background: kitTheme.paper,
          border: `2px solid ${kitTheme.green[500]}`,
          boxShadow: `0 0 0 4px ${kitTheme.green[100]}, ${kitShadow.lg}`,
          overflow: "hidden",
          transform: `scale(${pipScale})`,
          zIndex: 2,
        }}
      >
        <PhotoSurface
          gradient={`linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[300]} 100%)`}
          sun={kitTheme.green[600]}
          hill={kitTheme.green[500]}
          glow="rgba(28, 174, 88, 0.28)"
        />
        <div
          style={{
            position: "absolute",
            left: Math.round(pipW * 0.05),
            bottom: Math.round(pipW * 0.05),
            padding: `${Math.round(chip * 0.6)}px ${Math.round(chip * 1.2)}px`,
            borderRadius: kitRadius.full,
            background: "rgba(255, 255, 255, 0.92)",
            border: `1px solid ${kitTheme.line}`,
          }}
        >
          <span
            style={{
              fontFamily: kitFont.mono,
              fontSize: Math.round(chip * 0.85),
              letterSpacing: "0.22em",
              fontWeight: 600,
              color: kitTheme.green[700],
            }}
          >
            SPEAKER
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
