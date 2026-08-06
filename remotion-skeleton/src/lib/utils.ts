/**
 * [INPUT]: 依赖 clsx 与 tailwind-merge 的条件类名处理能力
 * [OUTPUT]: 对外提供 cn，供 composition 渲染层与 shadcn 原子合并 Tailwind 工具类
 * [POS]: remotion-skeleton 的样式工具边界，被 src/components/ui 原子复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
