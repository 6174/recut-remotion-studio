# remotion-kit/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
catalog.json: 成片模板、字幕、画布、组件与镜头层效果（effects）的唯一目录；每个模板描述可交给 AI 的完整动效节奏。
manifest.json: kit 版本元数据。
package.json: kit 的导出边界与 peer dependency。
src/: 可复用的字幕、效果、调色板、模板、shotcraft 组件、html-canvas 交互层、GPU 材质与 three 运行时桥。
scripts/: 随项目 workspace 冻结的场景计划工具；当前包含由 HyperFrames storyboard parser 改编的校验器。
third_party/: 随代码分发的第三方许可证与归属说明。

依赖边界
UI 预览和项目 workspace 都从本包导入；catalog 只描述资源，不承载渲染逻辑。模板是视觉与叙事的唯一选择，不存在独立风格层。
Three-first GPU 合成（src/three/ + src/materials/）是默认架构：HTML 经 HtmlSurface 光栅化为 CanvasTexture，
效果由材质实现，镜头由 ShotGraph 声明式模型装配。HTML-in-Canvas 交互（src/html-canvas/）只提供帧驱动互动脚本与
交互 overlay；GpuCompositor 与 HtmlCanvasVideoStage 的 GPU pass 已退役。浏览器硬能力唯一由 `HtmlInCanvas.isSupported()` 把关；
Recut 的动态项目预览需由宿主 Chromium 统一启用 `CanvasDrawElement`，不支持时不降级。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
