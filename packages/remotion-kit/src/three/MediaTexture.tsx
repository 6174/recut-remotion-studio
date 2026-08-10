/**
 * [INPUT]: 依赖浏览器 Image、Three CanvasTexture 与 R3F
 * [OUTPUT]: 对外提供 useImageTexture（静态图片 → GPU 纹理）与 MediaPlane（媒体证据平面）
 * [POS]: remotion-kit/src/three 的媒体纹理层。静态图片确定性加载；视频纹理暂不在默认路径，
 *        需要时由调用方自建 VideoTexture（同样每帧只更新纹理内容，不重建）
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useState } from "react";
import * as THREE from "three";

export interface ImageTextureOptions {
  src: string | null;
  width?: number;
  height?: number;
}

export interface ImageTextureResult {
  texture: THREE.CanvasTexture | null;
  width: number;
  height: number;
}

/**
 * 把图片 URL 光栅化为 CanvasTexture。无 src 时返回 null（调用方可用占位色）。
 * 图片是静态素材，不依赖帧；seek 与并发导出得到同一纹理。
 */
export const useImageTexture = ({
  src,
  width = 960,
  height = 540,
}: ImageTextureOptions): ImageTextureResult => {
  const [{ canvas, texture }] = useState(() => {
    const surface = document.createElement("canvas");
    surface.width = width;
    surface.height = height;
    const output = new THREE.CanvasTexture(surface);
    output.colorSpace = THREE.SRGBColorSpace;
    output.minFilter = THREE.LinearFilter;
    output.magFilter = THREE.LinearFilter;
    return { canvas: surface, texture: output };
  });
  const [hasSource, setHasSource] = useState(false);

  useLayoutEffect(() => {
    if (!src) {
      setHasSource(false);
      return;
    }
    const image = new Image();
    image.onload = () => {
      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      context.drawImage(
        image,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      texture.needsUpdate = true;
      setHasSource(true);
    };
    image.src = src;
  }, [canvas, src, texture]);

  useLayoutEffect(() => () => texture.dispose(), [texture]);

  return { texture: hasSource ? texture : null, width, height };
};

export interface MediaPlaneProps {
  src?: string | null;
  /** 画布像素尺寸（决定纹理分辨率） */
  width?: number;
  height?: number;
  /** 无素材时的占位色 */
  placeholder?: string;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number | readonly [number, number, number];
  /** 平面世界尺寸（宽，高） */
  planeWidth: number;
  planeHeight: number;
}

/** 媒体证据平面：有图贴纹理，无图给占位色板。 */
export const MediaPlane: React.FC<MediaPlaneProps> = ({
  src,
  width = 960,
  height = 540,
  placeholder = "#14273a",
  position,
  rotation,
  scale,
  planeWidth,
  planeHeight,
}) => {
  const { texture } = useImageTexture({ src: src ?? null, width, height });
  return (
    <mesh
      position={position as [number, number, number] | undefined}
      rotation={rotation as [number, number, number] | undefined}
      scale={scale as number | [number, number, number] | undefined}
    >
      <planeGeometry args={[planeWidth, planeHeight]} />
      {texture ? (
        <meshBasicMaterial map={texture} toneMapped={false} />
      ) : (
        <meshBasicMaterial color={placeholder} toneMapped={false} />
      )}
    </mesh>
  );
};
