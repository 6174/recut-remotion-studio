/**
 * [INPUT]: 依赖 React 节点、lucide 图标与本地 Button/标题样式
 * [OUTPUT]: 对外提供 Modal 轻量弹窗容器（遮罩、标题栏、正文与关闭操作）
 * [POS]: remotion-studio/ui 的 shadcn 弹窗原子；只承载结构，不持有业务状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { getRecutLocale } from "./recut-sdk";
import { t } from "./i18n";

export function Modal({ open, title, eyebrow, onClose, children, wide }: { open: boolean; title: string; eyebrow?: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const locale = getRecutLocale();
  if (!open) return null;
  return (
    <div aria-label={title} aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-6 backdrop-blur-[1px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="dialog">
      <section className={wide ? "w-full max-w-5xl overflow-hidden rounded-sm border bg-card shadow-[var(--shadow-overlay)]" : "w-full max-w-md overflow-hidden rounded-sm border bg-card shadow-[var(--shadow-overlay)]"} onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            {eyebrow ? <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">{eyebrow}</p> : null}
            <h2 className="mt-1 text-base font-semibold">{title}</h2>
          </div>
          <button aria-label={t(locale, "modal.closeAria")} className="grid size-8 shrink-0 place-items-center rounded-xs text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30" onClick={onClose} type="button"><X className="size-4" /></button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </section>
    </div>
  );
}
