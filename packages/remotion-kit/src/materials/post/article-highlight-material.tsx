/**
 * [INPUT]: 依赖 Three Texture、Remotion 已计算的帧与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlArticleHighlightMaterial，以黄色 marker 从左向右划出焦点文字，并渐进模糊上下信息
 * [POS]: remotion-kit/src/materials 的 post Effect Node；由 center、marker 尺寸与镜头进度声明焦点，不依赖额外内容层
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

// Ported from remotion-dev/html-in-canvas/src/ArticleHighlight/gl.ts (FS),
// with a wider kernel and a tunable intensity so the shallow-focus blur is visible at 1080p.
const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uIntensity;
  uniform float uTime;
  uniform vec2 uCenter;
  uniform vec2 uMarkerHalf;
  uniform float uProgress;
  varying vec2 vUv;

  float gauss1(float value, float sigma) {
    float sigmaSquared = sigma * sigma + 1e-6;
    return exp(-(value * value) / (2.0 * sigmaSquared));
  }

  float markerMask(vec2 uv) {
    vec2 lower = uCenter - uMarkerHalf;
    vec2 upper = uCenter + uMarkerHalf;
    float revealedX = mix(lower.x, upper.x, smoothstep(0.1, 0.46, uProgress));
    float vertical = smoothstep(lower.y - 0.008, lower.y + 0.012, uv.y)
      * (1.0 - smoothstep(upper.y - 0.012, upper.y + 0.008, uv.y));
    float horizontal = smoothstep(lower.x - 0.006, lower.x + 0.014, uv.x)
      * (1.0 - smoothstep(revealedX - 0.014, revealedX + 0.006, uv.x));
    float paper = 0.88 + 0.12 * sin(uv.x * 780.0 + uv.y * 117.0);
    return vertical * horizontal * paper;
  }

  void main() {
    vec2 pixel = 1.0 / uResolution;
    vec4 sharp = texture2D(uMap, vUv);
    // 焦点与高亮 marker 共用锚点，避免清晰带漂离正在强调的文字。
    float sharpY = uCenter.y;
    float edgeY = abs(vUv.y - sharpY) * 2.0;
    float blurMix = pow(smoothstep(0.035, 0.62, edgeY), 1.06);
    float sigmaPixels = blurMix * (2.0 + 9.0 * uIntensity) + 0.05;
    vec3 blurred = vec3(0.0);
    float totalWeight = 0.0;
    for (int y = -6; y <= 6; y++) {
      for (int x = -6; x <= 6; x++) {
        float weight = gauss1(float(x), sigmaPixels) * gauss1(float(y), sigmaPixels);
        vec2 sampleUv = clamp(vUv + pixel * vec2(float(x), float(y)), vec2(1e-4), vec2(1.0 - 1e-4));
        blurred += texture2D(uMap, sampleUv).rgb * weight;
        totalWeight += weight;
      }
    }
    vec3 color = mix(sharp.rgb, blurred / totalWeight, blurMix);
    float marker = markerMask(vUv) * clamp(uIntensity, 0.0, 2.0);
    // 乘法混合模拟真实 marker：白纸变黄，黑色正文保持黑色，文字仍在笔划之上。
    color *= mix(vec3(1.0), vec3(1.0, 0.88, 0.12), 0.88 * marker);
    vec2 centered = vUv * 2.0 - 1.0;
    centered.x *= uResolution.x / uResolution.y;
    color *= 1.0 - smoothstep(0.38, 1.02, length(centered)) * 0.13;
    gl_FragColor = vec4(color, sharp.a);
  }
`;

export interface HtmlArticleHighlightMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  intensity?: number;
  center?: readonly [number, number];
  markerWidth?: number;
  markerHeight?: number;
  progress?: number;
}

export const HtmlArticleHighlightMaterial: React.FC<HtmlArticleHighlightMaterialProps> = ({
  height,
  texture,
  time,
  width,
  intensity = 1,
  center = [0.5, 0.5],
  markerWidth = 0.54,
  markerHeight = 0.115,
  progress = 1,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uIntensity: new THREE.Uniform(intensity),
      uTime: new THREE.Uniform(time),
      uCenter: new THREE.Uniform(new THREE.Vector2(center[0], center[1])),
      uMarkerHalf: new THREE.Uniform(new THREE.Vector2(markerWidth / 2, markerHeight / 2)),
      uProgress: new THREE.Uniform(progress),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uIntensity.value = intensity;
      u.uTime.value = time;
      u.uCenter.value.set(center[0], center[1]);
      u.uMarkerHalf.value.set(markerWidth / 2, markerHeight / 2);
      u.uProgress.value = progress;
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
