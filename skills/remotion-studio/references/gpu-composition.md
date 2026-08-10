# GPU 合成路径（Three-first）架构契约

> 这是 AI 在 Remotion Studio 里按 Three-first GPU 合成写代码的契约。方案文档见 `apps/remotion-studio/docs/gpu-composition-refactor.md`。核心思想：**HTML 排版是差异化资产，但只作为 GPU 纹理输入；画面空间、转场、特效全部由 Three 场景图完成。**

## 1. 何时走哪条路径

| 需求 | 路径 |
| --- | --- |
| 字幕、正文、布局、palette、静态背景（gradient/网格线） | **HTML surface**（`three/HtmlSurface`）——它们本来就在排版层 |
| 逐词/逐字动效、文字入场、marker、图表、手绘 | **HTML surface**（内容层），用帧驱动的 CSS/React 动效 |
| 放大镜、玻璃、glitch、CRT、胶片、气泡、高斯模糊 | **GPU material**（`materials/` post） |
| 页面卷曲、bend、擦除类转场 | **GPU material**（`materials/` transform） |
| 云、雾、粒子、星空的背景氛围 | **GPU material**（`materials/` ambient） |
| 光标、focus、文本 selection 交互引导 | **HTML surface 内的 React 层**（`html-canvas` 交互语义），与排版同帧栅格化 |

**判断原则**：一件事能由 HTML/CSS 排版表达，就留在内容层；只有需要「像素级后处理 / 3D 空间 / 顶点变形」才写 material。**不要在 material 里复刻排版，也不要在 HTML 里复刻特效。**

## 2. 四层结构（单向依赖）

```
① 内容层  真实 React 树内的镜头内容（Remotion hooks 可用；ShotGraph 用 <Sequence from={shot.start}> 提供镜头局部帧）
② 纹理层  HtmlSurfaceProvider：HTML-in-Canvas(主) / foreignObject(备) → CanvasTexture
③ 场景层  ShotGraph（ThreeVideoCanvas GPU 根）+ HtmlSurfacePlane（内容平面）
④ 特效层  MaterialElement：按材质 id + 语义参数挂载 post/transform/ambient 材质
```

## 3. 内容层契约

- 镜头内容由 `renderContent(shot)` 返回，运行在**真实 React 树**内；`ShotGraph` 把它包进 `<Sequence from={shot.start}>`，因此内部 `useCurrentFrame()` 取到的是**镜头局部帧**，组件（如 `DigitRoll`）可直接使用。
- 逐帧变化的内容依赖每帧重光栅（默认开启）；内容身份变化即触发 `requestPaint`。
- 交互引导（cursor/focus/text-selection）作为内容表面内的 React 层，目标几何由排版时产出（`InteractionScript`），效果只消费已知几何。

## 4. 镜头声明式模型（ShotGraph）

```ts
const plan: ShotGraphPlan = {
  durationInFrames: 30 * 30,
  shots: [
    { id: "hook", content: "html", effect: "vintage" },
    { id: "metric", content: "html", effect: "magnify",
      lens: { anchor: [0.5, 0.34], start: 0.1, travel: 0.42 },
      effectOptions: { zoom: 1.7 } },
    { id: "feature", content: "both", effect: "clean",
      transition: { material: "bend", durationFrames: 24 },
      ambient: "clouds", effectOptions: { opacity: 0.7 } },
  ],
};
```

- `content`：`html` / `media` / `both`。
- `effect`：post 或 ambient 材质 id；`clean`（不写）表示直贴纹理。
- `transition`：入场转场（transform 材质），在镜头前 `durationFrames` 帧内激活。
- `lens`：magnify/glass 等光学镜头的扫描锚点；中心由 shot progress 派生，**不要写死 center**。
- `effectOptions`：schema 里声明的语义参数；`resolveEffectOptions` 可按进度动态覆盖（如 opacity 淡入淡出）。
- `media`：`renderMedia` 返回 `MediaPlane`（有图贴纹理、无图占位色板）。

## 5. Material 编写契约（新增特效时必须遵守）

1. 组件放 `materials/<post|transform|ambient>/<name>-material.tsx`；命名 `<Prefix><Name>Material`。
2. 用 `useMaterialUniforms(build, update)`：`build` 建 uniform（只随 props 变），`update` 每帧写派生值。**禁止每帧 `new THREE.Uniform`、禁止重建 shader。**
3. 内容纹理统一 `uMap`；时间统一 `uTime`（`frame / fps`，`MaterialElement` 按传入 `fps` 派生，缺省 30）。
4. 只暴露 `schema` 里的语义参数（intensity/zoom/radius/…），不暴露 UV 细节；读取用 `materialOption(options, name, default)`。
5. 确定性：伪随机用固定 seed；突发效果用时间窗口（`mod(uTime, k)`）或显式 burst 表。禁止 `Math.random()` / `Date.now()` / `requestAnimationFrame()`。
6. 注册到 `materials/registry.ts` + `materials/schema.ts`，再在 `MaterialElement` 的 switch 里挂载。
7. 复用 `shared/glsl.ts` 的 `PASSTHROUGH_VERTEX` / `hash12` / `fbm2` / 数值工具。
8. 释放纪律：`useMaterialUniforms` 内 `texture.dispose()` 由 `HtmlSurface`/`useImageTexture` 负责；材质本身不持有外部纹理生命周期。

## 6. 常见陷阱

- **HTML 内容里用 Remotion hook** → 光栅化 host 拿不到 context；内容必须是 `(frame, fps) => ReactNode` 纯函数。
- **中心写死** → magnify/glass 必须走 `lens`，否则全片透镜不动。
- **material 每帧重建** → 性能雪崩；一切更新走 uniform。
- **转场和效果同时算** → ShotGraph 在 transition 窗口内只挂 transition 材质，效果材质在窗口外生效，不要两个都挂同一个 mesh。
- **手写十六进制** → 内容层用 palette/token；material 颜色参数走 schema。

## 7. 验证

- 预览与导出必须逐帧一致；`composition-graph.html` 保留为 dev fixture 做回归采样。
- 服务端导出走 ANGLE；无 GPU 用 `RECUT_REMOTION_GL=swangle` 诊断。

[PROTOCOL]: 变更时更新此头部，然后检查 SKILL.md
