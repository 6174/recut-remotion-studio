/**
 * [INPUT]: 依赖 React ShotSurface、浏览器 Canvas、SVG foreignObject、Three CanvasTexture 与 Remotion render gate
 * [OUTPUT]: 对外提供 useHtmlTexture 与 renderShotMarkup，将同一棵 React shot tree 光栅化为 GPU texture
 * [POS]: composition-graph 的 foreignObject 基线 adapter；与 HIC adapter 共享 scene components，只替换捕获机制
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { createElement, useLayoutEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender } from "remotion";
import * as THREE from "three";
import { ShotSurface } from "./shots/scenes";
import { shotAt } from "./timeline";

export const HTML_CARD_WIDTH = 1920;
export const HTML_CARD_HEIGHT = 1080;

export const renderShotMarkup = (frame: number, fps: number) => {
  const shot = shotAt(frame, fps);
  return renderToStaticMarkup(
    createElement(ShotSurface, {
      frame,
      fps,
      id: shot.id,
      progress: shot.progress,
    }),
  );
};

const svgSource = (frame: number, fps: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${HTML_CARD_WIDTH}" height="${HTML_CARD_HEIGHT}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${HTML_CARD_WIDTH}px;height:${HTML_CARD_HEIGHT}px">${renderShotMarkup(frame, fps)}</div></foreignObject></svg>`;

const rasterize = (
  canvas: HTMLCanvasElement,
  texture: THREE.CanvasTexture,
  frame: number,
  fps: number,
  done: (duration: number) => void,
) => {
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

export const useHtmlTexture = ({
  animate,
  frame,
  fps,
}: {
  animate: boolean;
  frame: number;
  fps: number;
}) => {
  const invalidate = useThree((state) => state.invalidate);
  const sampleFrame = animate ? frame : 0;
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
    const handle = delayRender("Rasterizing Composition Graph React shot");
    const request = latestRequest.current + 1;
    latestRequest.current = request;
    let completed = false;
    const finish = () => {
      if (!completed) {
        completed = true;
        continueRender(handle);
      }
    };
    rasterize(canvas, texture, sampleFrame, fps, (duration) => {
      if (request !== latestRequest.current) return finish();
      window.dispatchEvent(
        new CustomEvent("composition-graph-html-metrics", {
          detail: { adapter: "foreign-object", duration, frame: sampleFrame },
        }),
      );
      invalidate();
      finish();
    });
    return finish;
  }, [canvas, fps, invalidate, sampleFrame, texture]);

  useLayoutEffect(() => () => texture.dispose(), [texture]);
  return { texture, width: HTML_CARD_WIDTH, height: HTML_CARD_HEIGHT };
};
