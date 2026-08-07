/**
 * [INPUT]: 依赖场景定义、目录资源、真实素材选择和通用 Prompt 回调
 * [OUTPUT]: 对外提供 CreationScenario，为成片场景收集画面、字幕、画幅和素材约束
 * [POS]: scenarios 的成片入口；将用户选择的交付目标翻译为 remotion-scenes skill 可执行的 Prompt
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { CanvasPicker } from "../preview/CanvasPicker";
import { PreviewPicker } from "../preview/PreviewPicker";
import { recut } from "../recut-sdk";
import type { MediaAsset } from "../app";
import { AssetPicker } from "./AssetPicker";
import type { ScenarioProps } from "./types";

export const CreationScenario: React.FC<ScenarioProps> = ({ catalog, completedAssets, sceneMode, onPrompt, onReady, onStatus }) => {
  const [template, setTemplate] = useState(Object.keys(catalog.styleTemplates)[0] || "");
  const [caption, setCaption] = useState(catalog.captionThemes[0]?.id || "");
  const [canvas, setCanvas] = useState(catalog.canvasSizes[0]?.id || "");
  const [selected, setSelected] = useState<MediaAsset[]>([]);
  const mode = sceneMode;
  const asset = mode?.asset;
  const ready = !asset?.required || selected.length > 0;

  useEffect(() => { onReady(ready); }, [onReady, ready]);

  const prompt = useMemo(() => {
    if (!mode) return "";
    const selectedTemplate = catalog.styleTemplates[template];
    const selectedCaption = catalog.captionThemes.find((item) => item.id === caption);
    const selectedCanvas = catalog.canvasSizes.find((item) => item.id === canvas);
    const assetLines = selected.length
      ? `\n\n选定素材（只使用这些真实 assetId）：\n${selected.map((item) => `- ${item.name}（${item.kind}，assetId: ${item.id}）`).join("\n")}\n使用 resolveMediaUrl(assetId, media) 引用，并在改完 composition 后调用 composition.assets 登记全部 assetId。`
      : "";
    return `本次选择的成片场景：${mode.title}（${mode.id}）。\n先读取 App skill \`remotion-scenes\` 中 \`${mode.id}\` 的场景约束，再按 \`remotion-studio\` skill 的代码、素材和预览流程执行；这是 Recut 的本地 Remotion 实现，不要调用 HyperFrames CLI。\n\n${mode.basePrompt}\n\n目标交付：${mode.outcome}\n视觉模板：${selectedTemplate?.label ?? template}（${selectedTemplate?.description ?? ""}）\n字幕主题：${selectedCaption?.label ?? caption}\n目标画幅：${selectedCanvas?.label ?? canvas}（${selectedCanvas?.width ?? ""}×${selectedCanvas?.height ?? ""}，${selectedCanvas?.fps ?? ""} fps）${assetLines}`;
  }, [canvas, caption, catalog, mode, selected, template]);

  useEffect(() => { onPrompt(prompt); }, [onPrompt, prompt]);

  const pick = async () => {
    if (!asset) return;
    try {
      const picked = await recut.media.pick({ kinds: asset.kinds, multiple: true });
      if (!picked) return;
      const next = Array.isArray(picked) ? picked : [picked];
      setSelected((current) => {
        const merged = [...current];
        next.forEach((item) => {
          if (!merged.some((existing) => existing.id === item.id)) merged.push({ id: item.id, kind: item.kind as MediaAsset["kind"], name: item.name, status: "completed" });
        });
        return merged;
      });
    } catch (cause) {
      onStatus(cause instanceof Error ? cause.message : "素材选择失败");
    }
  };

  const visibleAssets = asset ? completedAssets.filter((item) => asset.kinds.includes(item.kind)) : [];
  const toggle = (id: string) => {
    setSelected((current) => (current.some((item) => item.id === id)
      ? current.filter((item) => item.id !== id)
      : [...current, visibleAssets.find((item) => item.id === id)].filter(Boolean) as MediaAsset[]));
  };

  return mode ? (
    <div className="space-y-4">
      <div className="rounded-xs border border-primary/20 bg-primary/5 px-3 py-2.5">
        <p className="text-xs font-semibold">{mode.outcome}</p>
        <p className="mt-1 text-[11px] leading-4 text-muted-foreground">场景技能：{mode.skill} · 选择会随 Prompt 一起交给 Agent。</p>
      </div>
      <div>
        <span className="mb-1.5 block text-xs font-medium">视觉模板</span>
        <PreviewPicker items={Object.entries(catalog.styleTemplates).map(([id, item]) => ({ id, label: item.label, description: `${item.description} · ${item.motion}` }))} kind="style" onChange={setTemplate} value={template} />
      </div>
      <div>
        <span className="mb-1.5 block text-xs font-medium">字幕主题</span>
        <PreviewPicker columns={4} items={catalog.captionThemes.map((item) => ({ id: item.id, label: item.label, description: item.description }))} kind="caption" layout="side" onChange={setCaption} value={caption} />
      </div>
      <div>
        <span className="mb-1.5 block text-xs font-medium">目标画幅</span>
        <CanvasPicker items={catalog.canvasSizes} onChange={setCanvas} value={canvas} />
      </div>
      {asset ? <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between gap-3">
          <div><span className="block text-xs font-medium">{asset.label}{asset.required ? "（必选）" : ""}</span><span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{asset.hint}</span></div>
          <Button className="shrink-0 px-2 text-[11px]" onClick={() => void pick()} type="button" variant="outline">从素材库选择</Button>
        </div>
        {visibleAssets.length > 0 ? <AssetPicker assets={visibleAssets} multiple onToggle={toggle} selectedIds={selected.map((item) => item.id)} /> : null}
        {selected.length > visibleAssets.length ? <p className="mt-2 text-xs text-muted-foreground">已从素材库选择 {selected.length} 个素材。</p> : null}
      </div> : null}
    </div>
  ) : null;
};
