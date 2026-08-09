/**
 * [INPUT]: 依赖 Remotion 时间轴、Brief/MediaMap 数据与 @recut/remotion-kit 的场景模板
 * [OUTPUT]: 对外提供 ProjectVideo、getProjectMetadata
 * [POS]: remotion-skeleton 的主成片编排器：按 brief.template 路由到对应场景模板。
 *        每个场景模板自带内置视觉（palette）+ beat 渲染器 + 默认 20~30s SCENES
 *        （导演视角见场景 SKILL.md）；视觉风格内敛进场景，不依赖全局设计系统。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 *
 * 模板 = 场景 × 风格：
 *   - 场景（scenario，brief.template）：路由到 @recut/remotion-kit 的 src/scenarios/<id>/
 *     （ProductLaunchVideo / FacelessExplainerVideo，每个自带 palette + beats + 默认 SCENES）；
 *   - 换风格走外层 design-system 迭代，不在场景模板职责内。
 */
import React from "react";
import { FACELESS_EXPLAINER_DURATION_SEC, FacelessExplainerVideo, PRODUCT_LAUNCH_DURATION_SEC, ProductLaunchVideo } from "@recut/remotion-kit";
import { resolveMediaUrl } from "../runtime/media";
import type { MediaMap, ProjectVideoProps } from "../types";

export const SCENARIO_DURATION_SEC: Record<string, number> = {
  "product-launch": PRODUCT_LAUNCH_DURATION_SEC,
  "faceless-explainer": FACELESS_EXPLAINER_DURATION_SEC,
};

export const getProjectMetadata = (props: ProjectVideoProps) => {
  const fps = props.settings?.fps ?? 30;
  const width = props.settings?.width ?? 1920;
  const height = props.settings?.height ?? 1080;
  const scenario = props.brief?.template || "faceless-explainer";
  const durationInFrames = Math.max(1, Math.round((SCENARIO_DURATION_SEC[scenario] || FACELESS_EXPLAINER_DURATION_SEC) * fps));
  return { durationInFrames, fps, width, height };
};

export const ProjectVideo: React.FC<ProjectVideoProps> = ({ brief, media }) => {
  const scenario = brief?.template || "faceless-explainer";
  const mediaMap = media as MediaMap | undefined;
  const mediaResolver = (assetId: string) => resolveMediaUrl(assetId, mediaMap);
  const common = {
    topic: brief?.topic,
    resolveMediaUrl: mediaResolver,
    bgmAssetId: brief?.materialAssetIds?.[0] ? undefined : null,
  };
  if (scenario === "product-launch") {
    return <ProductLaunchVideo {...common} productName={brief?.details} />;
  }
  return <FacelessExplainerVideo {...common} />;
};
