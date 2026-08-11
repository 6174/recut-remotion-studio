---
name: remotion-studio
description: 把选题、真实素材和成片模板做成可审阅、可实时预览、可导出的 Remotion 程序化视频。直接使用 remotion-kit 的场景模板、组件、字幕、效果与 Three-first GPU 合成能力，改写项目 composition 代码并在 Player 中验证。适用于产品发布片、知识讲解、网页或应用演示、单镜头动效和程序化视频改写。
---

# Remotion Studio 创作指南

<!--
[INPUT]: 依赖项目 workspace、`@recut/remotion-kit`、场景模板与按需读取的 references。
[OUTPUT]: 对外提供 Remotion Studio 的创作、镜头、预览、导出与确定性渲染约束。
[POS]: Remotion Studio 的唯一运行时创作 Skill；镜头表达以 Camera Language v2 为语义入口。
[PROTOCOL]: 变更时更新此头部，然后检查 README.md
-->

> 这是创作契约，不是平台或工具说明。项目当前状态、可用能力和保存方式由宿主提供。

## 目标

把一个选题做成可审阅、可实时预览、可导出的 Remotion 程序化视频。**每个项目拥有自己的 Remotion 工程**（项目私有 `workspace/`，首次打开自动从 App 模板复制）：AI 用**原生文件工具**直接改写 `workspace/` 里的 composition 代码，改完保存后 Vite dev server 自动热更新，UI 内嵌 `@remotion/player` 刷新预览（带进度控制），导出由 App 本地渲染并归档为媒体素材。

## 顶层视觉铁律：信息必须看得见

视频不是网页缩略图。**任何希望观众阅读的文字，必须在手机和内嵌预览中清晰可读；看不见的小字没有信息价值，禁止使用。**

- 以最终渲染画布验证，而不是只看代码里的 `fontSize`：1080p 成片中，画面主信息的有效字高至少 **56px**，逐词字幕至少 **40px**，辅助文字、标签、统计和 CTA 至少 **32px**；父级缩放、透视或裁切会降低有效字高，必须一并计算。字幕是叙事层，不得与主标题争夺画面。
- 画面文字只有两种合法状态：**可读信息**（达到上述尺寸与对比度）或**装饰纹理**（明确降低对比度/虚化，且不承载信息）。不存在“想让人读、却读不清”的中间态；这类文字直接删掉。
- 信息太多时，先删减或拆成多个 beat，再放大文字；不要通过缩小字号塞进一个镜头。每个 content beat 只承载一个新信息。
- **所有字幕默认无底框**：不用卡片、气泡、描边容器或投影块包住字幕；字幕以干净的高对比文字叠在画面下三分之一，只有用户明确要求时才可以例外。
- 交付前抽关键帧缩至约 480px 宽检查：标题、正文、字幕、数字与 CTA 仍能一眼读清，才算通过。
- **视频不是 UI**：不使用微型 tag、chip、状态栏或缩小段落来制造信息密度。将一条信息做成大字、分词/分句入场、位移、色彩渐变或形状关系；观众看不到的文字没有存在价值。
- **色彩由场景决定**：是否使用渐变、怎样建立景深，由所选场景的 `SKILL.md` 与模板代码共同规定；不要把某个场景的渐变配色扩散为所有成片的默认。任何色彩处理都必须保持足够对比度，不能替代信息层级。

## 三件参考：模板是单一真相源

用户选择一个**成片模板**。`brief.template` 存模板 id；每个模板同时定义做什么、怎样表达和使用哪些组件。模板技能与模板代码在 **remotion-kit 内**：`{paths.appKitPath}/src/scenarios/<id>/SKILL.md`（导演视角）+ `template/ProjectVideo.tsx`（模板代码）。模板清单读 `{paths.appKitPath}/catalog.json` 的 `scenarios`。

开始设计前按顺序读**三件参考**：

1. **模板代码**：`{paths.workspacePath}/src/compositions/ProjectVideo.tsx`（该项目的成片骨架。默认只是接近空白的标题页，请按所选模板整体重写为完整成片：以 `{paths.appKitPath}/src/scenarios/<brief.template>/template/ProjectVideo.tsx` 的默认 palette、beats 与 SCENES 为骨架，替换为当前选题的真实内容）。
2. **场景技能**：`{paths.appKitPath}/src/scenarios/<brief.template>/SKILL.md`（这种视频怎么表达更好：分镜结构、镜头语言、节奏、素材纪律、验收）。
3. **组件目录**：`{paths.appKitPath}/catalog.json` 的 `components` + `effects`（镜头层效果）+ `references/effects.md` / `references/captions.md`（表达特效、字幕主题与内置动态组件）。按需读取，不一次全读。需要计划门槛的模板先运行 `validate-scene-plan.mjs`。

## 帧驱动互动引导（内容表面 overlay）

互动引导（光标、focus 聚焦、hover 语义状态）走**帧驱动互动脚本**：`InteractionScript`（InteractionEvent[]）与目标几何（`FocusTarget`/`Rect[]`）由排版时产出，运行时用 `resolveInteractionState` 推导语义状态并作为内容表面的 React overlay 与排版同帧栅格化。

- **坐标**一律使用 composition 设计像素；**时间**一律用帧；禁止真实 pointer 事件回放、`Date.now()`/`Math.random()`/`requestAnimationFrame()`。
- **禁止粘贴 CanvasUI 等网页交互示例代码**；CanvasUI 当前许可证含 Commons Clause，只能作为视觉与架构参考，不能移植、再发布或把其源码/port 放入产品；效果内核必须独立实现。
- 目标几何由场景在排版时产出，效果只消费已知几何，不做 CSS selector 扫描或 DOM layout 读回。
- `@recut/remotion-kit/html-canvas` 只提供推导函数（`resolveInteractionState`/`resolvePointer`）与交互脚本类型；`HtmlCanvasVideoStage` 与 `GpuCompositor` 的 GPU pass 已退役，新镜头一律走 GPU 合成路径。

## GPU 合成路径（Three-first，默认架构）

成片默认走 Three-first GPU 合成：`@recut/remotion-kit/three` 的 `ThreeVideoCanvas` 是统一 GPU 根，HTML 内容经 `HtmlSurface` 光栅化为 `CanvasTexture`，效果全部由 `@recut/remotion-kit/materials` 的材质实现。**开始设计前必读 `references/gpu-composition.md`（架构契约）。**

- **默认根**：`ProjectVideo` 包 `ThreeVideoCanvas`；内容镜头用 `ShotGraph` 的声明式 plan（`content`/`effect`/`transition`/`lens`/`ambient`）。
- **内容层渲染在真实 React 树内**：`renderContent(shot)` 返回镜头内容，`ShotGraph` 用 `<Sequence from={shot.start}>` 提供镜头局部帧，因此内容内部可以正常用 Remotion hook（`useCurrentFrame`/`spring`/`interpolate`）。排版、字幕、palette、静态背景与交互引导都在 HTML surface 内。
- **效果写材质，不写 DOM**：放大镜/玻璃/glitch/CRT/胶片/气泡/模糊走 `materials` post；页面卷曲/bend 转场走 transform；云/雾/粒子氛围走 ambient。参数只能取 `catalog.json` effects 里 `material.schema` 声明的语义参数。
- **转场是镜头 descriptor 的 `transition`**，在镜头前 `durationFrames` 内激活；`lens` 驱动的光学镜头中心由 shot progress 派生，禁止写死。
- 交互引导（cursor/focus/text-selection）作为 HTML surface 内的 React 层，与排版同帧栅格化，不产生额外 overlay/GPU pass。

## 镜头表达：Camera Language v2

只要任务涉及推近、拉远、平移、三维视角、焦点、景深、放大镜、翻页或 flip，先读 `references/shot-recipes/camera/README.md`，再按需读具体配方。先用一句镜头语义确定观看意图，再选择当前已经存在的实现；不从 CSS 参数或 shader 名称反推镜头。

```text
意图 -> 空间基底 -> 动词 -> 主体 -> 焦点/光学 -> 节奏 -> 排他项
```

- 动词只选一个主角：`locked`、`drift`、`push-in`、`pull-out`、`truck`、`crane`、`orbit`、`dolly-zoom`。一个镜头不得同时承担两个大运镜。
- 主体是唯一 `Subject`：一个 composition 归一化 anchor 同时派生 `PageCam` 目标、Three camera lookAt、focus 与 magnifier 中心。禁止在不同层手填不一致的坐标；Y 轴转换由运行时边界统一处理。
- `single-plane` 可以做真实 Three camera 的位置/FOV/倾斜变化，但不能声称获得页面内部的真实景深；没有显式 `depth-layers` 时，focus blur 是屏幕空间注意力处理。
- `rack-focus` 先完成焦点交接，`lens-inspect` 才出现。放大镜/玻璃/气泡/全屏 glitch/重型转场不能无节制叠加；每镜头至多一个强光学主角。
- `flip`、`peel`、`cross-zoom` 是 A/B transition，必须消费前后镜头的两张纹理，不是单输入的 camera effect。
- `CameraMotionBlur` 只包速度峰值区间；落位后的信息、焦点和 HUD 必须保持锐利，并至少留出一个可读 hold。
- `ShotGraph` 已支持 `CameraMoveDescriptor`：`subject.anchor` + 局部进度 keyframes 驱动真实 Three camera，首批可用动词为 `drift`、`push-in`、`pull-out`、`truck`、`crane`、`orbit`。先复用这套轨道；多平面真实景深与有序 post chain 仍按 `dev/2026-08-11-three-camera-shot-system-design.md` 后续演进，不得假称已完成。

## 工作流

`Brief → 读三件参考 → 编辑代码 → 预览确认 → 导出`

1. **Brief**：`project.create` 保存成片模板、选题与素材 assetId 列表。没有 Brief 时先让用户用表单提交，不要凭空开篇。
2. **编辑代码**：先调用 `workflow.context` 看阶段、`workspace` 状态与绝对路径 `paths.workspacePath`，再 `workspace.ensure` 确保工程就绪。然后读上述四件参考，用**原生文件工具**（Read/Write/Edit/Glob）直接读写 `${paths.workspacePath}` 下的 `src/compositions/ProjectVideo.tsx` 与 `src/Root.tsx`。**设计就是写代码**：不存在 `code.read`/`code.write`/`composition.save` 之类的结构契约，也不要执行 `render.export`。
3. **预览**：每次改完代码**保存即生效**，Vite dev server 会自动热更新，UI 内嵌 `@remotion/player`（播放/暂停/进度条）自动刷新；用户会按帧评审。局部修改只动对应代码块，用原生文件工具原位更新。
4. **导出**：用户在界面触发 `render.export`，由 App 本地渲染并归档为媒体素材。AI 不直接调用渲染操作。

## 每个项目的 Remotion 工程（workspace/）

首次 `workspace.ensure` 把 App 模板复制到项目私有目录，结构与可复用资产：

```text
workspace/  （= App 骨架 remotion-skeleton 的拷贝，是一个自包含 Vite 项目）
├── Makefile               # install / start / restart / stop / status / clean
├── index.html             # 预览页入口（@remotion/player）
├── vite.config.ts         # root=workspace，publicDir=preview/（props.json）
├── vite-server.js         # 启动 Vite dev server，端口写 serve/status.json（make start 调用）
├── render.js              # 服务端导出：bundle + renderMedia（入口 src/index.ts）
├── node-check.js          # 依赖自检
├── package.json
├── src/
│   ├── player.tsx         # 预览页组件（fetch props.json + <Player> 进度控制）
│   ├── index.ts           # registerRoot 入口（服务端渲染用）
│   ├── index.css          # Tailwind v4 入口 + Recut 设计系统 token
│   ├── Root.tsx           # 注册 ProjectVideo（时长/尺寸由 getProjectMetadata 推导）
│   ├── compositions/ProjectVideo.tsx   # 成片骨架：默认接近空白（仅标题），按模板整体重写（主编辑对象）
│   ├── effects/           # 表达特效封装：BackgroundFX、TextFX、useImageMotion
│   ├── captions/          # 字幕主题（remotion-captions-themes 13 套，vendor/ 保原始结构）
│   ├── lib/utils.ts       # cn（clsx + tailwind-merge 类名合并）
│   ├── components/ui/     # 本地 shadcn 原子（画面内展示用）
│   ├── components/  # remotion-templates 全部 81 个单文件组件
│   ├── components/           # remotion-kit 内置动态组件与模板
│   ├── runtime/media.ts   # resolveMediaUrl(assetId, media)
│   └── media.tsx / types.ts
├── remotion-kit/          # @recut/remotion-kit 整包冻结副本（含 src/scenarios/<id>/ 场景技能与模板代码）
├── preview/               # props.json（Vite publicDir 伺服）
└── node_modules -> App remotion-skeleton/node_modules   # 符号链接
```

## 设计系统（tailwind + shadcn，AI 少表达）

成片渲染层直接用现成的设计系统，不要逐条手写样式：

- **语义 token**（`src/index.css` 的 `@theme`）：`bg-primary` / `bg-background` / `text-foreground` / `text-muted-foreground` / `text-accent` / `bg-destructive` / `rounded-xs` / `font-sans` / `font-mono` 等，全片统一用它们；**不要手写十六进制色值**（模板色板例外，见 `palette.*`）。
- **模板色板**走 `palette` 内联样式：`palette.background/primary/accent/text/fontFamily/captionTheme`。色板由所选模板的 `template/ProjectVideo.tsx` 定义。
- **shadcn 原子**（`src/components/ui/`）：画面里要出现 UI（按钮/卡片/标签/输入框等界面感场景）时直接复用 Button/Card/Badge/Input/Textarea + `cn`，不要从零写组件。
- 布局/间距/字阶用 Tailwind 工具类，颜色交给 token 或 palette。

## 复用资产：用户先选择，AI 再写进代码

开始设计前，先让用户选择成片模板；可用组件的**规范目录**以数据文件 `packages/remotion-kit/catalog.json` 维护（成片模板/字幕主题/画幅/内置组件）；`workflow.context` 已返回 `catalogs`，或用原生文件工具读 `{paths.appKitPath}/catalog.json`。项目冻结版本读 `workspace/.recut-workspace` 的 `kitVersion` 字段：

1. **场景技能** —— 用户选择场景后，读 `{paths.appKitPath}/src/scenarios/<id>/SKILL.md`（导演视角）与 `template/ProjectVideo.tsx`（模板代码）。
2. **`references/effects.md`** —— 表达特效目录（remotion-templates）。用户选择想要的效果（背景 / 文字 / 镜头运动），你把它用进对应 scene；`workspace/remotion-kit/`（seed 时从 `@recut/remotion-kit` 整包拷贝的冻结副本）里有全部 81 个模板，直接 `import X from "@recut/remotion-kit/templates/<name>"` 复用；若用户想用更新版本，对比 `workspace/.recut-workspace` 与 `{paths.appKitPath}/catalog.json` 的版本，用原生文件工具读 `{paths.appKitPath}/src/` 最新源码按需升级。
3. **`references/captions.md`** —— 字幕主题目录（remotion-captions-themes，13 套）。用户选择主题后，把主题 id 设为 `palette.captionTheme`，或直接用 `<CaptionTheme theme="…">`；旁白用 `buildCaptionsData` 生成逐词字幕。
4. **创作参考** —— `references/creation-modes.md` 只在需要自主创作、共同创作或单镜头时决定工作方式；随后按任务读取对应资料：`production-workflow.md`（完整制作流程）、`shot-recipes/`（镜头运动配方）、`sequence-patterns/`（桥段骨架）、`aesthetic-rules.md`（审美准则）、`sound-design.md` 与 `music-beat-sync.md`（声音和卡点）、`final-review.md`（独立终检）。`paper-ink-product-promo.md` 仅在用户明确要纸墨编辑风产品片时读取。

## 媒体边界

- 画面与音乐一律引用**真实素材 assetId**。设计前用 `recut.media.list_assets` 查看素材库；用 `resolveMediaUrl(assetId, media)` 引用，绝不编造 assetId 或把对话里的预览 URL 当素材。
- 每次改写代码后调用 `composition.assets({assetIds})` 登记代码里用到的所有 assetId，导出才能物化；漏登记的画面在导出里会是空。
- 用户没有现成素材时，scene 的 `imageAssetId` 可留空，并说明哪些画面建议后续生成或上传。

## 确定性渲染铁律

预览与成片必须逐帧一致：禁止 `Math.random()` / `Date.now()` / 无参 `new Date()`；一切伪随机用固定种子（mulberry32/哈希，seed 从 index 派生）。字幕时间轴必须由 frame 派生（`buildCaptionsData` 已保证）。

## 审美底线

画面有主次、有证据、有停顿；字幕清晰可读、与旁白逐词对齐；一个 content 场景只说一个新信息。动效取舍见 `references/directing.md`：一种动画手法全片只当一次主角、关键信息落定后必须呼吸（hold 至少 0.5s）、开场三秒内给钩子、不堆砌装饰性光效。
