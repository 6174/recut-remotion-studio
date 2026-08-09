# _shared/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SceneEngine.tsx: 场景时序、淡入淡出、真实媒体、字幕与 beat 分发；强制执行全局文字可读性下限。
types.ts: Scene、Palette、beat 渲染器与引擎输入的共享类型。

依赖边界
本目录不定义任何场景视觉或默认文案；`faceless-explainer/`、`product-launch/` 通过稳定类型和 `SceneEngine` 接入自己的视觉语言。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
