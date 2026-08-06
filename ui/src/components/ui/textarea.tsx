/**
 * [INPUT]: 依赖 React 文本域类型与本地 cn 工具
 * [OUTPUT]: 对外提供 Textarea 多行表单组件
 * [POS]: remotion-studio/ui 的 shadcn 表单原子，承载 Brief 详细描述等长文本输入
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as React from "react";
import { cn } from "../../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("min-h-24 w-full resize-y rounded-xs border border-input bg-background px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50", className)} data-slot="textarea" {...props} />;
}

export { Textarea };
