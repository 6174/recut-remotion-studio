/**
 * [INPUT]: 依赖 StyleSystem 的风格 token 与 Remotion 风格原子
 * [OUTPUT]: 对外提供 @recut/remotion-kit/styles 子路径
 * [POS]: remotion-kit 的风格模块入口；供 Agent 和成片模板统一导入
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export * from "./StyleSystem";
