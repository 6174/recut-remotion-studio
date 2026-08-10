/**
 * [INPUT]: 依赖 _shared/SceneEngine、各场景的 beats 与模板
 * [OUTPUT]: 对外提供场景解决方案：共享引擎 + 每个场景的内置调色板、beat 渲染器与模板代码。
 *           场景的动画原语（primitives）是场景内部实现，不对外 re-export（避免命名冲突），
 *           AI 直接读对应场景目录的 primitives.tsx 参考。
 * [POS]: scenarios 目录入口；模板 = 场景（自带视觉 + 导演结构）。其中 faceless-explainer 是荧光绿
 *        纸面科技新闻模板，doodle-explainer 是 roughjs 手绘速写本白板讲解模板；
 *        换风格走外层 design-system 迭代。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export * from "./_shared/SceneEngine";
export * from "./_shared/GpuSceneEngine";
export * from "./_shared/types";
export * from "./product-launch/beats";
export * from "./product-launch/template/ProjectVideo";
export * from "./faceless-explainer/beats";
export * from "./faceless-explainer/template/ProjectVideo";
export * from "./doodle-explainer/beats";
export * from "./doodle-explainer/template/ProjectVideo";
