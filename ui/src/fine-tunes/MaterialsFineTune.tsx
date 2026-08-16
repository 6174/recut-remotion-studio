/**
 * [INPUT]: 依赖项目素材、AssetPicker、Recut 媒体 API 与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 MaterialsFineTune，组装所选素材的引用清单
 * [POS]: fine-tunes 的素材使用动作；只提供素材，不预设改写方式
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { recut, useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import type { MediaAsset } from "../app";
import { AssetPicker } from "./AssetPicker";
import type { FineTuneProps } from "./FineTuneProps";

export const MaterialsFineTune: React.FC<FineTuneProps> = ({ completedAssets, basePrompt, onPrompt, onReady, onStatus }) => {
  const locale = useRecutLocale();
  const [selected, setSelected] = useState<MediaAsset[]>([]);

  const ready = selected.length > 0;
  useEffect(() => { onReady(ready); }, [onReady, ready]);

  const prompt = useMemo(
    () => [basePrompt, t(locale, "materials.prompt", { videos: selected.map((asset) => t(locale, "materials.item", { name: asset.name, kind: asset.kind, id: asset.id })).join("\n") })]
      .filter(Boolean)
      .join("\n\n"),
    [basePrompt, locale, selected],
  );
  useEffect(() => { onPrompt(prompt); }, [onPrompt, prompt]);

  const pick = async () => {
    try {
      const selection = await recut.media.pick({ kinds: ["image", "video", "audio"], multiple: true });
      if (!selection) return;
      const picked = Array.isArray(selection) ? selection : [selection];
      setSelected((current) => {
        const merged = [...current];
        for (const item of picked) {
          if (!merged.some((existing) => existing.id === item.id)) {
            merged.push({ id: item.id, kind: item.kind as MediaAsset["kind"], name: item.name, status: "completed" });
          }
        }
        return merged;
      });
    } catch (cause) {
      onStatus(cause instanceof Error ? cause.message : t(locale, "materials.pickFailed"));
    }
  };

  const toggle = (id: string) => {
    setSelected((current) => (current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : [...current, completedAssets.find((item) => item.id === id)].filter(Boolean) as MediaAsset[]));
  };

  const pickedMissing = selected.filter((asset) => !completedAssets.some((item) => item.id === asset.id));

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium">{t(locale, "materials.title")}</span>
        <Button className="px-2 text-[11px]" onClick={() => void pick()} type="button" variant="outline">{t(locale, "materials.pick")}</Button>
      </div>
      {completedAssets.length > 0 ? (
        <AssetPicker assets={completedAssets} multiple onToggle={toggle} selectedIds={selected.map((item) => item.id)} />
      ) : (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(locale, "materials.empty")}</p>
      )}
      {pickedMissing.length > 0 ? <p className="mt-2 text-xs text-muted-foreground">{t(locale, "materials.pickedNote", { count: String(pickedMissing.length) })}</p> : null}
    </div>
  );
};
