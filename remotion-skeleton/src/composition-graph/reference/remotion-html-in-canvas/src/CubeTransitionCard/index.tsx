import React, { useCallback, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  HtmlInCanvas,
  type HtmlInCanvasOnInit,
  type HtmlInCanvasOnPaint,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BigSaleSticker,
  OnlyPriceSticker,
  PeelSticker,
  STICKER_BOX_BIG_SALE,
  STICKER_BOX_ONLY_PRICE,
  StickerSlot,
} from "../Bonus/SaleStickerComposition";
import { type GlState, initGl, paintGl } from "./gl";

const BG = "#eaeaea";
/** Card footprint captured by HtmlInCanvas (px). */
const CARD_CANVAS_WIDTH = 400;
const CARD_CANVAS_HEIGHT = 600;
const PRODUCT_IMAGE = staticFile("white-t-shirt-mockup.jpg");

/** Stagger: sticker 2 starts here; each sticker stays until composition end. */
const STICKER_2_FROM = 25;

const STICKER_PEEL_FRAMES = 22;
const STICKER_SHINE_START = 6;
const STICKER_SHINE_FRAMES = 50;

/** Card only — sized to match HtmlInCanvas width/height. */
const ProductCardHtml: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        boxSizing: "border-box",
        height: CARD_CANVAS_HEIGHT,
        width: CARD_CANVAS_WIDTH,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          boxShadow:
            "0 24px 64px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.88), inset 0 -1px 0 rgba(0, 0, 0, 0.045)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Img
          src={PRODUCT_IMAGE}
          style={{
            display: "block",
            flexShrink: 0,
            height: "auto",
            width: "100%",
          }}
        />
        <div
          style={{
            boxSizing: "border-box",
            color: "#111111",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            fontFamily:
              '"GT Planar", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            minHeight: 0,
            paddingBottom: 200,
            paddingLeft: 48,
            paddingRight: 48,
            paddingTop: 32,
            textAlign: "left",
          }}
        >
          White T-Shirt
        </div>
      </div>
    </div>
  );
};

export const CubeTransitionCardComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const gpuRef = useRef<GlState | null>(null);

  const sticker1Duration = durationInFrames;
  const sticker2Duration = Math.max(1, durationInFrames - STICKER_2_FROM);

  const glossTime = frame / Math.max(fps, 1);

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
      paintGl(gpu, elementImage, { glossTime });
    },
    [glossTime],
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor: BG,
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        padding: 56,
        scale: interpolate(frame, [0, 80], [1, 1.05], {
          easing: Easing.out(Easing.quad),
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          flexShrink: 0,
          height: CARD_CANVAS_HEIGHT,
          overflow: "visible",
          position: "relative",
          width: CARD_CANVAS_WIDTH,
          scale: 1.6,
          translate: "0 200px",
        }}
      >
        <HtmlInCanvas
          width={CARD_CANVAS_WIDTH}
          height={CARD_CANVAS_HEIGHT}
          onInit={onInit}
          onPaint={onPaint}
        >
          <ProductCardHtml />
        </HtmlInCanvas>

        <AbsoluteFill
          style={{
            overflow: "visible",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Sequence durationInFrames={sticker1Duration} from={10}>
            <StickerSlot
              centerX={CARD_CANVAS_WIDTH / 2 - 170}
              centerY={STICKER_BOX_ONLY_PRICE.height / 2 - 80}
              rotationDeg={-8}
              width={220}
              height={220}
              scale={0.7}
            >
              <PeelSticker
                {...STICKER_BOX_ONLY_PRICE}
                peelDurationFrames={STICKER_PEEL_FRAMES}
                peelStartFrame={0}
                shape="ellipse"
                shineDurationFrames={STICKER_SHINE_FRAMES}
                shineStartFrame={STICKER_SHINE_START}
              >
                <OnlyPriceSticker />
              </PeelSticker>
            </StickerSlot>
          </Sequence>

          <Sequence durationInFrames={sticker2Duration} from={STICKER_2_FROM}>
            <StickerSlot
              centerX={CARD_CANVAS_WIDTH - STICKER_BOX_BIG_SALE.width / 2 + 160}
              centerY={CARD_CANVAS_HEIGHT / 2}
              rotationDeg={10}
              scale={0.7}
              {...STICKER_BOX_BIG_SALE}
            >
              <PeelSticker
                {...STICKER_BOX_BIG_SALE}
                peelAngleDeg={135}
                peelDurationFrames={STICKER_PEEL_FRAMES}
                peelStartFrame={0}
                shape="ellipse"
                shineDurationFrames={STICKER_SHINE_FRAMES}
                shineStartFrame={STICKER_SHINE_START - 5}
              >
                <BigSaleSticker />
              </PeelSticker>
            </StickerSlot>
          </Sequence>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
