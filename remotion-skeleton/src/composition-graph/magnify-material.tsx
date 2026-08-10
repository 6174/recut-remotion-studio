/**
 * [INPUT]: 依赖 Three CanvasTexture、Remotion 已计算的 lens center/zoom 与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlMagnifyMaterial，在 HTML texture 内执行局部放大、色散与 HUD reticle
 * [POS]: composition-graph 的 Effect Node；参考 CanvasUI Magnify 的光学语言，但不依赖 CanvasUI runtime
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
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uZoom;
  uniform float uAspect;
  uniform float uIntensity;
  varying vec2 vUv;

  float line(float distanceToLine, float width) {
    return 1.0 - smoothstep(width, width + fwidth(distanceToLine) * 1.6, abs(distanceToLine));
  }

  void main() {
    vec2 relative = vUv - uCenter;
    vec2 metric = vec2(relative.x * uAspect, relative.y);
    float distanceToCenter = length(metric);
    float edge = max(fwidth(distanceToCenter) * 1.6, 0.002);
    float lens = 1.0 - smoothstep(uRadius - edge, uRadius + edge, distanceToCenter);
    vec3 base = texture2D(uMap, vUv).rgb;
    float ring = line(distanceToCenter - uRadius, 0.004);
    float angle = atan(metric.y, metric.x);
    float tickAngle = abs(sin(angle * 8.0));
    float ticks = smoothstep(0.94, 0.985, tickAngle)
      * (1.0 - smoothstep(uRadius + 0.042, uRadius + 0.072, distanceToCenter));
    float crossLength = uRadius * 1.12;
    float crosshair = max(
      line(metric.x, 0.002) * step(abs(metric.y), crossLength),
      line(metric.y, 0.002) * step(abs(metric.x), crossLength)
    );
    float dot = 1.0 - smoothstep(0.006, 0.012, distanceToCenter);
    vec3 hud = vec3(0.36, 0.97, 0.78) * (ring * 0.92 + ticks * 0.48 + crosshair * 0.36 + dot);
    if (lens < 0.001 && max(max(hud.r, hud.g), hud.b) < 0.001) {
      gl_FragColor = vec4(base, 1.0);
      return;
    }
    vec2 magnified = uCenter + relative / max(uZoom, 1.0);
    vec2 direction = normalize(metric + vec2(0.0001));
    vec2 split = vec2(direction.x / uAspect, direction.y) * (1.0 - distanceToCenter / max(uRadius, 0.001)) * 0.006;
    vec3 enlarged = vec3(
      texture2D(uMap, magnified + split).r,
      texture2D(uMap, magnified).g,
      texture2D(uMap, magnified - split).b
    );
    vec3 result = mix(base, enlarged, lens * uIntensity) + hud;
    gl_FragColor = vec4(result, 1.0);
  }
`;

export interface HtmlMagnifyMaterialProps {
  texture: THREE.Texture;
  center: readonly [number, number];
  radius: number;
  zoom: number;
  aspect: number;
  intensity: number;
}

export const HtmlMagnifyMaterial: React.FC<HtmlMagnifyMaterialProps> = ({ texture, center, radius, zoom, aspect, intensity }) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uMap: new THREE.Uniform(texture),
    uCenter: new THREE.Uniform(new THREE.Vector2(center[0], center[1])),
    uRadius: new THREE.Uniform(radius),
    uZoom: new THREE.Uniform(zoom),
    uAspect: new THREE.Uniform(aspect),
    uIntensity: new THREE.Uniform(intensity),
  }), [texture]);

  useLayoutEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uCenter.value.set(center[0], center[1]);
    material.current.uniforms.uRadius.value = radius;
    material.current.uniforms.uZoom.value = zoom;
    material.current.uniforms.uAspect.value = aspect;
    material.current.uniforms.uIntensity.value = intensity;
  }, [aspect, center, intensity, radius, zoom]);

  return <shaderMaterial ref={material} fragmentShader={fragmentShader} toneMapped={false} uniforms={uniforms} vertexShader={vertexShader} />;
};
