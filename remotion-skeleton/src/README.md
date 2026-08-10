# src/

> L2 | 父级: /apps/remotion-studio/remotion-skeleton/README.md

成员清单
Root.tsx: Remotion composition 注册表，声明 ProjectVideo 的时长、帧率和画布元数据。
bootstrap.tsx: 正式预览浏览器入口，捕获模块加载和运行时错误后再挂载 Player。
player.tsx: 项目视频的 `@remotion/player` 预览根，读取 `preview/props.json`。
index.ts: Remotion bundle 的 `registerRoot` 入口。
index.css: 正式预览与导出的 Tailwind 入口和 Recut 语义 token。
error-view.tsx: 预览模块与 composition 错误的可读回退页。
media.tsx: 项目媒体元素的预览组件。
tw-probe.tsx: Tailwind 编译链的运行时探针。
types.ts: ProjectVideo、媒体和渲染设置的共享类型。
lib/utils.ts: 本地 UI 原子的 className 合并工具。
runtime/media.ts: 预览/导出共用的 assetId 媒体 URL 解析器。
components/: 成片可复用的 UI、模板与 shotcraft 组件。
compositions/: 正式项目成片定义。
composition-graph/: 不依赖 Recut Host 的 Vite 独立实验页，验证 Remotion + Three Composition Graph。

依赖边界

正式项目预览由 `bootstrap.tsx` -> `player.tsx` -> `compositions/` 组成；`composition-graph/` 只由 `composition-graph.html` 进入，不读取项目 props 或 SDK。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
