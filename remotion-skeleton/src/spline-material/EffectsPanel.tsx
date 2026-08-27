/**
 * [INPUT]: React、本目录 effects-config.ts、controls.tsx、popups.tsx、icons.tsx
 * [OUTPUT]: 对外提供 EffectsPanel：Spline 风格 Effects 面板（全局后处理图层栈）
 * [POS]: spline-material 的第二个核心面板；未选中元素时 Effects 作用于整个场景（全局 post-processing）
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useState, type FC } from "react";
import { anchorRect, NumberInput, useClickOutside } from "./controls";
import { EFFECT_PRESETS, buildEffectPreset } from "./effects-presets";
import { IconBlend, IconChevron, IconDrag, IconEye, IconEyeOff, IconLibrary, IconPlus, IconSearch, IconX, EFFECT_ICONS } from "./icons";
import { SettingsPopup, TypeMenu } from "./popups";
import { EFFECT_DESC, EFFECT_HINTS, EFFECT_KIND_META, EFFECT_MENU_ORDER, type EffectKind, type EffectState } from "./effects-config";

type PopupState =
  | { kind: "none" }
  | { kind: "settings"; effectId: string; anchor: { top: number; left: number } }
  | { kind: "type"; anchor: { top: number; left: number } }
  | { kind: "library"; anchor: { top: number; left: number } };

export const EffectsPanel: FC<{
  effects: EffectState[];
  onUpdate: (id: string, patch: Partial<EffectState>) => void;
  onUpdateParam: (id: string, key: string, value: string | number | number[]) => void;
  onAdd: (kind: EffectKind) => void;
  onRemove: (id: string) => void;
  onApplyPreset: (effects: EffectState[]) => void;
}> = ({ effects, onUpdate, onUpdateParam, onAdd, onRemove, onApplyPreset }) => {
  const [popup, setPopup] = useState<PopupState>({ kind: "none" });
  const [libSearch, setLibSearch] = useState("");
  const libRef = useClickOutside<HTMLDivElement>(() => setPopup({ kind: "none" }));
  const close = () => setPopup({ kind: "none" });

  const effectRow = (effect: EffectState) => {
    const Icon = EFFECT_ICONS[effect.kind];
    return (
      <div key={effect.id} className={`layer-row ${effect.visible ? "" : "hidden"}`}>
        <button className="row-main" onClick={(event) => setPopup({ kind: "settings", effectId: effect.id, anchor: anchorRect(event.currentTarget) })}>
          <IconChevron size={13} className="row-chevron" />
          <span className="row-name">{effect.name}</span>
        </button>
        <button className="row-swatch" title="Switch effect" onClick={(event) => setPopup({ kind: "type", anchor: anchorRect(event.currentTarget) })}>
          <Icon size={17} />
        </button>
        <span className="ninput opa">
          <NumberInput value={effect.opacity} onChange={(next) => onUpdate(effect.id, { opacity: Math.min(Math.max(next, 0), 100) })} />
          <span className="blend-dot static" title="Strength">
            <IconBlend size={13} />
          </span>
        </span>
        <button className="iconbtn" onClick={() => onUpdate(effect.id, { visible: !effect.visible })}>
          {effect.visible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
        </button>
        <button className="iconbtn remove" onClick={() => onRemove(effect.id)}>
          <IconX size={14} />
        </button>
      </div>
    );
  };

  const current = popup.kind === "settings" ? effects.find((effect) => effect.id === popup.effectId) : undefined;

  return (
    <aside className="spanel">
      <div className="spanel-scroll">
        <section className="spanel-section">
          <header className="section-head">
            <h2>
              Effects <IconDrag size={15} className="drag" />
            </h2>
            <span className="section-tools">
              <button
                className="iconbtn"
                title="Effect Presets"
                onClick={(event) => {
                  setLibSearch("");
                  setPopup({ kind: "library", anchor: anchorRect(event.currentTarget) });
                }}
              >
                <IconLibrary size={16} />
              </button>
              <button
                className="iconbtn"
                title="Add effect"
                onClick={(event) => setPopup({ kind: "type", anchor: anchorRect(event.currentTarget) })}
              >
                <IconPlus size={17} />
              </button>
            </span>
          </header>
          <p className="panel-note">全局 post-processing：未选中元素时作用于整个场景。</p>
          <div className="layer-list">{effects.map(effectRow)}</div>
        </section>
      </div>

      {current ? (
        <SettingsPopup
          title={current.name}
          fields={EFFECT_KIND_META[current.kind].fields}
          params={current.params}
          anchor={popup.kind === "settings" ? popup.anchor : { top: 0, left: 0 }}
          onChange={(key, value) => onUpdateParam(current.id, key, value)}
          onClose={close}
          hints={EFFECT_HINTS}
          kindId={current.kind}
          description={EFFECT_DESC[current.kind]}
        />
      ) : null}

      {popup.kind === "library" ? (
        <div
          className="assets"
          style={{ left: Math.max(12, popup.anchor.left - 384 - 14), top: Math.min(Math.max(12, popup.anchor.top - 60), Math.max(window.innerHeight - 560, 12)) }}
          ref={libRef}
        >
          <header>
            <h3>Effect Presets</h3>
            <button className="iconbtn" onClick={close}>
              ×
            </button>
          </header>
          <div className="assets-toolbar">
            <label className="assets-search">
              <IconSearch size={15} />
              <input placeholder="Search" value={libSearch} onChange={(event) => setLibSearch(event.target.value)} />
            </label>
          </div>
          <section>
            <div className="asset-grid">
              {EFFECT_PRESETS.filter((preset) => !libSearch.trim() || preset.name.toLowerCase().includes(libSearch.trim().toLowerCase())).map((preset) => (
                <div
                  key={preset.id}
                  className="asset-cell"
                  onClick={() => {
                    onApplyPreset(buildEffectPreset(preset));
                    close();
                  }}
                >
                  <span className="fx-stack">
                    {preset.spec.effects.slice(0, 4).map(({ kind }) => {
                      const Icon = EFFECT_ICONS[kind];
                      return <Icon key={kind} size={13} />;
                    })}
                  </span>
                  <span className="asset-tip">{preset.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {popup.kind === "type" ? (
        <TypeMenu
          order={EFFECT_MENU_ORDER}
          meta={EFFECT_KIND_META}
          iconMap={EFFECT_ICONS}
          descMap={EFFECT_DESC}
          anchor={popup.anchor}
          width={190}
          onPick={(kind) => {
            onAdd(kind as EffectKind);
            close();
          }}
          onClose={close}
        />
      ) : null}
    </aside>
  );
};
