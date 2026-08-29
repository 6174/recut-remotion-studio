# captions — remotion-studio 介质映射（薄适配层）

> 决策规则权威来源：`service/skills/recut-directing-captions`；本文件仅保留 remotion-studio 介质映射
>
> 本文件是 remotion-studio 对全局 `recut-directing-captions` 的薄适配层。字幕层级、安全区、强调词、平台样式的**决策规则**以全局为准；本文件只保留"如何在 Remotion/composition 代码中落字幕"的介质映射。

## 权威来源

- **决策规则**：`service/skills/recut-directing-captions/SKILL.md`（层级/安全区/强调词/平台速查）+ `references/captions.md`（合并版，含字幕轨纪律与主题选型的权威原文）+ `references/kinetic-captions-zh.md`（动能强调语法）。
- **本文件**：仅保留 `palette.captionTheme` / `buildCaptionsData` / `CaptionTheme` 的 Remotion 写法与主题选型表。

## Remotion 落法（本介质唯一合法表达）

用户选择主题后，把它写进 `palette.captionTheme`（`ProjectVideo.resolvePalette` 会传给 `CaptionTheme`）。组件源码以冻结副本形式存在 `workspace/remotion-kit/src/captions/`（旧项目为 `workspace/src/captions/`），通过 `@recut/remotion-kit` 复用；目录与版本读 `{paths.appKitPath}/catalog.json`，最新规范用原生文件工具读 `{paths.appKitPath}/src/`。

`ProjectVideo` 已用 `<CaptionTheme data theme primaryColor secondaryColor fontSize />` 渲染全片逐词字幕，默认设置：

- `palette.captionTheme` —— 主题 id（下表）
- `palette.captionPrimary` / `palette.captionSecondary` —— 主色 / 高亮色
- 旁白文案放在 content scene 的 `narration`，`buildCaptionsData(narration, sceneStartSec, sceneDurationSec)` 自动生成逐词时间轴（确定性，由 frame 派生）

可绕过模板直接用：

```tsx
import { CaptionTheme, buildCaptionsData } from "@recut/remotion-kit";
const data = buildCaptionsData("这句话会成为字幕。", sceneStartSec, sceneDurationSec);
<CaptionTheme data={data} theme="pop" primaryColor="#ffffff" secondaryColor="#ffd700" fontSize={64} />
```

## 主题表（Remotion 侧增量，保留原表）

| id | 风格 | 说明 |
|---|---|---|
| `pop` | Pop 弹入 | 缩放弹入，清爽通用 |
| `karaoke` | Karaoke 扫光 | 逐词高亮扫过，适合歌词式字幕 |
| `kinetic-01` | Kinetic 动能排版 | 主词放大、侧词对齐的动能排版 |
| `kinetic-02` | Kinetic 变体 | 动能排版第二套 |
| `hustle` | Hustle 快节奏 | 快速进入，活力十足 |
| `grape` | Grape 倾斜强调 | 无底框的倾斜强调字幕 |
| `beast` | Beast 粗体高对比 | 粗体加高对比阴影 |
| `poppin` | Poppin 大写字幕 | 全大写 Poppins 字体 |
| `aarit` | Aarit 逐字缩放 | 电影感逐字缩放与渐变扫光 |
| `soft-ai` | Soft AI 柔焦 | 无底框的柔焦浮现 |
| `gaming-stream` | Gaming 霓虹 | 霓虹发光游戏风格 |
| `simple-one-word` | 单字聚焦 | 每次只高亮一个词 |
| `podcast` | Podcast 播客 | 播客风格的段落字幕 |

选择建议：信息型解说用 `pop`/`simple-one-word`/`kinetic-01`；歌词/金句用 `karaoke`/`aarit`；娱乐/游戏用 `hustle`/`poppin`/`gaming-stream`/`grape`；高端/冷静用 `beast`/`soft-ai`/`podcast`。

> 主题内置字体（Outfit/Poppins 等）未随工程打包，离线时回退系统无衬线；如需固定观感，在 `palette.fontFamily` 指定可用字体。字幕主题与整片色板要自洽——克制的模板不混入不相干的亮色（全局 captions 平台速查表的介质中性要求）。

## 与全局的衔接

- 字幕轨纪律（共享样式、最高层、无底框、一条一信息、480px 验收、字号阶梯）与强调词"一屏一强调、手法三选一"的**判断**以全局为准，本文件不重复其散文。
- 动能强调的时序与缝线字幕版式需动效语法时，按需加载全局 `references/kinetic-captions-zh.md`。
- 字幕落位与安全区数值（竖幅左右 6% bleed、上下 4%）以全局 SKILL.md §1 为准；Remotion 侧由轨道锚点自动计算，不手写坐标。
