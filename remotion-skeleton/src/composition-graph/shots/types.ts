/**
 * [INPUT]: 无运行时依赖；由 scene registry 和 shot components 共享
 * [OUTPUT]: 对外提供 ShotId、ShotEffect、ShotProps 与 ShotComponent
 * [POS]: composition-graph/shots 的契约层；时序、镜头和 Three renderer 通过它保持无内容耦合
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { FC } from "react";

export type ShotId =
  | "opening"
  | "react"
  | "frame"
  | "component"
  | "cut"
  | "composition"
  | "html"
  | "hic"
  | "raster"
  | "media"
  | "ratio"
  | "three"
  | "depth"
  | "magnify"
  | "glitch"
  | "bubble"
  | "clouds"
  | "effects"
  | "agent"
  | "preview"
  | "render"
  | "runtime"
  | "result"
  | "end";

export type ShotEffect =
  | "clean"
  | "magnify"
  | "glitch"
  | "clouds"
  | "bubble"
  | "bend"
  | "glass"
  | "crt"
  | "vintage"
  | "article-highlight"
  | "store-peel";

export interface ShotProps {
  frame: number;
  fps: number;
  progress: number;
}

export type ShotComponent = FC<ShotProps>;
