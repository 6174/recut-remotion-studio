/**
 * [INPUT]: 依赖各字幕主题组件的 InternalThemeProps 统一输入契约
 * [OUTPUT]: 对外提供主题 id 到真实主题组件的唯一映射与 ThemeName 类型
 * [POS]: captions/vendor 的主题分发目录；由 CaptionTheme 作为唯一运行时消费者
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { InternalThemeProps } from "./types";
import { PopTheme } from "./themes/pop";
import { KaraokeTheme } from "./themes/karaoke";
import { Kinetic01 } from "./themes/kinetic-01";
import { Kinetic02 } from "./themes/kinetic-02";

// Import custom themes
import { HustleTheme } from "./themes/hustle";
import { GrapeTheme } from "./themes/grape";
import { BeastTheme } from "./themes/beast";
import { PoppinTheme } from "./themes/poppin";
import { AaritTheme } from "./themes/aarit";
import { SoftAITheme } from "./themes/soft-ai";
import { GamingStreamTheme } from "./themes/gaming-stream";
import { SimpleOneWordTheme } from "./themes/simple-one-word";
import { PodcastTheme } from "./themes/podcast";

export const themeRegistry: Record<string, React.FC<InternalThemeProps>> = {
  pop: PopTheme,
  karaoke: KaraokeTheme,
  "kinetic-01": Kinetic01,
  "kinetic-02": Kinetic02,

  hustle: HustleTheme,
  grape: GrapeTheme,
  beast: BeastTheme,
  poppin: PoppinTheme,
  aarit: AaritTheme,
  "soft-ai": SoftAITheme,
  "gaming-stream": GamingStreamTheme,
  "simple-one-word": SimpleOneWordTheme,
  podcast: PodcastTheme,
} as const;

export type ThemeName = keyof typeof themeRegistry;
