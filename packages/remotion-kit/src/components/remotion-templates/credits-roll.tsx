"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";

export default function CreditsRoll() {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const credits = [
    { role: "Director", name: "Jane Smith" },
    { role: "Producer", name: "John Doe" },
    { role: "Cinematographer", name: "Emily Chen" },
    { role: "Editor", name: "Michael Park" },
    { role: "Sound Design", name: "Sarah Johnson" },
    { role: "Music", name: "David Kim" },
    { role: "Visual Effects", name: "Lisa Wang" },
    { role: "Colorist", name: "James Brown" },
  ];

  const scrollSpeed = 1.5;
  const translateY = height - frame * scrollSpeed;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(to bottom, #111827, transparent)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(to top, #111827, transparent)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
          transform: `translateY(${translateY}px)`,
          paddingTop: "2rem",
        }}
      >
        {credits.map((credit, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#3b82f6",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
                marginBottom: "0.4rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {credit.role}
            </p>
            <p
              style={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: 600,
                margin: 0,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {credit.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
