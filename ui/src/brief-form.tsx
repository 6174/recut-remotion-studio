/**
 * [INPUT]: 依赖素材目录、media.pick 与父级 onStart 提交回调
 * [OUTPUT]: 对外提供新建项目 Brief 的表单：可预览成片模板、选题与素材选择
 * [POS]: remotion-studio/ui 的创建入口；提交后切换到工作室工作面
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { PreviewPicker } from "./preview/PreviewPicker";
import { recut } from "./recut-sdk";
import type { Catalog, MediaAsset } from "./app";

interface BriefFormProps {
  catalog: Catalog;
  status: string;
  onStart: (input: { template: string; topic: string; materialAssetIds: string[] }) => Promise<void>;
}

export function BriefForm({ catalog, status, onStart }: BriefFormProps) {
  const [template, setTemplate] = useState(Object.keys(catalog.scenarios)[0] || "faceless-explainer");
  const [topic, setTopic] = useState("");
  const [materials, setMaterials] = useState<MediaAsset[]>([]);
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

  const submit = async () => {
    if (!topic.trim()) return;
    setBusy(true);
    try {
      await onStart({ template, topic: topic.trim(), materialAssetIds: materials.map((item) => item.id) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-5 py-6">
        <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-primary">REMOTION STUDIO / NEW BRIEF</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">新建一支程序化视频</h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">从一个完整模板开始：模板已经定义了视觉、节奏和组件组合。然后给出选题并按需加入素材，AI 会直接把它写成成片。</p>

        <div className="mt-5 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div><CardTitle>选择模板</CardTitle><p className="mt-0.5 font-mono text-[10px] text-muted-foreground">先看真实预览；模板决定视频的视觉、叙事骨架与组件组合。</p></div>
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
            <CardHeader><CardTitle>选题与描述</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">选题</span>
                <Input autoFocus id="brief-topic" onChange={(event) => setTopic(event.target.value)} placeholder="例如：为什么人人都该学会做视频" value={topic} />
                <span className="mt-1.5 block text-[11px] text-muted-foreground">写清楚你想传达的核心观点；模板会负责视觉表达与叙事节奏。</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>素材</CardTitle>
              <Button onClick={() => void pickMaterials()} type="button" variant="outline"><Plus className="size-3.5" />{materials.length ? "重新选择素材" : "从素材库选择"}</Button>
            </CardHeader>
            <CardContent>
              {materials.length === 0 ? <p className="text-xs leading-5 text-muted-foreground">尚未选择素材；可在设计阶段继续补充，也可直接从空白开始。</p> : <div className="space-y-2">{materials.map((asset) => <div className="flex items-center gap-2 rounded-xs border border-border bg-muted/30 p-2" key={asset.id}><Badge>{asset.kind}</Badge><span className="min-w-0 flex-1 truncate text-xs">{asset.name}</span><span className="font-mono text-[10px] text-muted-foreground">{asset.id.slice(0, 8)}</span><Button aria-label={`移除 ${asset.name}`} className="size-7 px-0" onClick={() => setMaterials((items) => items.filter((item) => item.id !== asset.id))} type="button" variant="ghost"><Trash2 className="size-3.5" /></Button></div>)}</div>}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="min-w-0 truncate text-xs text-muted-foreground" role="status">{status}</p>
            <Button disabled={busy || !topic.trim()} onClick={() => void submit()} type="button">{busy ? <Loader2 className="size-3.5 animate-spin" /> : null}{busy ? "正在创建…" : "提交给 AI 开始设计"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
