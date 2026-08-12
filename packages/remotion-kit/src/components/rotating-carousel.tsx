/** Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function RotatingCarousel() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cards = ["Feature 1", "Feature 2", "Feature 3", "Feature 4"];
  const rotationSpeed = 0.015;
  const angle = frame * rotationSpeed;

  const cardWidth = Math.round(width * 0.16);
  const cardHeight = Math.round(cardWidth * 1.25);
  const radius = Math.round(cardWidth * 1.4);

  return (
    <AbsoluteFill style={{ background: kitGradient.dark, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: Math.round(height * 0.08), left: Math.round(width * 0.06) }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[400], fontWeight: 600 }}>
          CAROUSEL
        </span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.012), fontFamily: kitFont.sans, fontSize: Math.round(width * 0.05), fontWeight: 900, letterSpacing: "-0.03em", color: "#ffffff" }}>
          Our Features
        </h2>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "56%", width: radius * 2, height: radius * 2, transform: "translate(-50%, -50%)" }}>
        {cards.map((label, i) => {
          const cardAngle = angle + (i * Math.PI * 2) / cards.length;
          const x = Math.sin(cardAngle) * radius;
          const z = Math.cos(cardAngle);
          const normalizedZ = (z + 1) / 2;
          const cardScale = interpolate(normalizedZ, [0, 1], [0.6, 1]);
          const cardOpacity = interpolate(normalizedZ, [0, 1], [0.25, 1]);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateX(${x}px) scale(${cardScale})`,
                opacity: cardOpacity,
                zIndex: Math.round(normalizedZ * 100),
                width: cardWidth,
                height: cardHeight,
                borderRadius: kitRadius.md,
                background: kitTheme.darkRaised,
                border: `1px solid ${kitTheme.darkLine}`,
                boxShadow: kitShadow.md,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: Math.round(height * 0.02),
                padding: Math.round(width * 0.02),
              }}
            >
              <div
                style={{
                  width: Math.round(cardWidth * 0.3),
                  height: Math.round(cardWidth * 0.3),
                  borderRadius: kitRadius.sm,
                  background: kitGradient.green,
                }}
              />
              <span style={{ color: "#ffffff", fontSize: Math.round(width * 0.017), fontWeight: 700, fontFamily: kitFont.sans, letterSpacing: "-0.01em" }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
