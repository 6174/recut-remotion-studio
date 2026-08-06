import { MediaMap } from "../types";

export interface PreviewEnv {
  projectId?: string;
  api?: string;
  media?: Record<string, { kind?: string; url?: string }>;
}

/**
 * In Remotion Studio preview there are no input props, so media assetIds are
 * resolved from <workspace>/public/recut-env.json (served same-origin by the
 * Studio dev server and written by the Recut UI through `studio.env`). During
 * server-side rendering the `media` prop carries the materialized map and the
 * env is never consulted. All URLs are built per assetId, never from
 * Math.random/Date.now, so preview and render stay deterministic.
 */
let envCache: PreviewEnv | null = null;
let envStarted = false;
let envTimer: ReturnType<typeof setTimeout> | null = null;

async function loadEnv(): Promise<PreviewEnv | null> {
  try {
    const response = await fetch("/recut-env.json");
    if (!response.ok) return null;
    return (await response.json()) as PreviewEnv;
  } catch (_) {
    return null;
  }
}

export function startPreviewEnv(): void {
  if (envStarted || typeof window === "undefined") return;
  envStarted = true;
  void loadEnv().then((env) => {
    envCache = env;
    if (envTimer) clearTimeout(envTimer);
    envTimer = setTimeout(() => {
      envCache = null;
      envStarted = false;
    }, 3000);
  });
}

/** Resolve an assetId to a usable media src for preview or render. */
export const resolveMediaUrl = (assetId: string | undefined, media?: MediaMap): string | undefined => {
  if (!assetId) return undefined;
  const ref = media && media[assetId];
  if (ref) return ref.url ?? ref.path;
  const env = envCache;
  if (!env) return undefined;
  const mediaEntry = env.media && env.media[assetId];
  if (mediaEntry && mediaEntry.url) return mediaEntry.url;
  if (env.api) return `${env.api}/v1/media/assets/${encodeURIComponent(assetId)}/content`;
  return undefined;
};
