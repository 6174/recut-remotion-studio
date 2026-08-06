/**
 * [INPUT]: 依赖 React 文本域类型与本地 cn 工具
 * [OUTPUT]: 对外提供 Textarea 多行表单组件（画面内展示型）
 * [POS]: remotion-skeleton/src/components/ui 的 shadcn 表单原子，用于 UI 场景渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as React from "react";
import { cn } from "../../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("min-h-24 w-full resize-y rounded-xs border border-input bg-background px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50", className)} data-slot="textarea" {...props} />;
}

export { Textarea };
