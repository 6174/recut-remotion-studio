# Recut Remotion Studio

> `type: project` App —— 把选题、文案、风格模板和素材编排成 Remotion 程序化视频。**每个项目拥有自己的 Remotion 工程**：AI 直接改写 composition 代码，内嵌 Player 实时预览（进度控制），本地渲染导出。

## 能力

- **Brief 表单**：新建项目时选择风格模板、选题、细节、时长与素材，一键交给 AI 设计。
- **代码驱动的创作台**：AI 经 `code.read/code.write` 直接改写项目私有 `workspace/` 里的 composition 代码（复用内置表达特效与字幕主题），不再用结构化的设计契约。
- **内嵌 Player 实时预览**：`preview.build` 用 esbuild 把项目 composition 打成预览 bundle，UI 用 `@remotion/player` 播放（播放/暂停/进度条），AI 改完代码点「重建预览」或自动轮询刷新。
- **底部日志区**：预览构建、渲染导出的 shell stdout/stderr 实时滚动显示，便于调试与查看背后执行过程。
- **本地导出**：`render/` 是 Node 渲染工作区，使用 `@remotion/bundler` + `@remotion/renderer` 在本地 headless Chrome 中把项目 workspace 的 composition 渲染为 MP4，并归档为 Recut 媒体素材；每次完成导出自动将该 MP4 设为 Project 封面。

## 结构

```text
manifest.json   唯一运行时配置（operations、permissions、onboarding）
background.js   Goja 沙箱业务后端：Brief、workspace seed、code.read/write、素材登记、预览构建、日志读取、渲染任务编排
skills/remotion-studio/
  SKILL.md      注入 Agent 的代码驱动工作流
  references/   表达特效目录、字幕主题目录、导演语言速查 + video-shotcraft/（流水线/镜头卡/准则/TEMPLATE 整体拷贝）
render/         服务端渲染/预览工作区
  src/          每个项目 workspace 的模板（seed 时复制，AI 改的是项目副本）
    compositions/ProjectVideo.tsx   成片模板：改 SCENES 与渲染层
    effects/registry.tsx + text.tsx 表达特效封装（复用 remotion-templates）
    templates-vendor/               remotion-templates 全部 81 个单文件组件 + README 目录
    captions/                       字幕主题（remotion-captions-themes 13 套）
    vendor/shotcraft/               video-shotcraft 的 lib 组件（PageCam/Caption/…）
    runtime/media.ts                 resolveMediaUrl(assetId, media)——导出与预览统一走 props
  seed.js       App 模板 → 项目私有 workspace/（含 node_modules 符号链接）
  preview.js    esbuild 打包项目 composition → workspace/preview/bundle.js（external 由 UI 注入实例）
  render.js     程序化 bundle + renderMedia（入口 = 项目 workspace）
  node-check.js 依赖自检
ui/             Vite React 项目页（Brief 表单 + Player 预览 + 导出面板 + 底部日志区）
```

## 设计决策

- **每项目一个 Remotion 工程**：首次 `workspace.ensure` 把 App 模板复制到项目私有目录，AI 直接改写项目代码，项目间互不干扰，模板改动只影响新项目。
- **预览用内嵌 Player，不跑独立 Studio dev server**：`preview.js` 用 esbuild 把项目 composition 打成 IIFE（react / react-dom / react/jsx-runtime / remotion external，UI 通过 `window.require` 注入自身实例以保证 hooks 上下文一致），`@remotion/player` 加载并播放；播放/暂停/进度条由 Player 内置。
- **媒体按 assetId 解析**：代码用 `resolveMediaUrl(assetId, media)`——预览与导出统一从 `media` props 解析（预览为内容 URL，导出为 materialized 本地文件）。
- **底部日志区**：UI 订阅 `shell.job.log` 项目事件实时滚动；`logs.read` 回填历史；预览构建与渲染导出的 stdout/stderr 都可在这里看到。
- **导出由后台 shell 任务执行**：`render.export` 物化 Brief ∪ `composition.assets` 登记的素材、写 props、`ctx.shell.start(node render/render.js …)`；进度写入 `exports/{renderId}/progress.json`，UI 轮询 `render.status`，完成后 `ctx.media.importFile` 归档为新 video Asset，并以 `ctx.project.setCover` 设为项目封面。
- **确定性渲染**：composition 与字幕时间轴全部由 frame 派生，无 `Math.random`/`Date.now`，预览与成片逐帧一致。

## 本地开发

```bash
cd render && npm install   # 首次；生产上由 render.setup 自动执行 npm ci
cd ui && npm install && npm run build   # 产出 ui/dist（提交到仓库，作为 projectView）
make app-link APP=apps/remotion-studio   # 链接到 ~/.recut/apps
```

导出与预览需要本机 `node`（18+）；首次会 `npm ci` 安装 Remotion 依赖，并下载 headless Chrome（约 90MB），耗时取决于网络。调试时看项目页底部日志区，或直接 `make dev` 起服务后用 `studio.status`/`logs.read` 检查。

## 复用来源与授权

参考库整体拷贝进 App，AI 在项目 workspace 里直接复用，不自己重写：

- **remotion-templates**（reactvideoeditor.com，免费）：全部 81 个单文件模板组件拷贝到 `render/src/templates-vendor/`（含 README 目录表），背景特效已封装进 `effects/registry.tsx`、文字特效封装进 `effects/text.tsx`；目录见 `skills/remotion-studio/references/effects.md`。
- **remotion-captions-themes**（vshukla7，MIT）：字幕主题源码整体拷贝到 `render/src/captions/vendor/`（保持原结构），目录见 `references/captions.md`。
- **video-shotcraft**（Vincentwei1021）：`assets/lib/` 组件拷贝到 `render/src/vendor/shotcraft/`；`SKILL.md`、`references/`（八阶段流水线、104 张镜头配方卡、审美/声音/终检准则）、`template/TEMPLATE.md` 整体拷贝到 `skills/remotion-studio/references/video-shotcraft/`，供 skill 经 `recut.skills.reference` 读取；导演语言速查见 `references/directing.md`。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
