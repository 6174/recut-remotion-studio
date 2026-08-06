# components/ui/

> L2 | 父级: /Users/chenxuejia/ws/recut/apps/remotion-studio/remotion-skeleton/README.md

成员清单
button.tsx: shadcn Button 变体（画面内展示型）。
card.tsx: shadcn Card 家族（画面内信息容器）。
badge.tsx: shadcn Badge 状态标签。
input.tsx: shadcn Input 表单原子。
textarea.tsx: shadcn Textarea 表单原子。

设计规范
原子只做展示（视频帧内无交互）；配色全部来自 src/index.css 的 Recut 语义 token（bg-primary/text-foreground/rounded-xs…），禁止手写十六进制色值。AI 在 composition 渲染层优先复用这些原子与 Tailwind 工具类，减少逐条样式表达。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
