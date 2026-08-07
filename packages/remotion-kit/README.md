# remotion-kit/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
catalog.json: 风格模板、字幕、画布与组件的唯一目录；视觉模板描述包含可交给 AI 的完整动效节奏，含六套由 HyperFrames Design 公开设计原则转译的样片。
manifest.json: kit 版本元数据。
package.json: kit 的导出边界与 peer dependency。
src/: 可复用的字幕、效果、调色板、模板与 shotcraft 组件实现。

依赖边界
UI 预览和项目 workspace 都从本包导入；catalog 只描述资源，不承载渲染逻辑。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
