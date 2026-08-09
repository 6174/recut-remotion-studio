# html-canvas/ — HTML-in-Canvas 表达镜头层

> 目标：把 HTML-in-Canvas 设为 Remotion Studio 的浏览器硬能力，并以它把实时 HTML 内容转化为可编排的“表达镜头”——由鼠标驱动的模拟交互、聚焦、文本选择、放大镜、场景进出与背景特效，同时保持逐帧确定性和预览/导出一致。

## 关键约定

- **坐标**一律使用 composition 设计像素；禁止 `getBoundingClientRect()`、CSS selector 扫描或 DOM layout 读回作为真相源。
- **时间**一律使用帧；禁止 `Date.now()`、`Math.random()`、`requestAnimationFrame()`、真实 pointer 事件进入画面。
- **唯一舞台**：整支视频只有一个 `HtmlCanvasVideoStage`；场景/beat 组件只提交 `StagePlan`，绝不自行创建 `<HtmlInCanvas>`（嵌套 capture 服务器导出尚不支持，开发期会抛错）。
- **硬门禁**：`BrowserCapabilityGate` / `requireHtmlInCanvas()` 只允许或阻断，不返回 fallback；不支持时给出平台修复路径。

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
| `HtmlCanvasVideoStage.tsx` | 整支视频唯一的 `HtmlInCanvas` 捕获面与总合成器 |
| `CanvasEffect.tsx` / `registry.ts` | paint renderer 适配边界与效果注册表 |
| `effects/*` | CursorDirector / FocusSpotlight / TextSelection / Magnifier / SceneTransition / AmbientCanvasFX |
| `demos/product-ui-demo.tsx` | click → focus 的产品 UI 叙事实例（特效板块预览 fixture） |

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
  <HtmlCanvasVideoStage plan={stagePlan}>
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

模板自身创建**唯一**捕获面；骨架 `ProjectVideo` 只透传 `stagePlan`，绝不二次包裹。

## 测试

```sh
node --import ./scripts/ts-resolve-hooks.mjs scripts/html-canvas-tests.mjs
```

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
