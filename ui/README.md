# ui/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
src/: Vite React 工作台源码；入口、工作面、微调模块、预览层和本地 UI 原子均在此处，见 `src/README.md`。
src/main.tsx: Vite React 挂载入口。
src/app.tsx: Remotion Studio 项目工作台入口；加载 brief、项目素材与 catalog，管理 Brief → 工作室切换，并在 Header 承载打开项目文件夹、导出、构建、重启、重置等次级操作。
src/brief-form.tsx: 项目 brief 的创建表单（可播放预览的成片模板、选题、可选详细描述、优先从素材库选择且可本地上传兜底的 SRT，与单个支持多选的素材入口；未上传 SRT 时所选视频成为叙事来源）。
src/studio.tsx: 工作室工作面：左预览 + 右侧创作列；以「选择成片模板」为主入口，微调保留表达特效、内容组件、素材、字幕、画布、**音乐与字体**，统一走「参数选择 → 可编辑 Prompt → Agent」，并以 FineTune 的 ready 合同禁用不满足资源或原生能力的提交；恢复 `{ assetId, trackId, url, track }` 音乐选择并传给预览，导入完成后更新为 Asset。
src/fine-tunes/: 当前成片的微调动作与 Prompt 生成模块；所有 UI 组件、类型和目录名均用 FineTune 区别于真正的成片模板。工作台动作顺序固定为「表达特效 → 内容组件 → 使用素材 → 其他微调」；EffectsFineTune 在同一弹框按「Three 镜头 / 后处理 / 转场 / 环境」分组，并以紧凑网格小卡片展示：用户只选择效果，参数 schema 自动附入 Prompt，Agent 决定 descriptor.camera 或 effect/transition/ambient 的语义挂载与最终参数；CaptionsFineTune 用白色网格 Player 检验无底框字幕动效；MusicFineTune 从 Recut CDN 试听/选择配乐并导入为媒体资产（music.import）；FontFineTune 从 Recut CDN 字体目录选择家族（fonts.select）。
src/preview/: Remotion Player 样片选择器；字幕大预览使用完整白色网格画布、无内框，以高对比字重检验可读性，卡片停在代表帧。
src/player-panel.tsx: 轮询每项目 Vite 预览服务器；仅在应用层 HTTP 健康检查和浏览器连通性均通过后显示 iframe，启动/重启的 15 秒轮询窗口始终展示 Loading，超时或真实失败才显示错误诊断；preview props 优先用当前音乐选择，未物化时保留 CDN url，Asset 完成后改用 assetId。
src/export-panel.tsx: 轻量导出入口；用模态框承载本地导出设置、环境检查、渲染进度与历史产物。
src/terminal-panel.tsx: xterm 终端，对接 service 层已有 terminal.exec 协议：行编辑、↑↓ 历史、cd 切换与清屏。
src/log-panel.tsx: 仅显示 iframe 当前页面会话的有界日志回填（最近 3 个任务、界面首屏最新 120 行）+ shell.job.log 实时追加，支持按当前会话任务过滤、复制、清空。
src/recut-sdk.ts: iframe 与 Recut Host 通信、状态和媒体 API 适配层；子页在监听器就绪后向父页 origin 重试握手，避免刷新时丢失 MessageChannel。

设计规范
App 使用 Recut 设计系统语义 token（浅色内容面、主命令按钮与紧凑工具控件）；组件只组合 Tailwind 工具类与本地 shadcn 原子（components/ui/），不另建 CSS 主题。宽画布留给 Remotion Studio 预览 iframe，右侧列保持 24rem 信息密度；成片模板（catalog.scenarios）是视觉、叙事与组件组合的唯一选择，Agent 读取对应场景技能与模板代码后重写整支视频。可选的 SRT 或视频叙事来源只在 Brief 创建时选择，随 Brief 持久化并进入首次 Agent 请求；`fine-tunes/` 仅保留针对当前成片的字幕、画布、动态组件和素材使用动作，命名与模板层彻底隔离。素材使用只提供 assetId 引用，具体放置与处理由用户补充。字幕一律无底框：可用字重、描边、阴影、柔焦和动效增强可读性，但不得用色块、玻璃或卡片包裹文字。字幕与动态组件的 Player 预览统一置于白色网格画布；字幕选择把全部主题直接展示在一个网格中，再通过可播放、可拖动的真实大预览确认动效。打开项目文件夹、导出、构建、重启与重置均为次级工具；文件夹操作由 App 后端按系统唤起 Finder、Windows 资源管理器或 Linux 默认文件管理器，UI 不暴露本地路径。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
