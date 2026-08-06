# Recut Remotion Studio

> `type: project` App —— 把选题、文案、风格模板和素材编排成 Remotion 程序化视频。**每个项目拥有自己的 Remotion 工程**（`remotion-skeleton` 骨架的独立副本）：AI 直接改写 composition 代码，Vite dev server 热更新预览，本地渲染导出。

## 能力

- **Brief 表单**：新建项目时选择风格模板、选题、细节、时长与素材，一键交给 AI 设计。
- **代码驱动的创作台**：AI 经 `code.read/code.write` 直接改写项目私有 `workspace/` 里的 composition 代码（复用内置表达特效与字幕主题），不再用结构化的设计契约。
- **Vite 热更新预览**：每个项目一个 Vite dev server，iframe 嵌入其预览页（`@remotion/player`，播放/暂停/进度条）；AI 改代码即热更新。
- **右侧操作 + 底部日志/终端**：右侧上半是操作按钮（弹窗填写：重新设计/导出/素材/重置项目），下半是「日志 / 终端」两个 tab——日志实时滚动预览与渲染的 shell 输出，终端在项目目录执行命令调试。
- **重置项目**：一键把 workspace 重置回骨架（丢失 AI 改写，仅测试/回退用）。
- **本地导出**：`render.js` 使用 `@remotion/bundler` + `@remotion/renderer` 在本地 headless Chrome 中把项目 workspace 的 composition 渲染为 MP4，并归档为 Recut 媒体素材；每次完成导出自动将该 MP4 设为 Project 封面。

## 结构

```text
manifest.json   唯一运行时配置（operations、permissions、onboarding）
background.js   Goja 沙箱业务后端：Brief、workspace seed/reset、code.read/write、素材登记、预览服务、终端、日志、渲染任务编排
seed.js         骨架 remotion-skeleton → 项目私有 workspace/（含 node_modules 符号链接）
skills/remotion-studio/
  SKILL.md      注入 Agent 的代码驱动工作流
  references/   表达特效目录、字幕主题目录、导演语言速查 + video-shotcraft/（流水线/镜头卡/准则/TEMPLATE 整体拷贝）
remotion-skeleton/   每个项目工作区的骨架（seed 时整体复制，AI 改的是项目副本）
  Makefile      install / start / restart / stop / status / clean（内部处理依赖与端口冲突）
  index.html    预览页入口（@remotion/player）
  vite.config.ts  root=workspace，publicDir=preview/（props.json）
  vite-server.js 启动 Vite dev server，端口写 serve/status.json
  render.js      服务端导出：bundle + renderMedia（入口 src/index.ts）
  node-check.js  依赖自检
  src/
    player.tsx            预览页组件（fetch props.json + <Player>）
    index.ts / Root.tsx   registerRoot 入口 + ProjectVideo 注册
    compositions/ProjectVideo.tsx  成片模板：改 SCENES 与渲染层（主编辑对象）
    effects/              表达特效封装：BackgroundFX、TextFX、useImageMotion
    captions/             字幕主题（remotion-captions-themes 13 套）
    components/remotion-templates/  remotion-templates 全部 81 个单文件组件 + README 目录
    components/shotcraft/  video-shotcraft 的 lib 组件（PageCam/Caption/DigitRoll/… 与 helpers）
    runtime/media.ts       resolveMediaUrl(assetId, media)——预览与导出统一走 props
ui/             Vite React 项目页（Brief 表单 + 左侧预览 + 右侧操作弹窗 + 底部日志/终端）
```

## 设计决策

- **每项目一个 Remotion 工程**：首次 `workspace.ensure` 把 `remotion-skeleton/` 整体复制到项目私有目录，AI 直接改写项目代码；项目间互不干扰，骨架改动只影响新项目。
- **预览 = 每项目 Vite dev server**：`make start`（内部处理依赖安装与端口冲突）启动 `vite-server.js`，UI iframe 嵌入其预览页；Vite 原生 HMR，AI 改代码即时热更新。预览页 props 从 `workspace/preview/props.json` 读取（`preview.props` 由 UI 写入）。
- **操作走弹窗**：右侧操作按钮点击后弹窗填写（重新设计要求、导出设置、素材查看、重置项目确认）。
- **日志与终端**：`shell.job.log` 项目事件实时滚动 + `logs.read` 回填；终端用 `terminal.exec` 在项目目录执行命令调试（非交互式）。
- **导出由后台 shell 任务执行**：`render.export` 物化 Brief ∪ `composition.assets` 登记的素材、写 props、`ctx.shell.start(node workspace/render.js …)`；进度写入 `exports/{renderId}/progress.json`，UI 轮询 `render.status`，完成后 `ctx.media.importFile` 归档为新 video Asset，并以 `ctx.project.setCover` 设为项目封面。
- **确定性渲染**：composition 与字幕时间轴全部由 frame 派生，无 `Math.random`/`Date.now`，预览与成片逐帧一致。

## 本地开发

```bash
cd remotion-skeleton && npm install   # 首次；生产上由 render.setup 自动执行 npm ci
cd ui && npm install && npm run build   # 产出 ui/dist（提交到仓库，作为 projectView）
make app-link APP=apps/remotion-studio   # 链接到 ~/.recut/apps
```

导出与预览需要本机 `node`（18+）；首次会 `npm ci` 安装 Remotion/Vite 依赖，并下载 headless Chrome（约 90MB）。调试看项目页底部「日志/终端」，或直接 `make dev` 起服务后查看。

## 复用来源与授权

参考库整体拷贝进 App 骨架，AI 在项目 workspace 里直接复用，不自己重写：

- **remotion-templates**（reactvideoeditor.com，免费）：全部 81 个单文件模板组件拷贝到 `remotion-skeleton/src/components/remotion-templates/`（含 README 目录表），背景特效已封装进 `src/effects/registry.tsx`、文字特效封装进 `src/effects/text.tsx`；目录见 `skills/remotion-studio/references/effects.md`。
- **remotion-captions-themes**（vshukla7，MIT）：字幕主题源码整体拷贝到 `remotion-skeleton/src/captions/vendor/`（保持原结构），目录见 `references/captions.md`。
- **video-shotcraft**（Vincentwei1021）：`assets/lib/` 组件拷贝到 `remotion-skeleton/src/components/shotcraft/`；`SKILL.md`、`references/`（八阶段流水线、104 张镜头配方卡、审美/声音/终检准则）、`template/TEMPLATE.md` 整体拷贝到 `skills/remotion-studio/references/video-shotcraft/`，供 skill 经 `recut.skills.reference` 读取；导演语言速查见 `references/directing.md`。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
