/**
 * [INPUT]: 依赖 app 层的 Brief、Catalog 与 MediaAsset 领域类型
 * [OUTPUT]: 对外提供所有成片微调面板共用的 FineTuneProps 契约
 * [POS]: fine-tunes 的边界类型；让各微调动作保持同一 Prompt/状态回调接口
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Brief, Catalog, MediaAsset } from "../app";

export interface FineTuneProps {
  brief: Brief;
  catalog: Catalog;
  completedAssets: MediaAsset[];
  basePrompt: string;
  kitVersionHint?: string;
  onPrompt: (prompt: string) => void;
  onReady: (ready: boolean) => void;
  onStatus: (message: string) => void;
}
