/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Restyled to the Vercel + Recut green design language (kitTheme): a slow
 * three-stop gradient drifting between dark neutrals and a green-tinted stop.
 */

"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";
import { kitTheme } from "./helpers/theme";

const hexToRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const mix = (a: string, b: string, t: number): string => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const ch = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const cs = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const cl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${ch}, ${cs}, ${cl})`;
};

export default function GradientShift() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;

  // Slowly drift each stop through its own phase (no rainbow hue cycling)
  const phase1 = Math.sin(t * 0.2) * 0.5 + 0.5;
  const phase2 = Math.sin(t * 0.2 + 2) * 0.5 + 0.5;
  const phase3 = Math.sin(t * 0.2 + 4) * 0.5 + 0.5;

  // Theme-derived palette: dark neutrals through green-tinted stops
  const colors = [kitTheme.dark, kitTheme.darkRaised, kitTheme.green[900], kitTheme.green[600]];

  const stop = (phase: number) => {
    const scaled = phase * (colors.length - 1);
    const idx = Math.floor(scaled);
    const frac = scaled - idx;
    const c1 = colors[idx];
    const c2 = colors[Math.min(idx + 1, colors.length - 1)];
    return mix(c1, c2, frac);
  };

  // Slowly rotate the gradient angle
  const angle = (frame * 0.5) % 360;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(${angle}deg, ${stop(phase1)}, ${stop(phase2)}, ${stop(phase3)})`,
      }}
    />
  );
}
