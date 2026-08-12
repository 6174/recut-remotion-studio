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

export default function ClockWipe() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const totalFrames = fps * 2.5;

  const angle = interpolate(frame, [0, totalFrames], [0, 360], {
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
      {/* Scene B (underneath) - light paper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: kitGradient.paper,
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
        <span style={{ marginTop: Math.round(height * 0.018), fontFamily: kitFont.mono, fontSize: eyebrow, letterSpacing: "0.4em", fontWeight: 600, color: kitTheme.green[600] }}>CLOCK WIPE</span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.014), fontFamily: kitFont.sans, fontSize: heading, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: kitTheme.ink }}>Scene B</h2>
        <p style={{ margin: 0, marginTop: Math.round(height * 0.016), fontFamily: kitFont.mono, fontSize: caption, color: kitTheme.muted }}>Revealed on the final stroke.</p>
      </div>

      {/* Scene A (on top, wiped away) - dark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
          clipPath: `polygon(50% 50%, 50% 0%, ${angle <= 90 ? `${50 + 50 * Math.tan((angle * Math.PI) / 180)}% 0%` : "100% 0%"}${angle > 90 ? `, 100% ${angle <= 180 ? `${50 * Math.tan(((angle - 90) * Math.PI) / 180)}%` : "100%"}` : ""}${angle > 180 ? `, ${100 - 50 * Math.tan(((angle - 180) * Math.PI) / 180)}% 100%` : ""}${angle > 270 ? `, 0% ${100 - 50 * Math.tan(((angle - 270) * Math.PI) / 180)}%` : ""}${angle >= 360 ? ", 0% 0%, 50% 0%" : ""})`,
          opacity: angle >= 360 ? 0 : 1,
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
        <span style={{ marginTop: Math.round(height * 0.018), fontFamily: kitFont.mono, fontSize: eyebrow, letterSpacing: "0.4em", fontWeight: 600, color: kitTheme.green[400] }}>CLOCK WIPE</span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.014), fontFamily: kitFont.sans, fontSize: heading, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: "#ffffff" }}>Scene A</h2>
        <p style={{ margin: 0, marginTop: Math.round(height * 0.016), fontFamily: kitFont.mono, fontSize: caption, color: kitTheme.darkMuted }}>The sweep clears the frame.</p>
      </div>
    </div>
  );
}
