"use client";

import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export default function PhotoStack() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const photos = [
    { label: "Photo 1", rotation: -5, gradient: "linear-gradient(135deg, #1d4ed8, #3b82f6)", delay: 0 },
    { label: "Photo 2", rotation: 0, gradient: "linear-gradient(135deg, #7c3aed, #a855f7)", delay: 8 },
    { label: "Photo 3", rotation: 5, gradient: "linear-gradient(135deg, #059669, #34d399)", delay: 16 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {photos.map((photo, i) => {
        const appear = spring({
          frame: frame - photo.delay,
          fps,
          config: { damping: 12, stiffness: 100 },
        });

        const scale = appear;
        const opacity = appear;
        const offsetX = (i - 1) * 30;
        const offsetY = (i - 1) * -10;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "200px",
              height: "260px",
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${photo.rotation}deg) scale(${scale})`,
              opacity,
              borderRadius: "8px",
              border: "6px solid white",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: photo.gradient,
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                marginBottom: "0.75rem",
              }}
            />
            <span
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {photo.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
