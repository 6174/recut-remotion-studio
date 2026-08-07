# preview/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
compositions.tsx: 预览合成分发；将字幕、Studio 风格样板、可执行 Remotion 模板和 shotcraft 组件严格区分。
rich-templates.tsx: Studio 原生模板样片；模板有完整的开场、信息推进和收束。
hyperframes-inspired.tsx: 将 HyperFrames Design 的六套公开设计原则转译为逐帧确定的 Remotion 样片，不复用其运行时代码。
PreviewCard.tsx: 单项 Remotion Player 预览，静音自动循环播放。
PreviewPicker.tsx: 大预览和选项卡组成的通用选择器。
CanvasPicker.tsx: 画布尺寸选择器。
sample.ts: 字幕与预览的固定示例数据。

依赖边界
场景模块只传递 `PreviewSpec`；本目录负责类型派发与播放行为，不能把目录中的 `template` 误当成 Studio 风格样板。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
