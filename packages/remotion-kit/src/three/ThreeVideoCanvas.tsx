/**
 * [INPUT]: 依赖 @remotion/three 的 ThreeCanvas、Remotion AbsoluteFill、视频规格与 CameraDirector
 * [OUTPUT]: 对外提供 ThreeVideoCanvas，作为时间驱动 GPU Composition 与逐镜头 Three camera 的统一根
 * [POS]: remotion-kit/src/three 的 runtime bridge；Remotion 管时间与导出，ThreeCanvas/CameraDirector 管 GPU 合成与机位。
 *        成片与空白项目共用此根，保证空项目与成片同构。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { CameraDirector } from "./CameraDirector";
import type { CameraDescriptor, CameraMoveDescriptor } from "./types";

const STAGE_PLANE_HEIGHT = 4.9;

export interface ThreeVideoCanvasProps {
  /** 场景节点（shot graph / 内容平面 / 材质）；与 children 二选一 */
  scene?: React.ReactNode;
  /** JSX children 形式的场景节点；与 scene 二选一 */
  children?: React.ReactNode;
  /** 背景色（默认 Recut 深色画布 #070c08，即 oklch(0.145 0.012 150) 的 sRGB 近似） */
  background?: string;
  camera?: CameraDescriptor;
  /** 当前 Shot 的真实相机轨道；省略时维持静态默认机位。 */
  cameraMove?: CameraMoveDescriptor;
  /** 当前 Shot 局部进度 0..1；由 ShotGraph 的单一时钟提供。 */
  cameraProgress?: number;
}

/**
 * 统一 GPU 根：demand frameloop + high-performance GPU，透明度关闭。
 * 场景内可见画面只由 R3F/Three nodes 绘制；HTML 以纹理输入存在于不可见 host。
 */
export const ThreeVideoCanvas: React.FC<ThreeVideoCanvasProps> = ({
  scene,
  children,
  background = "#070c08",
  camera,
  cameraMove,
  cameraProgress = 0,
}) => {
  const { width, height } = useVideoConfig();
  const fallbackCamera: CameraDescriptor = {
    fov: camera?.fov ?? 34,
    position: camera?.position ?? [0, 0, 8],
  };
  return (
    <AbsoluteFill style={{ background }}>
      <ThreeCanvas
        camera={{
          fov: camera?.fov ?? 34,
          position: camera?.position ?? [0, 0, 8],
        }}
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
        <color attach="background" args={[background]} />
        <CameraDirector
          fallback={fallbackCamera}
          move={cameraMove}
          planeHeight={STAGE_PLANE_HEIGHT}
          planeWidth={(width / height) * STAGE_PLANE_HEIGHT}
          progress={cameraProgress}
        />
        {scene ?? children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
