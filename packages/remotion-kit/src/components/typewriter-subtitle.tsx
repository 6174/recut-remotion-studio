/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): dark stage,
 * terminal-style typewriter with a green block cursor (fully frame-derived).
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitTheme } from "./helpers/theme";

export default function TypewriterSubtitle() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const text = "I like typing...";
  const visibleCharacters = Math.floor(interpolate(frame, [0, 45], [0, text.length], { extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 66%)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: height * 0.13, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>TYPEWRITER</span>
      </div>
      <div style={{ textAlign: "center", padding: "0 8%" }}>
        <span
          style={{
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.04),
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#ffffff",
            textShadow: `0 ${Math.round(height * 0.004)}px ${Math.round(height * 0.016)}px rgba(0,0,0,0.4)`,
          }}
        >
          {text.slice(0, visibleCharacters)}
        </span>
        <span
          style={{
            display: "inline-block",
            marginLeft: Math.round(width * 0.006),
            width: Math.round(width * 0.006),
            height: Math.round(width * 0.028),
            verticalAlign: "middle",
            background: kitTheme.green[400],
            opacity: frame % 15 < 7 ? 1 : 0,
          }}
        />
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.013), color: kitTheme.darkMuted, letterSpacing: "0.3em" }}>TYPEWRITER · BLOCK CURSOR</span>
      </div>
    </AbsoluteFill>
  );
}
