/**
 * [INPUT]: 依赖 Three CanvasTexture、JS 生成的 ASCII 字形图集与 R3F ShaderMaterial
 * [OUTPUT]: 对外提供 AsciifyMaterial，以字符化入场 → 严格原始纹理收尾的 ASCII 字形马赛克渲染内容纹理
 * [POS]: remotion-kit/src/materials 的 post Effect Node；字形图集在 JS 里用固定字体生成，
 *        亮度→字形与镜头生命周期完全确定性，可 seek
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { GLSL_HASH12, PASSTHROUGH_VERTEX } from "../shared/glsl";
import { useMaterialUniforms } from "../shared/uniforms";

const RAMP = " .:-=+*#%@";
const GLYPH_SIZE = 10;

const buildGlyphAtlas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = GLYPH_SIZE;
  canvas.height = GLYPH_SIZE * RAMP.length;
  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.font = `${Math.floor(GLYPH_SIZE * 0.8)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    RAMP.split("").forEach((glyph, index) => {
      context.fillText(glyph, GLYPH_SIZE / 2, index * GLYPH_SIZE + GLYPH_SIZE / 2);
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

const fragmentShader = `
  uniform sampler2D uMap;
  uniform sampler2D uGlyphs;
  uniform vec2 uResolution;
  uniform float uCell;
  uniform float uGlyphCount;
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;

  ${GLSL_HASH12}

  float lum(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  void main() {
    vec3 original = texture2D(uMap, vUv).rgb;
    // 终态必须绕过 cell 采样；否则 amount=0 也只会得到低分辨率像素图。
    if (uProgress >= 0.82) {
      gl_FragColor = vec4(original, 1.0);
      return;
    }
    vec2 cells = uResolution / uCell;
    vec2 cellCoord = floor(vUv * cells);
    vec2 cellUv = fract(vUv * cells);
    vec2 cellCenter = (cellCoord + 0.5) / cells;
    vec3 cellSource = texture2D(uMap, cellCenter).rgb;
    float index = clamp(floor(lum(cellSource) * uGlyphCount), 0.0, uGlyphCount - 1.0);
    vec2 glyphUv = vec2(cellUv.x, (index + cellUv.y) / uGlyphCount);
    vec4 glyph = texture2D(uGlyphs, glyphUv);
    float flicker = 0.88 + 0.12 * hash12(cellCoord + floor(uTime * 5.0) * 0.37);
    // 终端扫描线：一条亮带自上而下扫过，字符随之增亮
    float scan = 0.5 + 0.5 * sin(vUv.y * 16.0 - uTime * 2.2);
    vec3 ascii = cellSource * glyph.a * flicker * (0.78 + 0.34 * scan);
    // ASCII 是一次解码表演：先形成字符，再在镜头后段精确回到原始内容。
    float amount = smoothstep(0.04, 0.2, uProgress)
      * (1.0 - smoothstep(0.58, 0.86, uProgress));
    vec3 color = mix(original, ascii, amount);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface AsciifyMaterialProps {
  height: number;
  texture: THREE.Texture;
  time: number;
  width: number;
  cell?: number;
  /** ShotGraph 注入的单次效果进度；>= 0.82 时严格返回原始纹理。 */
  progress?: number;
}

export const AsciifyMaterial: React.FC<AsciifyMaterialProps> = ({
  height,
  texture,
  time,
  width,
  cell = 12,
  progress = 1,
}) => {
  const glyphs = useMemo(buildGlyphAtlas, []);
  useLayoutEffect(() => () => glyphs.dispose(), [glyphs]);
  const { material, uniforms } = useMaterialUniforms<THREE.ShaderMaterial>(
    () => ({
      uMap: new THREE.Uniform(texture),
      uGlyphs: new THREE.Uniform(glyphs),
      uResolution: new THREE.Uniform(new THREE.Vector2(width, height)),
      uCell: new THREE.Uniform(cell),
      uGlyphCount: new THREE.Uniform(RAMP.length),
      uTime: new THREE.Uniform(time),
      uProgress: new THREE.Uniform(progress),
    }),
    (u) => {
      u.uResolution.value.set(width, height);
      u.uCell.value = cell;
      u.uTime.value = time;
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
