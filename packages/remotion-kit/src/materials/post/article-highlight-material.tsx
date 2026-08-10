/**
 * [INPUT]: 依赖 Three Texture、Remotion 已计算的帧与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlArticleHighlightMaterial，在中心文字保持锐利时渐进模糊上下信息
 * [POS]: remotion-kit/src/materials 的 post Effect Node；highlight 内容由对应内容层绘制，材质只执行 post-process
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float gauss1(float value, float sigma) {
    float sigmaSquared = sigma * sigma + 1e-6;
    return exp(-(value * value) / (2.0 * sigmaSquared));
  }

  void main() {
    vec2 pixel = 1.0 / uResolution;
    vec4 sharp = texture2D(uMap, vUv);
    float edgeY = abs(vUv.y - 0.5) * 2.0;
    float blurMix = pow(smoothstep(0.035, 0.62, edgeY), 1.06);
    float sigmaPixels = blurMix * 4.25 + 0.05;
    vec3 blurred = vec3(0.0);
    float totalWeight = 0.0;
    for (int y = -4; y <= 4; y++) {
      for (int x = -4; x <= 4; x++) {
        float weight = gauss1(float(x), sigmaPixels) * gauss1(float(y), sigmaPixels);
        vec2 sampleUv = clamp(vUv + pixel * vec2(float(x), float(y)), vec2(1e-4), vec2(1.0 - 1e-4));
        blurred += texture2D(uMap, sampleUv).rgb * weight;
        totalWeight += weight;
      }
    }
    vec3 color = mix(sharp.rgb, blurred / totalWeight, blurMix);
    vec2 centered = vUv * 2.0 - 1.0;
    centered.x *= uResolution.x / uResolution.y;
    color *= 1.0 - smoothstep(0.38, 1.02, length(centered)) * 0.13;
    gl_FragColor = vec4(color, sharp.a);
  }
`;

export interface HtmlArticleHighlightMaterialProps {
  height: number;
  texture: THREE.Texture;
  width: number;
}

export const HtmlArticleHighlightMaterial: React.FC<HtmlArticleHighlightMaterialProps> = ({
  height,
  texture,
  width,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
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
