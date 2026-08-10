/**
 * [INPUT]: 依赖 Three Texture、Remotion 已计算的入场折转量与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlBendMaterial，在 HTML texture plane 上复现 CanvasUI Bend 的页面卷曲语义
 * [POS]: composition-graph 的转场 Effect Node；只弯曲当前 Three mesh，不引入 DOM scroll 或独立动画循环
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uBend;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 transformed = position;
    float fold = (uv.y - 0.5) * uBend * 2.1;
    transformed.y *= cos(fold);
    transformed.z += abs(transformed.y) * sin(abs(fold)) * 0.92;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(uMap, vUv);
  }
`;

export const HtmlBendMaterial: React.FC<{
  bend: number;
  texture: THREE.Texture;
}> = ({ bend, texture }) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uMap: new THREE.Uniform(texture),
      uBend: new THREE.Uniform(bend),
    }),
    [texture],
  );
  useLayoutEffect(() => {
    if (material.current) material.current.uniforms.uBend.value = bend;
  }, [bend]);
  return (
    <shaderMaterial
      ref={material}
      fragmentShader={fragmentShader}
      side={THREE.DoubleSide}
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={vertexShader}
    />
  );
};
