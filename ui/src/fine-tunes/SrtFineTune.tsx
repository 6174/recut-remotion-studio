/**
 * [INPUT]: 依赖成片模板目录、素材选择器、预览选择器与 Recut 媒体 API
 * [OUTPUT]: 对外提供 SrtFineTune，收集 SRT 或音视频来源并生成成片提示
 * [POS]: remotion-studio/ui/fine-tunes 的字幕成片微调动作；组合成片模板与字幕来源
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PreviewPicker } from "../preview/PreviewPicker";
import { recut } from "../recut-sdk";
import type { MediaAsset } from "../app";
import { AssetPicker } from "./AssetPicker";
import type { FineTuneProps } from "./FineTuneProps";

export const SrtFineTune: React.FC<FineTuneProps> = ({ catalog, completedAssets, basePrompt, onPrompt, onReady, onStatus }) => {
  const [template, setTemplate] = useState(Object.keys(catalog.scenarios)[0] || "");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [sourceAsset, setSourceAsset] = useState<MediaAsset | null>(null);

  const ready = Boolean(text.trim() || sourceAsset);
  useEffect(() => { onReady(ready); }, [onReady, ready]);

  const prompt = useMemo(() => {
    const selectedTemplate = catalog.scenarios[template];
    const sourceText = sourceAsset
      ? `\n字幕来源素材：${sourceAsset.name}（${sourceAsset.kind}，assetId: ${sourceAsset.id}）\n请先从该素材转录生成 SRT，再按时间轴构建视频，并在 composition.assets 中登记它。`
      : "";
    return `${basePrompt}\n\n成片模板：${selectedTemplate?.label ?? template}（${selectedTemplate?.description ?? ""}）${
      text.trim() ? `\nSRT 文件：${file?.name ?? "未命名.srt"}\n\nSRT 内容：\n${text.slice(0, 16000)}` : sourceText || "\n请上传 .srt 文件或选择一个音视频素材。"
    }`;
  }, [basePrompt, catalog, file?.name, sourceAsset, template, text]);
  useEffect(() => { onPrompt(prompt); }, [onPrompt, prompt]);

  const pickSource = async () => {
    try {
      const selection = await recut.media.pick({ kinds: ["video", "audio"], multiple: false, selectedIDs: sourceAsset ? [sourceAsset.id] : undefined });
      if (!selection) return;
      const picked = Array.isArray(selection) ? selection[0] : selection;
      setSourceAsset({ id: picked.id, kind: picked.kind as MediaAsset["kind"], name: picked.name, status: "completed" });
      setFile(null);
      setText("");
    } catch (cause) {
      onStatus(cause instanceof Error ? cause.message : "素材选择失败");
    }
  };

  const media = completedAssets.filter((asset) => asset.kind === "video" || asset.kind === "audio");

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-1.5 block text-xs font-medium">选择成片模板</span>
        <PreviewPicker
          items={Object.entries(catalog.scenarios).map(([id, item]) => ({ id, label: item.label, description: item.description }))}
          kind="composition"
          onChange={setTemplate}
          value={template}
        />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium">上传 SRT 字幕文件</span>
        <Input accept=".srt,.vtt,text/plain" onChange={(event) => { const next = event.target.files?.[0] ?? null; setFile(next); setSourceAsset(null); setText(""); if (next) void next.text().then(setText).catch(() => onStatus("字幕文件读取失败，请更换后重试。")); }} type="file" />
        {file ? <p className="mt-1.5 text-xs text-muted-foreground">已选择：{file.name}</p> : <p className="mt-1.5 text-xs text-muted-foreground">上传后会把字幕时间轴交给 Agent，用于拆分场景。</p>}
      </label>
      <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium">或者从 assets 选择音视频</span>
          <Button className="px-2 text-[11px]" onClick={() => void pickSource()} type="button" variant="outline">从素材库选择</Button>
        </div>
        {media.length > 0 ? (
          <AssetPicker
            assets={media}
            multiple={false}
            onToggle={(id) => { setSourceAsset((current) => (current?.id === id ? null : completedAssets.find((item) => item.id === id) ?? null)); setFile(null); setText(""); }}
            selectedIds={sourceAsset ? [sourceAsset.id] : []}
          />
        ) : (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">项目内没有音视频素材；可从素材库选择。</p>
        )}
        {sourceAsset ? <p className="mt-2 text-xs text-muted-foreground">已选择：{sourceAsset.name}。Agent 会先转录为 SRT。</p> : null}
      </div>
    </div>
  );
};
