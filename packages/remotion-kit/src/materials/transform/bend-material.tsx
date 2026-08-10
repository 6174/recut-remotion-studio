/**
 * [INPUT]: 依赖 Three Texture、Remotion 已计算的入场折转量与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlBendMaterial，在内容纹理 plane 上复现页面卷曲语义（顶点变形转场）
 * [POS]: remotion-kit/src/materials 的 transform Effect Node；只弯曲当前 Three mesh，不引入 DOM scroll 或独立动画循环
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { useMaterialUniforms } from "../shared/uniforms";

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

export interface HtmlBendMaterialProps {
  bend: number;
  texture: THREE.Texture;
}

export const HtmlBendMaterial: React.FC<HtmlBendMaterialProps> = ({
  bend,
  texture,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uBend: new THREE.Uniform(bend),
    }),
    (u) => {
      u.uBend.value = bend;
    },
  );

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
