# 表达特效目录（复用自 reactvideoeditor.com/remotion-templates）

> 用户从下面选择想要的效果，你把它写进 `workspace/` 的 composition 代码。**全部 81 个模板组件已拷贝到 `workspace/src/components/remotion-templates/`**（含 `README.md` 目录表），下面是被封装可直接用的子集。组件源码在工程里，直接复用或按需复制，不要从零手写动画。全部确定性渲染（无 Math.random/Date.now）；含 CSS 动画/`<style jsx>`/随机数的模板复制后必须先改成 frame 驱动。

## 背景特效（全屏背景，`workspace/src/effects/registry.tsx` 的 `BackgroundFX`）

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

## 文字特效（标题/字幕层，`workspace/src/effects/text.tsx` 的 `TextFX`）

用 scene 的 `effectId` 指定（`ProjectVideo.SceneLayer` 会在 title/outro 或 content 上渲染它），组件接受 `{ text, subtitle?, palette }`：

| effectId | 效果 | 说明 |
|---|---|---|
| `cinematic-title` | 电影开场字 | 大写字距拉开 + 下划线 + 副标题 |
| `bounce-text` | 弹跳文字 | 渐变卡片内逐字弹跳入场 |
| `typewriter` | 打字机 | 逐字打出 + 闪烁光标 |
| `glitch` | 故障文字 | RGB 分离 + 位置抖动 |
| `slide-text` | 滑入文字 | 从右滑入标题 |
| `lower-third` | 记者条 | 左下角人名/小标题条 |

## 镜头运动（图片场景，`workspace/src/effects/registry.tsx` 的 `useImageMotion`）

有 `imageAssetId` 的 scene 默认 `push-in`（缓慢推近）。可换 `pan-left`（横向缓慢平移）。要更复杂的运镜，用 Remotion 的 `interpolate` + frame 自己写，遵守 directing.md 的运镜安全集。

## 扩展方式（全库复用）

1. 打开 `workspace/src/components/remotion-templates/README.md` 看全 81 个模板的分类目录（Charts / Text / Content Animation / Transitions / Effects / Logos / Social / Camera / Layout / 等），选中想要的单文件模板；
2. 用 `code.read` 读 `workspace/src/components/remotion-templates/<name>.tsx`，把它复制/改写进你的成片代码或 `workspace/src/compositions/` 下的子组件；
3. 若它含 CSS 动画/`<style jsx>`/`Math.random`，改写为 frame 驱动（用 `useCurrentFrame`/`interpolate`/`spring`），保持确定性；
4. 需要文字/颜色参数化时，按 `workspace/src/effects/text.tsx` 的方式接受 `{ text, subtitle?, palette }`；
5. 保持原头注释（Credit）。

原则：一种动画手法全片只当一次主角；拿不准时优先用目录里已调校的组件，而不是新写。
