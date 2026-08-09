/**
 * [INPUT]: 无运行时依赖；Recut 原生编辑风调色板（运行时默认值）
 * [OUTPUT]: 对外提供 TEMPLATE_PALETTES 与 resolvePalette（styleId → Palette）
 * [POS]: remotion-kit 的运行时调色板兼容层；完整视觉契约以全局 recut-design-system skill 为准
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export interface Palette {
  background: string;
  primary: string;
  accent: string;
  text: string;
  fontFamily?: string;
  captionTheme?: string;
  captionPrimary?: string;
  captionSecondary?: string;
  effectId?: string;
}

/** Recut 原生编辑风的运行时默认调色板（与全局 recut-design-system 同 id 风格对齐）。 */
export const TEMPLATE_PALETTES: Record<string, Palette> = {
  "paper-collage": { background: "#f4efe7", primary: "#14120f", accent: "#c46a2b", text: "#14120f", fontFamily: "Georgia, 'Songti SC', 'Noto Serif SC', 'Times New Roman', serif", captionTheme: "simple-one-word", captionPrimary: "#14120f", captionSecondary: "#c46a2b", effectId: "noise-grain" },
  "cinematic-dark": { background: "#0b0b12", primary: "#f5f2ea", accent: "#e8b341", text: "#f5f2ea", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "kinetic-01", captionPrimary: "#f5f2ea", captionSecondary: "#e8b341", effectId: "starfield" },
  "clean-editorial": { background: "#ffffff", primary: "#0f172a", accent: "#2563eb", text: "#0f172a", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "pop", captionPrimary: "#f8fafc", captionSecondary: "#93c5fd", effectId: "editorial-lines" },
  "vibrant-tech": { background: "#12002a", primary: "#ffffff", accent: "#22d3ee", text: "#ffffff", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "hustle", captionPrimary: "#ffffff", captionSecondary: "#22d3ee", effectId: "gradient-shift" },
  "motion-explainer": { background: "#050811", primary: "#f7f9ff", accent: "#8eb1ff", text: "#f7f9ff", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "kinetic-01", captionPrimary: "#ffffff", captionSecondary: "#8eb1ff", effectId: "starfield" },
  "product-launch": { background: "#10002c", primary: "#ffffff", accent: "#8af4ff", text: "#ffffff", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "hustle", captionPrimary: "#ffffff", captionSecondary: "#ff8ace", effectId: "gradient-shift" },
  "data-briefing": { background: "#f5f4ff", primary: "#171634", accent: "#5d5ad1", text: "#171634", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "pop", captionPrimary: "#ffffff", captionSecondary: "#5d5ad1", effectId: "editorial-lines" },
  "creator-collage": { background: "#f2eddf", primary: "#1e1a16", accent: "#b4502b", text: "#1e1a16", fontFamily: "Georgia, 'Songti SC', 'Noto Serif SC', 'Times New Roman', serif", captionTheme: "simple-one-word", captionPrimary: "#1e1a16", captionSecondary: "#b4502b", effectId: "noise-grain" },
  "biennale-yellow": { background: "#f5eddd", primary: "#17223b", accent: "#ffd326", text: "#17223b", fontFamily: "Georgia, 'Songti SC', 'Noto Serif SC', 'Times New Roman', serif", captionTheme: "simple-one-word", captionPrimary: "#17223b", captionSecondary: "#e25721", effectId: "noise-grain" },
  blockframe: { background: "#ffed4a", primary: "#101010", accent: "#ff8ac3", text: "#101010", fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Noto Sans SC', Arial, sans-serif", captionTheme: "beast", captionPrimary: "#101010", captionSecondary: "#ff8ac3", effectId: "none" },
  "cobalt-grid": { background: "#f7f2e9", primary: "#111d5a", accent: "#3159d9", text: "#111d5a", fontFamily: "Georgia, 'Songti SC', 'Noto Serif SC', 'Times New Roman', serif", captionTheme: "pop", captionPrimary: "#ffffff", captionSecondary: "#3159d9", effectId: "editorial-lines" },
  "bold-poster": { background: "#f7eee1", primary: "#141414", accent: "#d52323", text: "#141414", fontFamily: "'Arial Black', 'PingFang SC', 'Noto Sans SC', sans-serif", captionTheme: "beast", captionPrimary: "#ffffff", captionSecondary: "#d52323", effectId: "none" },
  "capsule-editorial": { background: "#fff2e4", primary: "#1d2447", accent: "#ff7566", text: "#1d2447", fontFamily: "Georgia, 'Songti SC', 'Noto Serif SC', 'Times New Roman', serif", captionTheme: "grape", captionPrimary: "#1d2447", captionSecondary: "#ffe16a", effectId: "none" },
  "editorial-forest": { background: "#f4ebd6", primary: "#1e4d3b", accent: "#d86079", text: "#1e4d3b", fontFamily: "Georgia, 'Songti SC', 'Noto Serif SC', 'Times New Roman', serif", captionTheme: "soft-ai", captionPrimary: "#f4ebd6", captionSecondary: "#d86079", effectId: "noise-grain" },
  clean: { background: "#fafafa", primary: "#0f172a", accent: "#2563eb", text: "#0f172a", fontFamily: "'Inter', system-ui, 'PingFang SC', 'Noto Sans SC', sans-serif", captionTheme: "pop", captionPrimary: "#ffffff", captionSecondary: "#93c5fd", effectId: "editorial-lines" },
  futuristic: { background: "#0b0f2a", primary: "#ffffff", accent: "#22d3ee", text: "#ffffff", fontFamily: "'Inter', system-ui, 'PingFang SC', 'Noto Sans SC', sans-serif", captionTheme: "hustle", captionPrimary: "#ffffff", captionSecondary: "#ff8ace", effectId: "gradient-shift" },
};

export const resolvePalette = (templateId?: string | null): Palette => {
  const fallback = TEMPLATE_PALETTES[templateId || ""] ?? TEMPLATE_PALETTES["clean-editorial"];
  return { ...fallback };
};
