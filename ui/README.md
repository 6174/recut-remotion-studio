# ui/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
src/main.tsx: Vite React 挂载入口。
src/app.tsx: Remotion Studio 项目工作台入口；加载 brief、项目素材与 catalog，管理 Brief → 工作室切换，并在 Header 承载导出/构建/重启/重置等次级操作。
src/brief-form.tsx: 项目 brief 的创建表单（风格模板、选题、描述、时长、素材）。
src/studio.tsx: 工作室工作面：左预览 + 右侧创作列；场景卡驱动「参数选择 → Prompt → Agent」流程，调用模板/字幕/画布/shotcraft 组件/素材库资源；SRT 场景可上传字幕文件或选择音视频 asset 后转录，向 Header 提供导出/构建/重启/重置回调，下半为「终端 / 日志」分栏（可拖拽分隔）。
src/player-panel.tsx: 轮询每项目 Vite 预览服务器；仅在服务 `ready` 后挂载 iframe，启动窗口展示 Loading，并管理素材同步、重启与错误诊断复制。
src/export-panel.tsx: 轻量导出入口；用模态框承载本地导出设置、环境检查、渲染进度与历史产物。
src/terminal-panel.tsx: xterm 终端，对接 service 层已有 terminal.exec 协议：行编辑、↑↓ 历史、cd 切换与清屏。
src/log-panel.tsx: 日志回填（logs.list 全量 + shell.job.log 实时，去重合并）与按任务过滤、复制、清空。
src/recut-sdk.ts: iframe 与 Recut Host 通信、状态和媒体 API 适配层。

设计规范
App 使用 Recut 设计系统语义 token（浅色内容面、主命令按钮与紧凑工具控件）；组件只组合 Tailwind 工具类与本地 shadcn 原子（components/ui/），不另建 CSS 主题。宽画布留给 Remotion Studio 预览 iframe，右侧列保持 24rem 信息密度；创作是唯一主操作：用户先选场景，再选择模板、字幕主题、画布、SRT、shotcraft 组件或素材库资源，审阅生成的 Prompt 后复制或交给 Agent。素材不作为孤立的技术信息面板，而是通过「用素材重剪」场景选择并传递 assetId。导出、构建、重启与重置均为次级工具，其中导出参数和渲染状态仅在模态框展开；终端/日志分栏默认显示终端，日志切换保留各自状态。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
