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
  uCurvature: WebGLUniformLocation | null;
  uScanIntensity: WebGLUniformLocation | null;
  uVignette: WebGLUniformLocation | null;
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

// Subtle CRT effect:
//  - Barrel-distort the sample UVs so the screen looks like it's bulging
//    outward from a curved piece of glass.
//  - Tiny chromatic aberration that scales with distance from center, the
//    way light separates near the edges of a real curved tube.
//  - Soft scanlines that follow the curved surface, not the flat screen.
//  - Phosphor-style RGB aperture mask, very faint.
//  - Vignette + corner falloff so the rounded screen edges read clearly.
//  - Whole-image flicker for a faint refresh-rate breathing.
const FS = `#version 300 es
precision highp float;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_curvature;     // x = horizontal curve, y = vertical curve (lower = more curve)
uniform float u_scanIntensity;
uniform float u_vignette;
in vec2 v_uv;
out vec4 o;

// Pull the UVs into a barrel shape. Higher curvature numbers = flatter glass.
vec2 curveUv(vec2 uv) {
  // Center the UV around 0 so distortion is symmetric.
  vec2 c = uv * 2.0 - 1.0;
  // Each axis is bent by the perpendicular axis squared — classic CRT bulge.
  vec2 offset = abs(c.yx) / u_curvature;
  c = c + c * offset * offset;
  return c * 0.5 + 0.5;
}

void main() {
  vec2 uv = curveUv(v_uv);

  // Anything that mapped outside the tube is the bezel — pure black.
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    o = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Distance from the center, used for vignette and chromatic aberration.
  vec2 fromCenter = uv - 0.5;
  float r = length(fromCenter);

  // Tiny chromatic aberration that grows toward the rim, like a real lens.
  float ca = 0.0018 * pow(r * 2.0, 2.0);
  vec2 dir = r > 0.0001 ? normalize(fromCenter) : vec2(0.0);
  vec3 color;
  color.r = texture(u_tex, uv + dir * ca).r;
  color.g = texture(u_tex, uv).g;
  color.b = texture(u_tex, uv - dir * ca).b;

  // Scanlines follow the curved screen-space, with a very soft profile so
  // they feel like glow rather than hard stripes.
  float scan = 0.5 + 0.5 * sin(uv.y * u_resolution.y * 1.0);
  float scanline = mix(1.0, scan, u_scanIntensity);
  color *= scanline;

  // Aperture grille — three sub-pixel columns. On a light screen this reads
  // as a faint warm dot pitch, so the mix is kept very low.
  float col = mod(gl_FragCoord.x, 3.0);
  vec3 mask = vec3(1.0);
  if (col < 1.0) mask = vec3(1.04, 0.97, 0.97);
  else if (col < 2.0) mask = vec3(0.97, 1.04, 0.97);
  else mask = vec3(0.97, 0.97, 1.04);
  color *= mix(vec3(1.0), mask, 0.18);

  // Vignette + soft rounded corners. Smoothstep gives the glass a subtle
  // shadow toward the edges without looking like a heavy filter.
  float vig = smoothstep(0.95, 0.45, r);
  color *= mix(1.0, vig, u_vignette);

  // Slow refresh-rate flicker so the panel feels alive.
  float flicker = 1.0 + 0.012 * sin(u_time * 60.0);
  color *= flicker;

  // Soft neutral shadow along the inner rim where the screen meets the
  // black bezel — sells the "tube curving away" feel without an additive glow.
  float rim = smoothstep(0.62, 0.78, r);
  color -= vec3(0.04) * rim;

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
  const uCurvature = gl.getUniformLocation(program, "u_curvature");
  const uScanIntensity = gl.getUniformLocation(program, "u_scanIntensity");
  const uVignette = gl.getUniformLocation(program, "u_vignette");

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
    uCurvature,
    uScanIntensity,
    uVignette,
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
  curvatureX: number;
  curvatureY: number;
  scanIntensity: number;
  vignette: number;
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
  if (gpu.uCurvature)
    gl.uniform2f(gpu.uCurvature, params.curvatureX, params.curvatureY);
  if (gpu.uScanIntensity) gl.uniform1f(gpu.uScanIntensity, params.scanIntensity);
  if (gpu.uVignette) gl.uniform1f(gpu.uVignette, params.vignette);

  gl.bindVertexArray(gpu.vao);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
