import type { HtmlInCanvasOnInit, HtmlInCanvasOnPaint } from "remotion";

type PaintArg = Parameters<HtmlInCanvasOnPaint>[0];
type ElementImage = PaintArg["elementImage"];
type InitArg = Parameters<HtmlInCanvasOnInit>[0];
type Canvas = InitArg["canvas"];

export type GlState = {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uTex: WebGLUniformLocation | null;
  uResolution: WebGLUniformLocation | null;
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
 * Post-process: vertical progressive Gaussian blur + slight vignette.
 */
const FS = `#version 300 es
precision highp float;
uniform sampler2D u_tex;
uniform vec2 u_resolution;
in vec2 v_uv;
out vec4 o;

float gauss1(float x, float sigma) {
  float s2 = sigma * sigma + 1e-6;
  return exp(-(x * x) / (2.0 * s2));
}

void main() {
  vec2 px = 1.0 / u_resolution;
  vec4 sharp = texture(u_tex, v_uv);

  // 0 at vertical center, 1 at top / bottom — drives blur strength
  float edgeY = abs(v_uv.y - 0.5) * 2.0;
  // Narrow sharp band: blur ramps in sooner, reaches full strength well before the frame edge
  float blurMix = pow(smoothstep(0.035, 0.62, edgeY), 1.06);

  // σ in pixels — stronger at edges; 9×9 kernel stays a reasonable match up to ~σ≈4.3
  float sigmaPx = blurMix * 4.25 + 0.05;

  vec3 blurred = vec3(0.0);
  float wsum = 0.0;
  for (int iy = -4; iy <= 4; iy++) {
    for (int ix = -4; ix <= 4; ix++) {
      float fx = float(ix);
      float fy = float(iy);
      float w = gauss1(fx, sigmaPx) * gauss1(fy, sigmaPx);
      vec2 o = px * vec2(fx, fy);
      vec2 suv = clamp(v_uv + o, vec2(1e-4), vec2(1.0 - 1e-4));
      blurred += texture(u_tex, suv).rgb * w;
      wsum += w;
    }
  }
  blurred /= wsum;

  vec3 color = mix(sharp.rgb, blurred, blurMix);

  vec2 vv = v_uv * 2.0 - 1.0;
  vv.x *= u_resolution.x / u_resolution.y;
  float rf = length(vv);
  float vignette = 1.0 - smoothstep(0.38, 1.02, rf) * 0.13;
  color *= vignette;

  o = vec4(color, sharp.a);
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

  const program = linkProgram(gl, VS, FS);
  const uTex = gl.getUniformLocation(program, "u_tex");
  const uResolution = gl.getUniformLocation(program, "u_resolution");

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
    uResolution,
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

export const paintGl = (gpu: GlState, elementImage: ElementImage) => {
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

  if (gpu.uTex) {
    gl.uniform1i(gpu.uTex, 0);
  }
  if (gpu.uResolution) {
    gl.uniform2f(
      gpu.uResolution,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
    );
  }

  gl.bindVertexArray(gpu.vao);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
