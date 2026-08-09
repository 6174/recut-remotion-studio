# remotion-kit/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
catalog.json: 风格模板、字幕、画布与组件的唯一目录；视觉模板描述包含可交给 AI 的完整动效节奏，含六套由 HyperFrames Design 公开设计原则转译的样片。
design-systems/: `design.md` 风格规范；Agent 先读此处，再从 `src/styles/` 导入对应风格原子。
manifest.json: kit 版本元数据。
package.json: kit 的导出边界与 peer dependency。
src/: 可复用的字幕、效果、调色板、模板与 shotcraft 组件实现。
scripts/: 随项目 workspace 冻结的场景计划工具；当前包含由 HyperFrames storyboard parser 改编的校验器。
third_party/: 随代码分发的第三方许可证与归属说明。

依赖边界
UI 预览和项目 workspace 都从本包导入；catalog 只描述资源，不承载渲染逻辑。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
