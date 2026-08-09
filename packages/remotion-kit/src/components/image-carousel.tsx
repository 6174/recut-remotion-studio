"use client";

import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";

export default function ImageCarousel() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slides = [
    { label: "Mountain", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
    { label: "Ocean", gradient: "linear-gradient(135deg, #4361ee, #7209b7)" },
    { label: "Forest", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)" },
  ];

  const cycleLength = fps * 2;
  const progress = (frame % (cycleLength * slides.length)) / cycleLength;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          position: "relative",
        }}
      >
        {slides.map((slide, i) => {
          const offset = i - progress;
          const translateX = offset * 280;
          const scale = interpolate(
            Math.abs(offset),
            [0, 1, 2],
            [1, 0.75, 0.55],
            { extrapolateRight: "clamp" }
          );
          const opacity = interpolate(
            Math.abs(offset),
            [0, 1, 2],
            [1, 0.5, 0.2],
            { extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "240px",
                height: "320px",
                background: slide.gradient,
                borderRadius: "12px",
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                padding: "1rem",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              >
                {slide.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
