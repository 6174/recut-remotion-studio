/**
 * [INPUT]: 本目录 types.ts 的图层 schema 与 makeLayer 工厂
 * [OUTPUT]: 对外提供 MaterialPreset（可序列化 spec）、SPLINE_PRESETS 预设库与 buildPreset 工厂
 * [POS]: spline-material 的预配置材质来源；spec 必须可 JSON 持久化（My Materials 存 localStorage），套用时经 buildPreset 重新分配 id
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
  /** 预览球的双色近似 */
  swatch: [string, string];
  locked?: boolean;
  spec: PresetSpec;
};

export const buildPreset = (preset: MaterialPreset) => {
  const spec = preset.spec;
  return {
    opacity: spec.opacity ?? 100,
    layers: spec.layers.map(({ kind, overrides }) => makeLayer(kind, overrides)),
    lighting: { enabled: true, strength: 100, type: "phong", color: "#ffffff", shining: 48, bumpMap: "none", occlusion: true, ...(spec.lighting ?? {}) } as LightingState,
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

/** 与截图一致的 Spline Library 预设 + 若干引擎能力演示 */
export const SPLINE_PRESETS: MaterialPreset[] = [
  preset("gradient-pastel-shiny-01", "Gradient Pastel Shiny 01", "Gradient", ["#ffb199", "#ff8177"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#ffb199", colorB: "#ff8177", axes: "y", start: -1.1, end: 0.9 } } },
      { kind: "fresnel", overrides: { opacity: 55, params: { color: "#ffffff", power: 2.6, intensity: 0.85, bias: 0 } } },
    ],
    lighting: { type: "physical", shining: 160 },
  }),
  preset("gradient-pastel-shiny-03", "Gradient Pastel Shiny 03", "Gradient", ["#96fbc4", "#f9f586"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#96fbc4", colorB: "#f9f586", axes: "y", start: -1.1, end: 0.9 } } },
      { kind: "fresnel", overrides: { opacity: 55, params: { color: "#ffffff", power: 2.6, intensity: 0.85, bias: 0 } } },
    ],
    lighting: { type: "physical", shining: 160 },
  }),
  preset("gradient-pastel-shiny-04", "Gradient Pastel Shiny 04", "Gradient", ["#a1c4fd", "#c2e9fb"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#a1c4fd", colorB: "#c2e9fb", axes: "y", start: -1.1, end: 0.9 } } },
      { kind: "fresnel", overrides: { opacity: 55, params: { color: "#ffffff", power: 2.6, intensity: 0.85, bias: 0 } } },
    ],
    lighting: { type: "physical", shining: 160 },
  }),
  preset("gradient-contrast-01", "Gradient Contrast 01", "Gradient", ["#ff9a5a", "#7d2ae8"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#ff9a5a", colorB: "#7d2ae8", axes: "y", start: -1, end: 1 } } },
      { kind: "fresnel", overrides: { opacity: 40, params: { color: "#ffffff", power: 3, intensity: 0.7, bias: 0 } } },
    ],
    lighting: { type: "phong", shining: 96 },
  }),
  preset("gradient-contrast-02", "Gradient Contrast 02", "Gradient", ["#11998e", "#38ef7d"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#11998e", colorB: "#38ef7d", axes: "y", start: -1, end: 1 } } },
      { kind: "fresnel", overrides: { opacity: 40, params: { color: "#ffffff", power: 3, intensity: 0.7, bias: 0 } } },
    ],
    lighting: { type: "phong", shining: 96 },
  }),
  preset("gradient-contrast-03", "Gradient Contrast 03", "Gradient", ["#43cea2", "#f9d423"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#43cea2", colorB: "#f9d423", axes: "y", start: -1, end: 1 } } },
      { kind: "fresnel", overrides: { opacity: 40, params: { color: "#ffffff", power: 3, intensity: 0.7, bias: 0 } } },
    ],
    lighting: { type: "phong", shining: 96 },
  }),
  preset("gradient-contrast-04", "Gradient Contrast 04", "Gradient", ["#6a11cb", "#2575fc"], {
    layers: [
      { kind: "gradient", overrides: { params: { colorA: "#6a11cb", colorB: "#2575fc", axes: "y", start: -1, end: 1 } } },
      { kind: "fresnel", overrides: { opacity: 40, params: { color: "#ffffff", power: 3, intensity: 0.7, bias: 0 } } },
    ],
    lighting: { type: "phong", shining: 96 },
  }),
  preset("glass-frosted", "Frosted Glass", "Glass", ["#cfe8f2", "#8fb8c9"], {
    opacity: 45,
    layers: [
      { kind: "glass", overrides: { params: { color: "#cfe8f2", edge: 0.75 } } },
      { kind: "fresnel", overrides: { opacity: 70, params: { color: "#ffffff", power: 2.2, intensity: 0.9, bias: 0 } } },
    ],
    lighting: { type: "physical", shining: 200 },
  }),
  preset("chrome-metal", "Chrome Metal", "Metal", ["#f4f4f4", "#4a4a4a"], {
    layers: [
      { kind: "matcap", overrides: { params: { light: "#ffffff", dark: "#4a4a4a", rim: 0.85 } } },
      { kind: "reflection", overrides: { opacity: 45, params: { sky: "#e8f1ff", ground: "#2c2c2c", power: 1.4 } } },
    ],
    lighting: { type: "phong", shining: 220 },
  }),
  preset("soft-clay", "Soft Clay", "Matte", ["#e3c8b8", "#c9a18c"], {
    layers: [
      { kind: "color", overrides: { params: { color: "#e3c8b8" } } },
      { kind: "cavity", overrides: { opacity: 45, params: { scale: 2.2, threshold: 0.5, strength: 0.7 } } },
    ],
    lighting: { type: "lambert" },
  }),
  preset("toon-shade", "Toon Shade", "Toon", ["#ff9060", "#c14a33"], {
    layers: [
      { kind: "toon", overrides: { params: { color: "#ff9060", steps: 3 } } },
      { kind: "outline", overrides: { params: { color: "#1a0f0a", width: 0.07, threshold: 0.3 } } },
    ],
    lighting: { type: "toon" },
  }),
  preset("iridescent-pearl", "Iridescent Pearl", "Special", ["#d9c8ff", "#9fe8ff"], {
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
      { kind: "fresnel", overrides: { opacity: 60, params: { color: "#ffffff", power: 2.4, intensity: 0.9, bias: 0 } } },
    ],
    lighting: { type: "physical", shining: 140 },
  }),
  preset("grainy-matte", "Grainy Matte", "Special", ["#b8b2a8", "#6e6a62"], {
    layers: [
      { kind: "color", overrides: { params: { color: "#b8b2a8" } } },
      {
        kind: "noise",
        overrides: {
          mode: "multiply",
          params: {
            mode: "color",
            type: "perlin",
            scale: 6,
            movement: 0,
            colorA: "#8f8a82",
            colorB: "#b8b2a8",
            colorC: "#d8d3ca",
            colorD: "#e8e4dc",
            distortion: [0.4, 1],
            factorA: [1, 1],
            factorB: [1, 1],
          },
        },
      },
    ],
    lighting: { type: "lambert" },
  }),
];
