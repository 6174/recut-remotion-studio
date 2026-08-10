import React, { useCallback, useRef } from "react";
import {
  AbsoluteFill,
  HtmlInCanvas,
  type HtmlInCanvasOnInit,
  type HtmlInCanvasOnPaint,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { type GlState, initGl, paintGl } from "./gl";

const CMD_NPX = "npx create-video@latest --yes --blank my-video";
const CMD_CD = "cd my-video";
const CMD_NPM = "npm i";
const CMD_CLAUDE = "claude";
const CMD_PROMPT = "Add a CRT effect using HTML-in-canvas";

// Frame-based script for the terminal session. All values are in frames @ 30fps.
const TIMING = {
  npxStart: 6,
  npxCps: 1.5,

  outLine1: 48,
  outLine2: 60,
  outLine3: 76,

  cdStart: 82,
  cdCps: 2.4,

  npmStart: 92,
  npmCps: 2.8,

  npmOut2: 98,
  npmOut3: 106,
  npmOut4: 114,

  prompt2: 130,
  claudeStart: 134,
  claudeCps: 0.5,

  banner: 152,
  claudePrompt: 162,

  userPromptStart: 166,
  userPromptCps: 0.85,
};

// Hold this many frames past the last typed character so the finished terminal can sit (~2s @ 30fps).
export const CRT_HOLD_AFTER_TYPING_FRAMES = 60;

export const CRT_DURATION_IN_FRAMES =
  TIMING.userPromptStart +
  Math.ceil(CMD_PROMPT.length / TIMING.userPromptCps) +
  CRT_HOLD_AFTER_TYPING_FRAMES;

const PAPER = "#ecebe6";
const INK = "#262626";
const INK_DIM = "#5a5a56";
const PROMPT_BLUE = "#2a5a8f";
const SUCCESS = "#2d7a3d";
const CLAUDE_ORANGE = "#c2541a";

const typedText = (
  text: string,
  startFrame: number,
  cps: number,
  frame: number,
): string => {
  if (frame < startFrame) return "";
  const visible = Math.floor((frame - startFrame) * cps);
  return text.slice(0, Math.min(visible, text.length));
};

const isTypingComplete = (
  text: string,
  startFrame: number,
  cps: number,
  frame: number,
): boolean => (frame - startFrame) * cps >= text.length;

const Cursor: React.FC<{ on: boolean; color?: string }> = ({
  on,
  color = INK,
}) => (
  <span
    style={{
      display: "inline-block",
      width: "0.55em",
      height: "1.05em",
      background: on ? color : "transparent",
      verticalAlign: "-0.18em",
      marginLeft: 2,
    }}
  />
);

const Prompt: React.FC<{ cwd: "home" | "project" }> = ({ cwd }) => (
  <>
    <span style={{ color: PROMPT_BLUE, fontWeight: 600 }}>
      {cwd === "home" ? "~" : "~/my-video"}
    </span>
    <span style={{ color: INK }}> $ </span>
  </>
);

const DemoContent: React.FC<{ frame: number }> = ({ frame }) => {
  const monoFont =
    '"SF Mono", "Menlo", "Consolas", "Liberation Mono", monospace';

  // Cursor blinks at ~2Hz when idle, stays solid while typing.
  const blinkOn = Math.floor(frame / 15) % 2 === 0;
  const cursorWhile = (typingDone: boolean) => (typingDone ? blinkOn : true);

  const npxText = typedText(CMD_NPX, TIMING.npxStart, TIMING.npxCps, frame);
  const npxDone = isTypingComplete(
    CMD_NPX,
    TIMING.npxStart,
    TIMING.npxCps,
    frame,
  );
  const showNpxCursor = frame < TIMING.outLine1;

  const showOut1 = frame >= TIMING.outLine1;
  const showOut2 = frame >= TIMING.outLine2;
  const showOut3 = frame >= TIMING.outLine3;

  const cdText = typedText(CMD_CD, TIMING.cdStart, TIMING.cdCps, frame);
  const cdDone = isTypingComplete(CMD_CD, TIMING.cdStart, TIMING.cdCps, frame);
  const showCdRow = frame >= TIMING.cdStart;
  const showCdCursor = showCdRow && !cdDone;

  const npmText = typedText(CMD_NPM, TIMING.npmStart, TIMING.npmCps, frame);
  const npmDone = isTypingComplete(
    CMD_NPM,
    TIMING.npmStart,
    TIMING.npmCps,
    frame,
  );
  const showNpmRow = frame >= TIMING.npmStart;
  const showNpmCursor = showNpmRow && frame < TIMING.npmOut2;

  const showNpmOut2 = frame >= TIMING.npmOut2;
  const showNpmOut3 = frame >= TIMING.npmOut3;
  const showNpmOut4 = frame >= TIMING.npmOut4;

  const showPrompt2 = frame >= TIMING.prompt2;
  const claudeText = typedText(
    CMD_CLAUDE,
    TIMING.claudeStart,
    TIMING.claudeCps,
    frame,
  );
  const claudeDone = isTypingComplete(
    CMD_CLAUDE,
    TIMING.claudeStart,
    TIMING.claudeCps,
    frame,
  );
  const showClaudeCursor = frame >= TIMING.prompt2 && frame < TIMING.banner;

  const showBanner = frame >= TIMING.banner;
  const showClaudePrompt = frame >= TIMING.claudePrompt;
  const userPromptText = typedText(
    CMD_PROMPT,
    TIMING.userPromptStart,
    TIMING.userPromptCps,
    frame,
  );
  const userPromptDone = isTypingComplete(
    CMD_PROMPT,
    TIMING.userPromptStart,
    TIMING.userPromptCps,
    frame,
  );

  const lineGap = 6;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        color: INK,
        fontFamily: monoFont,
        padding: "72px 96px",
        boxSizing: "border-box",
        fontSize: 24,
        lineHeight: 1.55,
      }}
    >
      <div style={{ marginBottom: lineGap }}>
        <Prompt cwd="home" />
        <span>{npxText}</span>
        {showNpxCursor && <Cursor on={cursorWhile(npxDone)} />}
      </div>

      {showOut1 && (
        <div style={{ marginTop: lineGap, color: INK_DIM }}>
          <span style={{ color: SUCCESS, fontWeight: 700 }}>✔</span> Copied
          template to ./my-video
        </div>
      )}
      {showOut2 && (
        <div style={{ marginTop: lineGap, color: INK_DIM }}>
          <span style={{ color: SUCCESS, fontWeight: 700 }}>✔</span> Installed
          dependencies (47 packages)
        </div>
      )}
      {showOut3 && (
        <div
          style={{
            marginTop: lineGap,
            color: INK_DIM,
            paddingLeft: "1.4em",
          }}
        >
          Run <span style={{ color: INK }}>cd my-video</span> &amp;&amp;{" "}
          <span style={{ color: INK }}>npx remotion studio</span>
        </div>
      )}

      {showCdRow && (
        <div style={{ marginTop: 28 }}>
          <Prompt cwd="home" />
          <span>{cdText}</span>
          {showCdCursor && <Cursor on={cursorWhile(cdDone)} />}
        </div>
      )}

      {showNpmRow && (
        <div style={{ marginTop: lineGap }}>
          <Prompt cwd="project" />
          <span>{npmText}</span>
          {showNpmCursor && <Cursor on={cursorWhile(npmDone)} />}
        </div>
      )}

      {showNpmOut2 && (
        <div style={{ marginTop: lineGap, color: INK_DIM }}>
          <span style={{ color: SUCCESS, fontWeight: 700 }}>added</span> 623
          packages, and audited 624 packages in 27s
        </div>
      )}
      {showNpmOut3 && (
        <div
          style={{ marginTop: lineGap, color: INK_DIM, paddingLeft: "1.4em" }}
        >
          214 packages are looking for funding · run{" "}
          <span style={{ color: INK }}>npm fund</span> for details
        </div>
      )}
      {showNpmOut4 && (
        <div style={{ marginTop: lineGap, color: INK_DIM }}>
          <span style={{ color: SUCCESS, fontWeight: 700 }}>found</span> 0
          vulnerabilities
        </div>
      )}

      {showPrompt2 && (
        <div style={{ marginTop: 28 }}>
          <Prompt cwd="project" />
          <span>{claudeText}</span>
          {showClaudeCursor && <Cursor on={cursorWhile(claudeDone)} />}
        </div>
      )}

      {showBanner && (
        <div
          style={{
            marginTop: 18,
            border: `1px solid ${CLAUDE_ORANGE}`,
            borderRadius: 8,
            padding: "12px 18px",
            color: INK_DIM,
            backgroundColor: "rgba(250, 249, 246, 0.6)",
            maxWidth: 640,
          }}
        >
          <div style={{ color: CLAUDE_ORANGE, fontWeight: 600 }}>
            <span style={{ marginRight: 8 }}>✻</span>Welcome to Claude Code
          </div>
          <div style={{ marginTop: 8 }}>
            /help for help, /status for your current setup
          </div>
          <div>
            cwd: <span style={{ color: INK }}>~/my-video</span>
          </div>
        </div>
      )}

      {showClaudePrompt && (
        <div style={{ marginTop: 18 }}>
          <span style={{ color: CLAUDE_ORANGE, fontWeight: 700 }}>{"> "}</span>
          <span>{userPromptText}</span>
          <Cursor on={cursorWhile(userPromptDone)} color={CLAUDE_ORANGE} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const CrtComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const gpuRef = useRef<GlState | null>(null);

  // Subtle bulge — higher numbers = flatter glass. ~6 reads as a real CRT
  // without becoming a fish-eye.
  const curvatureX = 6.0;
  const curvatureY = 5.5;
  // Scanlines and vignette darken pixels via multiplication, so they read
  // much harder against a light background. Keep both gentle.
  const scanIntensity = 0.08;
  const vignette = 0.4;
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
        curvatureX,
        curvatureY,
        scanIntensity,
        vignette,
      });
    },
    [time, curvatureX, curvatureY, scanIntensity, vignette],
  );

  return (
    <AbsoluteFill style={{ scale: 1.02 }}>
      <HtmlInCanvas
        width={width}
        height={height}
        onInit={onInit}
        onPaint={onPaint}
      >
        <DemoContent frame={frame} />
      </HtmlInCanvas>
    </AbsoluteFill>
  );
};
