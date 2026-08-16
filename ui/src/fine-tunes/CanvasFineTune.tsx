/**
 * [INPUT]: 依赖画布目录、CanvasPicker 与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 CanvasFineTune，组装画幅适配提示
 * [POS]: fine-tunes 的画幅微调动作；不改变成片模板身份
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { CanvasPicker } from "../preview/CanvasPicker";
import { useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import type { FineTuneProps } from "./FineTuneProps";

export const CanvasFineTune: React.FC<FineTuneProps> = ({ catalog, basePrompt, onPrompt, onReady }) => {
  const locale = useRecutLocale();
  const [value, setValue] = useState(catalog.canvasSizes[0]?.id || "");
  const prompt = useMemo(() => {
    const selected = catalog.canvasSizes.find((item) => item.id === value);
    return `${basePrompt}\n\n${t(locale, "canvas.prompt", { label: selected?.label ?? value, width: String(selected?.width ?? ""), height: String(selected?.height ?? ""), fps: String(selected?.fps ?? "") })}`;
  }, [basePrompt, catalog.canvasSizes, locale, value]);
  useEffect(() => { onPrompt(prompt); onReady(true); }, [onPrompt, onReady, prompt]);
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">{t(locale, "canvas.label")}</span>
      <CanvasPicker items={catalog.canvasSizes} onChange={setValue} value={value} />
    </div>
  );
};
