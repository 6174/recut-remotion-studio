import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Copy, TerminalSquare, Trash2 } from "lucide-react";
import { recut } from "./recut-sdk";

const APP_ID = "recut.remotion-studio";

interface LogLine {
  jobId: string;
  stream: string;
  text: string;
  timestamp: string;
}

const JOB_LABEL: Record<string, string> = { preview: "预览构建", render: "渲染导出" };

function jobLabel(jobId: string): string {
  if (jobId.startsWith("preview-")) return "预览构建";
  return `任务 ${jobId.slice(0, 8)}`;
}

export function LogPanel() {
  const [open, setOpen] = useState(true);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = recut.events.subscribe((event) => {
      const payload = event as { type?: string; appId?: string; log?: LogLine };
      if (payload?.type === "shell.job.log" && payload.appId === APP_ID && payload.log) {
        setLines((prev) => [...prev.slice(-1999), payload.log as LogLine]);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const node = bodyRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines, filter, open]);

  const jobIds = useMemo(() => Array.from(new Set(lines.map((line) => line.jobId))).reverse(), [lines]);
  const visible = filter === "all" ? lines : lines.filter((line) => line.jobId === filter);

  const clear = () => setLines([]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines.map((line) => line.text).join(""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <section className="log-panel">
      <div className="log-bar">
        <button aria-expanded={open} className="log-toggle" onClick={() => setOpen((value) => !value)} type="button">
          {open ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          <TerminalSquare className="size-3.5" />
          <span>日志</span>
          {lines.length > 0 && <span className="log-count">{lines.length}</span>}
        </button>
        {open && (
          <div className="flex grow">
            <select aria-label="日志过滤" className="log-filter" onChange={(event) => setFilter(event.target.value)} value={filter}>
              <option value="all">全部</option>
              {jobIds.map((jobId) => <option key={jobId} value={jobId}>{jobLabel(jobId)} · {jobId.slice(0, 8)}</option>)}
            </select>
            <button className="log-action" disabled={!lines.length} onClick={() => void copy()} title="复制日志" type="button"><Copy className="size-3.5" />{copied ? "已复制" : "复制"}</button>
            <button className="log-action" disabled={!lines.length} onClick={clear} title="清空日志" type="button"><Trash2 className="size-3.5" />清空</button>
          </div>
        )}
      </div>
      {open && (
        <div className="log-body" ref={bodyRef}>
          {visible.length === 0 ? <div className="log-empty">暂无日志。预览构建、渲染导出的 stdout/stderr 会实时显示在这里。</div> : visible.map((line, index) => (
            <div className={`log-line ${line.stream}`} key={index}>
              <span className="log-job">{line.jobId.slice(0, 6)}</span>
              <span className="log-text">{line.text}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
