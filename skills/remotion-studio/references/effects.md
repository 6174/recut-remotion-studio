# 表达特效目录（复用自 reactvideoeditor.com/remotion-templates）

> 用户从下面选择想要的效果，你把它写进 `workspace/` 的 composition 代码。**全部 81 个模板组件是 seed 时从 `@recut/remotion-kit` 整包拷贝进 `workspace/remotion-kit/` 的冻结副本**（含 `README.md` 目录表），项目直接复用副本或按需复制，不要从零手写动画。组件规范源在 `packages/remotion-kit/src/components/`（版本见 `{paths.appKitPath}/package.json`）。全部确定性渲染（无 Math.random/Date.now）；含 CSS 动画/`<style jsx>`/随机数的模板复制后必须先改成 frame 驱动。

## 背景特效（全屏背景，`@recut/remotion-kit` 的 `BackgroundFX`，源自 `workspace/remotion-kit/src/effects/registry.tsx`）

用 `palette.effectId` 指定（ProjectVideo 的 `resolvePalette` 会把它传给 `BackgroundFX`）：

| effectId | 效果 | 说明 |
|---|---|---|
| `starfield` | 星空粒子 | 粒子从中心向外扩散（cinematic-dark 默认） |
| `geometric` | 几何图案 | 旋转缩放的描边几何形（clean-editorial 默认） |
| `bokeh` | 光斑 | 漂浮柔和的圆形光斑 |
| `liquid-wave` | 液态波浪 | 流动的液态波浪背景 |
| `gradient-shift` | 渐变流动 | 缓慢旋转的渐变色彩（vibrant-tech 默认） |
| `matrix-rain` | 数字雨 | 矩阵字符下落 |
| `noise-grain` | 胶片颗粒 | 细微颗粒叠加层，配纸拼贴风 |

背景色仍由 `palette.background` 控制（`BackgroundFX` 会叠加一层调色覆盖），特效只提供动感。

## 文字特效（标题/字幕层，`@recut/remotion-kit` 的 `TextFX`）

用 scene 的 `effectId` 指定（`ProjectVideo.SceneLayer` 会在 title/outro 或 content 上渲染它），组件接受 `{ text, subtitle?, palette }`：

| effectId | 效果 | 说明 |
|---|---|---|
| `cinematic-title` | 电影开场字 | 大写字距拉开 + 下划线 + 副标题 |
| `bounce-text` | 弹跳文字 | 渐变卡片内逐字弹跳入场 |
| `typewriter` | 打字机 | 逐字打出 + 闪烁光标 |
| `glitch` | 故障文字 | RGB 分离 + 位置抖动 |
| `slide-text` | 滑入文字 | 从右滑入标题 |
| `lower-third` | 记者条 | 左下角人名/小标题条 |

## 镜头运动（图片场景，`@recut/remotion-kit` 的 `useImageMotion`）

有 `imageAssetId` 的 scene 默认 `push-in`（缓慢推近）。可换 `pan-left`（横向缓慢平移）。要更复杂的运镜，用 Remotion 的 `interpolate` + frame 自己写，遵守 directing.md 的运镜安全集。

## 版本感知与按需升级

项目内的组件副本在 seed 时按当时 kit 版本冻结；app 迭代不会改历史项目。当用户明确选择了更新版本：

1. 读 `workspace/.recut-workspace` 看项目冻结版本，读 `{paths.appKitPath}/catalog.json` 看最新目录与版本；
2. 只对被选中的组件做升级：用原生文件工具读 app 包最新源码 `paths.appKitPath/src/<kitPath>`，写入覆盖 `workspace/remotion-kit/src/<workspacePath>`（`workspacePath`）；
3. 升级是用户选择的**有意变更**，只动那一个组件，其余保持冻结；升级后要在交付说明里告知用户该组件版本已提升。

## 扩展方式（全库复用）

1. 直接看 `workspace/remotion-kit/src/components/README.md` 的分类目录（Charts / Text / Content Animation / Transitions / Effects / Logos / Social / Camera / Layout / 等），选中想要的单文件模板；
2. 用原生文件工具读 `workspace/remotion-kit/src/components/<name>.tsx`（最新规范源在 `paths.appKitPath/src/`），把它复制/改写进你的成片代码或 `src/compositions/` 下的子组件；
3. 若它含 CSS 动画/`<style jsx>`/`Math.random`，改写为 frame 驱动（用 `useCurrentFrame`/`interpolate`/`spring`），保持确定性；
4. 需要文字/颜色参数化时，按 `@recut/remotion-kit` `TextFX` 的方式接受 `{ text, subtitle?, palette }`；
5. 保持原头注释（Credit）。

原则：一种动画手法全片只当一次主角；拿不准时优先用目录里已调校的组件，而不是新写。
