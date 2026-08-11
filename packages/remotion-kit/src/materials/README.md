# materials/ — GPU 效果材质层

> Three-first GPU 合成的第 ④ 层：把「效果」抽象为**只消费内容纹理与 uniform 的材质**。HTML/media 内容由 `three/HtmlSurface` 光栅化为 `CanvasTexture`，本层所有材质在 R3F 场景中作为 mesh 的 `material` 子节点挂载，逐帧只更新 uniform，绝不重建 shader 或发起独立动画循环。

## 目录

| 路径 | 类别 | 职责 |
| --- | --- | --- |
| `types.ts` | 契约 | `MaterialId`/`MaterialDefinition`/`MaterialElementProps`/`materialOption` |
| `schema.ts` | 元数据 | 每个材质可暴露的语义参数（min/max/default），catalog 与 AI 共用 |
| `registry.ts` | 注册 | `MATERIAL_REGISTRY`：材质 → 标签/类别/描述/是否消费纹理/schema |
| `MaterialElement.tsx` | 装配 | 从统一 envelope（id + 纹理 + 帧 + 语义参数）挂载 typed 材质组件 |
| `shared/glsl.ts` | 着色器头 | `PASSTHROUGH_VERTEX`、`hash12`、`fbm2`、数值工具等确定性 GLSL 片段 |
| `shared/uniforms.ts` | 生命周期 | `useMaterialUniforms`：一次编译 + 逐帧只写 uniform 的统一纪律 |
| `post/` | 后处理 | 消费内容纹理的全屏效果：glitch / crt（滚动刷新带 + 行级轻抖）/ vintage / vhs / magnify / glass / bubble / ripple / article-highlight / asciify（字符化后复原）/ retro-dither / displacement / droplets（CanvasUI 下落雨滴场）/ frost / decrypt-reveal / text-focus / particle-reveal |
| `transform/` | 转场 | 顶点变形 + 消费纹理：bend / store-peel（反射只贴合卷页弧面）/ cloth |
| `transition/` | A/B 转场 | 双输入（前镜头冻结 A + 当前镜头实时 B）：fade / slide / wipe / flip / clock-wipe / iris / cross-zoom（移植自 remotion transitions 视觉概念，MIT） |
| `ambient/` | 环境 | 程序化、不依赖内容纹理：clouds / grid（持续斜向掠过）/ liquid / glyph-rain / laser / blaze / particle-scroll |

文本专属材质（explainer 场景重点）：`decrypt-reveal`（逐字符乱码→正文）、`text-focus`（以 `focusBox=[left,top,width,height]` 锁定文字或卡片，背景景深虚化）、`article-highlight`（黄色 marker 从左向右划出焦点，纵向聚焦）、`particle-reveal`（粒子汇聚内容入场）。火焰框已迁至 components 的 `FlameFrame`：内容与火焰共享同一个容器边界，禁止再以全屏纹理的 `center/half` 估算目标位置。`particle-reveal`、`decrypt-reveal` 与 `asciify` 均消费 ShotGraph 注入的 `effectProgress`，收尾直接采样原始纹理，不会以时钟循环回到乱码、碎片或像素化态。

## Material 契约（新增效果必须遵守）

1. **命名**：内容纹理统一 `uMap`；时间统一 `uTime`，由 `frame / fps` 派生（`MaterialElement` 按传入 `fps` 计算，缺省 30）。
2. **生命周期**：用 `useMaterialUniforms(build, update)`。`build` 创建 uniform 对象（只随 props 变），`update` 在每帧提交后写最新派生值。禁止每帧 `new THREE.Uniform`。
3. **确定性**：一切伪随机用固定 seed；突发型效果用显式时间窗口（`mod(uTime, k)` 或 burst 表）。禁止 `Math.random()` / `Date.now()` / `requestAnimationFrame()`。
4. **语义参数**：只暴露 `schema` 里声明的语义参数（intensity/zoom/radius…），不暴露 UV 细节；AI 通过 `materialOption(options, name, default)` 读取。
5. **分类**：消费内容纹理 → `post`；顶点变形转场 → `transform`；程序化环境 → `ambient`。新增效果先写组件，再注册到 `registry.ts` 与 `schema.ts`，最后在 `MaterialElement` 的 switch 里挂载。

## 使用

```tsx
import { MaterialElement } from "@recut/remotion-kit/materials";

// 在 mesh 内按 id + 语义参数挂载
<mesh>
  <planeGeometry args={[w, h]} />
  <MaterialElement
    id="magnify"
    map={htmlTexture}
    frame={frame}
    width={960}
    height={540}
    options={{ zoom: 1.7, center: [0.5, 0.34] }}
  />
</mesh>
```

## 溯源

多数材质迁移自 `remotion-skeleton/src/composition-graph/` 实验（`remotion-dev/html-in-canvas` 与 CanvasUI 光学的独立 Three 适配）。`GpuCompositor` 的 bubble/magnify/glitch 确定性规则（trail 由 clip 起点重算、burst 表）已并入对应材质。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
