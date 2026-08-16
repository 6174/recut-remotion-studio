/**
 * [INPUT]: 依赖 catalog 的 Three material/camera effects、preview 的真实 Three 样片与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 EffectsFineTune：紧凑网格材质与 Camera Language v2 选择器、实时预览与包含参数 schema 的可编辑 Prompt
 * [POS]: remotion-studio/ui/fine-tunes 的镜头层微调动作。Agent 按叙事自动选择材质的 effect/transition/ambient
 *        或 camera 的 descriptor.camera 挂载位置与材质参数，用户只负责选择效果。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { LivePreview } from "../preview/PreviewCard";
import { useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import type { FineTuneProps } from "./FineTuneProps";

const CATEGORY_LABELS: Record<string, string> = {
  post: "effects.cat.post",
  transform: "effects.cat.transform",
  transition: "effects.cat.transition",
  ambient: "effects.cat.ambient",
  camera: "effects.cat.camera",
};

/** 支持镜头锚点（lens/center）的材质：需要视觉焦点。 */
const LENS_MATERIALS = new Set(["magnify", "glass", "bubble", "ripple"]);

export const EffectsFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, onPrompt, onReady }) => {
  const locale = useRecutLocale();
  const effects = useMemo(
    () => (catalog.effects ?? []).filter((item) => item.engine === "three" || item.engine === "three-camera"),
    [catalog.effects],
  );
  const [value, setValue] = useState(effects[0]?.id ?? "");
  const [hovered, setHovered] = useState<string | null>(null);
  const active = effects.find((item) => item.id === (hovered ?? value)) ?? effects[0];
  const schema = active?.material?.schema ?? {};
  const isCamera = active?.engine === "three-camera";
  const isLensInspect = active?.id === "camera-lens-inspect";
  const previewKind = isCamera ? "camera" as const : "material" as const;

  const groups = useMemo(() => {
    const map = new Map<string, typeof effects>();
    for (const item of effects) {
      const category = (item.material?.category ?? item.layer) as string;
      const key = t(locale, CATEGORY_LABELS[category] ?? category);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [effects, locale]);

  const isLens = active ? LENS_MATERIALS.has(active.id) : false;

  const placementText = useMemo(() => {
    const schemaBlock = Object.keys(schema).length
      ? t(locale, "effects.schemaNote", { schema: JSON.stringify(schema) })
      : "";
    if (isCamera) {
      const camera = active?.camera;
      const surface = active?.surface;
      const cameraBlock = camera ? JSON.stringify(camera) : t(locale, "effects.missingPreset");
      const surfaceBlock = surface ? JSON.stringify(surface) : t(locale, "effects.missingSurfacePreset");
      const lensBlock = isLensInspect
        ? t(locale, "effects.lensBlock", { zoom: String(camera?.lens?.zoom ?? 1.75), radius: String(camera?.lens?.radius ?? 138) })
        : "";
      return [
        t(locale, "effects.cameraDeploy", { camera: cameraBlock, surface: surfaceBlock }),
        t(locale, "effects.cameraInstruction"),
        lensBlock,
      ].filter(Boolean).join("\n");
    }
    return [
      t(locale, "effects.effectDeploy", { id: active?.id ?? "" }),
      active?.id === "article-highlight"
        ? t(locale, "effects.articleHighlight")
        : active?.id === "text-focus"
          ? t(locale, "effects.textFocus")
          : isLens
            ? t(locale, "effects.lensFocus")
            : null,
      schemaBlock,
    ].filter(Boolean).join("\n");
  }, [active?.camera, active?.id, active?.surface, isCamera, isLens, isLensInspect, locale, schema]);

  const prompt = useMemo(() => {
    if (!active) return "";
    return [
      basePrompt || t(locale, "effects.defaultBasePrompt"),
      t(locale, "effects.spec", { label: active.label, description: active.description }),
      isCamera
        ? t(locale, "effects.engineCamera", { verb: active.camera?.verb ?? active.id })
        : t(locale, "effects.engineMaterial", { category: active.material?.category ?? active.layer }),
      t(locale, "effects.source", { path: active.source.path, workspacePath: active.source.workspacePath }),
      placementText,
      isCamera
        ? t(locale, "effects.implementCamera")
        : t(locale, "effects.implementMaterial"),
      isCamera
        ? t(locale, "effects.acceptCamera")
        : t(locale, "effects.acceptMaterial"),
    ].join("\n");
  }, [active, basePrompt, isCamera, locale, placementText]);

  useEffect(() => {
    onPrompt(prompt);
    onReady(true);
  }, [onPrompt, onReady, prompt]);

  if (effects.length === 0) {
    return <p className="text-xs text-muted-foreground">{t(locale, "effects.noMaterials")}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid min-h-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 max-md:grid-cols-1">
        <div className="max-h-[320px] min-h-0 space-y-2 overflow-y-auto rounded-xs border border-border bg-muted/10 p-2 pr-1">
          {groups.map(([label, list]) => (
            <div key={label}>
              <p className="px-1 pb-1 pt-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">{label}</p>
              <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
                {list.map((item) => {
                  const selected = item.id === value;
                  return (
                    <button
                      className={`relative flex min-h-16 w-full flex-col justify-between rounded-xs border p-2 text-left outline-none ${selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/40"}`}
                      key={item.id}
                      onFocus={() => setHovered(item.id)}
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered((current) => (current === item.id ? null : current))}
                      onClick={() => setValue(item.id)}
                      type="button"
                    >
                      <span className="min-w-0 pr-4 text-xs font-semibold leading-4">{item.label}</span>
                      <span className="line-clamp-2 min-w-0 text-[10px] leading-3.5 text-muted-foreground">{item.description}</span>
                      {selected ? <span className="absolute right-2 top-2 grid size-3.5 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-0 space-y-2">
          <LivePreview
            key={`material:${active?.id}`}
            autoPlay
            height={320}
            initialFrame={0}
            showControls
            spec={{ id: active?.id ?? "", kind: previewKind }}
          />
          <p className="flex items-center gap-2 text-xs font-semibold">
            <span className="truncate">{active?.label}</span>
            <span className="min-w-0 flex-1 truncate text-[10px] font-normal text-muted-foreground">{active?.description}</span>
          </p>
          <p className="flex flex-wrap gap-1 text-[10px] leading-4 text-muted-foreground">
            {active?.placement.map((p) => <span className="rounded-sm border border-border bg-muted/20 px-1.5 py-0.5" key={p}>{p}</span>)}
          </p>
        </div>
      </div>
    </div>
  );
};
