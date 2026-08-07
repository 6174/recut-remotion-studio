/**
 * [INPUT]: 依赖画布尺寸目录与父级的选中状态回调
 * [OUTPUT]: 对外提供 CanvasPicker 与 CanvasSizeItem，用缩略比例选择视频画幅
 * [POS]: preview 层的画布选择原子；与模板、字幕样片选择器并列
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export interface CanvasSizeItem {
  id: string;
  label: string;
  width: number;
  height: number;
  fps: number;
}

interface CanvasPickerProps {
  items: CanvasSizeItem[];
  value: string;
  onChange: (id: string) => void;
}

export const CanvasPicker: React.FC<CanvasPickerProps> = ({ items, value, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => {
        const selected = item.id === value;
        const landscape = item.width >= item.height;
        return (
          <button
            className={`rounded-xs border bg-card p-3 text-left outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/30 ${selected ? "border-primary bg-primary/5" : "border-border"}`}
            key={item.id}
            onClick={() => onChange(item.id)}
            type="button"
          >
            <div className="grid h-24 place-items-center">
              <div
                className={`rounded-xs border-2 ${selected ? "border-primary" : "border-muted-foreground/40"}`}
                style={{ width: landscape ? 88 : 48, height: landscape ? 48 : 88 }}
              />
            </div>
            <p className="mt-2 flex items-center justify-between gap-1 text-xs font-semibold">
              <span className="truncate">{item.label}</span>
              {selected ? <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">✓</span> : null}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{item.width}×{item.height} · {item.fps} fps</p>
          </button>
        );
      })}
    </div>
  );
};
