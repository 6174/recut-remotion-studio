import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { recut } from "./recut-sdk";

interface Entry {
  cwd: string;
  command: string;
  output: string;
  error?: string;
}

export function TerminalPanel() {
  const [cwd, setCwd] = useState("");
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const node = bodyRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries, busy]);

  const run = async (raw: string) => {
    const command = raw.trim();
    if (!command || busy) return;
    setInput("");
    const cdMatch = command.match(/^cd\s+(\S+)/);
    if (cdMatch) {
      const target = cdMatch[1];
      const nextCwd = target === ".." ? cwd.replace(/\/[^/]+$/, "") : `${cwd}/${target}`.replace(/^\/+/, "");
      setCwd(nextCwd === "" ? "" : nextCwd.replace(/\/+$/, ""));
      setEntries((prev) => [...prev, { cwd, command, output: "" }]);
      return;
    }
    setBusy(true);
    try {
      const result = await recut.background.call("terminal.exec", { command, cwd, timeoutSeconds: 60 });
      setEntries((prev) => [...prev, { cwd, command, output: result.output || "", error: result.status === "completed" ? undefined : (result.error || `退出码 ${result.exitCode}`) }]);
    } catch (cause) {
      setEntries((prev) => [...prev, { cwd, command, output: "", error: cause instanceof Error ? cause.message : "命令执行失败" }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-body" ref={bodyRef}>
        <div className="terminal-line muted">在项目目录执行命令（默认在项目根目录，可用 cd 切换）。非交互式，单条命令执行。</div>
        {entries.map((entry, index) => (
          <div key={index}>
            <div className="terminal-prompt"><span className="terminal-cwd">{entry.cwd || "~"} $</span> {entry.command}</div>
            {entry.output ? <pre className="terminal-output">{entry.output}</pre> : null}
            {entry.error ? <pre className="terminal-error">{entry.error}</pre> : null}
          </div>
        ))}
        {busy && <div className="terminal-prompt"><span className="terminal-cwd">{cwd || "~"} $</span> <Loader2 className="size-3 spin" /></div>}
      </div>
      <div className="terminal-input-row">
        <span className="terminal-cwd">{cwd || "~"} $</span>
        <input
          aria-label="终端命令"
          autoComplete="off"
          className="terminal-input"
          disabled={busy}
          onKeyDown={(event) => { if (event.key === "Enter") void run(input); }}
          onChange={(event) => setInput(event.target.value)}
          ref={inputRef}
          spellCheck={false}
          value={input}
        />
      </div>
    </div>
  );
}
