import React from "react";
import { Img } from "remotion";
import { resolveMediaUrl } from "./runtime/media";
import { AssetKind, MediaMap } from "./types";

export const mediaSrc = (media: MediaMap | undefined, assetId?: string): string | undefined =>
  resolveMediaUrl(assetId, media);

export const mediaKind = (media: MediaMap | undefined, assetId?: string): AssetKind | undefined => {
  if (!assetId || !media || !media[assetId]) return undefined;
  return media[assetId].kind;
};

export interface MediaImageProps {
  media?: MediaMap;
  assetId?: string;
  style?: React.CSSProperties;
}

/** An <Img> that resolves a Recut assetId to its preview/render source. */
export const MediaImage: React.FC<MediaImageProps> = ({ media, assetId, style }) => {
  const src = resolveMediaUrl(assetId, media);
  if (!src) return null;
  return <Img src={src} style={style} />;
};
