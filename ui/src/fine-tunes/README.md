# fine-tunes/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
FineTuneProps.ts: 所有微调动作共享的输入与回调契约。
catalog.ts: Recut CDN 音乐/字体目录的加载器与类型（CDN 优先、本地打包回退，与 apps/editor 同一份数据）；含 SYSTEM_FONTS 本机系统字体列表与 buildFontItems（google+system 合并成统一可选字体项）。
TemplateFineTune.tsx: 将当前成片替换为所选成片模板；模板本身来自 catalog.scenarios。
CaptionsFineTune.tsx: 字幕主题微调与 Prompt 组装；全部主题在一个网格直出，不分组或筛选。
CanvasFineTune.tsx: 画布尺寸微调与 Prompt 组装。
ComponentFineTune.tsx: 动态组件微调；按类别以镜头特效同款紧凑网格卡片选择，派发 template/motion 真实预览，窄屏自动改为上下布局。
MaterialsFineTune.tsx: 将所选项目素材输出为最小引用清单，不预设剪辑或改写方式。
MusicFineTune.tsx: 配乐微调；从 Recut CDN 音乐目录试听（卡片即点即播）与选择，选择即把曲目 CDN url/元数据传给 music.import 导入为媒体资产并组装配乐 Prompt（含 license/attribution）；面板不暴露导入/移除等内部机制。
FontFineTune.tsx: 字体微调；区分 CDN 自托管（google）与**本机系统字体（system，SYSTEM_FONTS 列表，无 id/css、直接 fontFamily 用）**两类来源，带来源筛选 Tab 与徽标；镜像 apps/editor 的 loadFullFont——每张卡真加载 CDN @font-face（含 document.fonts.load）渲染真实字形；**大预览只在选中时更新**（hover 仅高亮、不切换，避免跳动），含英文/中文样例、来源提示；选择后持久化 source（fonts.select），Prompt 区分 google（FontProvider 加载）与 system（直接 fontFamily）两种加载方式。
EffectsFineTune.tsx: Three 镜头与材质特效选择器；按类别以紧凑网格小卡片展示，用户只选效果，参数 schema 自动附入 Prompt，由 Agent 决定 descriptor.camera 或 effect/transition/ambient 的语义挂载与最终参数。
AssetPicker.tsx: 可复用项目素材选择器。

音乐与字体复用 Recut 自有 CDN（`https://cdn.recut.video/audio/catalog.json` 与 `.../fonts/google/catalog.json`），与 apps/editor 是**同一份目录、同一份二进制**；本目录不做代码复用，只复用 CDN 数据与 catalog-first 架构。音乐 **catalog-first**：目录由 UI 持有（loadResourceCatalogs），选择时把所选曲目的 url/元数据传给后台 `music.import`（不做后台回源），后台用单次 shell job 把 mp3 直接写文件（不经 stdout/base64）后 `ctx.media.importFile` 导入为媒体资产；composition 以 `resolveMediaUrl(assetId)` 引用并 `composition.assets` 登记。字体与媒体同走「物化到本地 + 代码引用」：`props.fonts[familyId].css` 预览态给 CDN 绝对 URL、渲染态由 render.js 物化为本地 `/fonts/{id}.css`（重写 url 为本地 woff2），skeleton 的 `@recut/remotion-kit/fonts` FontProvider 据此注入并阻塞到字体就绪；字体同时写入 `palette.font`/CaptionTheme override。两者 Player 预览与本地渲染同源、渲染期零运行时网络。

依赖边界
本目录只定义“如何修改当前成片”的微调动作，不定义成片模板。每个模块只维护用户选择并输出 Prompt；播放与真实组件渲染由 `../preview/` 统一处理。SRT 或视频叙事来源只在项目 Brief 创建时选择，确保首版成片有唯一输入入口。成片模板在 `catalog.scenarios`，其场景技能与代码在 `@recut/remotion-kit/src/scenarios/`；UI 只通过 TemplateFineTune 选择它。

测试
`apps/remotion-studio/scripts/background-ops-smoke.test.js`（node 沙箱，无需真实服务）校验音乐导入/字体选择/预览 props 透传/workflow.context 资源可见性；Go 侧 `service/remotion_studio_test.go` 以真实 background.js 走 `workflow.context` 回归。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
