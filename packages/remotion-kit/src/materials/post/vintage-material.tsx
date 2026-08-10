/**
 * [INPUT]: 依赖 Three Texture、Remotion frame/fps 派生时间与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlVintageMaterial，以 gate weave、grain、scratch、dust、leak、vignette 与 flicker 渲染内容纹理
 * [POS]: remotion-kit/src/materials 的 post Effect Node；保持离散 24fps grain，时间只由 Remotion 注入
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uGrain;
  uniform float uVignette;
  uniform float uWarmth;
  uniform float uFade;
  varying vec2 vUv;

  float hash(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  void main() {
    vec2 uv = vUv + vec2(
      sin(uTime * 11.0) * 0.0015 + sin(uTime * 3.7) * 0.0009,
      cos(uTime * 8.3) * 0.0013 + cos(uTime * 2.4) * 0.0007
    );
    vec2 fromCenter = uv - 0.5;
    float radius = length(fromCenter);
    vec2 direction = radius > 0.0001 ? normalize(fromCenter) : vec2(0.0);
    float aberration = 0.0024 * pow(radius * 1.4, 1.6);
    vec3 color = vec3(
      texture2D(uMap, uv + direction * aberration).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - direction * aberration).b
    );
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(color, vec3(luminance), 0.30);
    color = mix(vec3(0.5), color, mix(1.0, 0.78, uFade));
    color = mix(color, mix(vec3(0.22, 0.21, 0.20), vec3(0.98, 0.97, 0.96), color), uWarmth);
    float frameIndex = floor(uTime * 24.0);
    color += (hash(gl_FragCoord.xy + vec2(frameIndex * 17.31, frameIndex * 7.91)) - 0.5) * uGrain;
    float scratchSeed = floor(uTime * 8.0);
    for (int index = 0; index < 3; index++) {
      float slot = float(index);
      float enabled = step(0.78, hash(vec2(scratchSeed, slot * 19.7 + 3.1)));
      float x = hash(vec2(scratchSeed, slot * 7.13 + 11.4)) * uResolution.x;
      float jitter = 0.4 * sin(vUv.y * 80.0 + slot * 9.0);
      float line = enabled * smoothstep(2.4, 0.0, abs(gl_FragCoord.x - x + jitter));
      color += vec3(line * (0.45 + 0.25 * hash(vec2(scratchSeed, slot))) * 0.9);
    }
    float dustSeed = floor(uTime * 24.0);
    for (int index = 0; index < 4; index++) {
      float slot = float(index);
      vec2 dustPosition = vec2(hash(vec2(dustSeed, slot * 2.13 + 1.7)), hash(vec2(dustSeed, slot * 5.71 + 9.3)));
      float enabled = step(0.55, hash(vec2(dustSeed, slot * 3.33 + 21.0)));
      float dustRadius = 0.004 + 0.006 * hash(vec2(dustSeed, slot * 4.4));
      color += vec3(0.52, 0.51, 0.50) * smoothstep(dustRadius, 0.0, distance(vUv, dustPosition)) * enabled;
    }
    float leak = smoothstep(0.85, 0.05, distance(vUv, vec2(0.86, 0.18)));
    color += vec3(0.96, 0.90, 0.84) * leak * 0.14 * (0.55 + 0.45 * sin(uTime * 0.7));
    float leak2 = smoothstep(0.7, 0.0, distance(vUv, vec2(0.12, 0.85)));
    color += vec3(0.88, 0.86, 0.84) * leak2 * 0.07 * (0.5 + 0.5 * sin(uTime * 0.4 + 1.7));
    color *= mix(1.0, smoothstep(1.05, 0.30, radius * 1.25), uVignette);
    color *= 1.0 + 0.035 * sin(uTime * 7.0) + 0.018 * sin(uTime * 19.0 + 1.3);
    gl_FragColor = vec4(color * vec3(1.01, 1.0, 0.99), 1.0);
  }
`;

export interface HtmlVintageMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  grain?: number;
  vignette?: number;
  warmth?: number;
  fade?: number;
}

export const HtmlVintageMaterial: React.FC<HtmlVintageMaterialProps> = ({
  height,
  texture,
  time,
  width,
  grain = 0.126,
  vignette = 0.6,
  warmth = 0.28,
  fade = 0.385,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uTime: new THREE.Uniform(time),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uGrain: new THREE.Uniform(grain),
      uVignette: new THREE.Uniform(vignette),
      uWarmth: new THREE.Uniform(warmth),
      uFade: new THREE.Uniform(fade),
    }),
    (u) => {
      u.uTime.value = time;
      u.uResolution.value.set(width, height);
      u.uGrain.value = grain;
      u.uVignette.value = vignette;
      u.uWarmth.value = warmth;
      u.uFade.value = fade;
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
