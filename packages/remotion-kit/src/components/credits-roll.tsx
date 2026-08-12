/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * mono role labels, white names, green accents.
 */

"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function CreditsRoll() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const credits = [
    { role: "Director", name: "Jane Smith" },
    { role: "Producer", name: "John Doe" },
    { role: "Cinematographer", name: "Emily Chen" },
    { role: "Editor", name: "Michael Park" },
    { role: "Sound Design", name: "Sarah Johnson" },
    { role: "Music", name: "David Kim" },
    { role: "Visual Effects", name: "Lisa Wang" },
    { role: "Colorist", name: "James Brown" },
  ];

  const scrollSpeed = height * 0.0022;
  const translateY = height - frame * scrollSpeed;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(140% 100% at 50% 0%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 70%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Math.round(height * 0.1),
          background: `linear-gradient(to bottom, ${kitTheme.dark}, transparent)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: Math.round(height * 0.1),
          background: `linear-gradient(to top, ${kitTheme.dark}, transparent)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: Math.round(height * 0.06),
          transform: `translateY(${translateY}px)`,
          paddingTop: Math.round(height * 0.05),
        }}
      >
        {credits.map((credit, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                marginBottom: Math.round(height * 0.008),
                color: kitTheme.green[400],
                fontFamily: kitFont.mono,
                fontSize: Math.round(width * 0.013),
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              {credit.role}
            </p>
            <p
              style={{
                margin: 0,
                color: "#ffffff",
                fontFamily: kitFont.sans,
                fontSize: Math.round(width * 0.026),
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {credit.name}
            </p>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
