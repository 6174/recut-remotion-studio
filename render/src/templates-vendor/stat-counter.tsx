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

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export default function StatCounter() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance
  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Count up animation
  const count = Math.round(
    interpolate(frame, [10, 60], [0, 1247], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  const subStatsOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "linear-gradient(to bottom right, #111827, #1f2937)",
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          padding: "60px 80px",
          textAlign: "center",
          transform: `scale(${scaleSpring})`,
        }}
      >
        {/* Main number */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            letterSpacing: "-2px",
            lineHeight: "1",
          }}
        >
          {count.toLocaleString()}
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.7)",
            marginTop: "12px",
            fontWeight: "500",
            letterSpacing: "1px",
          }}
        >
          Total Users
        </div>

        {/* Sub stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginTop: "30px",
            opacity: subStatsOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                color: "#22c55e",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              ↑ 12.5%
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "18px",
                fontWeight: "400",
              }}
            >
              This Month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
