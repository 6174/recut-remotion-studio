/**
 * [INPUT]: 依赖 Three Texture、Remotion frame/fps 派生时间与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 HtmlCrtMaterial，以 barrel、scanline、RGB aperture、vignette 与 flicker 渲染内容纹理
 * [POS]: remotion-kit/src/materials 的 post Effect Node；shader 仅创建一次，Remotion 帧只更新 uniform
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";
import { PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uCurvature;
  uniform float uScanIntensity;
  uniform float uVignette;
  varying vec2 vUv;

  vec2 curveUv(vec2 uv) {
    vec2 c = uv * 2.0 - 1.0;
    vec2 offset = abs(c.yx) / uCurvature;
    c = c + c * offset * offset;
    return c * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = curveUv(vUv);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    vec2 fromCenter = uv - 0.5;
    float radius = length(fromCenter);
    vec2 direction = radius > 0.0001 ? normalize(fromCenter) : vec2(0.0);
    float aberration = 0.0018 * pow(radius * 2.0, 2.0);
    vec3 color = vec3(
      texture2D(uMap, uv + direction * aberration).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - direction * aberration).b
    );
    float scan = 0.5 + 0.5 * sin(uv.y * uResolution.y);
    color *= mix(1.0, scan, uScanIntensity);
    float column = mod(gl_FragCoord.x, 3.0);
    vec3 mask = column < 1.0 ? vec3(1.04, 0.97, 0.97) :
      column < 2.0 ? vec3(0.97, 1.04, 0.97) : vec3(0.97, 0.97, 1.04);
    color *= mix(vec3(1.0), mask, 0.18);
    float vignette = smoothstep(0.95, 0.45, radius);
    color *= mix(1.0, vignette, uVignette);
    color *= 1.0 + 0.012 * sin(uTime * 60.0);
    color -= vec3(0.04) * smoothstep(0.62, 0.78, radius);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface HtmlCrtMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  scan?: number;
  vignette?: number;
}

export const HtmlCrtMaterial: React.FC<HtmlCrtMaterialProps> = ({
  height,
  texture,
  time,
  width,
  scan = 0.24,
  vignette = 0.68,
}) => {
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uTime: new THREE.Uniform(time),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uCurvature: new THREE.Uniform(new THREE.Vector2(5.5, 5.0)),
      uScanIntensity: new THREE.Uniform(scan),
      uVignette: new THREE.Uniform(vignette),
    }),
    (u) => {
      u.uTime.value = time;
      u.uResolution.value.set(width, height);
      u.uScanIntensity.value = scan;
      u.uVignette.value = vignette;
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
