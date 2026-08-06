---
name: remotion-studio
description: 把一个选题做成可审阅、可实时预览、可导出的 Remotion 程序化视频：AI 直接改写项目 composition 代码（复用内置的表达特效、字幕主题与导演资产），Remotion Studio 热更新预览，本地渲染导出。开始设计前先读 references 目录，让用户选择表达特效与字幕主题。
references: references/effects.md, references/captions.md, references/directing.md, references/video-shotcraft/SKILL.md, references/video-shotcraft/references/pipeline.md, references/video-shotcraft/references/guided-free-creation.md, references/video-shotcraft/references/aesthetic-rules.md, references/video-shotcraft/references/sound-design.md, references/video-shotcraft/template/TEMPLATE.md
---

# Remotion Studio 创作指南

> 这是创作契约，不是平台或工具说明。项目当前状态、可用能力和保存方式由宿主提供。

## 目标

把一个选题做成可审阅、可实时预览、可导出的 Remotion 程序化视频。**每个项目拥有自己的 Remotion 工程**（项目私有 `workspace/`，首次打开自动从 App 模板复制）：AI 直接改写 `workspace/` 里的 composition 代码，Remotion Studio 长驻预览即时热更新，导出由 App 本地渲染并归档为媒体素材。

## 工作流

`Brief → 编辑代码 → 预览确认 → 导出`

1. **Brief**：`project.create` 保存风格模板、选题、细节、预期时长与素材 assetId 列表。没有 Brief 时先让用户用表单提交，不要凭空开篇。
2. **编辑代码**：先调用 `workflow.context` 看阶段与 `workspace` 状态，再 `workspace.ensure` 确保工程就绪，然后 `code.list`/`code.read` 读当前代码，用 `code.write` 直接改写 `workspace/compositions/ProjectVideo.tsx` 与 `workspace/Root.tsx`。**设计就是写代码**：不要调用 `composition.save` 之类结构契约（不存在），也不要执行 `render.export`。
3. **预览**：Remotion Studio 对 `workspace/` 的文件改动即时热更新；用户会按帧评审。局部修改只动对应代码块，用 `code.read` 后 `code.write` 原位更新。
4. **导出**：用户在界面触发 `render.export`，由 App 本地渲染并归档为媒体素材。AI 不直接调用渲染操作。

## 每个项目的 Remotion 工程（workspace/）

首次 `workspace.ensure` 把 App 模板复制到项目私有目录，结构与可复用资产：

```text
workspace/
├── index.ts                 # registerRoot 入口（不要改）
├── Root.tsx                 # 注册 ProjectVideo composition（时长/尺寸由 getProjectMetadata 推导）
├── compositions/ProjectVideo.tsx   # 成片模板：改 SCENES 与渲染层（主编辑对象）
├── effects/                 # 表达特效封装：BackgroundFX、TextFX、useImageMotion（已复用 remotion-templates）
├── templates-vendor/        # reactvideoeditor.com 的 remotion-templates 全部 81 个单文件组件（含 README 目录）
├── captions/                # 字幕主题（remotion-captions-themes 13 套，vendor/ 保原始结构）
├── vendor/shotcraft/        # video-shotcraft 的资产 lib 组件（PageCam/Caption/DigitRoll/FlashCut/… 与 helpers）
├── runtime/media.ts         # resolveMediaUrl(assetId, media) —— 导出走 props、Studio 预览走 env.json
├── media.tsx                # MediaImage / mediaSrc
├── types.ts                 # Brief / MediaMap / ProjectVideoProps
└── node_modules -> App render/node_modules   # 符号链接，解析 remotion
```

## 复用资产：用户先选择，AI 再写进代码

开始设计前，先读以下 reference，并让用户在目录里做出选择：

1. **`references/effects.md`** —— 表达特效目录（remotion-templates）。用户选择想要的效果（背景 / 文字 / 镜头运动），你把它用进对应 scene；`workspace/templates-vendor/` 里还有全部 81 个模板组件可直接复制进成片代码，`effects.md` 给出了包装与适配规则。
2. **`references/captions.md`** —— 字幕主题目录（remotion-captions-themes，13 套）。用户选择主题后，把主题 id 设为 `palette.captionTheme`，或直接用 `<CaptionTheme theme="…">`；旁白用 `buildCaptionsData` 生成逐词字幕。
3. **`references/directing.md`** —— 导演语言与提示词模板（提炼自 video-shotcraft）。完整流水线、镜头配方卡与验收清单见 `references/video-shotcraft/`（已整体拷贝，可用 `recut.skills.reference` 读取）：`SKILL.md`（三种创作模式）、`references/pipeline.md`（八阶段流水线）、`references/shots/`（104 张镜头配方卡）、`references/aesthetic-rules.md`（审美准则）、`references/sound-design.md`（声音设计）与 `template/TEMPLATE.md`（Ink Press 成片模板）。

## 媒体边界

- 画面与音乐一律引用**真实素材 assetId**。设计前用 `recut.media.list_assets` 查看素材库；用 `resolveMediaUrl(assetId, media)` 引用，绝不编造 assetId 或把对话里的预览 URL 当素材。
- 每次改写代码后调用 `composition.assets({assetIds})` 登记代码里用到的所有 assetId，导出才能物化；漏登记的画面在导出里会是空。
- 用户没有现成素材时，scene 的 `imageAssetId` 可留空，并说明哪些画面建议后续生成或上传。

## 确定性渲染铁律

预览与成片必须逐帧一致：禁止 `Math.random()` / `Date.now()` / 无参 `new Date()`；一切伪随机用固定种子（mulberry32/哈希，seed 从 index 派生）。字幕时间轴必须由 frame 派生（`buildCaptionsData` 已保证）。

## 审美底线

画面有主次、有证据、有停顿；字幕清晰可读、与旁白逐词对齐；一个 content 场景只说一个新信息。动效取舍见 `references/directing.md`：一种动画手法全片只当一次主角、关键信息落定后必须呼吸（hold 至少 0.5s）、开场三秒内给钩子、不堆砌装饰性光效。
