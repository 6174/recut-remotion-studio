/**
 * [INPUT]: Spline 公开 env 全景资源（https://app.spline.design/images/envs/，2048x1024 equirect，CORS *）
 * [OUTPUT]: 对外提供 ENV_PRESETS（真实环境贴图预设库）、ENV_LEGACY_MAP（旧程序化 id 迁移）与 envUrl(map)
 * [POS]: spline-material 的 Environment Map 数据源；map 值为预设 id 或 dataURL（用户上传），texture 由 textures.ts 的 getEnvTexture 加载
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

export type EnvPreset = { id: string; name: string; url: string };

const BASE = "https://app.spline.design/images/envs/";

const preset = (id: string, name: string): EnvPreset => ({ id, name, url: `${BASE}${id}.webp` });

export const ENV_PRESETS: EnvPreset[] = [
  preset("neutral_studio", "Neutral Studio"),
  preset("studio_white", "White Studio"),
  preset("studio_simple", "Simple Studio"),
  preset("blue_photo_studio", "Blue Photo Studio"),
  preset("christmas_photo_studio_02", "Christmas Studio"),
  preset("photo_studio_loft_hall", "Loft Hall"),
  preset("studio_small_03", "Small Studio"),
  preset("studio_dark", "Dark Studio"),
  preset("studio_led", "LED Studio"),
  preset("qwantani_dusk_2_puresky", "Dusk Sky"),
  preset("sunset_fairway", "Sunset Fairway"),
  preset("abstract_gradient_gold", "Gold Gradient"),
  preset("gradient_clean", "Clean Gradient"),
  preset("clay_nature", "Clay Nature"),
  preset("forest", "Forest"),
  preset("fantasy_environment", "Fantasy"),
  preset("voxel_islands", "Voxel Islands"),
  preset("neon_city", "Neon City"),
  preset("neon_light", "Neon Light"),
  preset("industrial", "Industrial"),
  preset("loft_office", "Loft Office"),
  preset("synth_wave", "Synth Wave"),
];

/** 旧程序化预设 id → 真实 env 迁移表（兼容历史 localStorage/代码） */
export const ENV_LEGACY_MAP: Record<string, string> = {
  studio: "neutral_studio",
  bright: "studio_white",
  night: "studio_dark",
  warm: "sunset_fairway",
  sunset: "sunset_fairway",
};

export const envUrl = (map: string): string => {
  if (!map) return "";
  if (map.startsWith("data:") || map.startsWith("http") || map.startsWith("/")) return map;
  const hit = ENV_PRESETS.find((entry) => entry.id === map) ?? ENV_PRESETS.find((entry) => entry.id === ENV_LEGACY_MAP[map]);
  return hit?.url ?? "";
};

export const envName = (map: string): string => {
  if (!map) return "None";
  if (map.startsWith("data:")) return "Custom Upload";
  const hit = ENV_PRESETS.find((entry) => entry.id === map) ?? ENV_PRESETS.find((entry) => entry.id === ENV_LEGACY_MAP[map]);
  return hit?.name ?? map;
};
