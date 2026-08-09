/**
 * [INPUT]: 依赖 designSystems 目录与 preview/PreviewPicker 的可播放风格样片
 * [OUTPUT]: 对外提供设计系统选择场景，并生成 design.md 与风格组件的 Agent 约束
 * [POS]: scenarios 的视觉语法入口；与 TemplateScenario 的叙事/组件编排彻底解耦
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { PreviewPicker } from "../preview/PreviewPicker";
import type { ScenarioProps } from "./types";

export const StyleScenario: React.FC<ScenarioProps> = ({ catalog, basePrompt, kitVersionHint, onPrompt, onReady }) => {
  const [value, setValue] = useState(Object.keys(catalog.designSystems)[0] || "");
  const prompt = useMemo(() => {
    const selected = catalog.designSystems[value];
    return `${basePrompt}\n\n设计系统：${value}（${selected?.label ?? ""}；${selected?.description ?? ""}）。先调用 recut.design_system.get({ styleId: "${value}" }) 读取全局设计系统的 DESIGN.md + tokens.css（业务无关的抽象风格定义），再落到运行时 palette。设计系统决定色彩、字体、间距、形状和动效边界；不得改变当前成片场景的场景顺序或组件组合。`;
  }, [basePrompt, catalog, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return <div><span className="mb-1.5 block text-xs font-medium">设计系统</span><PreviewPicker items={Object.entries(catalog.designSystems).map(([id, item]) => ({ id, label: item.label, description: `${item.description} · ${item.motion}` }))} kind="style" onChange={setValue} value={value} versionHint={kitVersionHint} /></div>;
};
