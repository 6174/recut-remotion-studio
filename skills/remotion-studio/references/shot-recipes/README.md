# shot-recipes/ — remotion-studio 介质映射（薄适配层）

> 决策规则权威来源：`service/skills/recut-directing-shot`；本目录仅保留 remotion-studio 介质映射
>
> 本目录是 remotion-studio 对全局 `recut-directing-shot` 的薄适配层。镜头动词、景别/角度/焦段/调度、分镜连续性、首尾帧合同的**决策规则**以全局 `service/skills/recut-directing-shot/SKILL.md` 及其 `references/`（`cinematic-language`/`blocking-and-staging`/`continuity-bible`/`prompt-lexicon`/`shot-library`）为准；本目录仅保留"意图 + Remotion 实现要点"。

## 全局化说明

- **通用镜头语法**（功能先于尺寸、一镜一动作、轴线守恒、首尾帧即合同、可生成性预算、光位世界坐标、纵深优先）已收敛至全局 `recut-directing-shot`；本目录不再重复其散文规则。
- **动效嗓音与节奏**（时长/过冲/squash、5 秒节拍、落定呼吸）归 `recut-directing-motion` / `recut-directing-editing`；卡点落拍归 `recut-directing-editing` 的 `music-beat-sync`。
- **本目录的职责**：每个配方文件仅保留"镜头意图 + Remotion 实现要点"（`ShotDescriptor`/`SurfaceMoveDescriptor`/`catalog.json` preset 选择、`interpolate`/`spring`/`useCurrentFrame` 写法、已知风险与排他项），供直接写入 `src/compositions/ProjectVideo.tsx`。
- **逐文件改动说明**：本目录下 100+ 配方文件数量庞大，已在各文件头追加指向全局的路由注记，保留原有代码级实现段落，删除与全局重复的散文规则段落需后续按需增量瘦身；新增配方一律按"意图 + Remotion 实现要点"编写，不再写入通用镜头决策散文。

## 权威来源路由表

| 决策问题 | 权威来源 | 本目录保留 |
|---|---|---|
| 一个镜头怎么拍（动词/景别/运动/调度） | `service/skills/recut-directing-shot/SKILL.md` + `references/cinematic-language.md` 等 | 意图 → `ShotDescriptor.camera`/`surface`/`Subject.anchor`/`attention`/`transition` 的 Remotion 写法 |
| 元素怎么动、落定呼吸、高光纪律 | `service/skills/recut-directing-motion` | 嗓音 tokens → `interpolate`/`spring`/`durationInFrames`/`hold` 的帧级映射 |
| 怎么剪、卡点、转场选型 | `service/skills/recut-directing-editing` | 节拍 → `SHOTS`/`beatF` 边界，转场消耗时长算术 |
| 声音钉帧 | `service/skills/recut-directing-sound` + `../sound-design.md` 薄适配层 | 相对钉帧 `SHOTS.x.from+offset` / `beatF(n)`，`durationInFrames` 截断 |

## 成员清单（介质映射）

camera/: Shot Language v3 的 camera、surface、attention 配方；所有 Three/镜头任务先读 `camera/README.md`，再按需读取具体配方。通用语法以全局 `recut-directing-shot` 为准，本目录 README 为 Remotion preset 选择与 `ShotGraph` 组合管线。
data/: 数据、图表与数字信息的 Remotion 动态写法（数字滚动/图表生长/粒子填充，`interpolate` 驱动，落位 hold）。
effects/: 光效、构图反馈与图形强调的 Remotion 材质/注意力写法（`spotlight`/`glow`/`riser`/`impact` 等，互斥纪律见全局 motion）。
interaction/: 输入、光标、筛选与界面状态的帧驱动配方（`resolveInteractionState`/`InteractionScript` 同帧栅格化，禁止真实 pointer 回放）。
opening/: 片头钩子与品牌建立的 Remotion 入场写法。
outro/: 收束、品牌落版与结尾的 Remotion 写法（"发布会合影"四方飞入、crane 能量峰值）。
rhythm/: 卡点、批量运动与节奏中断的 Remotion 写法（`beatF` 边界、加速阶梯、呼吸镜）。
transition/: 镜头之间转场的 Remotion 写法（`transition` descriptor，`flip`/`peel`/`cross-zoom` 需前后两纹理）。
typography/: 标题、文字与排版动效的 Remotion 写法（打字机/描边/翻页/拼装，落定持留，一次只强调一行）。
ui-entrance/: 页面、卡片和界面元素的 Remotion 入场写法（骨架→内容、卡片瀑布，落点为布局真实槽位）。

## 依赖边界

每张卡只描述动作意图、Remotion 实现要点（`ShotDescriptor`/`surface`/`attention`/`catalog.json` preset/`interpolate`/`spring` 时值）、构图约束与已知风险；实现时读取对应场景的 `primitives.tsx`、`@recut/remotion-kit/components` 或 `catalog.json` 中的现有能力，不把配方当作第二套组件库。通用镜头决策散文以 `service/skills/recut-directing-shot` 为准。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
