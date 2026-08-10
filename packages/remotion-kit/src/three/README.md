# three/ — Three-first GPU 合成运行时桥

> Three-first GPU 合成的第 ②③ 层：统一 GPU 根 + 内容纹理表面 + 镜头声明式模型。成片与空白项目共用同一个 GPU 根（`ShotGraph` 内含 `ThreeVideoCanvas`）；HTML 内容在真实 React 树内渲染并光栅化为 `CanvasTexture`，画面空间、转场、特效全部由 Three 场景图完成。

## 目录

| 文件 | 职责 |
| --- | --- |
| `ThreeVideoCanvas.tsx` | 统一 GPU 根：`@remotion/three` ThreeCanvas + demand frameloop + high-performance GPU |
| `HtmlSurface.tsx` | 双 adapter 内容纹理：`HtmlSurfaceProvider`（真实树渲染 + HIC 捕获）/ `HtmlSurfacePlane`（R3F 平面）；foreignObject 备 |
| `MediaTexture.tsx` | 静态图片 → CanvasTexture（`useImageTexture`）与媒体证据平面（`MediaPlane`） |
| `ShotGraph.tsx` | 镜头声明式模型装配：内容 + 效果/转场材质 + 环境材质 + 扫描镜头 |
| `timing.ts` | `RemotionFrameInvalidator`（帧变即 invalidate）与 `seekSmooth` 缓动 |
| `types.ts` | `ShotDescriptor` / `ShotGraphPlan` / `shotAt` 纯函数 |

## 使用

```tsx
import { ShotGraph } from "@recut/remotion-kit/three";

const plan: ShotGraphPlan = {
  durationInFrames: 30 * 30,
  shots: [
    { id: "hook", content: "html", effect: "vintage" },
    { id: "metric", content: "html", effect: "magnify", lens: { anchor: [0.5, 0.34], start: 0.1, travel: 0.42 } },
    { id: "cta", content: "both", effect: "clean", transition: { material: "bend", durationFrames: 24 }, ambient: "clouds" },
  ],
};

export const MyVideo = () => (
  <ShotGraph
    background="#08131f"
    plan={plan}
    renderContent={(shot) => <MetricScene id={shot.id} />}
    renderMedia={(shot) => <MediaPlane src={resolveMediaUrl(assetId)} planeWidth={3} planeHeight={1.7} />}
  />
);
```

## 内容表面契约

- **内容渲染在真实 React 树内**（`HtmlSurfaceProvider` 的 layoutSubtree canvas 子节点），Remotion hooks 可用。
- `ShotGraph` 会把内容包进 `<Sequence from={shot.start}>`，因此内容内部用 `useCurrentFrame()` 取到的是**镜头局部帧**；需要局部帧的组件（如 `DigitRoll`）可直接使用。
- HTML-in-Canvas 不支持时**回退 foreignObject**（序列化已渲染内容的 innerHTML）；两者都不可用时纹理保持空白。
- 服务端导出走 ANGLE；无 GPU 环境用 `RECUT_REMOTION_GL=swangle` 诊断。

## 与 materials 的关系

`ShotGraph` 通过 `MaterialElement`（materials 模块）按 id 挂材质；镜头 descriptor 只声明 `effect`/`transition`/`ambient` 的材质 id 与语义参数，不写任何 GLSL。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
