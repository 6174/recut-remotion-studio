"use client";

import { useCurrentFrame, spring, useVideoConfig } from "remotion";

export default function GalleryGrid() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cells = [
    { gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", delay: 0 },
    { gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", delay: 4 },
    { gradient: "linear-gradient(135deg, #4361ee, #3b82f6)", delay: 8 },
    { gradient: "linear-gradient(135deg, #7209b7, #a855f7)", delay: 12 },
    { gradient: "linear-gradient(135deg, #1d4ed8, #4361ee)", delay: 16 },
    { gradient: "linear-gradient(135deg, #7c3aed, #7209b7)", delay: 20 },
  ];

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
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "1rem",
          width: "90%",
          height: "80%",
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
                background: cell.gradient,
                borderRadius: "10px",
                transform: `scale(${scale})`,
                opacity: s,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
