/**
 * [INPUT]: 本目录 types.ts（MaterialState/makeLayer/LIGHTING_DEFAULT/initialMaterial）与 effects-config.ts（EffectState）
 * [OUTPUT]: 对外提供 SceneObject 类型、makeObject 工厂与 defaultObjects（对齐 Spline 首页的三件套：粉色圆角卡/珍珠球/金属卡）
 * [POS]: 多物体场景的数据模型；每个物体持有独立 MaterialState 与 EffectState[]，几何类型由 MaterialPreview 提供
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ObjectEffectState } from "./object-effects";
import { makeObjectEffect } from "./object-effects";
import { initialMaterial, LIGHTING_DEFAULT, makeLayer, type LightingState, type MaterialState } from "./types";

export type SceneObject = {
  id: string;
  name: string;
  geometry: "knot" | "sphere" | "torus" | "capsule" | "roundedBox";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  visible: boolean;
  material: MaterialState;
  effects: ObjectEffectState[];
};

let objSeq = 0;
export const nextObjectId = () => `o${++objSeq}_${Math.random().toString(36).slice(2, 6)}`;

export const makeObject = (name: string, geometry: SceneObject["geometry"], position: [number, number, number], material: MaterialState, overrides: Partial<SceneObject> = {}): SceneObject => ({
  id: nextObjectId(),
  name,
  geometry,
  position,
  rotation: [0, 0, 0],
  scale: 1,
  visible: true,
  material,
  effects: [],
  ...overrides,
});

const objectMaterial = (layers: SceneObject["material"]["layers"], lighting: Partial<LightingState> = {}): MaterialState => ({
  ...initialMaterial(),
  layers,
  lighting: { ...LIGHTING_DEFAULT, ...lighting },
  env: { enabled: true, map: "studio_white", exposure: 1, rotation: [0, 0, 0] },
});

/** 对齐 Spline 首页 hero 的默认三件套（浅底俯视：粉色发光卡 / 奶白珍珠 / 黑色亮面卡） */
export const defaultObjects = (): SceneObject[] => {
  const pearlMaterial = objectMaterial([makeLayer("color", { params: { color: "#ffffff" } })], {
    type: "physical",
    roughness: 0.16,
    glass: 0.95,
    refraction: 1.08,
    thickness: 0.3,
    aberration: 0.02,
    blur: 0.14,
  });
  return [
    makeObject(
      "Pink Card",
      "roundedBox",
      [-1.7, 0.42, 0.1],
      objectMaterial(
        [
          makeLayer("color", { params: { color: "#ff3d8f" } }),
          makeLayer("fresnel", { opacity: 22, params: { color: "#ffd1e6", power: 2.8, intensity: 0.4, bias: 0 } }),
        ],
        { type: "physical", roughness: 0.1, metalness: 0, reflectivity: 1 },
      ),
      {
        rotation: [1.15, 0.35, -0.18],
        effects: [makeObjectEffect("dropShadow", { opacity: 100, params: { offsetX: 0, offsetY: 0, blur: 0.45, color: "#ff5ba4", strength: 32 } })],
      },
    ),
    makeObject(
      "Pearl",
      "sphere",
      [2.05, 0.55, -0.5],
      { ...pearlMaterial, env: { ...pearlMaterial.env, map: "christmas_photo_studio_02" } },
      { scale: 0.48 },
    ),
    makeObject(
      "Dark Card",
      "roundedBox",
      [-0.85, -1.55, 0.95],
      objectMaterial(
        [
          makeLayer("color", { params: { color: "#1a1a1d" } }),
          makeLayer("fresnel", { opacity: 18, params: { color: "#cfcfd8", power: 3.2, intensity: 0.5, bias: 0 } }),
        ],
        { type: "physical", roughness: 0.16, metalness: 0, reflectivity: 1.1 },
      ),
      { rotation: [1.25, -0.45, 0.12], scale: 1.02 },
    ),
  ];
}

let newObjCount = 0;
export const makeNewObject = (count: number): SceneObject =>
  makeObject(`Object ${count + 1}`, "sphere", [((count % 3) - 1) * 1.9, ((count % 2) * 1.5 - 0.4), 0.4 * ((count % 2) * 2 - 1)], objectMaterial([makeLayer("color", { params: { color: "#8f9bb3" } })], { roughness: 0.25 }));

export const GEOMETRY_LABEL: Record<SceneObject["geometry"], string> = {
  knot: "Knot",
  sphere: "Sphere",
  torus: "Torus",
  capsule: "Capsule",
  roundedBox: "Card",
};
