/**
 * [INPUT]: React 与本目录 icons.tsx
 * [OUTPUT]: 对外提供 Spline 风格 UI 原子：NumberInput / VecInput / ColorInput / Segmented / Dropdown / PopupShell / useClickOutside / anchorRect
 * [POS]: spline-material 面板与弹窗的受控控件层；全部为纯受控组件，状态由上层持有
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useRef, useState, type CSSProperties, type FC, type ReactNode } from "react";
import { IconChevron, IconX } from "./icons";

export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

/** 触发行相对视口的锚点，弹窗用它定位到面板左侧 */
export const anchorRect = (el: HTMLElement | null) => {
  if (!el) return { top: 120, left: window.innerWidth - 340 };
  const rect = el.getBoundingClientRect();
  return { top: rect.top, left: rect.left };
};

export const NumberInput: FC<{ value: number; prefix?: string; step?: number; width?: number; onChange: (value: number) => void; className?: string }> = ({ value, prefix, step = 0.1, width, onChange, className }) => {
  const [text, setText] = useState(String(value));
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!editing) setText(String(value));
  }, [value, editing]);
  const commit = (raw: string) => {
    const parsed = parseFloat(raw);
    if (Number.isFinite(parsed)) onChange(parsed);
    else setText(String(value));
  };
  return (
    <span className={`ninput ${className ?? ""}`} style={width ? { width } : undefined}>
      {prefix ? <span className="ninput-prefix">{prefix}</span> : null}
      <input
        value={text}
        step={step}
        onChange={(event) => {
          setText(event.target.value);
          commit(event.target.value);
        }}
        onFocus={() => setEditing(true)}
        onBlur={() => {
          setEditing(false);
          commit(text);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") (event.target as HTMLInputElement).blur();
        }}
      />
    </span>
  );
};

export const VecInput: FC<{ value: number[]; prefixes: string[]; step?: number; onChange: (value: number[]) => void }> = ({ value, prefixes, step, onChange }) => (
  <span className="vec">
    {prefixes.map((prefix, index) => (
      <NumberInput
        key={prefix + index}
        value={value[index] ?? 0}
        prefix={prefix}
        step={step}
        onChange={(next) => {
          const draft = [...value];
          draft[index] = next;
          onChange(draft);
        }}
      />
    ))}
  </span>
);

export const ColorInput: FC<{ value: string; onChange: (value: string) => void; percent?: boolean }> = ({ value, onChange, percent }) => (
  <span className="colorfield">
    <label className="swatch">
      <span style={{ background: value }} />
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
    <span className="hexbox">
      <input value={value.replace("#", "").toUpperCase()} onChange={(event) => onChange(`#${event.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)}`)} spellCheck={false} />
    </span>
    {percent ? <span className="ninput pct"><input value="100%" readOnly /></span> : null}
  </span>
);

export const Segmented: FC<{ value: string; options: string[]; onChange: (value: string) => void }> = ({ value, options, onChange }) => (
  <span className="segmented">
    {options.map((option) => (
      <button key={option} className={option === value ? "on" : ""} onClick={() => onChange(option)}>
        {option[0].toUpperCase() + option.slice(1)}
      </button>
    ))}
  </span>
);

export type Option = { value: string; label: string };

export const Dropdown: FC<{ value: string; options: Option[]; onChange: (value: string) => void; placeholder?: string; style?: CSSProperties }> = ({ value, options, onChange, placeholder, style }) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const current = options.find((option) => option.value === value);
  return (
    <div className="dropdown" style={style} ref={ref}>
      <button className="dropdown-btn" onClick={() => setOpen((state) => !state)}>
        <span>{current?.label ?? placeholder ?? value}</span>
        <IconChevron size={14} />
      </button>
      {open ? (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              className={option.value === value ? "on" : ""}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const PopupShell: FC<{ title: string; anchor: { top: number; left: number }; width?: number; onClose: () => void; children: ReactNode }> = ({ title, anchor, width = 440, onClose, children }) => {
  const ref = useClickOutside<HTMLDivElement>(onClose);
  const style: CSSProperties = {
    left: Math.max(12, anchor.left - width - 14),
    top: Math.min(Math.max(12, anchor.top - 8), Math.max(window.innerHeight - 360, 12)),
    width,
  };
  return (
    <div className="popup" style={style} ref={ref}>
      <header>
        <h3>{title}</h3>
        <button className="iconbtn" onClick={onClose}>
          <IconX size={16} />
        </button>
      </header>
      <div className="popup-body">{children}</div>
    </div>
  );
};
