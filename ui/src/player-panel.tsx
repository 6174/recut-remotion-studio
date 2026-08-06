/**
 * [INPUT]: 依赖后台 preview.serve/preview.props 操作、项目 brief 与素材映射
 * [OUTPUT]: 对外提供 Vite iframe 预览、服务重启与可复制的完整错误诊断
 * [POS]: remotion-studio/ui 的左侧 Player；只显示预览状态，核心命令由右侧工作区调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AlertTriangle, Copy, Loader2, Play, RefreshCcw, Send } from "lucide-react";
import { Button } from "./components/ui/button";
import { recut } from "./recut-sdk";
import type { Brief, MediaMap } from "./app";

interface ServeStatus {
  running: boolean;
  phase: string;
  port: number | null;
  url: string | null;
  error?: string | null;
}

export interface PlayerPanelHandle {
  restart: () => Promise<void>;
  start: () => Promise<void>;
}

interface PlayerPanelProps {
  brief: Brief | null;
  mediaMap: MediaMap;
  onAskAI: (diagnostic: string) => void;
  setStatus: (status: string) => void;
}

const PREVIEW_SETTINGS = { width: 1920, height: 1080, fps: 30 };

export const PlayerPanel = forwardRef<PlayerPanelHandle, PlayerPanelProps>(function PlayerPanel({ brief, mediaMap, onAskAI, setStatus }, ref) {
  const [serve, setServe] = useState<ServeStatus | null>(null);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const startedOnce = useRef(false);

  const writeProps = useCallback(async () => {
    if (!brief) return;
    await recut.background.call("preview.props", { media: mediaMap, settings: PREVIEW_SETTINGS });
  }, [brief, mediaMap]);

  const refreshServe = useCallback(async () => {
    try {
      const next = await recut.background.call("preview.serve.status", {});
      setServe(next as ServeStatus);
      return next as ServeStatus;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "预览状态读取失败";
      setStatus(message);
      return null;
    }
  }, [setStatus]);

  const start = useCallback(async () => {
    setStarting(true);
    try {
      await writeProps();
      await recut.background.call("preview.serve.start", {});
      setStatus("预览服务正在启动。");
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "启动预览失败");
    } finally {
      setStarting(false);
      await refreshServe();
    }
  }, [refreshServe, setStatus, writeProps]);

  const restart = useCallback(async () => {
    setStarting(true);
    try {
      await recut.background.call("preview.serve.stop", {});
      await writeProps();
      await recut.background.call("preview.serve.start", {});
      setFrameKey((value) => value + 1);
      setStatus("预览服务已重启。");
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "重启预览失败");
    } finally {
      setStarting(false);
      await refreshServe();
    }
  }, [refreshServe, setStatus, writeProps]);

  useImperativeHandle(ref, () => ({ restart, start }), [restart, start]);

  useEffect(() => {
    if (startedOnce.current) return;
    startedOnce.current = true;
    void refreshServe().then((status) => { if (!status?.running) void start(); });
  }, [refreshServe, start]);

  useEffect(() => {
    if (!brief) return;
    void writeProps().catch((cause) => setStatus(cause instanceof Error ? cause.message : "写入预览配置失败"));
  }, [brief, mediaMap, setStatus, writeProps]);

  useEffect(() => {
    const timer = window.setInterval(() => void refreshServe(), 3000);
    return () => window.clearInterval(timer);
  }, [refreshServe]);

  const copyDiagnostic = async () => {
    const diagnostic = serve?.error;
    if (!diagnostic) return;
    try {
      await navigator.clipboard.writeText(diagnostic);
      setCopied(true);
      setStatus("错误诊断已复制，可直接粘贴给 AI。");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setStatus("复制失败，请手动选择错误诊断。");
    }
  };

  if (serve?.running && serve.url) {
    return <iframe className="h-full w-full border-0 bg-terminal" key={frameKey} src={`${serve.url}?refresh=${frameKey}`} title="Remotion 预览" />;
  }

  if (serve?.error) {
    return (
      <div className="grid h-full w-full place-items-center p-6">
        <section className="w-full max-w-2xl rounded-sm border border-destructive/35 bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-xs bg-destructive/10 text-destructive"><AlertTriangle className="size-4" /></span>
            <div className="min-w-0"><p className="font-mono text-[10px] font-semibold text-destructive">PREVIEW ERROR</p><h2 className="mt-1 text-base font-semibold">预览服务未能启动</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">完整错误已保留。复制或发送给 AI 后，可以直接定位项目的构建问题。</p></div>
          </div>
          <pre className="mt-4 max-h-56 overflow-auto rounded-xs border border-destructive/25 bg-destructive/5 p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap text-foreground" tabIndex={0}>{serve.error}</pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => void start()} type="button"><Play className="size-3.5" />重新启动</Button>
            <Button onClick={() => void copyDiagnostic()} type="button" variant="outline"><Copy className="size-3.5" />{copied ? "已复制" : "复制错误"}</Button>
            <Button onClick={() => onAskAI(serve.error ?? "预览服务未启动")} type="button" variant="ghost"><Send className="size-3.5" />发送给 AI</Button>
          </div>
        </section>
      </div>
    );
  }

  return <div className="grid h-full w-full place-items-center text-center text-muted-foreground"><div><Loader2 className="mx-auto size-5 animate-spin" /><p className="mt-3 text-sm">{starting ? "正在启动预览服务…" : "正在准备预览…"}</p></div></div>;
});
