# spline-material/

> L2 | 父级: /apps/remotion-studio/remotion-skeleton/README.md

Spline Material 设置面板模拟实验（`spline-material.html`）。参考 pmndrs/lamina（MIT）的「图层化 ShaderMaterial」思路移植实现：图层 = 静态 uniform + GLSL main 体，按 blend mode 合成 `lamina_finalColor`；用 `__ID__` 字符串模板替代 lamina 的 glsl-tokenizer/descope，不引入 three-custom-shader-material，光照（Lambert/Phong/Physical/Toon）为自研近似。

多物体场景（`scene-model.ts` 默认三件套：Pink Card / Pearl / Chrome Card）：**点击选择**（R3F raycast，Objects 列表同样可选）→ 选中后面板切为该物体的 **Material / Effects** 标签 + 顶部 Move/Rotate/Scale gizmo（drei TransformControls，onMouseUp 提交回 SceneObject 变换）；未选中 = **Scene**（Background 五格 / 场景级 Light：Intensity·Color·Ambient·Tonemapping / Objects 列表）+ 全局 **Effects**。

对齐 Spline 的属性结构：**Material 区连续 PBR 参数**（Roughness/Metalness/Reflectivity + **Glass 套件**：Glass/Aberration/Thickness/Refraction/Blur——玻璃是参数而非独立图层，physical 光照内做折射/色散/厚度染色混合）+ **Fresnel/图层栈** + **Environment Map**（Studio/Bright Room/Warm/Sunset/Night 五套程序化全景，Exposure/Rotation）+ **Light 区**（Intensity/Color/Ambient）+ **Tonemapping**（ACES 近似 Yes/No）。质感核心 `lamina_env()` 见上文；选中高亮用 shader rim（`u_lamina_selected`），避免几何壳在透明材质上的排序穿帮。

成员清单

- types.ts: 单一事实来源——图层/材质状态类型、20 种图层（Image 2 菜单）的参数 schema 与默认值、面板默认状态（Image 1）、LAYER_DESC/LAYER_HINTS 通俗注释表
- glsl.ts: GLSL 原料层；noise/blend chunks 逐字移植自 lamina，lighting 为自研近似（含 bump/occlusion 钩子）
- layers.ts: 引擎核心；buildMaterial 把 MaterialState 编译成 ShaderMaterial（vertex 含 Displace 位移与重算法线，fragment 含图层栈 + 光照）；Image/Video/AI Texture 采样上传贴图（dataURL），未上传时回退棋盘占位
- textures.ts: dataURL → THREE.Texture 同步缓存 + 异步填充；placeholderTexture 共享棋盘占位
- effects-config.ts: Effects 的 10 种类型（Bloom/Blur/Chromatic/Vignette/Grain/Noise/Pixelate/Color Adjust/Outline/Glitch）schema 与默认状态、EFFECT_DESC/EFFECT_HINTS 通俗注释表
- effects.ts: 全屏后处理引擎；buildEffectMaterial 把 EffectState[] 编译成采样 tDiffuse 的合成 shader，与 layers.ts 同构（__ID__ 模板 + 顺序合成）
- PostFX.tsx: R3F 后处理管线（priority=1 接管渲染循环）：场景 → WebGLRenderTarget → 全屏效果合成；无效果时直渲
- presets.ts: Material Assets 的 Spline Library 预设（26 个：Gradient ×5 / Candy 光面 ×8 / Metal ×7 / Special ×6）；spec 可 JSON 持久化
- effects-presets.ts: Effects 预设 ×8（Cinematic/Dreamy/Retro VHS/Noir/Neon Night/Pixel Art/Film 35mm/Frost），套用替换整个效果栈
- icons.tsx: UI、20 种图层类型与 10 种 Effect 的 SVG 图标（LAYER_ICONS / EFFECT_ICONS）
- controls.tsx: Spline 风格受控控件（NumberInput/VecInput/ColorInput/Segmented/Dropdown/PopupShell）
- popups.tsx: 浮层——schema 驱动的 SettingsPopup（Noise/Lighting/Effect 参数，Image 3/4）、通用 TypeMenu（Image 2；meta/order/iconMap 参数化）、BlendMenu、AssetsBrowser（Image 5）
- MaterialPanel.tsx: Material 标签页（图层栈 + Environment Map 区 + Modifiers + Visibility + Collision）
- EffectsPanel.tsx: Effects 标签页（全局后处理图层栈 + Effect Presets 弹窗）
- MaterialPreview.tsx: 深色视口（drei Grid + OrbitControls），四种几何切换，wireframe 叠层，接入 PostFX；视口工具条含 5 套场景预设（Dark 深色网格 / White 白底对齐 Spline 浅色视口 / Gray 中性灰 / Checker 棋盘格判透明·折射·像素化 / Horizon 渐变摄影棚），浅色场景自动切换工具条主题
- Lab.tsx: 状态编排与 Material/Effects 标签切换；My Materials 存 localStorage（`spline-material-lab.my-materials`）
- entry.tsx / style.css: 入口与 Spline 深色主题

与截图的对应关系

- Image 1 → MaterialPanel 图层栈（Color 行含 hex 字段；行内 100 = 图层 opacity，⊙ = blend mode 菜单；眼睛 = visible；× = 删除；swatch 点击 = 切换图层类型）
- Image 2 → TypeMenu（+ 追加图层 / swatch 换类型；AI Texture 置顶带闪电）
- Image 3 → Noise 的 SettingsPopup（Mode/Type/Size/Scale/Movement/4×Color/Distortion/FactorA/FactorB 全部接线；Mode=Mask 时噪声作为 alpha 蒙版）
- Image 4 → Lighting 的 SettingsPopup（Type/Color/Shining/Bump Map/Occlusion；Bump=noise 走法线扰动，Occlusion 走边缘 AO 近似）
- Image 5 → AssetsBrowser（搜索 / All Libraries / My Materials（+ 保存当前材质）/ Spline Library 分类过滤 / 锁定图标 / 点击套用）

已知边界

- Image/Video/AI Texture 支持本地上传（dataURL 存入 params，随 My Materials 一并持久化；注意 localStorage 容量限制）；Video 仍以图片方式采样，非视频播放
- Noise 弹窗里每个 Color 的 100% 为 UI 占位，着色器仍用 lamina 的四色 smoothstep ramp
- Shadows/Collision 为面板状态但仅存档，不做阴影/物理
- Effects 的 Bloom 为单 pass 亮部近似（25 tap），非真实多 pass 高斯金字塔
- 图层/Effect 拖拽排序未实现；列表顺序即应用顺序
- 视口为交互式 lab（OrbitControls + rAF 时钟），不参与正式 Composition 与导出

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
