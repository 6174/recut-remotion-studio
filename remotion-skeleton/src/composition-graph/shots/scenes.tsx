/**
 * [INPUT]: 依赖前后两组独立镜头组件与 shots/types 的共享契约
 * [OUTPUT]: 对外提供 sceneFor、ShotSurface 与可供 timeline/renderer 导入的 shot 类型
 * [POS]: composition-graph/shots 的装配层；唯一集中 effect、lens 与 transition descriptor 的位置
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import {
  OpeningScene,
  ReactScene,
  FrameScene,
  ComponentScene,
  CutScene,
  CompositionScene,
  HtmlScene,
  HicScene,
  RasterScene,
  MediaScene,
  RatioScene,
} from "./act-one";
import {
  ThreeScene,
  DepthScene,
  MagnifyScene,
  GlitchScene,
  BubbleScene,
  CloudsScene,
  EffectsScene,
  AgentScene,
  PreviewScene,
  RenderScene,
  RuntimeScene,
  ResultScene,
  EndScene,
} from "./act-two";
import type { ShotComponent, ShotEffect, ShotId, ShotProps } from "./types";

export type { ShotComponent, ShotEffect, ShotId, ShotProps } from "./types";

const scenes: Record<
  ShotId,
  {
    component: ShotComponent;
    effect: ShotEffect;
    lens?: readonly [number, number];
    lensStart?: number;
    lensTravel?: number;
    media?: boolean;
    transition: ShotEffect;
  }
> = {
  opening: { component: OpeningScene, effect: "vintage", transition: "clean" },
  react: {
    component: ReactScene,
    effect: "magnify",
    lens: [0.5, 0.29],
    lensStart: 0.06,
    lensTravel: 0.36,
    transition: "clean",
  },
  frame: {
    component: FrameScene,
    effect: "crt",
    lens: [0.72, 0.28],
    lensStart: 0.54,
    lensTravel: 0.2,
    transition: "clean",
  },
  component: { component: ComponentScene, effect: "clean", transition: "bend" },
  cut: { component: CutScene, effect: "clean", transition: "store-peel" },
  composition: {
    component: CompositionScene,
    effect: "clouds",
    transition: "glitch",
  },
  html: {
    component: HtmlScene,
    effect: "article-highlight",
    transition: "clean",
  },
  hic: {
    component: HicScene,
    effect: "magnify",
    lens: [0.72, 0.49],
    lensStart: 0.46,
    lensTravel: 0.22,
    transition: "magnify",
  },
  raster: { component: RasterScene, effect: "bubble", transition: "clean" },
  media: {
    component: MediaScene,
    effect: "clean",
    media: true,
    transition: "bubble",
  },
  ratio: {
    component: RatioScene,
    effect: "magnify",
    media: true,
    lens: [0.72, 0.5],
    lensStart: 0.44,
    lensTravel: 0.2,
    transition: "clean",
  },
  three: { component: ThreeScene, effect: "clouds", transition: "clean" },
  depth: {
    component: DepthScene,
    effect: "clean",
    media: true,
    transition: "clean",
  },
  magnify: {
    component: MagnifyScene,
    effect: "magnify",
    lens: [0.5, 0.34],
    lensStart: 0.1,
    lensTravel: 0.42,
    transition: "clean",
  },
  glitch: { component: GlitchScene, effect: "glitch", transition: "clean" },
  bubble: {
    component: BubbleScene,
    effect: "glass",
    lens: [0.79, 0.32],
    transition: "clean",
  },
  clouds: { component: CloudsScene, effect: "clouds", transition: "clean" },
  effects: { component: EffectsScene, effect: "glitch", transition: "clean" },
  agent: { component: AgentScene, effect: "bubble", transition: "clean" },
  preview: {
    component: PreviewScene,
    effect: "clean",
    media: true,
    transition: "clean",
  },
  render: {
    component: RenderScene,
    effect: "clouds",
    media: true,
    transition: "clean",
  },
  runtime: {
    component: RuntimeScene,
    effect: "magnify",
    lens: [0.5, 0.46],
    lensStart: 0.18,
    lensTravel: 0.3,
    transition: "clean",
  },
  result: { component: ResultScene, effect: "bubble", transition: "clean" },
  end: { component: EndScene, effect: "clouds", transition: "clean" },
};

export const sceneFor = (id: ShotId) => scenes[id];

export const ShotSurface: React.FC<{
  id: ShotId;
  frame: number;
  fps: number;
  progress: number;
}> = ({ id, frame, fps, progress }) => {
  const Scene = scenes[id].component;
  return <Scene frame={frame} fps={fps} progress={progress} />;
};
