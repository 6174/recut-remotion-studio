/**
 * [INPUT]: 依赖素材目录、media.pick 与父级 onStart 提交回调
 * [OUTPUT]: 对外提供新建项目 Brief 的表单：风格模板、选题描述、时长与素材选择
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
import { recut } from "./recut-sdk";
import type { Catalog, MediaAsset } from "./app";

interface BriefFormProps {
  catalog: Catalog;
  status: string;
  onStart: (input: { template: string; style: string; topic: string; details: string; expectedDurationSec: number; materialAssetIds: string[] }) => Promise<void>;
}

const selectClass = "h-8 w-full rounded-xs border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50";

export function BriefForm({ catalog, status, onStart }: BriefFormProps) {
  const [template, setTemplate] = useState(Object.keys(catalog.scenarios)[0] || "faceless-explainer");
  const [style, setStyle] = useState(Object.keys(catalog.designSystems)[0] || "clean-editorial");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [duration, setDuration] = useState(60);
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
      await onStart({ template, style, topic: topic.trim(), details: details.trim(), expectedDurationSec: duration, materialAssetIds: materials.map((item) => item.id) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-5 py-6">
        <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-primary">REMOTION STUDIO / NEW BRIEF</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">新建一支程序化视频</h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">先选成片场景（做什么样的视频），再选设计系统（什么风格表达）；前者决定叙事和组件组合，后者决定视觉语言。AI 会把两者写进项目的 Remotion 代码。</p>

        <div className="mt-5 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div><CardTitle>成片场景</CardTitle><p className="mt-0.5 font-mono text-[10px] text-muted-foreground">定义叙事骨架与底层组件组合；Agent 会读对应场景技能（导演视角）</p></div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(catalog.scenarios).map(([id, templateInfo]) => {
                const active = template === id;
                return (
                  <button aria-checked={active} className={`rounded-xs border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30 hover:bg-muted"}`} key={id} onClick={() => setTemplate(id)} role="radio" type="button">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium">{templateInfo.label}</span>
                      {active ? <span className="size-1.5 rounded-full bg-primary" /> : null}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{templateInfo.description}</span>
                    <span className="mt-1.5 block text-[10px] leading-4 text-muted-foreground/80">组件：{templateInfo.components.join(" · ")}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div><CardTitle>设计系统</CardTitle><p className="mt-0.5 font-mono text-[10px] text-muted-foreground">独立的色彩、字体、间距、形状与动效语法；Agent 会读取对应 DESIGN.md</p></div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(catalog.designSystems).map(([id, styleInfo]) => {
                const active = style === id;
                return <button aria-checked={active} className={`rounded-xs border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30 hover:bg-muted"}`} key={id} onClick={() => setStyle(id)} role="radio" type="button"><span className="flex items-center justify-between gap-2"><span className="text-xs font-medium">{styleInfo.label}</span>{active ? <span className="size-1.5 rounded-full bg-primary" /> : null}</span><span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{styleInfo.description}</span><span className="mt-1.5 block text-[10px] leading-4 text-muted-foreground/80">{styleInfo.category ? `${styleInfo.category} · ` : ""}{styleInfo.motion}</span></button>;
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>选题与描述</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">选题方向</span>
                <Input autoFocus id="brief-topic" onChange={(event) => setTopic(event.target.value)} placeholder="例如：为什么人人都该学会做视频" value={topic} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">详细描述（可选）</span>
                <Textarea id="brief-details" onChange={(event) => setDetails(event.target.value)} placeholder="目标观众、核心观点、风格偏好、想要的效果或任何约束…" value={details} />
              </label>
              <label className="block max-w-56">
                <span className="mb-1.5 block text-xs font-medium">预期时长（秒）</span>
                <select className={selectClass} id="brief-duration" onChange={(event) => setDuration(Number(event.target.value))} value={duration}>
                  {[15, 30, 45, 60, 90, 120].map((seconds) => <option key={seconds} value={seconds}>{seconds} 秒</option>)}
                </select>
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
