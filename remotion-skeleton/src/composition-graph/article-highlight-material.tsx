/**
 * [INPUT]: 依赖 Three Texture、ArticleHighlight/gl.ts 的 9x9 progressive Gaussian blur 与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlArticleHighlightMaterial，在中心文字保持锐利时渐进模糊上下信息
 * [POS]: composition-graph 的 ArticleHighlight Effect Node；highlight 内容由对应 React shot 绘制，材质只执行上游 post-process
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Ported from remotion-dev/html-in-canvas/src/ArticleHighlight/gl.ts (FS).
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

export const HtmlArticleHighlightMaterial: React.FC<{
  height: number;
  texture: THREE.Texture;
  width: number;
}> = ({ height, texture, width }) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
    }),
    [height, texture, width],
  );
  useLayoutEffect(() => {
    material.current?.uniforms.uResolution.value.set(width, height);
  }, [height, width]);
  return (
    <shaderMaterial
      ref={material}
      fragmentShader={fragmentShader}
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={vertexShader}
    />
  );
};
