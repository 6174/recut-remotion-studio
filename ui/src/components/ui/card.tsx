/**
 * [INPUT]: 依赖 React DOM 类型与本地 cn 工具
 * [OUTPUT]: 对外提供 Card、CardHeader、CardTitle、CardDescription、CardContent
 * [POS]: remotion-studio/ui 的 shadcn 信息容器原子，承载右侧工具与表单内容
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as React from "react";
import { cn } from "../../lib/utils";

function Card({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("rounded-sm border border-border bg-card text-card-foreground shadow-[0_1px_2px_oklch(0.19_0.008_150_/_0.03)]", className)} data-slot="card" {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1 border-b border-border px-4 py-3", className)} data-slot="card-header" {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-sm font-medium", className)} data-slot="card-title" {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xs text-muted-foreground", className)} data-slot="card-description" {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-4 py-3", className)} data-slot="card-content" {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
