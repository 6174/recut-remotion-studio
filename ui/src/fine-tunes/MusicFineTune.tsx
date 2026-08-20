/**
 * [INPUT]: 依赖 Recut CDN 音乐目录与 FineTuneProps 回调
 * [OUTPUT]: 对外提供 MusicFineTune：在网格中直接试听与选择，选择即生成携带下载指令的配乐
 *          Prompt（曲目 CDN url、workspace 目标路径与合规信息），并立即把 url 写入预览；
 *          后台异步 music.import 物化平台 Asset，完成后补充 assetId
 * [POS]: remotion-studio/ui/fine-tunes 的配乐微调动作；曲目来自 catalog-first 的 CDN 目录，
 *        预览先使用当前选择的 url，预览与导出在 Asset 物化后共享同一 selected metadata
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Pause, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { recut, useRecutLocale } from "../recut-sdk";
import { t } from "../i18n";
import { audioAssetUrl, type MusicCatalog, type MusicTrack } from "./catalog";
import type { FineTuneProps } from "./FineTuneProps";

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export const MusicFineTune: React.FC<FineTuneProps> = ({ resources, basePrompt, onPrompt, onReady, onStatus, onMusicSelected }) => {
  const locale = useRecutLocale();
  const catalog: MusicCatalog | null = resources?.music ?? null;
  const tracks = catalog?.music ?? [];

  const [value, setValue] = useState<string>("");
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectionRef = useRef(0);

  const selected = tracks.find((item) => item.id === value) ?? null;

  const stopPreview = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(null);
  }, []);

  useEffect(() => () => stopPreview(), [stopPreview]);

  useEffect(() => {
    let cancelled = false;
    void recut.background.call("music.selected", {}).then((current: { trackId?: string | null; selectedAt?: number | null }) => {
      if (!cancelled && current?.trackId) {
        selectionRef.current = Number(current.selectedAt) || 0;
        setValue(current.trackId);
      }
    }).catch(() => { /* 初始选择读取失败时保留空状态。 */ });
    return () => { cancelled = true; };
  }, []);

  // 选择即生成下载指令 Prompt；同时先写入 url 让预览立即跟随，再异步物化平台 Asset。
  const selectTrack = useCallback(
    (track: MusicTrack) => {
      stopPreview();
      setValue(track.id);
      const selectedAt = Math.max(Date.now(), selectionRef.current + 1);
      selectionRef.current = selectedAt;
      const url = audioAssetUrl(track.url);
      // 先把当前选择写入 UI 工作面，预览立即跟随；资产导入完成后补上
      // assetId，保证导出与预览最终使用同一份选择，而不是旧的 selected 记录。
      onMusicSelected?.({ trackId: track.id, url, track, selectedAt });
      void recut.background.call("music.import", {
        trackId: track.id,
        selectedAt,
        url,
        name: track.name,
        duration: track.duration,
        license: track.license,
        source: track.source,
        attribution: track.attribution,
      }).then((result: { assetId?: string | null; url?: string | null; stale?: boolean }) => {
        // 用户快速切换曲目时，旧请求完成不能覆盖最新选择。
        if (selectionRef.current !== selectedAt || result?.stale) return;
        onMusicSelected?.({ trackId: track.id, url: result?.url || url, assetId: result?.assetId ?? null, track, selectedAt });
      }).catch((error: unknown) => {
        if (selectionRef.current !== selectedAt) return;
        onStatus(error instanceof Error ? error.message : t(locale, "music.importFailed"));
      });
      onPrompt(
        t(locale, "music.prompt", {
          basePrompt,
          name: track.name,
          duration: formatDuration(track.duration),
          styles: track.styles.join("、") || "-",
          moods: track.moods.join("、") || "-",
          url,
          target: `audio/music/${track.id}.mp3`,
          license: track.license,
          source: track.source,
          attribution: track.attribution,
        }),
      );
      onReady(true);
    },
    [basePrompt, locale, onMusicSelected, onPrompt, onReady, onStatus, stopPreview],
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
            <span className="flex items-center gap-1.5 font-medium text-primary">
              <Check className="size-3.5" />{t(locale, "music.selectedStatus")} · {selected.source ? t(locale, "music.attribution") + selected.source : ""}
            </span>
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
