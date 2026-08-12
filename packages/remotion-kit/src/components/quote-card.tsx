/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): paper canvas,
 * white card, ink quote, green mark.
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function QuoteCard() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const quoteMarkOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const attributionOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const attributionX = interpolate(frame, [30, 45], [Math.round(width * 0.02), 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: Math.round(width * 0.04),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "min(82%, 1100px)",
          padding: `${Math.round(height * 0.06)}px ${Math.round(width * 0.05)}px`,
          background: kitTheme.paper,
          border: `1px solid ${kitTheme.line}`,
          borderRadius: kitRadius.lg,
          boxShadow: kitShadow.lg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: kitTheme.green[500],
            fontFamily: kitFont.sans,
            fontSize: Math.round(width * 0.1),
            fontWeight: 900,
            lineHeight: 1,
            opacity: quoteMarkOpacity,
            margin: 0,
          }}
        >
          {"\u201C"}
        </span>
        <p
          style={{
            margin: 0,
            color: kitTheme.ink,
            fontFamily: kitFont.sans,
            fontStyle: "italic",
            fontSize: Math.round(width * 0.032),
            fontWeight: 500,
            lineHeight: 1.5,
            textAlign: "center",
            maxWidth: "100%",
            opacity: textOpacity,
          }}
        >
          Design is not just what it looks like. Design is how it works.
        </p>
        <p
          style={{
            margin: 0,
            marginTop: Math.round(height * 0.03),
            color: kitTheme.faint,
            fontFamily: kitFont.mono,
            fontSize: Math.round(width * 0.014),
            fontWeight: 500,
            letterSpacing: "0.15em",
            opacity: attributionOpacity,
            transform: `translateX(${attributionX}px)`,
          }}
        >
          — Steve Jobs
        </p>
      </div>
    </AbsoluteFill>
  );
}
