import React from "react";
import { Composition } from "remotion";
import { ProjectVideo, getProjectMetadata } from "./compositions/ProjectVideo";
import { defaultProjectVideoProps } from "./types";

/**
 * Remotion root for the per-project composition workspace. durationInFrames,
 * fps and canvas size are computed from settings + the ProjectVideo scenes so
 * one workspace serves any script, aspect ratio and frame rate.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ProjectVideo"
      component={ProjectVideo}
      durationInFrames={30}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProjectVideoProps()}
      calculateMetadata={({ props }) => getProjectMetadata(props)}
    />
  );
};
