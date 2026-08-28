<div align="center">

<img src="./assets/logo.jpg" alt="Recut logo" width="112" />

# Remotion 视频 · Remotion Studio

**把选题、文案与素材写成 Remotion 程序化视频 — 代码即设计，预览即热更新**

每项目独立 Remotion 工程，AI 直接改写 composition 代码并本地渲染导出

[中文](./README.md) · [English](./README.en.md)

</div>

![Remotion 视频](./assets/remotion.jpg)

## 这是什么

Remotion 视频是 Recut 的**程序化视频 App**（`project` 类型）。每个项目拥有 `remotion-skeleton` 的独立副本：AI 用原生文件工具直接改写 `workspace/src/compositions/ProjectVideo.tsx` 等 composition 代码，Vite dev server 热更新预览，本地 `@remotion/renderer` 确定性导出为 MP4。

- **模板是单一真相源**：`faceless-explainer` / `product-launch` / `doodle-explainer` 三选一，视觉与叙事由 `@recut/remotion-kit` 提供。
- **设计就是写代码**：复用内置表达特效与字幕主题，媒体用 `resolveMediaUrl(assetId)` 引用真实素材并 `composition.assets` 登记。
- **预览与导出同源**：预览走 `@remotion/player`，导出走同一 composition，无随机性逐帧一致。

> 随 Recut 安装使用。发布于 [6174/recut-remotion-studio](https://github.com/6174/recut-remotion-studio)。

## 为什么用它

### 代码级可控

动效、节拍与版式都在代码里可审阅、可复用、可版本化；不再是不可解释的黑盒生成。

### 每项目一工程

首次 `workspace.ensure` 复制骨架并链接 `node_modules`，项目间互不干扰，新项目不受旧改写影响。

### 热更新预览，本地导出

改代码即热更新；导出在本地 headless Chrome 中渲染并归档为媒体 Asset，自动设为项目封面。

## 从想法到成片

1. **创建 Brief**（`project.create`）：选择模板，填写选题与可选素材/`@` 上下文。
2. **确保工程**（`workspace.ensure`）与 **启动预览**（`preview.serve.start`）：Vite dev server 监听 workspace 热更新。
3. **改写 composition**：AI 读写 `workspace/src/compositions/ProjectVideo.tsx`，用真实 `assetId` 引用素材，`composition.assets` 登记。
4. **预览确认**：在 iframe 预览中播放/拖动进度条，必要时微调配乐与字体。
5. **本地导出**（`render.export`）：物化素材与配乐，渲染为 MP4 并入库。

## 核心能力

| 能力 | 你能做什么 | 关键操作 |
| --- | --- | --- |
| **Brief 与工程** | 选模板建 Brief，初始化每项目 Remotion 工程 | `project.create` · `workspace.ensure` · `workflow.context` |
| **预览** | 启动/查询/停止 Vite 预览，写入 props | `preview.serve.start/status/stop` · `preview.props` |
| **素材与登记** | 引用真实素材并登记，导出时物化 | `resolveMediaUrl(assetId)` · `composition.assets` |
| **配乐与字体** | 从 CDN 目录选配乐/字体，预览即时可用，导出物化 | `music.import` · `music.selected` · `fonts.select` |
| **导出** | 本地渲染为 MP4，归档并设为封面 | `render.export` · `render.status` · `export.list` |
| **诊断** | 终端执行、日志查看、kit 版本对比 | `terminal.exec` · `logs.read/list` · `workspace.kit-state` |

> 完整操作契约见 `manifest.json` 的 `operations` 列表；动效与字幕目录见 Skill references。

## 快速开始

### 在 Recut 中打开

1. 安装并启动 Recut（见主仓库 [README](../../README.md#安装-recut)）。
2. 新建项目时选择 **Remotion 视频**，完成 Brief（模板为唯一视觉与叙事选择）。
3. 启动预览，改写 composition 后热更新预览，确认后导出。

### 让 Agent 帮你做

在 Claude Code / OpenCode / Codex Cli 中说：

> “我想用 Remotion 做一支程序化视频，主题是【填写选题】。先完成 Brief，再读 `recut.skills.read` 的 remotion-studio skill，确认特效与字幕主题后改写 `workspace/src/compositions/ProjectVideo.tsx`，用 `composition.assets` 登记素材，保存后等我预览确认再导出。”

## 界面导览

- **左侧预览**：iframe 嵌入 Vite 预览页（`@remotion/player`，播放/暂停/进度条）。
- **右侧上半**：模板 → 参数 → Prompt → Agent；配乐与字体微调。
- **右侧下半**：终端 / 日志双 tab。
- **导出与维护**：导出配置模态框；打开项目文件夹、重启/重置为维护操作。

![Remotion 工作台](./assets/remotion.jpg)
<sub>从模板和 Brief 开始，把代码、素材与预览连接起来。</sub>

## 常见问题

**预览不更新？** 确认 `preview.serve.status` 为 running，composition 保存后 Vite 会热更新；必要时 `preview.serve.start` 重启。

**导出没有声音？** 配乐需先 `music.import` 物化为 Asset；导入未完成时会拒绝导出，需等待或重试。

**想重置项目？** 使用 `workspace.reset` 回到骨架（会丢失 AI 改写，仅测试/回退用）。

## 面向开发者

每项目 workspace 为独立 Remotion 工程，依赖通过 pnpm content-addressed store 复用。

```sh
make app-link APP=apps/remotion-studio
make dev
cd apps/remotion-studio/ui && npm ci && npm run build
cd apps/remotion-studio/remotion-skeleton && corepack pnpm@8.15.0 install
```

- 运行时入口：`ui/dist/index.html`；workspace 位于项目私有目录。
- 契约：`manifest.json` · `background.js` · `skills/remotion-studio/SKILL.md`。

[返回主 README](../../README.md) · [应用地图](../../README.md#应用地图)
