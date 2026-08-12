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

export default function ImageCarousel() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const slides = [
    {
      label: "Mountain",
      gradient: `linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`,
      sun: kitTheme.paper,
      hill: kitTheme.gray[400],
      glow: "rgba(12, 16, 13, 0.12)",
    },
    {
      label: "Ocean",
      gradient: `linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[200]} 100%)`,
      sun: kitTheme.green[600],
      hill: kitTheme.green[500],
      glow: "rgba(28, 174, 88, 0.25)",
    },
    {
      label: "Forest",
      gradient: `linear-gradient(135deg, ${kitTheme.gray[100]} 0%, ${kitTheme.gray[200]} 100%)`,
      sun: kitTheme.green[500],
      hill: kitTheme.gray[400],
      glow: "rgba(28, 174, 88, 0.20)",
    },
  ];

  const slideW = Math.round(width * 0.2);
  const slideH = Math.round(slideW * 1.38);
  const gap = Math.round(slideW * 0.14);
  const caption = Math.round(width * 0.011);
  const cycleLength = fps * 2;
  const progress = (frame % (cycleLength * slides.length)) / cycleLength;
  const activeIndex = Math.round(progress) % slides.length;
  const left = width / 2 - slideW / 2;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: height * 0.12,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.01),
            letterSpacing: "0.5em",
            color: kitTheme.green[600],
            fontWeight: 600,
          }}
        >
          {slides[activeIndex].label.toUpperCase()} — LIVE
        </span>
      </div>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {slides.map((slide, i) => {
          const offset = i - progress;
          const translateX = offset * (slideW + gap);
          const scale = interpolate(
            Math.abs(offset),
            [0, 1, 2],
            [1, 0.78, 0.6],
            { extrapolateRight: "clamp" }
          );
          const opacity = interpolate(
            Math.abs(offset),
            [0, 1, 2],
            [1, 0.55, 0.25],
            { extrapolateRight: "clamp" }
          );
          const active = i === activeIndex;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left,
                top: "50%",
                marginTop: -slideH / 2,
                width: slideW,
                height: slideH,
                display: "flex",
                flexDirection: "column",
                borderRadius: kitRadius.md,
                background: kitTheme.paper,
                border: `1px solid ${active ? kitTheme.green[500] : kitTheme.line}`,
                boxShadow: active
                  ? `0 0 0 3px ${kitTheme.green[100]}, ${kitShadow.md}`
                  : kitShadow.sm,
                overflow: "hidden",
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex: active ? 10 : 1,
              }}
            >
              <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
                <PhotoSurface
                  gradient={slide.gradient}
                  sun={slide.sun}
                  hill={slide.hill}
                  glow={slide.glow}
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
                    color: active ? kitTheme.green[600] : kitTheme.muted,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {slide.label}
                </span>
                <span
                  style={{
                    fontFamily: kitFont.mono,
                    fontSize: caption,
                    color: kitTheme.faint,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
