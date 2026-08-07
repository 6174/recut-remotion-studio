/**
 * [INPUT]: 依赖 preview/PreviewCard 与 preview/compositions
 * [OUTPUT]: 对外提供可视化选择器：大预览（悬停/选中切换）+ 选项网格
 * [POS]: remotion-studio/ui 预览层的选择器；模板/字幕选择共用，选择状态与 prompt 由场景模块持有
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useState } from "react";
import { LivePreview, PreviewCard } from "./PreviewCard";
import type { PreviewKind } from "./compositions";

export interface PreviewItem {
  id: string;
  label: string;
  description?: string;
}

interface PreviewPickerProps {
  kind: PreviewKind;
  items: PreviewItem[];
  value: string;
  onChange: (id: string) => void;
  columns?: number;
  versionHint?: string;
  layout?: "stack" | "side";
}

export const PreviewPicker: React.FC<PreviewPickerProps> = ({ kind, items, value, onChange, columns = 3, versionHint, layout = "stack" }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = items.find((item) => item.id === (hovered ?? value)) ?? items[0];
  const gridClass = columns === 4 ? "grid-cols-4" : columns === 2 ? "grid-cols-2" : "grid-cols-3";

  const cards = items.map((item) => (
    <PreviewCard
      description={item.description}
      key={item.id}
      label={item.label}
      onBlur={() => setHovered(null)}
      onFocus={() => setHovered(item.id)}
      onMouseEnter={() => setHovered(item.id)}
      onMouseLeave={() => setHovered((current) => (current === item.id ? null : current))}
      onSelect={() => onChange(item.id)}
      selected={item.id === value}
      spec={{ id: item.id, kind }}
    />
  ));

  const hint = versionHint ? (
    <p className="mb-1.5 flex items-center gap-1.5 text-[10px] leading-4 text-muted-foreground"><span className="size-1 rounded-full bg-primary" />{versionHint}</p>
  ) : null;

  const meta = active ? (
    <p className="flex items-center gap-2 text-xs font-semibold">
      <span className="truncate">{active.label}</span>
      {active.description ? <span className="min-w-0 flex-1 truncate text-[10px] font-normal text-muted-foreground">{active.description}</span> : null}
    </p>
  ) : null;

  if (layout === "side") {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_200px] gap-3">
        <div className="min-w-0">
          {hint}
          <div className={`grid ${gridClass} max-h-52 min-h-0 gap-2 overflow-y-auto rounded-xs border border-border bg-muted/10 p-2 pr-1`}>{cards}</div>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <LivePreview key={active?.id} showControls spec={{ id: active?.id ?? "", kind }} />
          <p className="truncate text-xs font-semibold">{active?.label}</p>
          {active?.description ? <p className="text-[10px] leading-4 text-muted-foreground">{active.description}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {hint}
      <LivePreview key={active?.id} height={260} showControls spec={{ id: active?.id ?? "", kind }} />
      {meta}
      <div className={`grid ${gridClass} max-h-52 min-h-0 gap-2 overflow-y-auto rounded-xs border border-border bg-muted/10 p-2 pr-1`}>{cards}</div>
    </div>
  );
};
