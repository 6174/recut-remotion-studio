# HTML-in-Canvas 平台运行时契约

> 状态：实现前置条件已确认。`canvasui.dev` 在同一 Chromium 中可运行，而 Recut 的 `localhost` 不可运行；差异不是效果代码，而是 Origin Trial 的 origin 授权。
>
> [PROTOCOL]: 变更时更新此头部，然后检查 README.md

## 事实

- CanvasUI 页面在初始 `<head>` 注入 `HTMLInCanvas` Origin Trial token；token 的 `origin` 是 `https://canvasui.dev:443`，因此 CanvasUI 的 Magnify 可以访问 `requestPaint`、`drawElementImage` 和 `captureElementImage`。
- Recut Studio UI 和每个项目的 Vite Player 都是不同 origin；项目预览还使用动态 localhost 端口。CanvasUI token 对它们无效，也不能复制使用。
- Remotion `HtmlInCanvas.isSupported()` 正确同时验证 `drawElementImage`、`requestPaint`、`captureElementImage` 与 OffscreenCanvas。它是镜头层的唯一准入真相。

## 平台决定

```text
Recut desktop / hosted preview Chromium
  └─ startup feature: CanvasDrawElement
       ├─ Studio effect preview (固定 App origin)
       ├─ per-project Vite Player (动态 localhost origin)
       └─ Remotion renderer Chromium
```

桌面宿主必须在创建 renderer / webview 前启用 `CanvasDrawElement`。这是唯一覆盖动态项目端口、预览与导出的可靠方案。固定生产 origin 可以额外部署 Recut 自有 Origin Trial token，但它只用于该 origin，不能替代宿主 feature。

## 责任边界

| 所有者 | 责任 | 不可接受的替代 |
| --- | --- | --- |
| Recut 平台宿主 | 固定 Chromium 版本并在启动时启用 `CanvasDrawElement`；把同一能力传给内嵌预览与导出 renderer。 | 让用户手动改 `chrome://flags`。 |
| Web 部署 | 为固定公开 origin 申请/轮换 Recut 自有 Origin Trial token，放在初始 HTML `<head>`。 | 复制 CanvasUI 的 origin-bound token。 |
| remotion-kit | 用 `HtmlInCanvas.isSupported()` 单点准入；将 missing token / rejected feature 作为诊断信息。 | 维护一套与 Remotion 不一致的 API 猜测。 |
| Studio UI | 不支持时明确阻断原生预览与 Prompt 提交，显示平台缺口。 | 显示普通 DOM 或静态截图冒充 GPU 镜头。 |

## 验收

1. 在 Recut 项目 Vite origin，`HtmlInCanvas.isSupported()` 为 true。
2. Cursor、Magnifier、Glitch、Bubble 各在 Player 内播放 60 帧且 `onPaint` 收到 `elementImage`。
3. 同一 StagePlan 经 renderer 导出；关键帧与 Player 一致。
4. 关闭 feature 的受控环境明确展示平台诊断，绝不渲染无效果的 DOM fallback。
