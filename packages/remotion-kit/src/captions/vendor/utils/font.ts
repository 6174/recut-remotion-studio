/**
 * [INPUT]: 无运行时依赖；供字幕主题按 override 优先、主题默认值兜底的家族名解析
 * [OUTPUT]: resolveFontFamily(defaultFamily, override) —— override 非空时用它，否则用主题默认
 * [POS]: captions/vendor/utils 的字体适配层；让 CaptionTheme 的 fontFamily override 不影响主题默认视觉
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export function resolveFontFamily(defaultFamily: string, override?: string | null): string {
  const candidate = String(override || "").trim();
  return candidate ? candidate : defaultFamily;
}