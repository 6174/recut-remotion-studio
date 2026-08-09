/**
 * [INPUT]: 依赖 Remotion 时间轴、Brief 数据与 preview/props.json；可选媒体素材经 media prop 注入
 * [OUTPUT]: 对外提供 ProjectVideo、getProjectMetadata
 * [POS]: remotion-skeleton 的主成片入口。默认项目是「接近空白」的标题页：只渲染一个
 *        通用的居中占位标题，供 AI 在此之上按所选模板（@recut/remotion-kit
 *        的 src/scenarios/<id>/template/ProjectVideo.tsx 作为完整参考）重建整支视频，
 *        不再预置长模板的默认 SCENES，避免 AI 先花时间删内容。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import React from "react";
import { AbsoluteFill } from "remotion";
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

export const ProjectVideo: React.FC<ProjectVideoProps> = () => {
  const topic = "你的视频标题";
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
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
        {topic}
      </h1>
    </AbsoluteFill>
  );
};
