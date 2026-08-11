/**
 * [INPUT]: 依赖 Three Texture、Remotion transition progress/time 与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlStorePeelMaterial，以 cylinder curl、adhesive back 与贴合弧面的反射光揭示当前内容纹理（转场）
 * [POS]: remotion-kit/src/materials 的 transform Effect Node；从 opaque scene texture 取样，不创建额外 DOM 或独立时钟
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useMemo } from "react";
import * as THREE from "three";
import { useMaterialUniforms } from "../shared/uniforms";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uProgress;
  uniform float uMaxAxisDistance;
  uniform float uCurlRadius;
  uniform vec2 uCorner;
  uniform vec2 uDirection;
  varying vec2 vUv;

  const float PI = 3.14159265359;
  const vec3 BACK_COLOR = vec3(0.96, 0.93, 0.86);

  vec4 sampleFlat(vec2 uv) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
    return texture2D(uMap, uv);
  }

  vec4 applyShine(vec4 color, float intensity) {
    return vec4(color.rgb * (1.0 - intensity) + intensity * color.a, color.a);
  }

  void main() {
    vec2 point = vec2(vUv.x * uResolution.x, (1.0 - vUv.y) * uResolution.y);
    vec2 fromCorner = point - uCorner;
    float projected = dot(fromCorner, uDirection);
    vec2 perpendicular = fromCorner - projected * uDirection;
    float curlAxis = uProgress * uMaxAxisDistance;
    vec4 flatColor = sampleFlat(vUv);

    if (projected >= curlAxis) {
      gl_FragColor = flatColor;
      return;
    }

    float delta = curlAxis - projected;
    if (delta > uCurlRadius) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float ratio = clamp(delta / uCurlRadius, 0.0, 1.0);
    float frontArc = uCurlRadius * asin(ratio);
    float backArc = PI * uCurlRadius - frontArc;
    vec2 frontPoint = uCorner + perpendicular + (curlAxis - frontArc) * uDirection;
    vec2 backPoint = uCorner + perpendicular + (curlAxis - backArc) * uDirection;
    vec2 frontUv = vec2(frontPoint.x / uResolution.x, 1.0 - frontPoint.y / uResolution.y);
    vec2 backUv = vec2(backPoint.x / uResolution.x, 1.0 - backPoint.y / uResolution.y);
    vec4 front = sampleFlat(frontUv);
    vec4 back = sampleFlat(backUv);
    float frontCurve = frontArc / uCurlRadius;
    float backCurve = backArc / uCurlRadius;
    float frontShade = mix(1.0, 0.78, sin(frontCurve));
    float backShade = mix(0.62, 0.42, (backArc / uCurlRadius - PI * 0.5) / (PI * 0.5));
    // 反射只能出现于已经弯曲的纸面：位置由同一个 curlAxis + arc 推导，绝不再扫过平页。
    float frontShine = exp(-pow((frontCurve - 0.48) / 0.16, 2.0)) * 0.46;
    float backShine = exp(-pow((backCurve - 2.25) / 0.22, 2.0)) * 0.12;

    if (front.a > 0.02) {
      gl_FragColor = applyShine(vec4(front.rgb * frontShade, front.a), frontShine);
    } else if (back.a > 0.02 && flatColor.a > 0.02) {
      gl_FragColor = applyShine(vec4(BACK_COLOR * backShade, back.a), backShine);
    } else {
      gl_FragColor = vec4(0.0);
    }
  }
`;

const eased = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return 1 - (1 - t) * (1 - t);
};

export interface HtmlStorePeelMaterialProps {
  height: number;
  progress: number;
  texture: THREE.Texture;
  width: number;
}

export const HtmlStorePeelMaterial: React.FC<HtmlStorePeelMaterialProps> = ({
  height,
  progress,
  texture,
  width,
}) => {
  const direction = useMemo(
    () => new THREE.Vector2(-0.72, 0.69).normalize(),
    [],
  );
  const support =
    Math.abs(direction.x) * width * 0.5 + Math.abs(direction.y) * height * 0.5;
  const curlRadius = Math.min(width, height) * 0.24;

  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uProgress: new THREE.Uniform(1),
      uMaxAxisDistance: new THREE.Uniform(support + curlRadius),
      uCurlRadius: new THREE.Uniform(curlRadius),
      uCorner: new THREE.Uniform(
        new THREE.Vector2(
          width * 0.5 - direction.x * support,
          height * 0.5 - direction.y * support,
        ),
      ),
      uDirection: new THREE.Uniform(direction),
    }),
    (u) => {
      const reveal = eased(progress);
      u.uResolution.value.set(width, height);
      u.uMaxAxisDistance.value = support + curlRadius;
      u.uCurlRadius.value = curlRadius;
      u.uCorner.value.set(
        width * 0.5 - direction.x * support,
        height * 0.5 - direction.y * support,
      );
      u.uDirection.value.copy(direction);
      u.uProgress.value = 1 - reveal;
    },
  );

  return (
    <shaderMaterial
      ref={material}
      depthWrite={false}
      fragmentShader={fragmentShader}
      transparent
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={vertexShader}
    />
  );
};
