/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): white/gray
 * stars on a dark stage with green accent glints.
 */

"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";
import { kitTheme } from "./helpers/theme";

export default function Starfield() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;
  const totalStars = 80;

  // Generate stars with deterministic positions based on index
  const stars = Array.from({ length: totalStars }, (_, i) => {
    // Deterministic seed values using index
    const seedAngle = ((i * 137.508) % 360) * (Math.PI / 180);
    const seedRadius = ((i * 31 + 17) % 50) / 50; // 0 to 1
    const speed = 0.5 + ((i * 7 + 3) % 10) / 10; // 0.5 to 1.5
    const baseSize = Math.max(1.5, Math.round(width * 0.0015)) + ((i * 13 + 5) % 3);

    // Progress of this star outward (loops every ~5 seconds)
    const cycleLength = fps * 5;
    const rawProgress = ((frame * speed + i * 15) % cycleLength) / cycleLength;
    const progress = rawProgress;

    // Start near center, move outward
    const maxRadius = Math.max(cx, cy) * 1.2;
    const radius = seedRadius * 20 + progress * maxRadius;

    const x = cx + Math.cos(seedAngle) * radius;
    const y = cy + Math.sin(seedAngle) * radius;

    // Stars grow as they move outward (perspective)
    const scale = 1 + progress * 2;
    const size = baseSize * scale;

    // Fade in as they leave center, fade out at edges
    const opacity = Math.min(progress * 4, 1) * Math.max(1 - progress * 0.8, 0.2);

    // White/gray stars with the occasional green accent glint
    const isAccent = i % 7 === 3;
    const color = isAccent ? kitTheme.green[400] : i % 3 === 0 ? kitTheme.darkMuted : "#ffffff";

    return { x, y, size, opacity, color, key: i };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `radial-gradient(120% 90% at 50% 40%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 70%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {stars.map((star) => (
        <div
          key={star.key}
          style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: star.color,
            opacity: star.opacity,
            boxShadow:
              star.color === kitTheme.green[400]
                ? "0 0 8px rgba(60, 192, 106, 0.7)"
                : "0 0 4px rgba(255, 255, 255, 0.5)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
