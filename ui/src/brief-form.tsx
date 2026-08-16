/**
 * [INPUT]: 依赖素材目录、media.pick、转写 SRT part 与父级 onStart 提交回调
 * [OUTPUT]: 对外提供新建项目 Brief 的表单：可预览成片模板、选题、详细描述、优先从素材库选择的 SRT/视频叙事来源与多选素材
 * [POS]: remotion-studio/ui 的创建入口；提交后切换到工作室工作面
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { PreviewPicker } from "./preview/PreviewPicker";
import { apiBase, recut, useRecutLocale } from "./recut-sdk";
import { t } from "./i18n";
import type { Catalog, MediaAsset, NarrativeSource } from "./app";

interface BriefFormProps {
  catalog: Catalog;
  status: string;
  onStart: (input: { template: string; topic: string; details: string; materialAssetIds: string[]; narrativeSource: NarrativeSource | null }) => Promise<void>;
}

export function BriefForm({ catalog, status, onStart }: BriefFormProps) {
  const locale = useRecutLocale();
  const [template, setTemplate] = useState(Object.keys(catalog.scenarios)[0] || "faceless-explainer");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [materials, setMaterials] = useState<MediaAsset[]>([]);
  const [narrativeSource, setNarrativeSource] = useState<NarrativeSource | null>(null);
  const [busy, setBusy] = useState(false);

  const pickMaterials = async () => {
    try {
      const selection = await recut.media.pick({ kinds: ["image", "video", "audio"], multiple: true });
      if (selection) {
        const picked = Array.isArray(selection) ? selection : [selection];
        setMaterials(picked.map((item) => ({ id: item.id, kind: item.kind as MediaAsset["kind"], name: item.name, status: "completed" })));
      }
    } catch (cause) {
      console.error("[remotion-studio] material pick failed", cause);
    }
  };

  const selectSrt = async (file: File | null) => {
    if (!file) return;
    try {
      const text = (await file.text()).trim();
      if (!text) throw new Error(t(locale, "form.srtEmptyError"));
      setNarrativeSource({ kind: "srt", name: file.name, text: text.slice(0, 16000) });
    } catch (cause) {
      console.error("[remotion-studio] SRT read failed", cause);
    }
  };

  const pickSrtFromLibrary = async () => {
    try {
      const selection = await recut.media.pick({ kinds: ["transcript"], multiple: false });
      if (!selection) return;
      const picked = Array.isArray(selection) ? selection[0] : selection;
      const response = await fetch(`${apiBase}/v1/media/assets/${encodeURIComponent(picked.id)}/parts/srt`, { cache: "no-store" });
      if (!response.ok) throw new Error(t(locale, "form.srtUnavailableError"));
      const text = (await response.text()).trim();
      if (!text) throw new Error(t(locale, "form.srtEmptyLibraryError"));
      setNarrativeSource({ kind: "srt", name: picked.name, text: text.slice(0, 16000) });
    } catch (cause) {
      console.error("[remotion-studio] library SRT pick failed", cause);
    }
  };

  const submit = async () => {
    if (!topic.trim()) return;
    setBusy(true);
    try {
      const videos = materials.filter((item) => item.kind === "video");
      const source = narrativeSource ?? (videos.length ? { kind: "videos" as const, assetIds: videos.map((item) => item.id), names: videos.map((item) => item.name) } : null);
      await onStart({ template, topic: topic.trim(), details: details.trim(), materialAssetIds: materials.map((item) => item.id), narrativeSource: source });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-5 py-6">
        <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-primary">{t(locale, "form.eyebrow")}</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{t(locale, "form.title")}</h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{t(locale, "form.subtitle")}</p>

        <div className="mt-5 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div><CardTitle>{t(locale, "form.templateTitle")}</CardTitle><p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{t(locale, "form.templateHint")}</p></div>
            </CardHeader>
            <CardContent>
              <PreviewPicker
                items={Object.entries(catalog.scenarios).map(([id, item]) => ({ id, label: item.label, description: item.description }))}
                kind="composition"
                onChange={setTemplate}
                value={template}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t(locale, "form.topicTitle")}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">{t(locale, "form.topicLabel")}</span>
                <Input autoFocus id="brief-topic" onChange={(event) => setTopic(event.target.value)} placeholder={t(locale, "form.topicPlaceholder")} value={topic} />
                <span className="mt-1.5 block text-[11px] text-muted-foreground">{t(locale, "form.topicHint")}</span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">{t(locale, "form.detailsLabel")}</span>
                <Textarea id="brief-details" onChange={(event) => setDetails(event.target.value)} placeholder={t(locale, "form.detailsPlaceholder")} rows={4} value={details} />
                <span className="mt-1.5 block text-[11px] text-muted-foreground">{t(locale, "form.detailsHint")}</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle>{t(locale, "form.materialTitle")}</CardTitle><p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{t(locale, "form.materialHint")}</p></div><Button onClick={() => void pickMaterials()} type="button" variant="outline"><Plus className="size-3.5" />{materials.length ? t(locale, "form.materialPickMore") : t(locale, "form.materialPick")}</Button></CardHeader>
            <CardContent className="space-y-3">
              <label className="block rounded-xs border border-border bg-muted/20 p-3">
                <span className="block text-xs font-medium">{t(locale, "form.srtLabel")}</span>
                <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{t(locale, "form.srtHint")}</span>
                <div className="mt-2 flex flex-wrap items-center gap-2"><Button onClick={() => void pickSrtFromLibrary()} type="button" variant="outline">{t(locale, "form.srtPickLibrary")}</Button><label className="text-xs text-muted-foreground" htmlFor="brief-narrative-srt">{t(locale, "form.srtUploadPrompt")}</label><Input accept=".srt,.vtt,text/plain" className="h-auto w-auto border-0 bg-transparent px-0 text-xs" id="brief-narrative-srt" onChange={(event) => void selectSrt(event.target.files?.[0] ?? null)} type="file" /></div>
              </label>
              {narrativeSource ? <div className="flex items-center gap-2 rounded-xs border border-primary/25 bg-primary/5 p-2"><Badge>{narrativeSource.kind === "videos" ? "VIDEO" : "SRT"}</Badge><span className="min-w-0 flex-1 truncate text-xs">{narrativeSource.kind === "srt" ? narrativeSource.name : (narrativeSource.names[0] ?? "")}</span><Button aria-label={t(locale, "form.srtRemoveAria")} className="size-7 px-0" onClick={() => setNarrativeSource(null)} type="button" variant="ghost"><Trash2 className="size-3.5" /></Button></div> : null}
              {materials.length === 0 ? <p className="text-xs leading-5 text-muted-foreground">{t(locale, "form.materialEmpty")}</p> : <div className="space-y-2">{materials.map((asset) => <div className="flex items-center gap-2 rounded-xs border border-border bg-muted/30 p-2" key={asset.id}><Badge>{asset.kind}</Badge><span className="min-w-0 flex-1 truncate text-xs">{asset.name}</span><span className="font-mono text-[10px] text-muted-foreground">{asset.id.slice(0, 8)}</span><Button aria-label={t(locale, "form.materialRemoveAria", { name: asset.name })} className="size-7 px-0" onClick={() => setMaterials((items) => items.filter((item) => item.id !== asset.id))} type="button" variant="ghost"><Trash2 className="size-3.5" /></Button></div>)}</div>}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="min-w-0 truncate text-xs text-muted-foreground" role="status">{status}</p>
            <Button disabled={busy || !topic.trim()} onClick={() => void submit()} type="button">{busy ? <Loader2 className="size-3.5 animate-spin" /> : null}{busy ? t(locale, "form.submitBusy") : t(locale, "form.submitIdle")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
