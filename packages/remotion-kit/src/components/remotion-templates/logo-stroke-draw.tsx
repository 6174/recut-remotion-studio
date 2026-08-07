"use client";

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export default function LogoStrokeDraw() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hexagon perimeter approx: 6 * side length. Side = 50, perimeter ~ 300
  const hexPerimeter = 300;
  // Triangle perimeter approx: 3 * side. Side ~ 50, perimeter ~ 150
  const triPerimeter = 150;

  const hexOffset = interpolate(frame, [0, fps * 1.2], [hexPerimeter, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const triOffset = interpolate(frame, [fps * 0.4, fps * 1.6], [triPerimeter, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fill fades in after outlines are drawn
  const fillOpacity = interpolate(frame, [fps * 1.6, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Company name fade in
  const nameOpacity = interpolate(frame, [fps * 2.0, fps * 2.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hexagon points (centered at 60,60, radius 50)
  const hexPoints = "60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35";
  // Inner triangle (centered at 60,60, radius 30)
  const triPoints = "60,30 85.98,75 34.02,75";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111827",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="logoFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4361ee" />
            <stop offset="100%" stopColor="#7209b7" />
          </linearGradient>
        </defs>
        {/* Hexagon fill */}
        <polygon
          points={hexPoints}
          fill="url(#logoFillGrad)"
          opacity={fillOpacity * 0.3}
        />
        {/* Hexagon stroke */}
        <polygon
          points={hexPoints}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeDasharray={hexPerimeter}
          strokeDashoffset={hexOffset}
          strokeLinejoin="round"
        />
        {/* Triangle fill */}
        <polygon
          points={triPoints}
          fill="url(#logoFillGrad)"
          opacity={fillOpacity}
        />
        {/* Triangle stroke */}
        <polygon
          points={triPoints}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeDasharray={triPerimeter}
          strokeDashoffset={triOffset}
          strokeLinejoin="round"
        />
      </svg>
      <p
        style={{
          color: "white",
          fontSize: "1.8rem",
          fontWeight: "bold",
          fontFamily: "Inter, sans-serif",
          marginTop: "1.5rem",
          opacity: nameOpacity,
        }}
      >
        Company Name
      </p>
    </div>
  );
}
