/**
 * [INPUT]: 依赖官方 capture host 输出的 OffscreenCanvas、StagePlan 纯时间线与 WebGL2
 * [OUTPUT]: 对外提供 GpuCompositor 的 upload(source) / render(frame) 双阶段 GPU 组合器
 * [POS]: src/html-canvas 的重像素边界。capture 负责失效时上传 source；这里每帧只读取已上传纹理，
 *        由 Bubble/Magnify/Glitch 三个独立 pass 之一绘制，绝不把 ElementImage 或 DOM 带入 GPU。
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { resolveActiveEffects } from "./EffectTimeline";
import { resolvePointer } from "./interaction";
import type { EffectRuntime } from "./CanvasEffect";
import type { StagePlan } from "./types";

type Program = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> };

export type GpuCompositorRender = {
  frame: number;
  fps: number;
  plan: StagePlan;
  pixelDensity: number;
};

const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
in vec2 a_uv;
out vec2 v_uv;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); v_uv = a_uv; }`;

const COPY_SHADER = `#version 300 es
precision highp float;
uniform sampler2D u_input;
in vec2 v_uv;
out vec4 out_color;
void main() { out_color = texture(u_input, v_uv); }`;

/* 独立的体积泡泡模型：以轨迹球体构成 3D SDF，在固定深度上 ray march，再用表面法线采样内容纹理。
 * 这与“二维 mask + 偏移采样”是两种不同的结构；参数只表达可见的光学意图，不复用参考实现。 */
const BUBBLE_SHADER = `#version 300 es
precision highp float;
uniform sampler2D u_input;
uniform vec2 u_resolution;
uniform vec2 u_trail[24];
uniform float u_count;
uniform float u_size;
uniform float u_blend;
uniform float u_refraction;
uniform float u_dispersion;
uniform float u_frost;
uniform float u_shine;
uniform float u_rim;
uniform float u_iridescence;
uniform float u_time;
uniform float u_intensity;
uniform vec3 u_color_a;
uniform vec3 u_color_b;
in vec2 v_uv;
out vec4 out_color;
const int STEPS = 14;
const float EPSILON = 0.00035;
vec3 samplePage(vec2 p, float lod) {
  vec2 uv = clamp(vec2(p.x / u_resolution.x, 1.0 - p.y / u_resolution.y), vec2(0.0005), vec2(0.9995));
  return pow(textureLod(u_input, uv, lod).rgb, vec3(2.2));
}
float blendDistance(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / max(k, 0.0001), 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float bubbleField(vec3 p) {
  float d = 100.0;
  float minRes = min(u_resolution.x, u_resolution.y);
  for (int i = 0; i < 24; i++) {
    if (float(i) >= u_count) break;
    float age = float(i) / max(u_count - 1.0, 1.0);
    vec2 center = vec2((u_trail[i].x * 2.0 - u_resolution.x) / minRes, (u_resolution.y - u_trail[i].y * 2.0) / minRes);
    // 主滴保持完整体积，尾端快速收细；停下时 24 个惯性点自然重叠回单一水滴。
    float radius = (u_size * 2.0 / minRes) * mix(1.0, 0.08, age);
    float sphere = length(p - vec3(center, 0.0)) - radius;
    d = blendDistance(d, sphere, max(0.003, radius / max(u_blend, 1.0) * 4.2));
  }
  return d;
}
vec3 surfaceNormal(vec3 p) {
  vec2 e = vec2(EPSILON, 0.0);
  return normalize(vec3(
    bubbleField(p + vec3(e.x, e.y, e.y)) - bubbleField(p - vec3(e.x, e.y, e.y)),
    bubbleField(p + vec3(e.y, e.x, e.y)) - bubbleField(p - vec3(e.y, e.x, e.y)),
    bubbleField(p + vec3(e.y, e.y, e.x)) - bubbleField(p - vec3(e.y, e.y, e.x))
  ));
}
float grain(vec3 p) {
  return fract(sin(dot(p, vec3(17.73, 42.31, 9.17))) * 19341.719);
}
vec3 spectralSheen(vec3 normal, vec3 view) {
  vec3 reflected = reflect(view, normal);
  float n1 = grain(floor(reflected * 6.0 + u_time));
  float n2 = grain(floor(reflected.yzx * 8.0 - u_time * 0.7));
  return mix(u_color_a, u_color_b, n1) * (0.15 + n2 * 0.85);
}
void main() {
  vec2 pixel = vec2(v_uv.x * u_resolution.x, (1.0 - v_uv.y) * u_resolution.y);
  float minRes = min(u_resolution.x, u_resolution.y);
  vec3 ray = vec3((pixel * 2.0 - u_resolution) / minRes, 1.05);
  vec3 view = vec3(0.0, 0.0, -1.0);
  float distance = 0.0;
  for (int i = 0; i < STEPS; i++) {
    distance = bubbleField(ray);
    ray += view * distance;
    if (distance < EPSILON || distance > 3.0) break;
  }
  vec3 base = samplePage(pixel, 0.0);
  float coverage = 1.0 - smoothstep(0.0, 2.0 / minRes, distance);
  if (coverage < 0.001) {
    out_color = vec4(pow(base, vec3(1.0 / 2.2)), 1.0);
    return;
  }
  vec3 normal = surfaceNormal(ray);
  float eta = 1.0 / 1.33;
  float split = u_dispersion * 0.018;
  vec3 rayR = refract(view, normal, eta - split);
  vec3 rayG = refract(view, normal, eta);
  vec3 rayB = refract(view, normal, eta + split);
  float depth = u_refraction;
  vec2 offR = rayR.xy * depth / max(abs(rayR.z), 0.28);
  vec2 offG = rayG.xy * depth / max(abs(rayG.z), 0.28);
  vec2 offB = rayB.xy * depth / max(abs(rayB.z), 0.28);
  float lod = max(u_frost * 5.0, log2(1.0 + length(offG) * 0.045));
  vec3 refracted = vec3(samplePage(pixel + offR, lod).r, samplePage(pixel + offG, lod).g, samplePage(pixel + offB, lod).b);
  float fresnel = pow(1.0 - clamp(normal.z, 0.0, 1.0), 1.45);
  vec3 light = normalize(vec3(-0.48, 0.62, 0.74));
  float specular = pow(max(dot(reflect(-light, normal), -view), 0.0), 52.0);
  vec3 sheen = spectralSheen(normal, view) * u_iridescence * pow(fresnel, 1.55);
  vec3 color = refracted * (1.0 - fresnel * u_rim * 0.30) + sheen + vec3(specular * u_shine);
  out_color = vec4(pow(max(mix(base, color, u_intensity), 0.0), vec3(1.0 / 2.2)), 1.0);
}`;

const MAGNIFY_SHADER = `#version 300 es
precision highp float;
uniform sampler2D u_input;
uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_zoom;
uniform float u_intensity;
uniform float u_chromatic;
in vec2 v_uv;
out vec4 out_color;
vec3 sampleTop(vec2 p) {
  vec2 uv = clamp(vec2(p.x / u_resolution.x, 1.0 - p.y / u_resolution.y), vec2(0.0005), vec2(0.9995));
  return texture(u_input, uv).rgb;
}
void main() {
  vec2 p = vec2(v_uv.x * u_resolution.x, (1.0 - v_uv.y) * u_resolution.y);
  vec2 rel = p - u_center;
  float d = length(rel);
  float edge = max(fwidth(d) * 1.8, 1.0);
  float lens = 1.0 - smoothstep(u_radius - edge, u_radius + edge, d);
  vec2 magnified = u_center + rel / u_zoom;
  vec3 image = sampleTop(p);
  if (u_chromatic > 0.5) {
    vec2 split = normalize(rel + vec2(0.001)) * (1.0 - d / max(u_radius, 1.0)) * 2.2;
    image = vec3(sampleTop(magnified + split).r, sampleTop(magnified).g, sampleTop(magnified - split).b);
  } else {
    image = sampleTop(magnified);
  }
  float ring = smoothstep(4.0, 0.0, abs(d - u_radius));
  float ticks = step(0.965, abs(sin(atan(rel.y, rel.x) * 8.0))) * smoothstep(10.0, 0.0, abs(d - u_radius - 11.0));
  vec3 hud = vec3(0.30, 0.93, 1.0) * (ring * 0.85 + ticks * 0.45);
  out_color = vec4(mix(sampleTop(p), image + hud, lens * u_intensity), 1.0);
}`;

const GLITCH_SHADER = `#version 300 es
precision highp float;
uniform sampler2D u_input;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_seed;
uniform float u_intensity;
uniform float u_shift;
uniform float u_rgbShift;
in vec2 v_uv;
out vec4 out_color;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
vec3 sampleUv(vec2 uv) { return texture(u_input, clamp(uv, vec2(0.0005), vec2(0.9995))).rgb; }
void main() {
  float band = floor(v_uv.y * 46.0);
  float h = hash(vec2(band, floor(u_frame * 0.73) + u_seed));
  float tear = step(0.68, h) * (h - 0.68) * u_shift / u_resolution.x * u_intensity;
  vec2 uv = v_uv + vec2(tear * (hash(vec2(band, 17.0)) > 0.5 ? 1.0 : -1.0), 0.0);
  float split = u_rgbShift / u_resolution.x * u_intensity * (0.5 + h);
  vec3 color = vec3(sampleUv(uv + vec2(split, 0.0)).r, sampleUv(uv).g, sampleUv(uv - vec2(split, 0.0)).b);
  float scan = 0.92 + 0.08 * sin(v_uv.y * u_resolution.y * 1.7 + u_frame);
  float grain = (hash(floor(v_uv * u_resolution) + u_frame + u_seed) - 0.5) * 0.12 * u_intensity;
  out_color = vec4(color * scan + grain, 1.0);
}`;

const TRIANGLES = new Float32Array([
  -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1,
  1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1,
]);

const createProgram = (gl: WebGL2RenderingContext, fragment: string, uniformNames: string[]): Program => {
  const compile = (type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("无法创建 WebGL shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "WebGL shader 编译失败");
    return shader;
  };
  const program = gl.createProgram();
  if (!program) throw new Error("无法创建 WebGL program");
  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const pixel = compile(gl.FRAGMENT_SHADER, fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, pixel);
  gl.bindAttribLocation(program, 0, "a_pos");
  gl.bindAttribLocation(program, 1, "a_uv");
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(pixel);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "WebGL program 链接失败");
  return { program, uniforms: Object.fromEntries(uniformNames.map((name) => [name, gl.getUniformLocation(program, name)])) };
};

const numberOption = (runtime: EffectRuntime, name: string, fallback: number): number => {
  const value = runtime.clip.options?.[name];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

export class GpuCompositor {
  private readonly gl: WebGL2RenderingContext;
  private readonly copy: Program;
  private readonly bubble: Program;
  private readonly magnify: Program;
  private readonly glitch: Program;
  private readonly texture: WebGLTexture;
  private readonly vao: WebGLVertexArrayObject;
  private readonly buffer: WebGLBuffer;
  private sourceReady = false;
  private didLogBubble = false;

  public constructor(canvas: OffscreenCanvas) {
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) throw new Error("WebGL2 不可用；请检查硬件加速");
    this.gl = gl;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    this.copy = createProgram(gl, COPY_SHADER, ["u_input"]);
    this.bubble = createProgram(gl, BUBBLE_SHADER, ["u_input", "u_resolution", "u_trail[0]", "u_count", "u_size", "u_blend", "u_refraction", "u_dispersion", "u_frost", "u_shine", "u_rim", "u_iridescence", "u_time", "u_intensity", "u_color_a", "u_color_b"]);
    this.magnify = createProgram(gl, MAGNIFY_SHADER, ["u_input", "u_resolution", "u_center", "u_radius", "u_zoom", "u_intensity", "u_chromatic"]);
    this.glitch = createProgram(gl, GLITCH_SHADER, ["u_input", "u_resolution", "u_frame", "u_seed", "u_intensity", "u_shift", "u_rgbShift"]);
    const texture = gl.createTexture();
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!texture || !vao || !buffer) throw new Error("无法创建 HTML-in-Canvas GPU 资源");
    this.texture = texture;
    this.vao = vao;
    this.buffer = buffer;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, TRIANGLES, gl.STATIC_DRAW);
    gl.bindVertexArray(vao);
    for (const [location, offset] of [[0, 0], [1, 8]] as const) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 16, offset);
    }
    gl.bindVertexArray(null);
  }

  /** source capture 的唯一入口：只在 HTML 像素真的失效后调用。 */
  public upload(source: OffscreenCanvas): void {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    // CanvasUI 的关键优化同样适用：mipmap 是 source texture 的派生数据，只能在 upload 时生成。
    gl.generateMipmap(gl.TEXTURE_2D);
    this.sourceReady = true;
  }

  /** 时间效果的入口：每帧最多一个全屏 draw，从不隐式上传 source。 */
  public render({ frame, fps, plan, pixelDensity }: GpuCompositorRender): void {
    if (!this.sourceReady) return;
    const { gl } = this;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    const pixelEffect = [...resolveActiveEffects(plan, frame)].reverse().find(({ clip }) => clip.effect === "bubble" || clip.effect === "magnifier" || clip.effect === "glitch");
    if (!pixelEffect) return this.drawCopy();
    if (pixelEffect.clip.effect === "bubble") return this.drawBubble(pixelEffect, frame, plan, pixelDensity, fps);
    if (pixelEffect.clip.effect === "magnifier") return this.drawMagnify(pixelEffect, frame, plan, pixelDensity);
    return this.drawGlitch(pixelEffect, frame);
  }

  public destroy(): void {
    const { gl } = this;
    gl.deleteProgram(this.copy.program);
    gl.deleteProgram(this.bubble.program);
    gl.deleteProgram(this.magnify.program);
    gl.deleteProgram(this.glitch.program);
    gl.deleteTexture(this.texture);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.buffer);
  }

  private drawBubble(effect: EffectRuntime, frame: number, plan: StagePlan, density: number, fps: number): void {
    const pointer = resolvePointer(plan.interaction, frame, plan.targets);
    if (!pointer) return this.drawCopy();
    const { gl } = this;
    const count = Math.max(4, Math.min(24, Math.round(numberOption(effect, "trail", 24))));
    const trail = resolveBubbleTrail(plan, effect, frame, fps, pointer, density);
    const alpha = effect.progress.phase === "exit" ? 1 - effect.progress.exit : effect.progress.enter;
    gl.useProgram(this.bubble.program);
    gl.uniform1i(this.bubble.uniforms.u_input, 0);
    gl.uniform2f(this.bubble.uniforms.u_resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2fv(this.bubble.uniforms["u_trail[0]"], trail);
    gl.uniform1f(this.bubble.uniforms.u_count, count);
    gl.uniform1f(this.bubble.uniforms.u_size, numberOption(effect, "size", 68) * density);
    gl.uniform1f(this.bubble.uniforms.u_blend, numberOption(effect, "blend", 14));
    gl.uniform1f(this.bubble.uniforms.u_refraction, numberOption(effect, "refraction", 80) * density);
    gl.uniform1f(this.bubble.uniforms.u_dispersion, numberOption(effect, "dispersion", 1));
    gl.uniform1f(this.bubble.uniforms.u_frost, numberOption(effect, "frost", 0.08));
    gl.uniform1f(this.bubble.uniforms.u_shine, numberOption(effect, "shine", 0.42));
    gl.uniform1f(this.bubble.uniforms.u_rim, numberOption(effect, "rim", 0.55));
    gl.uniform1f(this.bubble.uniforms.u_iridescence, numberOption(effect, "iridescence", 0.9));
    gl.uniform1f(this.bubble.uniforms.u_time, frame / 30);
    gl.uniform3f(this.bubble.uniforms.u_color_a, 0.22, 0.56, 0.86);
    gl.uniform3f(this.bubble.uniforms.u_color_b, 0.85, 0.34, 0.92);
    gl.uniform1f(this.bubble.uniforms.u_intensity, alpha * (effect.clip.intensity ?? 1));
    this.draw();
    if (!this.didLogBubble) {
      this.didLogBubble = true;
      console.warn("[Recut GpuCompositor] Bubble optical pass active", { frame, count, pixelDensity: density });
    }
  }

  private drawMagnify(effect: EffectRuntime, frame: number, plan: StagePlan, density: number): void {
    const pointer = resolvePointer(plan.interaction, frame, plan.targets);
    if (!pointer) return this.drawCopy();
    const { gl } = this;
    const alpha = effect.progress.phase === "exit" ? 1 - effect.progress.exit : effect.progress.enter;
    gl.useProgram(this.magnify.program);
    gl.uniform1i(this.magnify.uniforms.u_input, 0);
    gl.uniform2f(this.magnify.uniforms.u_resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(this.magnify.uniforms.u_center, pointer.x * density, pointer.y * density);
    gl.uniform1f(this.magnify.uniforms.u_radius, numberOption(effect, "radius", 150) * density);
    gl.uniform1f(this.magnify.uniforms.u_zoom, numberOption(effect, "zoom", 2));
    gl.uniform1f(this.magnify.uniforms.u_intensity, alpha * (effect.clip.intensity ?? 1));
    gl.uniform1f(this.magnify.uniforms.u_chromatic, effect.clip.options?.chromatic ? 1 : 0);
    this.draw();
  }

  private drawGlitch(effect: EffectRuntime, frame: number): void {
    const { gl } = this;
    const alpha = effect.progress.phase === "exit" ? 1 - effect.progress.exit : effect.progress.enter;
    const burst = activeGlitchBurst(effect, frame);
    if (!burst) return this.drawCopy();
    gl.useProgram(this.glitch.program);
    gl.uniform1i(this.glitch.uniforms.u_input, 0);
    gl.uniform2f(this.glitch.uniforms.u_resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(this.glitch.uniforms.u_frame, frame);
    gl.uniform1f(this.glitch.uniforms.u_seed, burst.seed);
    gl.uniform1f(this.glitch.uniforms.u_intensity, alpha * burst.intensity * (effect.clip.intensity ?? 1));
    gl.uniform1f(this.glitch.uniforms.u_shift, numberOption(effect, "shift", 38));
    gl.uniform1f(this.glitch.uniforms.u_rgbShift, numberOption(effect, "rgbShift", 7));
    this.draw();
  }

  private drawCopy(): void {
    const { gl } = this;
    gl.useProgram(this.copy.program);
    gl.uniform1i(this.copy.uniforms.u_input, 0);
    this.draw();
  }

  private draw(): void {
    const { gl } = this;
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }
}

/**
 * CanvasUI 的“水滴感”来自递归的惯性头部，而不是倒回 24 帧直接取路径点。
 * 这里每次由 frame 从 clip 起点重算同一段固定步长状态：可 seek、可并发导出，且无真实时间状态。
 */
const resolveBubbleTrail = (plan: StagePlan, effect: EffectRuntime, frame: number, fps: number, current: { x: number; y: number }, density: number): Float32Array => {
  const start = Math.max(0, effect.clip.timing.startFrame);
  let target = resolvePointer(plan.interaction, start, plan.targets) ?? current;
  let head = { ...target };
  const points = Array.from({ length: 24 }, () => ({ ...head }));
  const follow = Math.min(1, Math.max(0.02, numberOption(effect, "follow", 0.5)));
  const settle = 1 - Math.exp(-(3 + follow * 30) / Math.max(1, fps));
  for (let tick = start + 1; tick <= frame; tick++) {
    target = resolvePointer(plan.interaction, tick, plan.targets) ?? target;
    head = { x: head.x + (target.x - head.x) * settle, y: head.y + (target.y - head.y) * settle };
    for (let index = 23; index > 0; index--) points[index] = points[index - 1];
    points[0] = head;
  }
  const trail = new Float32Array(48);
  for (let index = 0; index < 24; index++) {
    trail[index * 2] = points[index].x * density;
    trail[index * 2 + 1] = points[index].y * density;
  }
  return trail;
};

type GlitchBurst = { startFrame: number; durationFrames: number; seed: number };

/** 没有 burst 表就保留 clip 全程；有表时只有指定帧窗口破坏画面，避免随机噪声持续污染镜头。 */
const activeGlitchBurst = (effect: EffectRuntime, frame: number): { seed: number; intensity: number } | null => {
  const value = effect.clip.options?.bursts;
  if (!Array.isArray(value)) return { seed: 0, intensity: 1 };
  const burst = value.find((entry): entry is GlitchBurst => {
    if (!entry || typeof entry !== "object") return false;
    const candidate = entry as Partial<GlitchBurst>;
    return typeof candidate.startFrame === "number" && typeof candidate.durationFrames === "number" && typeof candidate.seed === "number" && frame >= candidate.startFrame && frame < candidate.startFrame + candidate.durationFrames;
  });
  if (!burst) return null;
  const local = (frame - burst.startFrame) / Math.max(1, burst.durationFrames);
  return { seed: burst.seed, intensity: Math.sin(Math.PI * local) };
};
