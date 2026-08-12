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

export default function MasonryGallery() {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const blocks = [
    {
      col: 0,
      flex: 5,
      gradient: `linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`,
      sun: kitTheme.paper,
      hill: kitTheme.gray[400],
      glow: "rgba(12, 16, 13, 0.12)",
      delay: 0,
    },
    {
      col: 0,
      flex: 5.5,
      gradient: `linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[200]} 100%)`,
      sun: kitTheme.green[600],
      hill: kitTheme.green[500],
      glow: "rgba(28, 174, 88, 0.25)",
      delay: 6,
    },
    {
      col: 1,
      flex: 6,
      gradient: `linear-gradient(135deg, ${kitTheme.gray[100]} 0%, ${kitTheme.gray[200]} 100%)`,
      sun: kitTheme.green[500],
      hill: kitTheme.gray[400],
      glow: "rgba(28, 174, 88, 0.20)",
      delay: 3,
    },
    {
      col: 1,
      flex: 4.5,
      gradient: `linear-gradient(135deg, ${kitTheme.green[50]} 0%, ${kitTheme.green[100]} 100%)`,
      sun: kitTheme.green[500],
      hill: kitTheme.green[400],
      glow: "rgba(28, 174, 88, 0.22)",
      delay: 9,
    },
    {
      col: 2,
      flex: 4.5,
      gradient: `linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`,
      sun: kitTheme.paper,
      hill: kitTheme.gray[400],
      glow: "rgba(12, 16, 13, 0.12)",
      delay: 5,
    },
    {
      col: 2,
      flex: 6,
      gradient: `linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[300]} 100%)`,
      sun: kitTheme.green[600],
      hill: kitTheme.green[500],
      glow: "rgba(28, 174, 88, 0.28)",
      delay: 11,
    },
  ];

  const columns: typeof blocks[] = [[], [], []];
  blocks.forEach((block) => columns[block.col].push(block));

  const gap = Math.round(width * 0.02);
  const pad = Math.round(width * 0.05);
  const caption = Math.round(width * 0.011);

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
          display: "flex",
          gap,
          width: "100%",
          height: "100%",
        }}
      >
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap,
              minHeight: 0,
            }}
          >
            {col.map((block, blockIdx) => {
              const s = spring({
                frame: Math.max(frame - block.delay, 0),
                fps,
                config: { damping: 12, stiffness: 100 },
              });
              const scale = 0.8 + s * 0.2;

              return (
                <div
                  key={blockIdx}
                  style={{
                    flex: block.flex,
                    minHeight: 0,
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
                  <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
                    <PhotoSurface
                      gradient={block.gradient}
                      sun={block.sun}
                      hill={block.hill}
                      glow={block.glow}
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
                      Photo {colIdx * 2 + blockIdx + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: kitFont.mono,
                        fontSize: caption,
                        color: kitTheme.faint,
                      }}
                    >
                      0{colIdx * 2 + blockIdx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
