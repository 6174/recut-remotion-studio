# third_party/ — 第三方来源与归属

> 规则：任何从开源项目移植的效果代码，进入 `src/` 前必须先在此登记来源 commit / MIT 归属 / 依赖 / interactive state / video rewrite / stage scope / snapshot，并保留文件级来源注释与 MIT LICENSE。

## canvas-ui

上游：[CanvasUI](https://canvasui.dev/docs/)（MIT 开源组件库）。

第一批（CursorDirector / FocusSpotlight / TextSelection / Magnifier / SceneTransition / AmbientCanvasFX）为原创的 frame-driven Canvas 2D renderer，**未复制 CanvasUI 源码**；其网页交互循环（真实鼠标、滚轮、requestAnimationFrame、ResizeObserver）不能进入视频 renderer。后续按组件移植时，须在此登记：

- 来源 commit（固定 hash）
- MIT LICENSE 副本与文件级来源注释
- 交互循环如何改写为确定性 effect adapter（只移植 frame-driven 内核）
- stage scope 与 snapshot 测试

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
