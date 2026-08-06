/**
 * [INPUT]: 依赖 React 上下文与本地 cn 工具
 * [OUTPUT]: 对外提供 Tabs、TabsList、TabsTrigger、TabsContent 的轻量分栏容器
 * [POS]: remotion-studio/ui 的 shadcn 结构原子，承载右侧「日志 / 终端」切换
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext<{ value: string; onValueChange?: (value: string) => void }>({ value: "" });

function Tabs({ value, onValueChange, className, ...props }: React.ComponentProps<"div"> & { value: string; onValueChange?: (value: string) => void }) {
  return <TabsContext.Provider value={{ value, onValueChange }}><div className={cn("flex min-h-0 flex-col", className)} data-slot="tabs" {...props} /></TabsContext.Provider>;
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex shrink-0 items-center gap-1 border-b border-border px-2", className)} data-slot="tabs-list" {...props} />;
}

function TabsTrigger({ value, className, ...props }: React.ComponentProps<"button"> & { value: string }) {
  const context = React.useContext(TabsContext);
  const active = context.value === value;
  return <button className={cn("h-9 border-b-2 px-3 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50", active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground", className)} data-slot="tabs-trigger" data-state={active ? "active" : "inactive"} onClick={() => context.onValueChange?.(value)} type="button" {...props} />;
}

function TabsContent({ value, className, ...props }: React.ComponentProps<"div"> & { value: string }) {
  const context = React.useContext(TabsContext);
  const active = context.value === value;
  return <div className={cn("min-h-0 flex-1", !active && "hidden", className)} data-slot="tabs-content" data-state={active ? "active" : "inactive"} hidden={!active} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
