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

export default function FadeThroughBlack() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const totalFrames = fps * 3;
  const midpoint = totalFrames / 2;

  // Scene 1 fades out in the first half
  const scene1Opacity = interpolate(frame, [0, midpoint], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 2 fades in during the second half
  const scene2Opacity = interpolate(frame, [midpoint, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dark overlay peaks at midpoint
  const darkOpacity = interpolate(
    frame,
    [0, midpoint * 0.7, midpoint, midpoint * 1.3, totalFrames],
    [0, 0.8, 1, 0.8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

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
      {/* Scene 1 - light paper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: kitGradient.paper,
          opacity: scene1Opacity,
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
        <span style={{ marginTop: Math.round(height * 0.018), fontFamily: kitFont.mono, fontSize: eyebrow, letterSpacing: "0.4em", fontWeight: 600, color: kitTheme.green[600] }}>DIP TO BLACK</span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.014), fontFamily: kitFont.sans, fontSize: heading, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: kitTheme.ink }}>Scene A</h2>
        <p style={{ margin: 0, marginTop: Math.round(height * 0.016), fontFamily: kitFont.mono, fontSize: caption, color: kitTheme.muted }}>The frame drops to ink...</p>
      </div>

      {/* Scene 2 - dark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
          opacity: scene2Opacity,
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
        <span style={{ marginTop: Math.round(height * 0.018), fontFamily: kitFont.mono, fontSize: eyebrow, letterSpacing: "0.4em", fontWeight: 600, color: kitTheme.green[400] }}>DIP TO BLACK</span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.014), fontFamily: kitFont.sans, fontSize: heading, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: "#ffffff" }}>Scene B</h2>
        <p style={{ margin: 0, marginTop: Math.round(height * 0.016), fontFamily: kitFont.mono, fontSize: caption, color: kitTheme.darkMuted }}>...and breathes back to life.</p>
      </div>

      {/* Dark overlay for the through-black transition */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: kitTheme.dark,
          opacity: darkOpacity,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
