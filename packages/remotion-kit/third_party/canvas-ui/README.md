# third_party/ — 第三方来源与归属

> 规则：CanvasUI 当前许可证为 **MIT + Commons Clause License Condition v1.0**，禁止出售、再许可或发布其组件及 port；不得将其源码、shader 或移植版本带入 `src/`。本目录只记录视觉参考与许可证边界。

## canvas-ui

上游：[CanvasUI](https://canvasui.dev/docs/)；本地审阅版本 commit：`81b65e159c63bde7167b9b4b458a775838e4cd39`。

GPU compositing、Magnifier、Glitch 与 Bubble 仅借鉴“live DOM texture → GPU post-process”的产品能力与视觉目标；Recut 的 shader、轨迹采样与 renderer 生命周期为独立实现，**未复制 CanvasUI 源码**。其网页交互循环（真实鼠标、滚轮、requestAnimationFrame、ResizeObserver）也不能进入视频 renderer。

如未来需要复用上游代码，必须先获得能覆盖 Recut 发布方式的书面许可；在许可前，只能记录视觉参考、独立实现的验收截图与 StagePlan 行为合同。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
