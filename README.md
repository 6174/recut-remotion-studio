# Recut Remotion Studio

> `type: project` App —— 把选题、文案、风格模板和素材编排成 Remotion 程序化视频。**每个项目拥有自己的 Remotion 工程**：AI 直接改写 composition 代码，Remotion Studio 热更新预览，本地渲染导出。

## 能力

- **Brief 表单**：新建项目时选择风格模板、选题、细节、时长与素材，一键交给 AI 设计。
- **代码驱动的创作台**：AI 经 `code.read/code.write` 直接改写项目私有 `workspace/` 里的 composition 代码（复用内置表达特效与字幕主题），不再用结构化的设计契约。
- **Remotion Studio 实时预览**：每个项目一个长驻 Remotion Studio dev server，项目页 iframe 嵌入其预览与代码编辑器；AI 改代码即热更新。
- **本地导出**：`render/` 是 Node 渲染工作区，使用 `@remotion/bundler` + `@remotion/renderer` 在本地 headless Chrome 中把项目 workspace 的 composition 渲染为 MP4，并归档为 Recut 媒体素材；每次完成导出自动将该 MP4 设为 Project 封面。

## 结构

```text
manifest.json   唯一运行时配置（operations、permissions、onboarding）
background.js   Goja 沙箱业务后端：Brief、workspace seed、code.read/write、素材登记、Studio 生命周期、渲染任务编排
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
    runtime/media.ts                 resolveMediaUrl(assetId, media)——导出走 props、Studio 预览走 env.json
  seed.js       App 模板 → 项目私有 workspace/（含 node_modules 符号链接）
  studio.js     长驻 Remotion Studio 预览服务器（写 studio/status.json 报端口）
  render.js     程序化 bundle + renderMedia（入口 = 项目 workspace）
  node-check.js 依赖自检
ui/             Vite React 项目页（Brief 表单 + Studio iframe 预览 + 导出面板）
```

## 设计决策

- **每项目一个 Remotion 工程**：首次 `workspace.ensure` 把 App 模板复制到项目私有目录，AI 直接改写项目代码，项目间互不干扰，模板改动只影响新项目。
- **预览用 iframe 跑真 Remotion**：`render/studio.js` 以无期限后台任务启动 `remotion studio`，iframe 嵌入其地址；HMR 即时反映 AI 改的代码。平台 `ctx.shell.start` 支持 `timeoutSeconds: 0`（无期限，仅服务型进程）。
- **媒体按 assetId 解析**：代码用 `resolveMediaUrl(assetId, media)`——导出时 props 携带 materialized 本地文件，Studio 预览时从 `workspace/public/recut-env.json` 拼内容 URL（`studio.env` 由 UI 写入，`<img>/<audio>` 跨源无需 CORS）。
- **导出由后台 shell 任务执行**：`render.export` 物化 Brief ∪ `composition.assets` 登记的素材、写 props、`ctx.shell.start(node render/render.js …)`；进度写入 `exports/{renderId}/progress.json`，UI 轮询 `render.status`，完成后 `ctx.media.importFile` 归档为新 video Asset，并以 `ctx.project.setCover` 设为项目封面。
- **确定性渲染**：composition 与字幕时间轴全部由 frame 派生，无 `Math.random`/`Date.now`，预览与成片逐帧一致。

## 本地开发

```bash
cd render && npm install   # 首次；生产上由 render.setup 自动执行 npm ci
cd ui && npm install && npm run build   # 产出 ui/dist（提交到仓库，作为 projectView）
make app-link APP=apps/remotion-studio   # 链接到 ~/.recut/apps
```

导出与预览需要本机 `node`（18+）；首次会 `npm ci` 安装 Remotion 依赖（含 `@remotion/cli`），并下载 headless Chrome（约 90MB），耗时取决于网络。

## 复用来源与授权

参考库整体拷贝进 App，AI 在项目 workspace 里直接复用，不自己重写：

- **remotion-templates**（reactvideoeditor.com，免费）：全部 81 个单文件模板组件拷贝到 `render/src/templates-vendor/`（含 README 目录表），背景特效已封装进 `effects/registry.tsx`、文字特效封装进 `effects/text.tsx`；目录见 `skills/remotion-studio/references/effects.md`。
- **remotion-captions-themes**（vshukla7，MIT）：字幕主题源码整体拷贝到 `render/src/captions/vendor/`（保持原结构），目录见 `references/captions.md`。
- **video-shotcraft**（Vincentwei1021）：`assets/lib/` 组件拷贝到 `render/src/vendor/shotcraft/`；`SKILL.md`、`references/`（八阶段流水线、104 张镜头配方卡、审美/声音/终检准则）、`template/TEMPLATE.md` 整体拷贝到 `skills/remotion-studio/references/video-shotcraft/`，供 skill 经 `recut.skills.reference` 读取；导演语言速查见 `references/directing.md`。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
