# remotion-skeleton/

> 每个项目工作区的骨架模板：`workspace.ensure` 时整体复制到项目私有 `workspace/`（AI 改的是项目副本）。`src/compositions/ProjectVideo.tsx` 是主编辑对象。

## 结构

- `Makefile` install/start/restart/stop/status/clean（内部处理依赖与端口冲突）
- `index.html` 预览页入口（`@remotion/player`，经 `/src/player.tsx`）
- `vite.config.ts` 用 ESM 路径解析设置 root=workspace、publicDir=preview/（props.json）；`@tailwindcss/vite` 处理 Tailwind
- `vite-server.js` 以 ESM config runner 启动 Vite dev server，端口写 `serve/status.json`（预览 = HMR）
- `render.js` 服务端导出：先用 `postcss + @tailwindcss/postcss` 预编译 `src/index.css`，再 bundle（入口经临时 composition.entry.ts 引入编译后 CSS）
- `src/index.css` **Tailwind v4 + Recut 设计系统 token**（预览/导出同源，禁止手写十六进制色值）
- `src/player.tsx` 预览 React 根：读取 props 并渲染 ProjectVideo；预览服务可用性由 Studio 应用层确认
- `src/index.ts` registerRoot 入口（不含 CSS import；预览走 index.html `<link>`，导出走 render.js 预编译）
- `src/compositions/ProjectVideo.tsx` 成片模板：SCENES（内容）+ 渲染层（编辑对象），相对引用 `src/effects`/`src/captions`（seed 时从 `@recut/remotion-kit` 拷贝的冻结副本）
- `src/effects/` BackgroundFX / TextFX / useImageMotion（表达特效；默认 clean-editorial 使用白底 editorial-lines）
- `src/captions/` 13 套字幕主题（vendor/ 保原始结构；中文旁白按短语切分）
- `src/components/ui/` 本地 shadcn 原子（Button/Card/Badge/Input/Textarea）+ `src/lib/utils.ts` 的 `cn`
- `src/components/` 81 个单文件模板（含 README 目录表）
- `src/components/` video-shotcraft lib 组件
- `src/runtime/media.ts` resolveMediaUrl(assetId, media)

## 设计系统

布局/字阶用 Tailwind 工具类，颜色用语义 token（`bg-primary`/`text-foreground`/…）或模板色板（`palette.*` 内联）；默认 clean-editorial 采用白底、低对比轮廓线、海军蓝字幕底板与蓝色激活词。画面内 UI 复用 `src/components/ui` 原子。全部确定性渲染（frame 驱动，禁 `Math.random`/`Date.now`）。

## 本地开发

```bash
npm install          # 首次；生产上由 render.setup 自动 npm ci
make start           # 启动预览 dev server（vite-server.js 写 serve/status.json）
node render.js --renderId <id>   # 需 RECUT_APP_FILES_DIR 指向项目 files/ 且 exports/<id>/props.json 存在
```

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
