import React, { useCallback, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  HtmlInCanvas,
  Img,
  interpolate,
  staticFile,
  type HtmlInCanvasOnInit,
  type HtmlInCanvasOnPaint,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { type GlState, initGl, paintGl } from "./gl";

/** Source asset (958×788 PNG screenshot). */
const ARTICLE_IMG = staticFile("guardian-article.png");

/** Must match article panel — multiply knocks white paper into this solid color. */
const BACKDROP = "#eaeaea";

const ARTICLE_W = 958;
const ARTICLE_H = 788;

/**
 * “Check out that progressive blur!” — bbox from tesseract on `guardian-article.png`.
 */
const HIGHLIGHT_PHRASE = {
  left: 22 / ARTICLE_W,
  top: 324 / ARTICLE_H,
  width: (564 - 22) / ARTICLE_W,
  height: 42 / ARTICLE_H,
} as const;

/** Fixed 3D tilt (deg) — kept subtle so type stays readable. */
const TILT_X = 3.2;
const TILT_Y = -4.4;

type HighlightBandProps = {
  readonly box: typeof HIGHLIGHT_PHRASE;
  readonly progress: number;
};

const HighlightBand: React.FC<HighlightBandProps> = ({ box, progress }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${box.left * 100}%`,
        top: `${box.top * 100}%`,
        width: `${box.width * 100}%`,
        height: `${box.height * 100}%`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          maxWidth: "100%",
          backgroundColor: "rgb(255, 235, 90)",
          mixBlendMode: "multiply",
          borderRadius: 4,
          boxShadow: "inset 0 -1px 0 rgba(210, 170, 0, 0.35)",
        }}
      />
    </div>
  );
};

/** DOM captured by HtmlInCanvas — must match composition width/height. */
const ArticleRasterContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const kenEnd = Math.max(1, durationInFrames - 1);
  const kenScale = interpolate(frame, [0, kenEnd], [1.042, 1.092], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const highlightProgress = interpolate(
    frame,
    [0.45 * fps, 1.35 * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  return (
    <div
      style={{
        backgroundColor: BACKDROP,
        boxSizing: "border-box",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "min(9vw, 112px)",
      }}
    >
      <div
        style={{
          perspective: 1300,
          scale: kenScale,
        }}
      >
        <div
          style={{
            transform: `rotateX(${TILT_X}deg) rotateY(${TILT_Y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{}}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 920,
                aspectRatio: `${ARTICLE_W} / ${ARTICLE_H}`,
              }}
            >
              {/*
                Do not put `filter` on an ancestor of the multiplied `<Img>` — it isolates
                blending so white paper no longer composites onto the scene background.
              */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  backgroundColor: BACKDROP,
                }}
              >
                <Img
                  src={ARTICLE_IMG}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 2,
                  pointerEvents: "none",
                }}
              >
                <HighlightBand
                  box={HIGHLIGHT_PHRASE}
                  progress={highlightProgress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArticleHighlightComposition: React.FC = () => {
  const { width, height } = useVideoConfig();
  const gpuRef = useRef<GlState | null>(null);

  const onInit: HtmlInCanvasOnInit = useCallback(({ canvas }) => {
    const { gpu, cleanup } = initGl(canvas);
    gpuRef.current = gpu;
    return () => {
      cleanup();
      gpuRef.current = null;
    };
  }, []);

  const onPaint: HtmlInCanvasOnPaint = useCallback(({ elementImage }) => {
    const gpu = gpuRef.current;
    if (!gpu) {
      return;
    }
    paintGl(gpu, elementImage);
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: BACKDROP }}>
      <HtmlInCanvas
        width={width}
        height={height}
        onInit={onInit}
        onPaint={onPaint}
      >
        <ArticleRasterContent />
      </HtmlInCanvas>
    </AbsoluteFill>
  );
};
