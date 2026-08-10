/**
 * [INPUT]: 依赖 remotion-kit 内部 materials 模块各文件
 * [OUTPUT]: 对外提供 materials 的稳定导出：材质组件、注册表、schema、MaterialElement 与契约类型
 * [POS]: remotion-kit/src/materials 的导出边界；three 运行时桥、catalog 与 AI 都从本入口引用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export { CanvasUiCloudsMaterial } from "./ambient/clouds-material";
export { HtmlArticleHighlightMaterial } from "./post/article-highlight-material";
export { HtmlBubbleMaterial } from "./post/bubble-material";
export { HtmlCrtMaterial } from "./post/crt-material";
export { HtmlGlassMaterial } from "./post/glass-material";
export { HtmlGlitchMaterial } from "./post/glitch-material";
export { HtmlMagnifyMaterial } from "./post/magnify-material";
export { HtmlVintageMaterial } from "./post/vintage-material";
export { HtmlBendMaterial } from "./transform/bend-material";
export { HtmlStorePeelMaterial } from "./transform/store-peel-material";
export { MATERIAL_REGISTRY, getMaterialDefinition } from "./registry";
export { MATERIAL_SCHEMA } from "./schema";
export { MaterialElement } from "./MaterialElement";
export { useMaterialUniforms } from "./shared/uniforms";
export {
  GLSL_FBM2,
  GLSL_HASH12,
  GLSL_NUMERIC,
  PASSTHROUGH_VERTEX,
} from "./shared/glsl";
export type {
  MaterialCategory,
  MaterialDefinition,
  MaterialElementProps,
  MaterialId,
  MaterialParamSchema,
  MaterialRegistry,
} from "./types";
export { materialOption } from "./types";
