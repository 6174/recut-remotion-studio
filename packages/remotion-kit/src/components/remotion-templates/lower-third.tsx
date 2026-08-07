/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 */

"use client";

import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export default function LowerThird() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentSlide = spring({
    frame,
    fps,
    from: -300,
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
    from: -400,
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
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #111827 0%, #1f2937 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: 40,
        }}
      >
        <div
          style={{
            width: 200,
            height: 3,
            background: "linear-gradient(90deg, #3b82f6, #4361ee)",
            transform: `translateX(${accentSlide}px)`,
            borderRadius: 2,
            marginBottom: 4,
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
              width: 4,
              background: "#3b82f6",
              borderRadius: "2px 0 0 2px",
            }}
          />
          <div
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              padding: "16px 32px",
              borderRadius: "0 4px 4px 0",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: "1.6rem",
                fontWeight: "bold",
                opacity: textOpacity,
                letterSpacing: "0.02em",
              }}
            >
              John Smith
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "1rem",
                fontWeight: 300,
                opacity: textOpacity,
                marginTop: 4,
                letterSpacing: "0.05em",
              }}
            >
              Senior Producer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
