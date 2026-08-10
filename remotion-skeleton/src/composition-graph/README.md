# composition-graph/

> L2 | 父级: /apps/remotion-studio/remotion-skeleton/src/README.md

成员清单
graph.ts: Composition Node 的声明式图模型，定义 root、HTML、media、AI object 与 effect 节点。
html-texture.ts: SVG foreignObject 基线 adapter；将 HTML/CSS 光栅化为 GPU 纹理，每 2 个 Remotion frame 重建一次并回报耗时。
html-in-canvas-texture.ts: HTML-in-Canvas 对照 adapter；支持时以 `layoutSubtree` canvas 的 `paint -> drawElementImage(DIV)` 捕获真实 DOM subtree，读回 HTML sentinel 像素后才上报 verified 和耗时；不支持时明确上报 unavailable。
magnify-material.tsx: CanvasUI Magnify 光学语言的独立 shader adapter，在 HTML texture 内完成局部 zoom、色散和 HUD reticle；镜头外早退为单次 base texture 读取。
scene.tsx: R3F 场景适配器；同帧组合 HTML texture、动态图像 texture、AI mesh、粒子与性能探针，所有动画只由 Remotion frame/fps 推导，R3F 仅按 invalidate 渲染。
composition.tsx: Remotion 与 ThreeCanvas 的运行时桥接，定义统一 GPU composition 根和 demand render 策略。
entry.tsx: `composition-graph.html` 的独立控制面，承载 Player、图检查器、HTML 动画开关、capture 选择器和固定宽度的双 adapter benchmark（最新值、滚动均值、P95、90 个样本、HIC verified proof）。
style.css: 实验页面局部样式，不影响正式预览页。

依赖边界

`entry.tsx` -> `composition.tsx` -> `scene.tsx` -> (`html-texture.ts` | `html-in-canvas-texture.ts`)，`scene.tsx` -> `magnify-material.tsx`；`graph.ts` 只被控制面读取。两种 adapter 使用同一内容、尺寸、帧采样和材质，便于直接对比 capture 成本。所有画面状态由 Remotion 当前帧派生，R3F 的 `useFrame` 只采样性能，`frameloop="demand"` 由 Remotion frame 显式失效渲染。Magnify 只消费同一 texture，不增加全场景 render pass。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
