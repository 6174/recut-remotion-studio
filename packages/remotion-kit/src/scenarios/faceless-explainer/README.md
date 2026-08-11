# faceless-explainer/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SKILL.md: 科技新闻解读的导演手册、视觉语法、分镜纪律与可读性验收。
beats.tsx: 八类科技新闻 beat 的场景组合；只编排专属视觉原语。
primitives.tsx: 渐变网格纸、荧光 marker、手绘箭头、卡通眼睛、新闻卡与大字号数据条的确定性 SVG 原语；也保留旧冻结 workspace 所需的兼容导出。
template/ProjectVideo.tsx: 默认调色板、场景序列与全片 vintage 纹理材质的 GPU 镜头图；hook/data 的纸面以轻弯、倾斜、Z 位移在约 1 秒内落位，再由 Three camera drift/push 收束。

依赖边界
`template/` 声明内容、调色板与全片材质，`beats.tsx` 只选择镜头结构，`primitives.tsx` 承担全部风格细节；渐变只在本场景边界内生效，因此替换新闻内容不会稀释视觉表达，也不会污染平台级默认。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
