# GPU 合成架构重构方案（Three-first）

> 本文是本次重构的单一方案文档：目标架构、materials 契约、three 运行时桥、skill 与 catalog 更新、skeleton 与三个场景的迁移映射、里程碑与风险。AI 架构契约另见 `skills/remotion-studio/references/gpu-composition.md`，本文与其互为引用。

## 0. 背景

`composition-graph.html` 实验（`remotion-skeleton/src/composition-graph/`）验证了一种整体上更优的合成模式：

- 画面整体基于 Three.js（R3F），HTML 内容经 HTML-in-Canvas（主）或 foreignObject（备）光栅化为 `CanvasTexture`；
- 各种效果全部由 Three material 实现（post/transform/ambient 三类），每帧只更新 uniform，绝不重建 shader；
- 镜头空间、转场、景深、相机全部由 Three 场景图完成；Remotion frame 是唯一时钟（`demand` frameloop + invalidate）。

本次重构把该模式固化为 remotion-kit 的默认架构，并让 skill 层指导 AI 按此设计代码。

## 1. 现状诊断

当前存在两套并行效果引擎：

| | 旧路径（`html-canvas` 模块） | 新路径（`composition-graph` 实验） |
|---|---|---|
| 合成器 | 裸 WebGL2 `GpuCompositor`，全屏单 pass | R3F/Three 场景图 |
| 场景结构 | 无——HTML 是唯一画面 | HTML 节点 + 媒体节点 + 环境节点 + 相机/景深 |
| 特效 | 每帧最多一个 pixel pass（bubble/magnify/glitch 三选一） | effect + transition + ambient 任意组合，各自独立 material |
| 3D 能力 | 无 | bend/store-peel/depth/camera 原生可用 |
| 确定性 | 帧驱动 | 帧驱动（`RemotionFrameInvalidator`） |
| 拓展成本 | 每新增效果手写 GL 管线 | 每新增效果写一个 material 组件 + 注册 |

结论：**统一到 Three**。`GpuCompositor` 退役（bubble/magnify/glitch 迁入 materials），`HtmlCanvasVideoStage` 收窄为纯交互 overlay 编排，不再承载像素特效。

## 2. 目标架构（四层，单向依赖）

```
① 内容层  React/HTML 排版（beats、palette、字幕、交互 affordance）  —— 不变，最有差异化的资产
② 纹理层  HtmlSurface：HIC(主) / foreignObject(备) → CanvasTexture    —— 从实验抽到 kit
③ 场景层  ThreeVideoCanvas 根 + 相机 + HtmlPlane/MediaPlane/EnvPlane  —— 从实验抽到 kit
④ 特效层  materials/ 注册表：effect + transition + ambient，只消费纹理与 uniform
时钟      Remotion frame 唯一；demand frameloop + invalidate；禁 rAF/random/Date.now
```

关键原则：

- 可见画面只由 R3F/Three nodes 绘制；HTML 只作为纹理输入存在于不可见 host。
- 内容层与特效层解耦：改排版不动特效，改特效不动排版。
- 交互特效（cursor/focus-spotlight/text-selection）**画进 HTML 内容表面**，与排版同帧经 HIC 光栅化，不产生额外 overlay/GPU pass。
- 确定性渲染铁律在 GPU 路径同样成立：一切伪随机用固定 seed，尾部状态由 frame 重算。

## 3. materials 模块（`remotion-kit/src/materials/`）

```
src/materials/
├── types.ts          # EffectMaterial 契约：props→uniforms、frame 驱动、getBounds/schema
├── registry.ts       # MATERIAL_REGISTRY（仿 EFFECT_REGISTRY 模式）
├── shared/glsl.ts    # 公共 GLSL 头：hash12、aspect 修正、tone mapping、smoothstep 工具
├── shared/uniforms.ts# useMaterialUniforms（只更新 uniform，绝不重建 shader）
├── schema.ts         # 参数 schema（min/max/default）→ catalog + AI + 未来 UI 共用
├── post/             # 消费纹理的全屏后处理
│   ├── glitch-material.tsx
│   ├── crt-material.tsx
│   ├── vintage-material.tsx
│   ├── magnify-material.tsx
│   ├── glass-material.tsx
│   ├── bubble-material.tsx
│   └── article-highlight-material.tsx
├── transform/        # 顶点变形/转场
│   ├── bend-material.tsx
│   └── store-peel-material.tsx
└── ambient/          # 程序化环境（不消费内容纹理或消费可选）
    ├── clouds-material.tsx
    └── ...           # 预留 starfield/matrix-rain/liquid-wave/particles
```

### Material 契约（写进 SKILL 的铁律）

- 内容纹理统一命名 `uMap`；时间统一 `uTime`，由 `frame / fps` 派生。
- 效果组件只暴露语义参数（intensity/zoom/radius/…），不暴露 UV 细节。
- 每帧只 `uniforms.x.value = …`；shader 只编译一次（`useMemo` 建 uniforms，`useLayoutEffect` 更新值）。
- 确定性：hash 固定 seed；突发型效果用显式 burst 表（`{ startFrame, durationFrames, seed }`）。
- 每个 material 自带 `schema`，同时驱动 `catalog.json` 的 `effects` 与 AI 可用参数边界。

### 迁移来源

- `composition-graph/` 的 9 个 material 源码迁入（glitch/crt/vintage/magnify/glass/bubble/article-highlight/bend/store-peel/clouds）。
- `GpuCompositor` 的 bubble/magnify/glitch 语义并入对应 material 的确定性规则（trail 由 clip 起点重算、burst 表）。
- `BackgroundFX` 的 CSS/SVG 背景分流：程序化（starfield/matrix-rain/liquid-wave/bokeh）→ ambient material；静态（gradient-shift/editorial-lines）→ 留在 HTML surface。

## 4. three 运行时桥（`remotion-kit/src/three/`）

```
src/three/
├── index.ts           # 稳定导出
├── ThreeVideoCanvas.tsx   # 统一 GPU 根（源自 composition.tsx）
├── HtmlSurface.tsx        # 双 adapter：HIC(主)/foreignObject(备)，sentinel 验证 + sourceVersion
├── MediaTexture.tsx       # useMediaTexture 泛化（image/video）
├── ShotGraph.tsx          # 镜头声明式模型（泛化 graph.ts + shots/scenes.tsx）
├── HtmlPlane.tsx          # 全幅内容平面（mesh + material 装配）
├── MediaPlane.tsx         # 媒体证据平面
├── timing.ts              # RemotionFrameInvalidator / PerformanceProbe / seek-safe 工具
└── types.ts               # ShotDescriptor / ShotEffectId / CameraDescriptor
```

### 镜头声明式模型

```ts
type ShotDescriptor = {
  id: string;
  content: "html" | "media" | "both";      // 内容节点
  effect?: MaterialRef;                     // 后处理材质
  transition?: { material: MaterialRef; during: [start, end] };  // 转场材质
  ambient?: MaterialRef;                    // 环境材质
  lens?: { anchor: [number, number]; travel: number; start: number };  // 扫描镜头
  camera?: { fov: number; position: [number, number, number] };
};
```

## 5. Skill 层更新

- `skills/remotion-studio/SKILL.md`：新增「GPU 合成路径」章节——何时走 Three 路径 vs 纯 DOM vs 交互 overlay；写 material 的契约；资源释放纪律（texture.dispose、一次编译、禁用随机）。
- 新增 `skills/remotion-studio/references/gpu-composition.md`：架构图 + material 编写模板 + shot-graph 设计法。
- 三个场景 SKILL.md：把转场/背景特效/放大镜改写为 material 语言。
- `catalog.json`：`effects` 条目补 `engine: "three"` + `materialSchema`。

## 6. Skeleton 与场景重构

### Skeleton

`remotion-skeleton/src/compositions/ProjectVideo.tsx` 默认根包上 `ThreeVideoCanvas`（空白页也走 GPU 根，保证空项目与成片同构）；`src/index.ts` 注册不变。

### 场景迁移映射

| 场景 | 内容层（留 HTML surface） | 效果层（改 material） |
|---|---|---|
| product-launch | beats/primitives/霓虹排版、ui-detail 交互 | 转场→bend/store-peel；背景霓虹光晕→ambient；magnify 已在 material |
| faceless-explainer | 纸面网格/荧光 marker/大字、text-selection 交互 | 背景网格渐变→ambient；转场→material |
| doodle-explainer | roughjs 手绘原语 | 纸感 grain→ambient；转场→fold/wave |

## 7. 里程碑

- **WP1** `materials/` 模块：types/registry/shared/schema + 迁入 9 个实验 material。
- **WP2** `three/` 桥：`ThreeVideoCanvas` + `HtmlSurface` + `ShotGraph` + timing。
- **WP3** Skill + catalog：`gpu-composition.md`、SKILL.md 更新、catalog effects schema。
- **WP4** Skeleton：`ProjectVideo.tsx`/`Root.tsx` 接 `ThreeVideoCanvas`。
- **WP5** 场景逐个重构：product-launch → faceless-explainer → doodle-explainer。
- **WP6** 清理：`composition-graph` 降为 dev fixture、`GpuCompositor` 退役、README/[PROTOCOL] 同步、ANGLE/swangle 回归验证。

## 8. 风险与回归

- 服务端导出：Three 走 ANGLE，`@remotion/three` 的 demand render 需 `delayRender` 兜底纹理上传；`RECUT_REMOTION_GL=swangle` 诊断无 GPU 环境。
- 确定性：材质内禁状态累积；尾部由 frame 重算。
- 性能：HIC 每帧重光栅 + 多 pass 材质，需保留 entry.tsx 的采样仪表盘做回归。
- 兼容：`composition-graph.html` 实验入口保留为 dev fixture，仅标记「实验」。
