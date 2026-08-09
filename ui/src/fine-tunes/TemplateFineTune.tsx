/**
 * [INPUT]: 依赖成片模板目录（含每模板完整 SKILL.md 导演手册）和 preview/PreviewPicker 的 Remotion Player 演示
 * [OUTPUT]: 对外提供成片模板选择。生成的 Prompt 包含该模板的
 *           SKILL.md 全文（端到端参考：适用 / 内置视觉 / 分镜策略 / 组件策略 / 验收），并强制
 *           从场景的默认 ProjectVideo 模板重建，而不是在旧成片上修补。
 * [POS]: fine-tunes 的模板替换动作；模板是用户端到端的参考——可引用公共组件，但内部有自己的
 *        组件、视觉原语与导演规划逻辑（见对应 SKILL.md）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { PreviewPicker } from "../preview/PreviewPicker";
import type { FineTuneProps } from "./FineTuneProps";

export const TemplateFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const [value, setValue] = useState(Object.keys(catalog.scenarios)[0] || "");
  const prompt = useMemo(() => {
    const selected = catalog.scenarios[value];
    if (!selected) return basePrompt;
    const skill = (selected as { skillBody?: string }).skillBody?.trim();
    const meta = `成片模板：${value}（${selected.label ?? ""}；${selected.description ?? ""}）。`;
    if (!skill) {
      return `${basePrompt}\n\n${meta}\n组件：${selected.components.join("、") ?? ""}。请按场景结构实现。`;
    }
    // 完整 SKILL.md 就是这个场景的端到端参考：AI 先读它，再据此改写 composition。
    return `${basePrompt}\n\n${meta}\n\n## 该模板的完整导演手册（SKILL.md）\n\n${skill}\n\n## 默认模板重建约束\n\n必须以 \`src/scenarios/${value}/template/ProjectVideo.tsx\` 的默认实现为成片骨架：先使用它的默认 palette、SCENES、beats 与视觉原语，再替换为当前选题的真实内容。不要保留当前成片的旧视频结构，也不要在旧画面上做局部修补。\n\n## 平台视频表达硬约束\n\n每个 beat 只突出一个巨大主张；禁止小字、小 tag、chip 和弱对比说明。用大字的分词/分句入场、位移、文字渐变与形状关系组织阅读。主信息有效字高 ≥56px、字幕 ≥40px、必要辅助信息 ≥32px，并按 480px 宽手机预览验收。拒绝单一纯色大铺底：背景、主色块、文字或光晕至少使用两层协调渐变。字幕默认无底框，不能遮住主视觉。\n\n请严格按照上面的导演手册实现：适用边界、内置视觉、分镜顺序、组件策略与验收标准。` + (selected.components?.length ? `\n\n本模板建议组件：${selected.components.join("、")}（可从 ${"@recut/remotion-kit"} 复用或参考实现）。` : "");
  }, [basePrompt, catalog, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">成片模板</span>
      <PreviewPicker
        items={Object.entries(catalog.scenarios).map(([id, item]) => ({ id, label: item.label, description: `${item.description} · ${item.components.join(" · ")}` }))}
        kind="composition"
        onChange={setValue}
        value={value}
        versionHint={kitVersionHint}
      />
    </div>
  );
};
