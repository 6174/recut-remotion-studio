/**
 * [INPUT]: 依赖 Three Texture、Remotion 已计算的时间和强度与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlGlitchMaterial，以 CanvasUI Glitch 的横向 tearing、RGB split 和噪声渲染 HTML texture
 * [POS]: composition-graph 的 Effect Node；只更新 uniform，绝不重建 shader 或发起独立动画循环
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

const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uAspect;
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    float burstClock = mod(uTime, 3.7);
    float attack = smoothstep(0.0, 0.06, burstClock);
    float release = 1.0 - smoothstep(0.34, 0.56, burstClock);
    float amount = attack * release * uIntensity;
    vec2 uv = vUv;
    float band = floor(uv.y * 24.0);
    float seed = floor(uTime / 3.7) + 1.0;
    float pick = hash12(vec2(band, seed));
    float tear = step(0.74, pick) * amount;
    float direction = hash12(vec2(band, seed + 13.0)) * 2.0 - 1.0;
    uv.x += tear * direction * 0.035 / uAspect;
    float micro = hash12(vec2(floor(vUv.y * 160.0), seed + 29.0)) - 0.5;
    uv.x += micro * amount * 0.004;
    vec2 block = floor(uv * vec2(12.0, 8.0));
    if (hash12(block + seed) > 0.94 - amount * 0.08) {
      uv += vec2(hash12(block + 3.1) - 0.5, hash12(block + 7.7) - 0.5) * amount * vec2(0.06, 0.015);
    }
    float split = amount * 0.012;
    vec3 color = vec3(
      texture2D(uMap, clamp(uv + vec2(split, 0.0), 0.001, 0.999)).r,
      texture2D(uMap, clamp(uv, 0.001, 0.999)).g,
      texture2D(uMap, clamp(uv - vec2(split, 0.0), 0.001, 0.999)).b
    );
    float grain = hash12(vUv * 1400.0 + seed) - 0.5;
    color += grain * amount * 0.13;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

export interface HtmlGlitchMaterialProps {
  texture: THREE.Texture;
  time: number;
  intensity: number;
  aspect: number;
}

export const HtmlGlitchMaterial: React.FC<HtmlGlitchMaterialProps> = ({
  texture,
  time,
  intensity,
  aspect,
}) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uMap: new THREE.Uniform(texture),
      uTime: new THREE.Uniform(time),
      uIntensity: new THREE.Uniform(intensity),
      uAspect: new THREE.Uniform(aspect),
    }),
    [texture],
  );

  useLayoutEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = time;
    material.current.uniforms.uIntensity.value = intensity;
    material.current.uniforms.uAspect.value = aspect;
  }, [aspect, intensity, time]);

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
