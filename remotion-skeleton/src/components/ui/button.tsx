/**
 * [INPUT]: 依赖 class-variance-authority 与本地 cn 工具
 * [OUTPUT]: 对外提供 Button 与 buttonVariants（画面内的展示型按钮，非交互）
 * [POS]: remotion-skeleton/src/components/ui 的 shadcn 原子，用于 UI 样式的场景渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xs border border-transparent px-2.5 text-xs font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm",
        outline: "border-border bg-card hover:border-primary/30 hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Button({ className, variant, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant }), className)} data-slot="button" {...props} />;
}

export { Button, buttonVariants };
