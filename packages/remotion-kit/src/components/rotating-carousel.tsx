/** Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 */

"use client";

import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";

export default function RotatingCarousel() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cards = ["Feature 1", "Feature 2", "Feature 3", "Feature 4"];
  const rotationSpeed = 0.015;
  const angle = frame * rotationSpeed;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #111827, #1f2937)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <h2
        style={{
          position: "absolute",
          top: "40px",
          color: "white",
          fontSize: "1.8rem",
          fontWeight: "bold",
          fontFamily: "Inter, sans-serif",
          margin: 0,
        }}
      >
        Our Features
      </h2>
      <div
        style={{
          position: "relative",
          width: "600px",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cards.map((label, i) => {
          const cardAngle = angle + (i * Math.PI * 2) / cards.length;
          const x = Math.sin(cardAngle) * 220;
          const z = Math.cos(cardAngle);
          const normalizedZ = (z + 1) / 2;
          const cardScale = interpolate(normalizedZ, [0, 1], [0.6, 1]);
          const cardOpacity = interpolate(normalizedZ, [0, 1], [0.3, 1]);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateX(${x}px) scale(${cardScale})`,
                opacity: cardOpacity,
                zIndex: Math.round(normalizedZ * 100),
                width: "180px",
                height: "220px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #1f2937, #374151)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6, #a855f7)",
                  marginBottom: "16px",
                }}
              />
              <span
                style={{
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
