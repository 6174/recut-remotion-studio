"use client";

import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";

export default function ImageComparisonSlider() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const duration = fps * 3;
  const dividerPercent = interpolate(frame, [10, duration], [5, 95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          width: "85%",
          height: "75%",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* After (full background) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #4361ee, #7209b7, #a855f7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              opacity: 0.8,
            }}
          >
            After
          </span>
        </div>
        {/* Before (clipped) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 ${100 - dividerPercent}% 0 0)`,
            background: "linear-gradient(135deg, #1e293b, #374151, #4b5563)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#9ca3af",
              fontSize: "1.5rem",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Before
          </span>
        </div>
        {/* Divider */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${dividerPercent}%`,
            width: "3px",
            backgroundColor: "white",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "3px solid #3b82f6",
            }}
          />
        </div>
      </div>
    </div>
  );
}
