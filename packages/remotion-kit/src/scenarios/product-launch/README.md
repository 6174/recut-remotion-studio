# product-launch/

> L2 | 父级: /apps/remotion-studio/packages/remotion-kit/src/scenarios/README.md

成员清单
SKILL.md: 产品发布片的导演手册、证据镜头纪律与可读性验收。
beats.tsx: hook、pain、contrast、feature、metric、ui-detail、testimonial、roadmap 与 CTA 的场景组合。
primitives.tsx: 霓虹玻璃、光环、产品证据卡、数字与 CTA 的视觉原语。
template/ProjectVideo.tsx: 默认调色板、场景序列与 Three-first GPU 镜头图；ui-detail 的设置页装入有厚度的 BrowserSurfaceShell，从带 bend 的倾斜姿态快速落位，以真实 push-in 与 magnify 共同检查导出按钮，并以 screen-title 把标题说明保留在屏幕层。

依赖边界
内容和产品证据由 beats/primitives 负责；Shot Language 只在 ui-detail 以约 1 秒的 BrowserSurfaceShell + surface 落位（position / rotation / scale / bend）和 `push-in` 把注意力送往同一个导出按钮 subject，lens 再检查该目标。它不改变按钮的互动语义，也不把整支发布片变成持续运镜。ui-detail 的标题说明通过 `Scene.screenKind` 走 screen 层，不进入 Three 相机或 lens；世界层内保留真实产品 UI。手机或其他设备模型将作为另一种 `surface.shell` 接入，不另造镜头轨。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
