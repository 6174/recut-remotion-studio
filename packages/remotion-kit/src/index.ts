/**
 * [INPUT]: 依赖 remotion/react 与内部 captions/components/effects 模块
 * [OUTPUT]: 对外提供字幕主题注册表、内置模板、动态组件、效果层与风格原子
 * [POS]: remotion-studio 的共享组件库；ui 预览与 workspace 渲染（ProjectVideo/AI 代码）同一来源
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export * from "./captions";
export * from "./effects";
export * from "./fonts";
export * from "./palette";
export * from "./components";
export * from "./styles";
export * from "./scenarios";
export * from "./html-canvas";
export * from "./materials";
export * from "./three";
