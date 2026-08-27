/**
 * [INPUT]: React、本目录 types.ts 的 schema、presets.ts、controls.tsx 与 icons.tsx
 * [OUTPUT]: 对外提供 SettingsPopup（schema 驱动的 Noise/Lighting 等弹窗）、TypeMenu（图层类型菜单）、AssetsBrowser（Material Assets 预设库）
 * [POS]: spline-material 的三个浮层；布局对照 Spline 截图（弹窗出现在面板左侧）
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useMemo, useState, type FC } from "react";
import { anchorRect, ColorInput, Dropdown, NumberInput, PopupShell, Segmented, TextureInput, VecInput, useClickOutside, type Option } from "./controls";
import { IconBolt, IconCheck, IconLock, IconPlus, IconSearch } from "./icons";
import { SPLINE_PRESETS, type MaterialPreset } from "./presets";
import { BLEND_LABEL, BLEND_MODES, LAYER_KIND_META, LAYER_MENU_ORDER, type Field, type LayerKind, type LayerParams, type LayerState } from "./types";

/* ---------- schema 驱动的设置弹窗（Noise / Lighting / 各图层参数） ---------- */

const renderField = (field: Field, params: LayerParams, onChange: (key: string, value: string | number | number[]) => void) => {
  const value = params[field.key];
  switch (field.type) {
    case "color":
      return <ColorInput value={String(value ?? "#ffffff")} onChange={(next) => onChange(field.key, next)} percent />;
    case "texture":
      return <TextureInput value={String(value ?? "")} onChange={(next) => onChange(field.key, next)} />;
    case "number":
      return <NumberInput value={typeof value === "number" ? value : 0} prefix={field.prefix} step={field.step} onChange={(next) => onChange(field.key, next)} />;
    case "vec2":
      return <VecInput value={Array.isArray(value) ? value : [0, 0]} prefixes={(field.prefix ?? "XY").split("")} step={field.step} onChange={(next) => onChange(field.key, next)} />;
    case "vec3":
      return <VecInput value={Array.isArray(value) ? value : [0, 0, 0]} prefixes={(field.prefix ?? "XYZ").split("")} step={field.step} onChange={(next) => onChange(field.key, next)} />;
    case "select":
      return (
        <Dropdown
          value={String(value ?? field.options?.[0])}
          options={(field.options ?? []).map((option) => ({ value: option, label: option[0].toUpperCase() + option.slice(1) }))}
          onChange={(next) => onChange(field.key, next)}
          style={{ width: 168 }}
        />
      );
    case "segment":
      return <Segmented value={String(value ?? field.options?.[0])} options={field.options ?? []} onChange={(next) => onChange(field.key, next)} />;
    default:
      return null;
  }
};

export const SettingsPopup: FC<{
  title: string;
  fields: Field[];
  params: LayerParams;
  anchor: { top: number; left: number };
  onChange: (key: string, value: string | number | number[]) => void;
  onClose: () => void;
  /** `<kind>.<field>` 的通俗解释表 */
  hints?: Record<string, string>;
  kindId?: string;
  /** 弹窗副标题：这个类型是干什么的 */
  description?: string;
}> = ({ title, fields, params, anchor, onChange, onClose, hints, kindId, description }) => {
  let lastGroup = fields[0]?.group ?? 0;
  return (
    <PopupShell title={title} anchor={anchor} width={452} onClose={onClose}>
      {description ? <p className="popup-desc">{description}</p> : null}
      {fields.map((field) => {
        const divider = field.group !== lastGroup;
        lastGroup = field.group ?? 0;
        const hint = hints?.[`${kindId}.${field.key}`];
        return (
          <div key={field.key}>
            {divider ? <hr /> : null}
            <div className="prow">
              <span className="prow-label">{field.label}</span>
              <span className="prow-control">{renderField(field, params, onChange)}</span>
            </div>
            {hint ? <p className="field-hint">{hint}</p> : null}
          </div>
        );
      })}
    </PopupShell>
  );
};

/* ---------- 图层类型菜单（Image 2） ---------- */

export const TypeMenu: FC<{
  current?: string;
  order: string[];
  meta: Record<string, { label: string }>;
  iconMap: Record<string, FC<{ size?: number }>>;
  anchor: { top: number; left: number };
  onPick: (kind: string) => void;
  onClose: () => void;
  boltFirst?: boolean;
  width?: number;
  /** 悬浮提示：每项的一句话说明 */
  descMap?: Record<string, string>;
}> = ({ current, order, meta, iconMap, anchor, onPick, onClose, boltFirst, width = 232, descMap }) => {
  const ref = useClickOutside<HTMLDivElement>(onClose);
  const start = boltFirst ? 1 : 0;
  return (
    <div className="tmenu" style={{ left: Math.max(12, anchor.left - width - 14), top: Math.min(Math.max(12, anchor.top - 12), Math.max(window.innerHeight - 640, 12)) }} ref={ref}>
      {(() => {
        if (!boltFirst) return null;
        const FirstIcon = iconMap[order[0]];
        return (
          <button className={`tmenu-item ai ${current === order[0] ? "on" : ""}`} onClick={() => onPick(order[0])} title={descMap?.[order[0]] ?? meta[order[0]].label}>
            <span className="tmenu-icon">
              <FirstIcon />
            </span>
            <span className="tmenu-label">{meta[order[0]].label}</span>
            <IconBolt size={15} className="tmenu-bolt" />
          </button>
        );
      })()}
      {boltFirst ? <hr /> : null}
      {order.slice(start).map((kind) => {
        const Icon = iconMap[kind];
        if (!Icon || !meta[kind]) return null;
        return (
          <button key={kind} className={`tmenu-item ${current === kind ? "on" : ""}`} onClick={() => onPick(kind)} title={descMap?.[kind] ?? meta[kind].label}>
            <span className="tmenu-icon">
              <Icon />
            </span>
            <span className="tmenu-label">{meta[kind].label}</span>
            {current === kind ? <IconCheck size={15} className="tmenu-check" /> : null}
          </button>
        );
      })}
    </div>
  );
};

/* ---------- Blend mode 菜单（行内 ⊙ 触发） ---------- */

export const BlendMenu: FC<{
  current: string;
  anchor: { top: number; left: number };
  onPick: (mode: string) => void;
  onClose: () => void;
}> = ({ current, anchor, onPick, onClose }) => {
  const ref = useClickOutside<HTMLDivElement>(onClose);
  return (
    <div className="tmenu blend" style={{ left: Math.max(12, anchor.left - 190), top: Math.min(anchor.top + 20, window.innerHeight - 320) }} ref={ref}>
      {BLEND_MODES.map((mode) => (
        <button key={mode} className={`tmenu-item ${current === mode ? "on" : ""}`} onClick={() => onPick(mode)}>
          <span className="tmenu-label">{BLEND_LABEL[mode]}</span>
          {current === mode ? <IconCheck size={15} className="tmenu-check" /> : null}
        </button>
      ))}
    </div>
  );
};

/* ---------- Material Assets 预设库（Image 5 + Spline 网格缩略图） ---------- */

export const AssetsBrowser: FC<{
  myMaterials: MaterialPreset[];
  appliedId: string | null;
  anchor: { top: number; left: number };
  onApply: (preset: MaterialPreset) => void;
  onSaveCurrent: () => void;
  onDeleteMine: (id: string) => void;
  onClose: () => void;
}> = ({ myMaterials, appliedId, anchor, onApply, onSaveCurrent, onDeleteMine, onClose }) => {
  const ref = useClickOutside<HTMLDivElement>(onClose);
  const [search, setSearch] = useState("");
  const [library, setLibrary] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(SPLINE_PRESETS.map((preset) => preset.category)))], []);
  const query = search.trim().toLowerCase();
  const showMine = library === "all" || library === "mine";
  const showSpline = library === "all" || library === "spline";
  const mine = myMaterials.filter((preset) => !query || preset.name.toLowerCase().includes(query));
  const spline = SPLINE_PRESETS.filter((preset) => (showSpline && (category === "all" || preset.category === category) && (!query || preset.name.toLowerCase().includes(query))));

  const cell = (preset: MaterialPreset, mine_ = false) => (
    <div key={preset.id} className={`asset-cell ${appliedId === preset.id ? "applied" : ""}`} onClick={() => onApply(preset)}>
      <span className="torus" style={{ "--c1": preset.swatch[0], "--c2": preset.swatch[1] } as React.CSSProperties} />
      <span className="asset-tip">
        {preset.name}
        {preset.locked && !mine_ ? <IconLock size={11} /> : null}
      </span>
      {mine_ ? (
        <button
          className="asset-del"
          title="Delete"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteMine(preset.id);
          }}
        >
          <IconPlus size={12} style={{ transform: "rotate(45deg)" }} />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="assets" style={{ left: Math.max(12, anchor.left - 384 - 14), top: Math.min(Math.max(12, anchor.top - 60), Math.max(window.innerHeight - 620, 12)) }} ref={ref}>
      <header>
        <h3>Material Assets</h3>
        <button className="iconbtn" onClick={onClose}>
          ×
        </button>
      </header>
      <div className="assets-toolbar">
        <button className="assets-add" title="Save current material" onClick={onSaveCurrent}>
          <IconPlus size={17} />
        </button>
        <label className="assets-search">
          <IconSearch size={15} />
          <input placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      </div>
      <Dropdown
        value={library}
        options={[
          { value: "all", label: "All Libraries" },
          { value: "mine", label: "My Materials" },
          { value: "spline", label: "Spline Library" },
        ]}
        onChange={setLibrary}
        style={{ width: "100%" }}
      />
      {showMine ? (
        <section>
          <h4>My Materials</h4>
          {mine.length ? <div className="asset-grid">{mine.map((preset) => cell(preset, true))}</div> : <p className="assets-empty">点击左侧 + 保存当前材质</p>}
        </section>
      ) : null}
      {showSpline ? (
        <section>
          <div className="assets-section-head">
            <h4>Spline Library</h4>
            <Dropdown value={category} options={categories.map((value) => ({ value, label: value === "all" ? "All" : value }))} onChange={setCategory} style={{ width: 132 }} />
          </div>
          <div className="asset-grid">{spline.map((preset) => cell(preset))}</div>
        </section>
      ) : null}
    </div>
  );
};

export const popupAnchor = anchorRect;
export type { LayerState };
