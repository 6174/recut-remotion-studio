/**
 * [INPUT]: 依赖 @xterm/xterm 终端渲染、@xterm/addon-fit 自适应、Service PTY 会话 API 与当前项目 id
 * [OUTPUT]: 对外提供连接本机交互式 zsh 的终端面板；原样转发输入、尺寸和 PTY 输出，保留 shell 的补全、历史、cwd 与作业控制语义
 * [POS]: remotion-studio/ui 右侧「终端」分栏；以项目 workspace 为初始目录，绝不在浏览器内重实现 shell
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { apiBase, projectId, useRecutLocale } from "./recut-sdk";
import { t } from "./i18n";

type TerminalSession = { id: string; running: boolean };

export function TerminalPanel({ active }: { active: boolean }) {
  const locale = useRecutLocale();
  const hostRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<TerminalSession | null>(null);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!active || !host || !projectId) return;
    let disposed = false;
    let cleanup = () => {};

    void (async () => {
      setError("");
      setConnecting(!sessionRef.current);
      try {
        const [{ Terminal }, { FitAddon }] = await Promise.all([import("@xterm/xterm"), import("@xterm/addon-fit")]);
        if (disposed) return;
        const terminal = new Terminal({
          cursorBlink: true,
          convertEol: true,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11,
          scrollback: 4000,
          theme: {
            background: getComputedStyle(document.documentElement).getPropertyValue("--terminal").trim() || "oklch(0.16 0.008 150)",
            cursor: "oklch(0.8 0.1 151)",
          },
        });
        const fit = new FitAddon();
        terminal.loadAddon(fit);
        terminal.open(host);
        fit.fit();

        let session = sessionRef.current;
        if (!session?.running) {
          const response = await fetch(`${apiBase}/v1/terminals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, command: "zsh", args: ["-l", "-i"], cwd: "workspace", cols: terminal.cols, rows: terminal.rows }),
          });
          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error ?? t(locale, "terminal.startFailed"));
          }
          session = await response.json() as TerminalSession;
          sessionRef.current = session;
        }
        if (disposed) {
          terminal.dispose();
          return;
        }

        const send = (path: string, body: unknown) => fetch(`${apiBase}/v1/terminals/${session.id}/${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        void send("resize", { cols: terminal.cols, rows: terminal.rows });
        const input = terminal.onData((data) => { void send("input", { data }); });
        const stream = new EventSource(`${apiBase}/v1/terminals/${session.id}/events`);
        stream.addEventListener("output", (event) => {
          const output = JSON.parse((event as MessageEvent<string>).data) as string;
          terminal.write(output);
          if (output.includes("[terminal exited]")) {
            sessionRef.current = null;
            setError(t(locale, "terminal.exited"));
          }
        });
        stream.onerror = () => {
          if (!disposed) setError(t(locale, "terminal.disconnected"));
        };
        const resize = new ResizeObserver(() => {
          try { fit.fit(); } catch { /* 面板隐藏时无需处理尺寸 */ }
          void send("resize", { cols: terminal.cols, rows: terminal.rows });
        });
        resize.observe(host);
        terminal.focus();
        cleanup = () => { input.dispose(); resize.disconnect(); stream.close(); terminal.dispose(); };
      } catch (cause) {
        if (!disposed) setError(cause instanceof Error ? cause.message : t(locale, "terminal.cannotStart"));
      } finally {
        if (!disposed) setConnecting(false);
      }
    })();

    return () => { disposed = true; cleanup(); };
  }, [active, locale]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden rounded-b-xs border-x border-b border-border bg-terminal p-1" ref={hostRef} />
      <div className="flex h-7 shrink-0 items-center gap-2 px-2 text-[10px] text-muted-foreground">
        {connecting ? <Loader2 className="size-3 animate-spin text-primary" /> : <span className="size-1.5 rounded-full bg-success" />}
        <span className="font-mono">{t(locale, "terminal.footer")}</span>
        {error && <span className="truncate text-destructive">{error}</span>}
      </div>
    </div>
  );
}
