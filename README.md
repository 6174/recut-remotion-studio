# Recut Remotion Studio

> `type: project` App —— 把成片模板、选题和素材编排成 Remotion 程序化视频。**每个项目拥有自己的 Remotion 工程**（`remotion-skeleton` 骨架的独立副本）：AI 直接改写 composition 代码，Vite dev server 热更新预览，本地渲染导出。

## 能力

- **Brief 表单**：新建项目时直接预览并选择成片模板，再填写选题、可选详细描述、优先从素材库选择的 SRT 和一次支持多选的素材；素材库没有 SRT 时可上传本地文件，未提供 SRT 时所选视频成为叙事来源，一键交给 AI 设计。
- **代码驱动的创作台**：AI 用原生文件工具直接读写项目私有 `workspace/`（绝对路径由 `workflow.context` 的 `paths` 提供）里的 composition 代码（复用内置表达特效与字幕主题），不再用结构化的设计契约。
- **Vite 热更新预览**：每个项目一个 Vite dev server，iframe 嵌入其预览页（`@remotion/player`，播放/暂停/进度条）；AI 改代码即热更新。
- **左右工作台**：左侧 iframe 嵌入每项目 Vite dev server 的预览页（`@remotion/player`，播放/暂停/进度条）；右侧上半以「模板 → 参数选择 → Prompt → Agent」组织创作，模板是唯一的视觉与叙事选择；字幕主题、画布、内置动态组件与素材库仅作为局部编辑工具。SRT 或视频叙事来源在 Brief 创建阶段作为可选输入，不在工作台重复出现。导出配置放进模态框，打开项目文件夹、构建/重启/重置降为维护工具；下半是「终端 / 日志」两个 tab。
- **重置项目**：一键把 workspace 重置回骨架（丢失 AI 改写，仅测试/回退用）。
- **打开项目文件夹**：从右上角在 Finder、Windows 资源管理器或 Linux 默认文件管理器中直接打开当前项目的 `workspace/`。
- **本地导出**：`render.js` 使用 `@remotion/bundler` + `@remotion/renderer` 在本地 headless Chrome 中把项目 workspace 的 composition 渲染为 MP4，并归档为 Recut 媒体素材；每次完成导出自动将该 MP4 设为 Project 封面。

## 结构

```text
manifest.json   唯一运行时配置（operations、permissions、onboarding）
background.js   Goja 沙箱业务后端：Brief、workspace seed/reset/open、组件目录（catalog.list）、素材登记、预览服务（启动时同步系统拥有的无声 player.tsx）、终端、日志、渲染任务编排
seed.js         骨架 remotion-skeleton → 项目私有 workspace/（含 node_modules 符号链接）
skills/
  remotion-studio/  代码驱动主技能；场景技能与模板代码封装在 @recut/remotion-kit/src/scenarios/
dev/                不参与运行时的 Remotion Studio 设计记录；HTML-in-Canvas 表达镜头组件计划与后续决策沉淀于此
remotion-skeleton/   每个项目工作区的骨架（seed 时整体复制，AI 改的是项目副本）
  Makefile      install / start / restart / stop / status / clean（内部处理依赖与端口冲突）
  index.html    预览页入口（@remotion/player）
  vite.config.ts  root=workspace，publicDir=preview/（props.json），@tailwindcss/vite
  vite-server.js 启动 Vite dev server，端口写 serve/status.json
  render.js      服务端导出：postcss 预编译 Tailwind 后 bundle + renderMedia（入口 src/index.ts）
  node-check.js  依赖自检
  src/
    index.css             Tailwind v4 入口 + Recut 设计系统 token（预览/导出同源）
    player.tsx            预览页组件（fetch props.json + <Player>）
    index.ts / Root.tsx   registerRoot 入口 + ProjectVideo 注册
    compositions/ProjectVideo.tsx  成片模板：改 SCENES 与渲染层（主编辑对象）
    effects/              表达特效封装：BackgroundFX、TextFX、useImageMotion
    captions/             字幕主题（remotion-captions-themes 13 套）
    components/ui/        本地 shadcn 原子（Button/Card/Badge/Input/Textarea）+ lib/utils 的 cn
    components/  remotion-templates 全部 81 个单文件组件 + README 目录
    components/  内置动态组件（PageCam/Caption/DigitRoll/… 与 helpers）
    runtime/media.ts       resolveMediaUrl(assetId, media)——预览与导出统一走 props
ui/             Vite React 项目页（Brief 表单 + 左预览 + 右侧操作与终端/日志分栏）
```

## 设计决策

- **模板是单一真相源**：`brief.template` 存成片模板 id；模板代码、视觉原语、场景技能和建议组件都在 `@recut/remotion-kit` 的 `src/scenarios/<id>/`。不再维护独立的设计系统选择。
- **每项目一个 Remotion 工程**：首次 `workspace.ensure` 把 `remotion-skeleton/` 整体复制到项目私有目录，AI 直接改写项目代码；项目间互不干扰，骨架改动只影响新项目。
- **预览 = 每项目 Vite dev server**：`make start`（内部处理依赖安装与端口冲突）启动 `vite-server.js`，UI iframe 嵌入其预览页；Vite 原生 HMR，AI 改代码即时热更新。预览页 props 从 `workspace/preview/props.json` 读取（`preview.props` 由 UI 写入）。
- **创作走右侧列**：右侧上半先显示面向交付目标的成片模板；选择模板后，模态框将模板 skill、参考代码和执行步骤一起写入可审阅 Prompt。下方保留字幕、组件、画布和素材重剪等局部编辑工具；SRT 或视频叙事来源由 Brief 作为首版成片输入持久化。打开项目文件夹、导出、构建预览、重启与重置为次级操作。
- **场景计划先于成片代码**：无真人解说和产品发布片先由 workspace 内的 `remotion-kit/scripts/validate-scene-plan.mjs` 校验 `SCENE_PLAN.md`；它直接改编 HyperFrames 两个场景共用的 storyboard parser，计划通过后才落成 `SCENES`，避免 Prompt 直接跳到散乱代码。
- **日志与终端**：右侧下半分栏。`logs.list` 只回填当前预览服务与最近两个任务的最新片段（服务端最多 300 行，界面首屏最多 120 行）；其后由 `shell.job.log` 实时追加，界面总量封顶 300 行。列表用 `@tanstack/react-virtual` 虚拟滚动，长日志不拖垮布局/resize；终端用 xterm 组件连接 Service PTY，在项目 `workspace/` 启动用户本机的交互式 zsh，原样转发输入、输出与窗口尺寸，因此补全、`cd`、历史和作业控制均由 shell 自己完成。服务统一注入登录 shell 环境与 `xterm-256color` 终端能力。
- **导出由后台 shell 任务执行**：`render.export` 物化 Brief ∪ `composition.assets` 登记的素材、写 props、`ctx.shell.start(node workspace/render.js …)`；进度写入 `exports/{renderId}/progress.json`，UI 轮询 `render.status`，完成后 `ctx.media.importFile` 归档为新 video Asset，并以 `ctx.project.setCover` 设为项目封面。
- **确定性渲染**：composition 与字幕时间轴全部由 frame 派生，无 `Math.random`/`Date.now`，预览与成片逐帧一致。
- **HTML-in-Canvas 平台契约**：Cursor、Magnifier、Glitch、Bubble 等读取 live DOM texture 的镜头层依赖 `CanvasDrawElement`。CanvasUI 通过仅对 `canvasui.dev` 有效的 Origin Trial 启用它；Recut 的动态项目预览必须由桌面/渲染宿主统一启用该 feature，不能复用第三方 token 或让用户手动改 flag。完整契约见 `dev/2026-08-09-html-in-canvas-platform-contract.md`。

## 本地开发

```bash
cd remotion-skeleton && npm install   # 首次；生产上由 render.setup 自动执行 npm ci
cd ui && npm install && npm run build   # 产出 ui/dist（提交到仓库，作为 projectView）
make app-link APP=apps/remotion-studio   # 链接到 ~/.recut/apps
```

导出与预览需要本机 `node`（18+）；首次会 `npm ci` 安装 Remotion/Vite 依赖，并下载 headless Chrome（约 90MB）。调试看项目页底部「日志/终端」，或直接 `make dev` 起服务后查看。

## 复用来源与授权

参考库以 `@recut/remotion-kit`（`packages/remotion-kit/`）为规范源，seed 时**整包拷贝模式**冻结进每个项目 workspace 的 `remotion-kit/`，AI 直接 `import { ... } from "@recut/remotion-kit"` 复用、按需升级，不自己重写。组件目录（成片模板/字幕主题/画幅/内置组件）维护在 `packages/remotion-kit/catalog.json`，版本在 `manifest.json`；Agent 用 `catalog.list` 读目录、`workspace.kit-state` 看项目冻结版本，读最新源码用原生文件工具读 app 包 `paths.appKitPath/src/`。

- **remotion-templates**（reactvideoeditor.com，免费）：全部 81 个单文件模板组件拷贝到 `remotion-skeleton/src/components/`（含 README 目录表），背景特效已封装进 `src/effects/registry.tsx`、文字特效封装进 `src/effects/text.tsx`；目录见 `skills/remotion-studio/references/effects.md`。
- **remotion-captions-themes**（vshukla7，MIT）：字幕主题源码整体拷贝到 `remotion-skeleton/src/captions/vendor/`（保持原结构），目录见 `references/captions.md`。
- **创作参考资料**：镜头配方、制作流程、审美、声音、共同创作与终检资料均直接位于 `skills/remotion-studio/references/`；它们由唯一的 `remotion-studio` skill 按需读取，组件实现统一由 `@recut/remotion-kit` 提供。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
