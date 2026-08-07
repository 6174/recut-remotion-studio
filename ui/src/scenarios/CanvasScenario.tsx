import { useEffect, useMemo, useState } from "react";
import { CanvasPicker } from "../preview/CanvasPicker";
import type { ScenarioProps } from "./types";

export const CanvasScenario: React.FC<ScenarioProps> = ({ catalog, basePrompt, onPrompt, onReady }) => {
  const [value, setValue] = useState(catalog.canvasSizes[0]?.id || "");
  const prompt = useMemo(() => {
    const selected = catalog.canvasSizes.find((item) => item.id === value);
    return `${basePrompt}\n\n目标画布：${selected?.label ?? value}（${selected?.width ?? ""}×${selected?.height ?? ""}，${selected?.fps ?? ""} fps）`;
  }, [basePrompt, catalog, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">目标画布</span>
      <CanvasPicker items={catalog.canvasSizes} onChange={setValue} value={value} />
    </div>
  );
};
