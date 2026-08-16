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
import { useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import type { FineTuneProps } from "./FineTuneProps";

export const TemplateFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const locale = useRecutLocale();
  const [value, setValue] = useState(Object.keys(catalog.scenarios)[0] || "");
  const prompt = useMemo(() => {
    const selected = catalog.scenarios[value];
    if (!selected) return basePrompt;
    const skill = (selected as { skillBody?: string }).skillBody?.trim();
    const meta = t(locale, "template.meta", { value, label: selected.label ?? "", description: selected.description ?? "" });
    if (!skill) {
      return `${basePrompt}\n\n${meta}\n${t(locale, "template.components", { components: selected.components.join("、") ?? "" })}`;
    }
    // 完整 SKILL.md 就是这个场景的端到端参考：AI 先读它，再据此改写 composition。
    const componentsLine = selected.components?.length
      ? t(locale, "template.suggestedComponents", { components: selected.components.join("、") })
      : "";
    return `${basePrompt}\n\n${meta}\n\n${t(locale, "template.manualTitle")}\n\n${skill}\n\n${t(locale, "template.rebuildTitle")}\n\n${t(locale, "template.rebuild", { value })}\n\n${t(locale, "template.constraintTitle")}\n\n${t(locale, "prompt.videoConstraintBody")}\n\n${t(locale, "template.followRules")}${componentsLine}`;
  }, [basePrompt, catalog, locale, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">{t(locale, "template.label")}</span>
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
