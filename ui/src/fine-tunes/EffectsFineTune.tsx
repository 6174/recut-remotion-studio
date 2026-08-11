/**
 * [INPUT]: 依赖 catalog 的 Three material/camera effects、preview 的真实 Three 样片与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 EffectsFineTune：紧凑网格材质与 Camera Language v2 选择器、实时预览与包含参数 schema 的可编辑 Prompt
 * [POS]: remotion-studio/ui/fine-tunes 的镜头层微调动作。Agent 按叙事自动选择材质的 effect/transition/ambient
 *        或 camera 的 descriptor.camera 挂载位置与材质参数，用户只负责选择效果。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { LivePreview } from "../preview/PreviewCard";
import type { FineTuneProps } from "./FineTuneProps";

const CATEGORY_LABELS: Record<string, string> = {
  post: "后处理特效",
  transform: "转场特效",
  transition: "A/B 转场",
  ambient: "环境氛围",
  camera: "Three 镜头",
};

/** 支持镜头锚点（lens/center）的材质：需要视觉焦点。 */
const LENS_MATERIALS = new Set(["magnify", "glass", "bubble", "ripple"]);

export const EffectsFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, onPrompt, onReady }) => {
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
      const key = CATEGORY_LABELS[category] ?? category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [effects]);

  const isLens = active ? LENS_MATERIALS.has(active.id) : false;

  const placementText = useMemo(() => {
    const schemaBlock = Object.keys(schema).length
      ? `可用参数 schema：${JSON.stringify(schema)}。按镜头与内容自行选择必要参数，遵守 min/max，并将最终值写入 effectOptions。`
      : "";
    if (isCamera) {
      const camera = active?.camera;
      const surface = active?.surface;
      const cameraBlock = camera ? JSON.stringify(camera) : "（缺少 preset）";
      const surfaceBlock = surface ? JSON.stringify(surface) : "（缺少表面姿态 preset）";
      const lensBlock = isLensInspect
        ? `同时把 lens.anchor 与 camera.subject.anchor 设为同一个目标；使用 magnify 的 zoom=${camera?.lens?.zoom ?? 1.75}、radius=${camera?.lens?.radius ?? 138}，并让 lens 在相机抵达后出现。`
        : "";
      return [
        `镜头部署：Agent 选择最能服务叙事的 ShotGraph 镜头，并在 descriptor 设置 camera 为 ${cameraBlock}、surface 为 ${surfaceBlock}。`,
        "先读 SCENES 和场景排版，将 subject.anchor 替换为唯一、可读的真实目标；surface 的 position / rotation / scale / bend 负责表面落位；一个镜头只保留一个主动作。",
        lensBlock,
      ].filter(Boolean).join("\n");
    }
    return [
      `镜头部署：Agent 按叙事节奏在 ShotGraph 镜头 descriptor 上设置 effect/transition/ambient 为 "${active?.id}"，并将参数写入 effectOptions。`,
      active?.id === "article-highlight"
        ? "Article Highlight 选择关键文字，按排版写入 center、markerWidth、markerHeight，并让 marker 随镜头进度划出。"
        : active?.id === "text-focus"
          ? "Text Focus 选择清晰呈现的文字或卡片，按目标边界写入 focusBox=[left,top,width,height]。"
          : isLens
            ? "magnify/glass/ripple 选择画面焦点并以 descriptor.lens 驱动扫描中心；bubble 写入 effectOptions.center。"
            : null,
      schemaBlock,
    ].filter(Boolean).join("\n");
  }, [active?.camera, active?.id, active?.surface, isCamera, isLens, isLensInspect, schema]);

  const prompt = useMemo(() => {
    if (!active) return "";
    return [
      basePrompt || "请把当前视频的表达增强为我选择的 GPU 材质效果。",
      `特效：${active.label}（${active.description}）`,
      isCamera
        ? `引擎：Three Shot Language · @recut/remotion-kit/three · CameraMoveDescriptor + SurfaceMoveDescriptor（${active.camera?.verb ?? active.id}）`
        : `引擎：Three GPU material · @recut/remotion-kit/materials · MaterialElement（${active.material?.category ?? active.layer}）`,
      `推荐源码：${active.source.path}（项目落点 ${active.source.workspacePath}；在 ShotGraph 镜头 descriptor 挂载，禁止写独立 demo）`,
      placementText,
      isCamera
        ? "实现方式：改 workspace 的 ProjectVideo/ShotGraph 镜头 descriptor.camera 与 descriptor.surface；所有值由 shot progress 派生。surface 的 keyframes 可同时写 position、rotation、scale、bend，默认在约 1 秒内落位并保持阅读。Lens Inspect 额外用相同 subject 配置 magnify 的 lens/anchor，禁止手填两套目标坐标。"
        : "实现方式：改 workspace 的 ProjectVideo/ShotGraph 镜头 descriptor：effect（主效果）/ transition（转场 {material,durationFrames}）/ ambient（环境）；语义参数放 effectOptions；用 schema 声明的参数名。",
      isCamera
        ? "验收：走 Three-first GPU 合成（HtmlSurfaceProvider 真实树光栅化 + SurfaceMotion 真实网格弯曲/姿态 + CameraDirector）；预览/导出逐帧一致；单平面可以有透视与曲面，但不得声称真实景深。"
        : "验收：走 Three-first GPU 合成（HtmlSurfaceProvider 真实树光栅化 + MaterialElement 逐帧只更新 uniform）；预览/导出逐帧一致；禁止回退到旧 html-canvas / GpuCompositor 效果。",
    ].join("\n");
  }, [active, basePrompt, isCamera, placementText]);

  useEffect(() => {
    onPrompt(prompt);
    onReady(true);
  }, [onPrompt, onReady, prompt]);

  if (effects.length === 0) {
    return <p className="text-xs text-muted-foreground">目录中暂无可用的 Three GPU 材质。</p>;
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
