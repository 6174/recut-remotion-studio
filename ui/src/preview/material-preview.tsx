/**
 * [INPUT]: 依赖 @recut/remotion-kit 的 materials（MaterialElement）与 three（ThreeVideoCanvas/RemotionFrameInvalidator）
 * [OUTPUT]: 对外提供 MaterialPreview：用确定性程序化样例纹理 + MaterialElement 实时预览 Three 材质效果
 * [POS]: remotion-studio/ui 预览层的材质演示；不依赖 HTML-in-Canvas，任何浏览器都能看 Three material 效果。
 *        镜头类材质聚焦样例文字；Article Highlight 与两种 Reveal 都会在终态停留；bend 循环折叠、store-peel 用下层样例平面做 A/B 卷页循环，随 Remotion 帧自动播放。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useMemo, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  AB_TRANSITIONS,
  ClockWipeTransitionMaterial,
  CrossZoomTransitionMaterial,
  FadeTransitionMaterial,
  FlipTransitionMaterial,
  IrisTransitionMaterial,
  MaterialElement,
  SlideTransitionMaterial,
  WipeTransitionMaterial,
  type MaterialId,
} from "@recut/remotion-kit";
import { RemotionFrameInvalidator, ThreeVideoCanvas } from "@recut/remotion-kit/three";
import * as THREE from "three";

const PLANE_HEIGHT = 4.9;
type SampleVariant = 0 | 1 | 2;

const drawSampleScene = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  variant: SampleVariant = 0,
) => {
  const w = width;
  const h = height;
  if (variant === 1) {
    context.fillStyle = "#101a12";
    context.fillRect(0, 0, w, h);
    const glow = context.createRadialGradient(w * 0.3, h * 0.5, 40, w * 0.3, h * 0.5, w * 0.55);
    glow.addColorStop(0, "rgba(52, 211, 153, 0.2)");
    glow.addColorStop(1, "rgba(16, 26, 18, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, w, h);
    context.fillStyle = "#34d399";
    context.font = `900 ${Math.round(h * 0.09)}px system-ui, -apple-system, sans-serif`;
    context.fillText("NEXT", w * 0.08, h * 0.5);
    context.fillStyle = "#6ee7b7";
    context.font = `600 ${Math.round(h * 0.03)}px system-ui, -apple-system, sans-serif`;
    context.fillText("revealed surface · A/B page turn", w * 0.08, h * 0.6);
    return;
  }
  if (variant === 2) {
    context.fillStyle = "#e9e6dc";
    context.fillRect(0, 0, w, h);
    context.fillStyle = "#d5d0c3";
    context.fillRect(w * 0.08, h * 0.16, w * 0.12, h * 0.018);
    context.fillStyle = "#171717";
    context.font = `800 ${Math.round(h * 0.09)}px Georgia, serif`;
    context.fillText("THE NEXT", w * 0.08, h * 0.42);
    context.font = `800 ${Math.round(h * 0.105)}px Georgia, serif`;
    context.fillText("CHIP WAR", w * 0.08, h * 0.56);
    context.fillStyle = "#5f5b53";
    context.font = `500 ${Math.round(h * 0.031)}px Georgia, serif`;
    context.fillText("The quiet infrastructure race reshaping AI.", w * 0.08, h * 0.68);
    for (let i = 0; i < 4; i++) {
      context.fillRect(w * 0.08, h * (0.76 + i * 0.045), w * (0.5 - i * 0.045), h * 0.012);
    }
    return;
  }
  context.fillStyle = "#0d1420";
  context.fillRect(0, 0, w, h);
  const glow = context.createRadialGradient(w * 0.72, h * 0.3, 40, w * 0.72, h * 0.3, w * 0.55);
  glow.addColorStop(0, "rgba(56, 189, 248, 0.22)");
  glow.addColorStop(1, "rgba(13, 20, 32, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, w, h);

  context.fillStyle = "#1c2740";
  context.fillRect(w * 0.5, h * 0.24, w * 0.42, h * 0.6);
  context.fillStyle = "#25324f";
  context.fillRect(w * 0.53, h * 0.3, w * 0.36, h * 0.12);

  context.fillStyle = "#3b82f6";
  context.fillRect(w * 0.06, h * 0.2, w * 0.16, h * 0.03);
  context.fillStyle = "#e2e8f0";
  context.font = `800 ${Math.round(h * 0.05)}px system-ui, -apple-system, sans-serif`;
  context.fillText("RECUT · GPU MATERIAL", w * 0.06, h * 0.36);
  context.fillStyle = "#94a3b8";
  context.font = `600 ${Math.round(h * 0.024)}px system-ui, -apple-system, sans-serif`;
  context.fillText("HTML content surface → CanvasTexture → Three material", w * 0.06, h * 0.43);
  context.fillText("逐帧只更新 uniform，绝不重建 shader", w * 0.06, h * 0.47);

  context.fillStyle = "#38bdf8";
  context.fillRect(w * 0.06, h * 0.55, w * 0.34, h * 0.008);
  context.fillStyle = "#f8fafc";
  context.font = `900 ${Math.round(h * 0.11)}px system-ui, -apple-system, sans-serif`;
  context.fillText("LIVE", w * 0.06, h * 0.68);
  context.fillStyle = "#7dd3fc";
  context.font = `800 ${Math.round(h * 0.05)}px system-ui, -apple-system, sans-serif`;
  context.fillText("PREVIEW", w * 0.06, h * 0.77);

  context.fillStyle = "#1e293b";
  for (let i = 0; i < 3; i++) {
    context.fillRect(w * 0.06, h * 0.84 + i * h * 0.045, w * 0.26, h * 0.02);
  }
};

const useSampleTexture = (width: number, height: number, variant: SampleVariant = 0) => {
  const [texture] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const output = new THREE.CanvasTexture(canvas);
    output.colorSpace = THREE.SRGBColorSpace;
    output.minFilter = THREE.LinearFilter;
    output.magFilter = THREE.LinearFilter;
    return output;
  });
  useLayoutEffect(() => {
    drawSampleScene(texture.image.getContext("2d") as CanvasRenderingContext2D, width, height, variant);
    texture.needsUpdate = true;
  }, [height, texture, variant, width]);
  useLayoutEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

/** 镜头类材质默认中心在 [0.5,0.5]，而样例文字在左侧，
 *  这里把 center 指向样例文字区，确保放大/玻璃/涟漪对准文字。 */
const LENS_TEXT_CENTER = new Set(["magnify", "glass", "bubble", "ripple"]);
const TEXT_CENTER: [number, number] = [0.28, 0.62];

/** 单个 Three 材质的效果预览：程序化样例纹理 + MaterialElement，Remotion 帧驱动、自动播放。
 *  bend 循环折叠；store-peel 用下层样例平面做 4 秒 A/B 卷页循环。 */
export const MaterialPreview: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const texture = useSampleTexture(width, height, id === "article-highlight" ? 2 : 0);
  const isStorePeel = id === "store-peel";
  const isAb = AB_TRANSITIONS.has(id);
  const needsBase = isStorePeel || isAb;
  const baseTexture = useSampleTexture(width, height, 1);
  const t = frame / fps;

  const options = useMemo(() => {
    const base: Record<string, unknown> = { progress: 0.4 };
    if (LENS_TEXT_CENTER.has(id)) {
      // 镜头/焦点材质：center 沿样例文字附近缓慢漂移，让放大镜/玻璃/文字聚焦明显带运动
      base.center = [
        TEXT_CENTER[0] + 0.07 * Math.sin(t * 0.6),
        TEXT_CENTER[1] + 0.045 * Math.cos(t * 0.8),
      ];
    }
    if (id === "article-highlight") {
      // CanvasTexture 的 V 轴与屏幕 Y 轴相反：屏幕上 CHIP WAR 的 0.56 对应 shader 的 0.44。
      base.center = [0.31, 0.44];
      base.markerWidth = 0.46;
      base.markerHeight = 0.13;
      // 先划线、稍作停留、再从起点重播，便于在循环预览中检查完整动效。
      const cycle = t % 3.2;
      base.effectProgress = Math.min(1, Math.max(0, (cycle - 0.25) / 1.05));
    }
    if (id === "vhs") {
      // 预览循环重放一次失锁→复原；真实 ShotGraph 只使用镜头自身 0→1 的单次进度。
      base.effectProgress = (t % 3.6) / 3.6;
    }
    if (id === "asciify") {
      // 预览以一次字符化表演后长时间停留原图；终态与真实镜头严格一致。
      const cycle = t % 4.8;
      base.effectProgress = Math.min(1, Math.max(0, (cycle - 0.2) / 1.45));
    }
    if (id === "particle-reveal" || id === "decrypt-reveal") {
      // 单次揭示完成后保留原始内容一段时间，预览与真实 shot 终态同构。
      const cycle = t % 4.6;
      base.effectProgress = Math.min(1, Math.max(0, (cycle - 0.25) / 1.85));
    }
    if (id === "droplets") {
      // CanvasUI 同款 rain field：少量静滴 + 两层下落水滴和折射拖痕。
      base.intensity = 1;
      base.scale = 0.4;
      base.speed = 1;
      base.refraction = 0.2;
    }
    if (id === "text-focus") {
      // Text Focus 使用屏幕坐标的 [left, top, width, height]，MaterialElement 负责翻成 texture UV。
      base.focusBox = [0.05, 0.51, 0.28, 0.18];
      base.focusFeather = 0.035;
      const cycle = t % 4.6;
      base.effectProgress = Math.min(1, Math.max(0, (cycle - 0.2) / 1.35));
    }
    if (id === "bend") base.bend = Math.abs(Math.sin(t * 0.9)) * 1.1;
    if (id === "cloth") {
      base.amplitude = 0.34;
      base.speed = 1.6;
    }
    if (isStorePeel || isAb) base.progress = 0.5 - 0.5 * Math.cos((t / 4) * Math.PI * 2);
    return base;
  }, [id, isAb, isStorePeel, t]);

  const abProgress = 0.5 - 0.5 * Math.cos((t / 4) * Math.PI * 2);
  const abMaterial = (() => {
    switch (id) {
      case "slide":
        return <SlideTransitionMaterial mapA={baseTexture} mapB={texture} progress={abProgress} width={width} height={height} direction="from-left" />;
      case "wipe":
        return <WipeTransitionMaterial mapA={baseTexture} mapB={texture} progress={abProgress} width={width} height={height} direction="from-left" />;
      case "flip":
        return <FlipTransitionMaterial mapA={baseTexture} mapB={texture} progress={abProgress} width={width} height={height} />;
      case "clock-wipe":
        return <ClockWipeTransitionMaterial mapA={baseTexture} mapB={texture} progress={abProgress} width={width} height={height} />;
      case "iris":
        return <IrisTransitionMaterial mapA={baseTexture} mapB={texture} progress={abProgress} width={width} height={height} />;
      case "cross-zoom":
        return <CrossZoomTransitionMaterial mapA={baseTexture} mapB={texture} progress={abProgress} width={width} height={height} />;
      default:
        return <FadeTransitionMaterial mapA={baseTexture} mapB={texture} progress={abProgress} width={width} height={height} />;
    }
  })();

  const mesh = isAb ? (
    <mesh>
      <planeGeometry args={[(width / height) * PLANE_HEIGHT, PLANE_HEIGHT, 48, 48]} />
      {abMaterial}
    </mesh>
  ) : (
    <mesh>
      <planeGeometry args={[(width / height) * PLANE_HEIGHT, PLANE_HEIGHT, 48, 48]} />
      <MaterialElement
        frame={frame}
        fps={fps}
        height={height}
        id={id as MaterialId}
        map={texture}
        options={options}
        width={width}
      />
    </mesh>
  );

  return (
    <ThreeVideoCanvas background="#0b1020">
      {needsBase ? (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[(width / height) * PLANE_HEIGHT, PLANE_HEIGHT]} />
          <meshBasicMaterial map={baseTexture} toneMapped={false} />
        </mesh>
      ) : null}
      {mesh}
      <RemotionFrameInvalidator />
    </ThreeVideoCanvas>
  );
};
