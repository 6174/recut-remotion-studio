# 产品发布片（product-launch）

> 场景技能：这是「产品发布片」的导演手册。用户选中本场景后，AI 按本文件的分镜策略、组件策略与动画语法来改写 composition。模板代码在 `scenarios/product-launch/template/ProjectVideo.tsx`，渲染器在 `beats.tsx`，两者必须与本手册一致。

## 一、本场景适用什么

- **适合**：产品发布、新功能介绍、产品更新、SaaS/App/硬件的 launch promo；有明确卖点、功能清单或可验证指标。
- **不适合**：抽象知识讲解（用 `faceless-explainer`）、图文故事、口播重剪。
- 上游参考：[HyperFrames product-launch-video](https://github.com/heygen-com/hyperframes/tree/main/skills/product-launch-video)。

## 二、本场景内置视觉

- 场景模板自带一套**内置调色板**（`PRODUCT_LAUNCH_PALETTE`，见 `template/ProjectVideo.tsx`）：深紫夜底 `#10002c` + 青/洋红霓虹强调（`#8af4ff` / `#ff8ace`），高能、玻璃、发光的产品发布视觉。
- **AI 直接按内置 palette 实现，不读全局 recut-design-system skill。** 颜色/字体全部用 `p`（palette），不手写十六进制。
- 模板是完整视觉方案；需要改变表达时应选择更匹配的成片模板，或在具体镜头要求中描述变化，不提供独立设计系统迭代。

## 三、导演视角：分镜画面与动画展示过程

产品发布是「说服」叙事，节奏是**主张先落版，每个功能一个证据镜头，最后 CTA 收束**。全程一个节拍一个信息变化（约 5–6s），落定后呼吸（hold ≥ 0.5s），不堆叠。

**铁律：每个 beat 有一个唯一视觉主角（eye-catch），全片不重复同一种表达方式**——霓虹 hero / 数字冲击 / 对仗分屏 / 玻璃证据 / 超大数据 / 引述扫光 / 路线进度 / 发光 CTA，每种只出现一次。

| # | beat | 导演意图 | 唯一视觉主角 | 动画展开 | 时长 |
|---|---|---|---|---|---|
| ① | `hook` 结果承诺 | 开场三秒砸出结果 | 霓虹渐变 + 双旋转光环 + 超大主张 | 标题缩放弹出（scale 0.84→1），发光 Pill 错峰入场 | 5s |
| ② | `pain` 痛点 | 数字冲击让人看清成本 | 超大成本数字飞入（140px+），左标题压小 | 数字放大落定（from 1.4），要点菱形错峰 | 5s |
| ③ | `contrast` 对比 | 现状 vs 愿景此消彼长 | 左右分屏宽度动画（0.5→0.32/0.68） | 两栏宽度推移，AFTER 侧发光 | 6s |
| ④ | `feature` 功能证据 | 每个功能一张可读证据 | 玻璃证据卡 + 产品截图 | 要点逐条滑入（每 6f 一条），产品画面稳定 | 6s |
| ⑤ | `metric` 数据 | 用数字证明 | 超大 DigitRoll 翻牌 + 光晕 | 数字逐位滚入，细线延展 | 5s |
| ⑥ | `testimonial` 证言 | 让客户替你说话 | 超大引号 + 一句证言 + 扫光掠过 | 引述卡缩放落定，扫光从左到右 | 5s |
| ⑦ | `roadmap` 路线 | 让观众看到下一步 | 横向发光进度条 + 节点点亮 | 进度条推进，节点逐点发光 | 5s |
| ⑧ | `cta` 行动号召 | 明确落点 | 双光环 + 发光按钮 + 扫光 | 整组放大落定，按钮发光 | 6s |

**UI 特写镜头（`ui-detail`，默认在 `metric-1` 与 `feature-3` 之间）**：产品设置面板 + 「导出」按钮。Three-first GPU 路径下：按钮几何与鼠标 move → hover → click 由 `buildProductLaunchStagePlan`（StagePlan.interaction）提供；放大镜由 `buildProductLaunchGpuPlan` 映射到 ShotGraph 的 `lens`（magnify 材质，锚定导出按钮）；按钮 hover/pressed 语义状态经内容表面注入的 `interaction`（`resolveInteractionState`）驱动。改文案/坐标时保持 `beats.tsx` 的 `PRODUCT_LAUNCH_UI_GEOMETRY` 与模板 StagePlan/lens UV 同步；场景可经 `stagePlan` prop 关闭（null）或替换。内容表面经 HtmlSurface 光栅化（HTML-in-Canvas 主 / foreignObject 备）。

## 四、组件策略

- **必须复用 kit 组件，不手写裸 div**：`DigitRoll`（⑤ 超大数据）、`BackgroundFX`（背景特效层由引擎统一渲染）；每类 beat 的场景视觉原语见 `primitives.tsx`（霓虹/玻璃/光环/发光 Pill/CTA 按钮）。
- 需要更强表达时，从 `{paths.appKitPath}/catalog.json` 的 `components` 选：`spotlight-reveal`（产品特写）、`card-flip`（功能卡正反面）、`end-card`（收尾）、`lower-third`（术语条）、`progress-steps`（步骤进度）。
- 原则：**一种动画手法全片只当一次主角**；产品画面稳定优先于炫技运镜。

## 五、素材纪律与登记

- 有真实截图/录屏时用 `resolveMediaUrl(assetId, media)` 放进 feature 的证据卡，不手绘仿冒 UI；无素材时保留干净的程序化玻璃占位卡，并说明建议生成/上传哪些画面。
- 改完代码后 `composition.assets({assetIds})` 登记所有 assetId。

## 六、执行步骤

1. `workflow.context` 拿路径，`workspace.ensure` 就绪。
2. 确认使用场景内置调色板（PRODUCT_LAUNCH_PALETTE / FACELESS_EXPLAINER_PALETTE，见 template/ProjectVideo.tsx）；保持模板的视觉语言，不引入独立设计系统。
3. 读 `beats.tsx` 确认 8 类 beat 渲染器，改写 `buildProductLaunchScenes`（60s：hook 5 / pain 5 / contrast 6 / feature×3 6 / metric×2 5 / testimonial 5 / roadmap 5 / cta 6）填充真实 topic/卖点/数字/素材。
4. 按第三节分镜表保持叙事顺序；替换文案、数字、功能点，不破坏视觉与节奏。
5. 保存后等待 Player 预览，用户逐帧评审后停下。

## 七、验收

- 结构：承诺 → 痛点 → 功能证据（可多段）→ 数据 → CTA；每段只证明一个卖点。
- 视觉：每 beat 有独立布局与动效，颜色/字体吃 palette；不出现手写裸 div 排版。
- 素材：真实截图完整可读；数字只强调已确认指标；assetId 已登记。
- 时长：默认 31s（hook 5 / pain 5 / feature 6 / feature 6 / metric 5 / cta 4），落在 20–30s 量级。
