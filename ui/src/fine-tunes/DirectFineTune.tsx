/**
 * [INPUT]: 依赖导演指令目录与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 DirectFineTune，组装无资源选择的镜头/节奏微调提示
 * [POS]: fine-tunes 的直接表达微调动作；不承载成片模板定义
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import type { FineTuneProps } from "./FineTuneProps";

export const DirectFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, onPrompt, onReady }) => {
  const directives = catalog.directives ?? [];
  const [value, setValue] = useState(directives[0]?.id ?? "");
  const prompt = useMemo(() => {
    const selected = directives.find((item) => item.id === value);
    return selected ? `${basePrompt}\n\n镜头表达方案：${selected.label}——${selected.prompt}` : basePrompt;
  }, [basePrompt, directives, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">镜头表达方案</span>
      <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1">
        {directives.map((item) => {
          const selected = item.id === value;
          return (
            <button
              className={`rounded-xs border p-2.5 text-left outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/30 ${selected ? "border-primary bg-primary/5" : "border-border bg-card"}`}
              key={item.id}
              onClick={() => setValue(item.id)}
              type="button"
            >
              <span className="flex items-center justify-between gap-1 text-xs font-semibold">
                <span className="truncate">{item.label}</span>
                {selected ? <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">✓</span> : null}
              </span>
              <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{item.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
