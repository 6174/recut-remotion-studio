/**
 * [INPUT]: 依赖 Three Texture、Remotion frame/fps 派生时间与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 VhsMaterial，以入场失锁 → 清晰基带收尾的横向抖动、scanline、色偏、dropout 与 tracking bar 渲染内容纹理
 * [POS]: remotion-kit/src/materials 的 post Effect Node；全部噪声由固定 seed/镜头进度派生，确定性、可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { GLSL_HASH12, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uProgress;
  varying vec2 vUv;

  ${GLSL_HASH12}

  void main() {
    // 录像带只在镜头开场短暂失锁；progress 进入收尾后所有失真严格归零。
    float burst = smoothstep(0.035, 0.16, uProgress)
      * (1.0 - smoothstep(0.48, 0.78, uProgress))
      * uIntensity;
    float line = floor(vUv.y * uResolution.y);
    float jitter = (hash12(vec2(line, floor(uTime * 24.0))) - 0.5) * 0.07 * burst;
    vec2 uv = clamp(vUv + vec2(jitter, 0.0), 0.001, 0.999);
    float bleed = 0.024 * burst;
    vec3 color = vec3(
      texture2D(uMap, clamp(uv + vec2(bleed, 0.0), 0.001, 0.999)).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, clamp(uv - vec2(bleed, 0.0), 0.001, 0.999)).b
    );
    float scan = 1.0 - (0.025 + 0.045 * sin(vUv.y * uResolution.y * 1.9 + uTime * 5.0)) * burst;
    color *= scan;
    float dropout = step(0.965, hash12(vec2(floor(vUv.y * 42.0), floor(uTime * 7.0)))) * burst;
    color *= 1.0 - dropout * 0.5;
    float barY = fract(uTime * 0.035) * 1.2 - 0.1;
    float bar = smoothstep(0.06, 0.0, abs(vUv.y - barY)) * 0.16 * burst;
    color += vec3(bar);
    float grain = (hash12(vUv * uResolution + floor(uTime * 24.0)) - 0.5) * 0.1 * burst;
    color += vec3(grain);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface VhsMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  intensity?: number;
  progress?: number;
}

export const VhsMaterial: React.FC<VhsMaterialProps> = ({
  height,
  texture,
  time,
  width,
  intensity = 1,
  progress = 1,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uTime: new THREE.Uniform(time),
      uIntensity: new THREE.Uniform(intensity),
      uProgress: new THREE.Uniform(progress),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uTime.value = time;
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
