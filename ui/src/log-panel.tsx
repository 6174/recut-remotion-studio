/**
 * [INPUT]: 依赖宿主 shell 日志事件、以页面会话起点过滤的 logs.list 回填与父级 active 状态
 * [OUTPUT]: 对外提供仅含当前页面会话的日志区域：实时追加、按任务过滤、复制与清空
 * [POS]: remotion-studio/ui 右侧「日志」分栏；展示后台任务输出，不改变任务执行状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { recut } from "./recut-sdk";

const APP_ID = "recut.remotion-studio";
// 当前会话保留的总行数上限：实时日志超出后丢弃最旧行，避免 DOM 无限增长。
const MAX_LINES = 300;
// 当前页面会话的初始回填上限；实时日志仍受 MAX_LINES 约束。
const BACKFILL_MAX = 120;

interface LogLine { jobId: string; stream: string; text: string; timestamp: string; sequence?: number; }

function jobLabel(jobId: string): string { return jobId.startsWith("preview-") ? "预览服务" : `任务 ${jobId.slice(0, 8)}`; }

function lineKey(line: LogLine): string { return `${line.jobId}:${line.sequence ?? 0}:${line.text}:${line.timestamp}`; }

function belongsToSession(line: LogLine, startedAt: string): boolean { return Date.parse(line.timestamp) >= Date.parse(startedAt); }

interface LogPanelProps { active: boolean; }

export function LogPanel({ active }: LogPanelProps) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const seenRef = useRef<Set<string>>(new Set());
  const refreshingRef = useRef(false);
  const debounceRef = useRef<number | null>(null);
  const stickRef = useRef(true);
  // 后端事件流会重放项目历史；以 iframe 本次加载时刻切断历史，只保留当前调试会话。
  const sessionStartedAt = useRef(new Date().toISOString());

  const merge = useCallback((incoming: LogLine[], backfill = false) => {
    setLines((previous) => {
      const seen = seenRef.current;
      const source = backfill ? incoming.slice(-BACKFILL_MAX) : incoming;
      const added: LogLine[] = [];
      for (const line of source) {
        const key = lineKey(line);
        if (seen.has(key)) continue;
        seen.add(key);
        added.push(line);
      }
      if (!added.length) return previous;
      const next = [...previous, ...added];
      const dropped = next.length - MAX_LINES;
      if (dropped > 0) {
        for (const line of next.slice(0, dropped)) seen.delete(lineKey(line));
        return next.slice(dropped);
      }
      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    try {
      const result = await recut.background.call("logs.list", { since: sessionStartedAt.current });
      const incoming = result?.lines;
      if (Array.isArray(incoming)) merge(incoming as LogLine[], true);
    } catch { /* 回填失败不打断实时日志 */ } finally { refreshingRef.current = false; }
  }, [merge]);

  const scheduleRefresh = useCallback(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => void refresh(), 200);
  }, [refresh]);

  useEffect(() => {
    const ready = () => void refresh();
    window.addEventListener("recut-sdk-ready", ready);
    void refresh();
    const unsubscribe = recut.events.subscribe((event) => {
      const payload = event as { type?: string; appId?: string; name?: string; log?: LogLine; job?: { id: string } };
      if (payload.appId !== APP_ID) return;
      if (payload.type === "shell.job.log" && payload.log && belongsToSession(payload.log as LogLine, sessionStartedAt.current)) merge([payload.log as LogLine]);
      else if (payload.type === "shell.job.started" || payload.type === "shell.job.completed") scheduleRefresh();
      else if (payload.type === "app.capability.completed" && ["preview.serve.start", "preview.serve.stop", "render.export", "terminal.exec"].includes(String(payload.name))) scheduleRefresh();
    });
    return () => {
      window.removeEventListener("recut-sdk-ready", ready);
      unsubscribe();
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [merge, refresh, scheduleRefresh]);

  useEffect(() => {
    if (active) void refresh();
  }, [active, refresh]);

  const jobIds = useMemo(() => Array.from(new Set(lines.map((line) => line.jobId))).reverse(), [lines]);
  const visible = useMemo(() => (filter === "all" ? lines : lines.filter((line) => line.jobId === filter)), [filter, lines]);

  const virtualizer = useVirtualizer({
    count: visible.length,
    getScrollElement: () => bodyRef.current,
    estimateSize: () => 20,
    getItemKey: (index) => lineKey(visible[index]),
    overscan: 12,
  });

  // 仅当用户停留在底部附近时才跟随新日志滚动到底；向上翻阅旧日志时不打断阅读。
  const onScroll = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    stickRef.current = body.scrollHeight - body.scrollTop - body.clientHeight < 24;
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (stickRef.current) body.scrollTop = body.scrollHeight;
  }, [filter, lines, active]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(visible.map((line) => line.text).join(""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { /* 浏览器不支持剪贴板时保留可选中文本。 */ }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-border px-2">
        <select aria-label="日志过滤" className="h-7 min-w-36 rounded-xs border border-input bg-background px-2 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" onChange={(event) => setFilter(event.target.value)} value={filter}>
          <option value="all">当前会话</option>
          {jobIds.map((jobId) => <option key={jobId} value={jobId}>{jobLabel(jobId)} · {jobId.slice(0, 8)}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1">
          <Button disabled={!visible.length} onClick={() => void copy()} title="复制当前日志" type="button" variant="ghost"><Copy className="size-3.5" />{copied ? "已复制" : "复制"}</Button>
          <Button disabled={!lines.length} onClick={() => setLines([])} title="清空日志" type="button" variant="ghost"><Trash2 className="size-3.5" />清空</Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-background px-3 py-2 font-mono text-[11px] leading-5" onScroll={onScroll} ref={bodyRef}>
        {visible.length === 0 ? <p className="py-2 text-muted-foreground">暂无日志。预览服务、终端命令与渲染任务的输出会显示在这里。</p> : (
          <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const line = visible[virtualRow.index];
              return (
                <div className="absolute left-0 right-0 flex gap-3 break-all" data-index={virtualRow.index} key={lineKey(line)} ref={virtualizer.measureElement} style={{ transform: `translateY(${virtualRow.start}px)` }}>
                  <span className="shrink-0 text-muted-foreground">{line.jobId.slice(0, 6)}</span>
                  <span className={line.stream === "stderr" ? "text-destructive" : "text-foreground/80"}>{line.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
