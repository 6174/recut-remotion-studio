# CanvasUI 镜头效果研究与 Recut Adapter 设计

> 状态：研究完成，作为下一轮实现的唯一设计依据。  
> 参考：`/Users/chenxuejia/ws/canvas-ui/src/lib/{Bubble,Magnify,Glitch,Peel}`；Remotion `packages/transitions/src/html-in-canvas-presentation.tsx`。  
> [PROTOCOL]: 变更时更新此头部，然后检查 README.md

## 结论

CanvasUI 的体验不是来自一个“大而全”的 GLSL 合成器，而是四个独立的镜头产品。它们共用 capture 基础设施，却绝不共用场景语义、shader 参数或运行时状态。

Recut 当前的错误有两个：把所有卡片都放在同一张「项目设置」UI 上；每帧都强制 `requestPaint → capture → texImage2D`，即使底图没有变化。前者让特效没有合适的视觉素材，后者让预览卡顿。

正确结构是：一个官方同构 source capture host；一个只在 source 脏时上传的 texture cache；每种效果各自的 deterministic adapter 与 fixture；轻量指引层独立于像素镜头层。

```text
EffectFixture (每种效果自己的场景)
  → SourceCapture (CanvasUI / Remotion 官方 capture 语义)
  → TextureCache (只在 sourceDirty 时 texImage2D + 按需 mipmap)
  ├─ BubbleAdapter   (单源、局部重像素)
  ├─ MagnifyAdapter  (单源、局部 lens + HUD + ripple)
  ├─ GlitchAdapter   (单源、全帧 burst)
  ├─ GuideOverlay    (cursor / focus / selection / ambient)
  └─ PeelTransition  (双源 A/B transition，独立于 StagePlan)
```

## 逐项源码事实

| 效果 | CanvasUI 真正的核心 | 适合的 fixture | Recut 的确定性替换 |
| --- | --- | --- | --- |
| Bubble | 24 个 trail 点的 smooth-min SDF；16 次 ray march；法线折射、RGB dispersion、frost LOD、rim/specular/iridescence。 | 全屏 editorial/photo 页面：大面积高饱和图片、少量深浅文字，bubble 穿过图文边界。 | `InteractionScript` 在当前帧向前采样 24 个路径点；无 rAF 积分器；历史点与半径衰减均为 `F(frame)`。 |
| Magnify | live texture 的 mipmap / `textureLod`；`fwidth` 抗锯齿；放大、色散、haze、HUD ring/cross/ticks/brackets/grid、click ripple 折弯全页。 | 科幻扫描/内容审阅页面：高对比标题、数据 readout、局部照片，lens 有东西可放大。 | lens position / presence / zoom 由 frame 曲线解析；ripple 是 `{startFrame, point}`，不在数组中 push/remove。 |
| Glitch | 切片撕裂 + micro-jitter + corrupted blocks + RGB split + analog grain / scanline；仅 burst 时显著扰动。 | 黑底高对比排版、终端、数据流或产品警报；不能用圆角设置面板。 | burst 列表显式写为 `{startFrame, durationFrames, seed}`；seed 为 clip id + burst index 稳定 hash，禁止 `Math.random()`。 |
| Peel | 96×96 网格 sheet；vertex shader 计算 curl、bow、bulge、perspective；fragment shader 计算阴影与沿边 shine；under layer 真实存在。 | Dashboard A 翻开到 navigation / detail B；必须有前景页面和完全不同的下层内容。 | 进入 root-level A/B Transition adapter；每帧同时拥有 before / after texture，不能伪装成单输入 `EffectClip`。 |
| Cursor / Focus / Selection | 不是内容折射，而是观众注意力的引导。 | 产品操作 UI、文字阅读、数据表。 | 透明 2D vector overlay；不上传 source texture，不与 Bubble 争用 shader pipeline。 |

## CanvasUI 的性能机制

源码中每个像素效果都分成 source canvas、content DOM、output WebGL canvas 三层。关键不是“三层 canvas”本身，而是 `contentDirty`：`source.onpaint` 捕获内容后才标脏；只有标脏时才上传 texture。Magnify 生成 mipmap 也只随 source 更新发生。

CanvasUI 的 rAF 只在指针、ripple、跟随惯性尚未收敛时继续。它不会把静态页面每 16ms 再 capture 一次。

Recut 必须保留这个性能形状，但把实时状态替换为帧解析：

| 网页状态 | 视频实现 |
| --- | --- |
| `pointermove` target | `InteractionEvent.move` 的帧插值 |
| `performance.now()` | `frame / fps` |
| 低通跟随 | 预计算轨迹或解析式指数曲线；不保存上一帧 GPU 状态 |
| burst random | stable hash(seed, burstIndex) |
| contentDirty | 只在 DOM 内容/语义 interaction 状态实际改变时调用 source `requestPaint()` |
| 每帧 shader render | 使用缓存 texture 更新 uniform；不等于每帧重新 capture/upload |

因此基础接口要分离 `capture()` 与 `render(frame)`：前者由 source paint 驱动，后者由 Remotion frame 驱动。当前把两者绑在同一个 `paint` handler 是卡顿的根因。

## 视觉 fixture 是产品的一部分

效果预览不是技术测试图。每张卡片要用对应效果的 canonical scene，且该 scene 也成为视觉回归样本：

| id | fixture | 验收重点 |
| --- | --- | --- |
| `bubble-editorial` | 深色杂志布局 + 全幅蓝/绿花卉或流体照片 + 大标题。 | 透明球体读得像玻璃：能折射图像、边缘有色散和高光，轨迹连续而非一串硬圆。 |
| `magnify-scanner` | 黑色扫描台 + 高对比内容 + 局部图片/关键词/坐标 readout。 | lens 内外采样明显不同；HUD 与 ripple 是镜头语言而非装饰。 |
| `glitch-signal` | 终端日志 / 红色警报 / 超大字标。 | burst 有节奏且短；静止段绝对干净，RGB split 不污染全程。 |
| `cursor-product` | 设置、表单、导出操作。 | cursor、hover、click 与 UI 语义一致。 |
| `focus-reading` | 标题 + 两段文本 / 统计数值。 | target 坐标可读，外围压暗不伤正文。 |
| `selection-editorial` | 多词句排版。 | token rect 的 reveal 与文意顺序一致。 |
| `peel-dashboard` | Dashboard A + Navigation/Detail B。 | 下层不是假背景；curl、阴影、shine 与 A/B 切换同步。 |

fixture 与真实用户场景有相同关系：它不是可复用业务 UI，而是验证这个镜头是否表达正确的受控摄影棚。

## Adapter 合同

```ts
type SourceCapture = {
  texture: WebGLTexture;
  dirty: boolean;
  uploadIfDirty(): void;
};

type FrameEffectAdapter = {
  id: "bubble" | "magnifier" | "glitch";
  cost: "local-heavy" | "full-frame";
  fixtureId: string;
  render(input: SourceCapture, frame: number, plan: StagePlan): void;
};

type TransitionAdapter = {
  id: "peel" | "page-turn";
  render(before: WebGLTexture, after: WebGLTexture, progress: number): void;
};
```

所有 adapter 的 shader / buffer / texture 都在一次 setup 时创建并在 destroy 时释放。Bubble、Magnify、Glitch 不共享“万能 effect shader”，只能共享全屏 quad、texture cache、shader compiler、颜色/alpha 约定。Peel 不进入 `StagePlan.effects`。

## 实施顺序与门槛

1. **先重做 runtime 边界**：source capture 与 WebGL render 解耦；去掉每帧 `requestPaint`；保留官方 Presentation capture host。
2. **重做 cards/fixtures**：先交付 Bubble、Magnify、Glitch、Cursor 四个专属 scene；不再使用 `ProductUiDemo` 作为通用底图。
3. **逐个重写 adapter**：先 Magnify（mipmap、HUD、ripple），再 Bubble（CanvasUI 级 SDF 光学），再 Glitch（显式 burst）。每次只上线通过 fixture 快照与性能记录的一项。
4. **Peel 最后进入 A/B transition**：使用 `@remotion/transitions` 的 custom HTML-in-canvas presentation；不回退为单页模糊假转场。

每个 adapter 的验收包括：同一输入两次导出一致；静态 source 不发生重复 texture upload；1080p/30fps 的 fixture 在目标机器上不丢帧；其画面与 CanvasUI reference 在构图和物理提示上可辨识地同类。

## 许可证

CanvasUI 是 `MIT + Commons Clause`。Recut 可以把其源码作为研究依据、独立实现相同的视觉原理，但不复制其实现或 shader 文本；每个 adapter 的设计记录要保留参考来源与这一边界。
