/**
 * [INPUT]: 依赖 @xterm/xterm 终端渲染、@xterm/addon-fit 自适应与后台 terminal.exec 非交互协议
 * [OUTPUT]: 对外提供 xterm 终端：本地行编辑（左右移动/退格/剪贴板粘贴）、↑↓ 历史、cd 切换、clear 清屏；回车执行一条 terminal.exec 并在原地回显输出与退出码
 * [POS]: remotion-studio/ui 右侧「终端」分栏；只通过 service 已有 terminal.exec 执行命令，不新建会话协议
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { recut } from "./recut-sdk";

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const PROMPT_HINT = "在项目目录执行命令（默认项目根目录，可用 cd 切换）。非交互式，单条命令执行；↑↓ 查看历史。";

export function TerminalPanel() {
  const hostRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef("");
  const cursorRef = useRef(0);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const cwdRef = useRef("");
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};
    void (async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([import("@xterm/xterm"), import("@xterm/addon-fit")]);
      if (disposed || !host) return;
      const background = getComputedStyle(document.documentElement).getPropertyValue("--terminal").trim() || "oklch(0.16 0.008 150)";
      const terminal = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
        scrollback: 4000,
        theme: { background, cursor: "oklch(0.8 0.1 151)" },
      });
      const fit = new FitAddon();
      terminal.loadAddon(fit);
      terminal.open(host);
      fit.fit();
      terminal.writeln(`\x1b[90m${PROMPT_HINT}\x1b[0m`);

      const promptText = () => `\x1b[32m${cwdRef.current || "~"} \x1b[0m$ `;
      const newPrompt = () => terminal.write(`\r\n${promptText()}`);
      terminal.write(promptText());

      // Minimal-diff editing: typing appends/writes only the changed chars so
      // xterm never redraws the whole line (full `\r\x1b[K` + prompt rewrite
      // flashes on every keystroke). Middle-of-line edits rewrite only the tail
      // after the cursor; the prompt is never touched again.
      const insert = (char: string) => {
        const line = lineRef.current;
        const cursor = cursorRef.current;
        lineRef.current = `${line.slice(0, cursor)}${char}${line.slice(cursor)}`;
        cursorRef.current += 1;
        terminal.write(char);
        const tail = lineRef.current.slice(cursorRef.current);
        if (tail.length) {
          terminal.write(`\x1b[K${tail}`);
          terminal.write(`\x1b[${tail.length}D`);
        }
      };

      const backspace = () => {
        if (cursorRef.current === 0) return;
        const line = lineRef.current;
        const cursor = cursorRef.current;
        lineRef.current = `${line.slice(0, cursor - 1)}${line.slice(cursor)}`;
        cursorRef.current -= 1;
        terminal.write("\b\x1b[K");
        const tail = lineRef.current.slice(cursorRef.current);
        if (tail.length) terminal.write(tail);
        terminal.write(`\x1b[${tail.length}D`);
      };

      const moveCursor = (delta: number) => {
        const next = Math.max(0, Math.min(lineRef.current.length, cursorRef.current + delta));
        if (next === cursorRef.current) return;
        cursorRef.current = next;
        terminal.write(delta > 0 ? "\x1b[C" : "\x1b[D");
      };

      const historyMove = (delta: number) => {
        const history = historyRef.current;
        if (!history.length) return;
        const next = Math.max(-1, Math.min(history.length - 1, historyIndexRef.current + delta));
        historyIndexRef.current = next;
        lineRef.current = next >= 0 ? history[next] : "";
        cursorRef.current = lineRef.current.length;
        terminal.write(`\r\x1b[K${promptText()}${lineRef.current}`);
      };

      const run = async () => {
        const raw = lineRef.current;
        terminal.write("\r\n");
        lineRef.current = "";
        cursorRef.current = 0;
        historyIndexRef.current = -1;
        const command = raw.trim();
        if (!command) {
          newPrompt();
          return;
        }
        if (command === "clear") {
          terminal.clear();
          terminal.write(promptText());
          return;
        }
        const cdMatch = command.match(/^cd\s+(\S+)/);
        if (cdMatch) {
          const target = cdMatch[1];
          const next = target === ".." ? cwdRef.current.replace(/\/[^/]+$/, "") : cwdRef.current ? `${cwdRef.current}/${target}` : target;
          cwdRef.current = next.replace(/^\/+|\/+$/g, "");
          newPrompt();
          return;
        }
        historyRef.current = [...historyRef.current.slice(-199), command];
        busyRef.current = true;
        setBusy(true);
        let spin = 0;
        const spinner = window.setInterval(() => {
          terminal.write(`\r\x1b[K\x1b[90m${SPINNER[spin % SPINNER.length]} 执行中…\x1b[0m`);
          spin += 1;
        }, 80);
        try {
          const result = await recut.background.call("terminal.exec", { command, cwd: cwdRef.current, timeoutSeconds: 60 });
          const output = String(result.output ?? "").replace(/[\r\n]+$/, "");
          const error = String(result.error ?? "");
          if (output) terminal.write(output);
          if (error) terminal.write(`\x1b[31m${error}\x1b[0m`);
          terminal.write("\r\n");
          if (result.exitCode !== 0) terminal.write(`\x1b[90m[退出码 ${result.exitCode}]\x1b[0m\r\n`);
        } catch (cause) {
          terminal.write(`\r\n\x1b[31m${cause instanceof Error ? cause.message : "命令执行失败"}\x1b[0m\r\n`);
        } finally {
          window.clearInterval(spinner);
          terminal.write("\r\x1b[K");
          busyRef.current = false;
          setBusy(false);
          try { fit.fit(); } catch { /* 容器不可见时忽略 */ }
          newPrompt();
          terminal.focus();
        }
      };

      const onData = terminal.onData((data) => {
        if (busyRef.current) return;
        if (data === "\x1b[A") { historyMove(-1); return; }
        if (data === "\x1b[B") { historyMove(1); return; }
        if (data === "\x1b[D") { moveCursor(-1); return; }
        if (data === "\x1b[C") { moveCursor(1); return; }
        if (data === "\r" || data === "\n") { void run(); return; }
        if (data === "\u0003") {
          terminal.write("^C\r\n");
          lineRef.current = "";
          cursorRef.current = 0;
          newPrompt();
          return;
        }
        if (data === "\u007f") { backspace(); return; }
        for (const char of data) {
          if (char.charCodeAt(0) >= 32) insert(char);
        }
      });

      const resize = new ResizeObserver(() => {
        try { fit.fit(); } catch { /* 容器不可见时忽略 */ }
      });
      resize.observe(host);
      terminal.focus();

      cleanup = () => { disposed = true; onData.dispose(); resize.disconnect(); terminal.dispose(); };
    })();
    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden rounded-b-xs border-x border-b border-border bg-terminal p-1" ref={hostRef} />
      <div className="flex h-7 shrink-0 items-center gap-2 px-2 text-[10px] text-muted-foreground">
        {busy ? <Loader2 className="size-3 animate-spin text-primary" /> : <span className="size-1.5 rounded-full bg-success" />}
        <span className="font-mono">terminal.exec · 非交互式单条命令 · 项目根目录执行</span>
      </div>
    </div>
  );
}


