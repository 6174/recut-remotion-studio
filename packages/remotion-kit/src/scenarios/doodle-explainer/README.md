# doodle-explainer/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SKILL.md: 白板涂鸦讲解的导演手册、视觉语法、分镜纪律与可读性验收。
beats.tsx: 八类白板讲解 beat 的场景组合；只编排专属手绘视觉原语。
primitives.tsx: 点阵纸、手绘方框/椭圆/箭头/下划线/高亮、便签卡、编号步骤、数据条与进度条的 roughjs 原语（固定 seed，逐帧确定）。
template/ProjectVideo.tsx: 默认调色板（来自全局 doodle 设计系统 token）与“画出来 → 形状 → 步骤 → 例子 → 类比 → 信号 → 便签 → 结论”的场景序列。

依赖边界
`template/` 只声明内容与调色板，`beats.tsx` 只选择镜头结构，`primitives.tsx` 承担全部手绘风格细节；因此替换内容不会稀释视觉表达。roughjs 是 remotion-kit 的运行时依赖（hand-drawn 手绘路径生成），seed 固定在 primitives 内部。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
