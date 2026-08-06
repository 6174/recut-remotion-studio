/**
 * [INPUT]: 依赖 React、class-variance-authority 与本地 cn 工具
 * [OUTPUT]: 对外提供 Button 和 buttonVariants
 * [POS]: remotion-studio/ui 的 shadcn 命令原子，统一所有用户操作的尺寸、状态与焦点样式
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xs border border-transparent px-2.5 text-xs font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        outline: "border-border bg-card hover:border-primary/30 hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Button({ className, variant, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant }), className)} data-slot="button" {...props} />;
}

export { Button, buttonVariants };
