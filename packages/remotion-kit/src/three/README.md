# three/ — Three-first GPU 合成运行时桥

> Three-first GPU 合成的第 ②③ 层：统一 GPU 根 + 内容纹理表面 + 镜头声明式模型。成片与空白项目共用同一个 GPU 根（`ShotGraph` 内含 `ThreeVideoCanvas`）；HTML 内容在真实 React 树内渲染并光栅化为 `CanvasTexture`，画面空间、转场、特效全部由 Three 场景图完成。

## 目录

| 文件 | 职责 |
| --- | --- |
| `ThreeVideoCanvas.tsx` | 统一 GPU 根：`@remotion/three` ThreeCanvas + demand frameloop + high-performance GPU |
| `CameraDirector.tsx` | Shot Language 的观看轨执行器：纯函数解析 keyframes，确定性驱动 Three PerspectiveCamera |
| `SurfaceMotion.ts` | Shot Language 的被拍物轨解析器：纯函数把表面位置、倾斜、缩放与 bend 曲率解析为逐帧 mesh 姿态 |
| `SurfaceShell.tsx` | 可替换内容外壳：当前提供有厚度的 Chrome 式 BrowserSurfaceShell；手机/设备模型沿同一 surface.shell 边界扩展 |
| `HtmlSurface.tsx` | 双 adapter 内容纹理：`HtmlSurfaceProvider`（真实树渲染 + HIC 捕获）/ `FrozenSurface`（一次性冻结捕获，A/B 转场输入 A）/ 带真实姿态与曲率的 `HtmlSurfacePlane`；foreignObject 备 |
| `MediaTexture.tsx` | 静态图片 → CanvasTexture（`useImageTexture`）与媒体证据平面（`MediaPlane`） |
| `ShotGraph.tsx` | 镜头声明式模型装配：内容 + 单输入效果/变形材质，或 A/B 冻结纹理转场 + 环境材质 + 扫描镜头 |
| `timing.ts` | `RemotionFrameInvalidator`（帧变即 invalidate）与 `seekSmooth` 缓动 |
| `types.ts` | `ShotDescriptor` / `CameraMoveDescriptor` / `ShotGraphPlan` / `shotAt` 纯函数 |

## 使用

```tsx
import { ShotGraph } from "@recut/remotion-kit/three";

const plan: ShotGraphPlan = {
  durationInFrames: 30 * 30,
  shots: [
    { id: "hook", content: "html", effect: "vintage" },
    { id: "metric", content: "html", effect: "magnify", lens: { anchor: [0.5, 0.34], start: 0.1, travel: 0.42 }, camera: { verb: "push-in", subject: { anchor: [0.5, 0.34] }, keyframes: [{ at: 0, position: [0, 0, 8] }, { at: 0.16, position: [0, 0, 6], fov: 30, easing: "ease-out" }] }, surface: { shell: "browser", keyframes: [{ at: 0, position: [-0.5, 0.24, -1.1], rotation: [0.08, -0.18, -0.04], scale: [0.8, 0.8, 1], bend: 0.3 }, { at: 0.16, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], bend: 0, easing: "ease-out" }] } },
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

`ShotGraph` 对单输入 `effect`、transform transition 与 `ambient` 通过 `MaterialElement`（materials 模块）按 id 挂载；`CameraDirector` 同时以当前 shot progress 驱动 `ShotDescriptor.camera` 的真实 Three 机位，`SurfaceMotion` 以同一 progress 驱动 `ShotDescriptor.surface` 的真实 mesh 位置、倾斜、缩放和曲率；`surface.shell` 决定它是 plain 页面还是 BrowserSurfaceShell。前者决定观看者，后者决定被拍物；一张内容平面也能以快速“落入镜头”的姿态产生 2.5D 透视。手机/设备模型只是 shell 的后续实现，不改 camera、surface 或 attention 合同。`fade` / `slide` / `wipe` / `flip` / `clock-wipe` / `iris` / `cross-zoom` 是 A/B 转场，专门消费冻结的前镜头纹理与当前镜头纹理，绝不传入单输入 `MaterialElement`。镜头 descriptor 只声明语义 id 与参数，不写任何 GLSL。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
