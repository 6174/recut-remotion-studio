# references/

> L2 | 父级: /apps/remotion-studio/skills/remotion-studio/README.md

成员清单
creation-modes.md: 选择模板改写、自主创作、共同创作或单镜头的唯一资料路由。
directing.md: 全片镜头语言、Shot Language、节奏和确定性渲染速查。
production-workflow.md: 从产品理解、分镜到交付的完整制作流程。
collaborative-creation.md: 共同创作中需要用户确认的最少决策点。
shot-recipes/: 按镜头类型整理的运动配方；Three、镜头层、页面/设备入镜、焦点或透镜任务必须先读 camera/README.md。
sequence-patterns/: 多镜头桥段的能量曲线与节奏骨架。
paper-ink-product-promo.md: 纸墨编辑风产品片的可选复现参考。
aesthetic-rules.md: 节奏、构图、声音、文案和流程的判例式验收准则。
sound-design.md: BGM、SFX 与时间线声音设计。
music-beat-sync.md: 强节奏音乐的节拍分析、卡点与渲后回测。
final-review.md: 独立审查成片的输入与验收清单。
effects.md: 内置背景、文字和镜头效果的选择规则。
captions.md: 字幕主题及其适用场景。
gpu-composition.md: Three-first GPU 合成的架构契约（world surface、camera、screen layer 与材质边界）。

依赖边界
`SKILL.md` 只按任务读取本目录资料；成片结构、场景原语、组件、材质和实际导出路径都以 `@recut/remotion-kit` 与其 `catalog.json` 为单一真相源。涉及镜头表达时，先读 `shot-recipes/camera/README.md` 的 Shot Language v3，再选 `catalog.json.effects` 内 `engine="three-camera"` 的已验证 preset；不要从效果名或 CSS 参数反推镜头。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
