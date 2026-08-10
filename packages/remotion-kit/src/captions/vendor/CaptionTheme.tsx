/**
 * [INPUT]: 依赖字幕颜色归一化与主题注册表的逐帧渲染能力
 * [OUTPUT]: 对外提供 CaptionTheme 统一字幕主题入口；按主题 id 分发真实主题并回退至 pop
 * [POS]: captions/vendor 的适配层；将上层颜色和时间轴契约稳定地交给每套独立字幕主题
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { CaptionThemeProps } from "./types";
import { themeRegistry } from "./registry";
import { resolveColors } from "./utils/resolveColors";

export const CaptionTheme: React.FC<CaptionThemeProps> = ({
  primaryColor,
  secondaryColor,
  data,
  theme = "pop",
  fontSize,
}) => {
  const colors = resolveColors(primaryColor, secondaryColor);
  const Theme = themeRegistry[theme] ?? themeRegistry.pop;
  return (
    <Theme
      primaryColor={colors.primary}
      secondaryColor={colors.secondary}
      data={data}
      fontSize={fontSize}
    />
  );
};
