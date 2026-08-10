# remotion-html-in-canvas/

> L2 | 父级: /apps/remotion-studio/remotion-skeleton/src/composition-graph/README.md

成员清单
src/Crt/: 上游 Crt composition 与 WebGL shader 的原样快照，提供 barrel、scanline、aperture mask、vignette 与 flicker 的事实依据。
src/Vintage/: 上游 Vintage composition 与 WebGL shader 的原样快照，提供 gate weave、grain、scratch、dust、light leak 与 faded print 的事实依据。
src/ArticleHighlight/: 上游 ArticleHighlight composition 与 9x9 progressive Gaussian blur shader 的原样快照。
src/CubeTransitionCard/: 上游 `StorePeel` 实际注册的 card/gloss composition 原样快照。
src/Bonus/SaleStickerComposition.tsx: `CubeTransitionCard` 所依赖的 PeelSticker shader 与计算，提供 StorePeel curl/shine 的真实实现。

来源与边界

本目录是 `remotion-dev/html-in-canvas` commit `d06d8b87cb3a376fd9a189fd7a31c39eeba94142`（2026-05-03）的只读源码快照；不参与 Vite bundle。`Root.tsx` 将 composition ID `StorePeel` 映射为 `CubeTransitionCardComposition`，后者又从 `Bonus/SaleStickerComposition.tsx` 引入 `PeelSticker`。运行时代码只在父目录的 `*-material.tsx` 中做 Three uniform adapter，保留上游的光学与 curl 算法，但不引用本目录以避免把另一个 Remotion project 编入 demo。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
