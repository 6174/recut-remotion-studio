/**
 * [INPUT]: 依赖各 material 组件、materials/types 的 MaterialElementProps 与 schema 默认值
 * [OUTPUT]: 对外提供 MaterialElement，从统一 envelope（id + 纹理 + 帧 + 语义参数）挂载对应 typed material
 * [POS]: remotion-kit/src/materials 的运行时装配层；shot-graph 与 transition 通过它按 id 挂材质，
 *        语义参数名在这里映射为组件的 typed props（中心位置、进度、强度等）
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { MaterialElementProps } from "./types";
import { materialOption } from "./types";
import { CanvasUiCloudsMaterial } from "./ambient/clouds-material";
import { BlazeMaterial } from "./ambient/blaze-material";
import { GlyphRainMaterial } from "./ambient/glyph-rain-material";
import { GridMaterial } from "./ambient/grid-material";
import { LaserMaterial } from "./ambient/laser-material";
import { LiquidMaterial } from "./ambient/liquid-material";
import { ParticleScrollMaterial } from "./ambient/particle-scroll-material";
import { AsciifyMaterial } from "./post/asciify-material";
import { HtmlArticleHighlightMaterial } from "./post/article-highlight-material";
import { HtmlBubbleMaterial } from "./post/bubble-material";
import { HtmlCrtMaterial } from "./post/crt-material";
import { DecryptRevealMaterial } from "./post/decrypt-reveal-material";
import { DisplacementMaterial } from "./post/displacement-material";
import { DropletsMaterial } from "./post/droplets-material";
import { FrostMaterial } from "./post/frost-material";
import { HtmlGlassMaterial } from "./post/glass-material";
import { HtmlGlitchMaterial } from "./post/glitch-material";
import { HtmlMagnifyMaterial } from "./post/magnify-material";
import { ParticleRevealMaterial } from "./post/particle-reveal-material";
import { RetroDitherMaterial } from "./post/retro-dither-material";
import { RippleMaterial } from "./post/ripple-material";
import { TextFocusMaterial } from "./post/text-focus-material";
import { VhsMaterial } from "./post/vhs-material";
import { HtmlVintageMaterial } from "./post/vintage-material";
import { HtmlBendMaterial } from "./transform/bend-material";
import { ClothMaterial } from "./transform/cloth-material";
import { HtmlStorePeelMaterial } from "./transform/store-peel-material";

const readCenter = (options: Record<string, unknown> | undefined): [number, number] => {
  const center = options?.center;
  if (
    Array.isArray(center) &&
    typeof center[0] === "number" &&
    typeof center[1] === "number"
  ) {
    return [center[0], center[1]];
  }
  return [0.5, 0.5];
};

/** Text Focus 对外使用屏幕坐标 [left, top, width, height]；这里统一翻成 texture 的 bottom-up UV。 */
const readFocusBox = (options: Record<string, unknown> | undefined): [number, number, number, number] => {
  const focusBox = options?.focusBox;
  const input = Array.isArray(focusBox) && focusBox.length >= 4 && focusBox.slice(0, 4).every((value) => typeof value === "number")
    ? focusBox as number[]
    : [
      materialOption(options, "focusLeft", 0.28),
      materialOption(options, "focusTop", 0.4),
      materialOption(options, "focusWidth", 0.44),
      materialOption(options, "focusHeight", 0.16),
    ];
  const [left, top, width, height] = input;
  return [left, 1 - top - height, width, height];
};

const readProgress = (options: Record<string, unknown> | undefined) =>
  materialOption(options, "progress", 0.5);

/**
 * 按 id 挂载材质。map 为 null 时只适用于 ambient（clouds）；其它材质要求调用方提供纹理。
 */
export const MaterialElement: React.FC<MaterialElementProps> = ({
  id,
  map,
  frame,
  fps,
  width,
  height,
  options,
}) => {
  const texture = map ?? undefined;
  const time = frame / (fps ?? 30);
  switch (id) {
    case "glitch":
      return texture ? (
        <HtmlGlitchMaterial
          aspect={width / height}
          intensity={materialOption(options, "intensity", 1.35)}
          texture={texture}
          time={time}
        />
      ) : null;
    case "crt":
      return texture ? (
        <HtmlCrtMaterial
          height={height}
          scan={materialOption(options, "scan", 0.24)}
          texture={texture}
          time={time}
          vignette={materialOption(options, "vignette", 0.68)}
          motion={materialOption(options, "motion", 1)}
          width={width}
        />
      ) : null;
    case "vintage":
      return texture ? (
        <HtmlVintageMaterial
          fade={materialOption(options, "fade", 0.385)}
          grain={materialOption(options, "grain", 0.126)}
          height={height}
          texture={texture}
          time={time}
          vignette={materialOption(options, "vignette", 0.6)}
          warmth={materialOption(options, "warmth", 0.28)}
          width={width}
        />
      ) : null;
    case "vhs":
      return texture ? (
        <VhsMaterial
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          texture={texture}
          time={time}
          width={width}
          progress={materialOption(options, "effectProgress", 1)}
        />
      ) : null;
    case "magnify": {
      const center = readCenter(options);
      return texture ? (
        <HtmlMagnifyMaterial
          aberration={materialOption(options, "aberration", 0.8)}
          center={center}
          haze={materialOption(options, "haze", 0.2)}
          height={height}
          hud={materialOption(options, "hud", 0.8)}
          radius={materialOption(options, "radius", 140)}
          texture={texture}
          width={width}
          zoom={materialOption(options, "zoom", 1.7)}
        />
      ) : null;
    }
    case "glass": {
      const center = readCenter(options);
      return texture ? (
        <HtmlGlassMaterial
          center={center}
          depth={materialOption(options, "depth", 250)}
          half={materialOption(options, "half", 170)}
          height={height}
          ior={materialOption(options, "ior", 1.5)}
          reflect={materialOption(options, "reflect", 1)}
          texture={texture}
          width={width}
          zoom={materialOption(options, "zoom", 1.34)}
        />
      ) : null;
    }
    case "bubble":
      return texture ? (
        <HtmlBubbleMaterial
          aspect={width / height}
          dispersion={materialOption(options, "dispersion", 1)}
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          iridescence={materialOption(options, "iridescence", 1)}
          refraction={materialOption(options, "refraction", 80)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "article-highlight":
      return texture ? (
        <HtmlArticleHighlightMaterial
          center={readCenter(options)}
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          markerHeight={materialOption(options, "markerHeight", 0.115)}
          markerWidth={materialOption(options, "markerWidth", 0.54)}
          progress={materialOption(options, "effectProgress", 1)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "asciify":
      return texture ? (
        <AsciifyMaterial
          cell={materialOption(options, "cell", 12)}
          height={height}
          progress={materialOption(options, "effectProgress", 1)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "retro-dither":
      return texture ? (
        <RetroDitherMaterial
          grid={materialOption(options, "grid", 4)}
          height={height}
          levels={materialOption(options, "levels", 4)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "displacement":
      return texture ? (
        <DisplacementMaterial
          amount={materialOption(options, "amount", 0.035)}
          height={height}
          scale={materialOption(options, "scale", 2.4)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "droplets":
      return texture ? (
        <DropletsMaterial
          dropLength={materialOption(options, "dropLength", 1)}
          dropWidth={materialOption(options, "dropWidth", 1)}
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          refraction={materialOption(options, "refraction", 0.2)}
          scale={materialOption(options, "scale", 0.4)}
          speed={materialOption(options, "speed", 1)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "frost":
      return texture ? (
        <FrostMaterial
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "decrypt-reveal":
      return texture ? (
        <DecryptRevealMaterial
          cell={materialOption(options, "cell", 26)}
          height={height}
          progress={materialOption(options, "effectProgress", 1)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "text-focus":
      return texture ? (
        <TextFocusMaterial
          feather={materialOption(options, "focusFeather", 0.035)}
          focusBox={readFocusBox(options)}
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          texture={texture}
          width={width}
          progress={materialOption(options, "effectProgress", 1)}
        />
      ) : null;
    case "particle-reveal":
      return texture ? (
        <ParticleRevealMaterial
          cell={materialOption(options, "cell", 22)}
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          progress={materialOption(options, "effectProgress", 1)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "ripple":
      return texture ? (
        <RippleMaterial
          center={readCenter(options)}
          frequency={materialOption(options, "frequency", 2.2)}
          height={height}
          radius={materialOption(options, "radius", 320)}
          strength={materialOption(options, "strength", 0.045)}
          texture={texture}
          time={time}
          width={width}
        />
      ) : null;
    case "bend":
      return texture ? (
        <HtmlBendMaterial
          bend={materialOption(options, "bend", 0.6)}
          texture={texture}
        />
      ) : null;
    case "store-peel":
      return texture ? (
        <HtmlStorePeelMaterial
          height={height}
          progress={readProgress(options)}
          texture={texture}
          width={width}
        />
      ) : null;
    case "cloth":
      return texture ? (
        <ClothMaterial
          amplitude={materialOption(options, "amplitude", 0.18)}
          scale={materialOption(options, "scale", 1.2)}
          speed={materialOption(options, "speed", 1.4)}
          texture={texture}
          time={time}
        />
      ) : null;
    case "clouds":
      return (
        <CanvasUiCloudsMaterial
          opacity={materialOption(options, "opacity", 0.74)}
          time={time}
        />
      );
    case "grid":
      return (
        <GridMaterial
          cell={materialOption(options, "cell", 96)}
          color={typeof options?.color === "string" ? options.color : undefined}
          height={height}
          opacity={materialOption(options, "opacity", 0.5)}
          speed={materialOption(options, "speed", 0.75)}
          time={time}
          width={width}
        />
      );
    case "liquid":
      return (
        <LiquidMaterial
          height={height}
          opacity={materialOption(options, "opacity", 0.8)}
          time={time}
          width={width}
        />
      );
    case "glyph-rain":
      return (
        <GlyphRainMaterial
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          opacity={materialOption(options, "opacity", 0.8)}
          time={time}
          width={width}
        />
      );
    case "laser":
      return (
        <LaserMaterial
          height={height}
          intensity={materialOption(options, "intensity", 1)}
          opacity={materialOption(options, "opacity", 0.85)}
          time={time}
          width={width}
        />
      );
    case "blaze":
      return (
        <BlazeMaterial
          height={height}
          opacity={materialOption(options, "opacity", 0.85)}
          time={time}
          width={width}
        />
      );
    case "particle-scroll":
      return (
        <ParticleScrollMaterial
          height={height}
          opacity={materialOption(options, "opacity", 0.8)}
          time={time}
          width={width}
        />
      );
    default:
      return null;
  }
};
