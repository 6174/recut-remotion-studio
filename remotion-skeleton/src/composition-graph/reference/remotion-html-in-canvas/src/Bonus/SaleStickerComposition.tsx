import React, { useCallback, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  HtmlInCanvas,
  type HtmlInCanvasOnInit,
  type HtmlInCanvasOnPaint,
  interpolate,
  useCurrentFrame,
} from "remotion";

// Shared sans stack for every sticker — the supermarket discounter look
// only really works in a heavy bold sans, so we don't expose this per
// sticker.
const STICKER_FONT_FAMILY =
  "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

// ─────────────────────────────────────────────────────────────────────
// Peel shader
// ─────────────────────────────────────────────────────────────────────

type GlState = {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uChannel0: WebGLUniformLocation | null;
  uResolution: WebGLUniformLocation | null;
  uProgress: WebGLUniformLocation | null;
  uMaxAxisDist: WebGLUniformLocation | null;
  uCurlRadius: WebGLUniformLocation | null;
  uCorner: WebGLUniformLocation | null;
  uDir: WebGLUniformLocation | null;
  uStickerCenter: WebGLUniformLocation | null;
  uBandNormal: WebGLUniformLocation | null;
  uBandT: WebGLUniformLocation | null;
  uHaloSigma: WebGLUniformLocation | null;
  uCoreSigma: WebGLUniformLocation | null;
  uHaloIntensity: WebGLUniformLocation | null;
  uCoreIntensity: WebGLUniformLocation | null;
  texture: WebGLTexture;
  vao: WebGLVertexArrayObject;
};

const VS = `#version 300 es
in vec2 a_pos;
in vec2 a_uv;
out vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_uv;
}`;

// Sticker peel + shine in a single shader. Two effects, one HtmlInCanvas:
//
//  1. Peel: per output pixel, project onto the peel direction, ask which
//     point on the original flat sticker rolled up to land here, then
//     either show the front face (sampled from the HTML texture, shaded
//     by the cylinder normal), the back face (a uniform adhesive-paper
//     color, also shaded), or transparent. The back-face render is
//     alpha-clipped to the visible pixel's own flat alpha so the curl
//     can never paint outside the original die-cut.
//
//  2. Shine: a moving stripe perpendicular to `u_bandNormal` defined by
//     a soft Gaussian halo plus a tighter Gaussian core. Applied only
//     to FRONT-facing pixels (flat-front and curled-front) — the matte
//     adhesive back paper doesn't pick up specular light.
//
// Merging them avoids nesting two HtmlInCanvas instances, which has
// composition limitations in the current implementation.
const FS = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float u_progress;
uniform float u_maxAxisDist;
uniform float u_curlRadius;
uniform vec2 u_corner;
uniform vec2 u_dir;
uniform sampler2D iChannel0;

uniform vec2 u_stickerCenter;
uniform vec2 u_bandNormal;
uniform float u_bandT;
uniform float u_haloSigma;
uniform float u_coreSigma;
uniform float u_haloIntensity;
uniform float u_coreIntensity;

in vec2 v_uv;
out vec4 outColor;

const float PI = 3.14159265359;

const vec3 BACK_COLOR = vec3(0.96, 0.93, 0.86);

vec4 sampleFlat(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(0.0);
  }
  return texture(iChannel0, uv);
}

// Shine intensity at a screen-space pixel. Sticker center is the canvas
// center because the sticker is centered inside the padded peel canvas.
float shineIntensity(vec2 px) {
  vec2 fromCenter = px - u_stickerCenter;
  float dist = abs(dot(fromCenter, u_bandNormal) - u_bandT);
  float halo = exp(-(dist * dist) / (u_haloSigma * u_haloSigma)) * u_haloIntensity;
  float core = exp(-(dist * dist) / (u_coreSigma * u_coreSigma)) * u_coreIntensity;
  return clamp(halo + core, 0.0, 1.0);
}

// Mix a premultiplied front-face color toward white by intensity,
// preserving the input alpha. Equivalent to lerp(unpremult, white, I)
// then re-premultiplying — kept in premult space so it matches the
// gl.ONE / gl.ONE_MINUS_SRC_ALPHA blend func.
vec4 applyShine(vec4 premult, float intensity) {
  vec3 finalPremult =
      premult.rgb * (1.0 - intensity) + intensity * premult.a;
  return vec4(finalPremult, premult.a);
}

void main() {
  vec2 px = vec2(v_uv.x * iResolution.x, (1.0 - v_uv.y) * iResolution.y);

  vec2 fromCorner = px - u_corner;
  float t = dot(fromCorner, u_dir);
  vec2 perp = fromCorner - t * u_dir;

  float d = u_progress * u_maxAxisDist;
  float r = u_curlRadius;

  float shineI = shineIntensity(px);

  vec4 stripFlat = sampleFlat(v_uv);

  if (t >= d) {
    outColor = applyShine(stripFlat, shineI);
    return;
  }

  float delta = d - t;
  if (delta > r) {
    outColor = vec4(0.0);
    return;
  }

  float ratio = clamp(delta / r, 0.0, 1.0);
  float s1 = r * asin(ratio);
  float s2 = PI * r - s1;

  vec2 flatFrontPx = u_corner + perp + (d - s1) * u_dir;
  vec2 flatBackPx  = u_corner + perp + (d - s2) * u_dir;

  vec2 uvFront = vec2(flatFrontPx.x / iResolution.x,
                      1.0 - flatFrontPx.y / iResolution.y);
  vec2 uvBack  = vec2(flatBackPx.x  / iResolution.x,
                      1.0 - flatBackPx.y  / iResolution.y);

  vec4 colFront = sampleFlat(uvFront);
  vec4 colBack  = sampleFlat(uvBack);

  float thetaFront = s1 / r;
  float thetaBack  = s2 / r;

  float frontShade = mix(1.0, 0.78, sin(thetaFront));
  float backShade = mix(0.62, 0.42, (thetaBack - PI * 0.5) / (PI * 0.5));

  bool showFront = colFront.a > 0.02;
  bool showBack  = colBack.a > 0.02 && stripFlat.a > 0.02;

  if (showFront) {
    vec4 shaded = vec4(colFront.rgb * frontShade, colFront.a);
    outColor = applyShine(shaded, shineI);
  } else if (showBack) {
    outColor = vec4(BACK_COLOR * backShade, colBack.a);
  } else {
    outColor = vec4(0.0);
  }
}`;

const QUAD = new Float32Array([
  -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1,
]);

const linkProgram = (
  gl: WebGL2RenderingContext,
  vsSrc: string,
  fsSrc: string,
): WebGLProgram => {
  const vert = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
  gl.shaderSource(vert, vsSrc);
  gl.compileShader(vert);
  if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
    throw new Error(`Vertex shader: ${gl.getShaderInfoLog(vert)}`);
  }

  const frag = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
  gl.shaderSource(frag, fsSrc);
  gl.compileShader(frag);
  if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
    throw new Error(`Fragment shader: ${gl.getShaderInfoLog(frag)}`);
  }

  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Link: ${gl.getProgramInfoLog(program)}`);
  }
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return program;
};

// ─────────────────────────────────────────────────────────────────────
// PeelSticker — reusable sticker-with-peel component
// ─────────────────────────────────────────────────────────────────────

type StickerShape = "rect" | "ellipse";

type PeelStickerProps = {
  /** Sticker bounding-box width in pixels. The component's outer DOM
   *  fills exactly this size, so it composes with parent positioning
   *  and other fill-parent effects. The internal WebGL canvas is
   *  larger than this (see `padding`) to give room for the curl. */
  width: number;
  /** Sticker bounding-box height in pixels. */
  height: number;
  /**
   * Visual shape used to compute a tight peel range. "ellipse" for round /
   * oval / `border-radius: 50%` shapes; "rect" for hard rectangles or
   * shapes that fill their bounding box. Other shapes can pick whichever
   * is the closest match — the peel still renders correctly, the choice
   * only tunes how much of the frame range shows visible motion.
   */
  shape: StickerShape;
  /** Frame on which the curl axis starts moving (sticker invisible). */
  peelStartFrame: number;
  /** How long, in frames, the curl axis takes to settle to flat. */
  peelDurationFrames: number;
  /**
   * Direction the peel "comes from" in LOCAL sticker coords, in degrees.
   * Same convention as `shineAngleDeg`: 0° points rightward, 90° points
   * upward (toward the top of the sticker box). The corner where the
   * curl finally settles to flat is anchored opposite this direction —
   * i.e. with the default 225° the curl sweeps in from the lower-left
   * and finishes at the upper-right corner. Defaults to 225° to match
   * the historical "slapped on from the upper right" look.
   */
  peelAngleDeg?: number;
  /**
   * Curl ribbon radius as a fraction of the sticker's shorter bounding
   * dimension. ~0.34 gives a tight, paper-like curl; bump toward ~0.6 for
   * a floppier roll.
   */
  curlRadiusRatio?: number;
  /**
   * Extra pixels of canvas added on every side of the sticker box so the
   * curl ribbon — which can extend up to `curlRadius` past the sticker
   * footprint along PEEL_DIR — doesn't get clipped at the canvas edge.
   * Defaults to one curl radius. Padding only buys real estate when
   * THIS PeelSticker is the outermost effect; if it's nested inside
   * another HtmlInCanvas the outer effect still clips at its own
   * canvas size.
   */
  padding?: number;
  /**
   * Oversample factor for the WebGL canvas. The GL pixel buffer is
   * `pixelRatio×` larger than the canvas's CSS display size; a
   * `scale(1/pr)` wrapper brings it back down for layout. Default 2,
   * which keeps the curl edge crisp once the sticker is CSS-rotated
   * (a 1× canvas + a non-axis-aligned rotation ends up resolving the
   * sticker's diagonal alpha edge to one row of pixels — that's where
   * the stair-stepping comes from).
   */
  pixelRatio?: number;
  /** Frame on which the shine band starts entering from one side. */
  shineStartFrame: number;
  /** Frames the band takes to sweep all the way across the sticker. */
  shineDurationFrames: number;
  /**
   * Direction the band SWEEPS in LOCAL sticker coords, in degrees. 0°
   * points rightward, 90° points upward (toward the top of the sticker
   * box). The bright stripe itself is perpendicular to this. When this
   * component is wrapped inside a rotating parent the visible shine
   * direction in screen-space rotates with the parent.
   */
  shineAngleDeg?: number;
  /** Soft outer halo width (1-sigma) of the highlight, in CSS pixels. */
  shineHaloSigma?: number;
  /** Bright core width (1-sigma) of the highlight, in CSS pixels. */
  shineCoreSigma?: number;
  /** Peak halo brightness, 0..1. */
  shineHaloIntensity?: number;
  /** Peak core brightness, 0..1. */
  shineCoreIntensity?: number;
  /**
   * Sticker visual. Renders inside a sticker-sized box at the center of
   * the padded canvas — should fill 100% of its parent.
   */
  children: React.ReactNode;
};

/**
 * Distance from a sticker's center to its near (or far) edge along the
 * peel direction — the support function of the shape in that direction.
 * This is what lets `progress ∈ [0, 1]` map 1:1 onto the visible peel for
 * any width/height/shape/direction combination.
 */
const shapeRadiusAlongDir = (
  shape: StickerShape,
  width: number,
  height: number,
  dirX: number,
  dirY: number,
): number => {
  if (shape === "rect") {
    // Rectangle filling the bounding box: project half-width and
    // half-height onto |dir| and sum.
    return Math.abs(dirX) * (width / 2) + Math.abs(dirY) * (height / 2);
  }
  // Ellipse inscribed in the bounding box: standard ellipse support.
  return Math.sqrt((dirX * width * 0.5) ** 2 + (dirY * height * 0.5) ** 2);
};

export const PeelSticker: React.FC<PeelStickerProps> = ({
  width,
  height,
  shape,
  peelStartFrame,
  peelDurationFrames,
  peelAngleDeg = 225,
  curlRadiusRatio = 0.34,
  padding,
  pixelRatio = 2,
  shineStartFrame,
  shineDurationFrames,
  shineAngleDeg = 30,
  shineHaloSigma,
  shineCoreSigma,
  shineHaloIntensity = 0.3,
  shineCoreIntensity = 0.4,
  children,
}) => {
  const frameUnsafe = useCurrentFrame();
  const frame =
    typeof frameUnsafe === "number" && Number.isFinite(frameUnsafe)
      ? frameUnsafe
      : 0;

  const w =
    typeof width === "number" && Number.isFinite(width) && width > 0
      ? width
      : 1;
  const h =
    typeof height === "number" && Number.isFinite(height) && height > 0
      ? height
      : 1;

  const peelStartFrameSafe = Number.isFinite(peelStartFrame)
    ? peelStartFrame
    : 0;
  const peelDurationFramesSafe =
    Number.isFinite(peelDurationFrames) && peelDurationFrames > 0
      ? peelDurationFrames
      : 1;
  const shineStartFrameSafe = Number.isFinite(shineStartFrame)
    ? shineStartFrame
    : 0;
  const shineDurationFramesSafe =
    Number.isFinite(shineDurationFrames) && shineDurationFrames > 0
      ? shineDurationFrames
      : 1;

  const peelAngleDegSafe = Number.isFinite(peelAngleDeg) ? peelAngleDeg : 225;
  const shineAngleDegSafe = Number.isFinite(shineAngleDeg) ? shineAngleDeg : 30;
  const pixelRatioSafe =
    typeof pixelRatio === "number" &&
    Number.isFinite(pixelRatio) &&
    pixelRatio > 0
      ? pixelRatio
      : 2;

  const gpuRef = useRef<GlState | null>(null);

  const shapeSafe: StickerShape = shape === "rect" ? "rect" : "ellipse";
  const curlRadiusRatioSafe =
    Number.isFinite(curlRadiusRatio) && curlRadiusRatio > 0
      ? curlRadiusRatio
      : 0.34;

  // Peel direction unit vector in screen coords (Y down). Convention
  // matches `shineAngleDeg`: 0° → +X (right), 90° → -Y (visual up).
  const peelAngleRad = (peelAngleDegSafe * Math.PI) / 180;
  const peelDirX = Math.cos(peelAngleRad);
  const peelDirY = -Math.sin(peelAngleRad);

  // Per-sticker peel geometry, in CSS pixels. Anchoring the corner at
  // the shape's near edge and sizing maxAxisDist to span exactly to the
  // far edge plus one curl radius is what lets a linear `progress` map
  // directly onto visible peel motion regardless of size or shape.
  const shapeR = shapeRadiusAlongDir(shapeSafe, w, h, peelDirX, peelDirY);
  const curlRadius = Math.min(w, h) * curlRadiusRatioSafe;

  // Canvas is larger than the sticker box so the curl ribbon, which
  // protrudes up to `curlRadius` past the box along PEEL_DIR, doesn't
  // get clipped. Defaults to one curl radius of slack on every side.
  const pad = Math.ceil(padding ?? curlRadius);
  const canvasW = w + 2 * pad;
  const canvasH = h + 2 * pad;

  // GL canvas is the oversampled version of the CSS canvas. The shader,
  // the corner anchor, and every distance go through this scale. The
  // `Math.round` keeps GL dimensions integer-pixel.
  const glCanvasW = Math.round(canvasW * pixelRatioSafe);
  const glCanvasH = Math.round(canvasH * pixelRatioSafe);

  // Sticker is centered inside the padded canvas. Corner is offset from
  // the canvas center by shapeR along -peelDir (i.e. the sticker's
  // near edge along the peel axis). Coordinates promoted to GL pixels.
  const glCornerX = glCanvasW / 2 - shapeR * pixelRatioSafe * peelDirX;
  const glCornerY = glCanvasH / 2 - shapeR * pixelRatioSafe * peelDirY;
  const glMaxAxisDist = (2 * shapeR + curlRadius) * pixelRatioSafe;
  const glCurlRadius = curlRadius * pixelRatioSafe;

  // Shine geometry, all in GL pixels so the shader (which works in GL
  // pixel coords) can use these directly. The band sweeps across the
  // STICKER, not the padded canvas — bboxProjection uses sticker dims.
  // Sigmas scale with the sticker's shorter dimension so the highlight
  // stays in proportion across sizes.
  const cssMinDim = Math.min(w, h);
  const haloBase =
    shineHaloSigma != null && Number.isFinite(shineHaloSigma)
      ? shineHaloSigma
      : cssMinDim * 0.28;
  const coreBase =
    shineCoreSigma != null && Number.isFinite(shineCoreSigma)
      ? shineCoreSigma
      : cssMinDim * 0.09;
  const halo = haloBase * pixelRatioSafe;
  const core = coreBase * pixelRatioSafe;
  const shineAngleRad = (shineAngleDegSafe * Math.PI) / 180;
  const bandNormalX = Math.cos(shineAngleRad);
  const bandNormalY = -Math.sin(shineAngleRad);
  const bboxProjection =
    Math.abs(bandNormalX) * w * pixelRatioSafe +
    Math.abs(bandNormalY) * h * pixelRatioSafe;
  const sweepHalfRange = bboxProjection / 2 + 3 * halo;
  const bandT = interpolate(
    frame,
    [shineStartFrameSafe, shineStartFrameSafe + shineDurationFramesSafe],
    [-sweepHalfRange, sweepHalfRange],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );

  // Linear because progress already maps 1:1 to visible peel — no easing
  // curve needed (and any front-loaded easing would just compress the
  // motion into the early frames).
  const progress = interpolate(
    frame,
    [peelStartFrameSafe, peelStartFrameSafe + peelDurationFramesSafe],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const onInit: HtmlInCanvasOnInit = useCallback(({ canvas }) => {
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) {
      throw new Error("WebGL2 unavailable");
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const program = linkProgram(gl, VS, FS);
    const uChannel0 = gl.getUniformLocation(program, "iChannel0");
    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uProgress = gl.getUniformLocation(program, "u_progress");
    const uMaxAxisDist = gl.getUniformLocation(program, "u_maxAxisDist");
    const uCurlRadius = gl.getUniformLocation(program, "u_curlRadius");
    const uCorner = gl.getUniformLocation(program, "u_corner");
    const uDir = gl.getUniformLocation(program, "u_dir");
    const uStickerCenter = gl.getUniformLocation(program, "u_stickerCenter");
    const uBandNormal = gl.getUniformLocation(program, "u_bandNormal");
    const uBandT = gl.getUniformLocation(program, "u_bandT");
    const uHaloSigma = gl.getUniformLocation(program, "u_haloSigma");
    const uCoreSigma = gl.getUniformLocation(program, "u_coreSigma");
    const uHaloIntensity = gl.getUniformLocation(program, "u_haloIntensity");
    const uCoreIntensity = gl.getUniformLocation(program, "u_coreIntensity");

    const texture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const buffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);

    const vao = gl.createVertexArray() as WebGLVertexArrayObject;
    gl.bindVertexArray(vao);
    const locPos = gl.getAttribLocation(program, "a_pos");
    const locUv = gl.getAttribLocation(program, "a_uv");
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(locUv);
    gl.vertexAttribPointer(locUv, 2, gl.FLOAT, false, 16, 8);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gpuRef.current = {
      gl,
      program,
      uChannel0,
      uResolution,
      uProgress,
      uMaxAxisDist,
      uCurlRadius,
      uCorner,
      uDir,
      uStickerCenter,
      uBandNormal,
      uBandT,
      uHaloSigma,
      uCoreSigma,
      uHaloIntensity,
      uCoreIntensity,
      texture,
      vao,
    };

    return () => {
      gl.deleteProgram(program);
      gl.deleteTexture(texture);
      gl.deleteVertexArray(vao);
      gl.deleteBuffer(buffer);
      gpuRef.current = null;
    };
  }, []);

  const onPaint: HtmlInCanvasOnPaint = useCallback(
    ({ elementImage }) => {
      const gpu = gpuRef.current;
      if (!gpu) {
        return;
      }

      const { gl } = gpu;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(gpu.program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gpu.texture);
      gl.texElementImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        elementImage,
      );

      if (gpu.uChannel0) gl.uniform1i(gpu.uChannel0, 0);
      if (gpu.uResolution)
        gl.uniform3f(gpu.uResolution, glCanvasW, glCanvasH, 1);
      if (gpu.uProgress) gl.uniform1f(gpu.uProgress, progress);
      if (gpu.uMaxAxisDist) gl.uniform1f(gpu.uMaxAxisDist, glMaxAxisDist);
      if (gpu.uCurlRadius) gl.uniform1f(gpu.uCurlRadius, glCurlRadius);
      if (gpu.uCorner) gl.uniform2f(gpu.uCorner, glCornerX, glCornerY);
      if (gpu.uDir) gl.uniform2f(gpu.uDir, peelDirX, peelDirY);

      // Shine center is the canvas center because the sticker is
      // centered inside the padded peel canvas.
      if (gpu.uStickerCenter)
        gl.uniform2f(gpu.uStickerCenter, glCanvasW / 2, glCanvasH / 2);
      if (gpu.uBandNormal)
        gl.uniform2f(gpu.uBandNormal, bandNormalX, bandNormalY);
      if (gpu.uBandT) gl.uniform1f(gpu.uBandT, bandT);
      if (gpu.uHaloSigma) gl.uniform1f(gpu.uHaloSigma, halo);
      if (gpu.uCoreSigma) gl.uniform1f(gpu.uCoreSigma, core);
      if (gpu.uHaloIntensity)
        gl.uniform1f(gpu.uHaloIntensity, shineHaloIntensity);
      if (gpu.uCoreIntensity)
        gl.uniform1f(gpu.uCoreIntensity, shineCoreIntensity);

      gl.bindVertexArray(gpu.vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    [
      glCanvasW,
      glCanvasH,
      progress,
      glMaxAxisDist,
      glCurlRadius,
      glCornerX,
      glCornerY,
      peelDirX,
      peelDirY,
      bandNormalX,
      bandNormalY,
      bandT,
      halo,
      core,
      shineHaloIntensity,
      shineCoreIntensity,
    ],
  );

  // Outer DOM is exactly sticker-sized so this component composes with
  // any parent positioning. Both peel + shine effects render in the
  // single HtmlInCanvas below — they share one shader so they can't
  // step on each other (and we avoid the nested-HtmlInCanvas
  // composition limitation). The padded canvas is absolutely positioned
  // with negative offsets so its larger canvas extends past the sticker
  // box on every side — that's where the curl ribbon lives at the
  // extreme moments of the animation. The inner `scale(1/pr)` wrapper
  // displays the oversampled GL canvas at its CSS dimensions, so the
  // diagonal curl edge has `pixelRatio×` the sub-pixel data when it's
  // CSS-rotated by a parent.
  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -pad,
          top: -pad,
          width: canvasW,
          height: canvasH,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: glCanvasW,
            height: glCanvasH,
            transformOrigin: "top left",
            transform: `scale(${1 / pixelRatioSafe})`,
          }}
        >
          <HtmlInCanvas
            width={glCanvasW}
            height={glCanvasH}
            onInit={onInit}
            onPaint={onPaint}
          >
            <div
              style={{
                width: glCanvasW,
                height: glCanvasH,
                position: "relative",
                background: "transparent",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: pad * pixelRatioSafe,
                  top: pad * pixelRatioSafe,
                  width: w,
                  height: h,
                  transformOrigin: "top left",
                  transform: `scale(${pixelRatioSafe})`,
                }}
              >
                {children}
              </div>
            </div>
          </HtmlInCanvas>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Sticker visuals — each fills 100% of its PeelSticker box
// ─────────────────────────────────────────────────────────────────────

// Round yellow disc, red ring, "ONLY $79". The classic supermarket
// price-bomb look. Exported so other compositions (e.g. the shine demo)
// can reuse the visual without re-styling it.
export const OnlyPriceSticker: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "#ffd60a",
        boxShadow: "inset 0 0 0 5px #d62828",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#d62828",
        fontFamily: STICKER_FONT_FAMILY,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 6,
          lineHeight: 1,
        }}
      >
        ONLY
      </div>
      <div
        style={{
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: -4,
          lineHeight: 1,
          marginTop: 4,
        }}
      >
        $79
      </div>
    </div>
  );
};

// Wide red oval, yellow ring, "BIG SALE" in yellow. Color-inverted from
// the round sticker so the trio reads as variations on a theme.
export const BigSaleSticker: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "#d62828",
        boxShadow: "inset 0 0 0 5px #ffd60a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffd60a",
        fontFamily: STICKER_FONT_FAMILY,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: 5,
          lineHeight: 1,
          opacity: 0.9,
        }}
      >
        MEGA DEAL
      </div>
      <div
        style={{
          fontSize: 60,
          fontWeight: 900,
          letterSpacing: 2,
          lineHeight: 1,
          marginTop: 8,
        }}
      >
        BIG SALE
      </div>
    </div>
  );
};

// Hard-edged white shelf tag with a red border and red text. Different
// shape (rect) from the other two so the peel ribbon reads differently.
export const FiftyOffSticker: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 8,
        background: "#ffffff",
        boxShadow: "inset 0 0 0 5px #d62828",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#d62828",
        fontFamily: STICKER_FONT_FAMILY,
      }}
    >
      <div
        style={{
          fontSize: 86,
          fontWeight: 900,
          letterSpacing: -4,
          lineHeight: 1,
        }}
      >
        50%
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: 6,
          lineHeight: 1,
          marginTop: 6,
        }}
      >
        OFF
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Composition
// ─────────────────────────────────────────────────────────────────────

/** Default bounding boxes for the three supermarket stickers (grid row 1). */
export const STICKER_BOX_ONLY_PRICE = { width: 220, height: 220 } as const;
export const STICKER_BOX_BIG_SALE = { width: 380, height: 190 } as const;
export const STICKER_BOX_FIFTY_OFF = { width: 240, height: 200 } as const;

type StickerSlotProps = {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotationDeg: number;
  children: React.ReactNode;
  scale?: number;
};

// Positioning + rotation wrapper. Both PeelSticker and ShineSticker are
// fill-parent components — they don't position themselves in the page —
// so each sticker slot uses one of these to anchor a sticker-sized box
// at (centerX, centerY) and apply the rotation that the effects compose
// on top of.
export const StickerSlot: React.FC<StickerSlotProps> = ({
  centerX,
  centerY,
  width,
  height,
  rotationDeg,
  children,
  scale,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: centerX - width / 2,
        top: centerY - height / 2,
        width,
        height,
        transform: `rotate(${rotationDeg}deg)`,
        scale,
      }}
    >
      {children}
    </div>
  );
};

export const SaleStickerComposition: React.FC = () => {
  // Three stickers in one row. Peel + shine are merged into a single
  // shader inside `PeelSticker` (see the FS source above) so each
  // sticker uses one HtmlInCanvas — nesting two doesn't compose
  // cleanly in the current implementation.
  //
  //   StickerSlot (positions + rotates)
  //   └── PeelSticker (curls + shines in one shader)
  //       └── visual (one of the three sticker components above)
  //
  // Drop-in timing reads left-to-right. Peel runs 32 frames per
  // sticker, staggered 6 frames apart so the row ripples in. Each
  // sticker's shine fires ~18 frames after its peel settles. The last
  // shine ends at frame 98, comfortably under the 120-frame composition.
  //
  // Peel angles are mixed so the curl ribbons roll in different
  // directions — keeps the row from looking mechanical.
  const PEEL_FRAMES = 32;
  const SHINE_FRAMES = 36;
  const STAGGER = 6;
  const peelStart = (n: number) => n * STAGGER;
  const shineStart = (n: number) => peelStart(n) + PEEL_FRAMES + 18;
  return (
    <AbsoluteFill style={{ background: "#f3f1ec" }}>
      {/* ONLY $79 (left), BIG SALE (center), 50% OFF (right). */}
      <StickerSlot
        centerX={280}
        centerY={200}
        width={STICKER_BOX_ONLY_PRICE.width}
        height={STICKER_BOX_ONLY_PRICE.height}
        rotationDeg={-8}
      >
        <PeelSticker
          {...STICKER_BOX_ONLY_PRICE}
          shape="ellipse"
          peelStartFrame={peelStart(0)}
          peelDurationFrames={PEEL_FRAMES}
          shineStartFrame={shineStart(0)}
          shineDurationFrames={SHINE_FRAMES}
        >
          <OnlyPriceSticker />
        </PeelSticker>
      </StickerSlot>

      <StickerSlot
        centerX={640}
        centerY={200}
        width={STICKER_BOX_BIG_SALE.width}
        height={STICKER_BOX_BIG_SALE.height}
        rotationDeg={5}
      >
        <PeelSticker
          {...STICKER_BOX_BIG_SALE}
          shape="ellipse"
          peelStartFrame={peelStart(1)}
          peelDurationFrames={PEEL_FRAMES}
          peelAngleDeg={135}
          shineStartFrame={shineStart(1)}
          shineDurationFrames={SHINE_FRAMES}
        >
          <BigSaleSticker />
        </PeelSticker>
      </StickerSlot>

      <StickerSlot
        centerX={1000}
        centerY={200}
        width={STICKER_BOX_FIFTY_OFF.width}
        height={STICKER_BOX_FIFTY_OFF.height}
        rotationDeg={-6}
      >
        <PeelSticker
          {...STICKER_BOX_FIFTY_OFF}
          shape="rect"
          peelStartFrame={peelStart(2)}
          peelDurationFrames={PEEL_FRAMES}
          peelAngleDeg={45}
          shineStartFrame={shineStart(2)}
          shineDurationFrames={SHINE_FRAMES}
        >
          <FiftyOffSticker />
        </PeelSticker>
      </StickerSlot>
    </AbsoluteFill>
  );
};
