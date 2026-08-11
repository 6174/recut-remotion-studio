/**
 * [INPUT]: 依赖 Three Texture、Remotion 派生焦点框/进度与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 TextFocusMaterial，以圆角焦点框锁定内容锐利、其余画面渐进虚化（post，文本专属）
 * [POS]: remotion-kit/src/materials 的 post Effect Node；焦点框与进度由 MaterialElement 的语义 options 派生，确定性、可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform vec2 uFocusOrigin;
  uniform vec2 uFocusSize;
  uniform float uFeather;
  uniform float uIntensity;
  uniform float uProgress;
  varying vec2 vUv;

  float roundedBoxDistance(vec2 point, vec2 size, float corner) {
    vec2 q = abs(point - size * 0.5) - size * 0.5 + corner;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - corner;
  }

  void main() {
    vec2 point = vUv * uResolution - uFocusOrigin;
    float corner = min(min(uFocusSize.x, uFocusSize.y) * 0.16, 28.0);
    float distanceToFocus = roundedBoxDistance(point, uFocusSize, corner);
    float pull = smoothstep(0.05, 0.68, uProgress);
    float sharpMask = 1.0 - smoothstep(-uFeather * 0.22, uFeather, distanceToFocus);
    float focusStrength = sharpMask * pull;
    float blurMix = (1.0 - focusStrength) * (0.18 + 0.72 * uIntensity);
    float sigma = 1.0 + blurMix * (2.0 + 6.0 * uIntensity);
    vec2 pixel = 1.0 / uResolution;
    vec3 blurred = vec3(0.0);
    float total = 0.0;
    for (int y = -3; y <= 3; y++) {
      for (int x = -3; x <= 3; x++) {
        float weight = exp(-(float(x * x + y * y)) / (2.0 * sigma * sigma));
        blurred += texture2D(uMap, clamp(vUv + pixel * vec2(float(x), float(y)) * sigma, 0.001, 0.999)).rgb * weight;
        total += weight;
      }
    }
    blurred /= total;
    vec3 sharp = texture2D(uMap, vUv).rgb;
    vec3 color = mix(sharp, blurred, blurMix);
    // 轻微自动对焦框只在拉焦途中可见；锁定后消失，避免把内容做成常驻 UI 边框。
    float focusFrame = (1.0 - smoothstep(1.0, 4.0, abs(distanceToFocus))) * (1.0 - smoothstep(0.62, 0.96, pull));
    color *= mix(0.82, 1.0, focusStrength);
    color += sharp * focusStrength * 0.055;
    color += vec3(1.0, 0.62, 0.22) * focusFrame * 0.23;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface TextFocusMaterialProps {
  /** 纹理 UV 坐标的 [left, bottom, width, height]，由 MaterialElement 从屏幕坐标翻转得到。 */
  focusBox: readonly [number, number, number, number];
  height: number;
  texture: THREE.Texture;
  width: number;
  feather?: number;
  intensity?: number;
  progress?: number;
}

export const TextFocusMaterial: React.FC<TextFocusMaterialProps> = ({
  focusBox,
  height,
  texture,
  width,
  feather = 0.035,
  intensity = 1,
  progress = 1,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uFocusOrigin: new THREE.Uniform(new THREE.Vector2(focusBox[0] * width, focusBox[1] * height)),
      uFocusSize: new THREE.Uniform(new THREE.Vector2(focusBox[2] * width, focusBox[3] * height)),
      uFeather: new THREE.Uniform(feather * Math.min(width, height)),
      uIntensity: new THREE.Uniform(intensity),
      uProgress: new THREE.Uniform(progress),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uFocusOrigin.value.set(focusBox[0] * width, focusBox[1] * height);
      u.uFocusSize.value.set(focusBox[2] * width, focusBox[3] * height);
      u.uFeather.value = feather * Math.min(width, height);
      u.uIntensity.value = intensity;
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
