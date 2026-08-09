/**
 * [INPUT]: 依赖字幕颜色归一化、ShortVideoTheme 与 BeastTheme 的逐帧渲染能力
 * [OUTPUT]: 对外提供 CaptionTheme 统一字幕主题入口；beast 走白字黑描边专用渲染器
 * [POS]: captions/vendor 的适配层；将上层颜色和时间轴契约稳定地交给短视频视觉基线与科技新闻字幕
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { CaptionThemeProps } from "./types";
import { BeastTheme } from "./themes/beast";
import { resolveColors } from "./utils/resolveColors";
import { ShortVideoTheme } from "./short-video";

export const CaptionTheme: React.FC<CaptionThemeProps> = ({
  primaryColor,
  secondaryColor,
  data,
  theme = "pop",
  fontSize,
}) => {
  const colors = resolveColors(primaryColor, secondaryColor);
  if (theme === "beast") {
    return <BeastTheme primaryColor={colors.primary} secondaryColor={colors.secondary} data={data} fontSize={fontSize} />;
  }
  return (
    <ShortVideoTheme
      primaryColor={colors.primary}
      secondaryColor={colors.secondary}
      data={data}
      fontSize={fontSize}
      theme={theme}
    />
  );
};
