/**
 * [INPUT]: 依赖 Three CanvasTexture、Remotion 派生的单一镜头位置与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlMagnifyMaterial，以 CanvasUI Magnify 原始光学计算渲染 HTML texture
 * [POS]: composition-graph 的 Effect Node；保留 CanvasUI 的像素 HUD、AA、haze 与 chromatic aberration，仅适配 Three UV
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

// CanvasUI Magnify FRAG, adapted from pixel framebuffer coordinates to a full-screen Three material.
const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uZoom;
  uniform vec3 uColor;
  uniform float uHud;
  uniform float uAberration;
  uniform float uHaze;
  varying vec2 vUv;

  const float PI = 3.14159265358979;

  float pow2(float x) { return x * x; }

  vec3 page(vec2 px) {
    vec2 uv = clamp(px / uResolution, 0.0005, 0.9995);
    return pow(texture2D(uMap, uv).rgb, vec3(2.2));
  }

  vec3 pageAA(vec2 px) {
    // CanvasUI selects a mip from this footprint. CanvasTexture has no stable mip chain
    // across every browser backend, so the footprint is retained for the shader's AA math.
    float footprint = max(length(fwidth(px)), 1.0);
    return mix(page(px), page(px + vec2(footprint * 0.12)), 0.08);
  }

  float line(float d, float halfWidth) {
    return 1.0 - smoothstep(halfWidth - 0.75, halfWidth + 0.75, abs(d));
  }

  void main() {
    vec2 fragPx = vUv * uResolution;
    vec2 p = fragPx - uCenter;
    float d = length(p);
    float w = 1.1;
    float lensMask = 1.0 - smoothstep(uRadius - 1.5, uRadius, d);
    vec2 lensPx = uCenter + p / max(uZoom, 1.0);
    float rimT = pow2(clamp(d / max(uRadius, 1.0), 0.0, 1.0));
    vec2 dir = p / max(d, 0.5);
    float caPx = uAberration * 5.0 * rimT;
    vec3 inside;
    inside.r = pageAA(lensPx + dir * caPx).r;
    inside.g = pageAA(lensPx).g;
    inside.b = pageAA(lensPx - dir * caPx).b;

    vec3 soft = page(lensPx);
    inside = mix(
      inside,
      soft * (1.0 + 0.4 * uHaze) + uColor * 0.06 * uHaze,
      clamp(uHaze, 0.0, 1.0) * 0.45
    );

    float hud = line(d - uRadius, 1.3);
    float angle = atan(p.y, p.x);
    float sector = PI / 4.0;
    float da = abs(angle - floor(angle / sector + 0.5) * sector) * max(d, 1.0);
    float tickBand = smoothstep(uRadius + 4.0, uRadius + 6.0, d)
      * (1.0 - smoothstep(uRadius + 12.0, uRadius + 14.0, d));
    hud += line(da, w) * tickBand;

    float reach = uRadius * 1.14;
    float crossLine = max(
      line(p.x, w) * step(abs(p.y), reach),
      line(p.y, w) * step(abs(p.x), reach)
    );
    hud += crossLine * smoothstep(6.0, 10.0, d) * 0.75;

    vec2 q = abs(p);
    float c = uRadius * 0.64;
    float arm = uRadius * 0.2;
    float arm1 = line(q.x - c, w) * step(c - arm, q.y) * step(q.y, c + w);
    float arm2 = line(q.y - c, w) * step(c - arm, q.x) * step(q.x, c + w);
    hud += max(arm1, arm2);
    hud += 1.0 - smoothstep(1.6, 2.6, d);
    hud += line(d - 5.5, 0.9) * 0.6;
    hud = clamp(hud, 0.0, 1.0) * uHud;

    vec3 base = mix(page(fragPx), inside, lensMask);
    base = mix(base, uColor, hud);
    gl_FragColor = vec4(pow(max(base, 0.0), vec3(1.0 / 2.2)), 1.0);
  }
`;

export interface HtmlMagnifyMaterialProps {
  center: readonly [number, number];
  height: number;
  texture: THREE.Texture;
  width: number;
  zoom: number;
}

export const HtmlMagnifyMaterial: React.FC<HtmlMagnifyMaterialProps> = ({
  center,
  height,
  texture,
  width,
  zoom,
}) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uMap: new THREE.Uniform(texture),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uCenter: new THREE.Uniform(
        new THREE.Vector2(center[0] * width, center[1] * height),
      ),
      uRadius: new THREE.Uniform(140),
      uZoom: new THREE.Uniform(zoom),
      uColor: new THREE.Uniform(new THREE.Color(0.8, 0.8, 0.8)),
      uHud: new THREE.Uniform(0.8),
      uAberration: new THREE.Uniform(0.8),
      uHaze: new THREE.Uniform(0.2),
    }),
    [height, texture, width],
  );

  useLayoutEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uResolution.value.set(width, height);
    material.current.uniforms.uCenter.value.set(
      center[0] * width,
      center[1] * height,
    );
    material.current.uniforms.uZoom.value = zoom;
  }, [center, height, width, zoom]);

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
