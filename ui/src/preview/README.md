# preview/

> L2 | 父级: /apps/remotion-studio/ui/README.md

成员清单
camera-preview.tsx: Shot Language v3 的真实 Three 镜头样片；以 CameraDirector、SurfaceMotion（位置/倾斜/bend/单角卷曲/cloth）、程序化内容平面、browser shell 与 lens-inspect 的 magnify 组合预览 catalog presets。
compositions.tsx: 预览合成分发；将字幕、成片模板（composition → 场景真实组件）和动态组件严格区分；字幕始终在固定高度安全轨道内居中播放，内容换行或缩放不推动画面；组件/模板演示铺在深色验收舞台上，防止白字白底。
PreviewCard.tsx: 单项 Remotion Player 预览，强制静音自动循环（音量为零且无音控，避免创建 WebAudio）；全铺字幕预览在加载和主题切换时维持白底，缩略图用独立字号渲染，避免 1920 画布缩小后文字不可读。
PreviewPicker.tsx: 大预览和选项卡组成的通用选择器。
CanvasPicker.tsx: 画布尺寸选择器。
sample.ts: 字幕与预览的固定示例数据。

依赖边界
场景模块只传递 `PreviewSpec`；本目录负责类型派发与播放行为。`kind="composition"` 时按模板 id 渲染 kit 里的真实场景组件（beats + 示例 SCENES），预览即成片；字幕预览默认直接落在白色网格全画布上，不加内框或底板，以深黑主字与单一主题绿检验字形与层级。字幕主题可能因当前句子、换行或缩放改变自然高度，故统一放进固定的底部安全轨道；切换主题只更新输入，不销毁播放器，避免重载闪黑。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
