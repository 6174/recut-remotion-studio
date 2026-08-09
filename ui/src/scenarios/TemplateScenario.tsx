/**
 * [INPUT]: 依赖 scenarios 目录（含每场景完整 SKILL.md 导演手册）和 preview/PreviewPicker 的 Remotion Player 演示
 * [OUTPUT]: 对外提供成片场景选择（场景 = 做什么样的视频）。生成的 Prompt 包含该场景的
 *           SKILL.md 全文（端到端参考：适用 / 内置视觉 / 分镜策略 / 组件策略 / 验收），
 *           AI 据此完整实现，而不是一句空泛的“改造成模板”指令。
 * [POS]: scenarios 的场景入口；场景是用户端到端的参考——可引用公共组件，但内部有自己的
 *        组件、视觉原语与导演规划逻辑（见对应 SKILL.md）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { PreviewPicker } from "../preview/PreviewPicker";
import type { ScenarioProps } from "./types";

export const TemplateScenario: React.FC<ScenarioProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const [value, setValue] = useState(Object.keys(catalog.scenarios)[0] || "");
  const prompt = useMemo(() => {
    const selected = catalog.scenarios[value];
    if (!selected) return basePrompt;
    const skill = (selected as { skillBody?: string }).skillBody?.trim();
    const meta = `成片场景：${value}（${selected.label ?? ""}；${selected.description ?? ""}）。`;
    if (!skill) {
      return `${basePrompt}\n\n${meta}\n组件：${selected.components.join("、") ?? ""}。请按场景结构实现。`;
    }
    // 完整 SKILL.md 就是这个场景的端到端参考：AI 先读它，再据此改写 composition。
    return `${basePrompt}\n\n${meta}\n\n## 该场景的完整导演手册（SKILL.md）\n\n${skill}\n\n请严格按照上面的导演手册实现：适用边界、内置视觉、分镜顺序、组件策略与验收标准。` + (selected.components?.length ? `\n\n本场景建议组件：${selected.components.join("、")}（可从 ${"@recut/remotion-kit"} 复用或参考实现）。` : "");
  }, [basePrompt, catalog, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">成片场景</span>
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
