/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function ZoomThrough() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const midPoint = fps * 1.25;
  const totalFrames = fps * 2.5;

  // Scene A: scale 1→3, opacity 1→0
  const scaleA = interpolate(frame, [0, midPoint], [1, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityA = interpolate(frame, [0, midPoint], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene B: scale 3→1, opacity 0→1
  const scaleB = interpolate(frame, [midPoint, totalFrames], [3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityB = interpolate(frame, [midPoint, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tile = Math.round(width * 0.045);
  const glyph = Math.round(width * 0.024);
  const eyebrow = Math.round(width * 0.011);
  const heading = Math.round(width * 0.05);
  const caption = Math.round(width * 0.014);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: kitTheme.dark,
        overflow: "hidden",
      }}
    >
      {/* Scene A - dark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
          opacity: opacityA,
          transform: `scale(${scaleA})`,
        }}
      >
        <div
          style={{
            width: tile,
            height: tile,
            borderRadius: kitRadius.md,
            background: kitGradient.green,
            border: `1px solid ${kitTheme.green[300]}`,
            boxShadow: kitShadow.md,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: kitFont.sans, fontSize: glyph, fontWeight: 900, lineHeight: 1, color: "#ffffff" }}>R</span>
        </div>
        <span style={{ marginTop: Math.round(height * 0.018), fontFamily: kitFont.mono, fontSize: eyebrow, letterSpacing: "0.4em", fontWeight: 600, color: kitTheme.green[400] }}>ZOOM</span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.014), fontFamily: kitFont.sans, fontSize: heading, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: "#ffffff" }}>Scene A</h2>
        <p style={{ margin: 0, marginTop: Math.round(height * 0.016), fontFamily: kitFont.mono, fontSize: caption, color: kitTheme.darkMuted }}>Rushes toward the lens...</p>
      </div>

      {/* Scene B - light paper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: kitGradient.paper,
          opacity: opacityB,
          transform: `scale(${scaleB})`,
        }}
      >
        <div
          style={{
            width: tile,
            height: tile,
            borderRadius: kitRadius.md,
            background: kitTheme.paper,
            border: `1px solid ${kitTheme.line}`,
            boxShadow: kitShadow.md,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: kitFont.sans, fontSize: glyph, fontWeight: 900, lineHeight: 1, color: kitTheme.green[600] }}>R</span>
        </div>
        <span style={{ marginTop: Math.round(height * 0.018), fontFamily: kitFont.mono, fontSize: eyebrow, letterSpacing: "0.4em", fontWeight: 600, color: kitTheme.green[600] }}>ZOOM</span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.014), fontFamily: kitFont.sans, fontSize: heading, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: kitTheme.ink }}>Scene B</h2>
        <p style={{ margin: 0, marginTop: Math.round(height * 0.016), fontFamily: kitFont.mono, fontSize: caption, color: kitTheme.muted }}>...and lands in focus.</p>
      </div>
    </div>
  );
}
