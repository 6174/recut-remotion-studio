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

import { random, useCurrentFrame, useVideoConfig } from "remotion";

export default function PixelTransition() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Pixel size
  const pixelSize = 20;

  // Calculate grid dimensions
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);

  // Create pixel grid
  const pixels = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Use random seed based on position for consistent randomness
      const seed = x * 1000 + y;

      // Random frame delay for each pixel
      const delay = Math.floor(random(seed) * 60);

      // Determine if pixel should be visible based on frame
      const isVisible = frame > delay;

      // Random color for each pixel
      const hue = Math.floor(random(seed * 2) * 220) + 200;
      const saturation = 70 + Math.floor(random(seed * 3) * 30);
      const lightness = 40 + Math.floor(random(seed * 4) * 20);

      if (isVisible) {
        pixels.push({
          x: x * pixelSize,
          y: y * pixelSize,
          color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        });
      }
    }
  }

  return (
    <div
      style={{
        width,
        height,
        background: "#0f172a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {pixels.map((pixel, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pixel.x,
            top: pixel.y,
            width: pixelSize,
            height: pixelSize,
            backgroundColor: pixel.color,
            transition: "opacity 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}
