/**
 * [INPUT]: 依赖 Host 注入的 MessageChannel、iframe URL 的 locale 参数，并向 Host 发出可重试的 UI 就绪握手
 * [OUTPUT]: 对外提供等待 Host MessageChannel 就绪、以 debug 输出成功通信诊断的 iframe React UI SDK、只回填不提交的 Agent compose 请求与当前 locale 查询/React locale hook
 * [POS]: remotion-studio 的 UI 通信边界；业务 UI 不直接访问 SQLite 或终端，实时事件由宿主转发，Agent 内容必须经全局 chat 可见
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useSyncExternalStore } from "react";
import type { Locale } from "./i18n";
type RequestType = "state.query" | "background.call" | "agent.compose" | "media.pick";
type Request = { id: string; type: RequestType; input: Record<string, unknown> };
let port: MessagePort | null = null;
let resolveConnection: ((port: MessagePort) => void) | null = null;
const connection = new Promise<MessagePort>((resolve) => { resolveConnection = resolve; });
const pending = new Map<string, { type: RequestType; resolve: (value: any) => void; reject: (error: Error) => void }>();
let requestSequence = 0;
let readyAttempts = 0;
const hostOrigin = document.referrer ? new URL(document.referrer).origin : "*";

function resolveRecutLocale(): Locale {
  const fromQuery = new URLSearchParams(window.location.search).get("locale");
  if (fromQuery === "zh" || fromQuery === "en") return fromQuery;
  return String(navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function getRecutLocale(): Locale {
  return resolveRecutLocale();
}

const localeListeners = new Set<() => void>();
function subscribeLocale(listener: () => void) {
  localeListeners.add(listener);
  return () => { localeListeners.delete(listener); };
}

export function useRecutLocale(): Locale {
  return useSyncExternalStore(subscribeLocale, getRecutLocale);
}

function announceReady() {
  if (port || window.parent === window || readyAttempts >= 40) return;
  readyAttempts += 1;
  window.parent.postMessage({ type: "recut.ui.ready" }, hostOrigin);
}

const readyTimer = window.setInterval(announceReady, 250);

function requestID() {
  requestSequence += 1;
  return `request-${Date.now().toString(36)}-${requestSequence.toString(36)}-${Math.random().toString(36).slice(2)}`;
}

window.addEventListener("message", (event) => {
  if (event.data?.type === "recut.project.event") {
    window.dispatchEvent(new CustomEvent("recut-project-event", { detail: event.data.event }));
    return;
  }
  if (event.data?.type !== "recut.ui.connect" || !event.ports[0]) return;
  port = event.ports[0];
  port.onmessage = (message) => {
    const request = pending.get(message.data?.id);
    if (!request) return;
    pending.delete(message.data.id);
    if (message.data.error) {
      console.error(`[recut-sdk] response failed id=${message.data.id} type=${request.type}: ${message.data.error}`);
      request.reject(new Error(message.data.error));
      return;
    }
    request.resolve(message.data.result);
  };
  port.start();
  resolveConnection?.(port);
  resolveConnection = null;
  window.clearInterval(readyTimer);
  console.debug(`[recut-sdk] host connected origin=${window.location.origin}`);
  window.dispatchEvent(new Event("recut-sdk-ready"));
});

announceReady();

async function call(type: RequestType, input: Record<string, unknown>) {
  const activePort = port ?? await connection;
  return new Promise<any>((resolve, reject) => {
    const id = requestID();
    pending.set(id, { type, resolve, reject });
    activePort.postMessage({ id, type, input } satisfies Request);
  });
}

export const recut = {
  state: { query: (name: string) => call("state.query", { name }) },
  background: { call: (name: string, input: Record<string, unknown>) => call("background.call", { name, ...input }) },
  agent: {
    compose: (input: { prompt: string }) => call("agent.compose", input),
  },
  media: {
    pick: (input: { kinds: Array<"image" | "video" | "audio" | "transcript">; multiple?: boolean; selectedIDs?: string[] }) => call("media.pick", input),
  },
  events: {
    subscribe: (listener: (event: unknown) => void) => {
      const receive = (event: Event) => listener((event as CustomEvent<unknown>).detail);
      window.addEventListener("recut-project-event", receive);
      return () => window.removeEventListener("recut-project-event", receive);
    },
  },
};

/** The iframe is always served from the Recut service, so its own origin is the API base. */
export const apiBase = window.location.origin;
export const projectId = new URLSearchParams(window.location.search).get("projectId") || "";
export const mediaContentURL = (assetId: string) => `${apiBase}/v1/media/assets/${encodeURIComponent(assetId)}/content`;
