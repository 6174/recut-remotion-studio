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

import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function PoppingText() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = "BINGO!".split("");

  const colors = [
    "#1e3a8a", // teal/aqua blue
    "#3b82f6", // dark blue-green
    "#A9D6E5", // light blue
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        textAlign: "center",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text.map((char, i) => {
        const delay = i * 7;
        const colorIndex = i % colors.length;

        // Simple scale and opacity animation
        const scale = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.4, damping: 8, stiffness: 100 },
        });

        const opacity = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.3, damping: 8, stiffness: 100 },
        });

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              color: colors[colorIndex],
              fontSize: "8rem",
              fontWeight: "900",
              margin: "0 0.1em",
              textShadow: `0 0 10px ${colors[colorIndex]}80,
                          -2px -2px 0 #fff, 
                          2px -2px 0 #fff, 
                          -2px 2px 0 #fff, 
                          2px 2px 0 #fff`,
              transform: `scale(${scale})`,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
}
