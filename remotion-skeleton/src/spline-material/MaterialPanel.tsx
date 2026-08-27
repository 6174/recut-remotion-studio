/**
 * [INPUT]: React、本目录 types.ts / controls.tsx / popups.tsx / icons.tsx
 * [OUTPUT]: 对外提供 MaterialPanel：Spline 风格右侧属性面板（Material 图层栈 + Modifiers + Visibility + Collision）
 * [POS]: spline-material 的核心 UI；图层行、弹窗锚点与所有受控编辑都从这里发起
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useState, useRef, type FC } from "react";
import { anchorRect, ColorInput, Dropdown, NumberInput, Segmented, VecInput, useClickOutside } from "./controls";
import { IconBlend, IconChevron, IconDrag, IconEye, IconEyeOff, IconLibrary, IconPlus, IconX, LAYER_ICONS } from "./icons";
import { BlendMenu, SettingsPopup, TypeMenu, AssetsBrowser } from "./popups";
import { ENV_LEGACY_MAP, ENV_PRESETS, envName } from "./env-presets";
import type { SceneLightState } from "./types";
import type { MaterialPreset } from "./presets";
import { BLEND_LABEL, LAYER_DESC, LAYER_HINTS, LAYER_KIND_META, LAYER_MENU_ORDER, LIGHTING_FIELDS, type LayerKind, type LayerState, type MaterialState } from "./types";

type PopupState =
  | { kind: "none" }
  | { kind: "settings"; layerId: string; anchor: { top: number; left: number } }
  | { kind: "lighting"; anchor: { top: number; left: number } }
  | { kind: "type"; layerId: string | null; anchor: { top: number; left: number } }
  | { kind: "blend"; layerId: string; anchor: { top: number; left: number } }
  | { kind: "assets"; anchor: { top: number; left: number } };

export type PanelActions = {
  updateMaterial: (patch: Partial<MaterialState>) => void;
  updateLayer: (id: string, patch: Partial<LayerState>) => void;
  updateLayerParam: (id: string, key: string, value: string | number | number[]) => void;
  addLayer: (kind: LayerKind) => void;
  setLayerKind: (id: string, kind: LayerKind) => void;
  removeLayer: (id: string) => void;
  updateLighting: (patch: Partial<MaterialState["lighting"]>) => void;
  updateEnv: (patch: Partial<MaterialState["env"]>) => void;
};

/** Environment Map 选择器：缩略图网格（Spline env 库）+ Upload（图片/HDR → dataURL），对齐 Spline 的 ImageInput popover */
const EnvPicker: FC<{ value: string; onChange: (map: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const current = ENV_PRESETS.find((entry) => entry.id === value) ?? ENV_PRESETS.find((entry) => entry.id === ENV_LEGACY_MAP[value]);
  return (
    <div className="envpick" ref={ref}>
      <button className="envpick-btn" onClick={() => setOpen((state) => !state)} title={envName(value)}>
        {value.startsWith("data:") ? (
          <img src={value} alt="" />
        ) : current ? (
          <img src={current.url} alt="" />
        ) : (
          <span className="envpick-empty">None</span>
        )}
        <span className="envpick-name">{envName(value)}</span>
        <IconChevron size={13} />
      </button>
      {open ? (
        <div className="envpick-pop">
          <label className="envpick-upload">
            <IconPlus size={14} />
            <span>Upload</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.hdr,image/vnd.radiance"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  onChange(String(reader.result ?? ""));
                  setOpen(false);
                };
                reader.readAsDataURL(file);
                event.target.value = "";
              }}
            />
          </label>
          {ENV_PRESETS.map((entry) => (
            <button key={entry.id} className={`envpick-cell ${value === entry.id ? "on" : ""}`} title={entry.name} onClick={() => { onChange(entry.id); setOpen(false); }}>
              <img src={entry.url} alt={entry.name} loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const MaterialPanel: FC<{
  material: MaterialState;
  actions: PanelActions;
  sceneLight: SceneLightState;
  tonemapping: boolean;
  onChangeLight: (patch: Partial<SceneLightState>) => void;
  onToggleTonemapping: (value: boolean) => void;
  myMaterials: MaterialPreset[];
  appliedPresetId: string | null;
  onApplyPreset: (preset: MaterialPreset) => void;
  onSavePreset: () => void;
  onDeletePreset: (id: string) => void;
}> = ({ material, actions, sceneLight, tonemapping, onChangeLight, onToggleTonemapping, myMaterials, appliedPresetId, onApplyPreset, onSavePreset, onDeletePreset }) => {
  const [popup, setPopup] = useState<PopupState>({ kind: "none" });
  const close = () => setPopup({ kind: "none" });

  const layerRow = (layer: LayerState) => {
    const meta = LAYER_KIND_META[layer.kind];
    const Icon = LAYER_ICONS[layer.kind];
    const hexKey = meta.hexKey;
    const mapKey = meta.fields.find((field) => field.type === "texture")?.key;
    const mapValue = mapKey && typeof layer.params[mapKey] === "string" ? (layer.params[mapKey] as string) : "";
    return (
      <div key={layer.id} className={`layer-row ${layer.visible ? "" : "hidden"}`}>
        <button className="row-main" onClick={(event) => setPopup({ kind: "settings", layerId: layer.id, anchor: anchorRect(event.currentTarget) })}>
          <IconChevron size={13} className="row-chevron" />
          <span className="row-name">{layer.name}</span>
        </button>
        <button
          className="row-swatch"
          title="Switch layer type"
          onClick={(event) => {
            event.stopPropagation();
            setPopup({ kind: "type", layerId: layer.id, anchor: anchorRect(event.currentTarget) });
          }}
        >
          {mapValue ? <img className="swatch-img" src={mapValue} alt="" /> : hexKey ? <span className="swatch-color" style={{ background: String(layer.params[hexKey] ?? "#888") }} /> : <Icon size={17} />}
        </button>
        {hexKey ? (
          <span className="ninput hex">
            <input
              value={String(layer.params[hexKey] ?? "").replace("#", "").toUpperCase()}
              onChange={(event) => actions.updateLayerParam(layer.id, hexKey, `#${event.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)}`)}
              spellCheck={false}
            />
          </span>
        ) : null}
        <span className="ninput opa">
          <NumberInput value={layer.opacity} onChange={(next) => actions.updateLayer(layer.id, { opacity: Math.min(Math.max(next, 0), 100) }) } />
          <button
            className="blend-dot"
            title={`Blend: ${BLEND_LABEL[layer.mode]}`}
            onClick={(event) => {
              event.stopPropagation();
              setPopup({ kind: "blend", layerId: layer.id, anchor: anchorRect(event.currentTarget) });
            }}
          >
            <IconBlend size={13} />
          </button>
        </span>
        <button className="iconbtn" onClick={() => actions.updateLayer(layer.id, { visible: !layer.visible })}>
          {layer.visible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
        </button>
        <button className="iconbtn remove" onClick={() => actions.removeLayer(layer.id)}>
          <IconX size={14} />
        </button>
      </div>
    );
  };

  const lightingRow = () => (
    <div className={`layer-row ${material.lighting.enabled ? "" : "hidden"}`}>
      <button className="row-main" onClick={(event) => setPopup({ kind: "lighting", anchor: anchorRect(event.currentTarget) })}>
        <span className="row-chevron" />
        <span className="row-name">Lighting</span>
      </button>
      <button className="row-swatch" onClick={(event) => setPopup({ kind: "lighting", anchor: anchorRect(event.currentTarget) })}>
        <span className="swatch-sphere" style={{ background: "radial-gradient(circle at 34% 30%, #ffffff 0%, #c9c9c9 55%, #7c7c7c 100%)" }} />
      </button>
      <span className="ninput opa">
        <NumberInput value={material.lighting.strength} onChange={(next) => actions.updateLighting({ strength: Math.min(Math.max(next, 0), 100) })} />
        <span className="blend-dot static">
          <IconBlend size={13} />
        </span>
      </span>
      <button className="iconbtn" onClick={() => actions.updateLighting({ enabled: !material.lighting.enabled })}>
        {material.lighting.enabled ? <IconEye size={16} /> : <IconEyeOff size={16} />}
      </button>
      <span className="iconbtn placeholder" />
    </div>
  );

  return (
    <aside className="spanel">
      <div className="spanel-scroll">
        <section className="spanel-section">
          <header className="section-head">
            <h2>
              Material <IconDrag size={15} className="drag" />
            </h2>
            <span className="section-tools">
              <NumberInput value={material.opacity} width={64} onChange={(next) => actions.updateMaterial({ opacity: Math.min(Math.max(next, 0), 100) })} />
              <button
                className="iconbtn"
                title="Material Assets"
                onClick={(event) => setPopup({ kind: "assets", anchor: anchorRect(event.currentTarget) })}
              >
                <IconLibrary size={16} />
              </button>
              <button
                className="iconbtn"
                title="Add layer"
                onClick={(event) => setPopup({ kind: "type", layerId: null, anchor: anchorRect(event.currentTarget) })}
              >
                <IconPlus size={17} />
              </button>
            </span>
          </header>
          <div className="layer-list">
            {material.layers.map(layerRow)}
            {lightingRow()}
          </div>
        </section>

        <section className="spanel-section">
          <header className="section-head">
            <h2>
              Environment Map
              <button className="iconbtn" onClick={() => actions.updateEnv({ enabled: !material.env.enabled })}>
                {material.env.enabled ? <IconEye size={15} /> : <IconEyeOff size={15} />}
              </button>
            </h2>
          </header>
          <div className="prow">
            <span className="prow-label">Image</span>
            <span className="prow-control">
              <EnvPicker value={material.env.map} onChange={(next) => actions.updateEnv({ map: next })} />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Exposure</span>
            <span className="prow-control">
              <NumberInput value={material.env.exposure} onChange={(next) => actions.updateEnv({ exposure: Math.min(Math.max(next, 0), 3) })} />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Rotation</span>
            <span className="prow-control">
              <VecInput
                value={material.env.rotation}
                prefixes={["X", "Y", "Z"]}
                step={0.05}
                onChange={(next) => actions.updateEnv({ rotation: [next[0] ?? 0, next[1] ?? 0, next[2] ?? 0] })}
              />
            </span>
          </div>
        </section>

        <section className="spanel-section">
          <header className="section-head">
            <h2>
              Light
              <button className="iconbtn" onClick={() => onChangeLight({ enabled: !sceneLight.enabled })}>
                {sceneLight.enabled ? <IconEye size={15} /> : <IconEyeOff size={15} />}
              </button>
            </h2>
          </header>
          <div className="prow">
            <span className="prow-label">Intensity</span>
            <span className="prow-control">
              <NumberInput value={sceneLight.intensity} onChange={(next) => onChangeLight({ intensity: Math.min(Math.max(next, 0), 4) })} />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Color</span>
            <span className="prow-control">
              <Dropdown
                value={sceneLight.color}
                options={[
                  { value: "#ffffff", label: "White" },
                  { value: "#fff2e0", label: "Warm" },
                  { value: "#e8f0ff", label: "Cool" },
                ]}
                onChange={(next) => onChangeLight({ color: next })}
                style={{ width: 172 }}
              />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Shadow C…</span>
            <span className="prow-control">
              <Segmented value={sceneLight.shadowMode} options={["auto", "custom"]} onChange={(next) => onChangeLight({ shadowMode: next as SceneLightState["shadowMode"] })} />
            </span>
          </div>
          {sceneLight.shadowMode === "custom" ? (
            <div className="prow">
              <span className="prow-label">Color</span>
              <span className="prow-control">
                <ColorInput value={sceneLight.shadowColor} onChange={(next) => onChangeLight({ shadowColor: next })} />
              </span>
            </div>
          ) : null}
          <div className="prow">
            <span className="prow-label">Ambient In…</span>
            <span className="prow-control">
              <NumberInput value={sceneLight.ambient} onChange={(next) => onChangeLight({ ambient: Math.min(Math.max(next, 0), 2) })} />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Tonemappi…</span>
            <span className="prow-control">
              <Segmented value={tonemapping ? "yes" : "no"} options={["yes", "no"]} onChange={(next) => onToggleTonemapping(next === "yes")} />
            </span>
          </div>
        </section>

        <section className="spanel-section">
          <header className="section-head">
            <h2>Modifiers</h2>
            <button className="iconbtn" title="Add modifier (decorative)">
              <IconPlus size={17} />
            </button>
          </header>
        </section>

        <section className="spanel-section">
          <h2 className="section-title">Visibility</h2>
          <div className="prow">
            <span className="prow-label">Wireframe</span>
            <span className="prow-control">
              <Segmented value={material.wireframe ? "show" : "hide"} options={["show", "hide"]} onChange={(next) => actions.updateMaterial({ wireframe: next === "show" })} />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Shading</span>
            <span className="prow-control">
              <Segmented value={material.shading} options={["normal", "flat"]} onChange={(next) => actions.updateMaterial({ shading: next as MaterialState["shading"] })} />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Sides</span>
            <span className="prow-control">
              <Segmented value={material.sides} options={["both", "front", "back"]} onChange={(next) => actions.updateMaterial({ sides: next as MaterialState["sides"] })} />
            </span>
          </div>
          <div className="prow">
            <span className="prow-label">Shadows</span>
            <span className="prow-control">
              <Dropdown
                value={material.shadows}
                options={[
                  { value: "castreceive", label: "Cast & Receive" },
                  { value: "cast", label: "Cast" },
                  { value: "receive", label: "Receive" },
                  { value: "off", label: "Off" },
                ]}
                onChange={(next) => actions.updateMaterial({ shadows: next as MaterialState["shadows"] })}
                style={{ width: 172 }}
              />
            </span>
          </div>
        </section>

        <section className="spanel-section">
          <h2 className="section-title">Collision</h2>
          <div className="prow">
            <span className="prow-label">Enabled</span>
            <span className="prow-control">
              <Dropdown
                value={material.collision}
                options={[
                  { value: "visibility", label: "Based on Visibility" },
                  { value: "on", label: "On" },
                  { value: "off", label: "Off" },
                ]}
                onChange={(next) => actions.updateMaterial({ collision: next as MaterialState["collision"] })}
                style={{ width: 172 }}
              />
            </span>
          </div>
        </section>
      </div>

      {popup.kind === "settings" ? (
        <SettingsPopup
          title={LAYER_KIND_META[material.layers.find((layer) => layer.id === popup.layerId)?.kind ?? "color"].label}
          fields={LAYER_KIND_META[material.layers.find((layer) => layer.id === popup.layerId)?.kind ?? "color"].fields}
          params={material.layers.find((layer) => layer.id === popup.layerId)?.params ?? {}}
          anchor={popup.anchor}
          onChange={(key, value) => actions.updateLayerParam(popup.layerId, key, value)}
          onClose={close}
          hints={LAYER_HINTS}
          kindId={material.layers.find((layer) => layer.id === popup.layerId)?.kind}
          description={LAYER_DESC[material.layers.find((layer) => layer.id === popup.layerId)?.kind ?? "color"]}
        />
      ) : null}

      {popup.kind === "lighting" ? (
        <SettingsPopup
          title="Lighting"
          fields={LIGHTING_FIELDS}
          params={{
            type: material.lighting.type,
            color: material.lighting.color,
            shining: material.lighting.shining,
            roughness: material.lighting.roughness,
            metalness: material.lighting.metalness,
            reflectivity: material.lighting.reflectivity,
            glass: material.lighting.glass,
            aberration: material.lighting.aberration,
            thickness: material.lighting.thickness,
            refraction: material.lighting.refraction,
            blur: material.lighting.blur,
            bumpMap: material.lighting.bumpMap,
            occlusion: material.lighting.occlusion ? "on" : "off",
          }}
          anchor={popup.anchor}
          onChange={(key, value) => {
            if (key === "occlusion") actions.updateLighting({ occlusion: value === "on" });
            else if (key === "type") actions.updateLighting({ type: value as MaterialState["lighting"]["type"] });
            else if (key === "bumpMap") actions.updateLighting({ bumpMap: value as MaterialState["lighting"]["bumpMap"] });
            else actions.updateLighting({ [key]: value } as Partial<MaterialState["lighting"]>);
          }}
          onClose={close}
          hints={LAYER_HINTS}
          kindId="lighting"
          description={LAYER_DESC.lighting}
        />
      ) : null}

      {popup.kind === "type" ? (
        <TypeMenu
          current={popup.layerId ? material.layers.find((layer) => layer.id === popup.layerId)?.kind : undefined}
          order={LAYER_MENU_ORDER}
          meta={LAYER_KIND_META}
          iconMap={LAYER_ICONS}
          boltFirst
          descMap={LAYER_DESC}
          anchor={popup.anchor}
          onPick={(kind) => {
            if (popup.layerId) actions.setLayerKind(popup.layerId, kind as LayerKind);
            else actions.addLayer(kind as LayerKind);
            close();
          }}
          onClose={close}
        />
      ) : null}

      {popup.kind === "blend" ? (
        <BlendMenu
          current={material.layers.find((layer) => layer.id === popup.layerId)?.mode ?? "normal"}
          anchor={popup.anchor}
          onPick={(mode) => {
            actions.updateLayer(popup.layerId, { mode: mode as LayerState["mode"] });
            close();
          }}
          onClose={close}
        />
      ) : null}

      {popup.kind === "assets" ? (
        <AssetsBrowser
          myMaterials={myMaterials}
          appliedId={appliedPresetId}
          anchor={popup.anchor}
          onApply={(preset) => {
            onApplyPreset(preset);
            close();
          }}
          onSaveCurrent={onSavePreset}
          onDeleteMine={onDeletePreset}
          onClose={close}
        />
      ) : null}
    </aside>
  );
};
