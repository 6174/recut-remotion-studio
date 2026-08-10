# vendor/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/captions/README.md

成员清单
CaptionTheme.tsx: 颜色归一化适配层；按主题 id 从注册表分发真实主题，未知 id 回退至 pop。
short-video.tsx: 历史的中文优先短视频字幕基线；不再作为多主题运行时的统一渲染器。
index.ts: 主题组件、注册表与类型的稳定导出入口。
registry.ts: 字幕主题 id 到实现组件的唯一映射。
types.ts: 字幕时间轴与主题输入的类型契约。
themes/: 每种字幕主题的独立可视渲染器。

依赖边界
注册层只分发主题，不介入场景构图；每个主题保留自己独立的字形、排版与动效，必须逐帧确定且默认不创建字幕背景容器。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
