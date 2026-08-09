/**
 * [INPUT]: 依赖项目素材、AssetPicker、Recut 媒体 API 与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 MaterialsFineTune，组装所选素材的引用清单
 * [POS]: fine-tunes 的素材使用动作；只提供素材，不预设改写方式
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { recut } from "../recut-sdk";
import type { MediaAsset } from "../app";
import { AssetPicker } from "./AssetPicker";
import type { FineTuneProps } from "./FineTuneProps";

export const MaterialsFineTune: React.FC<FineTuneProps> = ({ completedAssets, basePrompt, onPrompt, onReady, onStatus }) => {
  const [selected, setSelected] = useState<MediaAsset[]>([]);

  const ready = selected.length > 0;
  useEffect(() => { onReady(ready); }, [onReady, ready]);

  const prompt = useMemo(
    () => [basePrompt, `使用以下素材：\n${selected.map((asset) => `- ${asset.name}（${asset.kind}，assetId: ${asset.id}）`).join("\n")}`]
      .filter(Boolean)
      .join("\n\n"),
    [basePrompt, selected],
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
      onStatus(cause instanceof Error ? cause.message : "素材选择失败");
    }
  };

  const toggle = (id: string) => {
    setSelected((current) => (current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : [...current, completedAssets.find((item) => item.id === id)].filter(Boolean) as MediaAsset[]));
  };

  const pickedMissing = selected.filter((asset) => !completedAssets.some((item) => item.id === asset.id));

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium">要使用的素材</span>
        <Button className="px-2 text-[11px]" onClick={() => void pick()} type="button" variant="outline">从素材库选择</Button>
      </div>
      {completedAssets.length > 0 ? (
        <AssetPicker assets={completedAssets} multiple onToggle={toggle} selectedIds={selected.map((item) => item.id)} />
      ) : (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">项目内还没有可用素材。请从素材库选择，或先上传/生成素材。</p>
      )}
      {pickedMissing.length > 0 ? <p className="mt-2 text-xs text-muted-foreground">已从素材库选择 {pickedMissing.length} 个素材。</p> : null}
    </div>
  );
};
