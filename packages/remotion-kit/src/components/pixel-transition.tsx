/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage
 * with deterministic green reveal tiles.
 */

"use client";

import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { kitGradient, kitTheme } from "./helpers/theme";

export default function PixelTransition() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Pixel size, scaled to the canvas
  const pixelSize = Math.max(10, Math.round(width * 0.01));

  // Calculate grid dimensions
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);

  // Green shades used across the reveal
  const greens = [kitTheme.green[300], kitTheme.green[400], kitTheme.green[500], kitTheme.green[600]];

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

      // Seeded green shade per tile
      const color = greens[Math.floor(random(seed * 2) * greens.length)];

      if (isVisible) {
        pixels.push({
          x: x * pixelSize,
          y: y * pixelSize,
          color,
          key: x * cols + y,
        });
      }
    }
  }

  return (
    <div
      style={{
        width,
        height,
        background: kitGradient.dark,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {pixels.map((pixel) => (
        <div
          key={pixel.key}
          style={{
            position: "absolute",
            left: pixel.x,
            top: pixel.y,
            width: pixelSize,
            height: pixelSize,
            backgroundColor: pixel.color,
          }}
        />
      ))}
    </div>
  );
}
