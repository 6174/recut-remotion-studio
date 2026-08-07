/**
 * [INPUT]: 依赖 remotion（React）与各 shotcraft 组件
 * [OUTPUT]: 对外提供可在成片场景中复用的 shotcraft 组件
 * [POS]: remotion-kit 的 shotcraft 2D 组件目录；3D 组件（FlatPanel）经 ./shotcraft/* 子路径按需引用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export { Caption } from "./Caption";
export { DigitRoll } from "./DigitRoll";
export { FlashCut } from "./FlashCut";
export { PageCam } from "./PageCam";
export type { CamKey } from "./PageCam";
export { VerticalTicker } from "./VerticalTicker";
export type { TickerColumn, VerticalTickerProps } from "./VerticalTicker";
