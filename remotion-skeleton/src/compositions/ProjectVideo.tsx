/**
 * [INPUT]: 依赖 @recut/remotion-kit/three 的 ShotGraph、Remotion 帧时钟与 Brief 数据
 * [OUTPUT]: 对外提供 ProjectVideo、getProjectMetadata
 * [POS]: remotion-skeleton 的主成片入口。默认项目是「接近空白」的标题页：走 Three-first GPU 根
 *        （ShotGraph，内容经 HtmlSurfaceProvider 光栅化），供 AI 在此之上按所选模板重建整支视频。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig } from "remotion";
import { ShotGraph } from "@recut/remotion-kit/three";
import type { ShotGraphPlan } from "@recut/remotion-kit/three";
import { FontProvider } from "@recut/remotion-kit";
import { resolveMediaUrl } from "../runtime/media";
import type { ProjectVideoProps } from "../types";

/** 默认空项目时长（秒）：只有一页标题，AI 重建时会改写。 */
export const BLANK_PROJECT_DURATION_SEC = 10;

export const getProjectMetadata = (props: ProjectVideoProps) => {
  const fps = props.settings?.fps ?? 30;
  const width = props.settings?.width ?? 1920;
  const height = props.settings?.height ?? 1080;
  const durationInFrames = Math.max(1, Math.round(BLANK_PROJECT_DURATION_SEC * fps));
  return { durationInFrames, fps, width, height };
};

/** 空白标题内容：运行在真实 React 树内（hooks 可用），逐帧淡入。 */
const BlankTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = Math.min(1, frame / 20);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: 80,
      }}
    >
      <div
        style={{
          opacity: fade,
          transform: `scale(${1 - (1 - fade) * 0.04})`,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#111111",
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.15,
            textAlign: "center",
            maxWidth: 1600,
          }}
        >
          你的视频标题
        </h1>
        <p
          style={{
            margin: "24px 0 0",
            color: "#666666",
            fontSize: 32,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          按所选模板重建整支视频（Three-first GPU 合成）
        </p>
      </div>
    </div>
  );
};

export const ProjectVideo: React.FC<ProjectVideoProps> = ({ music, media, fonts }) => {
  const { fps } = useVideoConfig();
  const plan: ShotGraphPlan = {
    durationInFrames: BLANK_PROJECT_DURATION_SEC * fps,
    shots: [{ id: "blank", content: "html" }],
  };
  const bgmSrc = music?.assetId ? resolveMediaUrl(music.assetId, media) : undefined;
  // google 家族经 css 物化（预览=CDN、渲染=本地 /fonts/{id}.css）注入；system 家族本机直接用。
  const fontEntries = Object.entries(fonts ?? {}).filter(
    ([, entry]) => entry && typeof entry === "object" && !entry.system && typeof entry.css === "string" && entry.css.length > 0,
  );
  return (
    <AbsoluteFill>
      {/* 每个选中且已物化的 google 字体注入其 css，渲染 null、不重复挂载内容。 */}
      {fontEntries.map(([id, entry]) => (
        <FontProvider key={id} id={id} css={entry.css} />
      ))}
      <ShotGraph plan={plan} background="#ffffff" renderContent={() => <BlankTitle />} />
      {bgmSrc ? <Audio src={bgmSrc} /> : null}
    </AbsoluteFill>
  );
};
