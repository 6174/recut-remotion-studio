# remotion-kit/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
catalog.json: 成片模板、字幕、画布、组件与镜头层效果（effects）的唯一目录；每个模板描述可交给 AI 的完整动效节奏。
manifest.json: kit 版本元数据。
package.json: kit 的导出边界与 peer dependency。
src/: 可复用的字幕、效果、调色板、模板、shotcraft 组件与 html-canvas 表达镜头层实现。
scripts/: 随项目 workspace 冻结的场景计划工具；当前包含由 HyperFrames storyboard parser 改编的校验器。
third_party/: 随代码分发的第三方许可证与归属说明。

依赖边界
UI 预览和项目 workspace 都从本包导入；catalog 只描述资源，不承载渲染逻辑。模板是视觉与叙事的唯一选择，不存在独立风格层。
HTML-in-Canvas 表达镜头（src/html-canvas/）走唯一捕获舞台与 StagePlan 确定性合同；浏览器硬能力由 BrowserCapabilityGate 把关，不支持时不降级。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
