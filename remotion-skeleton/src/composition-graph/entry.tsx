/**
 * [INPUT]: 依赖 React、@remotion/player、Composition Graph 定义与 GPU composition
 * [OUTPUT]: 对外提供独立 Vite 实验页、稳定的 capture benchmark 面板与实时播放器
 * [POS]: composition-graph.html 的唯一浏览器入口；不读取 Recut SDK、项目状态或服务端接口
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Player } from "@remotion/player";
import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { CompositionGraphComposition, GRAPH_DURATION_IN_FRAMES } from "./composition";
import { compositionGraph, graphNodeCount } from "./graph";
import { supportsHtmlInCanvas } from "./html-in-canvas-texture";
import "./style.css";

type Adapter = "foreign-object" | "html-in-canvas";
type CaptureStatus = "waiting" | "recording" | "unavailable" | "failed";

interface CaptureMeasurement {
  samples: number[];
  status: CaptureStatus;
  message?: string;
  verified?: boolean;
  paintCount?: number;
}

const SAMPLE_WINDOW = 90;

const initialMeasurements = (): Record<Adapter, CaptureMeasurement> => ({
  "foreign-object": { samples: [], status: "waiting" },
  "html-in-canvas": { samples: [], status: "waiting" },
});

const percentile = (samples: number[], ratio: number) => {
  if (samples.length === 0) return null;
  const sorted = [...samples].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio))];
};

const formatMs = (value: number | null) => value === null ? "--" : `${value.toFixed(2)} ms`;

const GraphTree = () => (
  <ol className="graph-tree">
    {compositionGraph.map((node) => (
      <li className={`graph-node graph-node-${node.kind}`} key={node.id} style={{ marginLeft: node.parentId ? 20 : 0 }}>
        <span className="node-kind">{node.kind}</span>
        <span>{node.label}</span>
        <small>{node.renderer}</small>
      </li>
    ))}
  </ol>
);

const CaptureColumn: React.FC<{ label: string; measurement: CaptureMeasurement }> = ({ label, measurement }) => {
  const last = measurement.samples.at(-1) ?? null;
  const mean = measurement.samples.length === 0 ? null : measurement.samples.reduce((total, value) => total + value, 0) / measurement.samples.length;
  const p95 = percentile(measurement.samples, 0.95);
  const state = measurement.verified ? "VERIFIED" : measurement.status.toUpperCase();
  return (
    <article className="benchmark-column">
      <div className="benchmark-column-heading">
        <span>{label}</span>
        <output className={`capture-state capture-state-${measurement.status}`} title={measurement.message}>{state}</output>
      </div>
      <dl className="benchmark-values">
        <div><dt>latest</dt><dd>{formatMs(last)}</dd></div>
        <div><dt>mean</dt><dd>{formatMs(mean)}</dd></div>
        <div><dt>p95</dt><dd>{formatMs(p95)}</dd></div>
      </dl>
      <div className="benchmark-samples">{measurement.samples.length} / {SAMPLE_WINDOW} samples</div>
      {measurement.verified ? <div className="benchmark-proof">paint {measurement.paintCount} · drawElementImage(DIV)</div> : null}
    </article>
  );
};

const BenchmarkPanel = () => {
  const [fps, setFps] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const measurementsRef = useRef(measurements);

  useEffect(() => {
    const fpsListener = (event: Event) => setFps((event as CustomEvent<{ fps: number }>).detail.fps);
    const captureListener = (event: Event) => {
      const detail = (event as CustomEvent<{ adapter?: Adapter; duration?: number; status?: string; message?: string; verified?: boolean; paintCount?: number }>).detail;
      if (!detail.adapter) return;
      const previous = measurementsRef.current[detail.adapter];
      const samples = typeof detail.duration === "number" ? [...previous.samples, detail.duration].slice(-SAMPLE_WINDOW) : previous.samples;
      const status = typeof detail.duration === "number" ? "recording" : detail.status === "unavailable" ? "unavailable" : detail.status === "capture-failed" ? "failed" : previous.status;
      measurementsRef.current = { ...measurementsRef.current, [detail.adapter]: { samples, status, message: detail.message, verified: detail.verified ?? previous.verified, paintCount: detail.paintCount ?? previous.paintCount } };
    };
    const publish = window.setInterval(() => setMeasurements({ ...measurementsRef.current }), 500);
    window.addEventListener("composition-graph-metrics", fpsListener);
    window.addEventListener("composition-graph-html-metrics", captureListener);
    return () => {
      window.clearInterval(publish);
      window.removeEventListener("composition-graph-metrics", fpsListener);
      window.removeEventListener("composition-graph-html-metrics", captureListener);
    };
  }, []);

  return (
    <section aria-label="HTML capture benchmark" className="benchmark-panel">
      <div className="benchmark-heading">
        <div><p>CAPTURE BENCHMARK</p><span>rolling CPU copy time</span></div>
        <output className="benchmark-fps">{fps === null ? "-- FPS" : `${fps} FPS`}</output>
      </div>
      <div className="benchmark-grid">
        <CaptureColumn label="SVG foreignObject" measurement={measurements["foreign-object"]} />
        <CaptureColumn label="HTML-in-Canvas" measurement={measurements["html-in-canvas"]} />
      </div>
    </section>
  );
};

const Lab = () => {
  const [htmlAnimation, setHtmlAnimation] = useState(true);
  const [htmlRasterizer, setHtmlRasterizer] = useState<Adapter>("foreign-object");
  const [magnify, setMagnify] = useState(true);
  const nativeAvailable = supportsHtmlInCanvas();
  return (
    <main className="lab-shell">
      <header className="lab-header">
        <div><p>RECUT / LAB</p><h1>Composition Graph</h1></div>
        <div className="runtime-status">
          <label className="lab-select"><span>HTML capture</span><select aria-label="HTML capture adapter" onChange={(event) => setHtmlRasterizer(event.target.value as Adapter)} value={htmlRasterizer}><option value="foreign-object">SVG foreignObject</option><option disabled={!nativeAvailable} value="html-in-canvas">HTML-in-Canvas{nativeAvailable ? "" : " unavailable"}</option></select></label>
          <label className="lab-toggle"><input checked={htmlAnimation} onChange={(event) => setHtmlAnimation(event.target.checked)} type="checkbox" /><span>Animate HTML</span></label>
          <label className="lab-toggle"><input checked={magnify} onChange={(event) => setMagnify(event.target.checked)} type="checkbox" /><span>Magnify lens</span></label>
          <span>R3F + Remotion</span>
        </div>
      </header>
      <BenchmarkPanel />
      <section className="lab-main">
        <div className="player-frame"><Player acknowledgeRemotionLicense component={CompositionGraphComposition} compositionHeight={1080} compositionWidth={1920} controls durationInFrames={GRAPH_DURATION_IN_FRAMES} fps={30} inputProps={{ htmlAnimation, htmlRasterizer, magnify }} loop style={{ width: "100%", height: "100%" }} /></div>
        <aside className="graph-inspector"><p className="eyebrow">SCENE GRAPH · {graphNodeCount()} NODES</p><GraphTree /><div className="contract"><strong>Frame ownership</strong><span>Remotion advances time. Three renders exactly when its frame changes.</span></div></aside>
      </section>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<Lab />);
