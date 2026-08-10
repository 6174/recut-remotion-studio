/**
 * [INPUT]: 依赖 Chromium HTML-in-Canvas layoutSubtree/drawElementImage、Remotion frame 与 Three CanvasTexture
 * [OUTPUT]: 对外提供 useHtmlInCanvasTexture，以真实 DOM subtree 直接光栅化为 GPU texture，首帧验证 sentinel 后报告能力/耗时
 * [POS]: composition-graph 的原生 HTML-in-Canvas 对照组；与 foreignObject adapter 共享同一份 HTML 内容和 texture 尺寸
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { createElement, useLayoutEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HTML_CARD_HEIGHT, HTML_CARD_WIDTH } from "./html-texture";
import { ShotSurface } from "./shots/scenes";
import { shotAt } from "./timeline";

type CaptureCanvas = HTMLCanvasElement & {
  layoutSubtree?: boolean;
  onpaint?: (() => void) | null;
  requestPaint?: () => void;
};

type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => void;
};

export type HtmlInCanvasStatus =
  "pending" | "verified" | "unavailable" | "failed";

export const supportsHtmlInCanvas = () => {
  const canvas = document.createElement("canvas") as CaptureCanvas;
  const context = canvas.getContext("2d") as ElementImageContext | null;
  return (
    typeof canvas.requestPaint === "function" &&
    typeof context?.drawElementImage === "function"
  );
};

const createCaptureHost = () => {
  const host = document.createElement("canvas") as CaptureCanvas;
  host.width = HTML_CARD_WIDTH;
  host.height = HTML_CARD_HEIGHT;
  host.setAttribute("layoutsubtree", "true");
  host.style.cssText = `position:fixed;left:0;top:0;width:${HTML_CARD_WIDTH}px;height:${HTML_CARD_HEIGHT}px;pointer-events:none;z-index:-1;`;
  const content = document.createElement("div");
  content.id = "composition-graph-hic-source";
  content.style.cssText = `display:block;width:${HTML_CARD_WIDTH}px;height:${HTML_CARD_HEIGHT}px;`;
  host.appendChild(content);
  document.body.appendChild(host);
  return { host, content };
};

export const useHtmlInCanvasTexture = ({
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
  const sampleFrameRef = useRef(sampleFrame);
  const paintCountRef = useRef(0);
  const sentinelVerifiedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<CaptureCanvas | null>(null);
  const rootRef = useRef<Root | null>(null);
  const supported = supportsHtmlInCanvas();
  const [status, setStatus] = useState<HtmlInCanvasStatus>("pending");
  const [{ canvas, texture }] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = HTML_CARD_WIDTH;
    canvas.height = HTML_CARD_HEIGHT;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { canvas, texture };
  });
  sampleFrameRef.current = sampleFrame;

  useLayoutEffect(() => {
    if (!supported) {
      setStatus("unavailable");
      window.dispatchEvent(
        new CustomEvent("composition-graph-html-metrics", {
          detail: { adapter: "html-in-canvas", status: "unavailable" },
        }),
      );
      return;
    }
    const { host, content } = createCaptureHost();
    const context = host.getContext("2d") as ElementImageContext | null;
    if (!context || !context.drawElementImage)
      throw new Error("HTML-in-Canvas 无法创建 drawElementImage context");
    host.layoutSubtree = true;
    contentRef.current = content;
    hostRef.current = host;
    rootRef.current = createRoot(content);
    host.onpaint = () => {
      const startedAt = performance.now();
      try {
        context.reset();
        context.drawElementImage(content, 0, 0);
        if (!sentinelVerifiedRef.current) {
          const pixel = context.getImageData(0, 0, 1, 1).data;
          const sentinelCaptured =
            pixel[1] > 180 && pixel[0] > 70 && pixel[0] < 160 && pixel[2] > 130;
          if (!sentinelCaptured) {
            throw new Error(`HIC sentinel missing: rgba(${pixel.join(",")})`);
          }
          sentinelVerifiedRef.current = true;
        }
        paintCountRef.current += 1;
        setStatus("verified");
        texture.image = host;
        texture.needsUpdate = true;
        window.dispatchEvent(
          new CustomEvent("composition-graph-html-metrics", {
            detail: {
              adapter: "html-in-canvas",
              duration: performance.now() - startedAt,
              frame: sampleFrameRef.current,
              verified: sentinelVerifiedRef.current,
              paintCount: paintCountRef.current,
              engine: "paint -> drawElementImage(DIV) -> CanvasTexture",
            },
          }),
        );
        invalidate();
      } catch (cause) {
        setStatus("failed");
        window.dispatchEvent(
          new CustomEvent("composition-graph-html-metrics", {
            detail: {
              adapter: "html-in-canvas",
              status: "capture-failed",
              message: cause instanceof Error ? cause.message : String(cause),
            },
          }),
        );
      }
    };
    return () => {
      host.onpaint = null;
      sentinelVerifiedRef.current = false;
      hostRef.current = null;
      contentRef.current = null;
      rootRef.current?.unmount();
      rootRef.current = null;
      host.remove();
    };
  }, [invalidate, supported, texture]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const host = hostRef.current;
    const root = rootRef.current;
    if (!content || !host || !root) return;
    const shot = shotAt(sampleFrame, fps);
    flushSync(() => {
      root.render(
        createElement(ShotSurface, {
          id: shot.id,
          frame: sampleFrame,
          fps,
          progress: shot.progress,
        }),
      );
    });
    host.requestPaint?.();
  }, [fps, sampleFrame, supported]);

  useLayoutEffect(() => () => texture.dispose(), [texture]);

  return {
    texture,
    width: HTML_CARD_WIDTH,
    height: HTML_CARD_HEIGHT,
    supported,
    status,
  };
};
