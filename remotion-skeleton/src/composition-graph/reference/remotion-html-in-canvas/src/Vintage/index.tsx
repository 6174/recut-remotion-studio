import React, { useCallback, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  HtmlInCanvas,
  type HtmlInCanvasOnInit,
  type HtmlInCanvasOnPaint,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { type GlState, initGl, paintGl } from "./gl";

const SERIF =
  '"Playfair Display", "Didot", "Bodoni 72", "Times New Roman", serif';

// Slide 1 — minimal documentary title card. Portrait + name + epithet on
// neutral grey (#eaeaea). Grain, scratches, leak, and split-tone are applied
// by the vintage shader.
const TitleSlide: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#eaeaea",
        color: "#1a1410",
        fontFamily: SERIF,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <Img
          src={staticFile("john-whitney.png")}
          style={{
            width: 420,
            height: 420,
            objectFit: "cover",
            objectPosition: "55% 30%",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
              lineHeight: 0.5,
              marginTop: 40,
            }}
          >
            John Whitney
          </div>
          <div
            style={{
              fontSize: 36,
              fontStyle: "italic",
              marginTop: 14,
              opacity: 0.75,
              letterSpacing: 1,
            }}
          >
            father of motion graphics
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Slide 2 — archival clip framed on paper with a caption underneath.
const VideoSlide: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#eaeaea",
        fontFamily: SERIF,
        color: "#1a1410",
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
      }}
    >
      <Video
        src={staticFile("motion-graphics-together.mp4")}
        muted
        style={{
          height: 500,
          backgroundColor: "#0a0806",
        }}
        objectFit="contain"
      />
      <div
        style={{
          fontSize: 48,
          fontStyle: "italic",
          letterSpacing: 1.5,
          opacity: 0.78,
        }}
      >
        Experiments in Motion Graphics (1968)
      </div>
    </AbsoluteFill>
  );
};

const DemoContent: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={75}>
        <TitleSlide />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({
          durationInFrames: 25,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={189}>
        <VideoSlide />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const VintageComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const gpuRef = useRef<GlState | null>(null);

  // Tuned for a believably faded print without going full sepia-monochrome.
  const grain = 0.126;
  const vignette = 0.6;
  const warmth = 0.28;
  const fade = 0.385;
  const time = frame / fps;

  const onInit: HtmlInCanvasOnInit = useCallback(({ canvas }) => {
    const { gpu, cleanup } = initGl(canvas);
    gpuRef.current = gpu;
    return () => {
      cleanup();
      gpuRef.current = null;
    };
  }, []);

  const onPaint: HtmlInCanvasOnPaint = useCallback(
    ({ elementImage }) => {
      const gpu = gpuRef.current;
      if (!gpu) {
        return;
      }
      paintGl(gpu, elementImage, {
        time,
        grain,
        vignette,
        warmth,
        fade,
      });
    },
    [time, grain, vignette, warmth, fade],
  );

  return (
    <HtmlInCanvas
      width={width}
      height={height}
      onInit={onInit}
      onPaint={onPaint}
    >
      <DemoContent />
    </HtmlInCanvas>
  );
};
