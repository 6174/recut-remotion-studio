# fine-tunes/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
FineTuneProps.ts: 所有微调动作共享的输入与回调契约。
TemplateFineTune.tsx: 将当前成片替换为所选成片模板；模板本身来自 catalog.scenarios。
CaptionsFineTune.tsx: 字幕主题微调与 Prompt 组装；全部主题在一个网格直出，不分组或筛选。
CanvasFineTune.tsx: 画布尺寸微调与 Prompt 组装。
ComponentFineTune.tsx: 动态组件微调；按类别以镜头特效同款紧凑网格卡片选择，派发 template/motion 真实预览，窄屏自动改为上下布局。
MaterialsFineTune.tsx: 将所选项目素材输出为最小引用清单，不预设剪辑或改写方式。
EffectsFineTune.tsx: Three 镜头与材质特效选择器；按类别以紧凑网格小卡片展示，用户只选效果，参数 schema 自动附入 Prompt，由 Agent 决定 descriptor.camera 或 effect/transition/ambient 的语义挂载与最终参数。
AssetPicker.tsx: 可复用项目素材选择器。

依赖边界
本目录只定义“如何修改当前成片”的微调动作，不定义成片模板。每个模块只维护用户选择并输出 Prompt；播放与真实组件渲染由 `../preview/` 统一处理。SRT 或视频叙事来源只在项目 Brief 创建时选择，确保首版成片有唯一输入入口。成片模板在 `catalog.scenarios`，其场景技能与代码在 `@recut/remotion-kit/src/scenarios/`；UI 只通过 TemplateFineTune 选择它。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
