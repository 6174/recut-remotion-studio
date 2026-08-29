# aesthetic-rules — remotion-studio 介质映射（薄适配层）

> 决策规则权威来源：`service/skills/recut-directing-motion`；本文件仅保留 remotion-studio 介质映射
>
> 本文件是 remotion-studio 对全局 `recut-directing-motion` 的薄适配层。节奏 R1–R3、质感 Q1–Q11、文案 C1–C3、流程 P1–P4 的**判例与决策规则**以全局 `service/skills/recut-directing-motion/references/aesthetic-rules.md` 为准；本文件仅保留"如何在 Remotion/composition 代码与素材管线中满足这些规则"的介质约束与技法。

## 权威来源

- **决策规则（R/Q/S/C/P）**：`service/skills/recut-directing-motion/SKILL.md` §3（落定呼吸/高光纪律/可读性门槛）+ `service/skills/recut-directing-motion/references/aesthetic-rules.md`（完整判例式准则，R1–R3/Q1–Q11/S1–S4/C1–C3/P1–P4 的规则+判例+自检三要素）。
- **本文件**：仅保留 Remotion 专属约束与实现技法（Q2 高清 rasterize、Q11 有效字高计算、声音 S2/S4 的长样本与轻音处理在 remotion 侧的落法）。

## Remotion 介质约束（全局规则在本介质的落地）

> 节奏与审美的判断以全局为准；以下仅保留"本介质必须怎样做才能通过全局验收"的实现要点。与全局冲突时以全局为准，介质约束仅作补充。

### Q2 — 3D 透视下文字发糊的 Remotion 解法

- **栅格化链路**：3D 场景的 UI 纹理按显示尺寸 2–4 倍原生栅格化，在 3D 中向下采样；放大走布局级 `CSS zoom`，不走 `transform: scale`（Chromium 对 3D 合成层按 1920 布局宽栅格化再放大，scale 路径先降采样再放大必糊）。
- **坐标换算**：`Tx = 960/zoom − cx`（见 `template/src/aifl/live/PageCam.tsx:100-114`），漏换算会跑焦点。
- **配套**：全页 2×（`deviceScaleFactor: 2`）、hero 元素单独 4× 切片；推进期 6f 交叉淡入盖低倍纹理。
- **排查顺序**：文字糊 → 先查纹理源分辨率链路（截图倍率→栅格化路径→缩放方式），最后才考虑相机；DoF 只做氛围，非清晰度解法。验证用逐帧截图裁切放大看字边缘。

### Q11 — 有效字高的 Remotion 计算

- 1080p 成片按手机/小窗校准：镜头叙事字幕有效字高 ≥56px（≥5.2% 帧高，推荐 60px）、辅助 ≥32px；有效字高 = `fontSize × 全部祖先 scale × 透视压缩（3D 按 cos(rotY)）`，以渲染帧像素为准，不看源码 `fontSize` 数值。
- 文字仅两态："纹理"（截图 cutout 装饰小字，明显虚化/降亮度）或"要读"（达标字号+高对比，浅底配 scrim/投影）；不存在中间态。收尾 URL/CTA 是全片最不该小的一行。验收用 480px 宽缩略视口。

### 声音 S2/S4 — 长样本与轻音在 Remotion 的落法

- **>5s 长样本（库内 21 个）**必须显式给 `durationInFrames`，靠 `<Sequence>` 截断；带长尾混响的 impact 让尾音自然衰减。
- **峰值 <-12dB 轻音素材（7 个）**：`volume` 是乘法系数，给 1.0 仍可能被 BGM（-9.4dB 底）盖住；首选换素材或 `ffmpeg` 预归一化，必要时 `volume>1`（Remotion 支持真实放大，但预览钳到 1.0，须以渲染产物 `volumedetect` 验峰防削波）。清单与三条出路见 `sound-design.md` §4.1（本薄适配层保留完整清单）。

### 其他 Q 的 Remotion 要点

- **Q1 真实截图**：复刻既有页面默认走无头浏览器三件套（全页 2× + per-element cutout + `layout.json` bbox），不手搓仿真贴图；非复刻场景允许手搓 UI 但需达 Q10 出版级质感。
- **Q4 高光不群发**：`glint`/`sweep` 单点给主角、必须被 `border-radius/overflow` 裁剪；群发读作廉价。
- **Q10 文档镜头**：用产品原生排版灌满真实密度假内容，侧栏/评论完整入镜；贴图+标语级假文档返工。

## 与全局的衔接

- 需要"规则+判例+自检问题"三要素原文时，直接读取全局 `references/aesthetic-rules.md`；本文件不再复制其散文与判例。
- 声音 S1–S4 的完整词汇与钉帧纪律见全局 `recut-directing-sound` 与本目录 `sound-design.md` 薄适配层；转场与卡点见全局 `recut-directing-editing`。
- 交付验收时逐条对照全局编号输出 `编号 ✓` / `编号 ✗(位置)`，位置 = 镜头名/帧号（见 `final-review.md`）。
