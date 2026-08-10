# html-canvas/ — HTML-in-Canvas 交互 overlay 层

> **定位更新**：Three-first GPU 合成（`src/three/` + `src/materials/`）是默认架构。本模块的职责收窄为**帧驱动互动脚本与交互 overlay**（cursor/focus/text-selection 的语义状态推导与几何），像素特效（bubble/magnify/glitch）已迁入 `src/materials/`，`GpuCompositor` 与 `HtmlCanvasVideoStage` 的 GPU pass **已退役**：不再作为成片路径使用，仅保留类型与推导函数供 GPU 内容表面复用（`resolveInteractionState` 等）。
>
> 目标：把 HTML-in-Canvas 设为 Remotion Studio 的浏览器硬能力，并给「互动引导」提供逐帧确定性、预览/导出一致的帧驱动语义状态桥。

## 关键约定

- **坐标**一律使用 composition 设计像素；禁止 `getBoundingClientRect()`、CSS selector 扫描或 DOM layout 读回作为真相源。
- **时间**一律使用帧；禁止 `Date.now()`、`Math.random()`、`requestAnimationFrame()`、真实 pointer 事件进入画面。
- **唯一舞台**：整支视频只有一个 `HtmlCanvasVideoStage`；它逐行采用 Remotion `HtmlInCanvasPresentation` 的单输入 capture 结构：`canvas.layoutSubtree → paint → captureElementImage(firstChild) → OffscreenCanvas 2D drawElementImage`。capture 成功时才 `GpuCompositor.upload(source)`；每个 Remotion frame 只做 `render(frame)`。因此指针轨迹、光学折射与 glitch seed 不会触发 DOM capture 或 `texImage2D`。捕获根内必须直接是 `InteractionProvider → 场景内容`，禁止额外的绝对定位 wrapper 破坏 Chromium 的 paint record。场景 HTML 有逐帧视觉变化时必须显式传入 `sourceVersion`；场景/beat 组件绝不自行创建 `<HtmlInCanvas>`。
- **硬门禁**：`BrowserCapabilityGate` / `requireHtmlInCanvas()` 只允许或阻断，不返回 fallback；准入唯一来自 Remotion 的 `HtmlInCanvas.isSupported()`。诊断会指出平台是否缺少 Recut 自有 Origin Trial 或 `CanvasDrawElement` feature，但这些信息绝不形成第二套准入逻辑。
- **平台契约**：CanvasUI 在 `canvasui.dev` 通过它自己的 HTMLInCanvas Origin Trial 工作；token 与 origin 绑定，不能复制到 Recut。项目 Vite 预览使用动态 localhost 端口，正式开发/桌面预览必须由宿主 Chromium 启动 `CanvasDrawElement`，而不是要求用户手动打开 Chrome flag。

## 模块

| 文件 | 职责 |
| --- | --- |
| `types.ts` | 公共契约：`Rect`/`FocusTarget`/`EffectTiming`/`InteractionEvent`/`EffectClip`/`StagePlan` |
| `timeline.ts` | 帧 → 归一化进度 / 效果生命周期（enter → play → exit）的纯函数 |
| `targets.ts` | 矩形/圆形/路径 target 的纯几何函数 |
| `interaction.ts` | 帧驱动互动状态推导（move/hover/click/drag/scroll） |
| `InteractionScript.tsx` | 语义 UI 状态桥：`InteractionProvider` / `useInteraction()` |
| `EffectTimeline.tsx` | `resolveActiveEffects(plan, frame)`：解析局部生命周期与全局层级轨 |
| `BrowserCapabilityGate.tsx` | 浏览器硬门禁与能力探针 |
| `HtmlCanvasVideoStage.tsx` | 唯一 capture 面（**已退役**；成片改走 `three/HtmlSurface`，本组件仅存档） |
| `GpuCompositor.ts` | 单 pass GPU 合成器（**已退役**；bubble/magnify/glitch 迁入 `materials/`） |
| `EffectOverlay.tsx` | Cursor/Focus/Text/Ambient 的独立透明 2D 引导层（GPU 路径下交互 overlay 改由 `_shared/GpuSceneEngine` 的内容表面绘制） |
| `CanvasEffect.tsx` / `registry.ts` | CPU overlay layer 适配边界与效果元数据注册表 |
| `effects/*` | CursorDirector / FocusSpotlight / TextSelection / Ambient overlay；Magnifier 仅保留元数据，实际由 GPU pass 执行 |
| `demos/product-ui-demo.tsx` | click → focus 的产品 UI 叙事实例，仅用于产品界面类镜头 |
| `demos/effect-fixtures.tsx` | Bubble 流体编辑画、Magnify 扫描仪、Glitch 信号、阅读镜头的专属 fixture dispatcher |

## StagePlan 用法

```tsx
import { HtmlCanvasVideoStage } from "@recut/remotion-kit/html-canvas";

const stagePlan: StagePlan = {
  interaction: [
    { kind: "move", frame: 20, x: 960, y: 900 },
    { kind: "move", frame: 45, x: 1265, y: 857, easing: "easeInOut" },
    { kind: "hover", frame: 55, targetId: "export-button" },
    { kind: "click", frame: 70, targetId: "export-button" },
  ],
  targets: {
    "export-button": { kind: "rect", rect: { x: 1210, y: 830, width: 110, height: 54 }, radius: 12 },
  },
  effects: [
    { id: "cursor", scope: "video", effect: "cursor", timing: { startFrame: 12, enterFrames: 6, holdFrames: 150, exitFrames: 12 }, zIndex: 30 },
    { id: "focus", scope: "scene", effect: "focus-spotlight", targetId: "export-button", timing: { startFrame: 66, enterFrames: 20, holdFrames: 60, exitFrames: 16 }, options: { dim: 0.74 }, zIndex: 10 },
  ],
};

export const MyVideo = () => (
  <HtmlCanvasVideoStage plan={stagePlan} sourceVersion={articleRevision}>
    <MyUi /> {/* 场景组件用 useInteraction() 读语义状态 */}
  </HtmlCanvasVideoStage>
);
```

## 场景模板内置用例

三个场景模板自带可开关的 StagePlan（`stagePlan` prop：`undefined` = 启用内置用例，`null` = 关闭）：

| 场景 | 用例 |
| --- | --- |
| `ProductLaunchVideo`（product-launch） | 两处 click → magnify：光标点开 metric 数据时刻，放大镜揭示数字 |
| `FacelessExplainerVideo`（faceless-explainer） | hover → selection：光标悬停 concept 大主张，荧光 marker 逐词揭示；data 时刻 click → focus |
| `DoodleExplainerVideo`（doodle-explainer） | conclusion focus + ambient 纸感 grain |

## 当前基线

当前 source 基线已通过，运行时是严格的三层结构：source capture、一个 GPU pixel pass 与轻量 2D overlay。`upload()` 只在初次画面、语义 UI 状态或 `sourceVersion` 改变时运行；mipmap 同样只在 upload 生成；其它 frame 只有一次全屏 WebGL draw，没有 FBO、纹理 ping-pong 或 rAF。Bubble 以固定帧步从 clip 起点重建惯性头部和 24 点尾迹，因此随机 seek 与并发导出仍得到相同液滴；随后执行平滑 3D SDF、带 LOD frost 的折射/色散/菲涅耳边缘。Magnify 使用 texture lens 与 HUD；Glitch 用显式 `bursts: [{ startFrame, durationFrames, seed }]` 做确定性切片/RGB split。PageTurn/Peel 始终由 root-level Transition adapter 接收 A/B 纹理，普通单输入 fixture 明确拒绝伪实现。

模板自身创建**唯一**捕获面；骨架 `ProjectVideo` 只透传 `stagePlan`，绝不二次包裹。

## 测试

```sh
node --import ./scripts/ts-resolve-hooks.mjs scripts/html-canvas-tests.mjs
```

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
