# spline-material/

> L2 | 父级: /apps/remotion-studio/remotion-skeleton/README.md

Spline Material 设置面板模拟实验（`spline-material.html`）。参考 pmndrs/lamina（MIT）的「图层化 ShaderMaterial」思路移植实现：图层 = 静态 uniform + GLSL main 体，按 blend mode 合成 `lamina_finalColor`；用 `__ID__` 字符串模板替代 lamina 的 glsl-tokenizer/descope，不引入 three-custom-shader-material，光照（Lambert/Phong/Physical/Toon）为自研近似。

成员清单

- types.ts: 单一事实来源——图层/材质状态类型、20 种图层（Image 2 菜单）的参数 schema 与默认值、面板默认状态（Image 1）
- glsl.ts: GLSL 原料层；noise/blend chunks 逐字移植自 lamina，lighting 为自研近似（含 bump/occlusion 钩子）
- layers.ts: 引擎核心；buildMaterial 把 MaterialState 编译成 ShaderMaterial（vertex 含 Displace 位移与重算法线，fragment 含图层栈 + 光照）
- presets.ts: Material Assets 的 Spline Library 预设（Gradient Pastel Shiny / Contrast 系列 + Glass/Metal/Toon 等演示）
- icons.tsx: UI 与 20 种图层类型的 SVG 图标
- controls.tsx: Spline 风格受控控件（NumberInput/VecInput/ColorInput/Segmented/Dropdown/PopupShell）
- popups.tsx: 三个浮层——schema 驱动的 SettingsPopup（Noise/Lighting，Image 3/4）、TypeMenu（Image 2）、AssetsBrowser（Image 5）
- MaterialPanel.tsx: 右侧属性面板（Material 图层栈 + Modifiers + Visibility + Collision）
- MaterialPreview.tsx: 深色视口（drei Grid + OrbitControls），四种几何切换，wireframe 叠层
- Lab.tsx: 状态编排；My Materials 存 localStorage（`spline-material-lab.my-materials`）
- entry.tsx / style.css: 入口与 Spline 深色主题

与截图的对应关系

- Image 1 → MaterialPanel 图层栈（Color 行含 hex 字段；行内 100 = 图层 opacity，⊙ = blend mode 菜单；眼睛 = visible；× = 删除；swatch 点击 = 切换图层类型）
- Image 2 → TypeMenu（+ 追加图层 / swatch 换类型；AI Texture 置顶带闪电）
- Image 3 → Noise 的 SettingsPopup（Mode/Type/Size/Scale/Movement/4×Color/Distortion/FactorA/FactorB 全部接线；Mode=Mask 时噪声作为 alpha 蒙版）
- Image 4 → Lighting 的 SettingsPopup（Type/Color/Shining/Bump Map/Occlusion；Bump=noise 走法线扰动，Occlusion 走边缘 AO 近似）
- Image 5 → AssetsBrowser（搜索 / All Libraries / My Materials（+ 保存当前材质）/ Spline Library 分类过滤 / 锁定图标 / 点击套用）

已知边界

- Image/Video/AI Texture 是占位着色器（棋盘格 + tint），真实贴图上传不在本实验范围
- Noise 弹窗里每个 Color 的 100% 为 UI 占位，着色器仍用 lamina 的四色 smoothstep ramp
- Shadows/Collision 为面板状态但仅存档，不做阴影/物理
- 视口为交互式 lab（OrbitControls + rAF 时钟），不参与正式 Composition 与导出

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
