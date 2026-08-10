/**
 * [INPUT]: 依赖 Remotion AbsoluteFill、视频规格与 @remotion/three 的 ThreeCanvas
 * [OUTPUT]: 对外提供 CompositionGraphComposition 作为时间驱动的 GPU Composition 根
 * [POS]: composition-graph 的 runtime bridge；Remotion 管时间与导出，ThreeCanvas 管 GPU 合成
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { CompositionGraphScene } from "./scene";
import { GRAPH_DURATION_IN_FRAMES } from "./timeline";

export { GRAPH_DURATION_IN_FRAMES } from "./timeline";

export interface CompositionGraphProps {
  htmlAnimation: boolean;
  htmlRasterizer: "foreign-object" | "html-in-canvas";
  magnify: boolean;
}

export const CompositionGraphComposition: React.FC<CompositionGraphProps> = ({
  htmlAnimation,
  htmlRasterizer,
  magnify,
}) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#071019" }}>
      <ThreeCanvas
        camera={{ fov: 34, position: [0, 0, 8] }}
        dpr={[1, 2]}
        frameloop="demand"
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        height={height}
        width={width}
      >
        <CompositionGraphScene
          htmlAnimation={htmlAnimation}
          htmlRasterizer={htmlRasterizer}
          magnify={magnify}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
