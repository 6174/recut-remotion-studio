/**
 * [INPUT]: 本目录 types.ts 的图层 schema 与 makeLayer 工厂
 * [OUTPUT]: 对外提供 MaterialPreset（可序列化 spec）、SPLINE_PRESETS 预设库与 buildPreset 工厂
 * [POS]: spline-material 的预配置材质来源；spec 必须可 JSON 持久化（My Materials 存 localStorage），套用时经 buildPreset 重新分配 id
 *        质感配方基于 PBR + 程序化环境：Candy = 低粗糙度果冻光面，Metal = metalness 1 + env 反射（旋纹走 bumpMap noise）
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { LayerKind, LayerState, LightingState, makeLayer } from "./types";

export type PresetSpec = {
  opacity?: number;
  layers: Array<{ kind: LayerKind; overrides?: Partial<Omit<LayerState, "id">> }>;
  lighting?: Partial<LightingState>;
};

export type MaterialPreset = {
  id: string;
  name: string;
  library: "spline" | "mine";
  category: string;
  /** torus 缩略图双色：[高光/主色, 基色/暗边] */
  swatch: [string, string];
  locked?: boolean;
  spec: PresetSpec;
};

export const buildPreset = (preset: MaterialPreset) => {
  const spec = preset.spec;
  return {
    opacity: spec.opacity ?? 100,
    layers: spec.layers.map(({ kind, overrides }) => makeLayer(kind, overrides)),
    lighting: {
      enabled: true,
      strength: 100,
      type: "physical",
      color: "#ffffff",
      shining: 48,
      roughness: 0.16,
      metalness: 0,
      reflectivity: 1,
      bumpMap: "none",
      occlusion: true,
      ...(spec.lighting ?? {}),
    } as LightingState,
  };
};

const preset = (id: string, name: string, category: string, swatch: [string, string], spec: PresetSpec, locked = true): MaterialPreset => ({
  id,
  name,
  library: "spline",
  category,
  swatch,
  locked,
  spec,
});

/** 糖果光面：纯色 + 白色 fresnel 边 + 低粗糙度 physical */
const candy = (id: string, name: string, color: string, dark: string) =>
  preset(`candy-${id}`, name, "Candy", [color, dark], {
    layers: [
      { kind: "color", overrides: { params: { color } } },
      { kind: "fresnel", overrides: { opacity: 35, params: { color: "#ffffff", power: 2.6, intensity: 0.55, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.07, metalness: 0, reflectivity: 1.05 },
  });

/** 金属：metalness 1 + env 反射；swirl 变体走 bumpMap noise */
const metal = (id: string, name: string, color: string, dark: string, roughness: number, extra: Partial<LightingState> = {}, layers: PresetSpec["layers"] = []) =>
  preset(`metal-${id}`, name, "Metal", [color, dark], {
    layers: [{ kind: "color", overrides: { params: { color } } }, ...layers],
    lighting: { type: "physical", roughness, metalness: 1, reflectivity: 1.25, ...extra },
  });

/** 与 Spline Library 对齐的预设集：Gradient / Candy / Metal / Special */
export const SPLINE_PRESETS: MaterialPreset[] = [
  /* ---------- Gradient ---------- */
  preset("gradient-pastel-shiny-01", "Gradient Pastel Shiny 01", "Gradient", ["#ffb199", "#ff8177"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#ffb199", colorB: "#ff8177", axes: "y", start: -1.1, end: 0.9 } } },
      { kind: "fresnel", overrides: { opacity: 55, params: { color: "#ffffff", power: 2.6, intensity: 0.85, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.08, reflectivity: 1.1 },
  }),
  preset("gradient-pastel-shiny-03", "Gradient Pastel Shiny 03", "Gradient", ["#96fbc4", "#f9f586"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#96fbc4", colorB: "#f9f586", axes: "y", start: -1.1, end: 0.9 } } },
      { kind: "fresnel", overrides: { opacity: 55, params: { color: "#ffffff", power: 2.6, intensity: 0.85, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.08, reflectivity: 1.1 },
  }),
  preset("gradient-pastel-shiny-04", "Gradient Pastel Shiny 04", "Gradient", ["#a1c4fd", "#c2e9fb"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#a1c4fd", colorB: "#c2e9fb", axes: "y", start: -1.1, end: 0.9 } } },
      { kind: "fresnel", overrides: { opacity: 55, params: { color: "#ffffff", power: 2.6, intensity: 0.85, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.08, reflectivity: 1.1 },
  }),
  preset("gradient-contrast-01", "Gradient Contrast 01", "Gradient", ["#ff9a5a", "#7d2ae8"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#ff9a5a", colorB: "#7d2ae8", axes: "y", start: -1, end: 1 } } },
      { kind: "fresnel", overrides: { opacity: 40, params: { color: "#ffffff", power: 3, intensity: 0.7, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.1, reflectivity: 1.05 },
  }),
  preset("gradient-contrast-04", "Gradient Contrast 04", "Gradient", ["#6a11cb", "#2575fc"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#6a11cb", colorB: "#2575fc", axes: "y", start: -1, end: 1 } } },
      { kind: "fresnel", overrides: { opacity: 40, params: { color: "#ffffff", power: 3, intensity: 0.7, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.1, reflectivity: 1.05 },
  }),

  /* ---------- Candy（对应 Spline 的光面糖果 torus） ---------- */
  candy("deep-blue", "Candy Deep Blue", "#2c3fd8", "#101a6e"),
  candy("lime", "Candy Lime", "#a8e063", "#3f7d20"),
  candy("red", "Candy Red", "#e8281e", "#6e0a06"),
  candy("orange", "Candy Orange", "#f2790f", "#7a3704"),
  candy("cobalt", "Candy Cobalt", "#2f6bff", "#0c2a7a"),
  candy("sky", "Candy Sky", "#5ec8f2", "#1a6e94"),
  candy("magenta", "Candy Magenta", "#e93cac", "#70104f"),
  candy("violet", "Candy Violet", "#8b3df0", "#3c1268"),

  /* ---------- Metal（对应 Spline 的金属 torus；Swirl 走 bump noise） ---------- */
  metal("silver", "Metal Silver", "#d9d9de", "#4c4c52", 0.09),
  metal("black-gloss", "Metal Black Gloss", "#26262a", "#050506", 0.14),
  metal("chrome-swirl", "Metal 8 Swirl", "#e8e8ec", "#3a3a40", 0.22, { bumpMap: "noise" }),
  metal("brushed", "Metal Brushed Steel", "#b8bcc4", "#3c3f46", 0.32, { bumpMap: "noise" }),
  metal("dark-chrome", "Metal Dark Chrome", "#6e7076", "#17181c", 0.07),
  metal("bronze", "Metal Bronze", "#b4783a", "#3f2408", 0.16),
  metal("gold", "Metal Gold", "#f0b342", "#6e4408", 0.1),

  /* ---------- Special ---------- */
  preset("glass-clear", "Clear Glass", "Special", ["#eef6fb", "#8fb0c4"], {
    opacity: 96,
    layers: [{ kind: "glass", overrides: { params: { color: "#ffffff", transmission: 0.9, refraction: 1.15, thickness: 0.5, aberration: 0.06, roughness: 0.05 } } }],
    lighting: { type: "physical", roughness: 0.05 },
  }),
  preset("glass-frosted", "Frosted Glass", "Special", ["#cfe8f2", "#8fb8c9"], {
    opacity: 92,
    layers: [{ kind: "glass", overrides: { params: { color: "#dfeef5", transmission: 0.82, refraction: 1.09, thickness: 0.7, aberration: 0.02, roughness: 0.3 } } }],
    lighting: { type: "physical", roughness: 0.3 },
  }),
  preset("iridescent-swirl", "Iridescent Swirl", "Special", ["#2a3f3c", "#0d1413"], {
    layers: [
      {
        kind: "noise",
        overrides: {
          params: {
            mode: "color",
            type: "curl",
            scale: 1.6,
            movement: 0.25,
            colorA: "#0e1a18",
            colorB: "#1f4f46",
            colorC: "#3fa070",
            colorD: "#b7f0d8",
            distortion: [1.8, 2.6],
            factorA: [1.7, 9.2],
            factorB: [8.3, 2.8],
          },
        },
      },
      { kind: "fresnel", overrides: { opacity: 65, params: { color: "#9fe8ff", power: 2.4, intensity: 0.8, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.12, metalness: 0.35, reflectivity: 1.3, bumpMap: "noise" },
  }),
  preset("nebula-pearl", "Nebula Pearl", "Special", ["#d9c8ff", "#9fe8ff"], {
    layers: [
      {
        kind: "noise",
        overrides: {
          params: {
            mode: "color",
            type: "simplex",
            scale: 1.4,
            movement: 0.4,
            colorA: "#d9c8ff",
            colorB: "#9fe8ff",
            colorC: "#ffd9ec",
            colorD: "#ffffff",
            distortion: [1.4, 2.2],
            factorA: [1.7, 9.2],
            factorB: [8.3, 2.8],
          },
        },
      },
      { kind: "dust", overrides: { opacity: 70, params: { color: "#ffffff", scale: 22, coverage: 0.14 } } },
      { kind: "fresnel", overrides: { opacity: 60, params: { color: "#ffffff", power: 2.4, intensity: 0.9, bias: 0 } } },
    ],
    lighting: { type: "physical", roughness: 0.15, metalness: 0.2, reflectivity: 1.15 },
  }),
  preset("soft-clay", "Soft Clay", "Special", ["#e3c8b8", "#c9a18c"], {
    layers: [
      { kind: "color", overrides: { params: { color: "#e3c8b8" } } },
      { kind: "cavity", overrides: { opacity: 45, params: { scale: 2.2, threshold: 0.5, strength: 0.7 } } },
    ],
    lighting: { type: "physical", roughness: 0.62, metalness: 0, reflectivity: 0.7 },
  }),
  preset("toon-shade", "Toon Shade", "Special", ["#ff9060", "#c14a33"], {
    layers: [
      { kind: "toon", overrides: { params: { color: "#ff9060", steps: 3 } } },
      { kind: "outline", overrides: { params: { color: "#1a0f0a", width: 0.07, threshold: 0.3 } } },
    ],
    lighting: { type: "toon" },
  }),
];
