# ui/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
src/main.tsx: Vite React 挂载入口。
src/app.tsx: Remotion Studio 项目工作台入口；加载 brief、项目素材与 catalog，管理 Brief → 工作室切换，并在 Header 承载导出/构建/重启/重置等次级操作。
src/brief-form.tsx: 项目 brief 的创建表单（风格模板、选题、描述、时长、素材）。
src/studio.tsx: 工作室工作面：左预览 + 右侧创作列；先按成片场景路由（无真人解说、发布片、图文故事、口播、音乐、字幕高光），再提供当前成片编辑工具，统一走「参数选择 → 可编辑 Prompt → Agent」。
src/scenarios/: 成片场景和当前成片编辑的资源选择与 Prompt 生成模块；CreationScenario 映射到 remotion-scenes skill，CaptionsScenario 以分组卡片缩小范围，并用可拖动时间轴的真实大预览检验无底框字幕动效。
src/preview/: Remotion Player 样片选择器；大预览可显示控制条，网格卡片停在代表帧，且严格区分 Studio 风格样板与可执行组件模板。
src/player-panel.tsx: 轮询每项目 Vite 预览服务器；仅在应用层 HTTP 健康检查和浏览器连通性均通过后显示 iframe，启动/重启的 15 秒轮询窗口始终展示 Loading，超时或真实失败才显示错误诊断。
src/export-panel.tsx: 轻量导出入口；用模态框承载本地导出设置、环境检查、渲染进度与历史产物。
src/terminal-panel.tsx: xterm 终端，对接 service 层已有 terminal.exec 协议：行编辑、↑↓ 历史、cd 切换与清屏。
src/log-panel.tsx: 日志回填（logs.list 全量 + shell.job.log 实时，去重合并）与按任务过滤、复制、清空。
src/recut-sdk.ts: iframe 与 Recut Host 通信、状态和媒体 API 适配层。

设计规范
App 使用 Recut 设计系统语义 token（浅色内容面、主命令按钮与紧凑工具控件）；组件只组合 Tailwind 工具类与本地 shadcn 原子（components/ui/），不另建 CSS 主题。宽画布留给 Remotion Studio 预览 iframe，右侧列保持 24rem 信息密度；创作先从用户可理解的成片场景开始，场景选择会将对应的 `remotion-scenes` skill id、模板、字幕、画幅与真实 assetId 一起交给 Agent；随后才提供模板、字幕、画布、SRT、shotcraft 组件和素材重剪等局部编辑工具。更换资源会生成新的默认 Prompt。字幕一律无底框：可用字重、描边、阴影、柔焦和动效增强可读性，但不得用色块、玻璃或卡片包裹文字。字幕选择先用分组卡片缩小范围，再通过可播放、可拖动的真实大预览确认动效；小卡永远不承担动效检验。素材不作为孤立的技术信息面板，而是通过成片场景或「用素材重剪」选择并传递 assetId。导出、构建、重启与重置均为次级工具，其中导出参数和渲染状态仅在模态框展开；终端/日志分栏默认显示终端，日志切换保留各自状态。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
