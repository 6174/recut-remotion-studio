/**
 * [INPUT]: 依赖 clsx 与 tailwind-merge 的条件类名处理能力
 * [OUTPUT]: 对外提供 cn，用于合并 Tailwind 工具类
 * [POS]: remotion-studio/ui 的样式工具边界，被本地 shadcn 原子组件复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
