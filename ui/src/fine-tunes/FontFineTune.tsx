/**
 * [INPUT]: 依赖 Recut CDN 字体目录、本机系统字体、fonts.select 后台操作与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 FontFineTune：区分 CDN 自托管 / 系统字体两类来源，搜索/脚本筛选、
 *          卡片真实预览（google 注入 CDN @font-face；system 本机直接渲染）、大预览只在
 *          选中时更新（hover 只高亮，避免跳动），并按当前选择组装的字体 Prompt
 * [POS]: remotion-studio/ui/fine-tunes 的字体微调动作；让 AI 经 @recut/remotion-kit/fonts
 *        加载所选家族并统一应用到正文与字幕，字体二进制来自 Recut 自有 CDN 或本机系统
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useEffect, useMemo, useState } from "react";
import { Check, Laptop, SearchX, Globe } from "lucide-react";
import { recut, useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import {
  buildFontItems,
  fontCssUrl,
  type FontCatalog,
  type FontItem,
} from "./catalog";
import type { FineTuneProps } from "./FineTuneProps";

type ScriptFilter = "all" | "zh";
type SourceFilter = "all" | "google" | "system";

const PREVIEW_LATIN = "Recut video 123";
/** 中文字体卡片用的短中文采样。 */
const PREVIEW_CJK_SAMPLE = "中文字体排版 123";
/** 大预览区第二行的中文采样。 */
const PREVIEW_CJK = "视频创作 · 中文字体排版示例";

const fullLoaded = new Set<string>();

/** 真加载一个 google 家族（镜像 apps/editor 的 loadFullFont）：注入 CDN css + document.fonts.load，卡片/预览才用真实字形。 */
async function loadPreviewFont(item: FontItem): Promise<void> {
  const family = item.family;
  if (fullLoaded.has(family)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontCssUrl(item.id ?? item.family);
  document.head.appendChild(link);
  await new Promise<void>((resolve) => {
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener("error", () => resolve(), { once: true });
  });
  const weights = item.weights.length ? item.weights : [400];
  try {
    await Promise.all(
      weights.map((weight) =>
        document.fonts.load(`${weight} 16px "${family.replace(/"/g, '\\"')}"`),
      ),
    );
  } catch {
    /* 回退系统字体 */
  }
  fullLoaded.add(family);
}

function FontPreviewCard({ item, active, onSelect, onHover }: { item: FontItem; active: boolean; onSelect: (item: FontItem) => void; onHover: (id: string | null) => void }) {
  // 只有 CDN 家族需要真加载；系统字体本机即用。
  const [ready, setReady] = useState(item.source !== "google");
  useEffect(() => {
    if (item.source !== "google") return;
    let cancelled = false;
    loadPreviewFont(item).then(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, [item]);
  return (
    <button
      className={`relative flex min-h-16 w-full flex-col justify-between rounded-xs border p-2 text-left outline-none ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`}
      onClick={() => onSelect(item)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      type="button"
    >
      {/* 主预览：含 zh 脚本的家族用中文样例展示字形风格；latin 家族显示家族名。 */}
      <span className="line-clamp-1 min-w-0 pr-6 text-base font-semibold leading-6" style={{ fontFamily: ready ? `"${item.family}", sans-serif` : undefined }}>
        {item.scripts.includes("zh") ? PREVIEW_CJK_SAMPLE : item.family}
      </span>
      <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] leading-3.5 text-muted-foreground">
        <span className="truncate">{item.family}</span>
        <span>{item.category}</span>
        {item.scripts.includes("zh") ? <span className="shrink-0 rounded-sm border border-primary/20 bg-primary/5 px-1 text-primary">中</span> : null}
        {item.source === "system" ? <span className="shrink-0 rounded-sm border border-border bg-muted/20 px-1 text-muted-foreground">本机</span> : null}
        <span className="shrink-0">{item.weights.join(" / ")}</span>
      </span>
      {active ? <span className="absolute right-2 top-2 grid size-3.5 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">✓</span> : null}
    </button>
  );
}

export const FontFineTune: React.FC<FineTuneProps> = ({ resources, basePrompt, onPrompt, onReady, onStatus }) => {
  const locale = useRecutLocale();
  const catalog: FontCatalog | null = resources?.fonts ?? null;
  const fonts = catalog?.google ?? [];

  const items = useMemo(() => buildFontItems(fonts), [fonts]);

  const [value, setValue] = useState("");
  const [, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [script, setScript] = useState<ScriptFilter>("all");
  const [source, setSource] = useState<SourceFilter>("all");

  const sorted = useMemo(() => [...items].sort((a, b) => a.family.localeCompare(b.family)), [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((item) => {
      if (source === "google" && item.source !== "google") return false;
      if (source === "system" && item.source !== "system") return false;
      if (script === "zh" && !item.scripts.includes("zh")) return false;
      if (!q) return true;
      return item.family.toLowerCase().includes(q) || (item.id ?? "").toLowerCase().includes(q);
    });
  }, [query, script, sorted, source]);

  const selected = items.find((item) => item.id === value) ?? null;

  // 大预览只在「选中」时更新（hover 只高亮卡片，不切换大预览，避免跳动）。
  useEffect(() => {
    if (selected && selected.source === "google") void loadPreviewFont(selected);
  }, [selected]);

  const prompt = useMemo(() => {
    if (!selected) return "";
    const sourceText =
      selected.source === "google"
        ? t(locale, "fonts.prompt.sourceGoogle", { id: selected.id ?? selected.family, cssUrl: fontCssUrl(selected.id!) })
        : t(locale, "fonts.prompt.sourceSystem");
    return t(locale, "fonts.prompt", {
      basePrompt,
      label: selected.family,
      family: selected.family,
      sourceText,
    });
  }, [basePrompt, locale, selected]);

  useEffect(() => { onPrompt(prompt); }, [onPrompt, prompt]);
  useEffect(() => { onReady(Boolean(selected)); }, [onReady, selected]);

  const select = (item: FontItem) => {
    const key = item.id === null ? item.family : item.id;
    setValue(key);
    // 系统字体无需物化，直接记录家族名；google 家族交给 render.js 物化本地。
    void recut.background
      .call("fonts.select", { familyId: key, source: item.source })
      .catch((cause: unknown) => onStatus(cause instanceof Error ? cause.message : t(locale, "fonts.selectFailed")));
  };

  if (!catalog || fonts.length === 0) {
    return <p className="text-xs leading-5 text-muted-foreground">{t(locale, "fonts.noCatalog")}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="h-8 min-w-0 flex-1 rounded-xs border border-border bg-muted/20 px-2.5 text-xs outline-none focus-visible:border-ring"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t(locale, "fonts.search")}
          value={query}
        />
        <div className="flex overflow-hidden rounded-xs border border-border">
          {(["all", "google", "system"] as SourceFilter[]).map((key) => (
            <button
              className={`flex h-8 items-center gap-1 px-2.5 text-[11px] outline-none ${source === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              key={key}
              onClick={() => setSource(key)}
              type="button"
            >
              {key === "google" ? <Globe className="size-3" /> : key === "system" ? <Laptop className="size-3" /> : null}
              {t(locale, `fonts.source.${key}`)}
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-xs border border-border">
          {(["all", "zh"] as ScriptFilter[]).map((key) => (
            <button
              className={`h-8 px-2.5 text-[11px] outline-none ${script === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              key={key}
              onClick={() => setScript(key)}
              type="button"
            >
              {t(locale, `fonts.script.${key}`)}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-xs border border-border bg-card">
        <div className="flex items-start justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">FONT PREVIEW</p>
            <h3 className="mt-1 flex items-center gap-2 truncate text-sm font-semibold">
              {selected ? selected.family : t(locale, "fonts.previewEmpty")}
              {selected ? (
                selected.source === "system"
                  ? <span className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-border bg-muted/20 px-1.5 text-[10px] font-medium text-muted-foreground"><Laptop className="size-3" />{t(locale, "fonts.source.system")}</span>
                  : <span className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-primary/20 bg-primary/5 px-1.5 text-[10px] font-medium text-primary"><Globe className="size-3" />{t(locale, "fonts.source.google")}</span>
              ) : null}
            </h3>
          </div>
          {selected ? (
            <span className="shrink-0 rounded-sm border border-border bg-muted/20 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {selected.category}{selected.scripts.includes("zh") ? " · 中" : ""} · {selected.weights.join("/")}
            </span>
          ) : null}
        </div>
        {/* 固定两行样例与固定高度：无论是否选中、是否含中文字形，区域高度恒定，避免切换跳动。 */}
        <div className="grid h-36 grid-rows-2 gap-1 border-t border-border bg-white/40 px-4 py-3">
          <p className="min-h-0 overflow-hidden text-2xl font-semibold leading-9 whitespace-nowrap" style={{ fontFamily: selected ? `"${selected.family}", sans-serif` : undefined }}>
            {PREVIEW_LATIN}
          </p>
          <p className="min-h-0 overflow-hidden text-xl font-medium leading-8 whitespace-nowrap" style={{ fontFamily: selected ? `"${selected.family}", sans-serif` : undefined }}>
            {PREVIEW_CJK}
          </p>
        </div>
        <div className="flex h-9 items-center overflow-hidden border-t border-border bg-muted/30 px-4 text-[10px] text-muted-foreground">
          <span className="truncate font-mono">{selected ? (selected.source === "google" ? fontCssUrl(selected.id!) : t(locale, "fonts.systemHint")) : "\u00a0"}</span>
        </div>
      </section>

      <div className="grid max-h-[280px] min-h-0 grid-cols-1 gap-1.5 overflow-y-auto rounded-xs border border-border bg-muted/10 p-2 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <FontPreviewCard key={`${item.source}-${item.family}`} item={item} active={item.id === value} onSelect={select} onHover={setHovered} />
        ))}
        {filtered.length === 0 ? (
          <p className="col-span-full flex items-center gap-2 px-2 py-4 text-xs text-muted-foreground">
            <SearchX className="size-4" />{t(locale, "fonts.empty")}
          </p>
        ) : null}
      </div>

      {selected ? (
        <p className="flex flex-wrap items-center gap-1.5 text-[10px] leading-4 text-muted-foreground">
          <Check className="size-3 text-primary" />
          <span className="text-primary">{selected.family}</span>
          <span>·</span>
          <span className="max-w-full truncate font-mono">{selected.source === "google" ? fontCssUrl(selected.id!) : selected.family}</span>
        </p>
      ) : null}
    </div>
  );
};