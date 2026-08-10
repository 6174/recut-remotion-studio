/**
 * [INPUT]: 依赖浏览器 Canvas、SVG foreignObject、Three CanvasTexture 与 Remotion render gate
 * [OUTPUT]: 对外提供 useHtmlTexture，将固定 HTML/CSS 布局光栅化为可销毁的 GPU 纹理
 * [POS]: composition-graph 的 HTML renderer；这里是 DOM 世界进入 GPU Composition 的唯一边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useLayoutEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender } from "remotion";
import * as THREE from "three";

export const HTML_CARD_WIDTH = 1180;
export const HTML_CARD_HEIGHT = 510;

export const titleMarkup = (frame: number, fps: number) => {
  const phase = (frame % (fps * 4)) / (fps * 4);
  const progress = Math.round(phase * 100);
  const offset = Math.round(Math.sin(phase * Math.PI * 2) * 22);
  return `
  <div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing:border-box;width:${HTML_CARD_WIDTH}px;height:${HTML_CARD_HEIGHT}px;padding:62px 68px;color:#f4f7fb;font-family:Inter,Arial,sans-serif;background:#111a2c;display:flex;flex-direction:column;justify-content:space-between">
    <div data-capture-sentinel="true" style="position:absolute;left:16px;top:16px;width:8px;height:8px;background:#77f5ba"></div>
    <div style="display:flex;align-items:center;gap:16px;font-size:22px;font-weight:700;letter-spacing:3px;color:#77f5ba"><span style="display:inline-block;width:14px;height:14px;background:#77f5ba"></span>HTML LAYER</div>
    <div style="transform:translateX(${offset}px)"><div style="font-size:80px;line-height:0.95;font-weight:800;letter-spacing:0">Anything becomes<br/>a composable node.</div><div style="margin-top:28px;font-size:27px;line-height:1.4;color:#9baec8">Browser layout -> raster texture -> GPU material</div><div style="height:8px;margin-top:26px;background:#263c53"><div style="width:${progress}%;height:100%;background:#77f5ba"></div></div></div>
    <div style="display:flex;justify-content:space-between;font-size:20px;color:#9baec8"><span>DOM / CSS / Typography</span><span>FRAME ${String(frame).padStart(3, "0")}</span></div>
  </div>`;
};

const svgSource = (frame: number, fps: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${HTML_CARD_WIDTH}" height="${HTML_CARD_HEIGHT}"><foreignObject width="100%" height="100%">${titleMarkup(frame, fps)}</foreignObject></svg>`;

const rasterize = (canvas: HTMLCanvasElement, texture: THREE.CanvasTexture, frame: number, fps: number, done: (duration: number) => void) => {
  const startedAt = performance.now();
  const image = new Image();
  image.onload = () => {
    const context = canvas.getContext("2d");
    context?.clearRect(0, 0, canvas.width, canvas.height);
    context?.drawImage(image, 0, 0);
    texture.needsUpdate = true;
    done(performance.now() - startedAt);
  };
  image.onerror = () => done(performance.now() - startedAt);
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgSource(frame, fps))}`;
};

export const useHtmlTexture = ({ animate, frame, fps }: { animate: boolean; frame: number; fps: number }) => {
  const invalidate = useThree((state) => state.invalidate);
  const sampleFrame = animate ? Math.floor(frame / 2) * 2 : 0;
  const latestRequest = useRef(0);
  const [{ canvas, texture }] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = HTML_CARD_WIDTH;
    canvas.height = HTML_CARD_HEIGHT;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { canvas, texture };
  });

  useLayoutEffect(() => {
    const handle = delayRender("Rasterizing Composition Graph HTML layer");
    const request = latestRequest.current + 1;
    latestRequest.current = request;
    let completed = false;
    const finish = () => { if (!completed) { completed = true; continueRender(handle); } };
    rasterize(canvas, texture, sampleFrame, fps, (duration) => {
      if (request !== latestRequest.current) return finish();
      window.dispatchEvent(new CustomEvent("composition-graph-html-metrics", { detail: { adapter: "foreign-object", duration, frame: sampleFrame } }));
      invalidate();
      finish();
    });
    return finish;
  }, [canvas, fps, invalidate, sampleFrame, texture]);

  useLayoutEffect(() => () => texture.dispose(), [texture]);

  return { texture, width: HTML_CARD_WIDTH, height: HTML_CARD_HEIGHT };
};
