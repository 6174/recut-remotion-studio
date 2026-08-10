# composition-graph/

> **状态**：dev fixture（实验台）。生产合成已统一到 `@recut/remotion-kit/three` + `@recut/remotion-kit/materials`；本目录保留为回归采样与材料移植来源。

> L2 | 父级: /apps/remotion-studio/remotion-skeleton/src/README.md

成员清单
graph.ts: Composition Node 的声明式图模型，定义 root、HTML、media 与 effect 节点。
timeline.ts: 120 秒实验片的纯时序表，定义 24 个五秒 shot ID 和基于 Remotion frame 的镜头选择。
shots/: 镜头叙事层；每个独立 React scene 自行定义内容和构图，registry 为需聚焦的镜头声明 lens、扫描距离与出现时点。
html-texture.ts: SVG foreignObject 基线 adapter；将章节化 HTML/CSS 光栅化为 GPU 纹理，每个 Remotion frame 重建一次并回报耗时。
html-in-canvas-texture.ts: HTML-in-Canvas 对照 adapter；支持时以 `layoutSubtree` canvas 的 `paint -> drawElementImage(DIV)` 捕获真实 DOM subtree，首帧读回 HTML sentinel 像素后才上报 verified 和耗时；不支持时明确上报 unavailable。
magnify-material.tsx: CanvasUI Magnify 原始像素光学模型的 Three adapter，保留 8 向 ticks、crosshair、bracket、haze、AA 与色散，只适配全屏 texture UV。
glass-material.tsx: CanvasUI Glass 原始 SDF 光学模型的 Three adapter，保留 rounded-SDF、rim normal、六波长折射、fresnel 与 GGX 反射，只适配全屏 source-plane 混合。
glitch-material.tsx: CanvasUI Glitch 的确定性 shader adapter，在 HTML texture 内完成 tearing、RGB split 与噪声 burst。
clouds-material.tsx: CanvasUI Clouds 的无历史帧 fBm 雾场 adapter，作为环境 GPU effect node。
crt-material.tsx: 参考 html-in-canvas/Crt/gl.ts 的 barrel、scanline、RGB aperture、vignette 与 flicker Three adapter。
vintage-material.tsx: 参考 html-in-canvas/Vintage/gl.ts 的 gate weave、grain、scratch、dust、light leak 与 faded print Three adapter。
article-highlight-material.tsx: 参考 html-in-canvas/ArticleHighlight/gl.ts 的 9x9 progressive Gaussian blur Three adapter；高亮内容仍由独立 shot React 组件绘制。
store-peel-material.tsx: 参考 html-in-canvas/CubeTransitionCard 与 Bonus/PeelSticker 的 cylinder curl、back paper 与 moving shine Three adapter。
reference/remotion-html-in-canvas/: 上游 html-in-canvas 四个案例源码快照；StorePeel 对应 CubeTransitionCard，并由 SaleStickerComposition 提供卷页核心。
bubble-material.tsx: CanvasUI Bubble 原始 metaball trail ray-march adapter，保留 smooth-min、三通道折射、iridescence 与动态 glints；轨迹由 Remotion time 重建。
bend-material.tsx: CanvasUI Bend 的 Three plane 卷曲 adapter，作为时间轴章节的页片转场 effect。
scene.tsx: 120 秒全 Three 技术验证场景；全幅 HTML texture、媒体 texture 与 CanvasUI effect plane 构成每个可 seek 镜头，Magnify lens 仅由 Remotion shot progress 决定扫描路径。
composition.tsx: Remotion 与 ThreeCanvas 的运行时桥接，定义统一 GPU composition 根和 demand render 策略。
entry.tsx: `composition-graph.html` 的独立 Vite 入口，承载实验 Player、capture adapter 切换与 HIC / foreignObject 的稳定性能采样。
style.css: 实验页面局部样式，不影响正式预览页。

依赖边界

`entry.tsx` -> `composition.tsx` -> `scene.tsx` -> (`html-texture.ts` | `html-in-canvas-texture.ts`)；`timeline.ts` 只为整支实验片选择 24 个等长、可 seek 的 shot ID，`shots/scenes.tsx` 的 registry 决定每个镜头的内容、effect、lens 锚点、扫描距离、出现时点与少量章节转场。`scene.tsx` 仅在目标内容的入场完成后，将 lens descriptor 与 shot progress 合成为确定性扫描路径。可见 composition frame 只由 R3F/Three nodes 绘制：HTML 在不可见 host 中经 HIC（或在 HIC 未获得 sentinel proof 时回退的 foreignObject）变为 `CanvasTexture`，四个上游 effect adapter 只消费 texture/uniform，不增加独立时钟或每帧 shader 重建。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
