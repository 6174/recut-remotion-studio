/**
 * [INPUT]: three TextureLoader 与 dataURL 字符串
 * [OUTPUT]: 对外提供 getTexture(url)：dataURL → THREE.Texture 的同步缓存 + 异步填充；clearTextureCache 供清理
 * [POS]: spline-material 的贴图资产层；Image/Video/AI Texture 图层与 MaterialPanel swatch 共用，
 *        首帧返回占位（未加载时 colorSpace/翻转已配好），加载完成后原地填充并置 needsUpdate
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

const loader = new THREE.TextureLoader();

export const getTexture = (url: string): THREE.Texture | undefined => {
  if (!url) return undefined;
  const hit = cache.get(url);
  if (hit) return hit;
  const texture = new THREE.Texture();
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.name = "pending";
  cache.set(url, texture);
  loader.load(
    url,
    (loaded) => {
      texture.image = loaded.image;
      texture.name = loaded.name;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;
    },
    undefined,
    () => {
      cache.delete(url);
    },
  );
  return texture;
};

export const clearTextureCache = () => {
  cache.forEach((texture) => texture.dispose());
  cache.clear();
};

let placeholder: THREE.Texture | null = null;

/** 未上传图片时的占位棋盘，替代旧的内嵌棋盘 shader 分支 */
export const placeholderTexture = (): THREE.Texture => {
  if (placeholder) return placeholder;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#8f8f8f";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#6e6e6e";
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillRect(64, 64, 64, 64);
  placeholder = new THREE.CanvasTexture(canvas);
  placeholder.colorSpace = THREE.SRGBColorSpace;
  placeholder.wrapS = placeholder.wrapT = THREE.RepeatWrapping;
  placeholder.flipY = false;
  return placeholder;
};
