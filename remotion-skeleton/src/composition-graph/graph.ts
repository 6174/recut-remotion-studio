/**
 * [INPUT]: 无外部运行时依赖；由 composition 和实验控制面读取
 * [OUTPUT]: 对外提供 CompositionNode 类型、实验图定义与节点统计
 * [POS]: composition-graph 的声明式模型层；渲染层只能消费它，不能把场景结构写死在 UI 中
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export type CompositionNodeKind = "composition" | "html" | "media" | "ai-object" | "effect";

export interface CompositionNode {
  id: string;
  label: string;
  kind: CompositionNodeKind;
  parentId?: string;
  renderer: string;
}

export const compositionGraph: readonly CompositionNode[] = [
  { id: "root", label: "Root Composition", kind: "composition", renderer: "Remotion frame clock" },
  { id: "html-title", label: "HTML Title Card", kind: "html", parentId: "root", renderer: "HTML -> raster texture" },
  { id: "media-band", label: "Media Signal", kind: "media", parentId: "root", renderer: "Canvas texture" },
  { id: "ai-orb", label: "AI Object", kind: "ai-object", parentId: "root", renderer: "Three.js mesh + particles" },
  { id: "magnify-lens", label: "Magnify Lens", kind: "effect", parentId: "html-title", renderer: "GPU shader material" },
];

export const graphNodeCount = () => compositionGraph.length;
