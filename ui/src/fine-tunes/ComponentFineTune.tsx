/**
 * [INPUT]: 依赖组件目录、preview/PreviewCard 与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 ComponentFineTune，左侧以紧凑网格卡片选择目录、右侧播放真实组件预览并生成插入提示
 * [POS]: remotion-studio/ui/fine-tunes 的动态组件微调动作；复用镜头特效的卡片交互，将 catalog 的 template/motion 类型映射到右侧预览层
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { LivePreview } from "../preview/PreviewCard";
import type { PreviewKind } from "../preview/compositions";
import type { FineTuneProps } from "./FineTuneProps";

export const ComponentFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const [value, setValue] = useState(catalog.components[0]?.id || "");
  const [hovered, setHovered] = useState<string | null>(null);
  const active = catalog.components.find((item) => item.id === (hovered ?? value)) ?? catalog.components[0];
  const previewKind: PreviewKind = active?.kind === "template" ? "template" : "component";

  const groups = useMemo(() => {
    const map = new Map<string, typeof catalog.components>();
    for (const item of catalog.components) {
      const key = item.category || "其他";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [catalog.components]);

  const prompt = useMemo(() => {
    const selected = catalog.components.find((item) => item.id === value);
    return `${basePrompt}\n\n组件：${selected?.label ?? value}（${selected?.category ?? ""}；${selected?.description ?? ""}）\n组件源码：${selected?.path ?? ""}\n项目落点：${selected?.workspacePath ?? ""}（项目内组件为冻结副本；若与最新目录不一致，用原生文件工具读 app 包最新源码，写回该落点按需升级，只动该组件）\n样式依赖：组件使用 app 包内 \`src/components/helpers/theme.ts\` 的 kitTheme 设计 token（Vercel 结构 + Recut 绿）；复制组件进项目时，若该相对导入不成立，请一并把 theme.ts 复制到 \`src/components/helpers/theme.ts\` 或把导入改写为 \`@recut/remotion-kit\`，保持 token 名不变。`;
  }, [basePrompt, catalog, value]);

  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);

  return (
    <div className="space-y-2">
      {kitVersionHint ? <p className="flex items-center gap-1.5 text-[10px] leading-4 text-muted-foreground"><span className="size-1 rounded-full bg-primary" />{kitVersionHint}</p> : null}
      <div className="grid min-h-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 max-md:grid-cols-1">
        <div className="max-h-[320px] min-h-0 space-y-2 overflow-y-auto rounded-xs border border-border bg-muted/10 p-2 pr-1">
          {groups.map(([category, list]) => (
            <div key={category}>
              <p className="px-1 pb-1 pt-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">{category}</p>
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
          <LivePreview key={`${previewKind}:${active?.id}`} height={320} showControls spec={{ id: active?.id ?? "", kind: previewKind }} />
          <p className="flex items-center gap-2 text-xs font-semibold">
            <span className="truncate">{active?.label}</span>
            {active?.description ? <span className="min-w-0 flex-1 truncate text-[10px] font-normal text-muted-foreground">{active.description}</span> : null}
          </p>
        </div>
      </div>
    </div>
  );
};
