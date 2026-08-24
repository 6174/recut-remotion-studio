/**
 * [INPUT]: 无依赖；纯 SVG
 * [OUTPUT]: 对外提供 UI 图标与 20 种图层类型的图标组件映射 LAYER_ICONS
 * [POS]: spline-material 面板的视觉原子；图标风格近似 Spline 的 18px 单色/渐变小 glyph
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { FC, SVGProps } from "react";
import type { LayerKind } from "./types";

type P = SVGProps<SVGSVGElement> & { size?: number };

const Svg: FC<P> = ({ size = 18, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    {children}
  </svg>
);

/* ---------- UI 图标 ---------- */

export const IconEye: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
  </Svg>
);

export const IconEyeOff: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M9.9 5.2A9.6 9.6 0 0 1 12 5c6 0 9.5 7 9.5 7a15.6 15.6 0 0 1-3.3 4M6.2 6.9A15 15 0 0 0 2.5 12S6 19 12 19a9 9 0 0 0 4-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </Svg>
);

export const IconX: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const IconPlus: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const IconChevron: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconCheck: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.2 4L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconDrag: FC<P> = (p) => (
  <Svg {...p}>
    {[8, 12, 16].map((y) => (
      <g key={y}>
        <circle cx="9.4" cy={y} r="1.15" fill="currentColor" />
        <circle cx="14.6" cy={y} r="1.15" fill="currentColor" />
      </g>
    ))}
  </Svg>
);

export const IconSearch: FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M15.8 15.8L20.5 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const IconLock: FC<P> = (p) => (
  <Svg {...p}>
    <rect x="6" y="10.5" width="12" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.7" />
  </Svg>
);

export const IconBolt: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M13 2.5L5.5 13.5h5L10 21.5l8-11.5h-5.2L13 2.5Z" fill="currentColor" />
  </Svg>
);

export const IconSparkle: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7L12 3Z" fill="currentColor" />
    <path d="M18.5 15l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4Z" fill="currentColor" opacity="0.8" />
  </Svg>
);

export const IconLibrary: FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7.4" height="7.4" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <rect x="13.1" y="3.5" width="7.4" height="7.4" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <rect x="3.5" y="13.1" width="7.4" height="7.4" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <rect x="13.1" y="13.1" width="7.4" height="7.4" rx="3.7" stroke="currentColor" strokeWidth="1.7" />
  </Svg>
);

export const IconBlend: FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="6.2" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" opacity="0.9" />
  </Svg>
);

/* ---------- 图层类型图标 ---------- */

const GradDefs = ({ id, from, to, vertical = false }: { id: string; from: string; to: string; vertical?: boolean }) => (
  <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0"}>
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </linearGradient>
);

const IconColor: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <linearGradient id="sm-rainbow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff5f6d" />
        <stop offset="0.35" stopColor="#ffc371" />
        <stop offset="0.65" stopColor="#7ee8a2" />
        <stop offset="1" stopColor="#7aa8ff" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="8.4" fill="url(#sm-rainbow)" />
  </Svg>
);

const IconNormal: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <GradDefs id="sm-normal" from="#b48cff" to="#4d7cff" vertical />
    </defs>
    <circle cx="12" cy="12" r="8.4" fill="url(#sm-normal)" />
    <circle cx="9.4" cy="9" r="2.6" fill="#ffffff" opacity="0.35" />
  </Svg>
);

const IconDepth: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <GradDefs id="sm-depth" from="#8f9bb3" to="#39415a" vertical />
    </defs>
    <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" fill="url(#sm-depth)" />
  </Svg>
);

const IconGradientLayer: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <GradDefs id="sm-gradient" from="#f2f2f2" to="#4a4a4a" vertical />
    </defs>
    <rect x="4" y="4" width="16" height="16" rx="4.5" fill="url(#sm-gradient)" />
  </Svg>
);

const IconNoise: FC<P> = (p) => (
  <Svg {...p}>
    {[7.5, 12, 16.5].map((y) => (
      <path key={y} d={`M4 ${y}c2.4-2.6 4.8 2.6 7.2 0s4.8 2.6 8.8 0`} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" fill="none" />
    ))}
  </Svg>
);

const IconFresnel: FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="4.4" opacity="0.85" />
  </Svg>
);

const IconCavity: FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3.5l7.4 4.3v8.4L12 20.5l-7.4-4.3V7.8L12 3.5Z" fill="currentColor" opacity="0.35" />
    <path d="M12 7l4.3 2.5v5L12 17l-4.3-2.5v-5L12 7Z" fill="currentColor" opacity="0.9" />
  </Svg>
);

const IconDust: FC<P> = (p) => (
  <Svg {...p}>
    {[7, 12, 17].map((y, i) => (
      <g key={y} fill="currentColor" opacity={0.9 - i * 0.18}>
        {[5, 9.5, 14, 18.5].map((x, j) => (
          <circle key={x} cx={x + (i % 2) * 1.4} cy={y + (j % 2) * 1.2 - 0.6} r="1.05" />
        ))}
      </g>
    ))}
  </Svg>
);

const IconRainbow: FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="13.5" r="7.5" stroke="#ff6b6b" strokeWidth="1.9" fill="none" />
    <circle cx="12" cy="15" r="5" stroke="#ffc94d" strokeWidth="1.9" fill="none" />
    <circle cx="12" cy="16.5" r="2.6" stroke="#5fd08a" strokeWidth="1.9" fill="none" />
  </Svg>
);

const IconToon: FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.4" fill="currentColor" opacity="0.28" />
    <path d="M12 3.6a8.4 8.4 0 0 1 0 16.8V3.6Z" fill="currentColor" opacity="0.95" />
  </Svg>
);

const IconOutline: FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.8" />
  </Svg>
);

const IconGlass: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <GradDefs id="sm-glass" from="#eef7fb" to="#9fc4d8" vertical />
    </defs>
    <circle cx="12" cy="12" r="8.4" fill="url(#sm-glass)" opacity="0.9" />
    <path d="M7.5 9.5c1-2 3.4-3.2 5.6-3" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </Svg>
);

const IconReflection: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <GradDefs id="sm-reflect" from="#f5f9ff" to="#5b7ea8" vertical />
    </defs>
    <circle cx="12" cy="12" r="8.4" fill="url(#sm-reflect)" />
    <path d="M6.5 13.5c3.5-1.2 7.5-1.2 11 0" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" fill="none" />
  </Svg>
);

const IconMatcap: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <radialGradient id="sm-matcap" cx="0.35" cy="0.3" r="0.95">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.55" stopColor="#b9b9b9" />
        <stop offset="1" stopColor="#5c5c5c" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="8.4" fill="url(#sm-matcap)" />
  </Svg>
);

const IconDisplace: FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.4" fill="currentColor" opacity="0.3" />
    {[
      [8.5, 8.5],
      [13.5, 7.5],
      [16.5, 11.5],
      [10.5, 13],
      [14.5, 16],
      [8, 15.5],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="currentColor" />
    ))}
  </Svg>
);

const IconPattern: FC<P> = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
  </Svg>
);

const IconVertexColor: FC<P> = (p) => (
  <Svg {...p}>
    <defs>
      <linearGradient id="sm-vertex" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff8f6b" />
        <stop offset="0.5" stopColor="#ffd36b" />
        <stop offset="1" stopColor="#6bc9ff" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="16" height="16" rx="4.5" fill="url(#sm-vertex)" />
  </Svg>
);

const IconImage: FC<P> = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" opacity="0.55" />
  </Svg>
);

const IconVideo: FC<P> = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M10.2 8.8l5 3.2-5 3.2V8.8Z" fill="currentColor" opacity="0.85" />
  </Svg>
);

const IconAiTexture: FC<P> = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.7" opacity="0.7" />
    <path d="M12 7l1.3 3.7L17 12l-3.7 1.3L12 17l-1.3-3.7L7 12l3.7-1.3L12 7Z" fill="currentColor" />
  </Svg>
);

export const LAYER_ICONS: Record<LayerKind, FC<P>> = {
  aiTexture: IconAiTexture,
  image: IconImage,
  video: IconVideo,
  color: IconColor,
  depth: IconDepth,
  normal: IconNormal,
  gradient: IconGradientLayer,
  noise: IconNoise,
  fresnel: IconFresnel,
  cavity: IconCavity,
  dust: IconDust,
  rainbow: IconRainbow,
  toon: IconToon,
  outline: IconOutline,
  glass: IconGlass,
  reflection: IconReflection,
  matcap: IconMatcap,
  displace: IconDisplace,
  pattern: IconPattern,
  vertexColor: IconVertexColor,
};
