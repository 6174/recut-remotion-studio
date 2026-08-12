/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * monochrome rotating shapes with a single green accent ring.
 */

"use client";

import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitGradient, kitTheme } from "./helpers/theme";

export default function GeometricPatterns() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const patterns = Array.from({ length: 20 }).map((_, i) => {
    const rotation = spring({
      frame: frame - i * 3,
      fps: 30,
      from: 0,
      to: 360,
      config: { damping: 100 },
    });

    const scale = spring({
      frame: frame - i * 3,
      fps: 30,
      from: 0.5,
      to: 1,
      config: { damping: 100 },
    });

    return { rotation, scale, index: i };
  });

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
      {patterns.map(({ rotation, scale, index }) => {
        const isAccent = index === patterns.length - 1;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "100%",
              height: "100%",
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
              borderRadius: `${index * 5}%`,
              ...(isAccent
                ? {
                    border: `2px solid ${kitTheme.green[400]}`,
                    boxShadow: "0 0 80px rgba(60, 192, 106, 0.35)",
                  }
                : {
                    border: "2px solid rgba(255,255,255,0.08)",
                  }),
            }}
          />
        );
      })}
    </div>
  );
}
