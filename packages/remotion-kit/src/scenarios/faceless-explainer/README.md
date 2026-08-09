# faceless-explainer/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SKILL.md: 科技新闻解读的导演手册、视觉语法、分镜纪律与可读性验收。
beats.tsx: 八类科技新闻 beat 的场景组合；只编排专属视觉原语。
primitives.tsx: 网格纸、荧光 marker、手绘箭头、卡通眼睛、新闻卡与大字号数据条的确定性 SVG 原语。
template/ProjectVideo.tsx: 默认调色板与“每天一条科技新闻，三问读懂”的场景序列。

依赖边界
`template/` 只声明内容与调色板，`beats.tsx` 只选择镜头结构，`primitives.tsx` 承担全部风格细节；因此替换新闻内容不会稀释视觉表达。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
