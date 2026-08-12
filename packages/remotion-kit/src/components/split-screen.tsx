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

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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

export default function SplitScreen() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Left panel slides in from left
  const leftSlide = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Right panel slides in from right with slight delay
  const rightSlide = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const leftTranslateX = interpolate(leftSlide, [0, 1], [-100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightTranslateX = interpolate(rightSlide, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider fades in after panels meet
  const dividerOpacity = interpolate(frame, [fps * 0.6, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pad = Math.round(Math.min(width, height) * 0.05);
  const gap = Math.round(width * 0.02);
  const heading = Math.round(width * 0.038);
  const sub = Math.round(width * 0.014);
  const caption = Math.round(width * 0.011);

  const photoA = {
    gradient: `linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`,
    sun: kitTheme.paper,
    hill: kitTheme.gray[400],
    glow: "rgba(12, 16, 13, 0.12)",
  };
  const photoB = {
    gradient: `linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[300]} 100%)`,
    sun: kitTheme.green[600],
    hill: kitTheme.green[500],
    glow: "rgba(28, 174, 88, 0.28)",
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          position: "relative",
          width: "50%",
          height: "100%",
          transform: `translateX(${leftTranslateX}%)`,
          padding: pad,
          paddingRight: Math.round(gap / 2),
          display: "flex",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: kitRadius.lg,
            background: kitTheme.paper,
            border: `1px solid ${kitTheme.line}`,
            boxShadow: kitShadow.md,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: `${Math.round(pad * 0.6)}px ${Math.round(pad * 0.8)}px`,
              borderBottom: `1px solid ${kitTheme.line}`,
            }}
          >
            <span
              style={{
                fontFamily: kitFont.mono,
                fontSize: caption,
                letterSpacing: "0.3em",
                fontWeight: 600,
                color: kitTheme.green[600],
              }}
            >
              PANEL A
            </span>
            <h2
              style={{
                margin: 0,
                marginTop: Math.round(sub * 0.4),
                fontFamily: kitFont.sans,
                fontSize: heading,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: kitTheme.ink,
              }}
            >
              Left Side
            </h2>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
            <PhotoSurface
              gradient={photoA.gradient}
              sun={photoA.sun}
              hill={photoA.hill}
              glow={photoA.glow}
            />
          </div>
          <div
            style={{
              padding: `${Math.round(pad * 0.5)}px ${Math.round(pad * 0.8)}px`,
              borderTop: `1px solid ${kitTheme.line}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: kitFont.sans,
                fontSize: sub,
                fontWeight: 500,
                color: kitTheme.muted,
              }}
            >
              Slides in from the left edge
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          position: "relative",
          width: "50%",
          height: "100%",
          transform: `translateX(${rightTranslateX}%)`,
          padding: pad,
          paddingLeft: Math.round(gap / 2),
          display: "flex",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: kitRadius.lg,
            background: kitTheme.paper,
            border: `1px solid ${kitTheme.line}`,
            boxShadow: kitShadow.md,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: `${Math.round(pad * 0.6)}px ${Math.round(pad * 0.8)}px`,
              borderBottom: `1px solid ${kitTheme.line}`,
            }}
          >
            <span
              style={{
                fontFamily: kitFont.mono,
                fontSize: caption,
                letterSpacing: "0.3em",
                fontWeight: 600,
                color: kitTheme.green[600],
              }}
            >
              PANEL B
            </span>
            <h2
              style={{
                margin: 0,
                marginTop: Math.round(sub * 0.4),
                fontFamily: kitFont.sans,
                fontSize: heading,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: kitTheme.ink,
              }}
            >
              Right Side
            </h2>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
            <PhotoSurface
              gradient={photoB.gradient}
              sun={photoB.sun}
              hill={photoB.hill}
              glow={photoB.glow}
            />
          </div>
          <div
            style={{
              padding: `${Math.round(pad * 0.5)}px ${Math.round(pad * 0.8)}px`,
              borderTop: `1px solid ${kitTheme.line}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: kitFont.sans,
                fontSize: sub,
                fontWeight: 500,
                color: kitTheme.muted,
              }}
            >
              Slides in from the right edge
            </p>
          </div>
        </div>
      </div>

      {/* Center divider */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          background: kitTheme.green[500],
          boxShadow: `0 0 12px ${kitTheme.green[300]}`,
          opacity: dividerOpacity,
        }}
      />
    </AbsoluteFill>
  );
}
