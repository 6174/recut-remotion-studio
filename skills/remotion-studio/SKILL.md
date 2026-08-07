---
name: remotion-studio
description: 把一个选题做成可审阅、可实时预览、可导出的 Remotion 程序化视频：AI 直接改写项目 composition 代码（复用内置的表达特效、字幕主题与导演资产），内嵌 Player 实时预览（进度控制），本地渲染导出。开始设计前先读 references 目录，让用户选择表达特效与字幕主题。
references: references/effects.md, references/captions.md, references/directing.md, references/video-shotcraft/SKILL.md, references/video-shotcraft/references/pipeline.md, references/video-shotcraft/references/guided-free-creation.md, references/video-shotcraft/references/aesthetic-rules.md, references/video-shotcraft/references/sound-design.md, references/video-shotcraft/template/TEMPLATE.md
---

# Remotion Studio 创作指南

> 这是创作契约，不是平台或工具说明。项目当前状态、可用能力和保存方式由宿主提供。

## 目标

把一个选题做成可审阅、可实时预览、可导出的 Remotion 程序化视频。**每个项目拥有自己的 Remotion 工程**（项目私有 `workspace/`，首次打开自动从 App 模板复制）：AI 用**原生文件工具**直接改写 `workspace/` 里的 composition 代码，改完保存后 Vite dev server 自动热更新，UI 内嵌 `@remotion/player` 刷新预览（带进度控制），导出由 App 本地渲染并归档为媒体素材。

## 工作流

`Brief → 编辑代码 → 预览确认 → 导出`

1. **Brief**：`project.create` 保存风格模板、选题、细节、预期时长与素材 assetId 列表。没有 Brief 时先让用户用表单提交，不要凭空开篇。
2. **编辑代码**：先调用 `workflow.context` 看阶段、`workspace` 状态与绝对路径 `paths.workspacePath`，再 `workspace.ensure` 确保工程就绪，然后用**原生文件工具**（Read/Write/Edit/Glob）直接读写 `${paths.workspacePath}` 下的 `src/compositions/ProjectVideo.tsx` 与 `src/Root.tsx`。**设计就是写代码**：不存在 `code.read`/`code.write`/`composition.save` 之类的结构契约，也不要执行 `render.export`。
3. **预览**：每次改完代码**保存即生效**，Vite dev server 会自动热更新，UI 内嵌 `@remotion/player`（播放/暂停/进度条）自动刷新；用户会按帧评审。局部修改只动对应代码块，用原生文件工具原位更新。
4. **导出**：用户在界面触发 `render.export`，由 App 本地渲染并归档为媒体素材。AI 不直接调用渲染操作。

## 成片场景

当 UI Prompt 带有“成片场景”和场景 id 时，先读取可发现的 `remotion-scenes` skill 中的同名章节，再回到本技能执行。它把 HyperFrames 的场景分流逻辑本地化为 Recut 当前可完成的路径：`faceless-explainer`、`product-launch`、`slideshow`、`talking-head-recut`、`music-visual` 与 `captioned-clip`。

- 场景决定叙事骨架、真实素材边界和字幕策略；风格模板、字幕主题、画幅和 assetId 仍由 UI Prompt 的明确选择决定。
- `figma`、`pr-to-video` 等依赖 Recut 尚未连接的数据源的路径不在当前场景集合中；不能暗中把无素材请求改成虚构界面或数据。
- 场景只约束首次成片或指定重剪；后续局部编辑继续遵守“只动目标 scene”的规则。

## 每个项目的 Remotion 工程（workspace/）

首次 `workspace.ensure` 把 App 模板复制到项目私有目录，结构与可复用资产：

```text
workspace/  （= App 骨架 remotion-skeleton 的拷贝，是一个自包含 Vite 项目）
├── Makefile               # install / start / restart / stop / status / clean（内部处理依赖与端口冲突）
├── index.html             # 预览页入口（@remotion/player）
├── vite.config.ts         # root=workspace，publicDir=preview/（props.json）
├── vite-server.js         # 启动 Vite dev server，端口写 serve/status.json（make start 调用）
├── render.js              # 服务端导出：bundle + renderMedia（入口 src/index.ts）
├── node-check.js          # 依赖自检
├── package.json
├── src/
│   ├── player.tsx         # 预览页组件（fetch props.json + <Player> 进度控制）
│   ├── index.ts           # registerRoot 入口（服务端渲染用）
│   ├── index.css          # Tailwind v4 入口 + Recut 设计系统 token（预览/导出同源）
│   ├── Root.tsx           # 注册 ProjectVideo（时长/尺寸由 getProjectMetadata 推导）
│   ├── compositions/ProjectVideo.tsx   # 成片模板：改 SCENES 与渲染层（主编辑对象）
│   ├── effects/           # 表达特效封装：BackgroundFX、TextFX、useImageMotion
│   ├── captions/          # 字幕主题（remotion-captions-themes 13 套，vendor/ 保原始结构）
│   ├── lib/utils.ts       # cn（clsx + tailwind-merge 类名合并）
│   ├── components/ui/     # 本地 shadcn 原子：Button/Card/Badge/Input/Textarea（画面内展示用）
│   ├── components/remotion-templates/  # remotion-templates 全部 81 个单文件组件（含 README 目录表）
│   ├── components/shotcraft/           # video-shotcraft 的 lib 组件（PageCam/Caption/DigitRoll/… 与 helpers）
│   ├── runtime/media.ts   # resolveMediaUrl(assetId, media)——预览与导出统一走 props
│   └── media.tsx / types.ts
├── preview/               # props.json（preview.props 写入，Vite publicDir 伺服）
└── node_modules -> App remotion-skeleton/node_modules   # 符号链接，解析 remotion/vite/react
```

## 设计系统（tailwind + shadcn，AI 少表达）

成片渲染层直接用现成的设计系统，不要逐条手写样式：

- **语义 token**（`src/index.css` 的 `@theme`）：`bg-primary` / `bg-background` / `text-foreground` / `text-muted-foreground` / `text-accent` / `bg-destructive` / `rounded-xs` / `font-sans` / `font-mono` 等，全片统一用它们；**不要手写十六进制色值**（模板色板例外，见 `palette.*`）。
- **动态色板**（每套模板不同）仍走 `palette` 内联样式：`palette.background/primary/accent/text/fontFamily/captionTheme`，`ProjectVideo.resolvePalette` 已按 brief.template 解析。
- **shadcn 原子**（`src/components/ui/`）：画面里要出现 UI（按钮/卡片/标签/输入框等界面感场景）时直接复用 Button/Card/Badge/Input/Textarea + `cn`，不要从零写组件。
- 布局/间距/字阶用 Tailwind 工具类（`flex`/`absolute`/`px-*`/`text-*`/`tracking-*`…），颜色交给 token 或 palette。
## 复用资产：用户先选择，AI 再写进代码

开始设计前，先读以下 reference，并让用户在目录里做出选择。可用组件的**规范目录**以数据文件 `packages/remotion-kit/catalog.json` 维护（风格模板/字幕主题/画幅/内置组件）；`workflow.context` 已返回 `catalogs`，或用原生文件工具读 `{paths.appKitPath}/catalog.json`。项目冻结版本读 `workspace/.recut-workspace` 的 `kitVersion` 字段：

1. **`references/effects.md`** —— 表达特效目录（remotion-templates）。用户选择想要的效果（背景 / 文字 / 镜头运动），你把它用进对应 scene；`workspace/remotion-kit/`（seed 时从 `@recut/remotion-kit` 整包拷贝的冻结副本）里有全部 81 个模板，直接 `import X from "@recut/remotion-kit/templates/<name>"` 复用；若用户想用更新版本，对比 `workspace/.recut-workspace` 与 `{paths.appKitPath}/catalog.json` 的版本，用原生文件工具读 `{paths.appKitPath}/src/` 最新源码按需升级。`effects.md` 给出了包装与适配规则。
2. **`references/captions.md`** —— 字幕主题目录（remotion-captions-themes，13 套）。用户选择主题后，把主题 id 设为 `palette.captionTheme`，或直接用 `<CaptionTheme theme="…">`；旁白用 `buildCaptionsData` 生成逐词字幕。主题源码在 `workspace/remotion-kit/src/captions/` 冻结副本，组件规范源与版本见 `{paths.appKitPath}/catalog.json` 与 `{paths.appKitPath}/package.json`。
3. **`references/directing.md`** —— 导演语言与提示词模板（提炼自 video-shotcraft）。完整流水线、镜头配方卡与验收清单见 `references/video-shotcraft/`（已整体拷贝，可用 `recut.skills.reference` 读取）：`SKILL.md`（三种创作模式）、`references/pipeline.md`（八阶段流水线）、`references/shots/`（104 张镜头配方卡）、`references/aesthetic-rules.md`（审美准则）、`references/sound-design.md`（声音设计）与 `template/TEMPLATE.md`（Ink Press 成片模板）。

## 媒体边界

- 画面与音乐一律引用**真实素材 assetId**。设计前用 `recut.media.list_assets` 查看素材库；用 `resolveMediaUrl(assetId, media)` 引用，绝不编造 assetId 或把对话里的预览 URL 当素材。
- 每次改写代码后调用 `composition.assets({assetIds})` 登记代码里用到的所有 assetId，导出才能物化；漏登记的画面在导出里会是空。
- 用户没有现成素材时，scene 的 `imageAssetId` 可留空，并说明哪些画面建议后续生成或上传。

## 确定性渲染铁律

预览与成片必须逐帧一致：禁止 `Math.random()` / `Date.now()` / 无参 `new Date()`；一切伪随机用固定种子（mulberry32/哈希，seed 从 index 派生）。字幕时间轴必须由 frame 派生（`buildCaptionsData` 已保证）。

## 审美底线

画面有主次、有证据、有停顿；字幕清晰可读、与旁白逐词对齐；一个 content 场景只说一个新信息。动效取舍见 `references/directing.md`：一种动画手法全片只当一次主角、关键信息落定后必须呼吸（hold 至少 0.5s）、开场三秒内给钩子、不堆砌装饰性光效。
