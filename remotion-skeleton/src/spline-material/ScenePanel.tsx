/**
 * [INPUT]: React、本目录 scene-model.ts、MaterialPreview 的 VIEW_SCENES/GEOMETRY 标签、controls.tsx 与 icons.tsx
 * [OUTPUT]: 对外提供 ScenePanel：未选中物体时的场景面板——背景预设、物体列表（几何/眼睛/删除/新建）
 * [POS]: spline-material 的全局设置页；对应 Spline「什么都不选」的层级/背景状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { FC } from "react";
import { Dropdown, NumberInput, Segmented } from "./controls";
import { GEOMETRIES, VIEW_SCENES, type SceneKind } from "./MaterialPreview";
import { GEOMETRY_LABEL, type SceneObject } from "./scene-model";
import type { SceneLightState } from "./types";
import { IconEye, IconEyeOff, IconPlus, IconX, LAYER_ICONS } from "./icons";

export const ScenePanel: FC<{
  objects: SceneObject[];
  selectedId: string | null;
  scene: SceneKind;
  sceneLight: SceneLightState;
  tonemapping: boolean;
  onSelect: (id: string | null) => void;
  onSelectScene: (scene: SceneKind) => void;
  onChangeLight: (patch: Partial<SceneLightState>) => void;
  onToggleTonemapping: (value: boolean) => void;
  onChangeGeometry: (id: string, geometry: SceneObject["geometry"]) => void;
  onToggleObject: (id: string) => void;
  onRemoveObject: (id: string) => void;
  onAddObject: () => void;
}> = ({ objects, selectedId, scene, sceneLight, tonemapping, onSelect, onSelectScene, onChangeLight, onToggleTonemapping, onChangeGeometry, onToggleObject, onRemoveObject, onAddObject }) => (
  <aside className="spanel">
    <div className="spanel-scroll">
      <section className="spanel-section">
        <h2 className="section-title">Background</h2>
        <div className="scene-grid">
          {(Object.keys(VIEW_SCENES) as SceneKind[]).map((kind) => (
            <button key={kind} className={`scene-cell ${scene === kind ? "on" : ""}`} onClick={() => onSelectScene(kind)}>
              <span className="scene-chip" style={{ background: `linear-gradient(180deg, ${VIEW_SCENES[kind].gradient?.[1] ?? VIEW_SCENES[kind].background} 0%, ${VIEW_SCENES[kind].background} 100%)` }} />
              <span>{VIEW_SCENES[kind].label}</span>
            </button>
          ))}
        </div>
        <p className="panel-note">Effects 是全局后处理，作用于整个画面（切到 Effects 标签编辑）。</p>
      </section>

      <section className="spanel-section">
        <header className="section-head">
          <h2>
            Light
            <button className="iconbtn" onClick={() => onChangeLight({ enabled: !sceneLight.enabled })}>
              {sceneLight.enabled ? "◉" : "○"}
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
          <h2>Objects</h2>
          <button className="iconbtn" title="Add object" onClick={onAddObject}>
            <IconPlus size={17} />
          </button>
        </header>
        <div className="layer-list">
          {objects.map((object) => {
            const GeometryIcon = LAYER_ICONS.matcap;
            return (
              <div key={object.id} className={`layer-row ${object.id === selectedId ? "selected" : ""} ${object.visible ? "" : "hidden"}`}>
                <button className="row-main" onClick={() => onSelect(object.id)}>
                  <span className="row-chevron" />
                  <GeometryIcon size={14} />
                  <span className="row-name">{object.name}</span>
                </button>
                <Dropdown
                  value={object.geometry}
                  options={(Object.keys(GEOMETRIES) as SceneObject["geometry"][]).map((kind) => ({ value: kind, label: GEOMETRY_LABEL[kind] }))}
                  onChange={(next) => onChangeGeometry(object.id, next as SceneObject["geometry"])}
                  style={{ width: 86 }}
                />
                <button className="iconbtn" onClick={() => onToggleObject(object.id)}>
                  {object.visible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                </button>
                <button className="iconbtn remove" onClick={() => onRemoveObject(object.id)}>
                  <IconX size={14} />
                </button>
              </div>
            );
          })}
        </div>
        <p className="panel-note">点击画布中的物体可选中并编辑它的 Material 与 Effects；点击空白处取消选择。</p>
      </section>
    </div>
  </aside>
);
