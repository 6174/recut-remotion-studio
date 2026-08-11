/**
 * [INPUT]: 依赖 Three、R3F ShaderMaterial 与 shared/uniforms
 * [OUTPUT]: 对外提供 SlideTransitionMaterial：B 推入、A 推出（remotion slide 概念，方向可配）
 * [POS]: remotion-kit/src/materials/transition 的 A/B 转场材质；确定性、可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";
import type { ABTransitionProps } from "./types";

const fragmentShader = `
  uniform sampler2D uMapA;
  uniform sampler2D uMapB;
  uniform float uProgress;
  uniform float uHorizontal;
  uniform float uSign;
  varying vec2 vUv;

  void main() {
    float p = clamp(uProgress, 0.001, 0.999);
    vec2 uvA = vUv;
    vec2 uvB = vUv;
    if (uHorizontal > 0.5) {
      // A 压缩在 [0, p]，B 压缩在 [p, 1]，一起向 uSign 方向滑动
      if (uSign > 0.5) {
        uvA.x = vUv.x / p;
        uvB.x = (vUv.x - p) / (1.0 - p);
      } else {
        float boundary = 1.0 - p;
        uvA.x = vUv.x / boundary;
        uvB.x = (vUv.x - boundary) / p;
      }
    } else {
      if (uSign > 0.5) {
        uvA.y = vUv.y / p;
        uvB.y = (vUv.y - p) / (1.0 - p);
      } else {
        float boundary = 1.0 - p;
        uvA.y = vUv.y / boundary;
        uvB.y = (vUv.y - boundary) / p;
      }
    }
    bool showB = uHorizontal > 0.5
      ? (uSign > 0.5 ? vUv.x >= p : vUv.x < 1.0 - p)
      : (uSign > 0.5 ? vUv.y >= p : vUv.y < 1.0 - p);
    vec3 color = showB
      ? texture2D(uMapB, clamp(uvB, 0.001, 0.999)).rgb
      : texture2D(uMapA, clamp(uvA, 0.001, 0.999)).rgb;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface SlideTransitionMaterialProps extends ABTransitionProps {
  direction?: "from-left" | "from-right" | "from-top" | "from-bottom";
}

export const SlideTransitionMaterial: React.FC<SlideTransitionMaterialProps> = ({
  mapA,
  mapB,
  progress,
  width,
  height,
  direction = "from-left",
}) => {
  const horizontal = direction === "from-left" || direction === "from-right";
  const sign = direction === "from-left" || direction === "from-top" ? 1 : 0;
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMapA: new THREE.Uniform(mapA),
      uMapB: new THREE.Uniform(mapB),
      uProgress: new THREE.Uniform(progress),
      uHorizontal: new THREE.Uniform(horizontal ? 1 : 0),
      uSign: new THREE.Uniform(sign),
    }),
    (u) => {
      u.uMapA.value = mapA;
      u.uMapB.value = mapB;
      u.uProgress.value = progress;
      u.uHorizontal.value = horizontal ? 1 : 0;
      u.uSign.value = sign;
    },
  );

  return (
    <shaderMaterial
      ref={material}
      fragmentShader={fragmentShader}
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={PASSTHROUGH_VERTEX}
    />
  );
};
