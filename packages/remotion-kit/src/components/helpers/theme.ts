/**
 * kitTheme — Vercel-inspired design tokens for Recut Remotion template components.
 * ---------------------------------
 * Structure follows the Vercel design system: monochrome neutral ramp, hairline
 * borders, layered soft shadows, low radius, generous type scale. The neutrals
 * are green-tinted so every template stays coherent with the Recut platform
 * (`--foreground: oklch(0.18 0.012 150)`, `--border: oklch(0.9 0.007 150)`),
 * and the single accent is the Recut green (`--primary: oklch(0.66 0.17 151)`
 * ≈ #1cae58). Use these tokens for ALL colors/radii/shadows in templates so the
 * whole catalog shares one visual language.
 *
 * When a template is copied into a project workspace it imports this file at
 * `./helpers/theme` — copy it alongside the component (or alias the import to
 * `@recut/remotion-kit`), and keep the token names unchanged.
 */

export const kitTheme = {
  /** Neutral ramp (Vercel-style, green-tinted to match the Recut platform). */
  gray: {
    0: "#ffffff",
    50: "#f7faf8",
    100: "#eef2ef",
    200: "#e2e7e3",
    300: "#cbd3cc",
    400: "#a3ada5",
    500: "#76817a",
    600: "#4e5951",
    700: "#2c352f",
    800: "#1a211c",
    900: "#0c100d",
  },
  /** Recut green accent ramp (--primary family). */
  green: {
    50: "#eefaf2",
    100: "#d0f5d7",
    200: "#a4e8b6",
    300: "#6fd490",
    400: "#3cc06a",
    500: "#1cae58",
    600: "#158943",
    700: "#106b36",
    800: "#0c5129",
    900: "#083a1e",
  },
  /** Semantic aliases (light stage). */
  ink: "#0c100d",
  inkSoft: "#2c352f",
  muted: "#4e5951",
  faint: "#76817a",
  line: "#e2e7e3",
  lineStrong: "#cbd3cc",
  paper: "#ffffff",
  paperSoft: "#f7faf8",
  paperDeep: "#eef2ef",
  /** Semantic aliases (dark stage). */
  dark: "#0c100d",
  darkSurface: "#131a15",
  darkRaised: "#1b241e",
  darkLine: "#2c352f",
  darkMuted: "#a3ada5",
  /** Functional accents. */
  blue: "#3b82f6",
  amber: "#e6a800",
  red: "#d64545",
} as const;

export const kitFont = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', Arial, sans-serif",
  mono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace",
} as const;

export const kitRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  full: 999,
} as const;

export const kitShadow = {
  sm: "0 1px 2px rgba(12, 16, 13, 0.06), 0 1px 3px rgba(12, 16, 13, 0.05)",
  md: "0 2px 8px rgba(12, 16, 13, 0.06), 0 12px 32px rgba(12, 16, 13, 0.10)",
  lg: "0 4px 14px rgba(12, 16, 13, 0.08), 0 24px 64px rgba(12, 16, 13, 0.12)",
} as const;

export const kitGradient = {
  green: "linear-gradient(135deg, #3cc06a 0%, #1cae58 55%, #158943 100%)",
  dark: "linear-gradient(160deg, #131a15 0%, #0c100d 100%)",
  paper: "linear-gradient(180deg, #ffffff 0%, #f7faf8 100%)",
} as const;
