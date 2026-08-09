/**
 * [INPUT]: 依赖 remotion 的 AbsoluteFill 与 kit 的 resolvePalette、BackgroundFX
 * [OUTPUT]: 对外提供 STYLE_SYSTEMS、StyleFrame、StyleLabel、StylePill 三个风格原子
 * [POS]: remotion-kit 的风格层；成片模板负责叙事编排，本文件只负责可复用的视觉语法
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { BackgroundFX } from "../effects";
import { resolvePalette } from "../palette";

export const STYLE_SYSTEMS = ["paper-collage", "cinematic-dark", "clean-editorial", "vibrant-tech", "biennale-yellow", "blockframe", "cobalt-grid", "bold-poster", "capsule-editorial", "editorial-forest"] as const;
export type StyleSystemId = (typeof STYLE_SYSTEMS)[number];

export const StyleFrame: React.FC<{ styleId: StyleSystemId; children?: React.ReactNode }> = ({ styleId, children }) => {
  const palette = resolvePalette(styleId);
  return <AbsoluteFill style={{ background: palette.background, color: palette.text, fontFamily: palette.fontFamily, overflow: "hidden" }}><BackgroundFX effectId={palette.effectId} palette={palette} />{children}</AbsoluteFill>;
};

export const StyleLabel: React.FC<{ styleId: StyleSystemId; children: React.ReactNode }> = ({ styleId, children }) => {
  const palette = resolvePalette(styleId);
  return <span style={{ color: palette.accent, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, fontWeight: 700, letterSpacing: "0.24em" }}>{children}</span>;
};

export const StylePill: React.FC<{ styleId: StyleSystemId; children: React.ReactNode }> = ({ styleId, children }) => {
  const palette = resolvePalette(styleId);
  return <span style={{ display: "inline-flex", border: `1px solid ${palette.accent}`, borderRadius: 999, padding: "9px 16px", color: palette.text, background: `${palette.background}cc`, fontFamily: palette.fontFamily, fontSize: 16 }}>{children}</span>;
};
