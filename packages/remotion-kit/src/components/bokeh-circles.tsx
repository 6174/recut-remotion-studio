/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * soft white + green bokeh circles, frame-derived drift and pulse.
 */

"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";
import { kitTheme } from "./helpers/theme";

export default function BokehCircles() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const t = frame / fps;

  const circles = Array.from({ length: 15 }, (_, i) => {
    // Fixed positions spread across the canvas
    const baseX = ((i * 173 + 53) % 100) / 100;
    const baseY = ((i * 241 + 97) % 100) / 100;

    // Slow drift using sin waves at different phases
    const driftX = Math.sin(t * 0.2 + i * 1.3) * 30;
    const driftY = Math.cos(t * 0.15 + i * 0.9) * 25;

    const x = baseX * width + driftX;
    const y = baseY * height + driftY;

    // Pulsing size, scaled to the canvas
    const baseSize = Math.round(width * 0.045) + ((i * 37 + 11) % Math.max(20, Math.round(width * 0.05)));
    const pulse = Math.sin(t * 0.4 + i * 0.7) * 0.2 + 1;
    const size = baseSize * pulse;

    // Varying opacity between 0.1-0.3
    const opacity = 0.1 + ((i * 19 + 7) % 20) / 100;

    // Alternate between soft white and green-tinted bokeh
    const isGreen = i % 3 === 1;
    const rgb = isGreen ? [60, 192, 106] : [255, 255, 255];

    return { x, y, size, opacity, rgb, key: i };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {circles.map((circle) => (
        <div
          key={circle.key}
          style={{
            position: "absolute",
            left: circle.x,
            top: circle.y,
            width: circle.size,
            height: circle.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${circle.rgb[0]}, ${circle.rgb[1]}, ${circle.rgb[2]}, ${circle.opacity + 0.1}) 0%, rgba(${circle.rgb[0]}, ${circle.rgb[1]}, ${circle.rgb[2]}, 0) 100%)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
