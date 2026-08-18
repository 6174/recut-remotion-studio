/**
 * [INPUT]: 依赖 Recut CDN 的音频与字体目录（与 apps/editor 同一份数据、同一份文件）
 * [OUTPUT]: 对外提供音乐/字体目录的 CDN 优先、本地打包回退加载器与共享类型
 * [POS]: fine-tunes 的资源数据边界；MusicFineTune/FontFineTune 共用同一份 catalog
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export interface MusicTrack {
  id: string;
  name: string;
  kind: "music" | "sfx";
  moods: string[];
  styles: string[];
  category?: string;
  tags?: string[];
  duration: number;
  filesize: number;
  license: string;
  source: string;
  attribution: string;
  url: string;
}

export interface MusicCatalog {
  version: number;
  generatedAt: string;
  music: MusicTrack[];
  sfx: MusicTrack[];
}

export interface FontFaceFile {
  subset: string;
  weight: string;
  style: string;
  file: string;
}

export interface FontCatalogEntry {
  id: string;
  family: string;
  category: string;
  scripts: string[];
  weights: number[];
  faces?: FontFaceFile[];
}

export interface FontCatalog {
  version: number;
  generatedAt: string;
  google: FontCatalogEntry[];
}

/** 字体来源：CDN 自托管（google，可经 FontProvider 加载）或本机系统字体（system，直接可用、无 id/css）。 */
export type FontSource = "google" | "system";

/** 统一的可选字体项：google 来自 CDN 目录（带 id/scripts/weights），system 本机直接可用。 */
export interface FontItem {
  id: string | null;
  family: string;
  category: string;
  scripts: string[];
  weights: number[];
  source: FontSource;
}

/**
 * 跨平台常用系统字体（含中文字体）。family 名以 CSS font-family 直接使用即可，
 * 本机浏览器原生可用，无需加载/注册；与 apps/editor 的 SYSTEM_FONTS 对齐。
 */
export const SYSTEM_FONTS: string[] = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Georgia",
  "monospace",
  "sans-serif",
  "serif",
  "PingFang SC",
  "PingFang HK",
  "Hiragino Sans GB",
  "Songti SC",
  "STHeiti",
  "STKaiti",
  "Kaiti SC",
  "Baoli SC",
  "Yuanti SC",
  "LXGW WenKai",
  "Microsoft YaHei",
  "Microsoft YaHei UI",
  "SimHei",
  "SimSun",
  "KaiTi",
  "FangSong",
  "DengXian",
  "Source Han Sans CN",
  "Source Han Serif CN",
  "Noto Sans CJK SC",
  "Noto Serif CJK SC",
  "HarmonyOS Sans SC",
];

/** 把 CDN google 家族 + 本机系统字体合成一个可按来源筛选的可选列表。 */
export function buildFontItems(google: FontCatalogEntry[]): FontItem[] {
  const seen = new Set<string>();
  const items: FontItem[] = [];
  for (const entry of google) {
    seen.add(entry.family);
    items.push({
      id: entry.id,
      family: entry.family,
      category: entry.category,
      scripts: entry.scripts,
      weights: entry.weights,
      source: "google",
    });
  }
  for (const family of SYSTEM_FONTS) {
    if (seen.has(family)) continue;
    items.push({
      id: null,
      family,
      category: "system",
      scripts: /[\u4e00-\u9fff]/.test(family) ? ["zh"] : ["latin"],
      weights: [400, 700],
      source: "system",
    });
  }
  return items;
}

export interface ResourceCatalogs {
  music: MusicCatalog | null;
  fonts: FontCatalog | null;
}

/** Recut CDN 上音乐目录的绝对地址（编辑器同一份）。 */
export const MUSIC_CATALOG_URL = "https://cdn.recut.video/audio/catalog.json";
/** Recut CDN 上字体目录的绝对地址（编辑器同一份）。 */
export const FONTS_CATALOG_URL = "https://cdn.recut.video/fonts/google/catalog.json";

/** 返回资源绝对 URL：CDN 绝对地址，相对路径拼 CDN 根。 */
export function audioAssetUrl(url: string): string {
  const clean = url.replace(/^\//, "");
  if (/^https?:\/\//.test(clean)) return clean;
  return `https://cdn.recut.video/${clean}`;
}

/** 字体家族自托管 CSS（@font-face + unicode-range，与编辑器同文件）。 */
export function fontCssUrl(id: string): string {
  return `https://cdn.recut.video/fonts/google/${encodeURIComponent(id)}.css`;
}

async function fetchJson<T>(url: string | null): Promise<T | null> {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

let cached: ResourceCatalogs | null = null;
let inFlight: Promise<ResourceCatalogs> | null = null;

/** CDN 优先、本地回退（ui/public 打包副本，供离线/开发）加载音乐与字体目录。 */
export async function loadResourceCatalogs(): Promise<ResourceCatalogs> {
  if (cached) return cached;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    const [cdnMusic, cdnFonts] = await Promise.all([
      fetchJson<MusicCatalog>(MUSIC_CATALOG_URL),
      fetchJson<FontCatalog>(FONTS_CATALOG_URL),
    ]);
    const [localMusic, localFonts] = await Promise.all([
      fetchJson<MusicCatalog>(cdnMusic ? null : "./audio/catalog.json"),
      fetchJson<FontCatalog>(cdnFonts ? null : "./fonts/catalog.json"),
    ]);
    const music = cdnMusic ?? localMusic ?? null;
    const fonts = cdnFonts ?? localFonts ?? null;
    if (music?.music) music.music = music.music.map((item) => ({ ...item, kind: "music" as const }));
    if (music?.sfx) music.sfx = music.sfx.map((item) => ({ ...item, kind: "sfx" as const }));
    cached = { music, fonts };
    return cached;
  })();
  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}