# scenarios/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/README.md

成员清单
_shared/: 场景共用的时序、字幕与 beat 分发引擎。
faceless-explainer/: 科技新闻解读模板；荧光绿纸面、黑色超大排版与手绘 SVG 图形。
product-launch/: 产品发布片模板；霓虹玻璃与产品证据镜头。
index.ts: 场景模板的稳定导出入口。

依赖边界
每个场景只定义自己的 palette、默认 SCENES 与 beat 视觉语法；`_shared/` 只编排时序，不能把单一场景风格提升为全局默认。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
