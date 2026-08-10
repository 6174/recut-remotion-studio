/**
 * [INPUT]: 依赖 Chromium HTML-in-Canvas（layoutSubtree/captureElementImage）或 foreignObject、
 *         Remotion 帧时钟、Sequence 与 Three CanvasTexture
 * [OUTPUT]: 对外提供 HtmlSurfaceProvider（把内容渲染进真实 React 树并光栅化为 GPU 纹理）、
 *           HtmlSurfacePlane（R3F 内容平面）与 useHtmlSurfaceTexture（读共享纹理）
 * [POS]: remotion-kit/src/three 的内容纹理层。内容渲染在**真实 React 树**（Player/合成 context
 *        内，Remotion hooks 可用），是 layoutSubtree canvas 的子节点；每帧 requestPaint 后经
 *        captureElementImage 上传到 CanvasTexture。HIC 不支持时回退 foreignObject。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { continueRender, delayRender, HtmlInCanvas } from "remotion";

export type HtmlSurfaceRasterizer = "html-in-canvas" | "foreign-object";
export type HtmlSurfaceStatus = "pending" | "verified" | "unavailable" | "failed";

export interface HtmlSurfaceContextValue {
  texture: THREE.CanvasTexture | null;
  width: number;
  height: number;
  /** 每次成功 capture 递增；R3F 侧据此 invalidate。 */
  captureVersion: number;
}

export const HtmlSurfaceContext = createContext<HtmlSurfaceContextValue>({
  texture: null,
  width: 1920,
  height: 1080,
  captureVersion: 0,
});

export const useHtmlSurfaceTexture = () => useContext(HtmlSurfaceContext);

export const supportsHtmlInCanvas = () => HtmlInCanvas.isSupported();

type CaptureCanvas = HTMLCanvasElement & {
  layoutSubtree?: boolean;
  requestPaint?: () => void;
  captureElementImage?: (element: Element) => {
    close: () => void;
  } & OffscreenCanvas;
};

type CaptureContext = OffscreenCanvasRenderingContext2D & {
  drawElementImage?: (source: ImageBitmap | CanvasImageSource | OffscreenCanvas, dx: number, dy: number) => void;
};

const toSvgSource = (markup: string, width: number, height: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px">${markup}</div></foreignObject></svg>`;

export interface HtmlSurfaceProviderProps {
  /** 待光栅化的内容（真实 React 树内渲染；hooks 可用） */
  content: React.ReactNode;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
  rasterizer?: HtmlSurfaceRasterizer;
  onRasterized?: (metrics: {
    adapter: HtmlSurfaceRasterizer;
    status: HtmlSurfaceStatus;
    duration?: number;
  }) => void;
  /** 覆盖在捕获面之上的真实树内容（ThreeVideoCanvas 等，负责遮挡捕获 canvas） */
  children: React.ReactNode;
}

/**
 * HtmlSurfaceProvider：把内容渲染进真实 React 树（layoutSubtree canvas 子节点），
 * 每帧 requestPaint → captureElementImage → OffscreenCanvas → CanvasTexture，经 context 共享给 R3F。
 */
export const HtmlSurfaceProvider: React.FC<HtmlSurfaceProviderProps> = ({
  content,
  frame,
  fps,
  width = 1920,
  height = 1080,
  rasterizer = "html-in-canvas",
  onRasterized,
  children,
}) => {
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackDivRef = useRef<HTMLDivElement>(null);
  const onRasterizedRef = useRef(onRasterized);
  onRasterizedRef.current = onRasterized;
  const [captureVersion, setCaptureVersion] = useState(0);
  const useHic = rasterizer === "html-in-canvas" && supportsHtmlInCanvas();
  const [texture] = useState(() => {
    const surface = document.createElement("canvas");
    surface.width = width;
    surface.height = height;
    const output = new THREE.CanvasTexture(surface);
    output.colorSpace = THREE.SRGBColorSpace;
    output.minFilter = THREE.LinearFilter;
    output.magFilter = THREE.LinearFilter;
    return output;
  });
  const contextValue = useMemo(
    () => ({ texture, width, height, captureVersion }),
    [captureVersion, height, texture, width],
  );
  const notify = (adapter: HtmlSurfaceRasterizer, status: HtmlSurfaceStatus, duration?: number) => {
    onRasterizedRef.current?.({ adapter, status, duration });
  };

  useLayoutEffect(() => () => texture.dispose(), [texture]);

  // HIC 主路径：transferControlToOffscreen + paint 事件 captureElementImage → 上传纹理。
  useLayoutEffect(() => {
    if (!useHic) {
      notify("html-in-canvas", "unavailable");
      return;
    }
    const canvas = captureCanvasRef.current as CaptureCanvas | null;
    if (!canvas || !canvas.captureElementImage) {
      notify("html-in-canvas", "unavailable");
      return;
    }
    canvas.layoutSubtree = true;
    const offscreen = canvas.transferControlToOffscreen();
    const context = offscreen.getContext("2d") as CaptureContext | null;
    const onPaint = () => {
      const element = canvas.firstElementChild;
      if (!element || !context) return;
      const startedAt = performance.now();
      const image = canvas.captureElementImage!(element);
      try {
        context.reset();
        if (context.drawElementImage) {
          context.drawElementImage(image, 0, 0);
        } else {
          context.drawImage(image, 0, 0);
        }
        texture.image = offscreen;
        texture.needsUpdate = true;
        setCaptureVersion((version) => version + 1);
        notify("html-in-canvas", "verified", performance.now() - startedAt);
      } catch (cause) {
        notify("html-in-canvas", "failed", performance.now() - startedAt);
        console.error("[HtmlSurfaceProvider] capture failed", cause);
      } finally {
        image.close();
      }
    };
    canvas.addEventListener("paint", onPaint);
    canvas.requestPaint?.();
    return () => {
      canvas.removeEventListener("paint", onPaint);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture, useHic, width, height]);

  // 帧/内容变化 → 请求一次 paint 捕获最新画面。
  useLayoutEffect(() => {
    if (useHic) captureCanvasRef.current?.requestPaint?.();
  }, [useHic, frame, content]);

  // foreignObject 回退：序列化已渲染内容的 innerHTML → SVG → Image → 上传纹理。
  useLayoutEffect(() => {
    if (useHic || rasterizer !== "foreign-object") return;
    const node = fallbackDivRef.current;
    if (!node) return;
    const handle = delayRender("Rasterizing HtmlSurface foreignObject");
    const image = new Image();
    image.onload = () => {
      const startedAt = performance.now();
      const surface = texture.image as HTMLCanvasElement;
      const context = surface.getContext("2d");
      context?.clearRect(0, 0, width, height);
      context?.drawImage(image, 0, 0);
      texture.needsUpdate = true;
      setCaptureVersion((version) => version + 1);
      notify("foreign-object", "verified", performance.now() - startedAt);
      continueRender(handle);
    };
    image.onerror = () => {
      notify("foreign-object", "failed");
      continueRender(handle);
    };
    const markup = `<div style="width:${width}px;height:${height}px">${node.innerHTML}</div>`;
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(toSvgSource(markup, width, height))}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rasterizer, texture, useHic, width, height, frame, content]);

  return (
    <HtmlSurfaceContext.Provider value={contextValue}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {useHic ? (
          <canvas
            ref={captureCanvasRef}
            width={width}
            height={height}
            style={{ position: "absolute", left: 0, top: 0, width, height, pointerEvents: "none" }}
          >
            {content}
          </canvas>
        ) : (
          <div
            ref={fallbackDivRef}
            style={{ position: "absolute", left: 0, top: 0, width, height, visibility: "hidden", pointerEvents: "none" }}
          >
            {content}
          </div>
        )}
        {children}
      </div>
    </HtmlSurfaceContext.Provider>
  );
};

export interface HtmlSurfacePlaneProps {
  /** 覆盖材质；缺省为 meshBasicMaterial 直接贴纹理 */
  material?: (texture: THREE.Texture) => React.ReactNode;
  planeHeight?: number;
}

/**
 * HtmlSurfacePlane：R3F 内容平面。从 context 读共享纹理，画在 Three 场景中；
 * 每次 captureVersion 变化时 invalidate 触发重绘。
 */
export const HtmlSurfacePlane: React.FC<HtmlSurfacePlaneProps> = ({ material, planeHeight = 4.9 }) => {
  const { texture, width, height, captureVersion } = useHtmlSurfaceTexture();
  const { invalidate } = useThree();
  useLayoutEffect(() => invalidate(), [captureVersion, invalidate]);
  return (
    <mesh>
      <planeGeometry args={[(width / height) * planeHeight, planeHeight, 32, 1]} />
      {texture
        ? material
          ? material(texture)
          : <meshBasicMaterial map={texture} toneMapped={false} />
        : null}
    </mesh>
  );
};
