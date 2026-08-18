/**
 * [INPUT]: 依赖 Recut CDN 音乐目录、music.import 后台操作与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 MusicFineTune：在网格中直接试听与选择，选择即生成配乐 Prompt 并
 *          「选择即导入」为媒体资产（幂等）；导入完成后 Prompt 携带 assetId 与合规信息
 * [POS]: remotion-studio/ui/fine-tunes 的配乐微调动作；曲目来自 catalog-first 的 CDN 目录，
 *        后台仅下载所选 mp3 并导入，用户不接触导入/移除等内部机制
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Pause, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { recut, useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import { audioAssetUrl, type MusicCatalog, type MusicTrack } from "./catalog";
import type { FineTuneProps } from "./FineTuneProps";

interface ImportResult {
  assetId: string | null;
  track?: MusicTrack | null;
}

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export const MusicFineTune: React.FC<FineTuneProps> = ({ resources, basePrompt, onPrompt, onReady, onStatus }) => {
  const locale = useRecutLocale();
  const catalog: MusicCatalog | null = resources?.music ?? null;
  const tracks = catalog?.music ?? [];

  const [value, setValue] = useState<string>("");
  const [playing, setPlaying] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingRef = useRef(false);

  const selected = tracks.find((item) => item.id === value) ?? null;

  const stopPreview = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(null);
  }, []);

  useEffect(() => () => stopPreview(), [stopPreview]);

  // 选择即导入（幂等）。后台仅下载所选 mp3 为文件并导入为媒体资产；
  // 成功才把 assetId 交还，Prompt 依此填写。失败时在选中卡显示可读原因。
  const importTrack = useCallback(
    async (track: MusicTrack) => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      setImporting(true);
      setError(null);
      setAssetId(null);
      try {
        const result = (await recut.background.call("music.import", {
          trackId: track.id,
          url: audioAssetUrl(track.url),
          name: track.name,
          duration: track.duration,
          license: track.license,
          source: track.source,
          attribution: track.attribution,
        })) as ImportResult;
        setAssetId(result?.assetId ?? null);
        if (!result?.assetId) setError(t(locale, "music.importFailed"));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : t(locale, "music.importFailed"));
      } finally {
        pendingRef.current = false;
        setImporting(false);
      }
    },
    [locale],
  );

  const selectTrack = useCallback(
    (track: MusicTrack) => {
      stopPreview();
      setValue(track.id);
      // 幂等命中已导入资产：后续会写入 app_meta，导出/预览经 music.selected 读取。
      setAssetId(null);
      void importTrack(track);
    },
    [importTrack, stopPreview],
  );

  const previewPlay = useCallback(
    (track: MusicTrack) => {
      if (playing === track.id) {
        stopPreview();
        return;
      }
      stopPreview();
      const audio = new Audio(audioAssetUrl(track.url));
      audio.preload = "metadata";
      audio.addEventListener("ended", () => {
        audioRef.current = null;
        setPlaying(null);
      });
      audio.addEventListener("error", () => {
        audioRef.current = null;
        setPlaying(null);
        onStatus(t(locale, "music.playFailed"));
      });
      audioRef.current = audio;
      setPlaying(track.id);
      audio.play().catch(() => {
        audioRef.current = null;
        setPlaying(null);
      });
    },
    [locale, onStatus, playing, stopPreview],
  );

  // Prompt 只在选中且导入成功后完整生成并 onReady，避免「空 Prompt」可提交。
  const prompt = useMemo(() => {
    if (!selected || !assetId) return "";
    return t(locale, "music.prompt", {
      basePrompt,
      name: selected.name,
      duration: formatDuration(selected.duration),
      styles: selected.styles.join("、") || "-",
      moods: selected.moods.join("、") || "-",
      assetId,
      license: selected.license,
      source: selected.source,
      attribution: selected.attribution,
    });
  }, [assetId, basePrompt, locale, selected]);

  useEffect(() => { onPrompt(prompt); }, [onPrompt, prompt]);
  useEffect(() => { onReady(Boolean(selected && assetId)); }, [onReady, selected, assetId]);

  if (!catalog || tracks.length === 0) {
    return <p className="text-xs leading-5 text-muted-foreground">{t(locale, "music.noCatalog")}</p>;
  }

  return (
    <div className="space-y-3">
      {selected ? (
        <section className="overflow-hidden rounded-xs border border-primary/25 bg-primary/5">
          <div className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary">SELECTED TRACK</p>
              <h3 className="mt-1 truncate text-sm font-semibold">{selected.name}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] leading-4 text-muted-foreground">
                <span>{formatDuration(selected.duration)}</span>
                {selected.styles.length ? <span>· {selected.styles.join(" / ")}</span> : null}
                <span>· {selected.license}</span>
              </p>
            </div>
            <Button className="px-2 text-[11px]" onClick={() => void previewPlay(selected)} type="button" variant="outline">
              {playing === selected.id ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {t(locale, "music.preview")}
            </Button>
          </div>
          <div className="border-t border-primary/15 px-4 py-2 text-[11px]">
            {importing ? (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />{t(locale, "music.importing")}
              </span>
            ) : error ? (
              <span className="text-destructive">{error}</span>
            ) : assetId ? (
              <span className="flex items-center gap-1.5 font-medium text-primary">
                <Check className="size-3.5" />{t(locale, "music.imported")} · {selected.source ? t(locale, "music.attribution") + selected.source : ""}
              </span>
            ) : null}
          </div>
        </section>
      ) : (
        <p className="text-xs leading-5 text-muted-foreground">{t(locale, "music.hint")}</p>
      )}

      <div className="grid max-h-[320px] min-h-0 grid-cols-1 gap-1.5 overflow-y-auto rounded-xs border border-border bg-muted/10 p-2 sm:grid-cols-2 xl:grid-cols-3">
        {tracks.map((track) => {
          const active = track.id === value;
          return (
            <button
              className={`relative flex min-h-16 w-full flex-col justify-between rounded-xs border p-2 text-left outline-none ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/40"}`}
              key={track.id}
              onClick={() => selectTrack(track)}
              type="button"
            >
              <span className="min-w-0 pr-4 text-xs font-semibold leading-4">{track.name}</span>
              <span className="mt-1 line-clamp-1 min-w-0 text-[10px] leading-3.5 text-muted-foreground">
                {formatDuration(track.duration)} · {track.styles.join("/") || "-"}
              </span>
              {active ? <span className="absolute right-2 top-2 grid size-3.5 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">✓</span> : null}
              {playing === track.id ? <span className="absolute right-2 top-8 text-[10px] text-primary">♪</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};