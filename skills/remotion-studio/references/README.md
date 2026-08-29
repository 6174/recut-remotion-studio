# references/

> L2 | 父级: /apps/remotion-studio/skills/remotion-studio/README.md

成员清单（薄适配层已标注权威来源，文件名与路径保持不变，引用不断链）
creation-modes.md: 选择模板改写、自主创作、共同创作或单镜头的唯一资料路由。（纯 App 契约，未动）
directing.md: 薄适配层 — 决策规则见 `service/skills/recut-directing-motion|editing|shot`，本文件仅保留 Remotion `interpolate`/`spring`/`ShotDescriptor`/`hold` 介质映射。（原 62 行 → 薄适配层）
production-workflow.md: 从产品理解、分镜到交付的完整制作流程。（纯 App 契约，未动）
collaborative-creation.md: 共同创作中需要用户确认的最少决策点。（纯 App 契约，未动）
shot-recipes/: 薄适配层 — 决策规则见 `service/skills/recut-directing-shot`，本目录仅保留"意图 + Remotion 实现要点"（`ShotDescriptor`/`surface`/`attention`/`catalog.json` preset）；通用镜头语法以全局为准，`shot-recipes/README.md` 已写明全局化说明，各配方文件头已追加路由注记。
sequence-patterns/: 多镜头桥段的能量曲线与节奏骨架。（纯 App 契约，未动）
paper-ink-product-promo.md: 纸墨编辑风产品片的可选复现参考。（纯 App 契约，未动）
aesthetic-rules.md: 薄适配层 — 决策规则见 `service/skills/recut-directing-motion/references/aesthetic-rules.md`，本文件仅保留 Remotion 高清栅格化（CSS zoom 2×/4×）、有效字高计算等介质约束。（原 177 行 → 薄适配层）
sound-design.md: 薄适配层 — 决策规则见 `service/skills/recut-directing-sound`，本文件仅保留 `SFX[]` 声明式表、相对钉帧、`assets/audio/` 16 类清单与 Remotion 音量约束。（原 286 行 → 薄适配层）
music-beat-sync.md: 薄适配层 — 决策规则见 `service/skills/recut-directing-editing/references/music-beat-sync.md`，本文件仅保留 `beatF`/`SHOTS`/`localBeat` 的 Remotion 落拍写法。（原 125 行 → 薄适配层）
final-review.md: 独立审查成片的输入与验收清单。（纯 App 契约，未动）
effects.md: 内置背景、文字和镜头效果的选择规则。（纯 App 契约，未动）
captions.md: 薄适配层 — 决策规则见 `service/skills/recut-directing-captions`，本文件仅保留 `palette.captionTheme`/`buildCaptionsData`/`CaptionTheme` 的 Remotion 写法与主题选型表。（原 46 行 → 薄适配层）
gpu-composition.md: Three-first GPU 合成的架构契约（world surface、camera、screen layer 与材质边界）。（纯 App 契约，未动）

依赖边界
`SKILL.md` 只按任务读取本目录资料；成片结构、场景原语、组件、材质和实际导出路径都以 `@recut/remotion-kit` 与其 `catalog.json` 为单一真相源。涉及镜头表达时，先读 `shot-recipes/camera/README.md` 的 Shot Language v3，再选 `catalog.json.effects` 内 `engine="three-camera"` 的已验证 preset；不要从效果名或 CSS 参数反推镜头。薄适配层文件的决策规则权威来源为 `service/skills/recut-directing-*`，本目录仅保留 remotion-studio 介质映射，文件名与路径保持不变以不断链。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
