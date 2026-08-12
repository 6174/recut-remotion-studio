/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): green glyphs
 * raining down a dark stage.
 */

"use client";

import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient } from "./helpers/theme";

export default function MatrixRain() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  const cellWidth = Math.max(18, Math.round(width * 0.012));
  const columns = Math.floor(width / cellWidth);
  const drops = Array.from({ length: columns }).map((_, i) => ({
    x: i * cellWidth,
    y: random(i) * height,
    speed: random(i) * 5 + 5,
    char: characters[Math.floor(random(i) * characters.length)],
  }));

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
      {drops.map((drop, i) => {
        const y = (drop.y + frame * drop.speed) % height;
        const fade = 1 - (y / height) * 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: drop.x,
              top: y,
              color: `rgba(60, 192, 106, ${fade})`,
              fontSize: cellWidth,
              fontFamily: kitFont.mono,
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(60, 192, 106, 0.5)",
            }}
          >
            {characters[Math.floor((frame + i) / 5) % characters.length]}
          </div>
        );
      })}
    </div>
  );
}
