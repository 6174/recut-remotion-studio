# _shared/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SceneEngine.tsx: DOM 场景时序、淡入淡出、真实媒体、字幕与 beat 分发（保留给旧路径）。
GpuSceneEngine.tsx: Three-first GPU 编排：createSceneContent（world 内容纹理）+ SceneScreenLayer（可选 screen beat）+ buildGpuScenePlan（含 camera/surface mapper 的 ShotGraph 镜头图）+ 仅 cursor 的交互 overlay + 字幕 DOM overlay。
types.ts: Scene、Palette、world/screen beat 渲染器与引擎输入的共享类型；Scene.screenKind 显式声明屏幕层 renderer。

依赖边界
本目录不定义任何场景视觉或默认文案；`faceless-explainer/`、`product-launch/`、`doodle-explainer/` 通过稳定类型和 `GpuSceneEngine`（默认）/`SceneEngine` 接入自己的视觉语言。模板可把图形、正文、UI 放入 world（GPU 合成），并以 `screenKind` 将标题、说明、HUD 放进 screen（最终 DOM 叠加）；效果只作用前者，字幕恒在最上层。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
