/**
 * Free Remotion Template Component
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

import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

const PARTICLE_COUNT = 150;
const TEXT = "BOOM!";

const PARTICLE_COLORS = [
  kitTheme.green[200],
  kitTheme.green[300],
  kitTheme.green[400],
  kitTheme.green[500],
];

export default function ParticleExplosion() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const maxDistance = Math.min(width, height) * 0.24;

  const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
    const baseAngle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const rotationSpeed = 0.02;
    const rotatingAngle = baseAngle + frame * rotationSpeed;

    const scale = spring({
      frame,
      fps,
      from: 0,
      to: random(i) * 1.2 + 0.3,
      config: { mass: 0.3, damping: 12 },
    });

    const distance = spring({
      frame,
      fps,
      from: 0,
      to: maxDistance * 0.6 + random(i) * maxDistance * 0.4,
      config: { mass: 0.4, damping: 10 },
    });

    const x = Math.cos(rotatingAngle) * distance;
    const y = Math.sin(rotatingAngle) * distance;
    const opacity = interpolate(frame, [0, 20, 90], [0, 1, 0], { extrapolateRight: "clamp" });

    return {
      x,
      y,
      opacity,
      scale,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    };
  });

  const particleSize = Math.round(width * 0.014);

  return (
    <AbsoluteFill style={{ background: kitGradient.dark, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${Math.min(1, frame / 10)})`,
          fontFamily: kitFont.sans,
          fontSize: Math.round(width * 0.09),
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: "#ffffff",
          textShadow: `0 0 40px rgba(28, 174, 88, 0.5)`,
          zIndex: 2,
        }}
      >
        {TEXT}
      </div>

      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`,
            width: particleSize,
            height: particleSize,
            backgroundColor: particle.color,
            borderRadius: kitRadius.full,
            opacity: particle.opacity,
            boxShadow: `0 0 ${Math.round(particleSize * 0.5)}px rgba(28, 174, 88, 0.4)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
}
