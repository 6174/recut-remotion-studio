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

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
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

export default function PhotoStack() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const photos = [
    {
      label: "Photo 1",
      rotation: -6,
      gradient: `linear-gradient(135deg, ${kitTheme.gray[200]} 0%, ${kitTheme.gray[300]} 100%)`,
      sun: kitTheme.paper,
      hill: kitTheme.gray[400],
      glow: "rgba(12, 16, 13, 0.12)",
      delay: 0,
    },
    {
      label: "Photo 2",
      rotation: 0,
      gradient: `linear-gradient(135deg, ${kitTheme.green[100]} 0%, ${kitTheme.green[200]} 100%)`,
      sun: kitTheme.green[600],
      hill: kitTheme.green[500],
      glow: "rgba(28, 174, 88, 0.25)",
      delay: 8,
    },
    {
      label: "Photo 3",
      rotation: 6,
      gradient: `linear-gradient(135deg, ${kitTheme.gray[100]} 0%, ${kitTheme.gray[200]} 100%)`,
      sun: kitTheme.green[500],
      hill: kitTheme.gray[400],
      glow: "rgba(28, 174, 88, 0.20)",
      delay: 16,
    },
  ];

  const pw = Math.round(width * 0.2);
  const ph = Math.round(pw * 0.92);
  const pad = Math.round(width * 0.012);
  const caption = Math.round(width * 0.011);
  const offsetX = Math.round(width * 0.03);
  const offsetY = Math.round(height * 0.02);

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
      {photos.map((photo, i) => {
        const appear = spring({
          frame: frame - photo.delay,
          fps,
          config: { damping: 12, stiffness: 100 },
        });

        const scale = appear;
        const opacity = appear;
        const dx = (i - 1) * offsetX;
        const dy = (i - 1) * -offsetY;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: pw,
              background: kitTheme.paper,
              border: `1px solid ${kitTheme.line}`,
              borderRadius: kitRadius.sm,
              padding: pad,
              boxShadow: kitShadow.lg,
              display: "flex",
              flexDirection: "column",
              transform: `translate(${dx}px, ${dy}px) rotate(${photo.rotation}deg) scale(${scale})`,
              opacity,
            }}
          >
            <div
              style={{
                position: "relative",
                height: ph,
                borderRadius: kitRadius.xs,
                overflow: "hidden",
                background: photo.gradient,
              }}
            >
              <PhotoSurface
                gradient={photo.gradient}
                sun={photo.sun}
                hill={photo.hill}
                glow={photo.glow}
              />
            </div>
            <p
              style={{
                textAlign: "center",
                margin: 0,
                marginTop: pad,
                fontFamily: kitFont.sans,
                fontSize: caption,
                fontWeight: 500,
                fontStyle: "italic",
                color: kitTheme.ink,
              }}
            >
              {photo.label}
            </p>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
