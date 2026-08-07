/**
 * [INPUT]: 依赖 Remotion 帧时间、视频尺寸与字幕逐词时间轴
 * [OUTPUT]: 对外提供 GrapeTheme 无底框倾斜强调字幕主题
 * [POS]: remotion-kit/captions 的文字型主题；与其他主题共用 CaptionTheme 注册与颜色契约
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { InternalThemeProps } from "../types";

export const GrapeTheme: React.FC<InternalThemeProps> = ({
  primaryColor,
  secondaryColor,
  data,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const time = frame / fps;

  // Find active line
  let activeLineIdx = 0;
  for (let i = 0; i < data.lines.length; i++) {
    const line = data.lines[i];
    if (line.words.length === 0) continue;
    const lineStart = line.words[0].start;
    const lineEnd = line.words[line.words.length - 1].end;
    if (time >= lineStart && time <= lineEnd) {
      activeLineIdx = i;
      break;
    }
    if (time > lineEnd) {
      activeLineIdx = i;
    }
  }

  const activeLine = data.lines[activeLineIdx] || data.lines[0];
  if (!activeLine || !activeLine.words.length) return null;

  // Responsive scaling
  const scaleFactor = width / 1080;
  const baseSize = typeof fontSize === "number" ? fontSize : 72;
  const scaledFontSize = `${baseSize * scaleFactor}px`;

  // Entrance animation: fadeIn over 1.0s
  const lineStart = activeLine.words[0].start;
  const relativeFrame = frame - Math.round(lineStart * fps);
  const opacity = interpolate(relativeFrame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Text-only treatment: color and shadow create contrast without a caption box.
  const baseTextColor = primaryColor;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: `${10 * scaleFactor}px ${18 * scaleFactor}px`,
        maxWidth: "85%",
        textAlign: "center",
        opacity,
      }}
    >
      {activeLine.words.map((word, index) => {
        const isActive = time >= word.start && time < word.end;

        const color = isActive ? secondaryColor : baseTextColor;

        return (
          <span
            key={index}
            style={{
              color,
              fontFamily: '"Outfit", sans-serif',
              fontSize: scaledFontSize,
              fontWeight: 900,
              fontStyle: "italic",
              textTransform: "uppercase",
              textShadow: `0 ${8 * scaleFactor}px ${20 * scaleFactor}px rgba(0,0,0,0.7)`,
              display: "inline-block",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
