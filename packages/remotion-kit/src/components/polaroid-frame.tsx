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

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

const PhotoSurface = ({
  gradient,
  sun,
  hill,
  glow,
}: {
  gradient: string;
  sun: string;
  hill: string;
  glow: string;
}) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: gradient }} />
    <div
      style={{
        position: "absolute",
        top: "16%",
        right: "15%",
        width: "18%",
        aspectRatio: "1",
        borderRadius: "50%",
        background: sun,
        boxShadow: `0 0 28px ${glow}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "34%",
        bottom: 0,
        background: hill,
        clipPath:
          "polygon(0 100%, 0 64%, 24% 38%, 42% 58%, 60% 32%, 82% 58%, 100% 40%, 100% 100%)",
        opacity: 0.55,
      }}
    />
  </div>
);

export default function PolaroidFrame() {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const dropIn = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const translateY = interpolate(dropIn, [0, 1], [-300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotation = interpolate(dropIn, [0, 1], [8, -3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(dropIn, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pw = Math.round(width * 0.26);
  const ph = Math.round(pw);
  const pad = Math.round(width * 0.014);
  const caption = Math.round(width * 0.012);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${kitTheme.gray[50]} 0%, ${kitTheme.paper} 100%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          background: kitTheme.paper,
          padding: `${pad}px`,
          paddingBottom: Math.round(caption * 3 + pad),
          borderRadius: kitRadius.xs,
          border: `1px solid ${kitTheme.line}`,
          boxShadow: kitShadow.lg,
          transform: `translateY(calc(-50% + ${translateY}px)) rotate(${rotation}deg)`,
          opacity,
        }}
      >
        <div
          style={{
            width: pw,
            height: ph,
            borderRadius: kitRadius.xs,
            overflow: "hidden",
            position: "relative",
            background: `linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[300]} 100%)`,
          }}
        >
          <PhotoSurface
            gradient={`linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[300]} 100%)`}
            sun={kitTheme.green[600]}
            hill={kitTheme.green[500]}
            glow="rgba(28, 174, 88, 0.28)"
          />
        </div>
        <p
          style={{
            textAlign: "center",
            color: kitTheme.ink,
            fontSize: caption,
            fontWeight: 500,
            margin: 0,
            marginTop: pad,
            fontFamily: kitFont.sans,
            fontStyle: "italic",
          }}
        >
          Summer 2024
        </p>
      </div>
    </AbsoluteFill>
  );
}
