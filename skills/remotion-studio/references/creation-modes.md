# 创作模式与资料路由

本文件只决定创作推进方式。所有实现都直接复用 `@recut/remotion-kit` 的场景模板、组件和效果；镜头配方只提供运动语言，不引入第二个 skill。

## 选择方式

1. **模板改写**：用户已经选择场景模板时，直接读 `{paths.appKitPath}/src/scenarios/<id>/SKILL.md`、`template/ProjectVideo.tsx`、`beats.tsx` 与 `primitives.tsx`，在项目 composition 中替换真实内容。
2. **自主创作**：用户授权自行决定叙事与视觉时，读 `production-workflow.md`，连续完成产品理解、分镜、实现与终检；除非缺少无法安全推断的输入，不逐阶段停下确认。
3. **共同创作**：用户要参与产品简报、视觉方向或分镜决策时，读 `collaborative-creation.md`；只在该文件定义的决策点等待确认，确认后从 `production-workflow.md` 的素材采集阶段继续。
4. **单镜头或指定动效**：先读对应 `shot-recipes/<分类>/<镜头>.md`，再从 kit 目录选择已存在的组件或材质实现；不得凭名称重写一个未经验证的近似效果。

## 共同纪律

- 复刻真实页面时使用真实截图或录屏；抽象段落可以程序化绘制，但不得伪造产品界面、指标或事实。
- 视觉语言从所选场景模板或产品本身的字体、色彩、间距和材质中生长。镜头配方只迁移运动、节奏和构图，不迁移不相干的皮肤。
- 一个镜头只传达一个新信息；关键内容落定后保留至少 0.5 秒阅读时间；同一种动效全片只当一次主角。
- 用户给出音乐时，在编排分镜前读 `music-beat-sync.md`；画面锁定后再读 `sound-design.md` 钉 SFX。
- 每次实现后检查关键帧与完整预览；交付前用 `final-review.md` 和 `aesthetic-rules.md` 做独立终检。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
