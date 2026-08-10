# shots/

> L2 | 父级: /apps/remotion-studio/remotion-skeleton/src/composition-graph/README.md

成员清单
types.ts: ShotId、ShotEffect、ShotProps 与 ShotComponent 的唯一共享契约。
act-one.tsx: opening 至 ratio 的 12 个独立 React 镜头组件，叙述 Remotion 时间、HTML 与素材输入。
act-two.tsx: three 至 end 的 12 个独立 React 镜头组件，叙述 Three、CanvasUI effect 与 runtime 结论。
scenes.tsx: 24 个镜头的 registry 与 ShotSurface；集中 CanvasUI 及 Crt/Vintage/ArticleHighlight/StorePeel effect、lens 锚点、扫描距离、出现时点和章节 transition，不包含镜头布局。
primitives.tsx: 纸张画布、手写题头、正文与基于 Remotion progress 的确定性入场原子；不承载镜头内容。

依赖边界

`timeline.ts` 只选择 `types.ts` 的 ShotId；HTML texture adapters 渲染 `scenes.tsx` 的 ShotSurface；`scene.tsx` 读取 registry 中的 effect/media/lens/lensStart/lensTravel/transition 描述。镜头不得向时间表回写文案或布局，primitives 不得决定镜头语义。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
