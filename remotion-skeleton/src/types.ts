/**
 * [INPUT]: 依赖后端写入的 Brief、媒体映射与导出设置
 * [OUTPUT]: 对外提供 ProjectVideo 所需的共享领域类型
 * [POS]: remotion-skeleton/src 的运行时数据契约；预览和导出共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
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

export type NarrativeSource =
  | { kind: "srt"; name: string; text: string }
  | { kind: "videos"; assetIds: string[]; names: string[] };

export interface Brief {
  id: string;
  template: string;
  style: string;
  topic: string;
  details?: string;
  expectedDurationSec: number;
  materialAssetIds: string[];
  narrativeSource?: NarrativeSource | null;
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
  /** HTML-in-Canvas 舞台计划：interaction + effects + targets；提供时整片进入唯一捕获面。 */
  stagePlan?: import("@recut/remotion-kit").StagePlan | null;
}

export const defaultProjectVideoProps = (): ProjectVideoProps => ({
  brief: null,
  media: {},
  settings: { width: 1920, height: 1080, fps: 30 },
});
