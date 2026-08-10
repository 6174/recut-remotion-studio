import type { HtmlInCanvasOnInit, HtmlInCanvasOnPaint } from "remotion";

type PaintArg = Parameters<HtmlInCanvasOnPaint>[0];
type ElementImage = PaintArg["elementImage"];
type InitArg = Parameters<HtmlInCanvasOnInit>[0];
type Canvas = InitArg["canvas"];

export type GlState = {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uTex: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uResolution: WebGLUniformLocation | null;
  uGrain: WebGLUniformLocation | null;
  uVignette: WebGLUniformLocation | null;
  uWarmth: WebGLUniformLocation | null;
  uFade: WebGLUniformLocation | null;
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

// Vintage film effect:
//  - Subtle "gate weave" so the frame doesn't sit perfectly still, the way
//    a 16mm projector never quite does.
//  - Tiny chromatic aberration that grows toward the rim — old uncoated
//    lenses leak color near the edges.
//  - Desaturate, then a light split-tone (muted shadows / neutral highlights).
//  - Lift the blacks and pull contrast toward mid-grey for a faded print.
//  - Per-pixel film grain that re-rolls every frame.
//  - Brief vertical scratches that pop in and out.
//  - Sparse bright dust specks.
//  - A soft warm light leak in the upper-right that breathes.
//  - Heavy classic vignette and gentle exposure flicker.
const FS = `#version 300 es
precision highp float;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_grain;     // grain intensity, 0..1
uniform float u_vignette;  // vignette intensity, 0..1
uniform float u_warmth;    // warm tint mix, 0..1
uniform float u_fade;      // contrast fade toward grey, 0..1
in vec2 v_uv;
out vec4 o;

// Stable hash → [0,1) for a vec2 input.
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = v_uv;

  // Gate weave: two layers of low-amplitude wobble at unrelated rates so the
  // motion never reads as a clean sine wave.
  vec2 weave = vec2(
    sin(u_time * 11.0) * 0.0015 + sin(u_time * 3.7) * 0.0009,
    cos(u_time * 8.3) * 0.0013 + cos(u_time * 2.4) * 0.0007
  );
  uv += weave;

  // Distance from center drives both vignette and chromatic aberration.
  vec2 fromCenter = uv - 0.5;
  float r = length(fromCenter);
  vec2 dir = r > 0.0001 ? normalize(fromCenter) : vec2(0.0);

  // Edge-weighted chromatic aberration (sub-pixel scale near the center).
  float ca = 0.0024 * pow(r * 1.4, 1.6);
  vec3 color;
  color.r = texture(u_tex, uv + dir * ca).r;
  color.g = texture(u_tex, uv).g;
  color.b = texture(u_tex, uv - dir * ca).b;

  // Fade the print: blend toward luminance, then toward mid-grey.
  float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(color, vec3(lum), 0.30);
  color = mix(vec3(0.5), color, mix(1.0, 0.78, u_fade));

  // Split-tone: subtle cool shadows, neutral paper highlights (less orange than sepia).
  vec3 shadowTint = vec3(0.22, 0.21, 0.20);
  vec3 highlightTint = vec3(0.98, 0.97, 0.96);
  vec3 toned = mix(shadowTint, highlightTint, color);
  color = mix(color, toned, u_warmth);

  // Per-pixel film grain. Quantize time to a discrete frame index so the
  // grain animates in 24fps "film" steps instead of slithering.
  float frameIdx = floor(u_time * 24.0);
  float g = hash(gl_FragCoord.xy + vec2(frameIdx * 17.31, frameIdx * 7.91));
  color += (g - 0.5) * u_grain;

  // Vertical scratches: 3 slots, each independently flickering on/off.
  float scratchSeed = floor(u_time * 8.0);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float on = step(0.78, hash(vec2(scratchSeed, fi * 19.7 + 3.1)));
    float xn = hash(vec2(scratchSeed, fi * 7.13 + 11.4));
    float sx = xn * u_resolution.x;
    float yJitter = 0.4 * sin(v_uv.y * 80.0 + fi * 9.0);
    float d = abs(gl_FragCoord.x - sx + yJitter);
    float s = on * smoothstep(2.4, 0.0, d) * (0.45 + 0.25 * hash(vec2(scratchSeed, fi)));
    color += vec3(s) * 0.9;
  }

  // Dust specks: a few tiny bright spots that re-randomize each cine-frame.
  float dustSeed = floor(u_time * 24.0);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 dp = vec2(
      hash(vec2(dustSeed, fi * 2.13 + 1.7)),
      hash(vec2(dustSeed, fi * 5.71 + 9.3))
    );
    float on = step(0.55, hash(vec2(dustSeed, fi * 3.33 + 21.0)));
    float dr = 0.004 + 0.006 * hash(vec2(dustSeed, fi * 4.4));
    float spec = smoothstep(dr, 0.0, distance(v_uv, dp));
    color += vec3(0.52, 0.51, 0.50) * spec * on;
  }

  // Warm light leak in the upper-right that slowly breathes. The radial
  // falloff is wide so it bleeds across roughly a third of the frame.
  float leakBreath = 0.55 + 0.45 * sin(u_time * 0.7);
  float leak = smoothstep(0.85, 0.05, distance(v_uv, vec2(0.86, 0.18)));
  vec3 leakColor = vec3(0.96, 0.90, 0.84);
  color += leakColor * leak * 0.14 * leakBreath;

  // Secondary subtle leak in the lower-left, cooler and slower.
  float leak2 = smoothstep(0.7, 0.0, distance(v_uv, vec2(0.12, 0.85)));
  vec3 leakColor2 = vec3(0.88, 0.86, 0.84);
  color += leakColor2 * leak2 * 0.07 * (0.5 + 0.5 * sin(u_time * 0.4 + 1.7));

  // Heavy vignette — characteristic of old uncoated optics.
  float vig = smoothstep(1.05, 0.30, r * 1.25);
  color *= mix(1.0, vig, u_vignette);

  // Gentle exposure flicker, two superimposed rates.
  float flicker = 1.0
    + 0.035 * sin(u_time * 7.0)
    + 0.018 * sin(u_time * 19.0 + 1.3);
  color *= flicker;

  // Subtle neutral lift (was warm paper-yellow).
  color *= vec3(1.01, 1.0, 0.99);

  o = vec4(color, 1.0);
}`;

// Fullscreen quad: (x, y, u, v).
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

export const initGl = (
  canvas: Canvas,
): { gpu: GlState; cleanup: () => void } => {
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
  const uTex = gl.getUniformLocation(program, "u_tex");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uResolution = gl.getUniformLocation(program, "u_resolution");
  const uGrain = gl.getUniformLocation(program, "u_grain");
  const uVignette = gl.getUniformLocation(program, "u_vignette");
  const uWarmth = gl.getUniformLocation(program, "u_warmth");
  const uFade = gl.getUniformLocation(program, "u_fade");

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

  const gpu: GlState = {
    gl,
    program,
    uTex,
    uTime,
    uResolution,
    uGrain,
    uVignette,
    uWarmth,
    uFade,
    texture,
    vao,
  };

  const cleanup = () => {
    gl.deleteProgram(program);
    gl.deleteTexture(texture);
    gl.deleteVertexArray(vao);
    gl.deleteBuffer(buffer);
  };

  return { gpu, cleanup };
};

export type PaintParams = {
  time: number;
  grain: number;
  vignette: number;
  warmth: number;
  fade: number;
};

export const paintGl = (
  gpu: GlState,
  elementImage: ElementImage,
  params: PaintParams,
) => {
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

  if (gpu.uTex) gl.uniform1i(gpu.uTex, 0);
  if (gpu.uTime) gl.uniform1f(gpu.uTime, params.time);
  if (gpu.uResolution)
    gl.uniform2f(
      gpu.uResolution,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
    );
  if (gpu.uGrain) gl.uniform1f(gpu.uGrain, params.grain);
  if (gpu.uVignette) gl.uniform1f(gpu.uVignette, params.vignette);
  if (gpu.uWarmth) gl.uniform1f(gpu.uWarmth, params.warmth);
  if (gpu.uFade) gl.uniform1f(gpu.uFade, params.fade);

  gl.bindVertexArray(gpu.vao);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
