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

export default function AnimatedList() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Sample list items
  const items = [
    { name: "Script", tag: "Write the draft" },
    { name: "Render", tag: "Encode the cut" },
    { name: "Ship", tag: "Publish to the world" },
  ];

  const rowSize = Math.round(Math.min(width * 0.07, height * 0.13));
  const rowGap = Math.round(height * 0.035);

  return (
    <AbsoluteFill style={{ background: kitGradient.paper, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: height * 0.12, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[600], fontWeight: 600 }}>
          STAGGERED ENTRANCE
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(78%, 1100px)",
        }}
      >
        {items.map((item, i) => {
          const delay = i * 5;

          const slideX = spring({
            frame: frame - delay,
            fps,
            from: -80,
            to: 0,
            config: { damping: 12, mass: 0.5 },
          });
          const opacity = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 12, mass: 0.5 },
          });
          const scale = spring({
            frame: frame - delay,
            fps,
            from: 0.9,
            to: 1,
            config: { damping: 12, mass: 0.5 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.round(width * 0.02),
                marginBottom: rowGap,
                padding: Math.round(width * 0.018),
                background: kitTheme.paper,
                border: `1px solid ${kitTheme.line}`,
                borderRadius: kitRadius.md,
                boxShadow: kitShadow.md,
                transform: `translateX(${slideX}px) scale(${scale})`,
                opacity,
              }}
            >
              <div
                style={{
                  width: rowSize,
                  height: rowSize,
                  borderRadius: kitRadius.sm,
                  background: i === 1 ? kitGradient.green : kitTheme.paperDeep,
                  border: i === 1 ? "none" : `1px solid ${kitTheme.lineStrong}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: kitFont.mono,
                    fontSize: Math.round(rowSize * 0.32),
                    fontWeight: 700,
                    color: i === 1 ? "#ffffff" : kitTheme.green[600],
                  }}
                >
                  {i + 1}
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: kitFont.sans,
                    fontSize: Math.round(width * 0.03),
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: kitTheme.ink,
                    lineHeight: 1,
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontFamily: kitFont.sans,
                    fontSize: Math.round(width * 0.016),
                    fontWeight: 500,
                    color: kitTheme.faint,
                    marginTop: Math.round(height * 0.006),
                  }}
                >
                  {item.tag}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
