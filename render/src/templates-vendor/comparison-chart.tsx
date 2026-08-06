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

import { interpolate, useCurrentFrame } from "remotion";

export default function ComparisonChart() {
  const frame = useCurrentFrame();

  const maxBarHeight = 280;

  // Before value animation
  const beforeValue = Math.round(
    interpolate(frame, [10, 40], [0, 34], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  const beforeBarHeight = interpolate(frame, [10, 40], [0, (34 / 100) * maxBarHeight], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // After value animation (starts slightly later)
  const afterValue = Math.round(
    interpolate(frame, [20, 50], [0, 89], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  const afterBarHeight = interpolate(frame, [20, 50], [0, (89 / 100) * maxBarHeight], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Divider line animation
  const dividerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const dividerHeight = interpolate(frame, [0, 20], [0, 350], {
    extrapolateRight: "clamp",
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
          width: "700px",
          height: "480px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          padding: "40px",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            letterSpacing: "-0.5px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Performance Comparison
        </div>

        {/* Comparison container */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            height: `${maxBarHeight + 80}px`,
            position: "relative",
          }}
        >
          {/* Before side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            {/* Value */}
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#ef4444",
                marginBottom: "15px",
              }}
            >
              {beforeValue}%
            </div>

            {/* Bar */}
            <div
              style={{
                width: "120px",
                height: `${beforeBarHeight}px`,
                backgroundColor: "#ef4444",
                borderRadius: "8px 8px 0 0",
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
              }}
            />

            {/* Label */}
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
                marginTop: "15px",
              }}
            >
              Before
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "2px",
              height: `${dividerHeight}px`,
              backgroundColor: "rgba(255,255,255,0.2)",
              opacity: dividerOpacity,
              alignSelf: "center",
              margin: "0 30px",
            }}
          />

          {/* After side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            {/* Value */}
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#4361ee",
                marginBottom: "15px",
              }}
            >
              {afterValue}%
            </div>

            {/* Bar */}
            <div
              style={{
                width: "120px",
                height: `${afterBarHeight}px`,
                backgroundColor: "#4361ee",
                borderRadius: "8px 8px 0 0",
                boxShadow: "0 0 20px rgba(67, 97, 238, 0.3)",
              }}
            />

            {/* Label */}
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
                marginTop: "15px",
              }}
            >
              After
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
