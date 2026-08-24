/**
 * [INPUT]: React、本目录 MaterialPanel / MaterialPreview / presets / types
 * [OUTPUT]: 对外提供 MaterialLab：实验页整页布局与全部状态编排（图层编辑、预设套用、My Materials 持久化）
 * [POS]: spline-material.html 的根组件；把面板动作翻译成不可变状态更新
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCallback, useMemo, useState, type FC } from "react";
import { MaterialPanel, type PanelActions } from "./MaterialPanel";
import { MaterialPreview, type GeometryKind } from "./MaterialPreview";
import { buildPreset, SPLINE_PRESETS, type MaterialPreset } from "./presets";
import { initialMaterial, LAYER_KIND_META, makeLayer, type LayerKind, type LayerState, type MaterialState } from "./types";

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

export const MaterialLab: FC = () => {
  const [material, setMaterial] = useState<MaterialState>(initialMaterial);
  const [geometry, setGeometry] = useState<GeometryKind>("knot");
  const [myMaterials, setMyMaterials] = useState<MaterialPreset[]>(loadMine);
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  const persistMine = useCallback((next: MaterialPreset[]) => {
    setMyMaterials(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* 隐私模式等场景下允许失败，仅内存保留 */
    }
  }, []);

  const actions = useMemo<PanelActions>(
    () => ({
      updateMaterial: (patch) => setMaterial((state) => ({ ...state, ...patch })),
      updateLayer: (id, patch) =>
        setMaterial((state) => ({ ...state, layers: state.layers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)) })),
      updateLayerParam: (id, key, value) =>
        setMaterial((state) => ({
          ...state,
          layers: state.layers.map((layer) => (layer.id === id ? { ...layer, params: { ...layer.params, [key]: value } } : layer)),
        })),
      addLayer: (kind) => setMaterial((state) => ({ ...state, layers: [...state.layers, makeLayer(kind)] })),
      setLayerKind: (id, kind) =>
        setMaterial((state) => ({
          ...state,
          layers: state.layers.map((layer) => {
            if (layer.id !== id) return layer;
            const meta = LAYER_KIND_META[kind];
            return { ...layer, kind, name: meta.label, params: { ...meta.defaults } };
          }),
        })),
      removeLayer: (id) => setMaterial((state) => ({ ...state, layers: state.layers.filter((layer) => layer.id !== id) })),
      updateLighting: (patch) => setMaterial((state) => ({ ...state, lighting: { ...state.lighting, ...patch } })),
    }),
    [],
  );

  const applyPreset = useCallback((preset: MaterialPreset) => {
    const built = buildPreset(preset);
    setMaterial((state) => ({ ...state, opacity: built.opacity, layers: built.layers, lighting: built.lighting }));
    setAppliedPresetId(preset.id);
  }, []);

  const savePreset = useCallback(() => {
    setMaterial((state) => {
      const name = `My Material ${myMaterials.length + 1}`;
      const preset: MaterialPreset = {
        id: `mine-${Date.now()}`,
        name,
        library: "mine",
        category: "Custom",
        swatch: swatchOf(state.layers),
        spec: {
          opacity: state.opacity,
          layers: state.layers.map((layer) => ({
            kind: layer.kind,
            overrides: { mode: layer.mode, opacity: layer.opacity, visible: layer.visible, params: { ...layer.params } },
          })),
          lighting: { ...state.lighting },
        },
      };
      persistMine([...myMaterials, preset]);
      return state;
    });
  }, [myMaterials, persistMine]);

  const deletePreset = useCallback(
    (id: string) => {
      persistMine(myMaterials.filter((preset) => preset.id !== id));
      if (appliedPresetId === id) setAppliedPresetId(null);
    },
    [appliedPresetId, myMaterials, persistMine],
  );

  return (
    <div className="lab">
      <div className="viewport">
        <MaterialPreview geometry={geometry} material={material} />
        <div className="viewport-toolbar">
          {(["knot", "sphere", "torus", "capsule"] as GeometryKind[]).map((kind) => (
            <button key={kind} className={geometry === kind ? "on" : ""} onClick={() => setGeometry(kind)}>
              {kind[0].toUpperCase() + kind.slice(1)}
            </button>
          ))}
        </div>
        <div className="viewport-hint">
          Spline Library {SPLINE_PRESETS.length} presets · 拖拽旋转视角
        </div>
      </div>
      <MaterialPanel
        material={material}
        actions={actions}
        myMaterials={myMaterials}
        appliedPresetId={appliedPresetId}
        onApplyPreset={applyPreset}
        onSavePreset={savePreset}
        onDeletePreset={deletePreset}
      />
    </div>
  );
};

export type { LayerKind };
