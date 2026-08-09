# captions/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/README.md

成员清单
index.ts: 逐词字幕时间轴构建与 CaptionTheme 的稳定导出。
vendor/: 冻结的主题注册与主题实现；场景只经此边界选择字幕主题。

依赖边界
场景提供叙事文本与 palette，`captions/` 从帧时钟确定性生成逐词时间轴；字幕本身不得依赖场景布局或自建背景框。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
