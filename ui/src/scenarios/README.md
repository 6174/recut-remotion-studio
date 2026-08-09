# scenarios/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
types.ts: 所有创作场景共享的输入与回调契约。
TemplateScenario.tsx: 成片模板选择（模板 = 场景，对应 catalog.scenarios）；只输出镜头结构与底层组件组合，是创作主入口。
StyleScenario.tsx: 设计系统选择；读取全局 recut-design-system skill（recut.design_system.get）并输出色彩、字形、间距、形状与动效语法约束。
CaptionsScenario.tsx: 字幕主题选择与 Prompt 组装。
CanvasScenario.tsx: 画布尺寸选择与 Prompt 组装。
ComponentScenario.tsx: 左侧组件目录选择器与右侧可播放预览；按 template/shotcraft 类型派发真实组件，窄屏自动改为上下布局。
SrtScenario.tsx: SRT 或音视频来源、视觉风格和字幕主题的组合入口。
MaterialsScenario.tsx: 项目素材选择与重剪 Prompt 组装。
DirectScenario.tsx: 无参数的直接创作指令入口。
AssetPicker.tsx: 可复用项目素材选择器。

依赖边界
每个模块只维护用户选择并输出 Prompt；播放与真实组件渲染由 `../preview/` 统一处理。成片模板（TemplateScenario）是主入口——模板 = 场景（catalog.scenarios，如 product-launch / faceless-explainer），Agent 读取对应场景技能与模板代码后重写这支视频的结构。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
