/**
 * [INPUT]: 依赖后台 preview.serve/preview.props 操作、项目 brief 与素材映射
 * [OUTPUT]: 对外提供仅在应用层确认 Vite HTTP 服务可达后显示的 iframe 预览、可见的 pnpm bootstrap/启动/重启轮询、服务重启与可复制的完整错误诊断
 * [POS]: remotion-studio/ui 的左侧 Player；只显示预览状态，核心命令由右侧工作区调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AlertTriangle, Copy, Loader2, Play, RefreshCcw, Send } from "lucide-react";
import { Button } from "./components/ui/button";
import { recut, useRecutLocale } from "./recut-sdk";
import { t } from "./i18n";
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

function PreviewLoading({ phase, starting, locale }: { phase?: string; starting: boolean; locale: "zh" | "en" }) {
  const installing = phase === "installing";
  return (
    <div className="grid h-full w-full place-items-center bg-terminal p-6 text-center text-muted-foreground">
      <div>
        <Loader2 className="mx-auto size-5 animate-spin text-primary" />
        <p className="mt-3 text-sm text-foreground">{installing ? t(locale, "player.loadingInstalling") : starting ? t(locale, "player.loadingStarting") : t(locale, "player.loadingPreparing")}</p>
        <p className="mt-1 text-xs">{installing ? t(locale, "player.loadingHintInstalling") : t(locale, "player.loadingHintReady")}</p>
      </div>
    </div>
  );
}

export const PlayerPanel = forwardRef<PlayerPanelHandle, PlayerPanelProps>(function PlayerPanel({ brief, mediaMap, onAskAI, setStatus }, ref) {
  const locale = useRecutLocale();
  const [serve, setServe] = useState<ServeStatus | null>(null);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [reachablePreviewUrl, setReachablePreviewUrl] = useState<string | null>(null);
  const [probeAttempt, setProbeAttempt] = useState(0);
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
      const message = cause instanceof Error ? cause.message : t(locale, "player.statusReadFailed");
      setStatus(message);
      return null;
    }
  }, [locale, setStatus]);

  const waitForPreview = useCallback(async () => {
    const deadline = Date.now() + 15_000;
    while (Date.now() < deadline) {
      const status = await refreshServe();
      if (status?.running && status.phase === "ready" && status.url) return true;
      await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
    }
    return false;
  }, [refreshServe]);

  const start = useCallback(async () => {
    setStarting(true);
    setReachablePreviewUrl(null);
    try {
      await writeProps();
      await recut.background.call("preview.serve.start", {});
      setStatus(t(locale, "player.starting"));
      if (!await waitForPreview()) setStatus(t(locale, "player.notReady"));
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : t(locale, "player.startFailed"));
    } finally {
      setStarting(false);
      await refreshServe();
    }
  }, [locale, refreshServe, setStatus, waitForPreview, writeProps]);

  const restart = useCallback(async () => {
    setStarting(true);
    setReachablePreviewUrl(null);
    try {
      await recut.background.call("preview.serve.stop", {});
      await writeProps();
      await recut.background.call("preview.serve.start", {});
      setFrameKey((value) => value + 1);
      setStatus(t(locale, "player.restarted"));
      if (!await waitForPreview()) setStatus(t(locale, "player.notReady"));
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : t(locale, "player.restartFailed"));
    } finally {
      setStarting(false);
      await refreshServe();
    }
  }, [locale, refreshServe, setStatus, waitForPreview, writeProps]);

  useImperativeHandle(ref, () => ({ restart, start }), [restart, start]);

  useEffect(() => {
    if (startedOnce.current) return;
    startedOnce.current = true;
    void refreshServe().then((status) => { if (!status?.running) void start(); });
  }, [refreshServe, start]);

  useEffect(() => {
    if (!brief) return;
    void writeProps().catch((cause) => setStatus(cause instanceof Error ? cause.message : t(locale, "player.writePropsFailed")));
  }, [brief, locale, mediaMap, setStatus, writeProps]);

  useEffect(() => {
    const timer = window.setInterval(() => void refreshServe(), 3000);
    return () => window.clearInterval(timer);
  }, [refreshServe]);

  useEffect(() => {
    const url = serve?.running && serve.phase === "ready" ? serve.url : null;
    setReachablePreviewUrl(null);
    if (!url) return;

    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1500);
    const retry = () => window.setTimeout(() => setProbeAttempt((value) => value + 1), 500);

    void fetch(`${url}?probe=${probeAttempt}`, { cache: "no-store", mode: "no-cors", signal: controller.signal })
      .then(() => { if (!cancelled) setReachablePreviewUrl(url); })
      .catch(() => { if (!cancelled) retry(); })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [probeAttempt, serve?.phase, serve?.running, serve?.url]);

  const copyDiagnostic = async () => {
    const diagnostic = serve?.error;
    if (!diagnostic) return;
    try {
      await navigator.clipboard.writeText(diagnostic);
      setCopied(true);
      setStatus(t(locale, "player.diagnosticCopied"));
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setStatus(t(locale, "player.copyFailed"));
    }
  };

  if (serve?.running && serve.phase === "ready" && serve.url === reachablePreviewUrl) {
    return <iframe className="h-full w-full border-0 bg-terminal" key={frameKey} src={`${serve.url}?refresh=${frameKey}`} title={t(locale, "player.iframeTitle")} />;
  }

  if (serve?.error && !starting) {
    return (
      <div className="grid h-full w-full place-items-center p-6">
        <section className="w-full max-w-2xl rounded-sm border border-destructive/35 bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-xs bg-destructive/10 text-destructive"><AlertTriangle className="size-4" /></span>
            <div className="min-w-0"><p className="font-mono text-[10px] font-semibold text-destructive">PREVIEW ERROR</p><h2 className="mt-1 text-base font-semibold">{t(locale, "player.errorTitle")}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{t(locale, "player.errorHint")}</p></div>
          </div>
          <pre className="mt-4 max-h-56 overflow-auto rounded-xs border border-destructive/25 bg-destructive/5 p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap text-foreground" tabIndex={0}>{serve.error}</pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => void start()} type="button"><Play className="size-3.5" />{t(locale, "player.restartButton")}</Button>
            <Button onClick={() => void copyDiagnostic()} type="button" variant="outline"><Copy className="size-3.5" />{copied ? t(locale, "player.copied") : t(locale, "player.copyError")}</Button>
            <Button onClick={() => onAskAI(serve.error ?? t(locale, "player.notStartedError"))} type="button" variant="ghost"><Send className="size-3.5" />{t(locale, "player.sendToAI")}</Button>
          </div>
        </section>
      </div>
    );
  }

  return <PreviewLoading locale={locale} phase={serve?.phase} starting={starting || serve?.phase === "starting" || serve?.phase === "preparing"} />;
});
