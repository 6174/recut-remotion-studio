# ui/

> L2 | 父级: /apps/remotion-studio/README.md

成员清单
src/app.tsx: Remotion Studio 项目工作台入口；加载 brief、项目素材、catalog 与预览状态，Brief → 工作室的切换。
src/brief-form.tsx: 项目 brief 的创建表单（风格模板、选题、描述、时长、素材）。
src/studio.tsx: 工作室工作面：iframe 嵌入每项目的 Remotion Studio 预览服务器，管理 start/status/stop 轮询与素材 env 同步，侧栏承载导出与素材引用。
src/export-panel.tsx: 本地导出设置、环境检查、渲染进度与历史产物面板。
src/recut-sdk.ts: iframe 与 Recut Host 通信、状态和媒体 API 适配层。
src/main.tsx: Vite React 挂载入口。

设计规范
App 使用暗色内容面、主命令按钮与紧凑工具控件；宽画布留给 Remotion Studio 预览 iframe，侧栏保持 400px 信息密度。颜色只能由 `style.css` 的语义 token 定义，不能在组件内分叉成另一套主题。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
