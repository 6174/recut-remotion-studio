/**
 * [INPUT]: React、本目录 object-effects.ts、controls.tsx、popups.tsx（SettingsPopup/TypeMenu）、icons.tsx
 * [OUTPUT]: 对外提供 ObjectEffectsPanel：选中物体的 Effects 面板（对齐 Spline 3D Shape 效果菜单）
 * [POS]: spline-material 的物体级 Effects UI；全部效果只作用于选中物体
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useState, type FC } from "react";
import { anchorRect, NumberInput } from "./controls";
import { IconChevron, IconDrag, IconEye, IconEyeOff, IconPlus, IconX } from "./icons";
import { SettingsPopup, TypeMenu } from "./popups";
import {
  OBJECT_EFFECT_MENU_ORDER,
  OBJECT_EFFECT_META,
  OE_DESC,
  OE_HINTS,
  makeObjectEffect,
  type ObjectEffectKind,
  type ObjectEffectState,
} from "./object-effects";

/** 物体级效果在类型菜单里的图标（复用最贴近的现有 glyph） */
const EFFECT_GLYPH: Record<ObjectEffectKind, FC<{ size?: number }>> = {
  dropShadow: (p) => <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24"><ellipse cx="12" cy="17" rx="8" ry="3.2" fill="currentColor" opacity="0.55" /></svg>,
  innerShadow: (p) => <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.4" opacity="0.75" fill="none" /><circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4" /></svg>,
  layerBlur: (p) => <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24"><circle cx="9" cy="12" r="6" fill="currentColor" opacity="0.75" /><circle cx="15" cy="12" r="6" fill="currentColor" opacity="0.35" /></svg>,
  layerNoise: (p) => <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24">{Array.from({ length: 12 }, (_, i) => (<rect key={i} x={5 + (i % 4) * 4} y={5 + Math.floor(i / 4) * 5} width="2.4" height="2.4" fill="currentColor" opacity={0.3 + (i % 3) * 0.25} />))}</svg>,
  liquidGlass: (p) => <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24"><path d="M6 14c2-4 4.5-6 6-6s4 2 6 6c-2 3-4.5 4-6 4s-4-1-6-4Z" stroke="currentColor" strokeWidth="1.8" fill="none" /><path d="M9 12c1-1.6 2-2.4 3-2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" /></svg>,
  projection: (p) => <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24"><ellipse cx="14.5" cy="16.5" rx="7" ry="3" fill="currentColor" opacity="0.4" /><path d="M8 5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  noiseGlass: (p) => <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.8" />{Array.from({ length: 6 }, (_, i) => (<circle key={i} cx={9 + (i % 3) * 3} cy={9 + Math.floor(i / 3) * 4} r="0.9" fill="currentColor" />))}</svg>,
};

type PopupState =
  | { kind: "none" }
  | { kind: "settings"; effectId: string; anchor: { top: number; left: number } }
  | { kind: "type"; anchor: { top: number; left: number } };

export const ObjectEffectsPanel: FC<{
  effects: ObjectEffectState[];
  onUpdate: (id: string, patch: Partial<ObjectEffectState>) => void;
  onUpdateParam: (id: string, key: string, value: string | number | number[]) => void;
  onAdd: (kind: ObjectEffectKind) => void;
  onRemove: (id: string) => void;
}> = ({ effects, onUpdate, onUpdateParam, onAdd, onRemove }) => {
  const [popup, setPopup] = useState<PopupState>({ kind: "none" });
  const close = () => setPopup({ kind: "none" });

  const effectRow = (effect: ObjectEffectState) => {
    const Glyph = EFFECT_GLYPH[effect.kind];
    return (
      <div key={effect.id} className={`layer-row ${effect.visible ? "" : "hidden"}`}>
        <button className="row-main" onClick={(event) => setPopup({ kind: "settings", effectId: effect.id, anchor: anchorRect(event.currentTarget) })}>
          <IconChevron size={13} className="row-chevron" />
          <span className="row-name">{effect.name}</span>
        </button>
        <button className="row-swatch" title="Switch effect" onClick={(event) => setPopup({ kind: "type", anchor: anchorRect(event.currentTarget) })}>
          <Glyph size={17} />
        </button>
        <span className="ninput opa">
          <NumberInput value={effect.opacity} onChange={(next) => onUpdate(effect.id, { opacity: Math.min(Math.max(next, 0), 100) })} />
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
                title="Add effect"
                onClick={(event) => setPopup({ kind: "type", anchor: anchorRect(event.currentTarget) })}
              >
                <IconPlus size={17} />
              </button>
            </span>
          </header>
          <p className="panel-note">物体级效果：只作用于选中的物体。</p>
          <div className="layer-list">{effects.map(effectRow)}</div>
        </section>
      </div>

      {current ? (
        <SettingsPopup
          title={current.name}
          fields={OBJECT_EFFECT_META[current.kind].fields}
          params={current.params}
          anchor={popup.kind === "settings" ? popup.anchor : { top: 0, left: 0 }}
          onChange={(key, value) => onUpdateParam(current.id, key, value)}
          onClose={close}
          hints={OE_HINTS}
          kindId={current.kind}
          description={OE_DESC[current.kind]}
        />
      ) : null}

      {popup.kind === "type" ? (
        <TypeMenu
          order={OBJECT_EFFECT_MENU_ORDER}
          meta={OBJECT_EFFECT_META}
          iconMap={EFFECT_GLYPH}
          descMap={OE_DESC}
          anchor={popup.anchor}
          width={200}
          onPick={(kind) => {
            onAdd(kind as ObjectEffectKind);
            close();
          }}
          onClose={close}
        />
      ) : null}
    </aside>
  );
};
