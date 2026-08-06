"use client";

import { useCurrentFrame, spring, useVideoConfig } from "remotion";

export default function MasonryGallery() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blocks = [
    { col: 0, height: "45%", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", delay: 0 },
    { col: 0, height: "50%", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", delay: 6 },
    { col: 1, height: "55%", gradient: "linear-gradient(135deg, #4361ee, #3b82f6)", delay: 3 },
    { col: 1, height: "40%", gradient: "linear-gradient(135deg, #7209b7, #a855f7)", delay: 9 },
    { col: 2, height: "40%", gradient: "linear-gradient(135deg, #1d4ed8, #4361ee)", delay: 5 },
    { col: 2, height: "55%", gradient: "linear-gradient(135deg, #7c3aed, #7209b7)", delay: 11 },
  ];

  const columns: typeof blocks[] = [[], [], []];
  blocks.forEach((block) => columns[block.col].push(block));

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
          display: "flex",
          gap: "1rem",
          width: "90%",
          height: "85%",
        }}
      >
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
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
                    height: block.height,
                    background: block.gradient,
                    borderRadius: "10px",
                    transform: `scale(${scale})`,
                    opacity: s,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
