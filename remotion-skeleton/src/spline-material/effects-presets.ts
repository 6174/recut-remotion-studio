/**
 * [INPUT]: 本目录 effects-config.ts 的 EffectState/makeEffect
 * [OUTPUT]: 对外提供 EffectPreset（可序列化 spec）、EFFECT_PRESETS 与 buildEffectPreset 工厂
 * [POS]: Effects 面板的预设库；套用时替换整个效果栈并经 makeEffect 重新分配 id，与 Material 预设同构
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { EffectKind, EffectState, makeEffect } from "./effects-config";

export type EffectPreset = {
  id: string;
  name: string;
  category: string;
  swatch: [string, string];
  spec: {
    effects: Array<{ kind: EffectKind; overrides?: Partial<Omit<EffectState, "id">> }>;
  };
};

export const buildEffectPreset = (preset: EffectPreset): EffectState[] =>
  preset.spec.effects.map(({ kind, overrides }) => makeEffect(kind, overrides));

const fx = (id: string, name: string, swatch: [string, string], effects: EffectPreset["spec"]["effects"]): EffectPreset => ({
  id,
  name,
  category: "Stack",
  swatch,
  spec: { effects },
});

export const EFFECT_PRESETS: EffectPreset[] = [
  fx("cinematic", "Cinematic", ["#3a4a58", "#12181e"], [
    { kind: "colorAdjust", overrides: { params: { brightness: -0.02, contrast: 1.18, saturation: 0.86, hue: 0 } } },
    { kind: "vignette", overrides: { opacity: 80, params: { offset: 0.38, darkness: 0.55 } } },
    { kind: "grain", overrides: { opacity: 55, params: { intensity: 0.16, size: 1.6, animated: "on" } } },
  ]),
  fx("dreamy", "Dreamy", ["#ffe3f0", "#b89fd9"], [
    { kind: "bloom", overrides: { params: { threshold: 0.45, intensity: 1.15, blur: 2.2 } } },
    { kind: "chromatic", overrides: { opacity: 45, params: { amount: 0.08 } } },
    { kind: "grain", overrides: { opacity: 35, params: { intensity: 0.1, size: 2, animated: "on" } } },
  ]),
  fx("retro-vhs", "Retro VHS", ["#4a3ad9", "#d93a6e"], [
    { kind: "noise", overrides: { opacity: 55, params: { intensity: 0.3 } } },
    { kind: "chromatic", overrides: { params: { amount: 0.22 } } },
    { kind: "colorAdjust", overrides: { params: { brightness: 0, contrast: 1.08, saturation: 1.3, hue: 0.02 } } },
    { kind: "glitch", overrides: { opacity: 70, params: { amount: 0.24, speed: 0.8 } } },
  ]),
  fx("noir", "Noir", ["#2c2c2c", "#0a0a0a"], [
    { kind: "colorAdjust", overrides: { params: { brightness: 0, contrast: 1.35, saturation: 0.05, hue: 0 } } },
    { kind: "grain", overrides: { params: { intensity: 0.3, size: 1.2, animated: "on" } } },
    { kind: "vignette", overrides: { params: { offset: 0.45, darkness: 0.75 } } },
  ]),
  fx("neon-night", "Neon Night", ["#7a2ee8", "#2ee8d9"], [
    { kind: "colorAdjust", overrides: { params: { brightness: -0.05, contrast: 1.15, saturation: 1.45, hue: 0.55 } } },
    { kind: "bloom", overrides: { params: { threshold: 0.5, intensity: 1.2, blur: 1.6 } } },
    { kind: "chromatic", overrides: { opacity: 60, params: { amount: 0.12 } } },
    { kind: "vignette", overrides: { opacity: 70, params: { offset: 0.3, darkness: 0.6 } } },
  ]),
  fx("pixel-art", "Pixel Art", ["#8ae06b", "#2f6e3c"], [
    { kind: "pixelate", overrides: { params: { pixelSize: 28 } } },
    { kind: "colorAdjust", overrides: { params: { brightness: 0, contrast: 1.1, saturation: 1.25, hue: 0 } } },
  ]),
  fx("film-35mm", "Film 35mm", ["#d9c9a8", "#4a3f30"], [
    { kind: "grain", overrides: { params: { intensity: 0.22, size: 1.8, animated: "on" } } },
    { kind: "vignette", overrides: { opacity: 65, params: { offset: 0.32, darkness: 0.45 } } },
    { kind: "bloom", overrides: { opacity: 45, params: { threshold: 0.68, intensity: 0.5, blur: 1.8 } } },
  ]),
  fx("frost", "Frost", ["#cfe8f2", "#6e93a8"], [
    { kind: "blur", overrides: { params: { amount: 6 } } },
    { kind: "bloom", overrides: { opacity: 70, params: { threshold: 0.55, intensity: 0.9, blur: 2 } } },
    { kind: "colorAdjust", overrides: { opacity: 80, params: { brightness: 0.03, contrast: 0.96, saturation: 0.9, hue: 0 } } },
  ]),
];
