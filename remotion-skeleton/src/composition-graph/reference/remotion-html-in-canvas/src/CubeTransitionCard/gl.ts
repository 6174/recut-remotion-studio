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
  texture: WebGLTexture;
  vao: WebGLVertexArrayObject;
  buffer: WebGLBuffer;
};

const VS = `#version 300 es
in vec2 a_pos;
in vec2 a_uv;
out vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_uv;
}`;

/**
 * Glass pass: mostly diffuse frosted panel (top fill + soft rim); diagonals are
 * low, wide, slow so it reads as glass—not a spec stripe. `u_time` = seconds.
 */
const FS_GLOSS = `#version 300 es
precision highp float;
uniform sampler2D u_tex;
uniform float u_time;
in vec2 v_uv;
out vec4 o;

void main() {
  vec4 base = texture(u_tex, v_uv);
  float a = base.a;

  float onCard = smoothstep(0.02, 0.12, a);

  // Slow, small UV drift — suggests thickness / environment, not a hot highlight.
  float shift =
      sin(u_time * 0.85) * 0.022
    + sin(u_time * 0.28) * 0.012;
  float shift2 =
      cos(u_time * 0.62) * 0.014
    - sin(u_time * 0.35) * 0.008;

  float breathe = 0.9 + 0.1 * sin(u_time * 0.45);
  float topPulse = 0.96 + 0.04 * sin(u_time * 0.55);

  // Frosted “lit from above” — dominant layer (glass body).
  float topSheen =
      pow(clamp(1.0 - v_uv.y, 0.0, 1.0), 1.32) * 0.072 * topPulse;

  // Very soft, faint traveling veil (not a tight shine band).
  float diag = v_uv.x * 0.5 + v_uv.y * 0.4 + shift;
  float shine =
      smoothstep(0.08, 0.5, diag) * (1.0 - smoothstep(0.5, 0.88, diag)) * 0.038;

  float diag2 = v_uv.x * 0.36 - v_uv.y * 0.3 + shift2;
  float shine2 =
      smoothstep(0.42, 0.68, diag2) * (1.0 - smoothstep(0.68, 0.9, diag2)) * 0.014;

  float inset = min(min(v_uv.x, 1.0 - v_uv.x), min(v_uv.y, 1.0 - v_uv.y));
  float rim = pow(clamp(1.0 - inset * 3.9, 0.0, 1.0), 2.1) * 0.036;

  float g = (topSheen + shine + shine2 + rim) * onCard * breathe;
  vec3 specTint = vec3(0.988, 0.992, 1.008);
  vec3 add = specTint * g;
  o = vec4(base.rgb + add * a, a);
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

  const program = linkProgram(gl, VS, FS_GLOSS);
  const uTex = gl.getUniformLocation(program, "u_tex");
  const uTime = gl.getUniformLocation(program, "u_time");

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
    texture,
    vao,
    buffer,
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
  glossTime: number;
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
  if (gpu.uTime) gl.uniform1f(gpu.uTime, params.glossTime);

  gl.bindVertexArray(gpu.vao);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
