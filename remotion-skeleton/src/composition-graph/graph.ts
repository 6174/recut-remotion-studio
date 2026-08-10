/**
 * [INPUT]: 无外部运行时依赖；由 composition 和实验控制面读取
 * [OUTPUT]: 对外提供 CompositionNode 类型、实验图定义与节点统计
 * [POS]: composition-graph 的声明式模型层；渲染层只能消费它，不能把场景结构写死在 UI 中
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export type CompositionNodeKind = "composition" | "html" | "media" | "effect";

export interface CompositionNode {
  id: string;
  label: string;
  kind: CompositionNodeKind;
  parentId?: string;
  renderer: string;
}

export const compositionGraph: readonly CompositionNode[] = [
  {
    id: "root",
    label: "Composition Graph Root",
    kind: "composition",
    renderer: "Remotion frame clock -> ThreeCanvas",
  },
  {
    id: "html-title",
    label: "HTML Texture Input",
    kind: "html",
    parentId: "root",
    renderer: "HIC -> CanvasTexture -> material",
  },
  {
    id: "media-band",
    label: "Media Texture Input",
    kind: "media",
    parentId: "root",
    renderer: "Canvas / VideoTexture -> material",
  },
  {
    id: "bend-pass",
    label: "Bend Transition",
    kind: "effect",
    parentId: "html-title",
    renderer: "CanvasUI-inspired Three vertex material",
  },
  {
    id: "magnify-lens",
    label: "Magnify Lens",
    kind: "effect",
    parentId: "html-title",
    renderer: "GPU shader material",
  },
  {
    id: "glitch-pass",
    label: "Glitch Pass",
    kind: "effect",
    parentId: "html-title",
    renderer: "CanvasUI shader material",
  },
  {
    id: "clouds-pass",
    label: "Clouds Field",
    kind: "effect",
    parentId: "root",
    renderer: "CanvasUI shader material",
  },
  {
    id: "bubble-pass",
    label: "Bubble Refraction",
    kind: "effect",
    parentId: "html-title",
    renderer: "CanvasUI shader material",
  },
];

export const graphNodeCount = () => compositionGraph.length;
