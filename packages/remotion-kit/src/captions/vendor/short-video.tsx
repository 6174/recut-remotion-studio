/**
 * [INPUT]: 依赖 Remotion 帧时钟、字幕逐词时间轴与主题颜色契约
 * [OUTPUT]: 对外提供 ShortVideoTheme：无底框、高对比、中文优先的短视频字幕渲染器
 * [POS]: captions/vendor 的统一视觉基线；CaptionTheme 按主题 id 选择动作配方，历史主题文件仅保留兼容导出
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { InternalThemeProps } from "./types";

const FONT = '"Arial Black", "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
const FOCUS_THEMES = new Set(["kinetic-01", "kinetic-02", "simple-one-word", "aarit"]);
const STACKED_THEMES = new Set(["podcast", "beast"]);

const isLight = (color: string) => {
  const hex = color.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return false;
  const [red, green, blue] = [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
  return red * 0.299 + green * 0.587 + blue * 0.114 > 155;
};

const toPixels = (fontSize: number | string | undefined) => {
  if (typeof fontSize === "number") return fontSize;
  const parsed = Number.parseFloat(fontSize ?? "72");
  return Number.isFinite(parsed) ? parsed : 72;
};

export const ShortVideoTheme: React.FC<InternalThemeProps & { theme: string }> = ({ data, fontSize, primaryColor, secondaryColor, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const line = data.lines.find((item) => {
    const start = item.words[0]?.start ?? Infinity;
    const end = item.words.at(-1)?.end ?? -Infinity;
    return time >= start && time <= end;
  }) ?? data.lines.find((item) => item.words.length);

  if (!line?.words.length) return null;

  const activeIndex = Math.max(0, line.words.findIndex((word) => time >= word.start && time < word.end));
  const baseSize = toPixels(fontSize);
  const focused = FOCUS_THEMES.has(theme);
  const stacked = STACKED_THEMES.has(theme);
  const showOnlyActive = theme === "simple-one-word";
  const baseStroke = isLight(primaryColor) ? "rgba(8, 12, 10, 0.82)" : "rgba(8, 12, 10, 0.58)";

  return (
    <div style={{ display: "flex", flexDirection: stacked ? "column" : "row", flexWrap: stacked ? "nowrap" : "wrap", alignItems: "center", justifyContent: "center", gap: stacked ? `${Math.round(baseSize * 0.1)}px` : `${Math.round(baseSize * 0.05)}px ${Math.round(baseSize * 0.12)}px`, maxWidth: "86%", textAlign: "center" }}>
      {line.words.map((word, index) => {
        const active = index === activeIndex;
        const elapsed = Math.max(0, frame - Math.round(word.start * fps));
        const entrance = spring({ frame: elapsed, fps, config: { damping: 15, mass: 0.34, stiffness: theme === "hustle" ? 240 : 180 } });
        const fade = interpolate(elapsed, [0, 6], [0, 1], { extrapolateRight: "clamp" });
        const focusScale = focused ? (active ? 1.2 : 0.82) : active ? 1.06 : 1;
        const scale = theme === "hustle" || theme === "pop" || theme === "beast" ? (0.82 + entrance * 0.18) * focusScale : focusScale;
        const color = active || theme === "karaoke" && index < activeIndex ? secondaryColor : primaryColor;
        const blur = theme === "soft-ai" ? interpolate(elapsed, [0, 10], [14, 0], { extrapolateRight: "clamp" }) : 0;
        const opacity = showOnlyActive && !active ? 0 : focused && !active ? 0.56 : fade;
        const wordSize = theme === "beast" ? baseSize * (active ? 1.22 : 1.04) : baseSize;

        return (
          <span
            key={`${word.start}-${word.text}`}
            style={{
              color,
              display: "inline-block",
              filter: blur ? `blur(${blur}px)` : undefined,
              fontFamily: FONT,
              fontSize: wordSize,
              fontStyle: theme === "grape" ? "italic" : "normal",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.96,
              opacity,
              textShadow: `0 ${Math.max(2, Math.round(baseSize * 0.05))}px ${Math.round(baseSize * 0.12)}px rgba(0, 0, 0, 0.38)`,
              transform: `rotate(${theme === "grape" ? -3 : 0}deg) scale(${scale})`,
              transformOrigin: "center",
              WebkitTextStroke: `${Math.max(1, Math.round(baseSize * 0.018))}px ${baseStroke}`,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
