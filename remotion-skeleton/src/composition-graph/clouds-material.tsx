/**
 * [INPUT]: 依赖 Three 与 Remotion 已计算的时间、opacity 和 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 CanvasUiCloudsMaterial，输出无历史帧依赖的程序化雾场
 * [POS]: composition-graph 的环境 Effect Node；借鉴 CanvasUI Clouds 的 fBm 雾场，但保持可 seek 的单 pass 渲染
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
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.02 + 17.1;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = vUv * vec2(1.78, 1.0);
    float drift = uTime * 0.08;
    float field = fbm(p * 2.4 + vec2(drift, -drift * 0.4));
    float detail = fbm(p * 5.0 - vec2(drift * 1.8, drift));
    float mist = smoothstep(0.5, 0.87, field * 0.76 + detail * 0.24);
    float edge = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    vec3 color = mix(vec3(0.04, 0.17, 0.23), vec3(0.25, 0.82, 0.67), field);
    gl_FragColor = vec4(color * mist, mist * edge * uOpacity);
  }
`;

export interface CanvasUiCloudsMaterialProps {
  time: number;
  opacity: number;
}

export const CanvasUiCloudsMaterial: React.FC<CanvasUiCloudsMaterialProps> = ({
  time,
  opacity,
}) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: new THREE.Uniform(time),
      uOpacity: new THREE.Uniform(opacity),
    }),
    [],
  );
  useLayoutEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = time;
    material.current.uniforms.uOpacity.value = opacity;
  }, [opacity, time]);
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
