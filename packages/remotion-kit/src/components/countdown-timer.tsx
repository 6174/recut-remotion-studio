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

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitGradient, kitTheme } from "./helpers/theme";

export default function CountdownTimer() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const framesPerNumber = Math.floor(fps * 0.8);
  const totalNumbers = 6; // 5, 4, 3, 2, 1, GO
  const currentIndex = Math.min(
    Math.floor(frame / framesPerNumber),
    totalNumbers - 1
  );
  const frameInSegment = frame - currentIndex * framesPerNumber;

  const numbers = ["5", "4", "3", "2", "1", "GO"];
  const currentLabel = numbers[currentIndex];

  const scale = spring({
    frame: frameInSegment,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  const opacity = interpolate(
    frameInSegment,
    [0, 5, framesPerNumber - 8, framesPerNumber],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const isGo = currentIndex === totalNumbers - 1;

  return (
    <AbsoluteFill style={{ background: kitGradient.dark, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: isGo ? kitTheme.green[400] : kitTheme.darkMuted, fontWeight: 600 }}>
          {isGo ? "READY" : "GOING LIVE IN"}
        </span>
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
        <div
          style={{
            transform: `scale(${scale})`,
            opacity: isGo ? 1 : opacity,
            fontSize: Math.round(width * (isGo ? 0.2 : 0.24)),
            fontWeight: 900,
            letterSpacing: "-0.04em",
            fontFamily: kitFont.sans,
            color: "#ffffff",
            background: isGo ? kitGradient.green : "none",
            WebkitBackgroundClip: isGo ? "text" : undefined,
            WebkitTextFillColor: isGo ? "transparent" : undefined,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {currentLabel}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: height * 0.1, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.sans, fontSize: Math.round(width * 0.014), color: kitTheme.darkMuted }}>
          {isGo ? "And we're live." : "Get ready to ship."}
        </span>
      </div>
    </AbsoluteFill>
  );
}
