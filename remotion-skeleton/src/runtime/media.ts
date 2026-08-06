import { MediaMap } from "../types";

/**
 * Resolve a Recut assetId to a usable media src.
 *
 * In the embedded Player preview the UI passes `media` props (assetId → content
 * URL); during server-side rendering the background materializes the referenced
 * assets and passes `media` props (assetId → local path / public URL). Preview
 * and render share the same resolver, so scenes written against an assetId
 * behave identically in both. All URLs are built per assetId, never from
 * Math.random/Date.now, so preview and render stay deterministic.
 */
export const resolveMediaUrl = (assetId: string | undefined, media?: MediaMap): string | undefined => {
  if (!assetId) return undefined;
  const ref = media && media[assetId];
  if (ref) return ref.url ?? ref.path;
  return undefined;
};
