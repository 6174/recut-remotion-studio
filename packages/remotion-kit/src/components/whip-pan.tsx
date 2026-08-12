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

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { kitFont, kitGradient, kitTheme } from "./helpers/theme";

export default function WhipPan() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const panStart = fps * 1;
  const panEnd = fps * 1.4;

  const translateA = interpolate(frame, [panStart, panEnd], [0, -100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateB = interpolate(frame, [panStart, panEnd], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Motion blur stretch effect during fast pan
  const stretchX = interpolate(
    frame,
    [panStart, (panStart + panEnd) / 2, panEnd],
    [1, 1.6, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleSize = Math.round(width * 0.05);
  const captionSize = Math.round(width * 0.013);

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
      {/* Scene A - Green */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.green[800]} 0%, ${kitTheme.dark} 64%)`,
          transform: `translateX(${translateA}%) scaleX(${stretchX})`,
        }}
      >
        <div
          style={{
            width: Math.round(width * 0.06),
            height: Math.round(width * 0.06),
            borderRadius: "50%",
            background: kitGradient.green,
            boxShadow: "0 0 40px rgba(28, 174, 88, 0.35)",
            marginBottom: Math.round(height * 0.018),
          }}
        />
        <h2
          style={{
            fontFamily: kitFont.sans,
            color: "#ffffff",
            fontSize: titleSize,
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-0.03em",
            textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          Scene A
        </h2>
        <p
          style={{
            fontFamily: kitFont.sans,
            color: kitTheme.darkMuted,
            fontSize: captionSize,
            marginTop: Math.round(height * 0.012),
          }}
        >
          Green content
        </p>
      </div>

      {/* Scene B - Dark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(120% 90% at 50% 36%, ${kitTheme.darkRaised} 0%, ${kitTheme.dark} 64%)`,
          transform: `translateX(${translateB}%) scaleX(${stretchX})`,
        }}
      >
        <div
          style={{
            width: Math.round(width * 0.06),
            height: Math.round(width * 0.06),
            borderRadius: 12,
            background: kitTheme.darkSurface,
            border: `1px solid ${kitTheme.darkLine}`,
            boxShadow: "0 0 40px rgba(28, 174, 88, 0.18)",
            marginBottom: Math.round(height * 0.018),
          }}
        />
        <h2
          style={{
            fontFamily: kitFont.sans,
            color: "#ffffff",
            fontSize: titleSize,
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-0.03em",
            textShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          Scene B
        </h2>
        <p
          style={{
            fontFamily: kitFont.sans,
            color: kitTheme.darkMuted,
            fontSize: captionSize,
            marginTop: Math.round(height * 0.012),
          }}
        >
          Dark content
        </p>
      </div>
    </div>
  );
}
