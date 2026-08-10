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
import { HtmlArticleHighlightMaterial } from "./post/article-highlight-material";
import { HtmlBubbleMaterial } from "./post/bubble-material";
import { HtmlCrtMaterial } from "./post/crt-material";
import { HtmlGlassMaterial } from "./post/glass-material";
import { HtmlGlitchMaterial } from "./post/glitch-material";
import { HtmlMagnifyMaterial } from "./post/magnify-material";
import { HtmlVintageMaterial } from "./post/vintage-material";
import { HtmlBendMaterial } from "./transform/bend-material";
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
          height={height}
          texture={texture}
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
          time={time}
          width={width}
        />
      ) : null;
    case "clouds":
      return (
        <CanvasUiCloudsMaterial
          opacity={materialOption(options, "opacity", 0.74)}
          time={time}
        />
      );
    default:
      return null;
  }
};
