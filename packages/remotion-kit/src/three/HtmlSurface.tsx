/**
 * [INPUT]: 依赖 Chromium HTML-in-Canvas（layoutSubtree/captureElementImage）或 foreignObject、
 *         Remotion 帧时钟、Sequence 与 Three CanvasTexture
 * [OUTPUT]: 对外提供 HtmlSurfaceProvider（内容渲染进真实 React 树并光栅化为 GPU 纹理）、
 *           HtmlSurfacePlane（带真实 Three 姿态的 R3F 内容平面）、FrozenSurface（一次性冻结捕获，供 A/B 转场用）
 *          与 useHtmlSurfaceTexture / useFrozenSurfaceTexture
 * [POS]: remotion-kit/src/three 的内容纹理层。内容渲染在**真实 React 树**（Player/合成 context
 *        内，Remotion hooks 可用），是 layoutSubtree canvas 的子节点；每帧 requestPaint 后经
 *        captureElementImage 上传到 CanvasTexture。HIC 不支持时回退 foreignObject。
 *        FrozenSurface 捕获一次即冻结，作为 A/B 转场的“前镜头”输入。
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

export const FrozenSurfaceContext = createContext<HtmlSurfaceContextValue>({
  texture: null,
  width: 1920,
  height: 1080,
  captureVersion: 0,
});

export const useFrozenSurfaceTexture = () => useContext(FrozenSurfaceContext);

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

export interface SurfaceCaptureOptions {
  content: React.ReactNode;
  width: number;
  height: number;
  rasterizer?: HtmlSurfaceRasterizer;
  onRasterized?: (metrics: {
    adapter: HtmlSurfaceRasterizer;
    status: HtmlSurfaceStatus;
    duration?: number;
  }) => void;
  /** frozen=true 时只在挂载捕获一次，不再随帧刷新。 */
  frozen?: boolean;
}

/** 共享捕获逻辑：HIC（主）/ foreignObject（备）→ CanvasTexture。 */
const useSurfaceCapture = ({
  content,
  width,
  height,
  rasterizer = "html-in-canvas",
  onRasterized,
  frozen = false,
}: SurfaceCaptureOptions) => {
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
        console.error("[HtmlSurface] capture failed", cause);
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

  // 帧/内容变化 → 请求一次 paint 捕获最新画面（frozen 时只在挂载捕获一次）。
  useLayoutEffect(() => {
    if (useHic) captureCanvasRef.current?.requestPaint?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, frozen ? [] : [useHic, content]);

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
  }, [rasterizer, texture, useHic, width, height, content]);

  return { texture, width, height, captureVersion, useHic, captureCanvasRef, fallbackDivRef };
};

/** 捕获面的 DOM 结构：layoutSubtree canvas（或回退 div）承载 content。 */
const CaptureDom: React.FC<{
  content: React.ReactNode;
  width: number;
  height: number;
  useHic: boolean;
  captureCanvasRef: React.RefObject<HTMLCanvasElement>;
  fallbackDivRef: React.RefObject<HTMLDivElement>;
}> = ({ content, width, height, useHic, captureCanvasRef, fallbackDivRef }) =>
  useHic ? (
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
  );

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

/** HtmlSurfaceProvider：实时捕获当前内容，提供 HtmlSurfaceContext（A/B 转场的“B”输入）。 */
export const HtmlSurfaceProvider: React.FC<HtmlSurfaceProviderProps> = ({
  content,
  frame,
  fps,
  width = 1920,
  height = 1080,
  rasterizer,
  onRasterized,
  children,
}) => {
  const capture = useSurfaceCapture({ content, width, height, rasterizer, onRasterized });
  const contextValue = useMemo(
    () => ({ texture: capture.texture, width, height, captureVersion: capture.captureVersion }),
    [capture.captureVersion, capture.texture, height, width],
  );
  return (
    <HtmlSurfaceContext.Provider value={contextValue}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <CaptureDom
          content={content}
          fallbackDivRef={capture.fallbackDivRef}
          height={height}
          useHic={capture.useHic}
          width={width}
          captureCanvasRef={capture.captureCanvasRef}
        />
        {children}
      </div>
    </HtmlSurfaceContext.Provider>
  );
};

export interface FrozenSurfaceProps {
  /** 待冻结光栅化的内容（真实 React 树内渲染；hooks 可用） */
  content: React.ReactNode;
  width?: number;
  height?: number;
  rasterizer?: HtmlSurfaceRasterizer;
  onRasterized?: HtmlSurfaceProviderProps["onRasterized"];
  children: React.ReactNode;
}

/** FrozenSurface：挂载时捕获一次并冻结，提供 FrozenSurfaceContext（A/B 转场的“A”输入）。 */
export const FrozenSurface: React.FC<FrozenSurfaceProps> = ({
  content,
  width = 1920,
  height = 1080,
  rasterizer,
  onRasterized,
  children,
}) => {
  const capture = useSurfaceCapture({ content, width, height, rasterizer, onRasterized, frozen: true });
  const contextValue = useMemo(
    () => ({ texture: capture.texture, width, height, captureVersion: capture.captureVersion }),
    [capture.captureVersion, capture.texture, height, width],
  );
  return (
    <FrozenSurfaceContext.Provider value={contextValue}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <CaptureDom
          content={content}
          fallbackDivRef={capture.fallbackDivRef}
          height={height}
          useHic={capture.useHic}
          width={width}
          captureCanvasRef={capture.captureCanvasRef}
        />
        {children}
      </div>
    </FrozenSurfaceContext.Provider>
  );
};

export interface HtmlSurfacePlaneProps {
  /** 覆盖材质；缺省为 meshBasicMaterial 直接贴纹理 */
  material?: (texture: THREE.Texture) => React.ReactNode;
  planeHeight?: number;
  /** 表面而非相机的真实 Three 姿态；用于单页的快速倾斜、远近与落位。 */
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: readonly [number, number, number];
  /** 实际网格曲率（非屏幕 shader）：与 mesh 姿态一起构成单页 2.5D 表达。 */
  bend?: number;
  cornerCurl?: number;
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  cloth?: { amplitude: number; speed: number; scale: number };
  time?: number;
}

/**
 * 真实网格弯曲：同一张纹理沿 Y 轴卷起。它保留与所有后处理材质的组合能力，
 * 因为曲率发生在 geometry，而不是占用 effect material 插槽。
 */
export const SurfacePlaneGeometry: React.FC<{
  width: number;
  height: number;
  bend: number;
  cornerCurl?: number;
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  cloth?: { amplitude: number; speed: number; scale: number };
  time?: number;
}> = ({ width, height, bend, cornerCurl = 0, corner, cloth, time = 0 }) => {
  const geometry = useRef<THREE.PlaneGeometry>(null);
  const { invalidate } = useThree();
  useLayoutEffect(() => {
    const current = geometry.current;
    if (!current) return;
    const positions = current.attributes.position;
    const uvs = current.attributes.uv;
    const halfHeight = height / 2;
    for (let index = 0; index < positions.count; index += 1) {
      const y = (uvs.getY(index) - 0.5) * height;
      const fold = (y / halfHeight) * bend * 2.1;
      const u = uvs.getX(index);
      const v = uvs.getY(index);
      const cornerWeight = corner === "top-left" ? (1 - u) * v
        : corner === "top-right" ? u * v
          : corner === "bottom-left" ? (1 - u) * (1 - v)
            : corner === "bottom-right" ? u * (1 - v)
              : 0;
      const curl = Math.pow(cornerWeight, 1.6) * cornerCurl;
      const wave = cloth
        ? Math.sin(u * cloth.scale * Math.PI * 2 + time * cloth.speed)
          * Math.cos(v * cloth.scale * Math.PI * 1.5 + time * cloth.speed * 0.7)
          * cloth.amplitude
        : 0;
      positions.setXYZ(
        index,
        (u - 0.5) * width + wave * 0.3,
        y * Math.cos(fold),
        Math.abs(y) * Math.sin(Math.abs(fold)) * 0.92 + curl * height * 0.32 + wave,
      );
    }
    positions.needsUpdate = true;
    current.computeVertexNormals();
    invalidate();
  }, [bend, cloth, corner, cornerCurl, height, invalidate, time, width]);
  return <planeGeometry ref={geometry} args={[width, height, 32, 32]} />;
};

/** HtmlSurfacePlane：R3F 内容平面。从 HtmlSurfaceContext 读共享纹理，画在 Three 场景中。 */
export const HtmlSurfacePlane: React.FC<HtmlSurfacePlaneProps> = ({ material, planeHeight = 4.9, position, rotation, scale, bend = 0, cornerCurl, corner, cloth, time }) => {
  const { texture, width, height, captureVersion } = useHtmlSurfaceTexture();
  const { invalidate } = useThree();
  useLayoutEffect(() => invalidate(), [captureVersion, invalidate]);
  return (
    <mesh
      position={position as [number, number, number] | undefined}
      rotation={rotation as [number, number, number] | undefined}
      scale={scale as [number, number, number] | undefined}
    >
      <SurfacePlaneGeometry bend={bend} cloth={cloth} corner={corner} cornerCurl={cornerCurl} height={planeHeight} time={time} width={(width / height) * planeHeight} />
      {texture
        ? material
          ? material(texture)
          : <meshBasicMaterial map={texture} toneMapped={false} />
        : null}
    </mesh>
  );
};
