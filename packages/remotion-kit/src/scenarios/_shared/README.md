# _shared/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SceneEngine.tsx: DOM 场景时序、淡入淡出、真实媒体、字幕与 beat 分发（保留给旧路径）。
GpuSceneEngine.tsx: Three-first GPU 编排：createSceneContent（纯内容渲染函数）+ buildGpuScenePlan（ShotGraph 镜头图）+ 交互 overlay + 字幕 DOM overlay。
types.ts: Scene、Palette、beat 渲染器与引擎输入的共享类型。

依赖边界
本目录不定义任何场景视觉或默认文案；`faceless-explainer/`、`product-launch/`、`doodle-explainer/` 通过稳定类型和 `GpuSceneEngine`（默认）/`SceneEngine` 接入自己的视觉语言。模板是 Three-first：内容层走 GPU 合成，效果走 `src/materials/`。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
