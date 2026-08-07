# 字幕主题目录（复用自 vshukla7/remotion-captions-themes，MIT）

> 用户选择主题后，把它写进 `palette.captionTheme`（`ProjectVideo.resolvePalette` 会传给 `CaptionTheme`）。组件源码以冻结副本形式存在 `workspace/remotion-kit/src/captions/`（新项目；旧项目为 `workspace/src/captions/`），直接 `import { CaptionTheme, buildCaptionsData } from "@recut/remotion-kit"` 复用；目录与版本读 `{paths.appKitPath}/catalog.json`，最新规范源用原生文件工具读 `paths.appKitPath/src/`。

## 用法

`ProjectVideo` 已经用 `<CaptionTheme data theme primaryColor secondaryColor fontSize />` 渲染全片逐词字幕，你只需设置：

- `palette.captionTheme` —— 主题 id（下表）；
- `palette.captionPrimary` / `palette.captionSecondary` —— 字幕主色 / 高亮色；
- 旁白文案放在 content scene 的 `narration`，`buildCaptionsData(narration, sceneStart, sceneDuration)` 自动生成逐词时间轴（确定性，由 frame 派生）。

也可以绕过模板直接用：

```tsx
import { CaptionTheme, buildCaptionsData } from "../captions";
const data = buildCaptionsData("这句话会成为字幕。", sceneStartSec, sceneDurationSec);
<CaptionTheme data={data} theme="pop" primaryColor="#ffffff" secondaryColor="#ffd700" fontSize={64} />
```

## 主题表

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

## 选择建议

- 信息型解说：`pop`、`simple-one-word`、`kinetic-01`
- 歌词 / 金句：`karaoke`、`aarit`
- 娱乐 / 游戏 / 社交媒体：`hustle`、`poppin`、`gaming-stream`、`grape`
- 高端 / 冷静：`beast`、`soft-ai`、`podcast`

主题内置字体（Outfit/Poppins 等）未随工程打包，离线时回退系统无衬线；如需固定观感，可在 `palette.fontFamily` 指定可用字体。字幕主题与整片色板要自洽——克制的模板不要混入不相干的亮色。
