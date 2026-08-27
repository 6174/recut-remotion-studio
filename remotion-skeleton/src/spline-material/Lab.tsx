/**
 * [INPUT]: React、本目录 MaterialPanel / EffectsPanel / ScenePanel / MaterialPreview / scene-model / presets / effects-presets
 * [OUTPUT]: 对外提供 MaterialLab：实验页根组件——多物体场景、点击选择、面板路由与状态编排
 * [POS]: spline-material.html 的根组件；未选中 = Scene + 全局 Effects，选中 = 该物体 Material + 该物体 Effects；
 *        渲染时的效果栈 = 各物体 effects（按物体顺序）+ 全局 effects
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { EffectsPanel } from "./EffectsPanel";
import { MaterialPanel, type PanelActions } from "./MaterialPanel";
import { MaterialPreview, VIEW_SCENES, type SceneKind } from "./MaterialPreview";
import { ObjectEffectsPanel } from "./ObjectEffectsPanel";
import { ScenePanel } from "./ScenePanel";
import { buildPreset, SPLINE_PRESETS, type MaterialPreset } from "./presets";
import { defaultObjects, makeNewObject, type SceneObject } from "./scene-model";
import { initialEffects, makeEffect, type EffectKind, type EffectState } from "./effects-config";
import { makeObjectEffect, type ObjectEffectKind, type ObjectEffectState } from "./object-effects";
import { LAYER_KIND_META, makeLayer, SCENE_LIGHT_DEFAULT, type LayerKind, type LayerState, type MaterialState, type SceneLightState } from "./types";

const STORE_KEY = "spline-material-lab.my-materials";

const loadMine = (): MaterialPreset[] => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as MaterialPreset[]) : [];
  } catch {
    return [];
  }
};

const swatchOf = (layers: LayerState[]): [string, string] => {
  for (const layer of layers) {
    const meta = LAYER_KIND_META[layer.kind];
    const key = meta.hexKey ?? meta.fields.find((field) => field.type === "color")?.key;
    if (key && typeof layer.params[key] === "string") {
      const first = layer.params[key] as string;
      const colorField = meta.fields.filter((field) => field.type === "color")[1];
      const second = colorField && typeof layer.params[colorField.key] === "string" ? (layer.params[colorField.key] as string) : first;
      return [first, second];
    }
  }
  return ["#9aa0a6", "#3c3c3c"];
};

type Tab = "scene" | "material" | "effects";

export const MaterialLab: FC = () => {
  const [objects, setObjects] = useState<SceneObject[]>(defaultObjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [globalEffects, setGlobalEffects] = useState<EffectState[]>(initialEffects);
  const [scene, setScene] = useState<SceneKind>("dark");
  const [sceneLight, setSceneLight] = useState<SceneLightState>({ ...SCENE_LIGHT_DEFAULT });
  const [tonemapping, setTonemapping] = useState<boolean>(true);
  const [tab, setTab] = useState<Tab>("scene");
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [myMaterials, setMyMaterials] = useState<MaterialPreset[]>(loadMine);
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  const selected = objects.find((object) => object.id === selectedId) ?? null;

  useEffect(() => {
    setTab(selected ? "material" : "scene");
  }, [selectedId]);

  const persistMine = useCallback((next: MaterialPreset[]) => {
    setMyMaterials(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* 隐私模式等场景下允许失败，仅内存保留 */
    }
  }, []);

  /* ---------- 物体级操作 ---------- */

  const patchObject = useCallback((id: string, patch: Partial<SceneObject> | ((object: SceneObject) => Partial<SceneObject>)) => {
    setObjects((state) => state.map((object) => (object.id === id ? { ...object, ...(typeof patch === "function" ? patch(object) : patch) } : object)));
  }, []);

  const patchMaterial = useCallback(
    (id: string, patch: Partial<MaterialState> | ((material: MaterialState) => Partial<MaterialState>)) => {
      setObjects((state) =>
        state.map((object) =>
          object.id === id ? { ...object, material: { ...object.material, ...(typeof patch === "function" ? patch(object.material) : patch) } } : object,
        ),
      );
    },
    [],
  );

  const objectActions = useCallback(
    (id: string): PanelActions => ({
      updateMaterial: (patch) => patchMaterial(id, (material) => ({ ...material, ...patch })),
      updateLayer: (layerId, patch) =>
        patchMaterial(id, (material) => ({
          ...material,
          layers: material.layers.map((layer) => (layer.id === layerId ? { ...layer, ...patch } : layer)),
        })),
      updateLayerParam: (layerId, key, value) =>
        patchMaterial(id, (material) => ({
          ...material,
          layers: material.layers.map((layer) => (layer.id === layerId ? { ...layer, params: { ...layer.params, [key]: value } } : layer)),
        })),
      addLayer: (kind) =>
        patchMaterial(id, (material) => ({ ...material, layers: [...material.layers, makeLayer(kind)] })),
      setLayerKind: (layerId, kind) =>
        patchMaterial(id, (material) => ({
          ...material,
          layers: material.layers.map((layer) => {
            if (layer.id !== layerId) return layer;
            const meta = LAYER_KIND_META[kind];
            return { ...layer, kind, name: meta.label, params: { ...meta.defaults } };
          }),
        })),
      removeLayer: (layerId) =>
        patchMaterial(id, (material) => ({ ...material, layers: material.layers.filter((layer) => layer.id !== layerId) })),
      updateLighting: (patch) => patchMaterial(id, (material) => ({ ...material, lighting: { ...material.lighting, ...patch } })),
      updateEnv: (patch) => patchMaterial(id, (material) => ({ ...material, env: { ...material.env, ...patch } })),
    }),
    [patchMaterial],
  );

  const onTransform = useCallback(
    (id: string, transform: Pick<SceneObject, "position" | "rotation" | "scale">) => patchObject(id, transform),
    [patchObject],
  );

  const addObject = useCallback(() => {
    setObjects((state) => [...state, makeNewObject(state.length)]);
  }, []);

  const removeObject = useCallback(
    (id: string) => {
      setObjects((state) => state.filter((object) => object.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId],
  );

  /* ---------- Effects：未选中 = 全局 post；选中 = 物体级效果 ---------- */

  const updateEffect = useCallback(
    (id: string, patch: Partial<EffectState>) => setGlobalEffects((state) => state.map((effect) => (effect.id === id ? { ...effect, ...patch } : effect))),
    [],
  );
  const updateEffectParam = useCallback(
    (id: string, key: string, value: string | number | number[]) =>
      setGlobalEffects((state) => state.map((effect) => (effect.id === id ? { ...effect, params: { ...effect.params, [key]: value } } : effect))),
    [],
  );
  const addEffect = useCallback((kind: EffectKind) => setGlobalEffects((state) => [...state, makeEffect(kind)]), []);
  const removeEffect = useCallback((id: string) => setGlobalEffects((state) => state.filter((effect) => effect.id !== id)), []);
  const applyEffectPreset = useCallback((effects: EffectState[]) => setGlobalEffects(effects), []);

  const updateObjectEffect = useCallback(
    (id: string, patch: Partial<ObjectEffectState>) => {
      if (!selected) return;
      patchObject(selected.id, (object) => ({ effects: object.effects.map((effect) => (effect.id === id ? { ...effect, ...patch } : effect)) }));
    },
    [patchObject, selected],
  );
  const updateObjectEffectParam = useCallback(
    (id: string, key: string, value: string | number | number[]) => {
      if (!selected) return;
      patchObject(selected.id, (object) => ({
        effects: object.effects.map((effect) => (effect.id === id ? { ...effect, params: { ...effect.params, [key]: value } } : effect)),
      }));
    },
    [patchObject, selected],
  );
  const addObjectEffect = useCallback(
    (kind: ObjectEffectKind) => {
      if (!selected) return;
      patchObject(selected.id, (object) => ({ effects: [...object.effects, makeObjectEffect(kind)] }));
    },
    [patchObject, selected],
  );
  const removeObjectEffect = useCallback(
    (id: string) => {
      if (!selected) return;
      patchObject(selected.id, (object) => ({ effects: object.effects.filter((effect) => effect.id !== id) }));
    },
    [patchObject, selected],
  );

  /* ---------- Material 预设（作用于选中物体） ---------- */

  const applyPreset = useCallback(
    (preset: MaterialPreset) => {
      if (!selected) return;
      const built = buildPreset(preset);
      patchMaterial(selected.id, (material) => ({ ...material, opacity: built.opacity, layers: built.layers, lighting: built.lighting }));
      setAppliedPresetId(preset.id);
    },
    [patchMaterial, selected],
  );

  const savePreset = useCallback(() => {
    if (!selected) return;
    const source = selected.material;
    const name = `My Material ${myMaterials.length + 1}`;
    const preset: MaterialPreset = {
      id: `mine-${Date.now()}`,
      name,
      library: "mine",
      category: "Custom",
      swatch: swatchOf(source.layers),
      spec: {
        opacity: source.opacity,
        layers: source.layers.map((layer) => ({
          kind: layer.kind,
          overrides: { mode: layer.mode, opacity: layer.opacity, visible: layer.visible, params: { ...layer.params } },
        })),
        lighting: { ...source.lighting },
      },
    };
    persistMine([...myMaterials, preset]);
  }, [myMaterials, persistMine, selected]);

  const deletePreset = useCallback(
    (id: string) => {
      persistMine(myMaterials.filter((preset) => preset.id !== id));
      if (appliedPresetId === id) setAppliedPresetId(null);
    },
    [appliedPresetId, myMaterials, persistMine],
  );

  const effectsCount = activeEffects.length;

  return (
    <div className="lab">
      <div className={`viewport ${VIEW_SCENES[scene].light ? "light" : ""}`}>
        <MaterialPreview
          objects={objects}
          selectedId={selectedId}
          scene={scene}
          globalEffects={globalEffects}
          transformMode={transformMode}
          sceneLight={sceneLight}
          tonemapping={tonemapping}
          onSelect={setSelectedId}
          onTransform={onTransform}
        />
        <div className="viewport-toolbar">
          <div className="vt-group">
            {(Object.keys(VIEW_SCENES) as SceneKind[]).map((kind) => (
              <button key={kind} className={scene === kind ? "on" : ""} onClick={() => setScene(kind)}>
                {VIEW_SCENES[kind].label}
              </button>
            ))}
          </div>
        </div>
        {selected ? (
          <div className="object-toolbar">
            <span className="object-name">{selected.name}</span>
            <span className="vt-divider" />
            {(["translate", "rotate", "scale"] as const).map((mode) => (
              <button key={mode} className={transformMode === mode ? "on" : ""} onClick={() => setTransformMode(mode)}>
                {mode === "translate" ? "Move" : mode === "rotate" ? "Rotate" : "Scale"}
              </button>
            ))}
            <span className="vt-divider" />
            <button onClick={() => setSelectedId(null)}>Deselect</button>
          </div>
        ) : null}
        <div className="viewport-hint">
          {selected ? "拖拽 gizmo 调整物体 · 点击空白取消选择" : "点击物体选择 · Spline Library 26 presets"}
        </div>
      </div>

      <div className="spanel-col">
        <div className="spanel-tabs">
          {selected ? (
            <>
              <button className={tab === "material" ? "on" : ""} onClick={() => setTab("material")}>
                Material
              </button>
              <button className={tab === "effects" ? "on" : ""} onClick={() => setTab("effects")}>
                Effects{effectsCount ? ` ${effectsCount}` : ""}
              </button>
            </>
          ) : (
            <>
              <button className={tab === "scene" ? "on" : ""} onClick={() => setTab("scene")}>
                Scene
              </button>
              <button className={tab === "effects" ? "on" : ""} onClick={() => setTab("effects")}>
                Effects{effectsCount ? ` ${effectsCount}` : ""}
              </button>
            </>
          )}
        </div>
        {selected && tab === "material" ? (
          <MaterialPanel
            material={selected.material}
            actions={objectActions(selected.id)}
            myMaterials={myMaterials}
            appliedPresetId={appliedPresetId}
            onApplyPreset={applyPreset}
            onSavePreset={savePreset}
            onDeletePreset={deletePreset}
          />
        ) : null}
        {!selected && tab === "scene" ? (
          <ScenePanel
            objects={objects}
            selectedId={selectedId}
            scene={scene}
            sceneLight={sceneLight}
            tonemapping={tonemapping}
            onSelect={setSelectedId}
            onSelectScene={setScene}
            onChangeLight={(patch) => setSceneLight((state) => ({ ...state, ...patch }))}
            onToggleTonemapping={setTonemapping}
            onChangeGeometry={(id, geometry) => patchObject(id, { geometry })}
            onToggleObject={(id) => patchObject(id, (object) => ({ visible: !object.visible }))}
            onRemoveObject={removeObject}
            onAddObject={addObject}
          />
        ) : null}
        {tab === "effects" ? (
          <EffectsPanel
            effects={activeEffects}
            onUpdate={updateEffect}
            onUpdateParam={updateEffectParam}
            onAdd={addEffect}
            onRemove={removeEffect}
            onApplyPreset={applyEffectPreset}
          />
        ) : null}
      </div>
    </div>
  );
};

export type { LayerKind };
