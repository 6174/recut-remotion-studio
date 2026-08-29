# directing — remotion-studio 介质映射（薄适配层）

> 决策规则权威来源：`service/skills/recut-directing-*`；本文件仅保留 remotion-studio 介质映射
>
> 本文件是 remotion-studio 对全局导演技能的薄适配层。动效嗓音、节拍、镜头语法、呼吸与审美的**决策规则**以全局技能为准；本文件只回答"如何在 Remotion/composition 代码中实现这些决策"。

## 权威来源路由表

| 决策问题 | 权威来源 | 本文件保留内容 |
|---|---|---|
| 元素怎么动（嗓音两轴、入场时长/过冲/squash、落定呼吸） | `service/skills/recut-directing-motion/SKILL.md` + `references/aesthetic-rules.md` | 嗓音 tokens → Remotion interpolate/spring 映射（见 §1） |
| 片子怎么剪、5 秒节拍、卡点 | `service/skills/recut-directing-editing/SKILL.md` + `references/music-beat-sync.md` | 节拍 → `SHOTS` / `beatF` 帧边界（见 §2，详见 `music-beat-sync.md` 薄适配层） |
| 一个镜头怎么拍（景别/运动/调度/连续性） | `service/skills/recut-directing-shot/SKILL.md` + `references/*` | 镜头意图 → `ShotDescriptor` / `catalog.json` preset 选择（见 §3） |
| 字怎么上屏、声音怎么设计 | `service/skills/recut-directing-captions/SKILL.md`、`recut-directing-sound/SKILL.md` | 主题/色板 → `palette.captionTheme` / `buildCaptionsData`；SFX 钉帧见 `sound-design.md` |

通用镜头语法与配方细节请读 `service/skills/recut-directing-shot/SKILL.md`；本目录 `shot-recipes/` 每个配方文件仅保留"意图 + Remotion 实现要点"。

## 1. Remotion 动效嗓音映射（全局 tokens → 代码）

全局嗓音 tokens（能量×调性两轴、入场时长、曲线手感、过冲、squash）落到 Remotion 代码的固定映射：

- **时长**：全局"入场时长"直接取作 `durationInFrames`（如专业信赖 ~21f、精致高端 ~48f）；局部动作默认 24–32f 完成，后续 hold 见全局"落定呼吸"。
- **缓动**：全局预设的 `bezier` 值映射为 `interpolate(..., {easing})` 的 easing；对称 ease-in-out 用 Remotion `Easing.inOut`；需要回弹时 `y1>1` 的 bezier 必须可见。
- **弹簧**：拟物理落位用 `spring({frame, fps, config:{damping, stiffness}})`；damping/stiffness 由嗓音"过冲/squash"推导，不凭手感重调。
- **用法**：一套嗓音 tokens 同时管入场/转场/hold 节奏，全片统一；混用两套读作拼盘（见全局 motion S1）。

## 2. 结构：节拍到帧边界的唯一写法

全局"5 秒节拍、一镜一动作、落定呼吸"的节拍决策归 editing；Remotion 侧的唯一合法表达是帧边界与可读 hold：

```ts
// 卡点片用 beatF，非卡点片用固定帧；无论哪种，边界必须落在整数帧
export const SHOTS = {
  s0_open: { from: 0, to: 90 }, // ~3s @30fps
  s1_main: { from: 90, to: 240 },
};
```
- 每个 scene 只承载约 5 秒和一个主导运动；长视频增加 scene，不让单 scene >10s。
- 品牌字标 hold ≥1s（30f）、批量收尾 ≥0.5s；实现时在 `SHOTS` 后显式留 hold 帧，动效排满每一帧必返工。

## 3. 镜头表达：意图 → ShotDescriptor

镜头决策归全局 shot；Remotion 侧只保留"如何把意图写成 descriptor"：

- 需要 Three/3D/页面入镜/曲面/焦点/透镜时，先读 `shot-recipes/camera/README.md` 的 Shot Language v3，先写"意图→空间基底→camera→surface→主体→attention→节奏→排他项"，再选 `catalog.json` 中 `engine="three-camera"` 的 preset。
- `surface` 是被拍物（`shell`/`position`/`rotation`/`scale`/`bend`/`cornerCurl`），`camera` 是观看者；单平面可借真实 `PerspectiveCamera` 与 bend/curl 呈现空间感。
- 单镜头只选一个主 camera 动词与一个强光学主角（`magnify`/`glass`/`bubble` 互斥）；`flip`/`peel`/`cross-zoom` 是 A/B transition，消费前后两纹理。
- 主体用归一化 `Subject.anchor`，同时派生 `lookAt`/`focus`/`magnify` center；Y 轴转换由运行时统一处理。

## 4. 确定性渲染（硬性，Remotion 专属）

- 禁 `Math.random()` / `Date.now()` / 无参 `new Date()`；伪随机用固定种子（`mulberry32`/哈希，seed 从 index 派生）。
- 字幕时间轴由 `frame` 派生（`buildCaptionsData` 已保证），预览与成片逐帧一致。
- 改动只动目标 scene，改完交给用户逐帧评审。

## 5. 流水线入口

完整制作流程见 `production-workflow.md`，桥段见 `sequence-patterns/`，审美与声音的全局决策见 `service/skills/recut-directing-motion|editing|shot|captions|sound`，本文件不重复其散文规则。
