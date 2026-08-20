# src/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
main.tsx: Vite React 挂载入口。
app.tsx: 项目工作台根；加载 brief、素材与目录，并在 Header 挂载次级操作。
brief-form.tsx: 新建项目的成片模板、选题、可选详细描述、优先从素材库选择、缺失时本地上传的可选 SRT，与单个支持多选的素材入口；所选视频可作为叙事来源。
studio.tsx: 左预览、右创作列、微调弹窗和日志/终端分栏的工作面编排；动作依表达特效、内容组件、使用素材、其他微调排序。
fine-tunes/: 当前成片的参数选择与 Prompt 生成；SRT/视频叙事来源仅在 Brief 创建时选择，动态组件与镜头特效都采用紧凑网格卡片。
preview/: Remotion Player 样片、成片/组件/镜头材质分发与预览数据。
components/: 本地 shadcn UI 原子及其目录说明。
lib/: 仅含 UI 通用工具函数。
export-panel.tsx: 本地导出设置、环境检查、进度和历史产物界面。
log-panel.tsx: 以 iframe 本次加载时间切断历史的当前会话日志；有界回填、实时追加、按任务过滤和复制。
player-panel.tsx: 项目 Vite 预览服务健康检查与 iframe 承载；首次 pnpm bootstrap 时显示安装态，并把 Shell Job 实时输出引导到日志分栏。
terminal-panel.tsx: 连接 Service PTY 的交互式 zsh 终端；从项目 `workspace/` 启动，shell 原生处理补全、历史、cwd 与作业控制。
recut-sdk.ts: iframe 与 Recut Host 通信、状态与媒体 API 适配。
style.css: 工作台的暗色优先 Tailwind 补充样式与布局细节。
ui.tsx: Modal 等工作台级复合 UI。

依赖边界
`studio.tsx` 只编排状态和界面，资源选择与 Prompt 生成下沉到 `fine-tunes/`，真实 Remotion 渲染下沉到 `preview/`。任何新源码文件、职责变更或导出变更都必须同步本清单和文件头部契约。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
