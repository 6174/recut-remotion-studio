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
import { kitFont, kitGradient, kitRadius, kitTheme } from "./helpers/theme";

export default function TextHighlight() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const words = ["Build", "amazing", "videos", "with", "code"];
  const framesPerWord = Math.floor(fps * 0.6);

  return (
    <AbsoluteFill style={{ background: kitGradient.paper, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: height * 0.12, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[600], fontWeight: 600 }}>
          WORD BY WORD
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: Math.round(width * 0.02), maxWidth: "80%", padding: Math.round(width * 0.04) }}>
        {words.map((word, i) => {
          const wordStart = i * framesPerWord;
          const highlightProgress = interpolate(
            frame,
            [wordStart, wordStart + framesPerWord * 0.5],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const isHighlighted = highlightProgress > 0;

          return (
            <span
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                fontSize: Math.round(width * 0.055),
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: kitTheme.ink,
                padding: `0 ${Math.round(width * 0.008)}px`,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${highlightProgress * 100}%`,
                  background: kitGradient.green,
                  borderRadius: kitRadius.xs,
                  zIndex: 0,
                  opacity: isHighlighted ? 0.18 : 0,
                }}
              />
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderBottom: isHighlighted
                    ? `4px solid ${kitTheme.green[500]}`
                    : `4px solid ${kitTheme.line}`,
                  borderRadius: 2,
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
