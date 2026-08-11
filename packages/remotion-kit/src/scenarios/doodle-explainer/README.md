# doodle-explainer/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SKILL.md: 白板涂鸦讲解的导演手册、视觉语法、分镜纪律与可读性验收。
beats.tsx: 八类白板讲解 beat 的场景组合；只编排专属手绘视觉原语。
primitives.tsx: 点阵纸、手绘方框/椭圆/弧线箭头/下划线/高亮、便签卡、编号步骤、数据条与进度条的 roughjs 原语（固定 seed，逐帧确定）；局部原语显式声明本地 SVG viewBox，卡片保持流式布局，标题下划线默认横跨八个字宽，避免嵌套容器错位。
template/ProjectVideo.tsx: 默认调色板（来自全局 doodle 设计系统 token）与“画出来 → 形状 → 步骤 → 例子 → 类比 → 信号 → 便签 → 结论”的场景序列；data 段让手绘纸面从俯倾、轻弯姿态快速落位，再以 Three crane 收束数字。

依赖边界
`template/` 只声明内容与调色板，`beats.tsx` 只选择镜头结构，`primitives.tsx` 承担全部手绘风格细节；全局装饰使用 1920×1080 视口，卡片与组件使用自身尺寸的局部 viewBox，弧线箭头的头部沿末段切线定位。因此替换内容不会稀释视觉表达。roughjs 是 remotion-kit 的运行时依赖（hand-drawn 手绘路径生成），seed 固定在 primitives 内部。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
