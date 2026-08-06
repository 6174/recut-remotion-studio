import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({ open, title, onClose, children, wide }: { open: boolean; title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal" style={wide ? { maxWidth: 860 } : undefined} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button aria-label="关闭" className="btn ghost small" onClick={onClose} type="button"><X className="size-4" /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
