/**
 * [INPUT]: 依赖 Remotion 帧时钟、@remotion/three、drei 光源与本目录参数化形状
 * [OUTPUT]: 对外提供可在 Player 中循环播放的 SplineLikeComposition
 * [POS]: spline-like.html 的确定性实验场景；用于验证材质缓冲、几何与运动，不进入正式成片
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Environment, Lightformer } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SplineLikeShape, SplineLikeTorus, type SplineLikeMaterial } from "./SplineLikeShape";

const GLASS: SplineLikeMaterial = { color: "#ffffff", roughness: 0.5, transmission: 0.95, thickness: 2, ior: 1.5, chromaticAberration: 1, anisotropy: 1, samples: 16, resolution: 256, background: "#fef4ef" };
const BANDS = [
  { color: "#823fff", position: [-1.12, -1.86, -0.52] as [number, number, number], width: 2.78, height: 1.22 },
  { color: "#ff718f", position: [-1.5, -0.66, -0.78] as [number, number, number], width: 2.3, height: 1.06 },
  { color: "#29c1a2", position: [-1.24, 1.22, -1.12] as [number, number, number], width: 2.16, height: 1.22 },
  { color: "#79c9ed", position: [1.46, 1.36, -1.38] as [number, number, number], width: 2.78, height: 1.36 },
  { color: "#ff9060", position: [1.36, -1.18, -0.94] as [number, number, number], width: 2.72, height: 1.18 },
];

const drift = (frame: number, phase: number) => Math.sin((frame + phase) / 42) * 0.18;

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return <>
    <ambientLight intensity={Math.PI} />
    <directionalLight intensity={0.6 * Math.PI} position={[0, 0, 10]} />
    <Environment resolution={256}><Lightformer intensity={4} position={[0, 4, 4]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} /></Environment>
    <group rotation={[-0.025, -0.055, -0.03]} scale={1.27}>
      {BANDS.map((band, index) => <group key={band.color} position={[0, drift(frame, index * 17), 0]}><SplineLikeShape depth={0.14} height={band.height} material={{ ...GLASS, color: band.color }} position={band.position} radius={Math.min(band.height * 0.45, 0.58)} rotation={[0, 0, -0.1]} width={band.width} /></group>)}
      <group position={[0, drift(frame, 60), 0]}><SplineLikeTorus majorRadius={1.26} material={GLASS} organic={0.045} position={[-0.08, 0.02, 0.22]} rotation={[0.035, -0.045, -0.1]} tubeRadius={0.43} verticalScale={1.16} /></group>
    </group>
  </>;
};

export const SPLINE_LIKE_DURATION = 240;

export const SplineLikeComposition: React.FC = () => {
  const { height, width } = useVideoConfig();
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#fef4ef", opacity }}><ThreeCanvas orthographic camera={{ position: [6, -5, 10], zoom: 62 }} dpr={[1, 2]} frameloop="demand" gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }} height={height} width={width}><color attach="background" args={["#fef4ef"]} /><Scene /></ThreeCanvas></AbsoluteFill>;
};
