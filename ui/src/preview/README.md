# preview/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
compositions.tsx: 预览合成分发；将字幕、Studio 风格样板、成片场景（composition → 场景真实组件）和 shotcraft 组件严格区分。
PreviewCard.tsx: 单项 Remotion Player 预览，静音自动循环播放。
PreviewPicker.tsx: 大预览和选项卡组成的通用选择器。
CanvasPicker.tsx: 画布尺寸选择器。
sample.ts: 字幕与预览的固定示例数据。

依赖边界
场景模块只传递 `PreviewSpec`；本目录负责类型派发与播放行为。`kind="composition"` 时按场景 id 渲染 kit 里的真实场景组件（beats + 示例 SCENES），预览即成片。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
