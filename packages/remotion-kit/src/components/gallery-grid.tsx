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
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

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

export default function GalleryGrid() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cells = [
    {
      gradient: `linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`,
      sun: kitTheme.paper,
      hill: kitTheme.gray[400],
      glow: "rgba(12, 16, 13, 0.12)",
      delay: 0,
    },
    {
      gradient: `linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[200]} 100%)`,
      sun: kitTheme.green[600],
      hill: kitTheme.green[500],
      glow: "rgba(28, 174, 88, 0.25)",
      delay: 4,
    },
    {
      gradient: `linear-gradient(135deg, ${kitTheme.gray[100]} 0%, ${kitTheme.gray[200]} 100%)`,
      sun: kitTheme.green[500],
      hill: kitTheme.gray[400],
      glow: "rgba(28, 174, 88, 0.20)",
      delay: 8,
    },
    {
      gradient: `linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`,
      sun: kitTheme.paper,
      hill: kitTheme.gray[400],
      glow: "rgba(12, 16, 13, 0.12)",
      delay: 12,
    },
    {
      gradient: `linear-gradient(135deg, ${kitTheme.green[50]} 0%, ${kitTheme.green[100]} 100%)`,
      sun: kitTheme.green[500],
      hill: kitTheme.green[400],
      glow: "rgba(28, 174, 88, 0.22)",
      delay: 16,
    },
    {
      gradient: `linear-gradient(135deg, ${kitTheme.gray[100]} 0%, ${kitTheme.gray[300]} 100%)`,
      sun: kitTheme.paper,
      hill: kitTheme.gray[400],
      glow: "rgba(12, 16, 13, 0.14)",
      delay: 20,
    },
  ];

  const gap = Math.round(Math.min(width, height) * 0.022);
  const pad = Math.round(Math.min(width, height) * 0.05);
  const caption = Math.round(width * 0.0115);

  return (
    <AbsoluteFill
      style={{
        background: kitGradient.paper,
        padding: pad,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap,
        }}
      >
        {cells.map((cell, i) => {
          const s = spring({
            frame: Math.max(frame - cell.delay, 0),
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const scale = 0.8 + s * 0.2;

          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                borderRadius: kitRadius.md,
                background: kitTheme.paper,
                border: `1px solid ${kitTheme.line}`,
                boxShadow: kitShadow.md,
                overflow: "hidden",
                transform: `scale(${scale})`,
                opacity: s,
              }}
            >
              <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
                <PhotoSurface
                  gradient={cell.gradient}
                  sun={cell.sun}
                  hill={cell.hill}
                  glow={cell.glow}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: `${Math.round(caption * 0.7)}px ${Math.round(caption * 1.2)}px`,
                  borderTop: `1px solid ${kitTheme.line}`,
                  background: kitTheme.paper,
                }}
              >
                <span
                  style={{
                    fontFamily: kitFont.mono,
                    fontSize: caption,
                    letterSpacing: "0.14em",
                    color: kitTheme.muted,
                  }}
                >
                  Photo {i + 1}
                </span>
                <span
                  style={{
                    fontFamily: kitFont.mono,
                    fontSize: caption,
                    color: kitTheme.faint,
                  }}
                >
                  0{i + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
