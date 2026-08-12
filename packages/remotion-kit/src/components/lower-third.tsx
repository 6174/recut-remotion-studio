/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark scene,
 * green accent bar, raised name plate.
 */

"use client";

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function LowerThird() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const accentSlide = spring({
    frame,
    fps,
    from: -Math.round(width * 0.2),
    to: 0,
    durationInFrames: 25,
    config: {
      damping: 15,
      mass: 0.6,
    },
  });

  const barSlide = spring({
    frame: Math.max(0, frame - 5),
    fps,
    from: -Math.round(width * 0.28),
    to: 0,
    durationInFrames: 30,
    config: {
      damping: 14,
      mass: 0.7,
    },
  });

  const textOpacity = spring({
    frame: Math.max(0, frame - 15),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill
      style={{
        background: kitGradient.dark,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: Math.round(width * 0.04),
        }}
      >
        <div
          style={{
            width: Math.round(width * 0.14),
            height: Math.round(width * 0.005),
            background: kitGradient.green,
            transform: `translateX(${accentSlide}px)`,
            borderRadius: kitRadius.full,
            marginBottom: Math.round(height * 0.006),
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            transform: `translateX(${barSlide}px)`,
          }}
        >
          <div
            style={{
              width: Math.round(width * 0.006),
              background: kitTheme.green[500],
              borderTopLeftRadius: kitRadius.sm,
              borderBottomLeftRadius: kitRadius.sm,
            }}
          />
          <div
            style={{
              background: kitTheme.darkSurface,
              border: `1px solid ${kitTheme.darkLine}`,
              borderLeft: "none",
              padding: `${Math.round(height * 0.018)}px ${Math.round(width * 0.024)}px`,
              borderTopRightRadius: kitRadius.sm,
              borderBottomRightRadius: kitRadius.sm,
              boxShadow: kitShadow.md,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontFamily: kitFont.sans,
                fontSize: Math.round(width * 0.024),
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                opacity: textOpacity,
              }}
            >
              John Smith
            </div>
            <div
              style={{
                color: kitTheme.darkMuted,
                fontFamily: kitFont.mono,
                fontSize: Math.round(width * 0.012),
                fontWeight: 500,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginTop: Math.round(height * 0.006),
                opacity: textOpacity,
              }}
            >
              Senior Producer
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
