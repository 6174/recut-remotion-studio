import type { MediaAsset } from "../app";

interface AssetPickerProps {
  assets: MediaAsset[];
  selectedIds: string[];
  multiple: boolean;
  kinds?: MediaAsset["kind"][];
  emptyText?: string;
  onToggle: (id: string) => void;
}

export const AssetPicker: React.FC<AssetPickerProps> = ({ assets, selectedIds, multiple, kinds, emptyText = "项目内没有可用素材。", onToggle }) => {
  const list = kinds ? assets.filter((asset) => kinds.includes(asset.kind)) : assets;
  if (!list.length) return <p className="mt-2 text-xs leading-5 text-muted-foreground">{emptyText}</p>;
  return (
    <div className="mt-2 space-y-1.5">
      {list.map((asset) => {
        const active = selectedIds.includes(asset.id);
        if (multiple) {
          return (
            <label className="flex cursor-pointer items-center gap-2 rounded-xs border border-border bg-muted/20 p-2" key={asset.id}>
              <input checked={active} className="accent-[var(--primary)]" onChange={() => onToggle(asset.id)} type="checkbox" />
              <span className="min-w-0 flex-1 truncate text-xs">{asset.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{asset.kind}</span>
            </label>
          );
        }
        return (
          <button
            className={`flex w-full items-center gap-2 rounded-xs border p-2 text-left text-xs outline-none ${active ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:border-primary/40"}`}
            key={asset.id}
            onClick={() => onToggle(asset.id)}
            type="button"
          >
            <span className="min-w-0 flex-1 truncate">{asset.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{asset.kind}</span>
          </button>
        );
      })}
    </div>
  );
};
