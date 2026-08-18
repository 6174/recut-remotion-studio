/**
 * [INPUT]: 依赖逐词时间轴、Remotion 帧时钟与 CaptionTheme 的主题分发
 * [OUTPUT]: 对外提供 BeastTheme：无底框的白字黑描边逐词字幕
 * [POS]: captions/vendor/themes 的科技新闻字幕主题；不使用容器或背景框，只提供克制的文字层。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { InternalThemeProps } from "../types";
import { resolveFontFamily } from "../utils/font";

export const BeastTheme: React.FC<InternalThemeProps> = ({
  data,
  fontSize,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Find active line
  let activeLine: (typeof data.lines)[number] | null = null;
  for (let i = 0; i < data.lines.length; i++) {
    const line = data.lines[i];
    if (line.words.length === 0) continue;
    const lineStart = line.words[0].start;
    const lineEnd = line.words[line.words.length - 1].end;
    if (time >= lineStart && time <= lineEnd) {
      activeLine = line;
      break;
    }
  }

  // 没有正在说的句子就不渲染；绝不能把上一句字幕挂到下一镜头上。
  if (!activeLine || !activeLine.words.length) return null;

  // fontSize 已是最终画布像素值：不能再按 1920/1080 二次放大。
  const baseSize = typeof fontSize === "number" ? fontSize : 46;
  const strokeWidth = Math.max(3, Math.round(baseSize * 0.075));

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px 14px",
        maxWidth: "100%",
        textAlign: "center",
      }}
    >
      {activeLine.words.map((word, index) => {
        const isActive = time >= word.start && time < word.end;
        const wordStartFrame = Math.round(word.start * fps);

        const pop = spring({
          frame: frame - wordStartFrame,
          fps,
          config: { damping: 10, stiffness: 180 },
        });

        const transform = isActive ? `scale(${1 + pop * 0.06})` : "scale(1)";

        return (
          <span
            key={index}
            style={{
              color: "#ffffff",
              fontFamily: resolveFontFamily('"Arial Black", "PingFang SC", "Noto Sans SC", sans-serif', fontFamily),
              fontSize: baseSize,
              fontWeight: 900,
              fontStyle: "normal",
              letterSpacing: "-1px",
              lineHeight: 1.16,
              WebkitTextStroke: `${strokeWidth}px #111111`,
              textShadow: "2px 3px 0 #111111",
              paintOrder: "stroke fill",
              transform,
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
