/**
 * [INPUT]: 依赖模板目录和 preview/PreviewPicker 的 Remotion Player 演示
 * [OUTPUT]: 对外提供视觉模板选择场景，并生成带完整动效契约的编辑 Prompt
 * [POS]: scenarios 的模板入口；让用户先观看完整样片，再把同一叙事语言交给 AI
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { PreviewPicker } from "../preview/PreviewPicker";
import type { ScenarioProps } from "./types";

export const TemplateScenario: React.FC<ScenarioProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const [value, setValue] = useState(Object.keys(catalog.styleTemplates)[0] || "");
  const prompt = useMemo(() => {
    const selected = catalog.styleTemplates[value];
    return `${basePrompt}\n\n视觉模板：${value}（${selected?.label ?? ""}；${selected?.description ?? ""}；${selected?.motion ?? ""}）。把模板预览视为完整可播放的样片：保留“开场钩子 → 信息推进 → 结尾收束”的节奏，组合多个 Remotion 组件完成动画，而不是只替换一个静态背景或标题。`;
  }, [basePrompt, catalog, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">视觉模板</span>
      <PreviewPicker
        items={Object.entries(catalog.styleTemplates).map(([id, item]) => ({ id, label: item.label, description: `${item.description} · ${item.motion}` }))}
        kind="style"
        onChange={setValue}
        value={value}
        versionHint={kitVersionHint}
      />
    </div>
  );
};
