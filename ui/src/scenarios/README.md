# scenarios/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
types.ts: 所有创作场景共享的输入与回调契约。
scene-modes.ts: 成片场景的单一真相源；定义 UI 文案、素材门槛与可发现的 Agent skill id。
CreationScenario.tsx: 成片场景参数入口；组合模板、字幕、画幅和真实素材并生成可执行 Prompt。
TemplateScenario.tsx: Studio 视觉风格选择与 Prompt 组装。
CaptionsScenario.tsx: 字幕主题选择与 Prompt 组装。
CanvasScenario.tsx: 画布尺寸选择与 Prompt 组装。
ComponentScenario.tsx: 左侧组件目录选择器与右侧可播放预览；按 template/shotcraft 类型派发真实组件，窄屏自动改为上下布局。
SrtScenario.tsx: SRT 或音视频来源、视觉风格和字幕主题的组合入口。
MaterialsScenario.tsx: 项目素材选择与重剪 Prompt 组装。
DirectScenario.tsx: 无参数的直接创作指令入口。
AssetPicker.tsx: 可复用项目素材选择器。

依赖边界
场景分两层：`CreationScenario` 先按交付目标路由到可发现的 `remotion-scenes` skill；其余模块用于编辑当前成片。两层都只维护用户选择并输出 Prompt；播放与真实组件渲染由 `../preview/` 统一处理。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
