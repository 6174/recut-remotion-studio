# ui/

> L2 | 父级: /apps/recut-remotion-studio/README.md

成员清单
src/app.tsx: Remotion Studio 项目工作台入口；加载 brief、设计、项目素材和导出状态。
src/style.css: 与 Recut 主工作台一致的亮色 App token、低圆角面板和紧凑工具控件。
src/studio.tsx: 时间轴、预览与设计编辑工作面。
src/brief-form.tsx: 项目 brief 的创建与编辑表单。
src/player-panel.tsx: Remotion 实时预览面板。
src/export-panel.tsx: 本地导出状态与产物操作面板。
src/recut-sdk.ts: iframe 与 Recut Host 通信、状态和媒体 API 适配层。
src/main.tsx: Vite React 挂载入口。

设计规范
App 使用白色内容面、品牌绿主命令、6-8px 圆角和 4px 间距网格；工具区保持紧凑，预览和时间轴才占据宽画布。颜色只能由 `style.css` 的语义 token 定义，不能在组件内分叉成另一套主题。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
