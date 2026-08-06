export type AssetKind = "image" | "video" | "audio";

export interface MediaRef {
  /** Absolute URL when previewing in the browser; static /public/media/... path when rendering. */
  url?: string;
  /** Absolute local path when rendering. */
  path?: string;
  kind: AssetKind;
  mimeType?: string;
}

export type MediaMap = Record<string, MediaRef>;

export interface Brief {
  id: string;
  template: string;
  topic: string;
  details?: string;
  expectedDurationSec: number;
  materialAssetIds: string[];
  createdAt?: string;
}

export interface RenderSettings {
  width?: number;
  height?: number;
  fps?: number;
  codec?: string;
}

export interface ProjectVideoProps {
  brief?: Brief | null;
  media?: MediaMap;
  settings?: RenderSettings;
}

export const defaultProjectVideoProps = (): ProjectVideoProps => ({
  brief: null,
  media: {},
  settings: { width: 1920, height: 1080, fps: 30 },
});
