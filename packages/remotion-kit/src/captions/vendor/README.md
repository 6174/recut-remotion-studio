# vendor/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/captions/README.md

成员清单
CaptionTheme.tsx: 颜色归一化适配层；按主题 id 调用统一短视频基线，beast 直连白字黑描边专用渲染器。
short-video.tsx: 中文优先的无底框短视频字幕渲染器；以字重、描边、阴影、短语分行和关键词动效区分主题。
index.ts: 主题组件、注册表与类型的稳定导出入口。
registry.ts: 字幕主题 id 到实现组件的唯一映射。
types.ts: 字幕时间轴与主题输入的类型契约。
themes/: 每种字幕主题的独立可视渲染器。

依赖边界
注册层只分发主题，不介入场景构图；短视频字幕以短语分行、深色主字和单一主题绿关键词为基线，科技新闻 beast 使用横向白字黑描边，二者都必须逐帧确定且默认不创建字幕背景容器。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
